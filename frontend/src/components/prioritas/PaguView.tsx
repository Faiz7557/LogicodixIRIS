"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAngkaNaik } from "@/components/paparan/dasbor/dasar";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { rankPriorities } from "@/lib/engine/priority";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import { keyBaris, namaAksi } from "@/lib/prioritas";
import type { PriorityResult } from "@/lib/types";
import { BatangPagu, CakupanSesudah, KurvaSkorPagu, type BarisCakupan } from "./GrafikPrioritas";
import { KepalaPrioritas } from "./KepalaPrioritas";
import { PaguControl } from "./PaguControl";
import { usePrioritas, type DataPrioritas } from "./usePrioritas";

const LANGKAH_TAMBAHAN = 250_000;
const bulatAtas = (rp: number) => Math.ceil(rp / LANGKAH_TAMBAHAN) * LANGKAH_TAMBAHAN;

/**
 * Langkah 1, Pagu. Pagu tidak dipilih di sini: desa menyalin anggaran kesiapan karhutla yang sudah ditetapkan.
 * Dasbor menjawab apakah pagu itu cukup, ke mana dipakai, dan berapa kekurangan yang perlu diajukan
 * lewat kanal lain (BPBD, Daops, CSR). "Coba dana tambahan" hanya hitungan di layar: tidak disimpan
 * dan tidak mengubah pagu; semua kartu, kurva, daftar, dan cakupan ikut bergerak bersamanya.
 */
export function PaguView(data: DataPrioritas) {
  const { kode, namaDesa, catalog } = data;
  const p = usePrioritas(data);
  const { hasil, readiness, paket, harga, pagu } = p;
  const [tambahan, setTambahan] = useState(0);

  // Mesin urutan yang sama (fungsi murni), katalog dibatasi ke item paket seperti di server.
  const urutkan = useMemo(() => {
    const boleh = new Set(paket.map((x) => x.itemKode));
    const masukan = { catalog: catalog.filter((c) => boleh.has(c.kode)), readiness, prices: harga };
    return (paguRp: number) => rankPriorities({ ...masukan, paguRp });
  }, [catalog, paket, readiness, harga]);

  // Kurva skor untuk tiap besar dana; titik pagu dan kebutuhan penuh dihitung persis supaya label = angka kartu.
  const { titikKurva, kebutuhan, skorPenuh } = useMemo(() => {
    const penuh = urutkan(1e13);
    const atas = Math.max(penuh.terpakaiRp * 1.1, pagu * 1.15, 10_000_000);
    const langkah = Math.max(LANGKAH_TAMBAHAN, bulatAtas(atas / 60));
    const n = Math.ceil(atas / langkah);
    const besar = new Set([...Array.from({ length: n + 1 }, (_, i) => i * langkah), pagu, penuh.terpakaiRp]);
    return {
      titikKurva: [...besar].sort((a, b) => a - b).map((b) => ({ pagu: b, skor: urutkan(b).skorSesudah })),
      kebutuhan: penuh.terpakaiRp,
      skorPenuh: penuh.skorSesudah,
    };
  }, [urutkan, pagu]);

  // Kekurangan = biaya belanja yang tidak muat di pagu (sama dengan total daftar dan bahan usulan).
  const kekurangan = hasil.tidakTerdanai.reduce((s, r) => s + r.biayaRp, 0);
  const maksTambahan = bulatAtas(Math.max(kekurangan, kebutuhan - pagu, 0));
  const tambahanAktif = Math.min(tambahan, maksTambahan);
  const coba: PriorityResult = useMemo(() => (tambahanAktif > 0 ? urutkan(pagu + tambahanAktif) : hasil), [tambahanAktif, urutkan, pagu, hasil]);
  const sisaKurang = coba.tidakTerdanai.reduce((s, r) => s + r.biayaRp, 0);
  const tertutup = Math.max(0, kekurangan - sisaKurang);

  const jumlahPada = (r: PriorityResult, kunci: string) => r.terpilih.filter((b) => keyBaris(b) === kunci).reduce((a, b) => a + b.qty, 0);
  const tambahDari = (r: PriorityResult, itemKode: string) => r.terpilih.filter((b) => b.itemKode === itemKode).reduce((a, b) => a + b.qty, 0);

  const cakupan: BarisCakupan[] = readiness.items
    .filter((i) => i.target > 0)
    .map((i) => ({
      kode: i.itemKode,
      nama: p.nama(i.itemKode),
      satuan: p.satuan(i.itemKode),
      target: i.target,
      sebelum: i.berfungsi,
      sesudah: i.berfungsi + tambahDari(hasil, i.itemKode),
      denganTambahan: tambahanAktif > 0 ? i.berfungsi + tambahDari(coba, i.itemKode) : undefined,
    }));

  // Dana tambahan sampai baris ke-i daftar kekurangan ikut terdanai (urutan sistem).
  const sampaiBaris = (i: number) =>
    bulatAtas(Math.max(0, hasil.tidakTerdanai.slice(0, i + 1).reduce((s, r) => s + r.biayaRp, 0) - p.sisa));

  const cukup = kekurangan === 0 && hasil.tanpaHarga.length === 0;
  const tunda = (i: number) => ({ animationDelay: `${120 + i * 80}ms` });

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      <KepalaPrioritas
        kode={kode}
        namaDesa={namaDesa}
        aktif={1}
        ringkas={p.ringkasLangkah}
        judul="Cukupkah pagu yang tersedia?"
        kalimat={p.kalimat}
        menghitung={p.menghitung}
        galat={p.galat}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Kiri: isian pagu dan coba dana tambahan. */}
        <div className="flex flex-col gap-4">
          <div className="masuk" style={tunda(0)}>
            <PaguControl pagu={pagu} onChange={p.setPagu} kebutuhan={kebutuhan} />
          </div>
          {maksTambahan > 0 ? (
            <div className="masuk" style={tunda(1)}>
              <CobaTambahan nilai={tambahanAktif} maks={maksTambahan} kekurangan={kekurangan} onUbah={setTambahan} />
            </div>
          ) : null}
        </div>

        {/* Kanan: angka utama dan pemakaian pagu. */}
        <div aria-busy={p.menghitung} className={`flex flex-col gap-4 transition-opacity duration-300 ${p.menghitung ? "opacity-60" : ""}`}>
          <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KartuKpi
              urut={0}
              gelap
              label={tambahanAktif > 0 ? "Skor dengan tambahan" : "Skor kesiapan"}
              nilai={coba.skorSesudah}
              format={formatSkor}
              tambahan={
                tambahanAktif > 0
                  ? `Pagu saja ${formatSkor(hasil.skorSesudah)}, naik lagi ${formatSkor(Math.max(0, coba.skorSesudah - hasil.skorSesudah))}`
                  : p.selisih > 0
                    ? `dari ${formatSkor(p.skorSekarang)}, naik ${formatSkor(p.selisih)} poin`
                    : `sama dengan sekarang (${formatSkor(p.skorSekarang)})`
              }
              naik={coba.skorSesudah > p.skorSekarang}
            />
            <KartuKpi
              urut={1}
              label="Terpakai"
              nilai={hasil.terpakaiRp}
              format={formatRupiah}
              tambahan={`${pagu > 0 ? Math.round((hasil.terpakaiRp / pagu) * 100) : 0}% dari pagu`}
            />
            <KartuKpi urut={2} label="Sisa pagu" nilai={p.sisa} format={formatRupiah} tambahan={p.sisa > 0 ? "belum terpakai" : "pagu habis terpakai"} />
            <KartuKpi
              urut={3}
              label={tambahanAktif > 0 ? "Sisa kekurangan" : "Kekurangan"}
              nilai={sisaKurang}
              format={formatRupiah}
              tambahan={
                tambahanAktif > 0
                  ? `${formatRupiah(tertutup)} tertutup tambahan`
                  : kekurangan > 0
                    ? `${formatAngka(hasil.tidakTerdanai.length)} belanja belum terdanai`
                    : "pagu mencukupi"
              }
              peringatan={sisaKurang > 0}
            />
          </dl>
          <section aria-labelledby="pakai-pagu" className="masuk rounded-panel border border-line bg-surface p-5 shadow-card" style={tunda(4)}>
            <h2 id="pakai-pagu" className="font-bold">
              Ke mana pagu dipakai?
            </h2>
            <div className="mt-2">
              <BatangPagu pagu={pagu} terpilih={hasil.terpilih} nama={p.nama} />
            </div>
          </section>
        </div>
      </div>

      {/* Kekurangan: belanja yang tidak muat di pagu, bahan usulan ke kanal lain. */}
      {hasil.tidakTerdanai.length > 0 ? (
        <section aria-labelledby="kurang" className="masuk mt-4 rounded-panel border border-water/40 bg-surface p-5 shadow-card md:p-6" style={tunda(5)}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="kurang" className="text-lg font-bold">
              Belum muat di pagu ({hasil.tidakTerdanai.length})
            </h2>
            <p className="tabular text-sm font-semibold">Total {formatRupiah(kekurangan)}</p>
          </div>
          <p className="max-w-[80ch] text-sm text-muted">
            Belanja ini tetap dibutuhkan tetapi tidak muat di pagu. Ajukan lewat kanal BPBD, Daops, atau CSR di langkah Usulan. Ketuk satu baris untuk melihat
            berapa dana tambahan yang dibutuhkan sampai baris itu ikut terdanai.
          </p>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line">
            {hasil.tidakTerdanai.map((r, i) => {
              const kunci = keyBaris(r);
              const dapat = Math.max(0, jumlahPada(coba, kunci) - jumlahPada(hasil, kunci));
              const keadaan = dapat >= r.qty ? "penuh" : dapat > 0 ? "sebagian" : "belum";
              const target = sampaiBaris(i);
              return (
                <li key={kunci}>
                  <button
                    type="button"
                    onClick={() => setTambahan(tambahanAktif === target ? 0 : target)}
                    aria-pressed={tambahanAktif === target}
                    className={`tekan flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors duration-300 hover:bg-paper ${
                      keadaan === "penuh" ? "bg-water-soft" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="font-semibold">{p.nama(r.itemKode)}</span>{" "}
                      <span className="text-muted">
                        · {namaAksi(r.aksi)} {formatAngka(r.qty)} {p.satuan(r.itemKode)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {keadaan === "penuh" ? (
                          <span key="penuh" className="muncul font-semibold text-water">
                            Tertutup dana tambahan
                          </span>
                        ) : keadaan === "sebagian" ? (
                          <span key="sebagian" className="muncul font-semibold text-water">
                            Sebagian: {formatAngka(dapat)} dari {formatAngka(r.qty)} {p.satuan(r.itemKode)}
                          </span>
                        ) : (
                          <>Butuh tambahan {formatRupiah(target)} sampai baris ini</>
                        )}
                      </span>
                    </span>
                    <span className="tabular shrink-0 font-semibold">{formatRupiah(r.biayaRp)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Kurva: skor untuk tiap besar dana. Klik di kanan pagu = coba dana tambahan sebesar selisihnya. */}
      <section aria-labelledby="kurva" className="masuk mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(6)}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="kurva" className="text-lg font-bold">
            {cukup ? "Skor untuk tiap besar dana" : "Seberapa besar dana tambahan menaikkan skor?"}
          </h2>
          <ul className="flex flex-wrap gap-x-4 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-0.5 w-4 rounded-full" style={{ background: "var(--ember)" }} /> Skor sesudah belanja
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-4 border-t border-dashed border-faint" /> Skor sekarang
            </li>
            {kekurangan > 0 ? (
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="inline-block size-3 rounded-[3px]" style={{ background: "var(--water)", opacity: 0.25 }} /> Kekurangan
              </li>
            ) : null}
          </ul>
        </div>
        <p className="text-sm text-muted">
          {kekurangan > 0
            ? `Pagu membawa skor ke ${formatSkor(hasil.skorSesudah)}. Bila kekurangan ${formatRupiah(kekurangan)} tertutup dari kanal lain, skor bisa mencapai ${formatSkor(skorPenuh)}. Klik kurva di kanan pagu untuk mencoba dana tambahan sebesar selisihnya.`
            : "Pagu sudah menutup semua kebutuhan yang punya harga. Kurva yang mendatar berarti tambahan dana tidak lagi menaikkan skor."}
          {hasil.tanpaHarga.length > 0
            ? ` ${hasil.tanpaHarga.map(p.nama).join(", ")} belum punya harga, jadi kurva berhenti di bawah 100 sampai harganya diisi.`
            : ""}
        </p>
        <div className="mt-3">
          <KurvaSkorPagu
            titik={titikKurva}
            pagu={pagu}
            skorSekarang={p.skorSekarang}
            kebutuhan={kebutuhan}
            coba={pagu + tambahanAktif}
            onPilih={maksTambahan > 0 ? (b) => setTambahan(Math.min(Math.max(0, b - pagu), maksTambahan)) : undefined}
          />
        </div>
      </section>

      <section aria-labelledby="cakupan" className="masuk mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(7)}>
        <h2 id="cakupan" className="text-lg font-bold">
          Cakupan paket minimum
        </h2>
        <p className="text-sm text-muted">
          Berapa persen paket minimum yang terpenuhi sekarang, sesudah belanja dari pagu
          {tambahanAktif > 0 ? `, dan bila dana tambahan ${formatRupiah(tambahanAktif)} ikut dibelanjakan` : ""}.
        </p>
        <div className="mt-3">
          <CakupanSesudah baris={cakupan} labelSesudah="Dari pagu" />
        </div>
      </section>

      <BilahAksi
        teks={
          hasil.terpilih.length > 0
            ? `${hasil.terpilih.length} saran belanja dari pagu, total ${formatRupiah(hasil.terpakaiRp)}.`
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

/**
 * Coba dana tambahan dari luar pagu. Tiga pilihan cepat dan penggeser (menyeret bukan satu-satunya cara).
 * Hanya hitungan di layar: tidak tersimpan dan tidak mengubah pagu.
 */
function CobaTambahan({ nilai, maks, kekurangan, onUbah }: { nilai: number; maks: number; kekurangan: number; onUbah: (v: number) => void }) {
  const pilihan = [
    { label: "Tanpa", nilai: 0 },
    { label: "Separuh", nilai: bulatAtas(kekurangan / 2) },
    { label: "Semua", nilai: maks },
  ];
  const tampil = useAngkaNaik(nilai, 400);
  return (
    <section aria-labelledby="coba-judul" className="rounded-card border border-water/40 bg-surface px-4 py-4">
      <h2 id="coba-judul" className="text-lg font-bold">
        Coba dana tambahan
      </h2>
      <p className="text-sm text-muted">Bila sebagian kekurangan tertutup dari BPBD, Daops, atau CSR. Tidak disimpan dan tidak mengubah pagu.</p>
      <p className="tabular mt-3 text-2xl font-bold text-water" aria-live="polite">
        + {formatRupiah(Math.round(tampil / 1000) * 1000)}
      </p>
      <div role="group" aria-label="Pilihan dana tambahan cepat" className="relative mt-2 grid grid-cols-3 rounded-full border border-line bg-surface-2 p-1">
        {pilihan.map((x) => {
          const on = nilai === x.nilai;
          return (
            <button
              key={x.label}
              type="button"
              aria-pressed={on}
              onClick={() => onUbah(x.nilai)}
              className={`tekan relative min-h-9 rounded-full px-2 text-sm font-semibold transition-colors duration-300 ${on ? "bg-ink text-white shadow-card" : "text-muted hover:text-ink"}`}
            >
              {x.label}
            </button>
          );
        })}
      </div>
      <label htmlFor="coba-geser" className="mt-3 block text-sm text-muted">
        Atau geser (Rp0 sampai {formatRupiah(maks)})
      </label>
      <input
        id="coba-geser"
        type="range"
        min={0}
        max={maks}
        step={LANGKAH_TAMBAHAN}
        value={nilai}
        onChange={(e) => onUbah(Number(e.target.value))}
        aria-valuetext={formatRupiah(nilai)}
        className="mt-1 h-11 w-full accent-[var(--water)]"
      />
    </section>
  );
}

/** Kotak angka dasbor; angka berhitung dari nilai lama ke nilai baru. `gelap` untuk angka utama. */
function KartuKpi({
  label,
  nilai,
  format,
  tambahan,
  urut,
  gelap = false,
  naik = false,
  peringatan = false,
}: {
  label: string;
  nilai: number;
  format: (n: number) => string;
  tambahan: string;
  urut: number;
  gelap?: boolean;
  naik?: boolean;
  peringatan?: boolean;
}) {
  const tampil = useAngkaNaik(nilai);
  const teks = format(format === formatSkor ? tampil : Math.round(tampil));
  const panjang = format(nilai).length;
  return (
    <div
      style={{ animationDelay: `${120 + urut * 80}ms` }}
      className={`masuk flex flex-col-reverse justify-end gap-1 rounded-panel p-4 transition-colors duration-500 ${
        gelap
          ? "bg-gradient-to-br from-[#1f2a36] via-[#2b3440] to-[#4a3a2e] text-white"
          : `border bg-surface shadow-card ${peringatan ? "border-water/50" : "border-line"}`
      }`}
    >
      <dd>
        <span aria-hidden="true" className={`tabular block font-semibold leading-tight tracking-[-0.02em] ${panjang > 7 ? "text-xl" : "text-3xl"}`}>
          {teks}
        </span>
        <span className="sr-only">{format(nilai)}</span>
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
