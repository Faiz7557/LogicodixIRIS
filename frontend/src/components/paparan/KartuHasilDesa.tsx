import Link from "next/link";
import { LABEL_TIER, headlinePaparan } from "@/lib/kalimat";
import type { DesaHit, Tier } from "@/lib/types";

/** Ringkasan paparan untuk kartu hasil pencarian. Opsional: tanpa ini kartu hanya memuat nama dan wilayah. */
export interface PratinjauPaparan {
  /** Strip 2012-2026, urut tahun. */
  strip: { tahun: number; terpapar: boolean }[];
  kExt: number;
  nExt: number;
  tahunTenang: number;
  tier: Tier;
}

export type HasilCari = DesaHit & { pratinjau?: PratinjauPaparan };

/**
 * Kartu hasil pencarian yang memanjang: strip deteksi per tahun di kiri, lalu nama dan wilayah,
 * kalimat utama paparan, label tingkat paparan, dan "Lihat paparan" di kanan.
 * Di HP strip pindah ke atas. Seluruh kartu adalah satu tautan.
 */
export function KartuHasilDesa({ d }: { d: HasilCari }) {
  const p = d.pratinjau;
  const terdeteksi = p?.strip.filter((s) => s.terpapar).map((s) => s.tahun) ?? [];

  return (
    <Link
      href={`/desa/${d.kode}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-3 shadow-sm transition-shadow hover:shadow-md focus-visible:shadow-md sm:flex-row sm:items-stretch"
    >
      {p ? (
        <div
          aria-hidden="true"
          className="flex h-16 shrink-0 items-end gap-0.5 rounded-xl bg-gradient-to-b from-[#f4ebdd] to-[#e9dcc6] p-2 sm:h-auto sm:min-h-24 sm:w-44"
        >
          {p.strip.map((s) => (
            <span key={s.tahun} className={`flex-1 rounded-sm ${s.terpapar ? "h-full bg-ember" : "h-2 bg-white/80"}`} />
          ))}
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col px-1 py-0.5">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <h3 className="font-bold leading-snug group-hover:underline group-hover:underline-offset-2">{d.nama}</h3>
          {p ? <span className="whitespace-nowrap rounded-full border border-ink px-2.5 py-0.5 text-sm font-bold">{LABEL_TIER[p.tier]}</span> : null}
        </div>
        <p className="text-sm text-muted">
          {d.kecNama}, {d.provNama}
        </p>
        {p ? (
          <p className="mt-1.5 text-sm leading-snug">
            {headlinePaparan(p)}
            {terdeteksi.length ? <span className="sr-only"> Tahun terdeteksi: {terdeteksi.join(", ")}.</span> : null}
          </p>
        ) : null}
        <span className="mt-2 self-end whitespace-nowrap text-sm font-bold text-water underline underline-offset-2">Lihat paparan</span>
      </div>
    </Link>
  );
}
