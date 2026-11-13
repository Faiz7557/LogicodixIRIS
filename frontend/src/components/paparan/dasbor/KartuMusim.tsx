"use client";

import { useState } from "react";
import { formatAngka } from "@/lib/format";
import { NAMA_BULAN, NAMA_BULAN_PENDEK } from "@/lib/satelitBulanan";
import { KepalaKartu, kelasKartu, type TahunDasbor } from "./dasar";

const L = 300;
const T = 120;

/**
 * Musim titik api (pola kartu Retention): jumlah hari deteksi per bulan, sebagai grafik tangga dengan
 * arsiran tipis di bawahnya. Puncak diberi lencana persen. Bawaannya tahun yang dipilih di grafik riwayat
 * (klik batang tahun untuk ganti); tombol di kepala kartu menggabungkan semua tahun dalam rentang.
 * Arahkan kursor atau fokus ke bulan untuk melihat angkanya.
 */
export function KartuMusim({
  data,
  dalam,
  tahun,
  semua,
  onSemua,
}: {
  data: TahunDasbor[];
  dalam: (t: number) => boolean;
  tahun: number;
  semua: boolean;
  onSemua: (semua: boolean) => void;
}) {
  const [sorot, setSorot] = useState<number | null>(null);
  const sumber = semua ? data.filter((d) => dalam(d.tahun)) : data.filter((d) => d.tahun === tahun);
  const perBulan = Array.from({ length: 12 }, (_, i) => sumber.reduce((a, d) => a + d.bulan[i], 0));
  const total = perBulan.reduce((a, b) => a + b, 0);
  const maks = Math.max(...perBulan, 1);
  const puncak = perBulan.indexOf(Math.max(...perBulan));
  const lebar = L / 12;
  const y = (v: number) => T - (v / maks) * (T - 22);

  // Garis tangga: datar sepanjang bulan, naik/turun di batas bulan.
  const garis = perBulan.map((v, i) => `${i === 0 ? "M" : "L"}${i * lebar},${y(v)} L${(i + 1) * lebar},${y(v)}`).join(" ");
  const area = `${garis} L${L},${T} L0,${T} Z`;
  const aktif = sorot ?? puncak;

  return (
    <section aria-labelledby="musim" className={`${kelasKartu} flex flex-col`} style={{ animationDelay: "120ms" }}>
      <KepalaKartu
        id="musim"
        judul={semua ? "Musim titik api" : `Musim titik api ${tahun}`}
        keterangan={semua ? "Hari deteksi per bulan, semua tahun dalam rentang." : "Hari deteksi per bulan. Klik batang di grafik riwayat untuk ganti tahun."}
        kanan={
          <span className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-pressed={semua}
              onClick={() => onSemua(!semua)}
              className="min-h-8 rounded-full border border-line px-2.5 text-xs font-semibold transition-colors hover:bg-line/40"
            >
              {semua ? `Tahun ${tahun}` : "Semua tahun"}
            </button>
          </span>
        }
      />

      <div className="relative mt-4 flex-1">
        <svg viewBox={`0 0 ${L} ${T}`} preserveAspectRatio="none" aria-hidden="true" className="h-36 w-full overflow-visible">
          <defs>
            <pattern id="arsir-musim" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="var(--ember-soft)" />
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--ember)" strokeOpacity="0.35" strokeWidth="2" />
            </pattern>
          </defs>
          <path d={area} style={{ d: `path("${area}")` } as React.CSSProperties} fill="url(#arsir-musim)" className="transition-[d] duration-500 [transition-timing-function:var(--pegas)]" />
          <path d={garis} style={{ d: `path("${garis}")` } as React.CSSProperties} className="transition-[d] duration-500 [transition-timing-function:var(--pegas)]" fill="none" stroke="var(--ember)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <line x1={(aktif + 0.5) * lebar} x2={(aktif + 0.5) * lebar} y1={y(perBulan[aktif])} y2={T} stroke="var(--ink)" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Lencana nilai bulan aktif (puncak bila tidak ada yang disorot). */}
        <span
          aria-hidden="true"
          className="tabular pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-surface px-1.5 py-0.5 text-xs font-semibold shadow-card ring-1 ring-line transition-[left,top] duration-300 [transition-timing-function:var(--pegas)]"
          style={{ left: `${((aktif + 0.5) / 12) * 100}%`, top: `calc(${(y(perBulan[aktif]) / T) * 100}% - 4px)` }}
        >
          {total > 0 ? `${Math.round((perBulan[aktif] / total) * 100)}%` : "0%"}
        </span>
        {/* Area sentuh per bulan */}
        <div className="absolute inset-0 flex">
          {perBulan.map((v, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${NAMA_BULAN[i]}: ${formatAngka(v)} hari deteksi`}
              onPointerEnter={() => setSorot(i)}
              onPointerLeave={() => setSorot(null)}
              onFocus={() => setSorot(i)}
              onBlur={() => setSorot(null)}
              className="h-full flex-1 rounded-sm outline-none focus-visible:bg-ink/5"
            />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="mt-1.5 flex text-center text-xs text-muted">
        {NAMA_BULAN_PENDEK.map((n, i) => (
          <span key={n} className={`min-w-0 flex-1 transition-colors ${i === aktif ? "font-semibold text-ink" : ""}`}>
            {i % 2 === 0 || i === aktif ? n : ""}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm">
        <span className="font-semibold">{NAMA_BULAN[aktif]}</span>
        <span className="text-muted">
          {" "}
          · {formatAngka(perBulan[aktif])} hari{sorot === null && total > 0 ? ", bulan paling rawan" : ""}
          {total === 0 ? (semua ? " · tidak ada deteksi dalam rentang ini" : ` · tidak ada deteksi pada ${tahun}`) : ""}
        </span>
      </p>
    </section>
  );
}
