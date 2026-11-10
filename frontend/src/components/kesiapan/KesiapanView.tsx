import Link from "next/link";
import { AssumptionNote } from "@/components/ui/AssumptionNote";
import { EmptyState } from "@/components/ui/PageState";
import { formatAngka, keteranganMeter } from "@/lib/format";
import {
  bisaSusunPrioritas,
  kalimatRantaiTerlemah,
  keadaanKesiapan,
  keteranganProvinsi,
  ringkasanPaparan,
  urutkanKesenjangan,
  type ItemView,
} from "@/lib/kesiapan";
import type { CatalogItem, DesaCard, Peran, ReadinessResult, ReferensiPergub } from "@/lib/types";
import { CoverageBar, KataCakupan } from "./CoverageBar";
import { GambarItem } from "./GambarItem";
import { ReadinessGauge } from "./ReadinessGauge";

/**
 * Layar Kesiapan Desa (hero, App Flow v2 §3.7). Satu kesimpulan dalam satu kalimat, lalu buktinya.
 * Murni tampilan: semua angka datang dari props.
 */
export function KesiapanView({
  kode,
  card,
  hasil,
  catalog,
  pergub,
  peran,
}: {
  kode: string;
  card: DesaCard;
  hasil: ReadinessResult;
  catalog: CatalogItem[];
  pergub: ReferensiPergub[];
  peran: Peran;
}) {
  const keadaan = keadaanKesiapan(hasil);
  const items = urutkanKesenjangan(hasil.items, catalog);
  const { desa, paparan } = card;
  const wilayah = `${desa.kecNama}, ${desa.kabNama}`;
  const ketProv = keteranganProvinsi(desa.provKode, pergub);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
      {/* Judul berupa pertanyaan, jawabannya satu kalimat di bawahnya (pola Sparekit). */}
      <header>
        <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          Seberapa siap {desa.nama} menghadapi kemarau?
        </h1>
        <p className="mt-1 text-sm text-muted">{wilayah}</p>
      </header>

      {keadaan === "kosong" ? (
        <div className="mt-6">
          <EmptyState title="Catat alat dulu." action={{ href: `/desa/${kode}/inventaris`, label: "Catat alat" }}>
            Skor kesiapan muncul setelah jumlah alat yang berfungsi dicatat. Ketua MPA atau sekdes bisa mengisinya
            lewat HP.
          </EmptyState>
        </div>
      ) : (
        <>
          <p className="mt-4 max-w-[60ch] text-xl font-semibold leading-snug">{kalimatRantaiTerlemah(hasil, items)}</p>
          <p className="mt-2 max-w-[60ch] text-muted">{ringkasanPaparan(paparan)}</p>

          {/* Skor sebagai kotak besar selebar konten, lalu empat item sebagai kartu, dua per baris (pola kartu Sparekit). */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <section
              aria-labelledby="skor"
              className="grid gap-6 rounded-2xl border border-line bg-surface p-6 md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-10 md:p-8"
            >
              <div>
                <h2 id="skor" className="text-lg font-bold">
                  Skor kesiapan
                </h2>
                <p className="text-sm text-muted">Dari empat item paket minimum, 0 sampai 100.</p>
                <div className="mx-auto mt-6 w-full max-w-[320px]">
                  <ReadinessGauge skor={hasil.skor} status={hasil.status} />
                </div>
              </div>

              <div className="space-y-4">
                <dl className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col-reverse rounded-xl bg-paper p-4">
                    <dt className="text-sm text-muted">Item terpenuhi</dt>
                    <dd className="tabular text-3xl font-semibold tracking-tight">
                      {formatAngka(items.filter((i) => i.coverage >= 1).length)}
                      <span className="text-base font-normal text-muted"> dari {formatAngka(items.length)}</span>
                    </dd>
                  </div>
                  <div className="flex flex-col-reverse rounded-xl bg-paper p-4">
                    <dt className="text-sm text-muted">Paling genting</dt>
                    <dd className="text-lg font-semibold leading-snug">{items[0] && items[0].coverage < 1 ? items[0].nama : "Tidak ada"}</dd>
                  </div>
                </dl>
                {keadaan === "sebagian" ? (
                  <p role="status" className="rounded-xl border border-warn/40 bg-paper px-3 py-2 text-sm">
                    <span className="font-semibold text-warn">Belum lengkap.</span> Item yang belum dicatat dihitung 0.{" "}
                    <Link href={`/desa/${kode}/inventaris`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
                      Lengkapi alat
                    </Link>
                  </p>
                ) : null}
                <Link href={`/desa/${kode}`} className="inline-flex min-h-11 items-center text-sm text-water underline underline-offset-2">
                  Lihat bukti paparan
                </Link>
              </div>
            </section>

            {items.map((it) => (
              <KartuItem key={it.itemKode} it={it} kode={kode} punyaRusak={catalog.find((c) => c.kode === it.itemKode)?.punyaRusak ?? false} />
            ))}
          </div>
        </>
      )}

      <div className="mt-6 space-y-2">
        <AssumptionNote>Paket minimum satu musim adalah asumsi tim dan bisa diubah desa.</AssumptionNote>
        {ketProv ? <p className="text-sm text-muted">{ketProv}</p> : null}
      </div>

      {keadaan !== "kosong" ? (
        <div className="mt-8">
          {bisaSusunPrioritas(peran) ? (
            <Link
              href={`/desa/${kode}/prioritas`}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ember px-6 text-base font-semibold text-white md:inline-flex"
            >
              Susun prioritas
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          ) : (
            <p className="text-sm text-muted">Penyusunan prioritas dilakukan oleh akun desa.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Satu item paket minimum sebagai kartu: gambar, persen besar, keterangan, batang cakupan, lalu tiga angka.
 * Seluruh kartu adalah tautan ke halaman rincian item (/kesiapan/<kode>), yang memuat Catat Alat khusus item itu.
 */
function KartuItem({ it, kode, punyaRusak }: { it: ItemView; kode: string; punyaRusak: boolean }) {
  const kurang = Math.max(it.target - it.berfungsi, 0);
  const angka = [
    { label: "berfungsi", nilai: formatAngka(it.berfungsi) },
    { label: "rusak", nilai: punyaRusak ? formatAngka(it.rusak) : "–" },
    { label: "kurang", nilai: formatAngka(kurang) },
  ];

  return (
    <Link
      href={`/desa/${kode}/kesiapan/${it.itemKode}`}
      aria-labelledby={`item-${it.itemKode}`}
      aria-describedby={`item-${it.itemKode}-ringkas`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-[border-color,box-shadow] hover:border-ink/40 hover:shadow-md focus-visible:shadow-md"
    >
      <div className="flex items-start gap-3">
        <GambarItem kode={it.itemKode} className="size-14" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 id={`item-${it.itemKode}`} className="text-lg font-bold leading-snug">
              {it.nama}
            </h3>
            {it.belumDiisi ? null : <KataCakupan coverage={it.coverage} />}
          </div>
          <p id={`item-${it.itemKode}-ringkas`} className="text-sm text-muted">
            {it.belumDiisi ? "Belum dicatat. Item ini dihitung 0." : `${it.labelPanjang} berfungsi`}
          </p>
        </div>
      </div>

      {it.belumDiisi ? null : (
        <>
          <p className="tabular mt-4 text-5xl font-semibold leading-none tracking-[-0.03em]">{it.persen}%</p>
          <div className="mt-4">
            <CoverageBar persen={it.persen} coverage={it.coverage} nama={it.nama} labelPanjang={it.labelPanjang} />
          </div>
          {it.itemKode === "selang_keluar" ? <p className="mt-2 text-sm text-muted">{keteranganMeter(it.berfungsi)}</p> : null}
          <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-3 [&>div]:mt-1">
            {angka.map((a) => (
              <div key={a.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{a.label}</dt>
                <dd className="tabular text-xl font-semibold tracking-tight">{a.nilai}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <span className={`${it.belumDiisi ? "mt-auto pt-4" : "mt-3"} inline-flex items-center gap-1.5 self-end text-sm font-semibold text-water`}>
        <span className="underline underline-offset-2">{it.belumDiisi ? "Catat sekarang" : "Lihat rincian dan catat"}</span>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
