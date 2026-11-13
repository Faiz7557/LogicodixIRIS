import { formatAngka } from "@/lib/format";
import { LABEL_TIER, headlinePaparan } from "@/lib/kalimat";
import type { DesaPaparan } from "@/lib/types";
import { KepalaKartu, kelasKartu, type TahunDasbor } from "./dasar";
import { RincianTahun } from "./GrafikRiwayat";

const WARNA_TIER: Record<DesaPaparan["tier"], string> = {
  tinggi: "bg-ember-soft text-ember",
  sedang: "bg-warn-soft text-warn",
  rendah: "bg-ok-soft text-ok",
};

/**
 * Jawaban inti halaman (pola kartu Gross Volume): k dari n tahun kering ekstrem sebagai angka besar,
 * lencana tingkat paparan, rincian tahun yang dipilih di grafik riwayat, lalu tiga bilah rincian berarsir. Tiap bilah punya angka teks di kanan,
 * jadi arti tidak hanya lewat warna atau panjang.
 */
export function KartuPaparan({
  paparan,
  jumlahTahun,
  tahun,
}: {
  paparan: DesaPaparan;
  jumlahTahun: number;
  /** Tahun yang sedang dipilih di grafik riwayat. */
  tahun: TahunDasbor;
}) {
  const baris = [
    { label: "Tahun kering ekstrem terdeteksi", k: paparan.kExt, n: paparan.nExt, arsir: "arsir-ember" },
    { label: "Tahun biasa terdeteksi", k: paparan.kNorm, n: paparan.nNorm, arsir: "arsir-air" },
    { label: "Tahun tenang beruntun", k: paparan.tahunTenang, n: jumlahTahun, arsir: "arsir-ok" },
  ];

  return (
    <section aria-labelledby="paparan" className={`${kelasKartu} flex flex-col`} style={{ animationDelay: "60ms" }}>
      <KepalaKartu id="paparan" judul="Paparan desa" />
      {/*
       * Kartu ini ikut setinggi grafik riwayat di sebelahnya. Sisa tinggi dibagi rata di antara tiga blok
       * (angka utama, rincian tahun, bilah), bukan menumpuk jadi satu celah kosong.
       */}
      <div className="mt-3 flex flex-1 flex-col justify-between gap-5">
      <div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="tabular text-5xl font-semibold leading-none tracking-[-0.03em]">
          {formatAngka(paparan.kExt)}
          <span className="text-2xl text-muted"> / {formatAngka(paparan.nExt)}</span>
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${WARNA_TIER[paparan.tier]}`}>{LABEL_TIER[paparan.tier]}</span>
      </p>
      <p className="mt-2 text-sm text-muted">tahun kering ekstrem terdeteksi satelit</p>
      <p className="mt-3 text-sm font-semibold leading-snug">{headlinePaparan(paparan)}</p>
      </div>

      {/* Rincian tahun yang dipilih di grafik riwayat; mengisi sisa tinggi kartu. */}
      <RincianTahun d={tahun} />

      <dl className="space-y-3.5">
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
      </div>
    </section>
  );
}
