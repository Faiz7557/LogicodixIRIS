import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_SESI, createSession } from "@/server/auth";
import { kosongkanCacheRingkasan } from "@/server/ringkasan";
import { useTestDb } from "@/test/testDb";
import { POST } from "./route";

const KODE_UJI = "DESA_A";
const KODE_LAIN = "DESA_B";
const AKUN_DESA = 2; // uji-desa-a, peran desa, DESA_A
const AKUN_MPA = 3; // uji-mpa-a, peran mpa, DESA_A

async function req(badan: unknown, akunId?: number, origin = "http://localhost"): Promise<Request> {
  const headers: Record<string, string> = { "content-type": "application/json", origin };
  if (akunId) headers.cookie = `${COOKIE_SESI}=${await createSession(akunId)}`;
  return new Request("http://localhost/api/ringkasan", { method: "POST", headers, body: JSON.stringify(badan) });
}
const kirim = async (badan: unknown, akunId?: number, origin?: string) => POST(await req(badan, akunId, origin), {} as never);

describe("POST /api/ringkasan", () => {
  useTestDb();
  beforeEach(() => {
    kosongkanCacheRingkasan();
    vi.stubEnv("OPENAI_API_KEY", "");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("paparan publik 200 dengan sumber template tanpa kunci", async () => {
    const res = await kirim({ halaman: "paparan", kode: KODE_UJI });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ sumber: "template", model: null, butir: expect.any(Array) });
  });
  it("timemachine publik tanpa kode 200", async () => {
    expect((await kirim({ halaman: "timemachine" })).status).toBe(200);
  });
  it("halaman tak dikenal 400", async () => {
    expect((await kirim({ halaman: "rahasia" })).status).toBe(400);
  });
  it("badan bukan JSON 400", async () => {
    const r = new Request("http://localhost/api/ringkasan", { method: "POST", headers: { origin: "http://localhost" }, body: "x" });
    expect((await POST(r, {} as never)).status).toBe(400);
  });
  it("kesiapan tanpa sesi 401", async () => {
    expect((await kirim({ halaman: "kesiapan", kode: KODE_UJI })).status).toBe(401);
  });
  it("kesiapan dengan akun mpa desa sendiri 200", async () => {
    expect((await kirim({ halaman: "kesiapan", kode: KODE_UJI }, AKUN_MPA)).status).toBe(200);
  });
  it("ringkasan prioritas menolak peran mpa", async () => {
    expect((await kirim({ halaman: "prioritas", kode: KODE_UJI }, AKUN_MPA)).status).toBe(403);
  });
  it("prioritas dengan akun desa sendiri 200", async () => {
    expect((await kirim({ halaman: "prioritas", kode: KODE_UJI }, AKUN_DESA)).status).toBe(200);
  });
  it("ringkasan desa lain ditolak tanpa memanggil OpenAI", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    const res = await kirim({ halaman: "kesiapan", kode: KODE_LAIN }, AKUN_DESA);
    expect(res.status).toBe(403);
    expect(f).not.toHaveBeenCalled();
  });
  it("desa tak dikenal 404", async () => {
    expect((await kirim({ halaman: "paparan", kode: "TIDAK_ADA" })).status).toBe(404);
  });
  it("permintaan ke-21 dari IP yang sama 429 dengan Retry-After", async () => {
    for (let i = 0; i < 20; i++) expect((await kirim({ halaman: "timemachine" })).status).toBe(200);
    const res = await kirim({ halaman: "timemachine" });
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("3600");
  });
  it("Origin asing ditolak", async () => {
    expect((await kirim({ halaman: "timemachine" }, undefined, "https://jahat.example")).status).toBe(403);
  });
});
