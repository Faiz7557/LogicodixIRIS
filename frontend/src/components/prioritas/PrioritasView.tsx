"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { formatRupiah, formatSkor } from "@/lib/format";
import {
  PAGU_DEFAULT,
  barisDisetujui,
  kalimatPrioritas,
  keadaanPagu,
  keyBaris,
  ringkasKeputusan,
  totalBiaya,
} from "@/lib/prioritas";
import type { Aksi, CatalogItem, Keputusan } from "@/lib/types";
import { bangunKonteks, hitungContoh } from "@/mocks/prioritasContoh";
import { bacaSimpanan, simpananAwal, tulisSimpanan, type Simpanan } from "@/mocks/store";
import { AksiLabel, PriorityRow } from "./PriorityRow";
import { PaguControl } from "./PaguControl";
import { PanelPaketHarga, type Edit } from "./PanelPaketHarga";

/**
 * Layar Prioritas (App Flow v2 §3.8). Momen utama: skor sekarang menuju skor sesudah saat pagu berubah.
 * Sementara memakai mesin dan penyimpanan tiruan (mocks/); antarmukanya sama dengan yang akan dipakai API.
 */
export function PrioritasView({ kode, namaDesa, catalog }: { kode: string; namaDesa: string; catalog: CatalogItem[] }) {
  const [sim, setSim] = useState<Simpanan>(simpananAwal);
  const [siap, setSiap] = useState(false);
  const [paguHitung, setPaguHitung] = useState(PAGU_DEFAULT);
  const [edit, setEdit] = useState<Edit>(null);
  const [panelBuka, setPanelBuka] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Muat isian tersimpan sekali setelah tampil: sessionStorage hanya ada di browser,
  // jadi tidak bisa dibaca saat render server tanpa selisih hidrasi.
  useEffect(() => {
    const s = bacaSimpanan(kode);
    /* eslint-disable react-hooks/set-state-in-effect */
    setSim(s);
    setPaguHitung(s.pagu);
    setSiap(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [kode]);

  useEffect(() => {
    if (siap) tulisSimpanan(kode, sim);
  }, [kode, sim, siap]);

  // Jeda 300 ms pada perubahan pagu (Design Brief: PaguControl).
  useEffect(() => {
    const t = setTimeout(() => setPaguHitung(sim.pagu), 300);
    return () => clearTimeout(t);
  }, [sim.pagu]);

  const konteks = useMemo(() => bangunKonteks(sim), [sim.harga, sim.paket]); // eslint-disable-line react-hooks/exhaustive-deps
  const hasil = useMemo(() => hitungContoh(paguHitung, konteks), [paguHitung, konteks]);
  const menghitung = sim.pagu !== paguHitung;

  const nama = (k: string) => catalog.find((c) => c.kode === k)?.nama ?? k;
  const satuan = (k: string) => catalog.find((c) => c.kode === k)?.satuan ?? "";
  const sumberHarga = (k: string, aksi: Aksi) => konteks.harga.find((h) => h.itemKode === k && h.aksi === aksi)?.sumber;

  const keadaan = keadaanPagu(paguHitung, hasil, konteks.harga);
  const kalimat = kalimatPrioritas(paguHitung, konteks.skorSekarang, hasil, konteks.harga, catalog);
  const ringkas = ringkasKeputusan(hasil.terpilih, sim.keputusan);
  const disetujui = barisDisetujui(hasil.terpilih, sim.keputusan);
  const sisa = Math.max(0, paguHitung - hasil.terpakaiRp);
  const selisih = Math.round((hasil.skorSesudah - konteks.skorSekarang) * 10) / 10;

  function setKeputusan(k: string, keputusan: Keputusan) {
    setSim((s) => ({ ...s, keputusan: { ...s.keputusan, [k]: { ...s.keputusan[k], keputusan } } }));
  }
  function setCatatan(k: string, catatan: string) {
    setSim((s) => ({ ...s, keputusan: { ...s.keputusan, [k]: { ...s.keputusan[k], catatan } } }));
  }
  function bukaIsiHarga(itemKode: string) {
    setEdit({ jenis: "harga", itemKode, aksi: "beli" });
    setPanelBuka(true);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6 pb-32 md:pb-6">
      <header>
        <h1 className="text-2xl font-bold">Prioritas</h1>
        <p className="text-sm text-muted">{namaDesa}</p>
        <p aria-live="polite" className="mt-3 text-xl font-semibold leading-snug">
          {kalimat}
        </p>
      </header>

      <div className="mt-5">
        <PaguControl pagu={sim.pagu} onChange={(v) => setSim((s) => ({ ...s, pagu: v }))} />
      </div>

      <section aria-label="Ringkasan" aria-busy={menghitung} className="mt-4 rounded-card border border-line bg-surface px-4 py-4">
        <p className="text-sm font-semibold text-muted">Skor kesiapan</p>
        <p className="tabular mt-1 flex flex-wrap items-baseline gap-x-3 font-bold" aria-label={`Skor dari ${formatSkor(konteks.skorSekarang)} menjadi ${formatSkor(hasil.skorSesudah)}`}>
          <span className="text-3xl text-muted">{formatSkor(konteks.skorSekarang)}</span>
          <span aria-hidden="true" className="text-2xl text-muted">→</span>
          <span className={`text-5xl transition-opacity duration-300 ${menghitung ? "opacity-40" : ""}`}>{formatSkor(hasil.skorSesudah)}</span>
          {selisih > 0 ? <span className="text-base font-semibold text-ok">+{formatSkor(selisih)} poin</span> : null}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Terpakai</dt>
            <dd className="tabular text-lg font-bold">{formatRupiah(hasil.terpakaiRp)}</dd>
          </div>
          <div>
            <dt className="text-muted">Sisa pagu</dt>
            <dd className="tabular text-lg font-bold">{formatRupiah(sisa)}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="terpilih" className="mt-8">
        <h2 id="terpilih" className="text-lg font-bold">
          Belanja terpilih {hasil.terpilih.length > 0 ? `(${hasil.terpilih.length})` : ""}
        </h2>
        {hasil.terpilih.length > 0 ? (
          <>
            <p className="text-sm text-muted">
              {ringkas.setuju} disetujui, {ringkas.tunda} ditunda, {ringkas.tolak} ditolak, {ringkas.belum} belum diputuskan. Keputusan ada di tangan desa.
            </p>
            <ol className={`mt-3 divide-y divide-line rounded-card border border-line bg-surface transition-opacity duration-300 ${menghitung ? "opacity-50" : ""}`}>
              {hasil.terpilih.map((b, i) => (
                <PriorityRow
                  key={keyBaris(b)}
                  nomor={i + 1}
                  baris={b}
                  namaItem={nama(b.itemKode)}
                  satuan={satuan(b.itemKode)}
                  sumberHarga={sumberHarga(b.itemKode, b.aksi)}
                  keputusan={sim.keputusan[keyBaris(b)]?.keputusan}
                  catatan={sim.keputusan[keyBaris(b)]?.catatan}
                  onKeputusan={(k) => setKeputusan(keyBaris(b), k)}
                  onCatatan={(c) => setCatatan(keyBaris(b), c)}
                />
              ))}
            </ol>
          </>
        ) : (
          <div className="mt-3">
            <EmptyState title={keadaan === "kurang" ? "Belum ada belanja yang muat." : keadaan === "tanpaHarga" ? "Belum ada harga." : "Belum ada urutan."}>
              {kalimat}
            </EmptyState>
          </div>
        )}
      </section>

      {hasil.tidakTerdanai.length > 0 ? (
        <details className="mt-6 rounded-card border border-line bg-surface">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold">Belum terdanai ({hasil.tidakTerdanai.length})</summary>
          <ul className="divide-y divide-line border-t border-line">
            {hasil.tidakTerdanai.map((b) => (
              <li key={keyBaris(b)} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    <AksiLabel aksi={b.aksi} /> {nama(b.itemKode)}
                  </span>
                  <span className="tabular text-sm">{formatRupiah(b.biayaRp)}</span>
                </div>
                <p className="text-sm text-muted">{b.alasan}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {hasil.tanpaHarga.length > 0 ? (
        <section aria-labelledby="tanpa-harga" className="mt-6">
          <h2 id="tanpa-harga" className="text-lg font-bold">
            Belum punya harga
          </h2>
          <p className="text-sm text-muted">Item ini belum masuk urutan. Isi harga dari penawaran setempat.</p>
          <ul className="mt-2 space-y-2">
            {hasil.tanpaHarga.map((k) => (
              <li key={k} className="flex items-center justify-between gap-3 rounded-card border border-warn/40 bg-surface px-4 py-3">
                <span className="font-semibold">{nama(k)}</span>
                <button type="button" onClick={() => bukaIsiHarga(k)} className="min-h-11 shrink-0 rounded-card border border-line bg-paper px-4 text-sm font-semibold">
                  Isi harga
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div ref={panelRef} className="mt-6 scroll-mt-4">
        <PanelPaketHarga
          catalog={catalog}
          paket={konteks.paket}
          harga={konteks.harga}
          edit={edit}
          setEdit={setEdit}
          buka={panelBuka}
          setBuka={setPanelBuka}
          onSimpanTarget={(itemKode, target, alasan) => {
            setSim((s) => ({ ...s, paket: [...s.paket.filter((p) => p.itemKode !== itemKode), { itemKode, target, alasan }] }));
            setEdit(null);
          }}
          onSimpanHarga={(itemKode, aksi, hargaRp, sumber) => {
            setSim((s) => ({
              ...s,
              harga: [...s.harga.filter((h) => !(h.itemKode === itemKode && h.aksi === aksi)), { itemKode, aksi, hargaRp, sumber }],
            }));
            setEdit(null);
          }}
        />
      </div>

      <BilahAksi
        teks={
          disetujui.length > 0
            ? `${disetujui.length} baris disetujui, total ${formatRupiah(totalBiaya(disetujui))}.`
            : "Belum ada baris yang disetujui."
        }
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

