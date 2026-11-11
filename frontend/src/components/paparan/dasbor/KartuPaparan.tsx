import { formatAngka } from "@/lib/format";
import { LABEL_TIER, headlinePaparan } from "@/lib/kalimat";
import type { DesaPaparan } from "@/lib/types";
import { KepalaKartu, kelasKartu } from "./dasar";

const WARNA_TIER: Record<DesaPaparan["tier"], string> = {
  tinggi: "bg-ember-soft text-ember",
  sedang: "bg-warn-soft text-warn",
  rendah: "bg-ok-soft text-ok",
};

/**
 * Jawaban inti halaman (pola kartu Gross Volume): k dari n tahun kering ekstrem sebagai angka besar,
 * lencana tingkat paparan, lalu tiga bilah rincian berarsir. Tiap bilah punya angka teks di kanan,
 * jadi arti tidak hanya lewat warna atau panjang.
 */
export function KartuPaparan({
  paparan,
  jumlahTahun,
  ekstrem,
}: {
  paparan: DesaPaparan;
  jumlahTahun: number;
  /** Tahun kering ekstrem dan apakah desa terdeteksi pada tahun itu. */
  ekstrem: { tahun: number; kena: boolean }[];
}) {
  const baris = [
    { label: "Tahun kering ekstrem terdeteksi", k: paparan.kExt, n: paparan.nExt, arsir: "arsir-ember" },
    { label: "Tahun biasa terdeteksi", k: paparan.kNorm, n: paparan.nNorm, arsir: "arsir-air" },
    { label: "Tahun tenang beruntun", k: paparan.tahunTenang, n: jumlahTahun, arsir: "arsir-ok" },
  ];

  return (
    <section aria-labelledby="paparan" className={`${kelasKartu} flex flex-col`} style={{ animationDelay: "60ms" }}>
      <KepalaKartu id="paparan" judul="Paparan desa" />
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="tabular text-5xl font-semibold leading-none tracking-[-0.03em]">
          {formatAngka(paparan.kExt)}
          <span className="text-2xl text-muted"> / {formatAngka(paparan.nExt)}</span>
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${WARNA_TIER[paparan.tier]}`}>{LABEL_TIER[paparan.tier]}</span>
      </p>
      <p className="mt-2 text-sm text-muted">tahun kering ekstrem terdeteksi satelit</p>
      <p className="mt-3 text-sm font-semibold leading-snug">{headlinePaparan(paparan)}</p>

      <ul aria-label="Tahun kering ekstrem" className="mt-4 grid grid-cols-4 gap-1.5">
        {ekstrem.map((e, i) => (
          <li
            key={e.tahun}
            className={`masuk flex flex-col items-center gap-1 rounded-xl border px-1 py-2 ${e.kena ? "border-ember/40 bg-ember-soft" : "border-line bg-surface-2"}`}
            style={{ animationDelay: `${180 + i * 70}ms` }}
          >
            <span className="tabular text-sm font-semibold">{e.tahun}</span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${e.kena ? "text-ember" : "text-muted"}`}>
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                {e.kena ? <circle cx="12" cy="12" r="5" fill="currentColor" /> : null}
                <circle cx="12" cy="12" r="9" />
              </svg>
              {e.kena ? "Terdeteksi" : "Tidak"}
              <span className="sr-only">{e.kena ? "" : " terdeteksi"}</span>
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-auto space-y-3.5 pt-5">
        {baris.map((b, i) => (
          <div key={b.label}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <dt className="text-muted">{b.label}</dt>
              <dd className="tabular shrink-0 font-semibold">
                {formatAngka(b.k)} <span className="font-normal text-muted">dari {formatAngka(b.n)}</span>
              </dd>
            </div>
            <span aria-hidden="true" className="mt-1.5 block h-2 overflow-hidden rounded-full bg-line">
              <span
                className={`isi-maju block h-full rounded-full ${b.arsir}`}
                style={{ width: `${b.n > 0 ? (b.k / b.n) * 100 : 0}%`, animationDuration: "800ms", animationDelay: `${200 + i * 90}ms`, animationTimingFunction: "var(--pegas)" }}
              />
            </span>
          </div>
        ))}
      </dl>
    </section>
  );
}
