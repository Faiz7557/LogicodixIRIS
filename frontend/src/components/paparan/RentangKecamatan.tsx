import { formatAngka } from "@/lib/format";

/**
 * Konteks kecamatan sebagai bilah rentang 0-100% (bullet chart sederhana, SVG/CSS tanpa pustaka):
 * pita = rentang terendah sampai tertinggi antar tahun ekstrem, penanda tinta = rata-rata.
 * Setiap bagian diberi label teks; kalimat lengkap tetap ditampilkan di bawahnya.
 * Ini laju kecamatan, bukan angka desa (PRD FR-03).
 */
export function RentangKecamatan({ pMean, rateMin, rateMax }: { pMean: number; rateMin: number; rateMax: number }) {
  const p = (x: number) => Math.min(Math.max(x, 0), 1) * 100;
  const label = (x: number) => `${formatAngka(Math.round(x * 100))}%`;

  return (
    <div aria-hidden="true" className="pt-7">
      <div className="relative h-3 rounded-full bg-line">
        <span className="absolute inset-y-0 rounded-full bg-ember/35" style={{ left: `${p(rateMin)}%`, width: `${p(rateMax) - p(rateMin)}%` }} />
        <span className="absolute -inset-y-1.5 w-1 -translate-x-1/2 rounded-full bg-ink" style={{ left: `${p(pMean)}%` }} />
        <span
          className="absolute -top-7 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-sm font-semibold text-white"
          style={{ left: `${Math.min(Math.max(p(pMean), 12), 88)}%` }}
        >
          rata-rata {label(pMean)}
        </span>
      </div>
      <div className="relative mt-2 h-5 text-sm text-muted">
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${Math.min(Math.max(p(rateMin), 10), 45)}%` }}>
          terendah {label(rateMin)}
        </span>
        <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${Math.min(Math.max(p(rateMax), 55), 90)}%` }}>
          tertinggi {label(rateMax)}
        </span>
      </div>
      <div className="mt-1 flex justify-between text-sm text-muted">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
