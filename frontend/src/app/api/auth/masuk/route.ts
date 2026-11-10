import { z } from "zod";
import { assertOrigin, cookieSesi, createSession, hitRateLimit, ipDari, toAkun, verifyPassword } from "@/server/auth";
import { db } from "@/server/db";
import { HttpError, handle } from "@/server/http";

const SALAH = "Username atau password salah.";
const schema = z.object({
  username: z.string(SALAH).trim().min(1, SALAH).max(64, SALAH),
  password: z.string(SALAH).min(1, SALAH).max(256, SALAH),
});
// Dipakai saat username tidak ada, supaya waktu balas tidak membocorkan username yang terdaftar.
const HASH_SEMU = "scrypt$00000000000000000000000000000000$" + "0".repeat(128);

export const POST = handle(async (req) => {
  assertOrigin(req);
  const { username, password } = schema.parse(await req.json().catch(() => null));
  const ip = ipDari(req);
  if (!(await hitRateLimit(`masuk:${username.toLowerCase()}|${ip}`, 10, 15))) {
    throw new HttpError(429, "terlalu_banyak", "Coba lagi dalam 15 menit.", { "Retry-After": "900" });
  }

  const r = await db().execute({
    sql: "SELECT id, username, pass_hash, peran, desa_kode, nama_tampil, is_demo FROM akun WHERE username = ?",
    args: [username],
  });
  const row = r.rows[0];
  const cocok = verifyPassword(password, row ? String(row.pass_hash) : HASH_SEMU);
  if (!row || !cocok) throw new HttpError(401, "kredensial_salah", SALAH);

  const akun = toAkun(row);
  const token = await createSession(akun.id);
  return Response.json({ akun }, { headers: { "Set-Cookie": cookieSesi(token) } });
});
