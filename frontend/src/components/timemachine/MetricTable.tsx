import { NAMA_METRIK, NAMA_STRATEGI, pemenang, type Metrik, type MetricRow, type Strategi } from "@/lib/backtest";

const STRATEGI: Strategi[] = ["paparan", "persistensi", "total_riwayat", "gambut", "acak"];
const METRIK: Metrik[] = ["capture_10", "capture_20", "capture_30", "roc_auc", "pr_auc"];

/**
 * Tabel metrik per tahun uji (Design Brief v2 §7). Pemenang tiap kolom ditandai dengan teks tebal
 * dan tanda "★", bukan hanya warna. Gulir horizontal hanya di dalam tabel, bukan di halaman.
 */
export function MetricTable({ rows, tahunUji }: { rows: MetricRow[]; tahunUji: number }) {
  const nilai = (s: Strategi, m: Metrik) => rows.find((r) => r.tahunUji === tahunUji && r.unit === "desa" && r.strategi === s && r.metrik === m)?.nilai;
  const menang = Object.fromEntries(METRIK.map((m) => [m, pemenang(rows, tahunUji, m)])) as Record<Metrik, Strategi | null>;
  const pct = (v?: number) => (v === undefined ? "–" : `${Math.round(v * 100)}%`);
  const dec = (v?: number) => (v === undefined ? "–" : v.toFixed(2).replace(".", ","));

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface" tabIndex={0} role="region" aria-label={`Tabel metrik uji ${tahunUji}`}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">Metrik per strategi pada uji {tahunUji}. Tanda bintang menandai yang terbaik per kolom.</caption>
        <thead>
          <tr className="border-b border-line text-left">
            <th scope="col" className="sticky left-0 bg-surface px-3 py-2">Strategi</th>
            {METRIK.map((m) => (
              <th key={m} scope="col" className="px-3 py-2 text-right">{NAMA_METRIK[m]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRATEGI.map((s) => (
            <tr key={s} className={`border-b border-line last:border-0 ${s === "paparan" ? "bg-paper" : ""}`}>
              <th scope="row" className="sticky left-0 bg-inherit px-3 py-2 text-left font-semibold capitalize">
                {NAMA_STRATEGI[s]}
              </th>
              {METRIK.map((m) => {
                const v = nilai(s, m);
                const juara = menang[m] === s;
                return (
                  <td key={m} className={`tabular px-3 py-2 text-right ${juara ? "font-bold" : ""}`}>
                    {m.startsWith("capture") || m === "pr_auc" ? (m === "pr_auc" ? dec(v) : pct(v)) : dec(v)}
                    {juara ? <span aria-label=", terbaik"> ★</span> : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
