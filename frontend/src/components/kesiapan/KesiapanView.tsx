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
    <div className="mx-auto max-w-[960px] px-4 py-6 md:px-8 md:py-8">
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

          <div className="mt-6 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
            <section aria-labelledby="skor" className="h-fit rounded-2xl border border-line bg-surface p-5">
              <h2 id="skor" className="mb-3 text-sm font-semibold text-muted">
                Skor kesiapan
              </h2>
              <ReadinessGauge skor={hasil.skor} status={hasil.status} />
              {keadaan === "sebagian" ? (
                <p role="status" className="mt-4 rounded-xl border border-warn/40 bg-paper px-3 py-2 text-center text-sm">
                  <span className="font-semibold text-warn">Belum lengkap.</span> Item yang belum dicatat dihitung 0.
                  <br />
                  <Link href={`/desa/${kode}/inventaris`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
                    Lengkapi alat
                  </Link>
                </p>
              ) : null}
              <Link href={`/desa/${kode}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-water underline underline-offset-2">
                Lihat bukti
              </Link>
            </section>

            <section aria-labelledby="rincian" className="rounded-2xl border border-line bg-surface p-5">
              <h2 id="rincian" className="text-lg font-bold">
                Rincian per item
              </h2>
              <p className="text-sm text-muted">Dari kesenjangan terbesar.</p>
              <ul className="mt-3 divide-y divide-line">
                {items.map((it) => (
                  <BarisItem key={it.itemKode} it={it} kode={kode} />
                ))}
              </ul>
            </section>
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

function BarisItem({ it, kode }: { it: ItemView; kode: string }) {
  return (
    <li className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-semibold">{it.nama}</span>
        <span className="tabular text-sm">{it.belumDiisi ? "Belum dicatat" : it.label}</span>
      </div>
      <div className="mt-2">
        <CoverageBar persen={it.persen} coverage={it.coverage} nama={it.nama} labelPanjang={it.labelPanjang} />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        {it.belumDiisi ? (
          <Link href={`/desa/${kode}/inventaris`} className="inline-flex min-h-11 items-center text-sm text-water underline underline-offset-2">
            Catat sekarang
          </Link>
        ) : (
          <KataCakupan coverage={it.coverage} />
        )}
        {!it.belumDiisi && it.rusak > 0 ? (
          <span className="text-sm text-muted">
            {formatAngka(it.rusak)} {it.satuan} rusak
          </span>
        ) : null}
        {!it.belumDiisi && it.itemKode === "selang_keluar" ? (
          <span className="text-sm text-muted">{keteranganMeter(it.berfungsi)}</span>
        ) : null}
      </div>
    </li>
  );
}
