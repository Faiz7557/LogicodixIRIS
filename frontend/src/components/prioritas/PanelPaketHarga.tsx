"use client";

import { useState } from "react";
import { GambarItem } from "@/components/kesiapan/GambarItem";
import { AssumptionNote } from "@/components/ui/AssumptionNote";
import { formatAngka, formatRupiah } from "@/lib/format";
import { ALASAN_MIN, namaAksi, parsePagu } from "@/lib/prioritas";
import type { Aksi, CatalogItem, HargaRow, PaketRow } from "@/lib/types";

export type Edit = { jenis: "target"; itemKode: string } | { jenis: "harga"; itemKode: string; aksi: Aksi } | null;

/**
 * Panel paket minimum dan harga (App Flow v2 §3.8 butir 6).
 * Mengubah target wajib alasan; mengubah atau mengisi harga wajib sumber (Jobdesk: harga tanpa sumber dilarang).
 * Satu kartu per item dalam grid dua kolom; satu formulir terbuka pada satu waktu.
 */
export function PanelPaketHarga({
  catalog,
  paket,
  harga,
  edit,
  setEdit,
  buka,
  setBuka,
  onSimpanTarget,
  onSimpanHarga,
}: {
  catalog: CatalogItem[];
  paket: PaketRow[];
  harga: HargaRow[];
  edit: Edit;
  setEdit: (e: Edit) => void;
  buka: boolean;
  setBuka: (b: boolean) => void;
  onSimpanTarget: (itemKode: string, target: number, alasan: string) => void;
  onSimpanHarga: (itemKode: string, aksi: Aksi, hargaRp: number, sumber: string) => void;
}) {
  return (
    <details
      id="panel-paket-harga"
      open={buka}
      onToggle={(e) => setBuka((e.currentTarget as HTMLDetailsElement).open)}
      className="rounded-card border border-line bg-surface"
    >
      <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold">Paket minimum dan harga</summary>
      <div className="space-y-4 border-t border-line px-4 py-4">
        <AssumptionNote>Target, bobot, dan sebagian harga bukan standar yang mengikat desa. Desa boleh mengubahnya dengan alasan.</AssumptionNote>
        <ul className="grid gap-3 md:grid-cols-2">
          {catalog.map((c) => {
            const p = paket.find((x) => x.itemKode === c.kode);
            const aksiList: Aksi[] = c.punyaRusak ? ["beli", "perbaiki"] : ["beli"];
            return (
              <li key={c.kode} className="flex flex-col rounded-xl border border-line bg-surface p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <GambarItem kode={c.kode} className="size-10 rounded-lg" />
                  <h3 className="font-semibold">{c.nama}</h3>
                </div>

                <div className="mt-3 divide-y divide-line border-t border-line">
                  <Baris
                    label="Target"
                    nilai={`${p ? formatAngka(p.target) : "–"} ${c.satuan}`}
                    sumber={p?.sumber}
                    tombol="Ubah"
                    labelTombol={`Ubah target ${c.nama}`}
                    onTombol={() => setEdit({ jenis: "target", itemKode: c.kode })}
                  >
                    {edit?.jenis === "target" && edit.itemKode === c.kode ? (
                      <FormTarget awal={p?.target ?? 0} onBatal={() => setEdit(null)} onSimpan={(t, a) => onSimpanTarget(c.kode, t, a)} />
                    ) : null}
                  </Baris>

                  {aksiList.map((aksi) => {
                    const h = harga.find((x) => x.itemKode === c.kode && x.aksi === aksi);
                    return (
                      <Baris
                        key={aksi}
                        label={`Harga ${namaAksi(aksi).toLowerCase()}`}
                        nilai={h ? formatRupiah(h.hargaRp) : null}
                        sumber={h?.sumber}
                        tombol={h ? "Ubah" : "Isi harga"}
                        labelTombol={`${h ? "Ubah" : "Isi"} harga ${namaAksi(aksi).toLowerCase()} ${c.nama}`}
                        onTombol={() => setEdit({ jenis: "harga", itemKode: c.kode, aksi })}
                      >
                        {edit?.jenis === "harga" && edit.itemKode === c.kode && edit.aksi === aksi ? (
                          <FormHarga awal={h?.hargaRp} onBatal={() => setEdit(null)} onSimpan={(rp, sumber) => onSimpanHarga(c.kode, aksi, rp, sumber)} />
                        ) : null}
                      </Baris>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
}

/** Satu baris di kartu item: label, nilai, sumber satu baris, tombol kecil, lalu formulir bila sedang diubah. */
function Baris({
  label,
  nilai,
  sumber,
  tombol,
  labelTombol,
  onTombol,
  children,
}: {
  label: string;
  /** null = belum ada nilai. */
  nilai: string | null;
  sumber?: string;
  tombol: string;
  labelTombol: string;
  onTombol: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="py-2.5">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-sm">
          <span className="text-muted">{label}: </span>
          {nilai !== null ? <span className="tabular font-semibold">{nilai}</span> : <span className="font-semibold text-warn">Belum ada harga</span>}
          {sumber ? (
            <span title={sumber} className="block truncate text-xs text-muted">
              {sumber}
            </span>
          ) : null}
        </p>
        <button
          type="button"
          onClick={onTombol}
          aria-label={labelTombol}
          className={`min-h-9 shrink-0 rounded-lg border px-3 text-sm font-semibold ${
            nilai === null ? "border-ember/40 bg-ember-soft text-ember" : "border-line bg-surface hover:bg-paper"
          }`}
        >
          {tombol}
        </button>
      </div>
      {children}
    </div>
  );
}

function Medan({ id, label, galat, children }: { id: string; label: string; galat?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <p id={`${id}-galat`} aria-live="polite" className="min-h-5 text-sm text-danger">
        {galat ?? ""}
      </p>
    </div>
  );
}

const kelasInput = "mt-1 min-h-11 w-full rounded-card border bg-surface px-3";

function FormTarget({ awal, onBatal, onSimpan }: { awal: number; onBatal: () => void; onSimpan: (t: number, alasan: string) => void }) {
  const [t, setT] = useState(String(awal));
  const [alasan, setAlasan] = useState("");
  const [coba, setCoba] = useState(false);
  const angka = Number(t.replace(",", "."));
  const galatT = !/^\d+([.,]\d+)?$/.test(t.trim()) ? "Isi dengan angka 0 atau lebih." : undefined;
  const galatA = alasan.trim().length < ALASAN_MIN ? `Tulis alasan minimal ${ALASAN_MIN} huruf.` : undefined;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setCoba(true);
        if (!galatT && !galatA) onSimpan(angka, alasan.trim());
      }}
      className="mt-2 rounded-card bg-paper px-3 py-3"
    >
      <Medan id="ft-target" label="Target baru" galat={coba ? galatT : undefined}>
        <input id="ft-target" inputMode="decimal" value={t} onChange={(e) => setT(e.target.value)} className={`${kelasInput} border-line`} aria-describedby="ft-target-galat" />
      </Medan>
      <Medan id="ft-alasan" label="Alasan (wajib)" galat={coba ? galatA : undefined}>
        <input id="ft-alasan" value={alasan} onChange={(e) => setAlasan(e.target.value)} className={`${kelasInput} border-line`} aria-describedby="ft-alasan-galat" placeholder="Contoh: sumber air dekat" />
      </Medan>
      <div className="flex gap-2">
        <button type="submit" className="min-h-11 rounded-card bg-ember px-4 font-semibold text-white">Simpan target</button>
        <button type="button" onClick={onBatal} className="min-h-11 rounded-card border border-line bg-surface px-4 font-semibold">Batal</button>
      </div>
    </form>
  );
}

function FormHarga({ awal, onBatal, onSimpan }: { awal?: number; onBatal: () => void; onSimpan: (rp: number, sumber: string) => void }) {
  const [rp, setRp] = useState(awal ? formatRupiah(awal) : "");
  const [sumber, setSumber] = useState("");
  const [coba, setCoba] = useState(false);
  const nilai = parsePagu(rp);
  const galatR = nilai <= 0 ? "Isi harga lebih dari Rp0." : undefined;
  const galatS = sumber.trim().length === 0 ? "Sumber harga wajib diisi." : undefined;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setCoba(true);
        if (!galatR && !galatS) onSimpan(nilai, sumber.trim());
      }}
      className="mt-2 rounded-card bg-paper px-3 py-3"
    >
      <Medan id="fh-harga" label="Harga per satuan (Rupiah)" galat={coba ? galatR : undefined}>
        <input id="fh-harga" inputMode="numeric" value={rp} onChange={(e) => setRp(e.target.value)} onBlur={() => nilai > 0 && setRp(formatRupiah(nilai))} className={`${kelasInput} border-line`} aria-describedby="fh-harga-galat" />
      </Medan>
      <Medan id="fh-sumber" label="Sumber harga (wajib)" galat={coba ? galatS : undefined}>
        <input id="fh-sumber" value={sumber} onChange={(e) => setSumber(e.target.value)} className={`${kelasInput} border-line`} aria-describedby="fh-sumber-galat" placeholder="Contoh: penawaran toko, 10 Nov 2026" />
      </Medan>
      <div className="flex gap-2">
        <button type="submit" className="min-h-11 rounded-card bg-ember px-4 font-semibold text-white">Simpan harga</button>
        <button type="button" onClick={onBatal} className="min-h-11 rounded-card border border-line bg-surface px-4 font-semibold">Batal</button>
      </div>
    </form>
  );
}
