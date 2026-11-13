import Link from "next/link";
import { AssumptionNote } from "@/components/ui/AssumptionNote";
import { RingkasanAi } from "@/components/ui/RingkasanAi";
import {
  bisaSusunPrioritas,
  itemTerkunci,
  kalimatRantaiTerlemah,
  keadaanKesiapan,
  keteranganProvinsi,
  ringkasanPaparan,
  urutkanKesenjangan,
} from "@/lib/kesiapan";
import type { CatalogItem, DesaCard, HargaRow, Peran, ReadinessResult, ReferensiPergub } from "@/lib/types";
import { KalenderSatelit } from "./KalenderSatelit";
import { KotakPetaGudang } from "./model3d/KotakPetaGudang";
import { barisTindakan } from "@/lib/kesiapan";
import { KartuLebih, KartuSkor, TanganiDulu } from "./RingkasanGudang";

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
  harga,
  rencana,
}: {
  kode: string;
  card: DesaCard;
  hasil: ReadinessResult;
  catalog: CatalogItem[];
  pergub: ReferensiPergub[];
  peran: Peran;
  harga: HargaRow[];
  /** Pagu tersimpan dan skor sesudah belanja sesuai pagu itu (dihitung server, mesin yang sama dengan Prioritas). */
  rencana: { paguRp: number; skorSesudah: number };
}) {
  const keadaan = keadaanKesiapan(hasil);
  const items = urutkanKesenjangan(hasil.items, catalog);
  const baris = barisTindakan(items, catalog, harga);
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
        <RingkasanAi halaman="kesiapan" kode={kode} className="mt-3" />
      </header>

      {/* Dasbor selalu tampil, juga sebelum ada alat yang dicatat: peta 3D, kartu, dan riwayat satelit
          sudah bermakna dari data publik. Saat kosong, ajakan mencatat alat ada di paling atas. */}
      <>
          {keadaan === "kosong" ? (
            <div className="mt-4 flex flex-col gap-3 rounded-panel border border-dashed border-line-2 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xl font-semibold leading-snug">Belum ada alat yang dicatat.</p>
                <p className="mt-1 max-w-[60ch] text-sm text-muted">
                  Skor kesiapan masih 0 sampai jumlah alat yang berfungsi dicatat. Ketua MPA atau sekdes bisa mengisinya lewat HP.
                </p>
              </div>
              <Link
                href={`/desa/${kode}/inventaris`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-ink px-5 font-semibold text-white"
              >
                Catat alat
              </Link>
            </div>
          ) : (
            <p className="mt-4 max-w-[60ch] text-xl font-semibold leading-snug">{kalimatRantaiTerlemah(hasil, items)}</p>
          )}
          <p className="mt-2 max-w-[60ch] text-muted">
            {ringkasanPaparan(paparan)}{" "}
            <Link href={`/desa/${kode}`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
              Lihat bukti paparan
            </Link>
          </p>
          {keadaan === "sebagian" ? (
            <p role="status" className="mt-2 w-fit rounded-xl border border-warn/40 bg-paper px-3 py-1 text-sm">
              <span className="font-semibold text-warn">Belum lengkap.</span> Item yang belum dicatat dihitung 0.{" "}
              <Link href={`/desa/${kode}/inventaris`} className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
                Lengkapi alat
              </Link>
            </p>
          ) : null}

          {/* Peta gudang (pola peta kilang Sparekit): hanya item yang punya keadaan rusak. */}
          <section aria-labelledby="peta-gudang" className="mt-6">
            <h2 id="peta-gudang" className="sr-only">
              Peta gudang alat
            </h2>
            <KotakPetaGudang
              kode={kode}
              barang={items
                .filter((it) => catalog.find((c) => c.kode === it.itemKode)?.punyaRusak)
                .map((it) => ({
                  kode: it.itemKode,
                  nama: it.nama,
                  satuan: it.satuan,
                  target: it.target,
                  berfungsi: it.berfungsi,
                  rusak: it.rusak,
                  belumDiisi: it.belumDiisi,
                }))
                // Item terkunci (sumur bor di desa tanpa gambut) tetap ada di peta, digembok.
                .concat(
                  itemTerkunci(catalog, desa.peatFrac).map((c) => ({
                    kode: c.kode,
                    nama: c.nama,
                    satuan: c.satuan,
                    target: 0,
                    berfungsi: 0,
                    rusak: 0,
                    belumDiisi: false,
                    terkunci: true,
                  })),
                )}
            />
          </section>

          {/* Di bawah peta (pola Sparekit): yang perlu ditangani dulu, lalu skor dan cadangan berdampingan, lalu kartu tiap item. */}
          <div className="mt-4">
            <TanganiDulu kode={kode} baris={baris} />
          </div>
          {/* Dua kartu sejajar: skor dan cadangan. */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <KartuSkor
              skor={hasil.skor}
              status={hasil.status}
              skorSesudah={rencana.skorSesudah}
              paguRp={rencana.paguRp}
              baris={baris}
              kode={kode}
              bisaPrioritas={bisaSusunPrioritas(peran)}
            />
            <KartuLebih kode={kode} items={items} hargaRows={harga} />
          </div>

          {/* Pengganti kalender Sparekit: riwayat deteksi satelit desa. */}
          <div className="mt-4">
            <KalenderSatelit kode={kode} strip={card.strip} tahunEkstrem={card.tahunEkstrem} paparan={paparan} />
          </div>
      </>

      <div className="mt-6 space-y-2">
        <AssumptionNote>Paket minimum satu musim adalah asumsi tim dan bisa diubah desa.</AssumptionNote>
        {ketProv ? <p className="text-sm text-muted">{ketProv}</p> : null}
      </div>

      {keadaan !== "kosong" ? (
        <div className="mt-8">
          {bisaSusunPrioritas(peran) ? (
            <Link
              href={`/desa/${kode}/prioritas/pagu`}
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
