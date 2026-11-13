// Membuat atau memperbarui akun per desa (akun biasa, bukan demo): mpa-<namadesa> (ketua MPA) dan sekdes-<namadesa> (sekdes).
// Jalankan dari frontend/:
//   AKUN_PASSWORD=... npx tsx scripts/seed-akun-desa.ts [--jumlah 10] [--desa kode1,kode2]
// Tanpa --desa: desa yang sudah punya akun didahulukan, sisanya desa berpaparan tertinggi.
// Nama pengguna: huruf kecil tanpa spasi atau tanda baca ("Kali Bandung" -> sekdes-kalibandung).
// Password dari env AKUN_PASSWORD dan tidak pernah dicetak.
import { existsSync } from "node:fs";
import { slugDesa } from "../src/lib/akun";
import { hashPassword } from "../src/server/auth";
import { db } from "../src/server/db";

function gagal(pesan: string): never {
  console.error(pesan);
  process.exit(1);
}

const arg = (nama: string) => {
  const i = process.argv.indexOf(nama);
  return i >= 0 ? process.argv[i + 1] : undefined;
};

async function main() {
  if (existsSync(".env")) process.loadEnvFile(".env");
  const password = process.env.AKUN_PASSWORD ?? "";
  if (password.length < 8) gagal("AKUN_PASSWORD kosong atau kurang dari 8 karakter.");
  const jumlah = Number(arg("--jumlah") ?? 10);

  let kode = (arg("--desa") ?? "").split(",").filter(Boolean);
  if (kode.length === 0) {
    const r = await db().execute({
      sql: `SELECT d.kode FROM desa d
            LEFT JOIN desa_paparan p ON p.kode = d.kode AND p.mode = 'frozen'
            ORDER BY EXISTS (SELECT 1 FROM akun a WHERE a.desa_kode = d.kode) DESC, p.skor DESC, d.kode
            LIMIT ?`,
      args: [jumlah * 3],
    });
    kode = r.rows.map((x) => String(x.kode));
  }

  const terpakai = new Set<string>();
  const pilih: { kode: string; nama: string; slug: string }[] = [];
  for (const k of kode) {
    if (pilih.length >= jumlah) break;
    const r = await db().execute({ sql: "SELECT nama FROM desa WHERE kode = ?", args: [k] });
    if (!r.rows[0]) gagal(`Desa dengan kode ${k} tidak ada di DB.`);
    const nama = String(r.rows[0].nama);
    const slug = slugDesa(nama);
    // Nama desa kembar di provinsi lain dilewati supaya satu nama pengguna = satu desa.
    if (!slug || terpakai.has(slug)) continue;
    const bentrok = await db().execute({
      sql: "SELECT desa_kode FROM akun WHERE username IN (?, ?) AND desa_kode <> ?",
      args: [`mpa-${slug}`, `sekdes-${slug}`, k],
    });
    if (bentrok.rows.length > 0) continue;
    terpakai.add(slug);
    pilih.push({ kode: k, nama, slug });
  }
  if (pilih.length === 0) gagal("Tidak ada desa yang bisa diberi akun.");

  const hash = hashPassword(password);
  const akun = pilih.flatMap((d) => [
    { username: `mpa-${d.slug}`, peran: "mpa", namaTampil: `Ketua MPA ${d.nama}`, kode: d.kode },
    { username: `sekdes-${d.slug}`, peran: "desa", namaTampil: `Sekdes ${d.nama}`, kode: d.kode },
  ]);
  await db().batch(
    akun.flatMap((a) => [
      {
        sql: `INSERT INTO akun (username, pass_hash, peran, desa_kode, nama_tampil, is_demo) VALUES (?,?,?,?,?,0)
              ON CONFLICT (username) DO UPDATE SET pass_hash = excluded.pass_hash, peran = excluded.peran,
                desa_kode = excluded.desa_kode, nama_tampil = excluded.nama_tampil, is_demo = 0`,
        args: [a.username, hash, a.peran, a.kode, a.namaTampil],
      },
      // Sesi lama tidak boleh bertahan setelah password atau desa berganti.
      { sql: "DELETE FROM sesi WHERE akun_id = (SELECT id FROM akun WHERE username = ?)", args: [a.username] },
    ]),
    "write",
  );
  for (const d of pilih) console.log(`${d.kode}  ${d.nama.padEnd(24)} mpa-${d.slug} / sekdes-${d.slug}`);
}

main().catch((e) => gagal(e instanceof Error ? e.message : String(e)));
