import type { DesaTahun } from "@/lib/types";

/**
 * Strip 2012-2026 (Design Brief v2 §7). Satu sel per tahun: sel terpapar berwarna ember dengan titik
 * DAN kata "terdeteksi" untuk pembaca layar; tahun ekstrem bergaris bawah. Status tidak hanya warna.
 * HP: 5 kolom agar angka tahun tetap terbaca (minimal 14 px). Laptop: satu baris.
 */
export function YearStrip({ strip, tahunEkstrem }: { strip: DesaTahun[]; tahunEkstrem: number[] }) {
  const terdeteksi = strip.filter((s) => s.terpapar).map((s) => s.tahun);
  const ringkas = terdeteksi.length
    ? `Terdeteksi satelit pada tahun ${terdeteksi.join(", ")}. Tahun kering ekstrem: ${tahunEkstrem.join(", ")}.`
    : `Tidak ada tahun yang memenuhi ambang deteksi satelit. Tahun kering ekstrem: ${tahunEkstrem.join(", ")}.`;

  return (
    <figure>
      <ul role="group" aria-label={ringkas} className="grid grid-cols-5 gap-1.5 md:grid-cols-15">
        {strip.map((s) => {
          const ekstrem = tahunEkstrem.includes(s.tahun);
          return (
            <li
              key={s.tahun}
              className={`flex min-h-14 flex-col items-center justify-center rounded-card border px-1 py-1.5 text-center ${
                s.terpapar ? "border-ember bg-[#fbe9e1]" : "border-line bg-surface"
              }`}
            >
              <span className={`tabular text-sm font-semibold ${ekstrem ? "underline decoration-2 underline-offset-4" : ""}`}>{s.tahun}</span>
              <span aria-hidden="true" className={s.terpapar ? "text-ember" : "text-muted"}>
                {s.terpapar ? "●" : "–"}
              </span>
              <span className="sr-only">
                {s.terpapar ? "terdeteksi" : "tidak terdeteksi"}
                {ekstrem ? ", tahun kering ekstrem" : ""}
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-2 text-sm text-muted">
        <span className="text-ember">●</span> terdeteksi satelit · – tidak terdeteksi · <span className="underline decoration-2 underline-offset-4">garis bawah</span> = tahun kering ekstrem
      </figcaption>
    </figure>
  );
}
