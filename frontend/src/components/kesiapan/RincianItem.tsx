import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { TanggalHariIni } from "@/components/ui/TanggalHariIni";
import { formatAngka, formatRupiah, formatTanggal, keteranganMeter } from "@/lib/format";
import type { CatalogItem, HargaRow, InventoryRow, Peran, ReadinessItem, ReadinessResult, Status } from "@/lib/types";
import { CatatDenganPratinjau } from "./CatatDenganPratinjau";
import { KataCakupan } from "./CoverageBar";
import { GambarItem } from "./GambarItem";
import { KotakModel3D } from "./model3d/KotakModel3D";
import { ReadinessGauge } from "./ReadinessGauge";

/** Status satu item dari cakupannya, dengan ambang yang sama dengan mesin (TRD §6). */
function statusItem(coverage: number): Status {
  if (coverage >= 1) return "siap";
  if (coverage < 0.25) return "rawan";
  return "sebagian";
}

// Item yang sudah punya model 3D prosedural (lihat model3d/). Item lain menampilkan ilustrasi sementara.
const PUNYA_MODEL_3D = new Set(["pompa_jinjing"]);

// Keterangan khusus tiap item, ditulis sebagai fakta paket, bukan klaim dampak.
const CATATAN_ITEM: Record<string, string> = {
  selang_keluar: "Panjang dihitung dengan asumsi 20 m per buah.",
  sumur_bor: "Hanya dihitung untuk desa yang memiliki lahan gambut.",
  pompa_jinjing: "Pompa yang rusak dihitung terpisah dari yang berfungsi.",
  dana_operasi: "Dihitung dalam minggu operasi yang sudah tersedia dananya.",
};

/**
 * Rincian satu item paket minimum (pola halaman mesin Sparekit): judul dan kalimat ringkas,
 * kotak model 3D (sementara placeholder) dengan gauge dan daftar kondisi di sampingnya, kartu angka,
 * formulir Catat Alat khusus item ini, lalu ajakan lanjut.
 */
export function RincianItem({
  kode,
  item,
  hasil,
  desa,
  catalog,
  harga,
  tersimpan,
  terakhir,
  namaPengisi,
  peran,
}: {
  kode: string;
  item: CatalogItem;
  hasil: ReadinessItem;
  /** Kesiapan seluruh desa dan katalog lengkap, untuk pratinjau skor saat mengisi. */
  desa: ReadinessResult;
  catalog: CatalogItem[];
  harga: HargaRow[];
  tersimpan: InventoryRow[];
  terakhir: { oleh: string; waktu: string } | null;
  namaPengisi: string;
  peran: Peran;
}) {
  const { satuan } = item;
  const kurang = Math.max(hasil.target - hasil.berfungsi, 0);
  const lebih = Math.max(hasil.berfungsi - hasil.target, 0);
  const persen = Math.round(Math.min(Math.max(hasil.coverage, 0), 1) * 100);
  const beli = harga.find((h) => h.itemKode === item.kode && h.aksi === "beli");
  const perbaiki = harga.find((h) => h.itemKode === item.kode && h.aksi === "perbaiki");
  const biayaBeli = beli ? kurang * beli.hargaRp : null;
  const biayaPerbaiki = perbaiki ? hasil.rusak * perbaiki.hargaRp : null;
  const n = (x: number) => `${formatAngka(x)} ${satuan}`;
  // Dana operasi bukan alat: "tersedia", bukan "berfungsi".
  const kataAda = item.punyaRusak ? "berfungsi" : "tersedia";

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 md:px-8 md:py-8">
      <Link href={`/desa/${kode}/kesiapan`} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-ink">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Kesiapan
      </Link>

      <header className="flex items-center gap-4">
        <GambarItem kode={item.kode} className="size-14" />
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{item.nama}</h1>
          <p className="mt-1">
            <KataCakupan coverage={hasil.coverage} />
          </p>
        </div>
      </header>

      <p className="mt-4 max-w-[70ch] text-lg leading-snug">
        {hasil.belumDiisi ? (
          <>
            <span className="font-semibold text-ember">Belum dicatat.</span> Item ini dihitung 0 sampai jumlahnya diisi di bawah.
          </>
        ) : kurang > 0 ? (
          <>
            <span className="font-semibold text-ember">Kurang {n(kurang)}</span> untuk memenuhi paket minimum {n(hasil.target)}. Saat ini{" "}
            {n(hasil.berfungsi)} {kataAda}{item.punyaRusak ? ` dan ${n(hasil.rusak)} rusak` : ""}.
          </>
        ) : (
          <>
            <span className="font-semibold text-ok">Paket minimum terpenuhi:</span> {n(hasil.berfungsi)} {kataAda} dari {n(hasil.target)}.
          </>
        )}
      </p>

      {/* Baris atas: kotak model 3D (placeholder) di kiri, gauge dan daftar kondisi di kanan. */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section
          aria-labelledby="model-judul"
          className="relative flex min-h-[320px] flex-col overflow-hidden rounded-panel border border-line bg-gradient-to-b from-[#f3f1ec] to-[#e4e0d6] lg:min-h-[460px]"
        >
          <h2 id="model-judul" className="sr-only">
            {item.punyaRusak ? `Model 3D ${item.nama}` : `Ringkasan ${item.nama.toLowerCase()}`}
          </h2>
          {PUNYA_MODEL_3D.has(item.kode) ? (
            <KotakModel3D kode={item.kode} nama={item.nama.toLowerCase()} />
          ) : !item.punyaRusak ? (
            <KotakDana hasil={hasil} satuan={satuan} harga={beli} />
          ) : (
            <>
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <GambarItem kode={item.kode} className="size-40 bg-white/60 shadow-sm" />
                <p className="max-w-[36ch] text-sm text-muted">
                  Model 3D {item.nama.toLowerCase()} akan tampil di sini. Untuk sementara, gambar ini hanya ilustrasi.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Buka model 3D
                </button>
                <span className="rounded-full bg-surface px-3 py-1.5 text-sm text-muted shadow-sm">Model 3D belum tersedia</span>
              </div>
            </>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <Panel className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold leading-snug">Cakupan paket minimum</h2>
              <span className="whitespace-nowrap text-sm text-muted">target {n(hasil.target)}</span>
            </div>
            <div className="mx-auto mt-3 w-full max-w-[240px]">
              <ReadinessGauge skor={persen} status={statusItem(hasil.coverage)} label={{ teks: `${persen}%`, sr: " dari paket minimum" }} />
            </div>
            <p className="mt-2 text-center text-sm text-muted">
              {formatAngka(hasil.berfungsi)} dari {n(hasil.target)} {kataAda}
            </p>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <h2 className="font-bold">{item.punyaRusak ? "Kondisi alat" : "Kondisi dana"}</h2>
              {kurang > 0 ? <span className="text-sm font-semibold text-ember">{n(kurang)} kurang</span> : null}
            </div>
            <ul className="divide-y divide-line border-t border-line">
              <BarisKondisi
                ragam="ok"
                judul={item.punyaRusak ? "Berfungsi" : "Tersedia"}
                isi={item.punyaRusak ? `Ada ${n(hasil.berfungsi)} siap dipakai` : `Dana untuk ${n(hasil.berfungsi)} operasi`}
                kanan="Siap"
              />
              {item.punyaRusak ? (
                <BarisKondisi
                  ragam={hasil.rusak > 0 ? "danger" : "netral"}
                  judul="Rusak"
                  isi={`${n(hasil.rusak)} perlu diperbaiki`}
                  kanan={hasil.rusak > 0 ? "Perbaiki" : "–"}
                />
              ) : null}
              <BarisKondisi
                ragam={kurang > 0 ? "warn" : "netral"}
                judul="Kurang dari paket"
                isi={`${n(kurang)} perlu ditambah`}
                kanan={kurang > 0 ? "Tambah" : "–"}
              />
            </ul>
          </Panel>
        </div>
      </div>

      {/* Baris kartu angka (pola kartu ringkasan Sparekit). */}
      <section aria-labelledby="angka" className="mt-4">
        <h2 id="angka" className="sr-only">
          Angka {item.nama}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KartuAngka
            gelap={kurang > 0}
            ikon={<IconPeringatan />}
            nilai={formatAngka(kurang)}
            satuan={satuan}
            label="Kurang dari paket minimum"
          />
          {item.punyaRusak ? (
            <KartuAngka
              ikon={<IconKunci />}
              nilai={formatAngka(hasil.rusak)}
              satuan={satuan}
              label="Perlu diperbaiki"
              catatan={
                hasil.rusak === 0
                  ? "Tidak ada yang rusak."
                  : biayaPerbaiki !== null
                    ? `Perkiraan biaya perbaikan ${formatRupiah(biayaPerbaiki)} (${formatAngka(hasil.rusak)} × ${formatRupiah(perbaiki!.hargaRp)}).`
                    : "Belum ada harga perbaikan bersumber."
              }
            />
          ) : (
            // Dana tidak bisa rusak: kartu ini menunjukkan cadangan di atas paket minimum.
            <KartuAngka
              ikon={<IconCadangan />}
              nilai={formatAngka(lebih)}
              satuan={satuan}
              label="Lebih dari paket minimum"
              catatan={
                lebih > 0
                  ? `Cadangan bila kemarau lebih panjang${beli ? `, setara ${formatRupiah(lebih * beli.hargaRp)}` : ""}.`
                  : "Belum ada cadangan di atas paket minimum."
              }
            />
          )}
          <KartuAngka
            ikon={<IconRupiah />}
            nilai={biayaBeli !== null ? formatRupiah(biayaBeli) : "–"}
            label="Perkiraan biaya menambah"
            catatan={beli ? `${formatAngka(kurang)} × ${formatRupiah(beli.hargaRp)}. Sumber: ${beli.sumber}` : "Belum ada harga bersumber untuk item ini."}
          />
          {/* Harga satuan dengan tanggal hari ini (berganti sendiri tiap hari). Sumber dan tanggal cek tetap ditulis:
              ini harga acuan dokumen, bukan harga pasar harian. */}
          <KartuAngka
            ikon={<IconKalender />}
            nilai={beli ? formatRupiah(beli.hargaRp) : "–"}
            satuan={beli ? `/ ${satuan}` : ""}
            label={
              <>
                Harga satuan per <TanggalHariIni />
              </>
            }
            catatan={
              beli
                ? `Harga acuan ${beli.sumber}${beli.tanggal ? `, terakhir dicek ${formatTanggal(beli.tanggal)}` : ""}.`
                : "Belum ada harga bersumber untuk item ini."
            }
          />
        </div>
        <p className="mt-3 text-sm text-muted">
          {item.kode === "selang_keluar" ? `${keteranganMeter(hasil.berfungsi)}. ` : ""}
          {CATATAN_ITEM[item.kode] ?? ""} Paket minimum {n(hasil.target)} adalah asumsi tim dan bisa diubah desa. Perkiraan biaya hanya harga satuan × jumlah,
          bukan usulan.
        </p>
      </section>

      {/* Catat alat khusus item ini. */}
      <section aria-labelledby="catat" className="mt-8">
        <h2 id="catat" className="text-xl font-bold">
          Catat {item.nama.toLowerCase()}
        </h2>
        <p className="mt-1 text-sm text-muted">{item.punyaRusak ? "Perbarui jumlah yang ada dan yang masih berfungsi." : `Perbarui berapa ${satuan} operasi yang sudah ada dananya.`} Item lain tidak ikut berubah. Prediksi di bawahnya ikut bergerak saat angka diubah.</p>
        <div className="mt-4">
          <CatatDenganPratinjau
            kode={kode}
            item={item}
            catalog={catalog}
            items={desa.items}
            skorAwal={desa.skor}
            statusAwal={desa.status}
            tersimpan={tersimpan.filter((r) => r.itemKode === item.kode)}
            terakhir={terakhir}
            namaPengisi={namaPengisi}
          />
        </div>
      </section>

      {/* Ajakan lanjut (pola "Lihat 97 suku cadang di papan Tugas"). */}
      <Link
        href={peran === "desa" ? `/desa/${kode}/prioritas` : `/desa/${kode}/inventaris`}
        className="group mt-8 flex items-center gap-4 rounded-panel border border-line bg-surface p-5 shadow-card hover:border-ink/40"
      >
        <GambarItem kode={item.kode} className="size-11" />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{peran === "desa" ? "Susun prioritas belanja desa" : "Catat semua alat sekaligus"}</span>
          <span className="block text-sm text-muted">
            {peran === "desa"
              ? `Lihat apakah ${item.nama.toLowerCase()} masuk daftar belanja di bawah pagu.`
              : "Buka formulir Catat Alat untuk keempat item."}
          </span>
        </span>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}

/**
 * Pengganti kotak model 3D untuk item yang bukan alat (dana operasi): satu kotak per minggu target,
 * terisi bila dananya sudah ada, lalu padanan rupiah dari harga acuan per minggu.
 * Kotak kosong bergaris putus-putus supaya "kurang" terbaca tanpa bergantung warna.
 */
function KotakDana({ hasil, satuan, harga }: { hasil: ReadinessItem; satuan: string; harga?: HargaRow }) {
  const ada = Math.max(hasil.berfungsi, 0);
  const kurang = Math.max(hasil.target - ada, 0);
  const sel = Math.max(hasil.target, ada);
  const MAKS_SEL = 26; // setengah tahun; lebih dari itu cukup angka saja
  const rp = (x: number) => (harga ? formatRupiah(x * harga.hargaRp) : null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div>
        <p className="text-sm font-semibold text-muted">Minggu operasi yang sudah ada dananya</p>
        <p className="tabular mt-1 flex flex-wrap items-baseline gap-x-2">
          <span className="text-5xl font-semibold leading-none tracking-tight">{formatAngka(ada)}</span>
          <span className="text-lg text-muted">
            dari {formatAngka(hasil.target)} {satuan}
          </span>
        </p>
      </div>

      {sel > 0 && sel <= MAKS_SEL ? (
        <ol aria-label={`${formatAngka(ada)} dari ${formatAngka(hasil.target)} ${satuan} sudah ada dananya`} className="flex flex-wrap gap-2">
          {Array.from({ length: sel }, (_, i) => {
            const terisi = i < ada;
            return (
              <li
                key={i}
                aria-hidden="true"
                className={`flex h-14 w-16 flex-col items-center justify-center rounded-xl text-xs font-semibold ${
                  terisi ? "bg-water text-white shadow-sm" : "border-2 border-dashed border-line-2 bg-white/50 text-muted"
                }`}
              >
                <span>Minggu</span>
                <span className="tabular text-base leading-none">{i + 1}</span>
              </li>
            );
          })}
        </ol>
      ) : null}

      <dl className="mt-auto grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4">
          <dt className="text-sm text-muted">Setara dana yang tersedia</dt>
          <dd className="tabular mt-1 text-xl font-semibold">{rp(ada) ?? "–"}</dd>
        </div>
        <div className="rounded-2xl bg-white/70 p-4">
          <dt className="text-sm text-muted">Dana yang masih dibutuhkan</dt>
          <dd className={`tabular mt-1 text-xl font-semibold ${kurang > 0 ? "text-ember" : ""}`}>{kurang > 0 ? (rp(kurang) ?? "–") : "Tidak ada"}</dd>
        </div>
      </dl>
      <p className="-mt-3 text-sm text-muted">
        {harga
          ? `Dihitung dari harga acuan ${formatRupiah(harga.hargaRp)} per ${satuan} (${harga.sumber}).`
          : `Harga acuan per ${satuan} belum diisi, jadi padanan rupiah belum bisa dihitung.`}
      </p>
    </div>
  );
}

const RAGAM = {
  ok: "bg-ok-soft",
  warn: "bg-warn-soft",
  danger: "bg-danger-soft",
  netral: "bg-surface",
} as const;

function BarisKondisi({ ragam, judul, isi, kanan }: { ragam: keyof typeof RAGAM; judul: string; isi: string; kanan: string }) {
  const warnaKanan = ragam === "ok" ? "text-ok" : ragam === "warn" ? "text-warn" : ragam === "danger" ? "text-danger" : "text-muted";
  return (
    <li className={`flex items-center justify-between gap-3 px-5 py-3 ${RAGAM[ragam]}`}>
      <span className="min-w-0">
        <span className="block font-semibold">{judul}</span>
        <span className="block text-sm text-muted">{isi}</span>
      </span>
      <span className={`shrink-0 text-sm font-semibold ${warnaKanan}`}>{kanan}</span>
    </li>
  );
}

function KartuAngka({
  ikon,
  nilai,
  satuan,
  label,
  catatan,
  gelap = false,
}: {
  ikon: React.ReactNode;
  nilai: string;
  satuan?: string;
  label: React.ReactNode;
  catatan?: string;
  gelap?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-panel border p-5 shadow-card ${
        gelap ? "border-transparent bg-gradient-to-br from-[#1f2a36] via-[#2b3440] to-[#4a3a2e] text-white" : "border-line bg-surface"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex size-11 items-center justify-center rounded-xl ${gelap ? "bg-white text-danger" : "bg-paper text-ink"}`}
      >
        {ikon}
      </span>
      <p>
        {/* Angka panjang (mis. Rp28.028.610) dikecilkan supaya tidak terpotong di kartu sempit. */}
        <span className={`tabular block font-semibold leading-tight tracking-[-0.03em] ${nilai.length > 10 ? "text-2xl" : "text-3xl"}`}>
          {nilai}
          {satuan ? <span className={`ml-1 text-base font-normal ${gelap ? "text-white/70" : "text-muted"}`}>{satuan}</span> : null}
        </span>
        <span className={`mt-1 block text-sm font-semibold ${gelap ? "text-white/90" : ""}`}>{label}</span>
      </p>
      {catatan ? <p className={`mt-auto text-sm ${gelap ? "text-white/70" : "text-muted"}`}>{catatan}</p> : null}
    </div>
  );
}

const ikon = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function IconPeringatan() {
  return (
    <svg {...ikon}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5h.01" />
    </svg>
  );
}
function IconKalender() {
  return (
    <svg aria-hidden="true" {...ikon}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

function IconCadangan() {
  return (
    <svg {...ikon}>
      <path d="M4 7l8-4 8 4-8 4z" />
      <path d="M4 12l8 4 8-4M4 17l8 4 8-4" />
    </svg>
  );
}
function IconKunci() {
  return (
    <svg {...ikon}>
      <path d="M14.5 6.500a4 4 0 0 0-5.300 5.300L4 17v3h3l5.200-5.200a4 4 0 0 0 5.300-5.300l-2.500 2.500-2.500-2.500z" />
    </svg>
  );
}
function IconRupiah() {
  return (
    <svg {...ikon}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.500" />
      <path d="M6 9v.01M18 15v.01" />
    </svg>
  );
}
