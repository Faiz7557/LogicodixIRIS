import { z } from "zod";
import { SANDI_MAKS } from "@/lib/akun";
import { daftarAkun, ketersediaanAkun } from "@/server/akun";
import { assertOrigin, cookieSesi, createSession, hitRateLimit, ipDari } from "@/server/auth";
import { HttpError, handle } from "@/server/http";

const kodeDesa = z.string("Pilih desa dulu.").trim().min(1, "Pilih desa dulu.").max(20, "Kode desa tidak sah.");

// GET /api/auth/daftar?kode= : peran yang masih bisa didaftarkan di desa ini dan nama penggunanya.
export const GET = handle(async (req) => {
  if (!(await hitRateLimit(`daftar-cek:${ipDari(req)}`, 60, 1))) {
    throw new HttpError(429, "terlalu_banyak", "Terlalu banyak permintaan. Coba lagi sebentar.", { "Retry-After": "60" });
  }
  const kode = kodeDesa.parse(new URL(req.url).searchParams.get("kode") ?? "");
  return Response.json(await ketersediaanAkun(kode));
});

const schema = z.object({
  kode: kodeDesa,
  peran: z.enum(["mpa", "desa"], "Pilih peran: ketua MPA atau sekdes."),
  password: z.string("Isi password.").max(SANDI_MAKS, `Password maksimal ${SANDI_MAKS} karakter.`),
});

// POST /api/auth/daftar : membuat akun lalu langsung masuk (cookie sesi).
export const POST = handle(async (req) => {
  assertOrigin(req);
  if (!(await hitRateLimit(`daftar:${ipDari(req)}`, 5, 15))) {
    throw new HttpError(429, "terlalu_banyak", "Terlalu banyak pendaftaran. Coba lagi dalam 15 menit.", { "Retry-After": "900" });
  }
  const { kode, peran, password } = schema.parse(await req.json().catch(() => null));
  const akun = await daftarAkun(kode, peran, password);
  const token = await createSession(akun.id);
  return Response.json({ akun }, { status: 201, headers: { "Set-Cookie": cookieSesi(token) } });
});
