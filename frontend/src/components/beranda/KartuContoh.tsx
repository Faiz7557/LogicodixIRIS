import Link from "next/link";
import { CONTOH_TAHUN, CONTOH_TERDETEKSI } from "@/content/beranda";

/**
 * Kartu pratinjau mengambang (seperti kartu properti pada referensi): contoh tampilan Kartu Paparan.
 * Diberi label jelas "Contoh tampilan" karena isinya hanya ilustrasi, bukan data desa mana pun.
 */
export function KartuContoh() {
  return (
    <article
      aria-labelledby="kartu-contoh-judul"
      className="relative mx-auto w-full max-w-[300px] rounded-2xl border border-line bg-surface p-3 shadow-xl"
    >
      <span className="absolute right-5 top-5 z-10 rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-white">Contoh tampilan</span>

      <div
        aria-hidden="true"
        className="flex h-28 items-end gap-1 rounded-xl bg-gradient-to-b from-[#f4ebdd] to-[#e9dcc6] p-3"
      >
        {CONTOH_TAHUN.map((t) => {
          const kena = CONTOH_TERDETEKSI.includes(t);
          return <span key={t} className={`flex-1 rounded-sm ${kena ? "h-[68%] bg-ember" : "h-3 bg-white/80"}`} />;
        })}
      </div>

      <div className="px-1 pb-1 pt-3">
        <h3 id="kartu-contoh-judul" className="text-lg font-bold">
          Contoh Desa
        </h3>
        <p className="text-sm text-muted">Contoh Kecamatan, Kalimantan Barat</p>
        <p className="mt-2 text-sm leading-snug">
          Terdeteksi satelit pada 3 dari 4 tahun kering ekstrem.
          <span className="sr-only"> Tahun terdeteksi pada contoh ini: {CONTOH_TERDETEKSI.join(", ")}.</span>
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-ink px-2.5 py-0.5 text-xs font-bold">Paparan tinggi</span>
          <Link href="/desa/contoh" className="inline-flex min-h-11 items-center text-sm font-bold text-water underline underline-offset-2">
            Buka contoh
          </Link>
        </div>
      </div>
    </article>
  );
}
