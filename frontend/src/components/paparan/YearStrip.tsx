import type { DesaTahun } from "@/lib/types";

/**
 * Riwayat 2012-2026 sebagai timeline batang (Design Brief v2 §7). Satu kolom per tahun:
 * batang tinggi berwarna ember = terdeteksi satelit, garis pendek = tidak terdeteksi.
 * Tahun kering ekstrem diberi latar pasir dan label tebal. Arti tidak hanya lewat warna:
 * ada legenda teks, ringkasan kalimat di bawah, dan teks untuk pembaca layar per kolom.
 * HP: label tahun dua digit agar 15 kolom muat pada 360 px. Laptop: empat digit.
 */
export function YearStrip({ strip, tahunEkstrem }: { strip: DesaTahun[]; tahunEkstrem: number[] }) {
  const terdeteksi = strip.filter((s) => s.terpapar).map((s) => s.tahun);
  const ringkas = terdeteksi.length
    ? `Terdeteksi satelit pada ${terdeteksi.join(", ")}. ${strip.length - terdeteksi.length} tahun lainnya tidak terdeteksi.`
    : `Tidak ada tahun yang memenuhi ambang deteksi satelit sejak ${strip[0]?.tahun ?? 2012}.`;

  return (
    <figure>
      <ul role="list" aria-label="Riwayat deteksi satelit per tahun" className="flex items-stretch gap-0.5 sm:gap-1">
        {strip.map((s) => {
          const ekstrem = tahunEkstrem.includes(s.tahun);
          return (
            <li key={s.tahun} className={`flex min-w-0 flex-1 flex-col items-center rounded-lg pt-2 ${ekstrem ? "bg-[#f4ebdd]" : ""}`}>
              <div aria-hidden="true" className="flex h-24 w-full items-end justify-center px-0.5 sm:px-1">
                <span className={`block w-full max-w-7 rounded-t-md ${s.terpapar ? "h-full bg-ember" : "h-1.5 rounded-b-md bg-line"}`} />
              </div>
              <span className={`tabular py-1.5 text-sm leading-none ${ekstrem ? "font-bold text-ink" : "text-muted"}`}>
                <span className="sm:hidden" aria-hidden="true">
                  {String(s.tahun).slice(2)}
                </span>
                <span className="hidden sm:inline" aria-hidden="true">
                  {s.tahun}
                </span>
                <span className="sr-only">
                  {s.tahun}: {s.terpapar ? "terdeteksi" : "tidak terdeteksi"}
                  {ekstrem ? ", tahun kering ekstrem" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ul>

      <ul aria-label="Keterangan" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3.5 w-2.5 rounded-sm bg-ember" />
          Terdeteksi satelit
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-1.5 w-2.5 rounded-sm bg-line" />
          Tidak terdeteksi
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="size-3.5 rounded-sm bg-[#f4ebdd] ring-1 ring-line" />
          <span>
            Tahun kering ekstrem <span className="font-bold text-ink">(tebal)</span>
          </span>
        </li>
      </ul>
      <figcaption className="mt-2 text-sm">{ringkas}</figcaption>
    </figure>
  );
}
