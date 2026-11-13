"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PenggerakGulir } from "@/components/beranda/gerak/PenggerakGulir";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { formatRupiah, formatSkor } from "@/lib/format";
import { anggaranSementara, barisDisetujui, keyBaris, skorSetelahDisetujui, totalBiaya } from "@/lib/prioritas";
import type { Aksi, PriorityRow } from "@/lib/types";
import { RingkasKeputusan } from "./GrafikPrioritas";
import { KepalaPrioritas } from "./KepalaPrioritas";
import { PanelPaketHarga, type Edit } from "./PanelPaketHarga";
import { PapanKeputusan, keputusanUntuk, type Kolom } from "./PapanKeputusan";
import { AksiLabel } from "./PriorityRow";
import { usePrioritas, type DataPrioritas } from "./usePrioritas";

/**
 * Langkah 2, Keputusan (App Flow v2 §3.8): papan saran belanja dari sistem untuk pagu yang tersimpan
 * di paling atas, lalu item yang belum punya harga, ringkasan pagu dan keputusan, serta pengaturan paket
 * minimum dan harga. Pagu diisi di langkah 1.
 */
export function PrioritasView(data: DataPrioritas) {
  const { kode, namaDesa, catalog } = data;
  const p = usePrioritas(data);
  const { hasil, keputusan, ringkas, disetujui, pagu } = p;
  // Tautan dari layar lain (mis. kartu "Perlu diperbaiki" di Kesiapan): ?isi=<item>:<aksi> membuka formulir harga.
  const isi = useSearchParams().get("isi");
  const [edit, setEdit] = useState<Edit>(() =>
    editDariTautan(
      isi,
      catalog.map((c) => c.kode),
    ),
  );
  const panelRef = useRef<HTMLDivElement>(null);

  // Simulasi untuk kartu bayangan: sisa anggaran dan skor bila satu saran dipindah ke kolom lain.
  function simulasi(b: PriorityRow, ke: Kolom) {
    const k = keyBaris(b);
    const coba = { ...keputusan, [k]: { ...keputusan[k], keputusan: keputusanUntuk(ke) } };
    const d = barisDisetujui(hasil.terpilih, coba);
    return { sisaRp: anggaranSementara(p.paguBebas, d).sisaRp, skor: skorSetelahDisetujui(p.readiness, catalog, d) };
  }

  function bukaIsiHarga(itemKode: string, aksi: Aksi = "beli") {
    setEdit({ jenis: "harga", itemKode, aksi });
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // Formulir dari tautan sudah terbuka sejak render pertama; tinggal digulir ke panelnya.
  const dariTautan = useRef(edit !== null);
  useEffect(() => {
    if (dariTautan.current) panelRef.current?.scrollIntoView({ block: "start" });
  }, []);

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      {/* Animasi masuk: bagian muncul bertahap saat terlihat (tanpa JS atau gerak dikurangi: tampil biasa). */}
      <PenggerakGulir />
      <KepalaPrioritas
        kode={kode}
        namaDesa={namaDesa}
        aktif={2}
        ringkas={p.ringkasLangkah}
        judul="Apa yang perlu dibeli dulu?"
        kalimat={p.kalimat}
        menghitung={p.menghitung}
        galat={p.galat}
      />

      <section aria-labelledby="terpilih" className="mt-4">
        <div data-muncul style={tunda(200)} className="flex flex-wrap items-center gap-2">
          <h2 id="terpilih" className="text-lg font-bold">
            Saran belanja dari sistem
          </h2>
          {hasil.terpilih.length > 0 ? (
            <span className="tabular rounded-full bg-ink px-2.5 py-0.5 text-sm font-semibold text-white">{hasil.terpilih.length}</span>
          ) : null}
        </div>
        {hasil.terpilih.length > 0 || p.terkunci.length > 0 ? (
          <>
            {hasil.terpilih.length === 0 ? (
              // Belum ada saran baru, tetapi riwayat yang sudah dibuat surat tetap tampil di kolom Disetujui.
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-dashed border-line-2 bg-surface px-4 py-3">
                <p className="text-sm">
                  <span className="font-semibold">Belum ada saran baru.</span>{" "}
                  {p.paguBebas === 0 ? "Anggaran sudah habis dipakai surat usulan sebelumnya." : p.kalimat}
                </p>
                <Link
                  href={`/desa/${kode}/prioritas/pagu`}
                  className="min-h-10 shrink-0 content-center rounded-lg border border-line bg-paper px-3 text-sm font-semibold"
                >
                  Ubah anggaran
                </Link>
              </div>
            ) : null}
            <p data-muncul style={tunda(260)} className="mt-1 max-w-[80ch] text-sm text-muted">
              Disusun otomatis dari catatan alat MPA, paket minimum, dan harga acuan. Nomor kartu adalah urutan dari sistem.
            </p>
            <ol data-muncul style={tunda(320)} className="mt-3 grid gap-2 sm:grid-cols-3">
              {LANGKAH_PAPAN.map((l, i) => (
                <li key={l.judul} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5">
                  <span aria-hidden="true" className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 text-sm leading-tight">
                    <span className="block font-semibold">{l.judul}</span>
                    <span className="block text-muted">{l.isi}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div data-muncul style={tunda(380)}>
              <PapanKeputusan
                terpilih={hasil.terpilih}
                keputusan={keputusan}
                terkunci={p.terkunci}
                nama={p.nama}
                satuan={p.satuan}
                sumberHarga={p.sumberHarga}
                stok={(kode) => p.readiness.items.find((i) => i.itemKode === kode)}
                sekarang={{ sisaRp: p.sisaSementara, skor: p.skorDisetujui }}
                simulasi={simulasi}
                onKeputusan={(b, k) => p.pilihKeputusan(b.itemKode, b.aksi, k, keputusan[keyBaris(b)]?.catatan)}
                onCatatan={(b, k, c) => p.ubahCatatan(b.itemKode, b.aksi, k, c)}
              />
            </div>
          </>
        ) : (
          <div data-muncul style={tunda(260)} className="mt-3">
            <EmptyState
              title={
                p.keadaan === "terpenuhi"
                  ? "Kebutuhan sudah terpenuhi."
                  : p.keadaan === "kurang"
                    ? "Belum ada belanja yang muat."
                    : p.keadaan === "tanpaHarga"
                      ? "Belum ada harga."
                      : "Belum ada urutan."
              }
              action={{ href: `/desa/${kode}/prioritas/pagu`, label: "Isi anggaran" }}
            >
              {p.kalimat}
            </EmptyState>
          </div>
        )}
      </section>

      {/* Item tanpa harga belum bisa masuk saran: langsung di bawah papan supaya tidak terlewat. */}
      {hasil.tanpaHarga.length > 0 ? (
        <section data-muncul aria-labelledby="tanpa-harga" className="mt-6 rounded-panel border border-warn/40 bg-warn-soft p-4 md:p-5">
          <h2 id="tanpa-harga" className="font-bold">
            Belum punya harga ({hasil.tanpaHarga.length})
          </h2>
          <p className="text-sm text-muted">Item ini belum masuk saran karena harganya belum ada. Isi harga dari penawaran setempat.</p>
          <ul className="mt-3 space-y-2">
            {hasil.tanpaHarga.map((k) => (
              <li key={k} className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-2.5">
                <span className="font-semibold">{p.nama(k)}</span>
                <button
                  type="button"
                  onClick={() => bukaIsiHarga(k)}
                  className="min-h-11 shrink-0 rounded-card border border-line bg-paper px-4 text-sm font-semibold"
                >
                  Isi harga
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Ringkasan: anggaran sementara (anggaran dikurangi yang disetujui) dan keputusan desa sejauh ini. */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section data-muncul="kiri" aria-labelledby="ringkas-pagu" className="flex flex-col rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 id="ringkas-pagu" className="font-bold">
            Anggaran dan skor
          </h2>
          <p className="text-sm text-muted">Angka asli baru berubah setelah surat usulan dibuat. Yang disetujui sebelum itu hanya simulasi.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <dl className="rounded-xl bg-surface-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Asli</p>
              <div className="mt-1.5">
                <dt className="text-sm text-muted">Sisa anggaran</dt>
                <dd className="tabular text-2xl font-semibold leading-tight tracking-tight">{formatRupiah(p.paguBebas)}</dd>
                <dd>
                  <BilahSisa sisa={p.paguBebas} total={pagu} warna="var(--ink)" />
                </dd>
                {p.terkunciRp > 0 ? (
                  <dd className="tabular text-xs text-muted">
                    {formatRupiah(pagu)} − {formatRupiah(p.terkunciRp)} sudah dibuat surat
                  </dd>
                ) : null}
              </div>
              <div className="mt-2">
                <dt className="text-sm text-muted">Skor kesiapan</dt>
                <dd className="tabular text-2xl font-semibold leading-tight tracking-tight">{formatSkor(p.skorSekarang)}</dd>
              </div>
            </dl>
            <dl className="rounded-xl border-2 border-dashed border-line-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Simulasi bila yang disetujui dibuat surat</p>
              <div className="mt-1.5">
                <dt className="text-sm text-muted">Sisa anggaran</dt>
                <dd className="tabular text-2xl font-semibold leading-tight tracking-tight text-ember">{formatRupiah(p.sisaSementara)}</dd>
                <dd>
                  <BilahSisa sisa={p.sisaSementara} total={pagu} warna="var(--ember)" />
                </dd>
                {p.disetujuiRp > 0 ? <dd className="tabular text-xs text-muted">− {formatRupiah(p.disetujuiRp)} disetujui</dd> : null}
              </div>
              <div className="mt-2">
                <dt className="text-sm text-muted">Skor kesiapan</dt>
                <dd className="tabular text-2xl font-semibold leading-tight tracking-tight text-ember">
                  {formatSkor(p.skorDisetujui)}
                  {p.skorDisetujui > p.skorSekarang ? (
                    <span className="ml-1.5 align-middle text-sm font-semibold text-ok">+{formatSkor(p.skorDisetujui - p.skorSekarang)}</span>
                  ) : null}
                </dd>
              </div>
            </dl>
          </div>
          <Link
            href={`/desa/${kode}/prioritas/pagu`}
            className="group mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-3 text-sm font-semibold text-ember"
          >
            Ubah anggaran di langkah 1
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </section>
        <section data-muncul="kanan" style={tunda(120)} aria-labelledby="keputusan" className="rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 id="keputusan" className="font-bold">
            Keputusan desa
          </h2>
          <p className="text-sm text-muted">Dari {hasil.terpilih.length} saran belanja.</p>
          <div className="mt-3">
            <RingkasKeputusan jumlah={{ setuju: ringkas.setuju, tolak: ringkas.tolak, belum: ringkas.belum + ringkas.tunda }} />
          </div>
        </section>
      </div>

      {hasil.tidakTerdanai.length > 0 ? (
        <details data-muncul open className="group mt-6 overflow-hidden rounded-panel border border-line bg-surface shadow-card">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-5 font-bold [&::-webkit-details-marker]:hidden">
            <span>Belum terdanai</span>
            <span className="tabular rounded-full bg-water-soft px-2.5 py-0.5 text-sm font-semibold text-water">{hasil.tidakTerdanai.length}</span>
            <span className="tabular ml-auto text-sm font-semibold text-muted">{formatRupiah(totalBiaya(hasil.tidakTerdanai))}</span>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {hasil.tidakTerdanai.map((b) => (
              <li key={keyBaris(b)} className="px-5 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    <AksiLabel aksi={b.aksi} itemKode={b.itemKode} /> {p.nama(b.itemKode)}
                  </span>
                  <span className="tabular text-sm">{formatRupiah(b.biayaRp)}</span>
                </div>
                <p className="text-sm text-muted">{b.alasan}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div data-muncul ref={panelRef} className="mt-6 scroll-mt-4">
        <PanelPaketHarga
          catalog={catalog}
          paket={p.paket}
          harga={p.harga}
          edit={edit}
          setEdit={setEdit}
          onSimpanTarget={async (itemKode, target, alasan) => {
            if (await p.simpanTarget(itemKode, target, alasan)) setEdit(null);
          }}
          onSimpanHarga={async (itemKode, aksi, hargaRp, sumber) => {
            if (await p.simpanHarga(itemKode, aksi, hargaRp, sumber)) setEdit(null);
          }}
        />
      </div>

      <BilahAksi
        teks={disetujui.length > 0 ? `${disetujui.length} baris disetujui, total ${formatRupiah(totalBiaya(disetujui))}.` : "Belum ada baris yang disetujui."}
        ragam={disetujui.length > 0 ? "ok" : "normal"}
      >
        {disetujui.length > 0 ? (
          <Link href={`/desa/${kode}/usulan`} className={kelasAksiUtama}>
            Terbitkan usulan
          </Link>
        ) : (
          <span aria-disabled="true" className={`${kelasAksiUtama} opacity-50`}>
            Terbitkan usulan
          </span>
        )}
      </BilahAksi>
    </div>
  );
}

/** Jeda muncul bertahap untuk [data-muncul] (dibaca CSS sebagai --tunda). */
const tunda = (ms: number) => ({ ["--tunda" as string]: `${ms}ms` }) as CSSProperties;

/** Tiga langkah singkat di atas papan: cara memakai papan dalam sekali baca. */
const LANGKAH_PAPAN = [
  { judul: "Ketuk atau seret kartu", isi: "ke Disetujui atau Ditolak" },
  { judul: "Lihat simulasinya", isi: "sisa anggaran dan skor bila dipilih" },
  { judul: "Buat surat usulan", isi: "yang disetujui lalu terkunci" },
];

/** Bilah tipis: bagian anggaran yang masih tersisa. */
function BilahSisa({ sisa, total, warna }: { sisa: number; total: number; warna: string }) {
  const p = total > 0 ? Math.min(Math.max(sisa / total, 0), 1) : 0;
  return (
    <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
      <span
        className="block h-full rounded-full transition-[width] duration-500 [transition-timing-function:var(--pegas)]"
        style={{ width: `${p * 100}%`, background: warna }}
      />
    </span>
  );
}

/** `?isi=pompa_jinjing:perbaiki` -> formulir harga item itu. Nilai tak dikenal diabaikan. */
function editDariTautan(isi: string | null, kodeItem: string[]): Edit {
  const [itemKode, aksi] = (isi ?? "").split(":");
  if (!kodeItem.includes(itemKode) || (aksi !== "beli" && aksi !== "perbaiki")) return null;
  return { jenis: "harga", itemKode, aksi };
}
