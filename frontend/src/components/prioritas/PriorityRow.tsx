"use client";

import { formatAngka, formatRupiah } from "@/lib/format";
import { namaAksi } from "@/lib/prioritas";
import type { Aksi, Keputusan, PriorityRow as Baris } from "@/lib/types";

const PILIHAN: { nilai: Keputusan; label: string; aktif: string }[] = [
  { nilai: "setuju", label: "Setuju", aktif: "border-ok bg-ok text-white" },
  { nilai: "tunda", label: "Tunda", aktif: "border-warn bg-warn text-white" },
  { nilai: "tolak", label: "Tolak", aktif: "border-danger bg-danger text-white" },
];

/**
 * Satu baris belanja terpilih (Design Brief v2 §7): urutan, aksi, item, jumlah, biaya, sumber harga,
 * alasan, dan keputusan. Keputusan memakai tombol asli dengan aria-pressed; pilihan juga tampil sebagai
 * kata, bukan hanya warna. Catatan muncul saat Tolak atau Tunda dipilih.
 */
export function PriorityRow({
  nomor,
  baris,
  namaItem,
  satuan,
  sumberHarga,
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
  keputusan?: Keputusan;
  catatan?: string;
  onKeputusan: (k: Keputusan) => void;
  onCatatan: (c: string) => void;
}) {
  const id = `baris-${baris.itemKode}-${baris.aksi}`;
  return (
    <li className="px-4 py-4">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-bold">
          {nomor}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold">
            <AksiLabel aksi={baris.aksi} /> {namaItem}
          </h3>
          <p className="tabular mt-0.5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm text-muted">
              {formatAngka(baris.qty)} {satuan}
            </span>
            <span className="text-lg font-bold">{formatRupiah(baris.biayaRp)}</span>
          </p>
          <p className="mt-1">{baris.alasan}</p>
          {sumberHarga ? <p className="mt-1 text-sm text-muted">Harga: {sumberHarga}</p> : null}
        </div>
      </div>

      <div role="group" aria-label={`Keputusan untuk ${namaAksi(baris.aksi)} ${namaItem}`} className="mt-3 grid grid-cols-3 gap-2">
        {PILIHAN.map((p) => {
          const dipilih = keputusan === p.nilai;
          return (
            <button
              key={p.nilai}
              type="button"
              aria-pressed={dipilih}
              onClick={() => onKeputusan(p.nilai)}
              className={`flex min-h-11 items-center justify-center gap-1 rounded-card border text-sm font-semibold ${
                dipilih ? p.aktif : "border-line bg-surface text-ink"
              }`}
            >
              {dipilih ? (
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              ) : null}
              {p.label}
            </button>
          );
        })}
      </div>

      {keputusan === "tolak" || keputusan === "tunda" ? (
        <div className="mt-2">
          <label htmlFor={`${id}-catatan`} className="text-sm font-semibold">
            Catatan <span className="font-normal text-muted">(boleh kosong)</span>
          </label>
          <input
            id={`${id}-catatan`}
            type="text"
            maxLength={200}
            value={catatan ?? ""}
            onChange={(e) => onCatatan(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-card border border-line bg-surface px-3"
          />
        </div>
      ) : null}
    </li>
  );
}

export function AksiLabel({ aksi }: { aksi: Aksi }) {
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
