import { formatAngka } from "@/lib/format";

const persen = (x: number) => `${formatAngka(Math.round(x * 100))}%`;
const pos = (x: number) => Math.min(Math.max(x, 0), 1) * 100;

/**
 * Konteks kecamatan sebagai bilah 0-100% (bullet chart, CSS tanpa pustaka): pita = rentang terendah
 * sampai tertinggi antar tahun ekstrem, garis tinta = rata-rata kecamatan, titik ember = desa ini.
 * Label desa di atas bilah, legenda di bawah, supaya tidak ada label yang saling menimpa.
 * Laju kecamatan bukan angka desa (PRD FR-03); angka desa ditampilkan terpisah dan diberi nama jelas.
 */
export function RentangKecamatan({ pMean, rateMin, rateMax, desa }: { pMean: number; rateMin: number; rateMax: number; desa?: number | null }) {
  const adaDesa = desa !== undefined && desa !== null;
  return (
    <div aria-hidden="true">
      {/* label desa ini, mengikuti posisi titik */}
      <div className="relative h-8">
        {adaDesa ? (
          <span
            className="masuk absolute bottom-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-ember px-2 py-0.5 text-sm font-semibold text-white shadow-card"
            style={{ left: `${Math.min(Math.max(pos(desa), 10), 90)}%`, animationDelay: "700ms" }}
          >
            Desa ini {persen(desa)}
          </span>
        ) : null}
      </div>

      <div className="relative h-4 rounded-full bg-line">
        {/* kisi 25% */}
        {[25, 50, 75].map((g) => (
          <span key={g} className="absolute inset-y-0 w-px bg-surface/80" style={{ left: `${g}%` }} />
        ))}
        <span
          className="isi-maju absolute inset-y-0 rounded-full bg-ember/30"
          style={{ left: `${pos(rateMin)}%`, width: `${pos(rateMax) - pos(rateMin)}%`, animationDuration: "800ms", animationDelay: "300ms", animationTimingFunction: "var(--pegas)" }}
        />
        <span className="masuk absolute -inset-y-1.5 w-1 -translate-x-1/2 rounded-full bg-ink" style={{ left: `${pos(pMean)}%`, animationDelay: "550ms" }} />
        {adaDesa ? (
          <span
            className="masuk absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface bg-ember shadow-card"
            style={{ left: `${pos(desa)}%`, animationDelay: "700ms" }}
          />
        ) : null}
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-faint">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
        <li className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-5 rounded-full bg-ember/30" />
          Rentang antar tahun{" "}
          <span className="tabular font-semibold text-ink">
            {persen(rateMin)}–{persen(rateMax)}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-1 rounded-full bg-ink" />
          Rata-rata kecamatan <span className="tabular font-semibold text-ink">{persen(pMean)}</span>
        </li>
        {adaDesa ? (
          <li className="flex items-center gap-2">
            <span className="inline-block size-3 rounded-full bg-ember" />
            Desa ini <span className="tabular font-semibold text-ink">{persen(desa)}</span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
