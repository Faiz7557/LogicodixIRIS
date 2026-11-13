import { describe, expect, it } from "vitest";
import { POST as daftarPost } from "@/app/api/auth/daftar/route";
import { POST as sandiPost } from "@/app/api/auth/sandi/route";
import { slugDesa, usernameBawaan } from "@/lib/akun";
import { useTestDb } from "@/test/testDb";
import { daftarAkun, gantiSandi, hashTokenSesi, ketersediaanAkun } from "./akun";
import { COOKIE_SESI, createSession, getAkun, verifyPassword } from "./auth";
import { db } from "./db";

const post = (url: string, body: unknown, cookie?: string) =>
  new Request(`http://localhost${url}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });

describe("nama pengguna", () => {
  it("dibentuk dari nama desa tanpa spasi dan tanpa kata Desa", () => {
    expect(slugDesa("Kali Bandung")).toBe("kalibandung");
    expect(slugDesa("Desa Uji B")).toBe("ujib");
    expect(usernameBawaan("desa", "Kali Bandung")).toBe("sekdes-kalibandung");
    expect(usernameBawaan("mpa", "Kali Bandung")).toBe("mpa-kalibandung");
  });
});

describe("daftar akun dan ganti password", () => {
  useTestDb();

  it("menandai peran yang sudah punya akun", async () => {
    const k = await ketersediaanAkun("DESA_B");
    expect(k.slot).toEqual([
      { peran: "desa", username: "sekdes-ujib", terdaftar: true },
      { peran: "mpa", username: "mpa-ujib", terdaftar: false },
    ]);
  });

  it("membuat akun MPA, langsung masuk, dan bisa masuk dengan passwordnya", async () => {
    const res = await daftarPost(post("/api/auth/daftar", { kode: "DESA_B", peran: "mpa", password: "rahasia123" }), {});
    expect(res.status).toBe(201);
    const { akun } = await res.json();
    expect(akun).toMatchObject({ username: "mpa-ujib", peran: "mpa", desaKode: "DESA_B", isDemo: false });
    const cookie = res.headers.get("set-cookie")!.split(";")[0];
    expect(await getAkun(new Request("http://localhost/x", { headers: { cookie } }))).toMatchObject({ id: akun.id });
    const r = await db().execute({ sql: "SELECT pass_hash FROM akun WHERE id = ?", args: [akun.id] });
    expect(verifyPassword("rahasia123", String(r.rows[0].pass_hash))).toBe(true);
  });

  it("menolak peran yang sudah terisi, password pendek, dan desa yang tidak ada", async () => {
    await expect(daftarAkun("DESA_B", "desa", "rahasia123")).rejects.toMatchObject({ status: 409 });
    await expect(daftarAkun("DESA_B", "mpa", "1234567")).rejects.toMatchObject({ status: 400 });
    await expect(daftarAkun("TIDAK_ADA", "mpa", "rahasia123")).rejects.toMatchObject({ status: 404 });
  });

  it("ganti password: lama wajib cocok, sesi lain berakhir, sesi ini tetap", async () => {
    const akun = await daftarAkun("DESA_B", "mpa", "rahasia123");
    const ini = await createSession(akun.id);
    const lain = await createSession(akun.id);
    await expect(gantiSandi(akun, "salah-salah", "baru12345", hashTokenSesi(ini))).rejects.toMatchObject({ status: 400 });

    const res = await sandiPost(post("/api/auth/sandi", { lama: "rahasia123", baru: "baru12345" }, `${COOKIE_SESI}=${ini}`), {});
    expect(res.status).toBe(200);
    const r = await db().execute({ sql: "SELECT pass_hash FROM akun WHERE id = ?", args: [akun.id] });
    expect(verifyPassword("baru12345", String(r.rows[0].pass_hash))).toBe(true);
    expect(await getAkun(new Request("http://localhost/x", { headers: { cookie: `${COOKIE_SESI}=${ini}` } }))).not.toBeNull();
    expect(await getAkun(new Request("http://localhost/x", { headers: { cookie: `${COOKIE_SESI}=${lain}` } }))).toBeNull();
  });

  it("ganti password tanpa masuk ditolak 401", async () => {
    const res = await sandiPost(post("/api/auth/sandi", { lama: "a", baru: "baru12345" }), {});
    expect(res.status).toBe(401);
  });
});
