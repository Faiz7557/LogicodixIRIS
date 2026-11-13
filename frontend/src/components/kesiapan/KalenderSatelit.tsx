import Link from "next/link";
import { formatAngka } from "@/lib/format";
import { NAMA_BULAN, NAMA_BULAN_PENDEK } from "@/lib/satelitBulanan";
import type { DesaPaparan, DesaTahun } from "@/lib/types";
import { PilihTampilanSatelit } from "./PilihTampilanSatelit";
import { TINGKAT, tingkat, type TahunSatelit } from "./skalaSatelit";

/*
 * Pengganti kalender "batas aman pemesanan" Sparekit: hari ada titik api di desa per bulan, 15 tahun × 12 bulan.
 * Baris = bulan, kolom = tahun, sehingga musim kebakaran terlihat sebagai pita mendatar.
 * Tahun kering ekstrem diberi latar kolom dan label tebal, jadi arti tidak hanya lewat warna.
 *
 * Angka per bulan dari tabel `desa_bulan`. Bila tabel itu belum ada, kalender dan balok 3D tidak dirender.
 */

export function KalenderSatelit({
  kode,
  strip,
  tahunEkstrem,
  paparan,
}: {
  kode: string;
  strip: DesaTahun[];
  tahunEkstrem: number[];
  paparan: DesaPaparan;
}) {
  if (strip.length === 0 || strip.some((s) => !s.bulan)) return null;
  const awal = strip[0].tahun;
  const akhir = strip[strip.length - 1].tahun;

  const data: TahunSatelit[] = strip.map((s) => ({
    tahun: s.tahun,
    hari: s.detDays,
    ekstrem: tahunEkstrem.includes(s.tahun),
    bulan: s.bulan!,
  }));

  const terdeteksi = strip.filter((s) => s.terpapar);
  // Tahun dengan hari deteksi terbanyak (hari berbeda yang ada titik api), bukan lama satu kebakaran.
  const terpadat = strip.reduce((a, b) => (b.detDays > a.detDays ? b : a), strip[0]);
  // Bulan paling rawan: paling sering ada titik api di antara tahun-tahun yang tercatat.
  const perBulan = NAMA_BULAN.map((_, i) => ({
    i,
    tahunAda: data.filter((d) => d.bulan[i] > 0).length,
    hari: data.reduce((a, d) => a + d.bulan[i], 0),
  }));
  const rawan = [...perBulan].sort((a, b) => b.tahunAda - a.tahunAda || b.hari - a.hari)[0];
  const musim = perBulan.filter((b) => b.tahunAda >= Math.max(1, rawan.tahunAda / 2)).map((b) => b.i);

  const angka = [
    { judul: "Tahun terdeteksi", nilai: formatAngka(terdeteksi.length), satuan: `dari ${formatAngka(strip.length)} tahun`, catatan: `Sejak ${awal}` },
    { judul: "Saat kering ekstrem", nilai: formatAngka(paparan.kExt), satuan: `dari ${formatAngka(paparan.nExt)} tahun`, catatan: "Tahun kering ekstrem terdeteksi" },
    {
      judul: "Bulan paling rawan",
      nilai: rawan.hari > 0 ? NAMA_BULAN_PENDEK[rawan.i] : "–",
      satuan: "",
      catatan: rawan.hari > 0 ? `Ada titik api di ${formatAngka(rawan.tahunAda)} dari ${formatAngka(strip.length)} tahun` : "Belum ada titik api",
    },
    {
      judul: "Hari deteksi terbanyak",
      nilai: terpadat.detDays > 0 ? formatAngka(terpadat.detDays) : "–",
      satuan: terpadat.detDays > 0 ? "hari dalam setahun" : "",
      catatan: terpadat.detDays > 0 ? `Pada ${terpadat.tahun}` : "Belum ada hari terdeteksi",
    },
  ];

  const ringkasMusim =
    rawan.hari > 0 && musim.length
      ? `Titik api paling sering muncul ${NAMA_BULAN[musim[0]]} sampai ${NAMA_BULAN[musim[musim.length - 1]]}. Alat sebaiknya siap sebelum ${NAMA_BULAN[musim[0]]}.`
      : "Belum ada pola bulan karena titik api belum pernah terdeteksi.";

  const grid = (
    <div className="overflow-x-auto pb-1">
      <table className="w-full min-w-[560px] border-separate border-spacing-1 text-xs">
        <caption className="sr-only">Hari ada titik api per bulan, {awal} sampai {akhir}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-10">
              <span className="sr-only">Bulan</span>
            </th>
            {data.map((d) => (
              <th
                key={d.tahun}
                scope="col"
                className={`tabular rounded-t-md pb-1 pt-1.5 font-normal ${d.ekstrem ? "bg-[#f4ebdd] font-bold text-ink" : "text-muted"}`}
              >
                <span aria-hidden="true" className="hidden xl:inline">
                  {d.tahun}
                </span>
                <span aria-hidden="true" className="xl:hidden">
                  &apos;{String(d.tahun).slice(2)}
                </span>
                <span className="sr-only">
                  {d.tahun}
                  {d.ekstrem ? ", tahun kering ekstrem" : ""}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {NAMA_BULAN.map((nama, i) => (
            <tr key={nama}>
              <th scope="row" className="pr-1 text-left font-normal text-muted">
                <span aria-hidden="true">{NAMA_BULAN_PENDEK[i]}</span>
                <span className="sr-only">{nama}</span>
              </th>
              {data.map((d) => {
                const h = d.bulan[i];
                const t = tingkat(h);
                return (
                  <td key={d.tahun} className={`p-0 ${d.ekstrem ? "bg-[#f4ebdd]" : ""} ${i === 11 ? "rounded-b-md" : ""}`}>
                    <span
                      title={`${nama} ${d.tahun}: ${h} hari ada titik api`}
                      className={`tabular flex h-7 items-center justify-center rounded-md text-[11px] font-semibold ${t.warna}`}
                    >
                      {h > 0 ? formatAngka(h) : <span className="sr-only">0</span>}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section aria-labelledby="kalender-satelit" className="rounded-panel border border-line bg-surface p-5 shadow-card md:p-6">
      <PilihTampilanSatelit
        kepala={
          <div>
            <h2 id="kalender-satelit" className="text-lg font-bold">
              Kapan titik api muncul di desa ini?
            </h2>
            <p className="text-sm text-muted">
              Hari ada titik api per bulan, {awal} sampai {akhir}.
            </p>
          </div>
        }
        tautan={
          <Link
            href={`/desa/${kode}`}
            className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-paper px-4 text-sm font-semibold hover:bg-line/40"
          >
            Bukti satelit lengkap
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        }
        data={data}
        kotak={grid}
      />

      <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm">
        <span className="font-semibold">{ringkasMusim}</span>
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4">
        {angka.map((a) => (
          <div key={a.judul} className="flex min-w-0 flex-col">
            <dt className="text-sm text-muted">{a.judul}</dt>
            <dd className="mt-1">
              <span className="tabular text-4xl font-semibold leading-none tracking-tight text-ember">{a.nilai}</span>
              {a.satuan ? <span className="ml-1.5 text-ink">{a.satuan}</span> : null}
              <span className="mt-1.5 block truncate text-sm text-muted">{a.catatan}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-4">
        <p className="max-w-[72ch] text-sm text-muted">
          Setiap kotak satu bulan. Makin gelap, makin banyak hari ada titik api di desa. Kolom berlatar pasir = tahun kering ekstrem.
        </p>
        <ul aria-label="Keterangan warna" className="flex items-center gap-1.5 text-sm text-muted">
          <li>Sedikit</li>
          {TINGKAT.map((t) => (
            <li key={t.min} title={t.label}>
              <span aria-hidden="true" className={`block size-4 rounded ${t.warna.split(" ")[0]}`} />
              <span className="sr-only">{t.label}</span>
            </li>
          ))}
          <li>Banyak</li>
        </ul>
      </div>
    </section>
  );
}
