"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { formatRupiah, formatSkor } from "@/lib/format";
import { keyBaris, totalBiaya } from "@/lib/prioritas";
import { RingkasKeputusan } from "./GrafikPrioritas";
import { KepalaPrioritas } from "./KepalaPrioritas";
import { PanelPaketHarga, type Edit } from "./PanelPaketHarga";
import { PapanKeputusan } from "./PapanKeputusan";
import { AksiLabel } from "./PriorityRow";
import { usePrioritas, type DataPrioritas } from "./usePrioritas";

/**
 * Langkah 2, Keputusan (App Flow v2 §3.8): papan saran belanja dari sistem untuk pagu yang tersimpan
 * di paling atas, lalu item yang belum punya harga, ringkasan pagu dan keputusan, serta pengaturan paket
 * minimum dan harga. Pagu diatur di langkah 1, Simulasi.
 */
export function PrioritasView(data: DataPrioritas) {
  const { kode, namaDesa, catalog } = data;
  const p = usePrioritas(data);
  const { hasil, keputusan, ringkas, disetujui, pagu } = p;
  const [edit, setEdit] = useState<Edit>(null);
  const [panelBuka, setPanelBuka] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  function bukaIsiHarga(itemKode: string) {
    setEdit({ jenis: "harga", itemKode, aksi: "beli" });
    setPanelBuka(true);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
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
        <h2 id="terpilih" className="text-lg font-bold">
          Saran belanja dari sistem {hasil.terpilih.length > 0 ? `(${hasil.terpilih.length})` : ""}
        </h2>
        {hasil.terpilih.length > 0 ? (
          <>
            <p className="max-w-[80ch] text-sm text-muted">
              Disusun otomatis dari catatan alat MPA, paket minimum, dan harga acuan; nomor = urutan dari sistem. Hanya yang disetujui masuk usulan.
            </p>
            <PapanKeputusan
              terpilih={hasil.terpilih}
              keputusan={keputusan}
              nama={p.nama}
              satuan={p.satuan}
              sumberHarga={p.sumberHarga}
              stok={(kode) => p.readiness.items.find((i) => i.itemKode === kode)}
              onKeputusan={(b, k) => p.pilihKeputusan(b.itemKode, b.aksi, k, keputusan[keyBaris(b)]?.catatan)}
              onCatatan={(b, k, c) => p.ubahCatatan(b.itemKode, b.aksi, k, c)}
            />
          </>
        ) : (
          <div className="mt-3">
            <EmptyState
              title={p.keadaan === "kurang" ? "Belum ada belanja yang muat." : p.keadaan === "tanpaHarga" ? "Belum ada harga." : "Belum ada urutan."}
              action={{ href: `/desa/${kode}/prioritas/simulasi`, label: "Atur pagu" }}
            >
              {p.kalimat}
            </EmptyState>
          </div>
        )}
      </section>

      {/* Item tanpa harga belum bisa masuk saran: langsung di bawah papan supaya tidak terlewat. */}
      {hasil.tanpaHarga.length > 0 ? (
        <section aria-labelledby="tanpa-harga" className="mt-6 rounded-panel border border-warn/40 bg-warn-soft p-4 md:p-5">
          <h2 id="tanpa-harga" className="font-bold">
            Belum punya harga ({hasil.tanpaHarga.length})
          </h2>
          <p className="text-sm text-muted">Item ini belum masuk saran karena harganya belum ada. Isi harga dari penawaran setempat.</p>
          <ul className="mt-3 space-y-2">
            {hasil.tanpaHarga.map((k) => (
              <li key={k} className="flex items-center justify-between gap-3 rounded-card border border-line bg-surface px-4 py-2.5">
                <span className="font-semibold">{p.nama(k)}</span>
                <button type="button" onClick={() => bukaIsiHarga(k)} className="min-h-11 shrink-0 rounded-card border border-line bg-paper px-4 text-sm font-semibold">
                  Isi harga
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Ringkasan: pagu yang dipakai (diatur di Simulasi) dan keputusan desa sejauh ini. */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section aria-labelledby="ringkas-pagu" className="flex flex-col rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 id="ringkas-pagu" className="font-bold">
            Pagu belanja
          </h2>
          <dl className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-3">
            <div>
              <dt className="text-sm text-muted">Pagu</dt>
              <dd className="tabular text-lg font-semibold leading-tight">{formatRupiah(pagu)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Terpakai</dt>
              <dd className="tabular text-lg font-semibold leading-tight">{formatRupiah(hasil.terpakaiRp)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Skor</dt>
              <dd className="tabular text-lg font-semibold leading-tight">
                {formatSkor(p.skorSekarang)} <span aria-hidden="true">→</span>
                <span className="sr-only">menjadi</span> <span className="text-ember">{formatSkor(hasil.skorSesudah)}</span>
              </dd>
            </div>
          </dl>
          <Link
            href={`/desa/${kode}/prioritas/simulasi`}
            className="group mt-auto inline-flex min-h-11 items-center gap-1.5 self-start pt-3 text-sm font-semibold text-ember"
          >
            Ubah pagu di langkah 1, Simulasi
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </section>
        <section aria-labelledby="keputusan" className="rounded-panel border border-line bg-surface p-5 shadow-card">
          <h2 id="keputusan" className="font-bold">
            Keputusan desa
          </h2>
          <p className="text-sm text-muted">Dari {hasil.terpilih.length} saran belanja.</p>
          <div className="mt-3">
            <RingkasKeputusan jumlah={{ setuju: ringkas.setuju, tunda: ringkas.tunda, tolak: ringkas.tolak, belum: ringkas.belum }} />
          </div>
        </section>
      </div>

      {hasil.tidakTerdanai.length > 0 ? (
        <details className="mt-6 rounded-card border border-line bg-surface">
          <summary className="flex min-h-12 cursor-pointer items-center px-4 font-bold">
            Belum terdanai dengan pagu ini ({hasil.tidakTerdanai.length})
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {hasil.tidakTerdanai.map((b) => (
              <li key={keyBaris(b)} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">
                    <AksiLabel aksi={b.aksi} /> {p.nama(b.itemKode)}
                  </span>
                  <span className="tabular text-sm">{formatRupiah(b.biayaRp)}</span>
                </div>
                <p className="text-sm text-muted">{b.alasan}</p>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <div ref={panelRef} className="mt-6 scroll-mt-4">
        <PanelPaketHarga
          catalog={catalog}
          paket={p.paket}
          harga={p.harga}
          edit={edit}
          setEdit={setEdit}
          buka={panelBuka}
          setBuka={setPanelBuka}
          onSimpanTarget={async (itemKode, target, alasan) => {
            if (await p.simpanTarget(itemKode, target, alasan)) setEdit(null);
          }}
          onSimpanHarga={async (itemKode, aksi, hargaRp, sumber) => {
            if (await p.simpanHarga(itemKode, aksi, hargaRp, sumber)) setEdit(null);
          }}
        />
      </div>

      <BilahAksi
        teks={
          disetujui.length > 0 ? `${disetujui.length} baris disetujui, total ${formatRupiah(totalBiaya(disetujui))}.` : "Belum ada baris yang disetujui."
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
