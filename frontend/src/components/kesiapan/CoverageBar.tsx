/**
 * Batang cakupan satu item (Design Brief §7). Warna hanya penguat:
 * angka dan kata ("Genting", "Perlu ditambah", "Terpenuhi") selalu ikut tampil.
 * Ambang genting 25% sama dengan aturan mesin (TRD §6).
 */
export function CoverageBar({
  persen,
  coverage,
  nama,
  labelPanjang,
}: {
  persen: number;
  coverage: number;
  nama: string;
  labelPanjang: string;
}) {
  const warna = coverage < 0.25 ? "bg-danger" : coverage < 1 ? "bg-warn" : "bg-ok";
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={persen}
      aria-label={`${nama}: ${labelPanjang}, ${persen}% dari paket minimum`}
      className="h-3 w-full overflow-hidden rounded-full bg-line"
    >
      <div className={`h-full rounded-full transition-[width] duration-300 ease-out ${warna}`} style={{ width: `${persen}%` }} />
    </div>
  );
}

export function KataCakupan({ coverage }: { coverage: number }) {
  if (coverage >= 1) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-ok">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-10" />
        </svg>
        Terpenuhi
      </span>
    );
  }
  if (coverage < 0.25) {
    return <span className="text-sm font-semibold text-danger">Genting</span>;
  }
  return <span className="text-sm font-semibold text-warn">Perlu ditambah</span>;
}
