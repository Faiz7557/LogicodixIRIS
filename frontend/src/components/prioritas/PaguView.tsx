"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAngkaNaik } from "@/components/paparan/dasbor/dasar";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { rankPriorities } from "@/lib/engine/priority";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import { keyBaris, namaAksi, ringkasAnggaran } from "@/lib/prioritas";
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
    const masukan = {
      catalog: catalog.filter((c) => boleh.has(c.kode)),
      readiness,
      prices: harga,
    };
    return (paguRp: number) => rankPriorities({ ...masukan, paguRp });
  }, [catalog, paket, readiness, harga]);

  // Kurva skor untuk tiap besar dana; titik pagu dan kebutuhan penuh dihitung persis supaya label = angka kartu.
  const { titikKurva, skorPenuh } = useMemo(() => {
    const penuh = urutkan(1e13);
    const atas = Math.max(penuh.terpakaiRp * 1.1, pagu * 1.15, 10_000_000);
    const langkah = Math.max(LANGKAH_TAMBAHAN, bulatAtas(atas / 60));
    const n = Math.ceil(atas / langkah);
    const besar = new Set([...Array.from({ length: n + 1 }, (_, i) => i * langkah), pagu, penuh.terpakaiRp]);
    return {
      titikKurva: [...besar].sort((a, b) => a - b).map((b) => ({ pagu: b, skor: urutkan(b).skorSesudah })),
      skorPenuh: penuh.skorSesudah,
    };
  }, [urutkan, pagu]);

  // Kebutuhan, kekurangan, dan cakupan dari fungsi yang sama dengan fakta ringkasan AI.
  const ringkasDana = useMemo(
    () => ringkasAnggaran(hasil, readiness, catalog, pagu, p.keputusan),
    [hasil, readiness, catalog, pagu, p.keputusan],
  );
  const { kebutuhan, kekurangan } = ringkasDana;
  const maksTambahan = bulatAtas(Math.max(kekurangan, kebutuhan - pagu, 0));
  const tambahanAktif = Math.min(tambahan, maksTambahan);
  const coba: PriorityResult = useMemo(() => (tambahanAktif > 0 ? urutkan(pagu + tambahanAktif) : hasil), [tambahanAktif, urutkan, pagu, hasil]);
  const sisaKurang = coba.tidakTerdanai.reduce((s, r) => s + r.biayaRp, 0);
  const tertutup = Math.max(0, kekurangan - sisaKurang);

  const jumlahPada = (r: PriorityResult, kunci: string) => r.terpilih.filter((b) => keyBaris(b) === kunci).reduce((a, b) => a + b.qty, 0);
  const tambahDari = (r: PriorityResult, itemKode: string) => r.terpilih.filter((b) => b.itemKode === itemKode).reduce((a, b) => a + b.qty, 0);

  const cakupan: BarisCakupan[] = ringkasDana.cakupan.map((c) => ({
    ...c,
    denganTambahan: tambahanAktif > 0 ? c.sebelum + tambahDari(coba, c.kode) : undefined,
  }));

  // Dana tambahan sampai baris ke-i daftar kekurangan ikut terdanai (urutan sistem).
  const sampaiBaris = (i: number) => bulatAtas(Math.max(0, hasil.tidakTerdanai.slice(0, i + 1).reduce((s, r) => s + r.biayaRp, 0) - p.sisa));

  const tunda = (i: number) => ({ animationDelay: `${120 + i * 80}ms` });

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      <KepalaPrioritas
        kode={kode}
        namaDesa={namaDesa}
        aktif={1}
        ringkas={p.ringkasLangkah}
        halaman="anggaran"
        judul="Cukupkah anggaran desa untuk alat pemadam?"
        kalimat={p.kalimat}
        menghitung={p.menghitung}
        galat={p.galat}
      />

      {/* Baris 1: isi anggaran di kiri, hasilnya langsung di kanan. */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="masuk h-full" style={tunda(0)}>
          <PaguControl pagu={pagu} onChange={p.setPagu} kebutuhan={kebutuhan} />
        </div>

        <div aria-busy={p.menghitung} className={`flex flex-col gap-3 transition-opacity duration-300 ${p.menghitung ? "opacity-60" : ""}`}>
          <dl className="grid flex-1 auto-rows-fr grid-cols-2 gap-3">
            <KartuKpi
              urut={0}
              gelap
              label={tambahanAktif > 0 ? "Skor kesiapan dengan tambahan" : "Skor kesiapan setelah belanja"}
              nilai={coba.skorSesudah}
              format={formatSkor}
              tambahan={
                tambahanAktif > 0
                  ? `Tanpa tambahan ${formatSkor(hasil.skorSesudah)}, naik lagi ${formatSkor(Math.max(0, coba.skorSesudah - hasil.skorSesudah))} poin`
                  : p.selisih > 0
                    ? `Sekarang ${formatSkor(p.skorSekarang)}, naik ${formatSkor(p.selisih)} poin`
                    : `Tetap ${formatSkor(p.skorSekarang)}, belum ada yang terbeli`
              }
              naik={coba.skorSesudah > p.skorSekarang}
            />
            <KartuKpi
              urut={1}
              label="Sudah disetujui"
              nilai={p.disetujuiRp}
              format={formatRupiah}
              tambahan={
                p.disetujui.length > 0
                  ? `${formatAngka(p.disetujui.length)} belanja, ${pagu > 0 ? Math.round((p.disetujuiRp / pagu) * 100) : 0}% dari anggaran`
                  : "belum ada yang disetujui di langkah 2"
              }
            />
            <KartuKpi
              urut={2}
              label="Sisa anggaran sementara"
              nilai={p.sisaSementara}
              format={formatRupiah}
              tambahan={p.disetujuiRp > 0 ? `anggaran ${formatRupiah(pagu)} dikurangi yang disetujui` : "berkurang setiap belanja disetujui"}
            />
            <KartuKpi
              urut={3}
              label="Uang yang masih kurang"
              nilai={sisaKurang}
              format={formatRupiah}
              tambahan={
                tambahanAktif > 0
                  ? `${formatRupiah(tertutup)} sudah tertutup dana tambahan`
                  : kekurangan > 0
                    ? `${formatAngka(hasil.tidakTerdanai.length)} belanja belum terbeli`
                    : "anggaran sudah cukup"
              }
              peringatan={sisaKurang > 0}
            />
          </dl>
          <p className="text-xs text-muted">
            Skor kesiapan 0 sampai 100 menunjukkan seberapa lengkap alat pemadam desa dibanding jumlah minimum yang dianjurkan. Makin tinggi, makin siap.
          </p>
        </div>
      </div>

      {/* Baris 2: rincian belanja dari anggaran. */}
      <section aria-labelledby="pakai-pagu" className="masuk mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(4)}>
        <h2 id="pakai-pagu" className="text-lg font-bold">
          Anggarannya dipakai untuk apa?
        </h2>
        <p className="text-sm text-muted">
          Sistem mendahulukan belanja yang paling menaikkan kesiapan untuk setiap rupiah. Desa tetap yang memutuskan di langkah berikutnya.
        </p>
        {hasil.terpilih.length > 0 ? (
          <div className="mt-3">
            <BatangPagu pagu={pagu} terpilih={hasil.terpilih} nama={p.nama} satuan={p.satuan} keputusan={p.keputusan} />
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-3 rounded-card border border-dashed border-line-2 bg-paper px-4 py-4 text-sm">
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-muted"
            >
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
            <p>
              {pagu === 0 ? (
                <>
                  <span className="font-semibold">Isi anggaran di kotak atas dulu.</span> Setelah itu, di sini muncul alat apa saja yang bisa dibeli atau
                  diperbaiki dengan uang tersebut.
                </>
              ) : (
                <span className="font-semibold">{p.kalimat}</span>
              )}
            </p>
          </div>
        )}
      </section>

      {/* Baris 3: yang belum terbeli, lalu simulasi dana tambahan di kartu yang sama. */}
      {hasil.tidakTerdanai.length > 0 ? (
        <section aria-labelledby="kurang" className="masuk mt-4 rounded-panel border border-water/40 bg-surface p-5 shadow-card md:p-6" style={tunda(5)}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="kurang" className="text-lg font-bold">
              Belum terbeli ({hasil.tidakTerdanai.length})
            </h2>
            <p className="tabular text-sm font-semibold">Total {formatRupiah(kekurangan)}</p>
          </div>
          <p className="text-sm text-muted">
            Alat ini tetap dibutuhkan, tetapi anggarannya tidak cukup. Bisa diajukan ke BPBD, Daops Manggala Agni, atau perusahaan sekitar (CSR) di langkah
            Usulan. Ketuk salah satu untuk melihat berapa tambahan uang yang diperlukan.
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
                      <span className="font-semibold">
                        {namaAksi(r.aksi)} {p.nama(r.itemKode).toLowerCase()}
                      </span>{" "}
                      <span className="text-muted">
                        · {formatAngka(r.qty)} {p.satuan(r.itemKode)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {keadaan === "penuh" ? (
                          <span key="penuh" className="muncul font-semibold text-water">
                            Terbeli dengan dana tambahan
                          </span>
                        ) : keadaan === "sebagian" ? (
                          <span key="sebagian" className="muncul font-semibold text-water">
                            Baru sebagian: {formatAngka(dapat)} dari {formatAngka(r.qty)} {p.satuan(r.itemKode)}
                          </span>
                        ) : (
                          <>Perlu tambahan {formatRupiah(target)} agar ini ikut terbeli</>
                        )}
                      </span>
                    </span>
                    <span className="tabular shrink-0 font-semibold">{formatRupiah(r.biayaRp)}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {maksTambahan > 0 ? (
            <div className="mt-5 border-t border-line pt-5">
              <CobaTambahan nilai={tambahanAktif} maks={maksTambahan} kekurangan={kekurangan} onUbah={setTambahan} />
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Baris 4: grafik skor menurut besar dana, dan kelengkapan tiap alat. */}
      <div className="mt-4 flex flex-col gap-4">
        <section aria-labelledby="kurva" className="masuk rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(7)}>
          <h2 id="kurva" className="text-lg font-bold">
            {kekurangan > 0 ? "Kalau anggarannya ditambah, skornya jadi berapa?" : "Skor kesiapan menurut besar anggaran"}
          </h2>
          <p className="text-sm text-muted">
            {kekurangan > 0
              ? `Anggaran sekarang membawa skor ke ${formatSkor(hasil.skorSesudah)}. Kalau kekurangan ${formatRupiah(kekurangan)} bisa ditutup dari bantuan lain, skor bisa sampai ${formatSkor(skorPenuh)}. Klik grafik di sebelah kanan titik anggaran untuk mencoba.`
              : "Anggaran sudah cukup untuk semua alat yang harganya diketahui. Garis yang mendatar berarti tambahan uang tidak menaikkan skor lagi."}
            {hasil.tanpaHarga.length > 0
              ? ` ${hasil.tanpaHarga.map(p.nama).join(", ")} belum punya harga, jadi skor belum bisa sampai 100 sampai harganya diisi.`
              : ""}
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-0.5 w-4 rounded-full" style={{ background: "var(--ember)" }} /> Skor setelah belanja
            </li>
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block w-4 border-t border-dashed border-faint" /> Skor sekarang
            </li>
            {kekurangan > 0 ? (
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="inline-block size-3 rounded-[3px]" style={{ background: "var(--water)", opacity: 0.25 }} /> Uang yang masih
                kurang
              </li>
            ) : null}
          </ul>
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

        <section aria-labelledby="cakupan" className="masuk rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(8)}>
          <h2 id="cakupan" className="text-lg font-bold">
            Seberapa lengkap alatnya?
          </h2>
          <p className="text-sm text-muted">
            Jumlah alat yang siap dipakai dibanding jumlah minimum yang dianjurkan: sekarang, setelah belanja dari anggaran
            {tambahanAktif > 0 ? `, dan kalau ada tambahan ${formatRupiah(tambahanAktif)}` : ""}.
          </p>
          <div className="mt-3">
            <CakupanSesudah baris={cakupan} labelSesudah="Setelah belanja" />
          </div>
        </section>
      </div>

      <BilahAksi
        teks={
          hasil.terpilih.length > 0
            ? `${hasil.terpilih.length} belanja disarankan dari anggaran, total ${formatRupiah(hasil.terpakaiRp)}.`
            : "Belum ada belanja yang bisa disarankan dari anggaran ini."
        }
      >
        <Link href={`/desa/${kode}/prioritas`} className={kelasAksiUtama}>
          Lanjut: putuskan belanja
        </Link>
      </BilahAksi>
    </div>
  );
}

/**
 * Simulasi dana tambahan dari luar anggaran desa. Tiga pilihan cepat dan penggeser (menyeret bukan satu-satunya cara).
 * Hanya hitungan di layar: tidak tersimpan dan tidak mengubah anggaran.
 */
function CobaTambahan({ nilai, maks, kekurangan, onUbah }: { nilai: number; maks: number; kekurangan: number; onUbah: (v: number) => void }) {
  const pilihan = [
    { label: "Tidak ada", nilai: 0 },
    { label: "Separuh", nilai: bulatAtas(kekurangan / 2) },
    { label: "Semua", nilai: maks },
  ];
  const tampil = useAngkaNaik(nilai, 400);
  return (
    <div className="grid gap-x-8 gap-y-3 md:grid-cols-2">
      <div>
        <h3 id="coba-judul" className="font-bold">
          Coba: kalau ada dana tambahan
        </h3>
        <p className="text-sm text-muted">
          Misalnya bantuan dari BPBD, Daops, atau perusahaan. Ini hanya simulasi: tidak tersimpan dan tidak mengubah anggaran desa.
        </p>
        <p className="tabular mt-2 text-2xl font-bold text-water" aria-live="polite">
          + {formatRupiah(Math.round(tampil / 1000) * 1000)}
        </p>
      </div>
      <div role="region" aria-labelledby="coba-judul">
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
          Atau geser sendiri (Rp0 sampai {formatRupiah(maks)})
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
        <p className="text-xs text-muted">Separuh = separuh dari uang yang masih kurang. Semua = cukup untuk membeli semuanya.</p>
      </div>
    </div>
  );
}

/** Kotak angka dasbor; angka berhitung dari nilai lama ke nilai baru. `gelap` untuk angka utama. */
export function KartuKpi({
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
        <span aria-hidden="true" className={`tabular block font-semibold leading-tight tracking-[-0.02em] ${format === formatSkor ? "text-3xl" : "text-2xl"}`}>
          {teks}
        </span>
        <span className="sr-only">{format(nilai)}</span>
        <span className={`mt-1 flex items-center gap-1 text-xs ${gelap ? "text-white/75" : "text-muted"}`}>
          {naik ? (
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
