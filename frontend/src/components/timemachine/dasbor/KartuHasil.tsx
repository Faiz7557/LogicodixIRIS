"use client";

import { useAngkaNaik } from "@/components/paparan/dasbor/dasar";
import { NAMA_RAMAH, type MetricRow, type Strategi } from "@/lib/backtest";
import { formatAngka } from "@/lib/format";

const PEMBANDING: Strategi[] = ["persistensi", "total_riwayat", "gambut"];

/**
 * Kartu jawaban (gelap, bertema es): berapa persen desa yang kemudian terdeteksi sudah ada di 20% teratas.
 * Chip naik/turun dibanding pembanding terbaik (bukan acak), kelipatan dibanding acak, dan kurva mini
 * tangkap 10/20/30% untuk peringkat paparan, pembanding terbaik, dan acak. Kalah tetap ditulis kalah.
 */
export function KartuHasil({ rows, tahunUji }: { rows: MetricRow[]; tahunUji: number }) {
  const ambil = (s: Strategi, m: MetricRow["metrik"]) =>
    rows.find((r) => r.tahunUji === tahunUji && r.unit === "desa" && r.strategi === s && r.metrik === m)?.nilai ?? 0;
  const paparan = ambil("paparan", "capture_20");
  const acak = ambil("acak", "capture_20");
  const terbaik = PEMBANDING.map((s) => ({ s, v: ambil(s, "capture_20") })).reduce((a, b) => (b.v > a.v ? b : a));
  const selisih = Math.round((paparan - terbaik.v) * 100);
  const kali = acak > 0 ? paparan / acak : 0;
  const tampil = useAngkaNaik(paparan * 100);
  const tampilKali = useAngkaNaik(kali);

  const garis = [
    { s: "paparan" as const, label: NAMA_RAMAH.paparan, warna: "#ffb38a", lebar: 2.5 },
    { s: terbaik.s, label: `Tebakan sederhana terbaik (${NAMA_RAMAH[terbaik.s].toLowerCase()})`, warna: "#9ec5ff", lebar: 1.5 },
    { s: "acak" as const, label: NAMA_RAMAH.acak, warna: "rgba(255,255,255,.45)", lebar: 1.5, putus: true },
  ];
  const titik = (s: Strategi) => (["capture_10", "capture_20", "capture_30"] as const).map((m) => ambil(s, m));
  const X = [12, 100, 188];
  const y = (v: number) => 70 - v * 64;

  return (
    <section
      aria-labelledby="hasil"
      className="masuk relative flex flex-col overflow-hidden rounded-panel p-5 text-white shadow-card"
      style={{ animationDelay: "60ms", background: "radial-gradient(110% 80% at 100% 0%, #3b5f8f 0%, transparent 55%), linear-gradient(165deg, #1b2636 0%, #22324a 55%, #2d2a3a 100%)" }}
    >
      {/* Kristal es samar, hiasan. */}
      <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute -right-6 -top-6 size-36 text-white/10">
        <path d="M50 4v92M10 27l80 46M90 27 10 73M40 10l10 8 10-8M40 90l10-8 10 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <h2 id="hasil" className="relative text-sm font-semibold text-white/80">
        Nilai tebakan kami di uji {tahunUji}
      </h2>
      <p className="relative mt-3 flex flex-wrap items-center gap-3">
        <span className="tabular text-6xl font-semibold leading-none tracking-[-0.04em]">{formatAngka(Math.round(tampil))}%</span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${selisih > 0 ? "bg-[#1f6b47] text-white" : "bg-[#8c2f2f] text-white"}`}
        >
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={selisih > 0 ? "M12 19V5M6 11l6-6 6 6" : "M12 5v14M6 13l6 6 6-6"} />
          </svg>
          {selisih > 0 ? `unggul ${selisih} poin dari tebakan sederhana` : selisih === 0 ? "seri dengan tebakan sederhana" : `kalah ${-selisih} poin dari tebakan sederhana`}
        </span>
      </p>
      <p className="relative mt-2 text-sm text-white/80">
        dari semua desa yang akhirnya terdeteksi api, segini yang sudah ada di <strong className="text-white">20% teratas daftar kami</strong>
      </p>

      <dl className="relative mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
        <div>
          <dt className="text-white/60">Dibanding tebak asal (20%)</dt>
          <dd className="tabular text-xl font-semibold">{formatAngka(tampilKali, 1)}× lebih jitu</dd>
        </div>
        <div>
          <dt className="text-white/60">Tebakan sederhana terbaik</dt>
          <dd className="text-xl font-semibold">
            <span className="block text-sm font-semibold leading-tight">{NAMA_RAMAH[terbaik.s]}</span>
            <span className="tabular text-white/70">{Math.round(terbaik.v * 100)}%</span>
          </dd>
        </div>
      </dl>

      <figure className="relative mt-auto pt-5">
        <svg viewBox="0 0 200 76" className="h-24 w-full" role="img" aria-label="Tangkap 10, 20, dan 30 persen untuk peringkat paparan, pembanding terbaik, dan acak">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2="200" y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,.08)" />
          ))}
          {garis.map((g) => {
            const v = titik(g.s);
            const d = v.map((n, i) => `${i ? "L" : "M"}${X[i]},${y(n)}`).join(" ");
            return (
              <g key={g.s}>
                {/* d dan posisi titik lewat CSS supaya bisa ditransisikan saat tahun uji berganti. */}
                <path
                  d={d}
                  style={{ d: `path("${d}")` } as React.CSSProperties}
                  fill="none"
                  stroke={g.warna}
                  strokeWidth={g.lebar}
                  strokeDasharray={g.putus ? "4 4" : undefined}
                  className="transition-[d] duration-700 [transition-timing-function:var(--pegas)]"
                />
                {v.map((n, i) => (
                  <circle
                    key={i}
                    cx={X[i]}
                    cy={0}
                    r={g.s === "paparan" ? 3.5 : 2.5}
                    fill={g.warna}
                    stroke="#1b2636"
                    strokeWidth="1.5"
                    style={{ transform: `translateY(${y(n)}px)` }}
                    className="transition-transform duration-700 [transition-timing-function:var(--pegas)]"
                  />
                ))}
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-1 flex justify-between text-[11px] text-white/60">
          <span>10% teratas</span>
          <span>20%</span>
          <span>30%</span>
        </figcaption>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/80">
          {garis.map((g) => (
            <li key={g.s} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-0.5 w-3.5 rounded-full" style={{ background: g.warna }} />
              {g.label}
            </li>
          ))}
        </ul>
      </figure>

    </section>
  );
}
