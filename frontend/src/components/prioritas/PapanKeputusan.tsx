"use client";

import { useEffect, useState, type DragEvent } from "react";
import { flushSync } from "react-dom";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import { keyBaris, totalBiaya, type KeputusanMap } from "@/lib/prioritas";
import type { BarisTerkunci, Keputusan, PriorityRow } from "@/lib/types";
import { KartuBayangan, KartuBelanja, KartuTerkunci, idKartu, type Stok } from "./PriorityRow";

/** Kolom papan. "Ditunda" sudah dihapus: keputusan "tunda" lama ikut tampil di Perlu diputuskan. */
export type Kolom = "belum" | "setuju" | "tolak";

/** Hasil simulasi bila satu saran dipindah ke kolom tertentu. */
export type Simulasi = { sisaRp: number; skor: number };

const KOLOM: { nilai: Kolom; judul: string; keterangan: string; titik: string; cincin: string; tombol: string; kosong: string }[] = [
  {
    nilai: "belum",
    judul: "Perlu diputuskan",
    keterangan: "Saran baru dari sistem",
    titik: "bg-faint",
    cincin: "ring-line-2",
    tombol: "bg-ink text-white hover:bg-ink/85",
    kosong: "Semua saran sudah diputuskan.",
  },
  {
    nilai: "setuju",
    judul: "Disetujui",
    keterangan: "Masuk ke usulan berikutnya",
    titik: "bg-ok",
    cincin: "ring-ok/60",
    tombol: "bg-ok text-white hover:bg-ok/85",
    kosong: "Seret kartu ke sini, atau ketuk kartu lalu pilih Disetujui.",
  },
  {
    nilai: "tolak",
    judul: "Ditolak",
    keterangan: "Tidak dibeli kali ini",
    titik: "bg-danger",
    cincin: "ring-danger/60",
    tombol: "bg-danger text-white hover:bg-danger/85",
    kosong: "Seret kartu ke sini bila tidak dibeli kali ini.",
  },
];

const JUDUL: Record<Kolom, string> = Object.fromEntries(KOLOM.map((k) => [k.nilai, k.judul])) as Record<Kolom, string>;

/** Keputusan tersimpan -> kolom. "tunda" (dari versi lama) dianggap belum diputuskan. */
export const kolomDari = (k: Keputusan | undefined): Kolom => (k === "setuju" || k === "tolak" ? k : "belum");

/** Kolom -> keputusan yang disimpan. Kembali ke Perlu diputuskan disimpan sebagai "tunda" (API tidak punya "belum"). */
export const keputusanUntuk = (k: Kolom): Keputusan => (k === "belum" ? "tunda" : k);

/** Ubah keadaan di dalam View Transition bila browser mendukung, supaya kartu terlihat berpindah kolom. */
function denganTransisi(ubah: () => void, sesudah: () => void) {
  const jalankan = () => {
    flushSync(ubah);
    sesudah();
  };
  const gerakDikurangi = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (gerakDikurangi || !("startViewTransition" in document)) jalankan();
  else document.startViewTransition(jalankan);
}

/**
 * Papan keputusan desa: Perlu diputuskan, Disetujui, Ditolak.
 * - Ketuk kartu: kartu bayangan (sama persis, samar) muncul di kolom lain, dengan simulasi dan tombol "Pilih ini".
 * - Seret kartu: kartu bayangan muncul di kolom yang sedang dilewati; lepaskan untuk memindahkan.
 * Disetujui hanya simulasi sampai surat usulan dibuat; setelah itu barisnya terkunci di kolom Disetujui
 * sebagai riwayat dan tidak bisa dipindah. Escape menutup simulasi. Nomor tetap urutan dari sistem.
 */
export function PapanKeputusan({
  terpilih,
  keputusan,
  terkunci,
  nama,
  satuan,
  sumberHarga,
  stok,
  sekarang,
  simulasi,
  onKeputusan,
  onCatatan,
}: {
  terpilih: PriorityRow[];
  keputusan: KeputusanMap;
  terkunci: BarisTerkunci[];
  nama: (kode: string) => string;
  satuan: (kode: string) => string;
  sumberHarga: (kode: string, aksi: PriorityRow["aksi"]) => string | undefined;
  stok: (kode: string) => Stok | undefined;
  /** Sisa anggaran dan skor simulasi dengan keputusan saat ini. */
  sekarang: Simulasi;
  simulasi: (b: PriorityRow, ke: Kolom) => Simulasi;
  onKeputusan: (b: PriorityRow, k: Keputusan) => void;
  onCatatan: (b: PriorityRow, k: Keputusan, c: string) => void;
}) {
  const [pengumuman, setPengumuman] = useState("");
  const [dipilih, setDipilih] = useState<string | null>(null);
  const [seret, setSeret] = useState<string | null>(null);
  const [sasaran, setSasaran] = useState<Kolom | null>(null);

  const nomor = new Map(terpilih.map((b, i) => [keyBaris(b), i + 1]));
  const kolomBaris = (b: PriorityRow): Kolom => kolomDari(keputusan[keyBaris(b)]?.keputusan);
  const cari = (k: string | null) => (k ? terpilih.find((b) => keyBaris(b) === k) : undefined);
  const barisDipilih = cari(dipilih);
  const barisSeret = cari(seret);

  useEffect(() => {
    if (!dipilih) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const kartu = barisDipilih ? document.getElementById(idKartu(barisDipilih)) : null;
      setDipilih(null);
      kartu?.querySelector("button")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dipilih, barisDipilih]);

  function pindah(b: PriorityRow, ke: Kolom) {
    if (kolomBaris(b) === ke) return;
    denganTransisi(
      () => {
        onKeputusan(b, keputusanUntuk(ke));
        setDipilih(null);
        setSeret(null);
        setSasaran(null);
        setPengumuman(`${nama(b.itemKode)} dipindah ke ${JUDUL[ke]}.`);
      },
      () => {
        // Kartu bayangan hilang; fokus ikut ke kartu di kolom barunya.
        const kartu = document.getElementById(idKartu(b));
        kartu?.querySelector("button")?.focus({ preventScroll: true });
        kartu?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      },
    );
  }

  function mulaiSeret(e: DragEvent<HTMLLIElement>, b: PriorityRow) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", keyBaris(b));
    setDipilih(null);
    // Tunda satu bingkai: browser mengambil gambar kartu dulu sebelum kartu asal dipudarkan.
    requestAnimationFrame(() => setSeret(keyBaris(b)));
  }

  function selesaiSeret() {
    setSeret(null);
    setSasaran(null);
  }

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {pengumuman}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {KOLOM.map((kol, urutKolom) => {
          const isi = terpilih.filter((b) => kolomBaris(b) === kol.nilai);
          const kunci = kol.nilai === "setuju" ? terkunci : [];
          const idJudul = `kolom-${kol.nilai}`;
          // Bayangan: saat menyeret hanya di kolom yang sedang dilewati; saat mengetuk di semua kolom lain.
          const bayangan = barisSeret
            ? sasaran === kol.nilai && kolomBaris(barisSeret) !== kol.nilai
              ? barisSeret
              : null
            : barisDipilih && kolomBaris(barisDipilih) !== kol.nilai
              ? barisDipilih
              : null;
          const bisaDiTerima = !!barisSeret && kolomBaris(barisSeret) !== kol.nilai;
          return (
            <section
              key={kol.nilai}
              aria-labelledby={idJudul}
              onDragOver={(e) => {
                if (!bisaDiTerima) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (sasaran !== kol.nilai) setSasaran(kol.nilai);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null) && sasaran === kol.nilai) setSasaran(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (barisSeret && bisaDiTerima) pindah(barisSeret, kol.nilai);
                else selesaiSeret();
              }}
              style={{ animationDelay: `${urutKolom * 110}ms` }}
              className={`tunggu-terlihat masuk relative flex min-w-0 flex-col overflow-hidden rounded-panel bg-surface-2 p-3 pt-4 transition-shadow duration-200 ${
                sasaran === kol.nilai && bisaDiTerima ? `ring-2 ${kol.cincin}` : ""
              }`}
            >
              {/* Garis warna kolom di tepi atas. */}
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${kol.titik}`} />
              <header className="px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${kol.titik}`} />
                  <h3 id={idJudul} className="font-semibold">
                    {kol.judul}
                  </h3>
                  <span className="tabular rounded-md bg-line/70 px-1.5 text-sm">
                    {formatAngka(isi.length)}
                    <span className="sr-only"> saran</span>
                  </span>
                  {isi.length > 0 ? <span className="tabular ml-auto text-sm text-muted">{formatRupiah(totalBiaya(isi))}</span> : null}
                </div>
                <p className="mt-0.5 text-sm text-muted">{kol.keterangan}</p>
              </header>
              {isi.length > 0 || bayangan ? (
                <ol className="flex flex-col gap-2.5 md:max-h-[36rem] md:overflow-y-auto md:pr-0.5">
                  {bayangan ? (
                    <KartuBayanganKolom
                      key={`bayangan-${keyBaris(bayangan)}`}
                      kol={kol}
                      baris={bayangan}
                      nomor={nomor.get(keyBaris(bayangan)) ?? 0}
                      namaItem={nama(bayangan.itemKode)}
                      satuan={satuan(bayangan.itemKode)}
                      sumberHarga={sumberHarga(bayangan.itemKode, bayangan.aksi)}
                      stok={stok(bayangan.itemKode)}
                      sekarang={sekarang}
                      hasil={simulasi(bayangan, kol.nilai)}
                      tombol={!barisSeret}
                      onPilih={() => pindah(bayangan, kol.nilai)}
                    />
                  ) : null}
                  {isi.map((b) => {
                    const k = keyBaris(b);
                    return (
                      <KartuBelanja
                        key={k}
                        nomor={nomor.get(k) ?? 0}
                        baris={b}
                        namaItem={nama(b.itemKode)}
                        satuan={satuan(b.itemKode)}
                        sumberHarga={sumberHarga(b.itemKode, b.aksi)}
                        stok={stok(b.itemKode)}
                        keputusan={keputusan[k]?.keputusan}
                        catatan={keputusan[k]?.catatan}
                        dipilih={dipilih === k}
                        diseret={seret === k}
                        onPilih={() => setDipilih((lama) => (lama === k ? null : k))}
                        onCatatan={(c) => onCatatan(b, keputusan[k]?.keputusan ?? "tolak", c)}
                        onSeretMulai={(e) => mulaiSeret(e, b)}
                        onSeretSelesai={selesaiSeret}
                      />
                    );
                  })}
                </ol>
              ) : kunci.length === 0 ? (
                <p className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-line-2 px-4 text-center text-sm text-muted">
                  {kol.kosong}
                </p>
              ) : null}

              {kunci.length > 0 ? (
                <div className={isi.length > 0 || bayangan ? "mt-4" : ""}>
                  <p className="flex items-center gap-1.5 px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    Sudah dibuat surat ({formatAngka(kunci.length)}) · {formatRupiah(totalBiaya(kunci))}
                  </p>
                  <ol className="flex flex-col gap-2 md:max-h-[20rem] md:overflow-y-auto md:pr-0.5">
                    {kunci.map((t, i) => (
                      <KartuTerkunci key={`${t.usulanId}-${t.itemKode}-${t.aksi}-${i}`} baris={t} namaItem={nama(t.itemKode)} satuan={satuan(t.itemKode)} />
                    ))}
                  </ol>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </>
  );
}

/** Kartu bayangan dalam kolom: simulasi sisa anggaran dan skor, lalu tombol "Pilih ini" (disembunyikan saat menyeret). */
function KartuBayanganKolom({
  kol,
  baris,
  nomor,
  namaItem,
  satuan,
  sumberHarga,
  stok,
  sekarang,
  hasil,
  tombol,
  onPilih,
}: {
  kol: (typeof KOLOM)[number];
  baris: PriorityRow;
  nomor: number;
  namaItem: string;
  satuan: string;
  sumberHarga?: string;
  stok?: Stok;
  sekarang: Simulasi;
  hasil: Simulasi;
  tombol: boolean;
  onPilih: () => void;
}) {
  const sama = (a: number, b: number) => Math.round(a * 10) === Math.round(b * 10);
  const sisaSama = sama(sekarang.sisaRp, hasil.sisaRp);
  const skorSama = sama(sekarang.skor, hasil.skor);
  return (
    <KartuBayangan
      nomor={nomor}
      baris={baris}
      namaItem={namaItem}
      satuan={satuan}
      sumberHarga={sumberHarga}
      stok={stok}
      simulasi={
        <span className="tabular">
          Simulasi: sisa {sisaSama ? formatRupiah(hasil.sisaRp) : `${formatRupiah(sekarang.sisaRp)} → ${formatRupiah(hasil.sisaRp)}`}, skor{" "}
          {skorSama ? formatSkor(hasil.skor) : `${formatSkor(sekarang.skor)} → ${formatSkor(hasil.skor)}`}
          {sisaSama && skorSama ? " (tetap)" : ""}
        </span>
      }
      aksi={
        tombol ? (
          <button
            type="button"
            onClick={onPilih}
            className={`flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${kol.tombol}`}
          >
            Pilih ini
            <span className="sr-only">
              : pindahkan {namaItem} ke {kol.judul}
            </span>
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
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <p className="text-center text-xs font-semibold text-muted">Lepaskan untuk memindahkan ke {kol.judul}</p>
        )
      }
    />
  );
}
