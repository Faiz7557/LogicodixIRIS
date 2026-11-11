import { describe, expect, it } from "vitest";
import { POST as masuk } from "@/app/api/auth/masuk/route";
import { useTestDb } from "@/test/testDb";
import { writeAudit } from "./audit";
import {
  COOKIE_SESI, assertOrigin, createSession, getAkun, hashPassword, hitRateLimit, ipDari, requireDesaAccess, verifyPassword,
} from "./auth";
import { db } from "./db";

const URL_UJI = "http://localhost/x";

async function reqAkun(akunId: number): Promise<Request> {
  const token = await createSession(akunId);
  return new Request(URL_UJI, { headers: { cookie: `${COOKIE_SESI}=${token}` } });
}

function reqMasuk(username: string, password: string): Request {
  return new Request("http://localhost/api/auth/masuk", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost" },
    body: JSON.stringify({ username, password }),
  });
}

describe("auth", () => {
  useTestDb();

  it("hash bisa diverifikasi", () => { expect(verifyPassword("x", hashPassword("x"))).toBe(true); });
  it("password salah ditolak", () => { expect(verifyPassword("y", hashPassword("x"))).toBe(false); });
  it("akun desa lain 403", async () => {
    await expect(requireDesaAccess(await reqAkun(2), "DESA_B", ["desa"])).rejects.toMatchObject({ status: 403 });
  });
  it("peran mpa tidak bisa aksi desa", async () => {
    await expect(requireDesaAccess(await reqAkun(3), "DESA_A", ["desa"])).rejects.toMatchObject({ status: 403 });
  });
  it("tanpa sesi 401", async () => {
    await expect(requireDesaAccess(new Request(URL_UJI), "DESA_A", ["desa"])).rejects.toMatchObject({ status: 401 });
  });
  it("sesi kedaluwarsa ditolak", async () => {
    const req = await reqAkun(2);
    await db().execute("update sesi set expires_at = '2020-01-01T00:00:00.000Z'");
    expect(await getAkun(req)).toBeNull();
  });
  it("percobaan ke-11 diblokir", async () => {
    for (let i = 0; i < 10; i++) await hitRateLimit("k", 10, 15);
    expect(await hitRateLimit("k", 10, 15)).toBe(false);
  });
  it("origin asing ditolak", () => {
    const req = new Request(URL_UJI, { method: "POST", headers: { origin: "https://jahat.example" } });
    expect(() => assertOrigin(req)).toThrow();
  });

  it("ipDari hanya memakai header proxy saat TRUST_PROXY=1", () => {
    const req = new Request(URL_UJI, { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } });
    const lama = process.env.TRUST_PROXY;
    delete process.env.TRUST_PROXY;
    expect(ipDari(req)).toBe("lokal");
    process.env.TRUST_PROXY = "1";
    expect(ipDari(req)).toBe("203.0.113.9");
    if (lama) process.env.TRUST_PROXY = lama;
    else delete process.env.TRUST_PROXY;
  });

  it("membersihkan jendela rate limit lama", async () => {
    await db().execute({
      sql: "INSERT INTO rate_limit (kunci, jendela, jumlah) VALUES (?,?,1)",
      args: ["lama", "2000-01-01T00:00:00.000Z"],
    });
    await hitRateLimit("baru", 10, 15);
    const r = await db().execute("SELECT COUNT(*) AS n FROM rate_limit WHERE kunci = 'lama'");
    expect(Number(r.rows[0].n)).toBe(0);
  });

  it("cookie mock-peran tidak memberi akses", async () => {
    const req = new Request(URL_UJI, { headers: { cookie: "mock-peran=desa" } });
    await expect(requireDesaAccess(req, "DESA_A", ["desa"])).rejects.toMatchObject({ status: 401 });
  });
  it("audit tersimpan", async () => {
    await writeAudit(1, "DESA_A", "uji", { a: 1 });
    const r = await db().execute("select count(*) as n from audit_log where desa_kode = 'DESA_A'");
    expect(Number(r.rows[0].n)).toBe(1);
  });

  it("sesi sah memberi akses desa sendiri", async () => {
    expect(await requireDesaAccess(await reqAkun(2), "DESA_A", ["desa"])).toMatchObject({ id: 2, desaKode: "DESA_A" });
  });

  describe("POST /api/auth/masuk", () => {
    const buatAkun = () =>
      db().execute({
        sql: "insert into akun (id, username, pass_hash, peran, desa_kode, nama_tampil, is_demo) values (9, 'uji-masuk', ?, 'desa', 'DESA_A', 'Uji Masuk', 1)",
        args: [hashPassword("rahasia-uji")],
      });

    it("berhasil memasang cookie sesi", async () => {
      await buatAkun();
      const res = await masuk(reqMasuk("uji-masuk", "rahasia-uji"), {});
      expect(res.status).toBe(200);
      const cookie = res.headers.get("set-cookie") ?? "";
      expect(cookie).toContain(`${COOKIE_SESI}=`);
      expect(cookie).toContain("HttpOnly");
      expect(await res.json()).toMatchObject({ akun: { id: 9, desaKode: "DESA_A", isDemo: true } });
      const token = cookie.split(";")[0].split("=")[1];
      const req = new Request(URL_UJI, { headers: { cookie: `${COOKIE_SESI}=${token}` } });
      expect(await getAkun(req)).toMatchObject({ id: 9 });
    });
    it("password salah 401", async () => {
      await buatAkun();
      const res = await masuk(reqMasuk("uji-masuk", "salah"), {});
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: { kode: "kredensial_salah", pesan: "Username atau password salah." } });
    });
    it("percobaan ke-11 429", async () => {
      await buatAkun();
      for (let i = 0; i < 10; i++) await masuk(reqMasuk("uji-masuk", "salah"), {});
      const res = await masuk(reqMasuk("uji-masuk", "rahasia-uji"), {});
      expect(res.status).toBe(429);
      expect(res.headers.get("retry-after")).toBe("900");
      expect(await res.json()).toEqual({ error: { kode: "terlalu_banyak", pesan: "Coba lagi dalam 15 menit." } });
    });
  });
});
