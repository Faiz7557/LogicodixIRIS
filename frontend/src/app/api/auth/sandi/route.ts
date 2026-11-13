import { z } from "zod";
import { SANDI_MAKS } from "@/lib/akun";
import { gantiSandi, hashTokenSesi } from "@/server/akun";
import { assertOrigin, getAkun, hitRateLimit, tokenDari } from "@/server/auth";
import { HttpError, handle } from "@/server/http";

const schema = z.object({
  lama: z.string("Isi password lama.").min(1, "Isi password lama.").max(256, "Password lama tidak cocok."),
  baru: z.string("Isi password baru.").max(SANDI_MAKS, `Password maksimal ${SANDI_MAKS} karakter.`),
});

// POST /api/auth/sandi : ganti password akun yang sedang masuk. Sesi lain akun ini diakhiri.
export const POST = handle(async (req) => {
  assertOrigin(req);
  const akun = await getAkun(req);
  if (!akun) throw new HttpError(401, "belum_masuk", "Masuk dulu untuk mengganti password.");
  if (!(await hitRateLimit(`sandi:${akun.id}`, 5, 15))) {
    throw new HttpError(429, "terlalu_banyak", "Terlalu banyak percobaan. Coba lagi dalam 15 menit.", { "Retry-After": "900" });
  }
  const { lama, baru } = schema.parse(await req.json().catch(() => null));
  await gantiSandi(akun, lama, baru, hashTokenSesi(tokenDari(req)!));
  return Response.json({ ok: true });
});
