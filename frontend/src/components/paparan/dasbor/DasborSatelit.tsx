"use client";

import { useMemo, useState } from "react";
import { formatAngka } from "@/lib/format";
import { sebutKecamatan } from "@/lib/kalimat";
import { NAMA_BULAN } from "@/lib/satelitBulanan";
import type { DesaPaparan, DesaTahun, KecamatanPaparan } from "@/lib/types";
import { GrafikRiwayat } from "./GrafikRiwayat";
import { KartuMatriks } from "./KartuMatriks";
import { KartuMusim } from "./KartuMusim";
import { KartuPaparan } from "./KartuPaparan";
import { KartuWawasan, type Wawasan } from "./KartuWawasan";
import { METRIK, RENTANG, Segmen, type Metrik, type Rentang, type TahunDasbor } from "./dasar";

/**
 * Dasbor Informasi detail (tata letak dari referensi "Overview"): kepala dengan pemilih ukuran dan rentang,
 * grafik riwayat + kartu paparan, lalu musim, dua kartu matriks, dan wawasan.
 * Pemilih di kepala mengubah semua kartu sekaligus.
 */
export function DasborSatelit({
  namaDesa,
  lokasi,
  strip,
  tahunEkstrem,
  paparan,
  kecamatan,
  kecNama,
  tampakAman,
}: {
  namaDesa: string;
  lokasi: string;
  strip: DesaTahun[];
  tahunEkstrem: number[];
  paparan: DesaPaparan;
  kecamatan: KecamatanPaparan;
  kecNama: string;
  tampakAman: boolean;
}) {
  const data: TahunDasbor[] = useMemo(
    () =>
      strip.map((s) => {
        const ekstrem = tahunEkstrem.includes(s.tahun);
        return { tahun: s.tahun, hari: s.detDays, titik: s.nDet, terpapar: s.terpapar, ekstrem, bulan: s.bulan ?? Array<number>(12).fill(0) };
      }),
    [strip, tahunEkstrem],
  );

  const [metrik, setMetrik] = useState<Metrik>("hari");
  const [rentang, setRentang] = useState<Rentang>("semua");
  // Awalnya tahun dengan nilai tertinggi, supaya rincian langsung menunjukkan tahun terpenting.
  const [pilih, setPilihTahun] = useState(() => data.reduce((a, d) => (d.hari > a.hari ? d : a), data[data.length - 1]).tahun);
  // Kartu musim mengikuti tahun terpilih; memilih tahun di grafik selalu kembali ke tampilan satu tahun.
  const [musimSemua, setMusimSemua] = useState(false);
  const setPilih = (t: number) => {
    setPilihTahun(t);
    setMusimSemua(false);
  };

  const akhir = data.at(-1)?.tahun ?? 2026;
  const awal = data[0]?.tahun ?? 2012;
  const dalam = (t: number) => (rentang === "semua" ? true : rentang === "lima" ? t > akhir - 5 : tahunEkstrem.includes(t));

  // DB lama tanpa tabel desa_bulan: kartu musim, bilah per bulan, dan wawasan bulan disembunyikan.
  const adaBulan = strip.length > 0 && strip.every((s) => s.bulan !== null);
  const wawasan = buatWawasan({ data, paparan, kecamatan, kecNama, tampakAman, adaBulan });

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
      <header className="masuk flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ember">Informasi detail · VIIRS {awal}–{akhir}</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-4xl">Seberapa terpapar {namaDesa}?</h1>
          <p className="mt-1 text-sm text-muted">{lokasi}</p>
        </div>
        {/* Dua pemilih selalu sebaris (HP: bertumpuk karena tidak muat). */}
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-nowrap sm:items-center">
          <Segmen label="Ukuran" pilihan={METRIK} nilai={metrik} onPilih={setMetrik} />
          <Segmen label="Rentang tahun" pilihan={RENTANG} nilai={rentang} onPilih={setRentang} />
        </div>
      </header>

      {tampakAman ? (
        <p role="note" className="masuk mt-4 flex items-start gap-2 rounded-xl border border-warn/40 bg-warn-soft px-4 py-3 text-sm">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-warn">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>
            <span className="font-semibold text-warn">Tampak aman.</span> Desa ini pernah terdeteksi pada tahun kering ekstrem lalu tenang beberapa tahun.
            Tenang bukan berarti aman: tahun kering ekstrem berikutnya bisa datang kapan saja.
          </span>
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <GrafikRiwayat data={data} metrik={metrik} dalam={dalam} pilih={pilih} onPilih={setPilih} />
        <KartuPaparan paparan={paparan} jumlahTahun={data.length} tahun={data.find((d) => d.tahun === pilih) ?? data[data.length - 1]} adaBulan={adaBulan} />
      </div>

      <div className={`mt-4 grid gap-4 md:grid-cols-2 ${adaBulan ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1fr)]" : ""}`}>
        {adaBulan ? <KartuMusim data={data} dalam={dalam} tahun={pilih} semua={musimSemua} onSemua={setMusimSemua} /> : null}
        <div className="grid gap-4">
          <KartuMatriks id="kartu-hari" judul="Hari deteksi" satuan="hari" data={data} nilai={(d) => d.hari} dalam={dalam} jeda={160} />
          <KartuMatriks id="kartu-titik" judul="Titik api" satuan="titik" data={data} nilai={(d) => d.titik} dalam={dalam} jeda={200} />
        </div>
        <div className={adaBulan ? "md:col-span-2 xl:col-span-1" : ""}>
          <KartuWawasan daftar={wawasan} />
        </div>
      </div>

    </div>
  );
}

/** Tiga sampai empat temuan singkat dari data desa, untuk kartu wawasan. */
function buatWawasan({
  data,
  paparan,
  kecamatan,
  kecNama,
  tampakAman,
  adaBulan,
}: {
  data: TahunDasbor[];
  paparan: DesaPaparan;
  kecamatan: KecamatanPaparan;
  kecNama: string;
  tampakAman: boolean;
  adaBulan: boolean;
}): Wawasan[] {
  const persen = (x: number) => `${formatAngka(Math.round(x * 100))}%`;
  const lajuDesa = paparan.nExt > 0 ? paparan.kExt / paparan.nExt : 0;
  const daftar: Wawasan[] = [
    {
      angka: persen(lajuDesa),
      judul: `Tahun kering ekstrem yang terdeteksi di desa ini`,
      isi:
        lajuDesa > kecamatan.pMean
          ? `Lebih sering dari rata-rata desa di ${sebutKecamatan(kecNama)} (${persen(kecamatan.pMean)}).`
          : `Tidak lebih sering dari rata-rata desa di ${sebutKecamatan(kecNama)} (${persen(kecamatan.pMean)}).`,
    },
  ];

  const bulan = Array.from({ length: 12 }, (_, i) => data.reduce((a, d) => a + d.bulan[i], 0));
  const total = bulan.reduce((a, b) => a + b, 0);
  if (adaBulan && total > 0) {
    const puncak = bulan.indexOf(Math.max(...bulan));
    const tiga = [puncak - 1, puncak, puncak + 1].filter((i) => i >= 0 && i < 12).reduce((a, i) => a + bulan[i], 0);
    daftar.push({
      angka: persen(tiga / total),
      judul: `Hari deteksi jatuh di sekitar ${NAMA_BULAN[puncak]}`,
      isi: `Alat sebaiknya siap sebelum ${NAMA_BULAN[Math.max(puncak - 1, 0)]}. Dihitung dari tanggal deteksi satelit.`,
    });
  }

  const terbanyak = data.reduce((a, d) => (d.hari > a.hari ? d : a), data[0]);
  if (terbanyak && terbanyak.hari > 0) {
    daftar.push({
      angka: `${formatAngka(terbanyak.hari)} hari`,
      judul: `Tahun terpadat: ${terbanyak.tahun}`,
      isi: `${formatAngka(terbanyak.titik)} titik api terdeteksi${terbanyak.ekstrem ? " pada tahun kering ekstrem" : ""}.`,
    });
  }

  daftar.push({
    angka: `${formatAngka(paparan.tahunTenang)} tahun`,
    judul: tampakAman ? "Tenang, tapi tampak aman saja" : "Tahun terakhir tanpa deteksi beruntun",
    isi: tampakAman ? "Desa pernah terdeteksi saat kering ekstrem. Tenang bukan berarti aman." : "Dihitung mundur dari tahun terakhir data.",
  });
  return daftar;
}
