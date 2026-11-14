"use client";

import type { DragEvent, ReactNode } from "react";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { namaAksi } from "@/lib/prioritas";
import type { Aksi, BarisTerkunci, Keputusan, PriorityRow as Baris } from "@/lib/types";

export const idKartu = (b: Pick<Baris, "itemKode" | "aksi">) => `kartu-${b.itemKode}-${b.aksi}`;

/** Jumlah alat berfungsi dan target paket untuk bilah "Ada X dari Y". */
export type Stok = { berfungsi: number; target: number };

type IsiProps = { nomor: number; baris: Baris; namaItem: string; satuan: string; sumberHarga?: string; stok?: Stok };

/** Isi kartu yang sama untuk kartu asli dan kartu bayangan: chip aksi, nama, sumber harga, bilah stok, biaya. */
function IsiKartu({ nomor, baris, namaItem, satuan, sumberHarga, stok }: IsiProps) {
  const persen = stok && stok.target > 0 ? Math.min(stok.berfungsi / stok.target, 1) : 0;
  const sesudah = stok && stok.target > 0 ? Math.min((stok.berfungsi + baris.qty) / stok.target, 1) : null;
  return (
    <>
      <span className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
            baris.aksi === "beli" ? "bg-water-soft text-water" : "bg-ok-soft text-ok"
          }`}
        >
          {namaAksi(baris.aksi)} {formatAngka(baris.qty)} {satuan}
        </span>
        <span className="tabular text-xs text-muted">#{nomor}</span>
      </span>

      <span className="mt-2 block font-semibold leading-snug">{namaItem}</span>
      {sumberHarga ? (
        <span title={sumberHarga} className="block truncate text-xs text-muted">
          Harga: {sumberHarga}
        </span>
      ) : null}

      {stok ? (
        <span className="mt-2.5 flex items-center gap-3">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-ember" style={{ width: `${persen * 100}%` }} />
          </span>
          <span className="tabular shrink-0 text-xs text-muted">
            Ada <span className="font-semibold text-ink">{formatAngka(stok.berfungsi)}</span> dari {formatAngka(stok.target)} {satuan}
          </span>
        </span>
      ) : null}

      <span className="mt-2.5 flex items-baseline justify-between gap-2 border-t border-line pt-2.5 text-sm">
        <span className="text-muted">{sesudah !== null ? `Naik ke ${Math.round(sesudah * 100)}%` : baris.alasan}</span>
        <span className="tabular font-semibold">{formatRupiah(baris.biayaRp)}</span>
      </span>
    </>
  );
}

/**
 * Satu kartu saran belanja (pola kartu tugas Sparekit). Tanpa tombol keputusan: kartu diketuk atau diseret.
 * Mengetuk memunculkan kartu bayangan (simulasi) di kolom lain, masing-masing dengan tombol "Pilih ini";
 * menyeret ke kolom lain langsung memindahkannya. Kartu yang ditolak punya kolom catatan di luar area ketuk.
 */
export function KartuBelanja({
  keputusan,
  catatan,
  dipilih,
  diseret = false,
  onPilih,
  onCatatan,
  onSeretMulai,
  onSeretSelesai,
  ...isi
}: IsiProps & {
  keputusan?: Keputusan;
  catatan?: string;
  /** Kartu sedang diketuk: kartu bayangan tampil di kolom lain. */
  dipilih: boolean;
  /** Kartu sedang diseret: tampil pudar di tempat asalnya. */
  diseret?: boolean;
  onPilih: () => void;
  onCatatan: (c: string) => void;
  onSeretMulai: (e: DragEvent<HTMLLIElement>) => void;
  onSeretSelesai: () => void;
}) {
  const { baris, namaItem, satuan } = isi;
  const id = idKartu(baris);

  return (
    <li
      id={id}
      tabIndex={-1}
      draggable
      onDragStart={onSeretMulai}
      onDragEnd={onSeretSelesai}
      style={{ viewTransitionName: id }}
      className={`cursor-grab rounded-xl border bg-surface shadow-card outline-none transition-[border-color,box-shadow,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-ember active:cursor-grabbing ${
        dipilih ? "border-ink ring-2 ring-ink/15" : "border-line hover:border-line-2"
      } ${diseret ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        onClick={onPilih}
        aria-expanded={dipilih}
        aria-label={`${namaAksi(baris.aksi)} ${formatAngka(baris.qty)} ${satuan} ${namaItem}, ${formatRupiah(baris.biayaRp)}. ${
          dipilih ? "Pilihan pindah terbuka di kolom lain; ketuk lagi untuk menutup." : "Ketuk atau seret untuk memindahkan."
        }`}
        className="tekan block w-full cursor-[inherit] rounded-xl p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
      >
        <IsiKartu {...isi} />
      </button>

      {keputusan === "tolak" ? (
        <div className="px-3 pb-3">
          <label htmlFor={`${id}-catatan`} className="sr-only">
            Catatan untuk {namaItem}
          </label>
          <input
            id={`${id}-catatan`}
            type="text"
            maxLength={200}
            value={catatan ?? ""}
            onChange={(e) => onCatatan(e.target.value)}
            placeholder="Catatan: sudah dibantu BPBD"
            className="min-h-9 w-full rounded-lg border border-line bg-paper px-2.5 text-sm"
          />
        </div>
      ) : null}
    </li>
  );
}

/**
 * Kartu bayangan: kartu yang sama persis, tetapi samar dan bergaris putus-putus, di kolom tujuan.
 * Di bawahnya hasil simulasi dan tombol "Pilih ini". Tidak bisa diketuk selain tombolnya.
 */
export function KartuBayangan({ simulasi, aksi, ...isi }: IsiProps & { simulasi: ReactNode; aksi: ReactNode }) {
  return (
    <li className="muncul">
      <div aria-hidden="true" className="pointer-events-none select-none rounded-xl border-2 border-dashed border-line-2 bg-surface/60 p-3 opacity-50">
        <IsiKartu {...isi} />
      </div>
      <div className="mt-2 px-1 text-xs text-muted">{simulasi}</div>
      <div className="mt-2">{aksi}</div>
    </li>
  );
}

/** Kartu yang sudah masuk surat usulan: terkunci, tidak bisa diketuk atau diseret. Data riwayat. */
export function KartuTerkunci({ baris, namaItem, satuan }: { baris: BarisTerkunci; namaItem: string; satuan: string }) {
  return (
    <li className="rounded-xl border border-line bg-surface/70 p-3">
      <span className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-xs font-semibold text-muted">
          {namaAksi(baris.aksi)} {formatAngka(baris.qty)} {satuan}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Terkunci
        </span>
      </span>
      <span className="mt-2 block font-semibold leading-snug text-ink/80">{namaItem}</span>
      {baris.sumberHarga ? (
        <span title={baris.sumberHarga} className="block truncate text-xs text-muted">
          Harga: {baris.sumberHarga}
        </span>
      ) : null}
      <span className="mt-2 flex items-baseline justify-between gap-2 border-t border-line pt-2 text-sm">
        <span className="text-muted">
          Disetujui di surat #{baris.usulanId} · {formatTanggal(baris.tanggal)}
        </span>
        <span className="tabular font-semibold text-muted">{formatRupiah(baris.biayaRp)}</span>
      </span>
    </li>
  );
}

export function AksiLabel({ aksi }: { aksi: Aksi; itemKode?: string }) {
  return (
    <span
      className={`mr-1 inline-block rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
        aksi === "beli" ? "border-water/50 text-water" : "border-ok/50 text-ok"
      }`}
    >
      {namaAksi(aksi)}
    </span>
  );
}
