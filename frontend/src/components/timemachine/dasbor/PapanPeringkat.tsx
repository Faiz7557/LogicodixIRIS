"use client";

import { useState } from "react";
import { KepalaKartu, Segmen, kelasKartu } from "@/components/paparan/dasbor/dasar";
import { NAMA_RAMAH, type Metrik, type MetricRow, type Strategi } from "@/lib/backtest";
import { MetricTable } from "../MetricTable";

const STRATEGI: Strategi[] = ["paparan", "persistensi", "total_riwayat", "gambut", "acak"];
const UKURAN: { nilai: Metrik; label: string }[] = [
  { nilai: "capture_10", label: "10% teratas" },
  { nilai: "capture_20", label: "20% teratas" },
  { nilai: "capture_30", label: "30% teratas" },
  { nilai: "roc_auc", label: "Skor menyeluruh" },
];
const KET: Record<Metrik, string> = {
  capture_10: "Lihat 10% desa teratas dari daftar tiap cara. Dari semua desa yang akhirnya terdeteksi api, berapa persen ada di situ? Makin tinggi makin jitu.",
  capture_20: "Lihat 20% desa teratas dari daftar tiap cara. Dari semua desa yang akhirnya terdeteksi api, berapa persen ada di situ? Makin tinggi makin jitu.",
  capture_30: "Lihat 30% desa teratas dari daftar tiap cara. Dari semua desa yang akhirnya terdeteksi api, berapa persen ada di situ? Makin tinggi makin jitu.",
  roc_auc: "Skor menyeluruh (ROC-AUC): peluang desa yang terdeteksi api diurutkan lebih atas daripada desa yang tidak. 0,50 sama dengan menebak asal, 1,00 sempurna.",
  pr_auc: "",
};
const TINGGI = 52;

/**
 * Papan peringkat lima cara mengurutkan desa (pola leaderboard). Baris diletakkan menurut peringkat,
 * jadi saat tahun uji atau ukuran berganti, baris meluncur ke tempat barunya (transform, bisa disela).
 * Garis putus = nilai acak sebagai patokan. Pemenang diberi mahkota dan kata "terbaik", bukan warna saja.
 * Tabel lengkap (termasuk PR-AUC) bisa dibuka untuk pembaca yang ingin angka persis.
 */
export function PapanPeringkat({ rows, tahunUji }: { rows: MetricRow[]; tahunUji: number }) {
  const [ukuran, setUkuran] = useState<Metrik>("capture_20");
  const [tabel, setTabel] = useState(false);
  const nilai = (s: Strategi) => rows.find((r) => r.tahunUji === tahunUji && r.unit === "desa" && r.strategi === s && r.metrik === ukuran)?.nilai ?? 0;
  const urut = [...STRATEGI].sort((a, b) => nilai(b) - nilai(a) || STRATEGI.indexOf(a) - STRATEGI.indexOf(b));
  const peringkat = new Map(urut.map((s, i) => [s, i]));
  const persen = ukuran !== "roc_auc";
  const teks = (v: number) => (persen ? `${Math.round(v * 100)}%` : v.toFixed(2).replace(".", ","));
  const acak = nilai("acak");

  return (
    <section aria-labelledby="peringkat" className={`${kelasKartu} flex flex-col`} style={{ animationDelay: "120ms" }}>
      <KepalaKartu id="peringkat" judul="Adu tebakan: cara mana paling jitu?" keterangan={KET[ukuran]} />
      <div className="mt-3">
        <Segmen label="Ukuran" pilihan={UKURAN} nilai={ukuran} onPilih={setUkuran} />
      </div>

      <ol className="relative mt-4" style={{ height: STRATEGI.length * TINGGI }} aria-label={`Peringkat uji ${tahunUji}`}>
        {/* Garis acak sebagai patokan, di area bilah (setelah kolom nama). */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[9.75rem] right-[4.875rem] z-0">
          <span className="absolute inset-y-0 border-l border-dashed border-faint transition-[left] duration-700 [transition-timing-function:var(--pegas)]" style={{ left: `${acak * 100}%` }}>
            <span className="absolute -top-4 -translate-x-1/2 whitespace-nowrap text-[10px] text-faint">acak</span>
          </span>
        </span>
        {STRATEGI.map((s) => {
          const i = peringkat.get(s)!;
          const v = nilai(s);
          const kita = s === "paparan";
          const juara = i === 0;
          return (
            <li
              key={s}
              className="absolute inset-x-0 z-10 flex items-center gap-3 transition-transform duration-700 [transition-timing-function:var(--pegas)]"
              style={{ height: TINGGI, transform: `translateY(${i * TINGGI}px)` }}
            >
              <span className={`tabular flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${juara ? "bg-ink text-white" : "bg-surface-2"}`}>{i + 1}</span>
              <span className={`w-[6.5rem] shrink-0 text-xs leading-tight ${kita ? "font-semibold text-ember" : ""}`}>{NAMA_RAMAH[s]}</span>
              <span aria-hidden="true" className="relative h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 [transition-timing-function:var(--pegas)] ${kita ? "arsir-ember" : s === "acak" ? "bg-line-2" : "arsir-air"}`}
                  style={{ width: `${v * 100}%` }}
                />
              </span>
              <span className="tabular w-12 shrink-0 text-right text-sm font-semibold">
                {teks(v)}
                {juara ? (
                  <span className="sr-only">, terbaik</span>
                ) : null}
              </span>
              {juara ? (
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" className="-ml-2 shrink-0 text-warn" fill="currentColor">
                  <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
                </svg>
              ) : (
                <span className="-ml-2 w-3.5 shrink-0" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-auto pt-4">
        <button
          type="button"
          aria-expanded={tabel}
          onClick={() => setTabel((x) => !x)}
          className="tekan inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-water"
        >
          {tabel ? "Sembunyikan tabel" : "Lihat tabel lengkap"}
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-300 ${tabel ? "rotate-180" : ""}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {tabel ? (
          <div className="masuk mt-2">
            <MetricTable rows={rows} tahunUji={tahunUji} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
