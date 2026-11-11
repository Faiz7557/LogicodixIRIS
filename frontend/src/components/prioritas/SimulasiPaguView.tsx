"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { rankPriorities } from "@/lib/engine/priority";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import { PAGU_SLIDER_MAKS } from "@/lib/prioritas";
import { BatangPagu, CakupanSesudah, KurvaSkorPagu, type BarisCakupan } from "./GrafikPrioritas";
import { KepalaPrioritas } from "./KepalaPrioritas";
import { PaguControl } from "./PaguControl";
import { usePrioritas, type DataPrioritas } from "./usePrioritas";

/**
 * Layar Simulasi pagu: coba besar pagu, lihat skor sesudah belanja, ke mana pagu dipakai,
 * kurva skor untuk tiap besar pagu, dan cakupan paket minimum. Pagu yang dipilih tersimpan
 * dan langsung dipakai layar Saran dan keputusan.
 */
export function SimulasiPaguView(data: DataPrioritas) {
  const { kode, namaDesa, catalog } = data;
  const p = usePrioritas(data);
  const { hasil, readiness, paket, harga, pagu } = p;

  // Kurva skor terhadap pagu: mesin urutan yang sama (fungsi murni) dihitung di sekitar 60 titik,
  // sampai sedikit di atas biaya semua kebutuhan. Katalog dibatasi ke item paket, sama seperti di server.
  const titikKurva = useMemo(() => {
    const boleh = new Set(paket.map((x) => x.itemKode));
    const masukan = { catalog: catalog.filter((c) => boleh.has(c.kode)), readiness, prices: harga };
    const skorPada = (paguRp: number) => rankPriorities({ ...masukan, paguRp });
    const semua = skorPada(1e13).terpakaiRp;
    const atas = Math.min(Math.max(semua * 1.15, pagu * 1.15, 10_000_000), Math.max(PAGU_SLIDER_MAKS, pagu * 1.15));
    const langkah = Math.max(250_000, Math.ceil(atas / 60 / 250_000) * 250_000);
    const n = Math.ceil(atas / langkah);
    return Array.from({ length: n + 1 }, (_, i) => ({ pagu: i * langkah, skor: skorPada(i * langkah).skorSesudah }));
  }, [catalog, paket, readiness, harga, pagu]);

  // Cakupan tiap item sesudah belanja terpilih (beli dan perbaiki sama-sama menambah alat yang berfungsi).
  const cakupan: BarisCakupan[] = readiness.items
    .filter((i) => i.target > 0)
    .map((i) => ({
      kode: i.itemKode,
      nama: p.nama(i.itemKode),
      satuan: p.satuan(i.itemKode),
      target: i.target,
      sebelum: i.berfungsi,
      sesudah: i.berfungsi + hasil.terpilih.filter((b) => b.itemKode === i.itemKode).reduce((a, b) => a + b.qty, 0),
    }));

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      <KepalaPrioritas
        kode={kode}
        namaDesa={namaDesa}
        aktif={1}
        ringkas={p.ringkasLangkah}
        judul="Berapa pagu yang dibutuhkan?"
        kalimat={p.kalimat}
        menghitung={p.menghitung}
        galat={p.galat}
      />

      {/* Baris atas: pagu di kiri, angka utama dan pemakaian pagu di kanan. */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <PaguControl pagu={pagu} onChange={p.setPagu} />

        <div aria-busy={p.menghitung} className={`flex flex-col gap-4 transition-opacity duration-300 ${p.menghitung ? "opacity-60" : ""}`}>
          <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KartuKpi
              gelap
              label="Skor kesiapan"
              nilai={formatSkor(hasil.skorSesudah)}
              tambahan={
                p.selisih > 0
                  ? `dari ${formatSkor(p.skorSekarang)}, naik ${formatSkor(p.selisih)} poin`
                  : `sama dengan sekarang (${formatSkor(p.skorSekarang)})`
              }
              naik={p.selisih > 0}
            />
            <KartuKpi
              label="Terpakai"
              nilai={formatRupiah(hasil.terpakaiRp)}
              tambahan={`${pagu > 0 ? Math.round((hasil.terpakaiRp / pagu) * 100) : 0}% dari pagu`}
            />
            <KartuKpi label="Sisa pagu" nilai={formatRupiah(p.sisa)} tambahan={p.sisa > 0 ? "belum terpakai" : "pagu habis terpakai"} />
            <KartuKpi
              label="Saran belanja"
              nilai={formatAngka(hasil.terpilih.length)}
              tambahan={`${hasil.tidakTerdanai.length} belum terdanai`}
            />
          </dl>
          <section aria-labelledby="pakai-pagu" className="rounded-panel border border-line bg-surface p-5 shadow-card">
            <h2 id="pakai-pagu" className="font-bold">
              Ke mana pagu dipakai?
            </h2>
            <div className="mt-2">
              <BatangPagu pagu={pagu} terpilih={hasil.terpilih} nama={p.nama} />
            </div>
          </section>
        </div>
      </div>

      {/* Grafik utama: skor sesudah belanja untuk tiap besar pagu. */}
      <section aria-labelledby="kurva" className="mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="kurva" className="text-lg font-bold">
            Berapa skor yang didapat dari tiap besar pagu?
          </h2>
          <ul className="flex flex-wrap gap-x-4 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-0.5 w-4 rounded-full" style={{ background: "var(--ember)" }} /> Skor sesudah belanja
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-4 border-t border-dashed border-faint" /> Skor sekarang
            </li>
          </ul>
        </div>
        <p className="text-sm text-muted">
          Tiap titik adalah susunan belanja terbaik untuk pagu itu. Kurva yang mendatar berarti tambahan dana tidak lagi menaikkan skor. Klik kurva untuk
          mencoba pagu lain.
          {hasil.tanpaHarga.length > 0
            ? ` ${hasil.tanpaHarga.map(p.nama).join(", ")} belum punya harga, jadi kurva berhenti di bawah 100 sampai harganya diisi.`
            : ""}
        </p>
        <div className="mt-3">
          <KurvaSkorPagu titik={titikKurva} pagu={pagu} skorSekarang={p.skorSekarang} onPilih={p.setPagu} />
        </div>
      </section>

      <section aria-labelledby="cakupan" className="mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6">
        <h2 id="cakupan" className="text-lg font-bold">
          Cakupan paket minimum, sekarang dan sesudah belanja
        </h2>
        <p className="text-sm text-muted">Berapa persen paket minimum yang terpenuhi bila saran belanja untuk pagu ini dilaksanakan.</p>
        <div className="mt-3">
          <CakupanSesudah baris={cakupan} />
        </div>
      </section>

      <BilahAksi
        teks={
          hasil.terpilih.length > 0
            ? `${hasil.terpilih.length} saran belanja, total ${formatRupiah(hasil.terpakaiRp)}.`
            : "Belum ada saran belanja untuk pagu ini."
        }
      >
        <Link href={`/desa/${kode}/prioritas`} className={kelasAksiUtama}>
          Lanjut ke keputusan
        </Link>
      </BilahAksi>
    </div>
  );
}

/** Kotak angka dasbor. `gelap` untuk angka utama (pola kartu gelap di halaman rincian item). */
function KartuKpi({ label, nilai, tambahan, gelap = false, naik = false }: { label: string; nilai: string; tambahan: string; gelap?: boolean; naik?: boolean }) {
  return (
    <div
      className={`flex flex-col-reverse justify-end gap-1 rounded-panel p-4 ${
        gelap ? "bg-gradient-to-br from-[#1f2a36] via-[#2b3440] to-[#4a3a2e] text-white" : "border border-line bg-surface shadow-card"
      }`}
    >
      <dd>
        <span className={`tabular block font-semibold leading-tight tracking-[-0.02em] ${nilai.length > 10 ? "text-xl" : "text-3xl"}`}>{nilai}</span>
        <span className={`mt-1 flex items-center gap-1 text-xs ${gelap ? "text-white/75" : "text-muted"}`}>
          {naik ? (
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          ) : null}
          {tambahan}
        </span>
      </dd>
      <dt className={`text-sm font-semibold ${gelap ? "text-white/90" : "text-muted"}`}>{label}</dt>
    </div>
  );
}
