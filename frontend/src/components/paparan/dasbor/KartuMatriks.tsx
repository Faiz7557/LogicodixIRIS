"use client";

import { formatAngka } from "@/lib/format";
import { KepalaKartu, kelasKartu, useAngkaNaik, type TahunDasbor } from "./dasar";

const BARIS = 5;

/**
 * Angka besar + matriks titik per tahun (pola kartu Transactions/Customers).
 * Tiap kolom satu tahun, jumlah titik sebanding nilainya (maks 5). Tahun terbanyak diberi lencana
 * dan titik paling gelap. Tahun di luar rentang diredupkan. Angka berhitung saat rentang berubah.
 */
export function KartuMatriks({
  id,
  judul,
  satuan,
  data,
  nilai,
  dalam,
  jeda = 0,
}: {
  id: string;
  judul: string;
  satuan: string;
  data: TahunDasbor[];
  nilai: (d: TahunDasbor) => number;
  dalam: (t: number) => boolean;
  jeda?: number;
}) {
  const masuk = data.filter((d) => dalam(d.tahun));
  const total = masuk.reduce((a, d) => a + nilai(d), 0);
  const rata = masuk.length ? total / masuk.length : 0;
  const tampil = useAngkaNaik(total);
  const tampilRata = useAngkaNaik(rata);
  const maks = Math.max(...data.map(nilai), 1);
  const terbanyak = masuk.reduce<TahunDasbor | null>((a, d) => (!a || nilai(d) > nilai(a) ? d : a), null);

  return (
    <section aria-labelledby={id} className={kelasKartu} style={{ animationDelay: `${jeda}ms` }}>
      <KepalaKartu id={id} judul={judul} />
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-4">
        <p className="tabular text-4xl font-semibold leading-none tracking-[-0.03em]">
          {formatAngka(Math.round(tampil))}
          <span className="sr-only"> {satuan}</span>
        </p>

        <div aria-hidden="true" className="relative min-w-0 pt-6">
          {terbanyak && nilai(terbanyak) > 0 ? (
            <span
              className="tabular absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold shadow-card ring-1 ring-line transition-[left] duration-500 [transition-timing-function:var(--pegas)]"
              style={{ left: `${((data.indexOf(terbanyak) + 0.5) / data.length) * 100}%` }}
            >
              Terbanyak: {terbanyak.tahun}
            </span>
          ) : null}
          <div className="flex items-end justify-between gap-[3px]">
            {data.map((d) => {
              const n = nilai(d) > 0 ? Math.max(1, Math.round((nilai(d) / maks) * BARIS)) : 0;
              const atas = d === terbanyak;
              return (
                <span key={d.tahun} className={`flex min-w-0 flex-1 flex-col-reverse items-center gap-[3px] transition-opacity duration-500 ${dalam(d.tahun) ? "" : "opacity-25"}`}>
                  {Array.from({ length: BARIS }, (_, r) => (
                    <span
                      key={r}
                      className={`block aspect-square w-full max-w-[9px] rounded-full transition-colors duration-500 ${
                        r < n ? (atas ? "bg-ember" : d.terpapar ? "bg-ember/55" : "bg-faint/60") : "bg-line/70"
                      }`}
                    />
                  ))}
                </span>
              );
            })}
          </div>
        </div>

        <p className="text-right text-xs leading-tight text-muted">
          rata-rata
          <span className="tabular block text-base font-semibold text-ink">{formatAngka(tampilRata, 1)}</span>
          per tahun
        </p>
      </div>
      <p className="sr-only">
        {judul}: total {formatAngka(total)} {satuan}
        {terbanyak ? `, terbanyak pada ${terbanyak.tahun} dengan ${formatAngka(nilai(terbanyak))} ${satuan}` : ""}.
      </p>
    </section>
  );
}
