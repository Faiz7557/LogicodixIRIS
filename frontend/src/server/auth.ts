import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Row } from "@libsql/client";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import type { Akun, Peran } from "@/lib/types";
import { db } from "./db";
import { HttpError } from "./http";

/* Sesi dan otorisasi (TRD §9). Token mentah hanya ada di cookie; DB menyimpan SHA-256-nya. */

export const COOKIE_SESI = "sk_sesi";
export const UMUR_SESI_DETIK = 7 * 24 * 60 * 60;

const PANJANG_KUNCI = 64;

/** Format `scrypt$<salt hex>$<hash hex>`, salt 16 byte acak per akun. */
export function hashPassword(p: string): string {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString("hex")}$${scryptSync(p, salt, PANJANG_KUNCI).toString("hex")}`;
}

export function verifyPassword(p: string, h: string): boolean {
  const [alg, saltHex, hashHex] = h.split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const harap = Buffer.from(hashHex, "hex");
  if (harap.length !== PANJANG_KUNCI) return false;
  return timingSafeEqual(scryptSync(p, Buffer.from(saltHex, "hex"), PANJANG_KUNCI), harap);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export async function createSession(akunId: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + UMUR_SESI_DETIK * 1000).toISOString();
  await db().execute({ sql: "INSERT INTO sesi (token_hash, akun_id, expires_at) VALUES (?,?,?)", args: [sha256(token), akunId, expires] });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await db().execute({ sql: "DELETE FROM sesi WHERE token_hash = ?", args: [sha256(token)] });
}

export function toAkun(r: Row): Akun {
  return {
    id: Number(r.id),
    username: String(r.username),
    peran: r.peran as Peran,
    desaKode: String(r.desa_kode),
    namaTampil: String(r.nama_tampil),
    isDemo: Number(r.is_demo) === 1,
  };
}

async function akunDariToken(token: string | undefined): Promise<Akun | null> {
  if (!token) return null;
  const r = await db().execute({
    sql: `SELECT a.id, a.username, a.peran, a.desa_kode, a.nama_tampil, a.is_demo
          FROM sesi s JOIN akun a ON a.id = s.akun_id
          WHERE s.token_hash = ? AND s.expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
    // Waktu "sekarang" dari DB (format ISO UTC yang sama dengan expires_at), bukan new Date():
    // Next 16 menolak nilai waktu saat prerender halaman yang membaca sesi.
    args: [sha256(token)],
  });
  return r.rows[0] ? toAkun(r.rows[0]) : null;
}

/** Nilai cookie dari header `Cookie` mentah (route handler dan tes). */
export function tokenDari(req: Request): string | undefined {
  for (const bagian of (req.headers.get("cookie") ?? "").split(";")) {
    const i = bagian.indexOf("=");
    if (i > 0 && bagian.slice(0, i).trim() === COOKIE_SESI) return bagian.slice(i + 1).trim() || undefined;
  }
  return undefined;
}

export function getAkun(req: Request): Promise<Akun | null> {
  return akunDariToken(tokenDari(req));
}

export async function requireDesaAccess(req: Request, kode: string, peran: Peran[]): Promise<Akun> {
  const akun = await getAkun(req);
  if (!akun) throw new HttpError(401, "belum_masuk", "Masuk dulu untuk membuka halaman ini.");
  if (akun.desaKode !== kode || !peran.includes(akun.peran)) {
    throw new HttpError(403, "tidak_berhak", "Akun ini tidak berhak atas aksi ini.");
  }
  return akun;
}

/** CSRF: metode tulis wajib membawa `Origin` yang sama dengan host permintaan. */
export function assertOrigin(req: Request): void {
  if (req.method === "GET" || req.method === "HEAD") return;
  const origin = req.headers.get("origin");
  const host = req.headers.get("host") ?? new URL(req.url).host;
  let cocok = false;
  try {
    cocok = !!origin && new URL(origin).host === host;
  } catch {
    cocok = false;
  }
  if (!cocok) throw new HttpError(403, "origin_ditolak", "Permintaan dari asal yang tidak dikenal ditolak.");
}

/** Jendela tetap: `true` bila percobaan ini masih dalam batas. */
export async function hitRateLimit(kunci: string, batas: number, menit: number): Promise<boolean> {
  const ms = menit * 60_000;
  const jendela = new Date(Math.floor(Date.now() / ms) * ms).toISOString();
  const r = await db().execute({
    sql: `INSERT INTO rate_limit (kunci, jendela, jumlah) VALUES (?,?,1)
          ON CONFLICT (kunci, jendela) DO UPDATE SET jumlah = jumlah + 1
          RETURNING jumlah`,
    args: [kunci, jendela],
  });
  return Number(r.rows[0].jumlah) <= batas;
}

/** Server Component: akun dari cookie sesi. Dibaca sekali per render. */
export const getSesiAkun = cache(async (): Promise<Akun | null> => akunDariToken((await cookies()).get(COOKIE_SESI)?.value));

/** Halaman berakun: tanpa sesi ke `/masuk`; desa lain atau peran tak cocok 404. */
export async function requireHalamanDesa(kode: string, peran: Peran[]): Promise<Akun> {
  const akun = await getSesiAkun();
  if (!akun) redirect("/masuk");
  if (akun.desaKode !== kode || !peran.includes(akun.peran)) notFound();
  return akun;
}

export function cookieSesi(token: string, maxAge = UMUR_SESI_DETIK): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_SESI}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
