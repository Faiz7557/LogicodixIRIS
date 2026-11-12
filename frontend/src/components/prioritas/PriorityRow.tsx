"use client";

import { formatAngka, formatRupiah } from "@/lib/format";
import { namaAksi } from "@/lib/prioritas";
import type { Aksi, Keputusan, PriorityRow as Baris } from "@/lib/types";

export const idKartu = (b: Pick<Baris, "itemKode" | "aksi">) => `kartu-${b.itemKode}-${b.aksi}`;

/** Jumlah alat berfungsi dan target paket untuk bilah "Ada X dari Y". */
export type Stok = { berfungsi: number; target: number };

const TOMBOL_IKON: Record<Exclude<Keputusan, "setuju">, { label: string; kelas: string; ikon: React.ReactNode }> = {
  tunda: {
    label: "Tunda",
    kelas: "text-warn hover:bg-warn-soft",
    ikon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 1.5" />
      </>
    ),
  },
  tolak: { label: "Tolak", kelas: "text-danger hover:bg-danger-soft", ikon: <path d="M7 7l10 10M17 7L7 17" /> },
};

/**
 * Satu kartu saran belanja (pola kartu tugas Sparekit): chip aksi, nama item, sumber harga,
 * bilah "Ada X dari Y", cakupan sesudah dan biaya, lalu tombol keputusan.
 * Setujui jadi tombol utama; Tunda dan Tolak tombol ikon berlabel. Kolom yang sedang ditempati tidak diberi tombol.
 */
export function KartuBelanja({
  nomor,
  baris,
  namaItem,
  satuan,
  sumberHarga,
  stok,
  keputusan,
  catatan,
  onKeputusan,
  onCatatan,
}: {
  nomor: number;
  baris: Baris;
  namaItem: string;
  satuan: string;
  sumberHarga?: string;
  stok?: Stok;
  keputusan?: Keputusan;
  catatan?: string;
  onKeputusan: (k: Keputusan) => void;
  onCatatan: (c: string) => void;
}) {
  const id = idKartu(baris);
  const persen = stok && stok.target > 0 ? Math.min(stok.berfungsi / stok.target, 1) : 0;
  const sesudah = stok && stok.target > 0 ? Math.min((stok.berfungsi + baris.qty) / stok.target, 1) : null;
  const ikon = (["tunda", "tolak"] as const).filter((k) => k !== keputusan);

  return (
    <li
      id={id}
      tabIndex={-1}
      style={{ viewTransitionName: id }}
      className="rounded-xl border border-line bg-surface p-3 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ember"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
            baris.aksi === "beli" ? "bg-water-soft text-water" : "bg-ok-soft text-ok"
          }`}
        >
          {namaAksi(baris.aksi, baris.itemKode)} {formatAngka(baris.qty)} {satuan}
        </span>
        <span className="tabular text-xs text-muted">
          <span className="sr-only">Urutan </span>#{nomor}
        </span>
      </div>

      <h3 className="mt-2 font-semibold leading-snug">{namaItem}</h3>
      {sumberHarga ? (
        <p title={sumberHarga} className="truncate text-xs text-muted">
          Harga: {sumberHarga}
        </p>
      ) : null}

      {stok ? (
        <div className="mt-2.5 flex items-center gap-3">
          <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-ember" style={{ width: `${persen * 100}%` }} />
          </span>
          <span className="tabular shrink-0 text-xs text-muted">
            Ada <span className="font-semibold text-ink">{formatAngka(stok.berfungsi)}</span> dari {formatAngka(stok.target)} {satuan}
          </span>
        </div>
      ) : null}

      <div className="mt-2.5 flex items-baseline justify-between gap-2 border-t border-line pt-2.5 text-sm">
        <span className="text-muted">{sesudah !== null ? `Naik ke ${Math.round(sesudah * 100)}%` : baris.alasan}</span>
        <span className="tabular font-semibold">{formatRupiah(baris.biayaRp)}</span>
      </div>

      {keputusan === "tolak" || keputusan === "tunda" ? (
        <div className="mt-2.5">
          <label htmlFor={`${id}-catatan`} className="sr-only">
            Catatan untuk {namaItem}
          </label>
          <input
            id={`${id}-catatan`}
            type="text"
            maxLength={200}
            value={catatan ?? ""}
            onChange={(e) => onCatatan(e.target.value)}
            placeholder={keputusan === "tunda" ? "Catatan: tunggu APBDes perubahan" : "Catatan: sudah dibantu BPBD"}
            className="min-h-9 w-full rounded-lg border border-line bg-paper px-2.5 text-sm"
          />
        </div>
      ) : null}

      <div role="group" aria-label={`Keputusan untuk ${namaAksi(baris.aksi, baris.itemKode).toLowerCase()} ${namaItem}`} className="mt-3 flex items-center gap-2">
        {keputusan !== "setuju" ? (
          <button
            type="button"
            onClick={() => onKeputusan("setuju")}
            className="flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink px-3 text-sm font-semibold text-white hover:bg-ink/85"
          >
            Setujui
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <span className="flex min-h-9 flex-1 items-center gap-1.5 text-sm font-semibold text-ok">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5 9-10" />
            </svg>
            Masuk usulan
          </span>
        )}
        {ikon.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onKeputusan(k)}
            aria-label={TOMBOL_IKON[k].label}
            title={TOMBOL_IKON[k].label}
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface ${TOMBOL_IKON[k].kelas}`}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {TOMBOL_IKON[k].ikon}
            </svg>
          </button>
        ))}
      </div>
    </li>
  );
}

export function AksiLabel({ aksi, itemKode }: { aksi: Aksi; itemKode?: string }) {
  return (
    <span
      className={`mr-1 inline-block rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
        aksi === "beli" ? "border-water/50 text-water" : "border-ok/50 text-ok"
      }`}
    >
      {namaAksi(aksi, itemKode)}
    </span>
  );
}
