"use client";

import Link from "next/link";
import { useState } from "react";
import { RingkasanAi } from "@/components/ui/RingkasanAi";
import { kelasKartu } from "@/components/paparan/dasbor/dasar";
import { kesimpulanBacktest } from "@/lib/backtest";
import type { Backtest } from "@/server/queries";
import { BukaAmplop } from "./dasbor/BukaAmplop";
import { CaraKerja } from "./dasbor/CaraKerja";
import { GarisWaktuBeku } from "./dasbor/GarisWaktuBeku";
import { KartuHasil } from "./dasbor/KartuHasil";
import { KartuGerbang, KartuKohort } from "./dasbor/KohortGerbang";
import { PapanPeringkat } from "./dasbor/PapanPeringkat";

/**
 * Time Machine (App Flow v2 §3.3) sebagai dasbor. Unsur khas: garis waktu beku yang bisa diseret
 * (memilih tahun uji), papan peringkat yang menyusun ulang dirinya, dan amplop 2026 yang dibuka bertahap.
 * Hasil ditampilkan apa adanya, termasuk saat peringkat paparan kalah.
 */
export function TimeMachineView({ data }: { data: Backtest }) {
  const tahunUji = [...new Set(data.metrik.map((m) => m.tahunUji))].sort((a, b) => a - b);
  const [tahun, setTahun] = useState<number>(() => (tahunUji.includes(2026) ? 2026 : (tahunUji[tahunUji.length - 1] ?? 2026)));
  const adaMetrik = data.metrik.length > 0;
  // Peragaan "Buka 2026" selalu memakai data 2026 (bukan tahun yang dipilih di garis waktu).
  const tahunDemo = tahunUji.includes(2026) ? 2026 : (tahunUji[tahunUji.length - 1] ?? 2026);

  const semua = data.grup.filter((g) => g.strata === "semua");
  const totalDesa = semua.reduce((a, g) => a + g.nDesa, 0);
  const lajuDasar = totalDesa > 0 ? semua.reduce((a, g) => a + g.nTerpapar2026, 0) / totalDesa : null;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
      <header className="masuk flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ember">Time Machine · uji tanpa contekan</p>
          <h1 className="mt-1 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-4xl">Apakah tebakan kami soal desa rawan api itu jitu?</h1>
          <p className="mt-2 max-w-[62ch] text-sm text-muted">
            Cara membuktikannya: kami menebak lebih dulu, lalu mencocokkannya dengan deteksi satelit yang benar-benar terjadi sesudahnya. Tidak ada hasil yang
            disimulasikan.
          </p>
        </div>
      </header>
      <RingkasanAi halaman="timemachine" className="mt-4" />

      {/* 1. Penjelasan singkat, lalu 2. peragaan langsung (tebakan tertutup, tekan untuk membuka). */}
      <div className="mt-6">
        <CaraKerja tahunUji={tahunDemo} />
      </div>

      {data.teratas.length > 0 ? (
        <div className="mt-4">
          <BukaAmplop teratas={data.teratas} lajuDasar={lajuDasar} tahunUji={tahunDemo} />
        </div>
      ) : null}

      {/* 3. Seberapa jitu secara keseluruhan, dan bisa dicek di beberapa tahun. */}
      {adaMetrik ? (
        <>
          <h2 className="mt-10 text-2xl font-semibold tracking-[-0.02em]">Seberapa jitu tebakannya?</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-muted">
            Peragaan di atas hanya 20 desa. Di sini seluruh desa diuji, di beberapa tahun, dan diadu dengan tebakan sederhana. Pilih tahun yang ingin dilihat.
          </p>
          <div className="mt-4">
            <GarisWaktuBeku tahunUji={tahun} pilihan={tahunUji} onPilih={setTahun} />
          </div>

          <p aria-live="polite" className="masuk mt-4 rounded-xl bg-surface-2 px-4 py-3 text-sm font-semibold" style={{ animationDelay: "40ms" }}>
            {kesimpulanBacktest(data.metrik, tahun)}
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
            <KartuHasil rows={data.metrik} tahunUji={tahun} />
            <PapanPeringkat rows={data.metrik} tahunUji={tahun} />
          </div>

          <h2 className="mt-10 text-2xl font-semibold tracking-[-0.02em]">Untuk yang ingin lebih detail</h2>
          <p className="mt-1 max-w-[62ch] text-sm text-muted">Uji tambahan: apakah desa yang terlihat tenang bertahun-tahun benar-benar aman?</p>
          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
            <KartuKohort grup={data.grup} />
            <KartuGerbang grup={data.grup} gerbang={data.gerbang} />
          </div>
        </>
      ) : (
        <p role="status" className={`${kelasKartu} mt-6 text-center font-semibold text-muted`}>
          Gerbang data belum dijalankan. Hasil uji per tahun akan muncul setelah pipeline backtest selesai.
        </p>
      )}

      <section aria-labelledby="batas" className="masuk mt-4 rounded-panel border border-warn/40 bg-warn-soft/40 p-5" style={{ animationDelay: "300ms" }}>
        <h2 id="batas" className="font-semibold">
          Apa yang tidak bisa dibuktikan halaman ini
        </h2>
        <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
          {[
            "Tidak mengukur hektare yang terselamatkan, dan tidak membuktikan belanja kesiapan menurunkan api.",
            "Targetnya deteksi satelit, bukan kebakaran. Awan dan asap bisa menutupi api; api gambut membara bisa terlewat.",
            "2026 berada di luar rezim normal (El Niño sangat kuat), jadi bukan gambaran tahun biasa.",
            `Data satelit 2026 berakhir ${data.dataAkhir2026 ?? "belum ada"}; tanggal akhir yang sebenarnya ditulis di halaman Data.`,
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 shrink-0 text-warn">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <Link href="/data" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-water underline underline-offset-2">
          Lihat Data dan Asumsi
        </Link>
      </section>
    </div>
  );
}
