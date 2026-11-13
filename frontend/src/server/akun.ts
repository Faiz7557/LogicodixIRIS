/*
 * Pendaftaran akun dan ganti password. Satu desa paling banyak punya satu akun per peran (MPA dan sekdes);
 * nama pengguna dibentuk dari nama desa, jadi pengguna tidak perlu memilihnya sendiri.
 */
import { createHash } from "node:crypto";
import { PERAN_DAFTAR, PERAN_META, cekSandi, usernameBawaan } from "@/lib/akun";
import type { Akun, DesaHit, Peran } from "@/lib/types";
import { auditStatement } from "./audit";
import { hashPassword, toAkun, verifyPassword } from "./auth";
import { db } from "./db";
import { HttpError } from "./http";

/** Hash token sesi seperti yang disimpan di tabel `sesi` (sama dengan auth.ts). */
export const hashTokenSesi = (token: string) => createHash("sha256").update(token).digest("hex");

export type SlotPeran = { peran: Peran; username: string; terdaftar: boolean };
export type KetersediaanAkun = { desa: DesaHit; slot: SlotPeran[] };

async function bacaDesa(kode: string): Promise<DesaHit> {
  const r = await db().execute({ sql: "SELECT kode, nama, kec_nama, kab_nama, prov_nama FROM desa WHERE kode = ?", args: [kode] });
  const d = r.rows[0];
  if (!d) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");
  return { kode: String(d.kode), nama: String(d.nama), kecNama: String(d.kec_nama), kabNama: String(d.kab_nama), provNama: String(d.prov_nama) };
}

/**
 * Nama pengguna untuk peran di desa ini. Bila nama bawaan sudah dipakai desa lain bernama sama,
 * ditambah empat digit akhir kode desa (mis. sekdes-sukamaju-2003).
 */
async function usernameUntuk(peran: Peran, desa: DesaHit): Promise<string> {
  const dasar = usernameBawaan(peran, desa.nama);
  const r = await db().execute({ sql: "SELECT desa_kode FROM akun WHERE username = ?", args: [dasar] });
  if (!r.rows[0] || String(r.rows[0].desa_kode) === desa.kode) return dasar;
  return `${dasar}-${desa.kode.slice(-4)}`;
}

/** Peran mana yang masih bisa didaftarkan untuk desa ini, beserta nama penggunanya. */
export async function ketersediaanAkun(kode: string): Promise<KetersediaanAkun> {
  const desa = await bacaDesa(kode);
  const ada = await db().execute({ sql: "SELECT peran FROM akun WHERE desa_kode = ?", args: [kode] });
  const terpakai = new Set(ada.rows.map((r) => String(r.peran)));
  const slot = await Promise.all(
    PERAN_DAFTAR.map(async (peran) => ({ peran, username: await usernameUntuk(peran, desa), terdaftar: terpakai.has(peran) })),
  );
  return { desa, slot };
}

/** Membuat akun baru (bukan akun demo). Gagal 409 bila desa ini sudah punya akun untuk peran tersebut. */
export async function daftarAkun(kode: string, peran: Peran, sandi: string): Promise<Akun> {
  const galat = cekSandi(sandi);
  if (galat) throw new HttpError(400, "input_tidak_sah", galat);
  const { desa, slot } = await ketersediaanAkun(kode);
  const s = slot.find((x) => x.peran === peran)!;
  if (s.terdaftar) {
    throw new HttpError(409, "akun_sudah_ada", `Desa ${desa.nama} sudah punya akun ${PERAN_META[peran].label.toLowerCase()}. Masuk dengan akun itu.`);
  }
  const tx = await db().transaction("write");
  try {
    // Diperiksa lagi di dalam transaksi supaya dua pendaftaran bersamaan tidak sama-sama lolos.
    const lagi = await tx.execute({ sql: "SELECT 1 FROM akun WHERE desa_kode = ? AND peran = ?", args: [kode, peran] });
    if (lagi.rows.length > 0) throw new HttpError(409, "akun_sudah_ada", `Desa ${desa.nama} sudah punya akun ${PERAN_META[peran].label.toLowerCase()}.`);
    const r = await tx.execute({
      sql: `INSERT INTO akun (username, pass_hash, peran, desa_kode, nama_tampil, is_demo) VALUES (?,?,?,?,?,0)
            RETURNING id, username, peran, desa_kode, nama_tampil, is_demo`,
      args: [s.username, hashPassword(sandi), peran, kode, PERAN_META[peran].namaTampil(desa.nama)],
    });
    const akun = toAkun(r.rows[0]);
    await tx.execute(auditStatement(akun.id, kode, "daftar_akun", { peran, username: akun.username }));
    await tx.commit();
    return akun;
  } catch (e) {
    await tx.rollback();
    if (e instanceof Error && /UNIQUE constraint failed: akun\.username/.test(e.message)) {
      throw new HttpError(409, "akun_sudah_ada", "Nama pengguna ini baru saja dipakai. Coba lagi.");
    }
    throw e;
  } finally {
    tx.close();
  }
}

/**
 * Ganti password: password lama wajib benar. Sesi lain milik akun ini diakhiri,
 * sesi yang sedang dipakai (`tokenHashSekarang`) tetap masuk.
 */
export async function gantiSandi(akun: Akun, lama: string, baru: string, tokenHashSekarang: string): Promise<void> {
  const galat = cekSandi(baru);
  if (galat) throw new HttpError(400, "input_tidak_sah", galat);
  if (lama === baru) throw new HttpError(400, "input_tidak_sah", "Password baru harus berbeda dari password lama.");
  const r = await db().execute({ sql: "SELECT pass_hash FROM akun WHERE id = ?", args: [akun.id] });
  if (!r.rows[0] || !verifyPassword(lama, String(r.rows[0].pass_hash))) {
    throw new HttpError(400, "sandi_salah", "Password lama tidak cocok.");
  }
  await db().batch(
    [
      { sql: "UPDATE akun SET pass_hash = ? WHERE id = ?", args: [hashPassword(baru), akun.id] },
      { sql: "DELETE FROM sesi WHERE akun_id = ? AND token_hash <> ?", args: [akun.id, tokenHashSekarang] },
      auditStatement(akun.id, akun.desaKode, "ganti_sandi", null),
    ],
    "write",
  );
}
