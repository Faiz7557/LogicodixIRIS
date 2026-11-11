"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { formatAngka, formatRupiah } from "@/lib/format";
import { keyBaris, totalBiaya, type KeputusanMap } from "@/lib/prioritas";
import type { Keputusan, PriorityRow } from "@/lib/types";
import { KartuBelanja, idKartu, type Stok } from "./PriorityRow";

type Kolom = Keputusan | "belum";

const KOLOM: { nilai: Kolom; judul: string; keterangan: string; titik: string; kosong: string }[] = [
  { nilai: "belum", judul: "Perlu diputuskan", keterangan: "Saran baru dari sistem", titik: "bg-faint", kosong: "Semua saran sudah diputuskan." },
  { nilai: "setuju", judul: "Disetujui", keterangan: "Masuk ke usulan", titik: "bg-ok", kosong: "Tekan Setujui pada kartu untuk memasukkannya ke usulan." },
  { nilai: "tunda", judul: "Ditunda", keterangan: "Dibahas lagi nanti", titik: "bg-warn", kosong: "Saran yang perlu dibahas lagi muncul di sini." },
  { nilai: "tolak", judul: "Ditolak", keterangan: "Tidak dibeli kali ini", titik: "bg-danger", kosong: "Saran yang tidak dibeli kali ini muncul di sini." },
];

const JUDUL: Record<Kolom, string> = Object.fromEntries(KOLOM.map((k) => [k.nilai, k.judul])) as Record<Kolom, string>;

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
 * Papan keputusan desa: saran belanja dari sistem dikelompokkan per keputusan.
 * Menekan Setujui, Tunda, atau Tolak memindahkan kartu ke kolomnya; fokus ikut ke kartu itu
 * dan perpindahan diumumkan untuk pembaca layar. Urutan nomor tetap urutan dari sistem.
 */
export function PapanKeputusan({
  terpilih,
  keputusan,
  nama,
  satuan,
  sumberHarga,
  stok,
  onKeputusan,
  onCatatan,
}: {
  terpilih: PriorityRow[];
  keputusan: KeputusanMap;
  nama: (kode: string) => string;
  satuan: (kode: string) => string;
  sumberHarga: (kode: string, aksi: PriorityRow["aksi"]) => string | undefined;
  stok: (kode: string) => Stok | undefined;
  onKeputusan: (b: PriorityRow, k: Keputusan) => void;
  onCatatan: (b: PriorityRow, k: Keputusan, c: string) => void;
}) {
  const [pengumuman, setPengumuman] = useState("");

  const nomor = new Map(terpilih.map((b, i) => [keyBaris(b), i + 1]));
  const kolomDari = (b: PriorityRow): Kolom => keputusan[keyBaris(b)]?.keputusan ?? "belum";

  function pindah(b: PriorityRow, k: Keputusan) {
    denganTransisi(
      () => {
        onKeputusan(b, k);
        setPengumuman(`${nama(b.itemKode)} dipindah ke ${JUDUL[k]}.`);
      },
      () => {
        // Tombol yang ditekan hilang bersama kolom lama; fokus ikut ke kartu di kolom barunya.
        const kartu = document.getElementById(idKartu(b));
        kartu?.focus({ preventScroll: true });
        kartu?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      },
    );
  }

  return (
    <>
      <p aria-live="polite" className="sr-only">
        {pengumuman}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {KOLOM.map((kol) => {
          const isi = terpilih.filter((b) => kolomDari(b) === kol.nilai);
          const idJudul = `kolom-${kol.nilai}`;
          return (
            <section key={kol.nilai} aria-labelledby={idJudul} className="flex min-w-0 flex-col rounded-panel bg-surface-2 p-3">
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
              {isi.length > 0 ? (
                <ol className="flex flex-col gap-2.5 md:max-h-[32rem] md:overflow-y-auto md:pr-0.5">
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
                        onKeputusan={(baru) => pindah(b, baru)}
                        onCatatan={(c) => onCatatan(b, keputusan[k]?.keputusan ?? "tunda", c)}
                      />
                    );
                  })}
                </ol>
              ) : (
                <p className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-line-2 px-4 text-center text-sm text-muted">
                  {kol.kosong}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
