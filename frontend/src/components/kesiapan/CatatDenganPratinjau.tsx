"use client";

import { useCallback, useMemo, useState } from "react";
import { FormInventaris } from "@/components/inventaris/FormInventaris";
import { Panel } from "@/components/ui/Panel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { computeReadiness } from "@/lib/engine/readiness";
import { formatAngka, formatSkor } from "@/lib/format";
import { bacaAngka, type FormState } from "@/lib/inventaris";
import type { CatalogItem, InventoryRow, ReadinessItem, Status } from "@/lib/types";
import { ReadinessGauge } from "./ReadinessGauge";

/** Status satu item dari cakupannya, ambang sama dengan halaman rincian. */
function statusItem(coverage: number): Status {
  if (coverage >= 1) return "siap";
  if (coverage < 0.25) return "rawan";
  return "sebagian";
}

/**
 * Formulir Catat Alat satu item dengan pratinjau langsung di sampingnya: bagian alat yang berfungsi dari jumlah
 * total isian, kekurangan terhadap paket minimum, dan skor kesiapan desa
 * dihitung ulang tiap kali angka diubah, memakai mesin yang sama dengan server (computeReadiness).
 * Hanya pratinjau: angka resmi berubah setelah Simpan.
 */
export function CatatDenganPratinjau({
  kode,
  item,
  catalog,
  items,
  skorAwal,
  statusAwal,
  tersimpan,
  terakhir,
  namaPengisi,
}: {
  kode: string;
  item: CatalogItem;
  /** Katalog lengkap dan semua item kesiapan desa, supaya skor desa bisa dihitung ulang. */
  catalog: CatalogItem[];
  items: ReadinessItem[];
  skorAwal: number;
  statusAwal: Status;
  tersimpan: InventoryRow[];
  terakhir: { oleh: string; waktu: string } | null;
  namaPengisi: string;
}) {
  const [form, setForm] = useState<FormState | null>(null);
  const onNilai = useCallback((f: FormState) => setForm(f), []);
  const awal = items.find((i) => i.itemKode === item.kode)!;

  const pratinjau = useMemo(() => {
    const n = form?.[item.kode];
    const b = n ? bacaAngka(n.berfungsi) : null;
    if (!n || !b || b.jenis !== "ok") return null; // isian kosong atau salah: tampilkan angka sekarang
    const t = bacaAngka(n.total);
    const total = item.punyaRusak && t.jenis === "ok" ? Math.max(t.nilai, b.nilai) : b.nilai;
    // Item lain memakai angka tersimpan; item ini memakai isian formulir.
    const inventory: InventoryRow[] = items
      .filter((i) => !i.belumDiisi && i.itemKode !== item.kode)
      .map((i) => ({ itemKode: i.itemKode, total: i.berfungsi + i.rusak, berfungsi: i.berfungsi }));
    inventory.push({ itemKode: item.kode, total, berfungsi: b.nilai });
    const r = computeReadiness(
      catalog,
      items.map((i) => ({ itemKode: i.itemKode, target: i.target })),
      inventory,
    );
    return { hasil: r, baris: r.items.find((i) => i.itemKode === item.kode)!, total };
  }, [form, item, items, catalog]);

  const baris = pratinjau?.baris ?? awal;
  const skor = pratinjau?.hasil.skor ?? skorAwal;
  const status = pratinjau?.hasil.status ?? statusAwal;
  const n = (x: number) => `${formatAngka(x)} ${item.satuan}`;

  // Speedometer pertama. Item yang punya kondisi rusak: bagian alat yang berfungsi dari jumlah total isian
  // (11 dari 11 = 100%, 10 dari 11 = 91%). Item tanpa keadaan rusak tidak punya total, jadi memakai cakupan paket minimum.
  const pakaiTotal = item.punyaRusak;
  const totalAwal = awal.berfungsi + awal.rusak;
  const total = pratinjau?.total ?? totalAwal;
  const rasio = (b: number, t: number) => (t > 0 ? Math.min(b / t, 1) : 0);
  const fAwal = pakaiTotal ? rasio(awal.berfungsi, totalAwal) : Math.min(awal.coverage, 1);
  const f = pakaiTotal ? rasio(baris.berfungsi, total) : Math.min(baris.coverage, 1);
  const persenAwal = Math.round(fAwal * 100);
  const persen = Math.round(f * 100);
  const kurang = Math.max(baris.target - baris.berfungsi, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="min-w-0">
        <FormInventaris
          kode={kode}
          catalog={[item]}
          target={{ [item.kode]: awal.target }}
          tersimpan={tersimpan}
          terakhir={terakhir}
          namaPengisi={namaPengisi}
          onNilai={onNilai}
        />
      </div>

      {/* Prediksi di bawah form, berdampingan di layar lebar; baris "Sebelumnya" menempel di dasar tiap panel supaya sejajar. */}
      <aside aria-label="Pratinjau hasil isian" className="grid gap-4 md:grid-cols-2">
        <Panel className="flex flex-col p-5">
          <h3 className="font-bold leading-snug">
            {pakaiTotal ? `Prediksi ${item.nama.toLowerCase()} berfungsi` : `Prediksi cakupan ${item.nama.toLowerCase()}`}
          </h3>
          <div className="mx-auto mt-3 w-full max-w-[220px]">
            <ReadinessGauge
              transisi
              skor={persen}
              status={statusItem(f)}
              label={{ teks: pakaiTotal && total === 0 ? "–" : `${persen}%`, sr: pakaiTotal ? " alat berfungsi dari jumlah total" : " dari paket minimum" }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-muted">
            {pakaiTotal
              ? `${formatAngka(baris.berfungsi)} dari ${n(total)} berfungsi · ${n(baris.rusak)} rusak`
              : `${formatAngka(baris.berfungsi)} dari ${n(baris.target)} tersedia`}
          </p>
          {pakaiTotal ? (
            <p className="mt-2 rounded-xl bg-surface-2 px-3 py-2 text-center text-sm">
              Paket minimum {n(baris.target)}:{" "}
              {kurang > 0 ? <span className="font-semibold text-ember">kurang {n(kurang)}</span> : <span className="font-semibold text-ok">terpenuhi</span>}
            </p>
          ) : null}
          <div className="mt-auto">
            <Perubahan sebelum={totalAwal === 0 && pakaiTotal ? "–" : `${persenAwal}%`} selisih={persen - persenAwal} satuan="poin persen" />
          </div>
        </Panel>

        <Panel className="flex flex-col p-5">
          <h3 className="font-bold leading-snug">Prediksi skor kesiapan desa</h3>
          <div className="mx-auto mt-3 w-full max-w-[220px]">
            <ReadinessGauge transisi skor={skor} status={status} />
          </div>
          {status !== statusAwal ? (
            <p className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-sm">
              Status berubah: <StatusBadge status={statusAwal} /> <span aria-hidden="true">→</span>
              <span className="sr-only">menjadi</span> <StatusBadge status={status} />
            </p>
          ) : null}
          <div className="mt-auto">
            <Perubahan sebelum={formatSkor(skorAwal)} selisih={Math.round((skor - skorAwal) * 10) / 10} satuan="poin" desimal />
          </div>
        </Panel>

        <p className="text-sm text-muted md:col-span-2">Pratinjau dari isian di atas. Angka resmi baru berubah setelah kamu menekan Simpan.</p>
      </aside>
    </div>
  );
}

/** Baris "sebelum → sekarang" dengan penanda naik/turun berupa ikon + kata, bukan warna saja. */
function Perubahan({ sebelum, selisih, satuan, desimal = false }: { sebelum: string; selisih: number; satuan: string; desimal?: boolean }) {
  const f = (x: number) => (desimal ? formatSkor(x) : formatAngka(x));
  const naik = selisih > 0;
  const turun = selisih < 0;
  return (
    <div aria-live="polite" className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
      <span className="text-muted">
        Sebelumnya <span className="tabular font-semibold text-ink">{sebelum}</span>
      </span>
      <span
        className={`tabular inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${
          naik ? "bg-ok-soft text-ok" : turun ? "bg-danger-soft text-danger" : "bg-surface-2 text-muted"
        }`}
      >
        {naik || turun ? (
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={naik ? "M12 19V5M6 11l6-6 6 6" : "M12 5v14M6 13l6 6 6-6"} />
          </svg>
        ) : null}
        {naik ? `Naik ${f(selisih)} ${satuan}` : turun ? `Turun ${f(-selisih)} ${satuan}` : "Belum berubah"}
      </span>
    </div>
  );
}
