// Membuat atau memperbarui akun demo satu desa. Jalankan dari frontend/:
//   npx tsx scripts/seed-accounts.ts --desa <kode>
// Password dari env DEMO_PASSWORD (atau frontend/.env). Password tidak pernah dicetak.
import { existsSync } from "node:fs";
import { hashPassword } from "../src/server/auth";
import { db } from "../src/server/db";

function gagal(pesan: string): never {
  console.error(pesan);
  process.exit(1);
}

async function main() {
  if (existsSync(".env")) process.loadEnvFile(".env"); // tidak menimpa env yang sudah diset
  const i = process.argv.indexOf("--desa");
  let kode = i >= 0 ? process.argv[i + 1] : undefined;
  if (!kode) {
    // Tanpa --desa: pertahankan desa akun demo yang ada, atau pilih desa pertama di DB (data uji maupun data nyata).
    const lama = await db().execute("SELECT desa_kode FROM akun WHERE username = 'demo-mpa'");
    const pertama = await db().execute("SELECT kode FROM desa ORDER BY kode LIMIT 1");
    kode = String(lama.rows[0]?.desa_kode ?? pertama.rows[0]?.kode ?? "");
    if (!kode) gagal("DB tidak memuat desa. Jalankan pipeline atau make db lebih dulu.");
    console.log(`--desa tidak diisi, memakai ${kode}.`);
  }
  const password = process.env.DEMO_PASSWORD ?? "";
  if (!password) gagal("DEMO_PASSWORD kosong. Isi di env atau frontend/.env.");

  const desa = await db().execute({ sql: "SELECT nama FROM desa WHERE kode = ?", args: [kode] });
  if (!desa.rows[0]) gagal(`Desa dengan kode ${kode} tidak ada di DB.`);
  const nama = String(desa.rows[0].nama);

  const akun = [
    { username: "demo-mpa", peran: "mpa", namaTampil: `Ketua MPA ${nama}` },
    { username: "demo-sekdes", peran: "desa", namaTampil: `Sekdes ${nama}` },
  ];
  await db().batch(
    akun.flatMap((a) => [
      {
        sql: `INSERT INTO akun (username, pass_hash, peran, desa_kode, nama_tampil, is_demo) VALUES (?,?,?,?,?,1)
              ON CONFLICT (username) DO UPDATE SET pass_hash = excluded.pass_hash, peran = excluded.peran,
                desa_kode = excluded.desa_kode, nama_tampil = excluded.nama_tampil, is_demo = 1`,
        args: [a.username, hashPassword(password), a.peran, kode, a.namaTampil],
      },
      // Sesi lama tidak boleh bertahan setelah password atau desa berganti.
      { sql: "DELETE FROM sesi WHERE akun_id = (SELECT id FROM akun WHERE username = ?)", args: [a.username] },
    ]),
    "write",
  );
  for (const a of akun) console.log(`${a.username} (${a.peran}) siap untuk desa ${kode}.`);
}

main().catch((e) => gagal(e instanceof Error ? e.message : String(e)));
