"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type ReactNode } from "react";
import { useAngkaNaik } from "@/components/paparan/dasbor/dasar";
import { KepalaPrioritas } from "@/components/prioritas/KepalaPrioritas";
import { KartuKpi } from "@/components/prioritas/PaguView";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { ApiError, api } from "@/lib/api-client";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { PAGU_MAKS, keyBaris, namaAksi, parsePagu, totalBiaya } from "@/lib/prioritas";
import { terbilangRupiah } from "@/lib/terbilang";
import { JENIS_META, KANAL, KANAL_META, jenisUsulan, labelKanal, namaDesaSaja, penerimaSurat, type JenisUsulan } from "@/lib/usulan";
import type { Kanal, PriorityRow, Usulan } from "@/lib/types";

const JENIS: JenisUsulan[] = ["alat", "anggaran"];
const tunda = (i: number) => ({ animationDelay: `${120 + i * 80}ms` });

/**
 * Layar Usulan, langkah 3 prioritas (App Flow v2 §3.9). Dua jenis surat:
 * - Pengadaan alat: desa memilih sendiri alat yang sudah disetujui mana yang dimasukkan ke surat (tidak otomatis semua).
 * - Permohonan anggaran: proposal meminta sejumlah dana; bawaan = kekurangan anggaran desa.
 * Usulan tidak bisa diubah setelah terbit; untuk memperbarui, terbitkan yang baru.
 * Tata letak mengikuti layar Pagu: kepala tiga langkah, kartu angka, lalu formulir di kiri dan pratinjau surat di kanan.
 * Riwayat surat ada di kotak bergulir bertinggi tetap, jadi halaman tidak memanjang setiap kali surat bertambah.
 */
export function UsulanView({
  kode,
  namaDesa,
  kabupaten,
  paguRp,
  disetujui,
  item,
  kekuranganRp,
  jumlahBelumTerbeli,
  tahunSekarang,
  riwayat,
  nextCursor,
  ringkasLangkah,
}: {
  kode: string;
  namaDesa: string;
  kabupaten: string;
  paguRp: number;
  disetujui: PriorityRow[];
  item: Record<string, { nama: string; satuan: string }>;
  /** Biaya belanja yang tidak muat di anggaran desa: bawaan jumlah permohonan anggaran. */
  kekuranganRp: number;
  jumlahBelumTerbeli: number;
  tahunSekarang: number;
  riwayat: Usulan[];
  nextCursor: number | null;
  ringkasLangkah: [string, string, string];
}) {
  const router = useRouter();
  const [jenis, setJenis] = useState<JenisUsulan>(disetujui.length > 0 || kekuranganRp === 0 ? "alat" : "anggaran");
  const [kanal, setKanal] = useState<Kanal>("apbdes_perubahan");
  const [dipilih, setDipilih] = useState<Set<string>>(() => new Set());
  const [nomor, setNomor] = useState("");
  const [jumlahTeks, setJumlahTeks] = useState(kekuranganRp > 0 ? formatAngka(kekuranganRp) : "");
  const [tahun, setTahun] = useState(tahunSekarang + 1);
  const [galat, setGalat] = useState("");
  // Transisi, bukan state biasa: "Membuat surat…" berakhir sendiri setelah pindah ke halaman surat,
  // jadi saat kembali ke Usulan tombolnya tidak tertahan di keadaan mengirim.
  const [mengirim, mulai] = useTransition();

  const barisDipilih = disetujui.filter((b) => dipilih.has(keyBaris(b)));
  const totalDipilih = totalBiaya(barisDipilih);
  const totalDisetujui = totalBiaya(disetujui);
  const jumlahRp = parsePagu(jumlahTeks);
  const nama = (k: string) => item[k]?.nama ?? k;
  const satuan = (k: string) => item[k]?.satuan ?? "";
  const penerima = penerimaSurat(kanal, { desa: namaDesa, kabupaten });
  const nilaiSurat = jenis === "alat" ? totalDipilih : jumlahRp;

  const bisaTerbit = jenis === "alat" ? barisDipilih.length > 0 : jumlahRp > 0;
  const teksBilah =
    jenis === "alat"
      ? barisDipilih.length > 0
        ? `${barisDipilih.length} alat dipilih, total ${formatRupiah(totalDipilih)}. Tujuan: ${labelKanal(kanal)}.`
        : disetujui.length > 0
          ? "Pilih alat yang dimasukkan ke surat."
          : "Belum ada belanja yang disetujui."
      : jumlahRp > 0
        ? `Permohonan ${formatRupiah(jumlahRp)}. Tujuan: ${labelKanal(kanal)}.`
        : "Isi jumlah anggaran yang dimohon.";

  const kalimat =
    jenis === "alat"
      ? barisDipilih.length > 0
        ? `${barisDipilih.length} alat senilai ${formatRupiah(totalDipilih)} akan dimohonkan kepada ${penerima}.`
        : disetujui.length > 0
          ? `${disetujui.length} belanja yang disetujui siap dimasukkan ke surat. Pilih yang ingin dimohonkan.`
          : "Belum ada belanja yang disetujui. Permohonan anggaran tetap bisa dibuat."
      : jumlahRp > 0
        ? `Memohon bantuan ${formatRupiah(jumlahRp)} kepada ${penerima} untuk tahun anggaran ${tahun}.`
        : "Isi jumlah anggaran yang ingin dimohon.";

  function ubahPilih(kunci: string) {
    setGalat("");
    setDipilih((lama) => {
      const baru = new Set(lama);
      if (baru.has(kunci)) baru.delete(kunci);
      else baru.add(kunci);
      return baru;
    });
  }

  const semuaDipilih = disetujui.length > 0 && barisDipilih.length === disetujui.length;

  function terbitkan() {
    setGalat("");
    const json =
      jenis === "alat"
        ? { jenis, kanal, nomor, pilih: barisDipilih.map((b) => ({ itemKode: b.itemKode, aksi: b.aksi })) }
        : { jenis, kanal, nomor, jumlahRp, tahun };
    mulai(async () => {
      try {
        const { id } = await api<{ id: number }>(`/api/desa/${kode}/usulan`, { method: "POST", json });
        // Riwayat di Usulan memuat surat baru saat kembali; lalu buka surat yang baru dibuat.
        router.refresh();
        router.push(`/desa/${kode}/usulan/${id}`);
      } catch (e) {
        setGalat(e instanceof ApiError ? e.message : "Terjadi galat. Coba lagi.");
      }
    });
  }

  const terakhir = riwayat[0];

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      <KepalaPrioritas
        kode={kode}
        namaDesa={namaDesa}
        aktif={3}
        ringkas={ringkasLangkah}
        judul="Surat apa yang mau diterbitkan?"
        kalimat={kalimat}
        menghitung={false}
        galat={galat || null}
      />

      {/* Kartu angka: bahan surat yang tersedia dan nilai surat yang sedang disusun. */}
      <dl className="mt-6 grid auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-4">
        <KartuKpi
          urut={0}
          gelap
          label={jenis === "alat" ? "Nilai surat ini" : "Jumlah yang dimohon"}
          nilai={nilaiSurat}
          format={formatRupiah}
          tambahan={
            jenis === "alat"
              ? barisDipilih.length > 0
                ? `${formatAngka(barisDipilih.length)} dari ${formatAngka(disetujui.length)} alat dipilih`
                : "belum ada alat dipilih"
              : jumlahRp > 0
                ? `tahun anggaran ${tahun}`
                : "jumlah belum diisi"
          }
          naik={nilaiSurat > 0}
        />
        <KartuKpi
          urut={1}
          label="Belanja disetujui"
          nilai={totalDisetujui}
          format={formatRupiah}
          tambahan={disetujui.length > 0 ? `${formatAngka(disetujui.length)} belanja siap masuk surat` : "belum ada yang disetujui"}
        />
        <KartuKpi
          urut={2}
          label="Anggaran yang masih kurang"
          nilai={kekuranganRp}
          format={formatRupiah}
          tambahan={kekuranganRp > 0 ? `${formatAngka(jumlahBelumTerbeli)} belanja belum terbeli` : `anggaran ${formatRupiah(paguRp)} sudah cukup`}
          peringatan={kekuranganRp > 0}
        />
        <KartuKpi
          urut={3}
          label="Surat diterbitkan"
          nilai={riwayat.length}
          format={(n) => `${formatAngka(n)}${nextCursor !== null ? "+" : ""}`}
          tambahan={terakhir ? `terakhir ${formatTanggal(terakhir.createdAt)}` : "belum ada surat"}
        />
      </dl>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {/* Kiri: formulir bernomor. */}
        <div className="flex min-w-0 flex-col gap-4">
          <Bagian n={1} judul="Jenis surat" urut={4}>
            <div role="radiogroup" aria-label="Jenis surat" className="grid gap-2 sm:grid-cols-2">
              {JENIS.map((j) => (
                <Pilihan
                  key={j}
                  nama="jenis"
                  aktif={jenis === j}
                  onPilih={() => {
                    setJenis(j);
                    setGalat("");
                  }}
                  ikon={j === "alat" ? <IkonAlat /> : <IkonUang />}
                  judul={JENIS_META[j].label}
                  keterangan={JENIS_META[j].keterangan}
                />
              ))}
            </div>
          </Bagian>

          <Bagian n={2} judul="Ditujukan kepada" urut={5}>
            <div role="radiogroup" aria-label="Ditujukan kepada" className="grid gap-2 sm:grid-cols-2">
              {KANAL.map((k) => (
                <Pilihan
                  key={k}
                  nama="kanal"
                  aktif={kanal === k}
                  onPilih={() => {
                    setKanal(k);
                    setGalat("");
                  }}
                  ikon={<IkonKanal kanal={k} />}
                  judul={KANAL_META[k].label}
                  keterangan={`Kepada Yth. ${penerimaSurat(k, { desa: namaDesa, kabupaten })}`}
                />
              ))}
            </div>
          </Bagian>

          {jenis === "alat" ? (
            <Bagian
              key="alat"
              n={3}
              judul="Alat yang dimasukkan ke surat"
              urut={0}
              aksi={
                disetujui.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setDipilih(semuaDipilih ? new Set() : new Set(disetujui.map(keyBaris)))}
                    className="tekan min-h-11 rounded-full border border-line-2 px-3 text-sm font-semibold hover:border-ink"
                  >
                    {semuaDipilih ? "Kosongkan" : "Pilih semua"}
                  </button>
                ) : null
              }
            >
              {disetujui.length === 0 ? (
                <EmptyState title="Setujui dulu minimal satu belanja." action={{ href: `/desa/${kode}/prioritas`, label: "Ke Keputusan" }}>
                  Surat pengadaan hanya bisa memuat belanja yang sudah disetujui desa. Permohonan anggaran tetap bisa dibuat.
                </EmptyState>
              ) : (
                <>
                  <p className="text-sm text-muted">Dari belanja yang sudah disetujui. Centang yang ingin dimohonkan lewat surat ini.</p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {disetujui.map((b) => {
                      const kunci = keyBaris(b);
                      const on = dipilih.has(kunci);
                      const porsi = totalDisetujui > 0 ? (b.biayaRp / totalDisetujui) * 100 : 0;
                      return (
                        <li key={kunci}>
                          <label
                            className={`tekan relative flex min-h-14 cursor-pointer items-start gap-3 overflow-hidden rounded-card border px-4 py-3 transition-colors duration-300 ${
                              on ? "border-water bg-water-soft" : "border-line bg-surface hover:border-line-2"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => ubahPilih(kunci)}
                              className="mt-1 size-5 shrink-0 accent-[var(--water)]"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-semibold">
                                {namaAksi(b.aksi)} {nama(b.itemKode).toLowerCase()} · {formatAngka(b.qty)} {satuan(b.itemKode)}
                              </span>
                              <span className="block text-sm text-muted">{b.alasan}</span>
                            </span>
                            <span className="tabular shrink-0 text-right font-bold">
                              {formatRupiah(b.biayaRp)}
                              <span className="block text-xs font-normal text-muted">{Math.round(porsi)}% dari total</span>
                            </span>
                            {/* Garis porsi biaya di dasar baris. */}
                            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-line">
                              <span
                                className={`block h-full transition-[width,background-color] duration-500 ${on ? "bg-water" : "bg-line-2"}`}
                                style={{ width: `${porsi}%`, transitionTimingFunction: "var(--pegas)" }}
                              />
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <MeterDipilih dipilih={totalDipilih} total={totalDisetujui} />
                </>
              )}
            </Bagian>
          ) : (
            <Bagian key="anggaran" n={3} judul="Anggaran yang dimohon" urut={0}>
              <p className="text-sm text-muted">
                {kekuranganRp > 0
                  ? `Anggaran desa ${formatRupiah(paguRp)} masih kurang ${formatRupiah(kekuranganRp)} untuk ${formatAngka(jumlahBelumTerbeli)} belanja yang belum terbeli. Angka itu dipakai sebagai bawaan; boleh diubah.`
                  : `Anggaran desa ${formatRupiah(paguRp)} sudah mencukupi belanja yang disarankan. Isi jumlah bila tetap ingin memohon bantuan.`}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <div>
                  <label htmlFor="jumlah" className="text-sm font-semibold">
                    Jumlah
                  </label>
                  <div className="mt-1 flex min-h-12 items-center rounded-card border border-line bg-surface px-3 focus-within:ring-2 focus-within:ring-ink">
                    <span aria-hidden="true" className="pr-1 font-semibold text-muted">
                      Rp
                    </span>
                    <input
                      id="jumlah"
                      inputMode="numeric"
                      value={jumlahTeks}
                      onChange={(e) => {
                        const n = parsePagu(e.target.value);
                        setJumlahTeks(n > 0 ? formatAngka(Math.min(n, PAGU_MAKS)) : "");
                        setGalat("");
                      }}
                      className="tabular w-full bg-transparent py-2 text-lg font-semibold outline-none"
                      aria-describedby="jumlah-terbilang"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tahun" className="text-sm font-semibold">
                    Tahun anggaran
                  </label>
                  <select
                    id="tahun"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    className="mt-1 min-h-12 w-full rounded-card border border-line bg-surface px-3 font-semibold"
                  >
                    {[tahunSekarang, tahunSekarang + 1, tahunSekarang + 2].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p id="jumlah-terbilang" className="mt-1 text-sm italic text-muted">
                {jumlahRp > 0 ? terbilangRupiah(jumlahRp) : "Belum diisi."}
              </p>
              {kekuranganRp > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: "Separuh kekurangan", nilai: Math.ceil(kekuranganRp / 2 / 1000) * 1000 },
                    { label: "Seluruh kekurangan", nilai: kekuranganRp },
                  ].map((x) => (
                    <button
                      key={x.label}
                      type="button"
                      aria-pressed={jumlahRp === x.nilai}
                      onClick={() => setJumlahTeks(formatAngka(x.nilai))}
                      className={`tekan min-h-9 rounded-full border px-3 text-sm font-semibold transition-colors duration-300 ${
                        jumlahRp === x.nilai ? "border-ink bg-ink text-white" : "border-line-2 hover:border-ink"
                      }`}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </Bagian>
          )}

          <Bagian n={4} judul="Nomor surat" urut={1} keterangan="boleh dikosongkan">
            <label htmlFor="nomor" className="text-sm text-muted">
              Bila kosong, surat dicetak dengan titik-titik untuk diisi tangan.
            </label>
            <input
              id="nomor"
              value={nomor}
              maxLength={60}
              onChange={(e) => setNomor(e.target.value)}
              placeholder="mis. 140/12/XI/2026"
              className="mt-2 min-h-12 w-full rounded-card border border-line bg-surface px-3"
            />
          </Bagian>
        </div>

        {/* Kanan: pratinjau surat (menempel di layar lebar) dan riwayat bertinggi tetap. */}
        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4">
          <PratinjauSurat
            jenis={jenis}
            namaDesa={namaDesa}
            kabupaten={kabupaten}
            penerima={penerima}
            nomor={nomor}
            nilai={nilaiSurat}
            tahun={tahun}
            baris={barisDipilih.map((b) => ({ kunci: keyBaris(b), teks: `${namaAksi(b.aksi)} ${nama(b.itemKode).toLowerCase()}`, biaya: b.biayaRp }))}
          />
          <RiwayatSurat kode={kode} awal={riwayat} cursorAwal={nextCursor} />
        </div>
      </div>

      <BilahAksi teks={teksBilah} ragam={bisaTerbit ? "ok" : "normal"}>
        <button
          type="button"
          onClick={terbitkan}
          disabled={mengirim || !bisaTerbit}
          className={`${kelasAksiUtama} tekan ${mengirim || !bisaTerbit ? "opacity-50" : ""}`}
        >
          {mengirim ? "Membuat surat…" : "Buat surat"}
        </button>
      </BilahAksi>
    </div>
  );
}

/** Satu bagian formulir bernomor di dalam panel. */
function Bagian({
  n,
  judul,
  keterangan,
  aksi,
  urut,
  children,
}: {
  n: number;
  judul: string;
  keterangan?: string;
  aksi?: ReactNode;
  urut: number;
  children: ReactNode;
}) {
  const id = `bagian-${n}`;
  return (
    <section aria-labelledby={id} className="masuk rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(urut)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id={id} className="flex items-center gap-3 text-lg font-bold">
          <span aria-hidden="true" className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            {n}
          </span>
          <span>
            {judul}
            {keterangan ? <span className="ml-2 text-sm font-normal text-muted">({keterangan})</span> : null}
          </span>
        </h2>
        {aksi}
      </div>
      {children}
    </section>
  );
}

/** Kartu pilihan (radio) dengan ikon; yang terpilih bergaris tinta dan ikonnya terisi. */
function Pilihan({
  nama,
  aktif,
  onPilih,
  ikon,
  judul,
  keterangan,
}: {
  nama: string;
  aktif: boolean;
  onPilih: () => void;
  ikon: ReactNode;
  judul: string;
  keterangan: string;
}) {
  return (
    <label
      className={`tekan flex min-h-14 cursor-pointer items-start gap-3 rounded-card border px-4 py-3 transition-[border-color,box-shadow,background-color] duration-300 ${
        aktif ? "border-ink bg-surface shadow-card ring-1 ring-ink" : "border-line bg-surface-2 hover:border-line-2"
      }`}
    >
      <input type="radio" name={nama} checked={aktif} onChange={onPilih} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${aktif ? "bg-ink text-white" : "bg-paper text-muted"}`}
      >
        {ikon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{judul}</span>
        <span className="block text-sm text-muted">{keterangan}</span>
      </span>
      <span
        aria-hidden="true"
        className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${aktif ? "border-ink bg-ink" : "border-line-2"}`}
      >
        {aktif ? <span className="muncul size-2 rounded-full bg-white" /> : null}
      </span>
    </label>
  );
}

/** Meter total yang dipilih dibanding semua belanja yang disetujui. */
function MeterDipilih({ dipilih, total }: { dipilih: number; total: number }) {
  const tampil = useAngkaNaik(dipilih, 400);
  const persen = total > 0 ? (dipilih / total) * 100 : 0;
  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted">Dipilih untuk surat</span>
        <span className="tabular">
          <span className="font-bold">{formatRupiah(Math.round(tampil))}</span> dari {formatRupiah(total)}
        </span>
      </div>
      <div aria-hidden="true" className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-paper">
        <div className="arsir-air h-full rounded-full transition-[width] duration-500" style={{ width: `${persen}%`, transitionTimingFunction: "var(--pegas)" }} />
      </div>
    </div>
  );
}

/**
 * Pratinjau surat ringkas: kop, penerima, perihal, dan isi pokok. Berubah seketika saat pilihan berganti
 * (kunci ulang memutar animasi muncul). Isi lengkap surat dibuat server saat diterbitkan.
 */
function PratinjauSurat({
  jenis,
  namaDesa,
  kabupaten,
  penerima,
  nomor,
  nilai,
  tahun,
  baris,
}: {
  jenis: JenisUsulan;
  namaDesa: string;
  kabupaten: string;
  penerima: string;
  nomor: string;
  nilai: number;
  tahun: number;
  baris: { kunci: string; teks: string; biaya: number }[];
}) {
  const tampil = useAngkaNaik(nilai, 500);
  const desa = namaDesaSaja(namaDesa);
  const tampak = baris.slice(0, 4);
  return (
    <section aria-labelledby="pratinjau" className="masuk rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(2)}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="pratinjau" className="text-lg font-bold">
          Pratinjau surat
        </h2>
        <span className="text-xs text-muted">berubah mengikuti pilihan</span>
      </div>
      <div className="relative mt-3 rounded-card border border-line-2 bg-[#fffdf8] px-5 py-4 font-serif text-[13px] leading-relaxed shadow-float">
        <div className="border-b-2 border-double border-ink pb-2 text-center">
          <p className="text-[11px] uppercase tracking-wide text-muted">Pemerintah Kabupaten {kabupaten}</p>
          <p className="font-bold uppercase">Pemerintah Desa {desa}</p>
        </div>
        <p className="mt-2 text-[12px] text-muted">
          Nomor: <span className="tabular">{nomor.trim() || "........./........./...../....."}</span>
        </p>
        <p key={`perihal-${jenis}`} className="muncul text-[12px]">
          Perihal: <span className="font-semibold">{JENIS_META[jenis].perihal}</span>
        </p>
        <p key={`kepada-${penerima}`} className="muncul mt-2">
          Kepada Yth.
          <br />
          <span className="font-semibold">{penerima}</span>
        </p>
        <div className="mt-3 rounded-[6px] bg-paper/70 px-3 py-2">
          {jenis === "alat" ? (
            baris.length > 0 ? (
              <ul className="space-y-0.5">
                {tampak.map((b) => (
                  <li key={b.kunci} className="muncul flex justify-between gap-3">
                    <span className="truncate">{b.teks}</span>
                    <span className="tabular shrink-0">{formatRupiah(b.biaya)}</span>
                  </li>
                ))}
                {baris.length > tampak.length ? <li className="text-muted">dan {baris.length - tampak.length} alat lainnya</li> : null}
              </ul>
            ) : (
              <p className="italic text-muted">Daftar alat muncul di sini setelah dipilih.</p>
            )
          ) : (
            <p>
              Desa memohon bantuan anggaran kesiapan karhutla untuk tahun anggaran <span className="tabular">{tahun}</span>.
            </p>
          )}
          <p className="mt-2 flex justify-between gap-3 border-t border-line pt-2 font-bold">
            <span>Jumlah</span>
            <span className="tabular" aria-live="polite">
              {formatRupiah(Math.round(tampil))}
            </span>
          </p>
        </div>
        <div className="mt-4 ml-auto w-36 text-center text-[12px]">
          <p>Kepala Desa {desa}</p>
          <p className="mt-6 border-t border-dotted border-ink pt-1 text-muted">tanda tangan &amp; cap</p>
        </div>
      </div>
    </section>
  );
}

type Saring = "semua" | JenisUsulan;

/**
 * Riwayat surat dalam kotak bergulir bertinggi tetap: menambah surat atau memuat surat lama
 * tidak memanjangkan halaman. Bisa disaring menurut jenis surat.
 */
function RiwayatSurat({ kode, awal, cursorAwal }: { kode: string; awal: Usulan[]; cursorAwal: number | null }) {
  const [daftar, setDaftar] = useState(awal);
  const [cursor, setCursor] = useState(cursorAwal);
  // Daftar dari server berganti (mis. surat baru setelah kembali dari halaman surat): mulai lagi dari halaman pertama.
  const [awalTerakhir, setAwalTerakhir] = useState(awal);
  if (awal !== awalTerakhir) {
    setAwalTerakhir(awal);
    setDaftar(awal);
    setCursor(cursorAwal);
  }
  const [memuat, setMemuat] = useState(false);
  const [galat, setGalat] = useState("");
  const [saring, setSaring] = useState<Saring>("semua");

  const tampil = saring === "semua" ? daftar : daftar.filter((u) => jenisUsulan(u.facts) === saring);
  const hitung = (s: Saring) => (s === "semua" ? daftar.length : daftar.filter((u) => jenisUsulan(u.facts) === s).length);

  async function muatLagi() {
    if (cursor === null) return;
    setGalat("");
    setMemuat(true);
    try {
      const r = await api<{ hasil: Usulan[]; meta: { nextCursor: number | null } }>(`/api/desa/${kode}/usulan?limit=20&cursor=${cursor}`);
      setDaftar((lama) => [...lama, ...r.hasil]);
      setCursor(r.meta.nextCursor);
    } catch (e) {
      setGalat(e instanceof ApiError ? e.message : "Gagal memuat surat lama. Coba lagi.");
    } finally {
      setMemuat(false);
    }
  }

  const PILIHAN: { nilai: Saring; label: string }[] = [
    { nilai: "semua", label: "Semua" },
    { nilai: "alat", label: "Alat" },
    { nilai: "anggaran", label: "Anggaran" },
  ];

  return (
    <section aria-labelledby="riwayat" className="masuk rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={tunda(3)}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="riwayat" className="text-lg font-bold">
          Surat yang pernah dibuat
        </h2>
        <span className="tabular text-sm text-muted">
          {formatAngka(daftar.length)}
          {cursor !== null ? "+" : ""}
        </span>
      </div>

      {daftar.length === 0 ? (
        <div className="mt-3 flex items-center gap-3 rounded-card border border-dashed border-line-2 bg-paper px-4 py-4 text-sm">
          <IkonSurat className="shrink-0 text-muted" />
          <p>Belum ada. Surat pertama akan muncul di sini setelah dibuat.</p>
        </div>
      ) : (
        <>
          <div role="group" aria-label="Saring menurut jenis surat" className="mt-3 grid grid-cols-3 rounded-full border border-line bg-surface-2 p-1">
            {PILIHAN.map((x) => {
              const on = saring === x.nilai;
              return (
                <button
                  key={x.nilai}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSaring(x.nilai)}
                  className={`tekan min-h-9 rounded-full px-2 text-sm font-semibold transition-colors duration-300 ${on ? "bg-ink text-white shadow-card" : "text-muted hover:text-ink"}`}
                >
                  {x.label} <span className={`tabular text-xs ${on ? "text-white/70" : "text-faint"}`}>{hitung(x.nilai)}</span>
                </button>
              );
            })}
          </div>

          {/* Tinggi tetap: daftar bergulir di dalam kotak, bukan memanjangkan halaman. */}
          <div
            tabIndex={0}
            aria-label="Daftar surat, gulir untuk melihat lainnya"
            className="mt-3 max-h-[19rem] overflow-y-auto overscroll-contain rounded-card border border-line [scrollbar-width:thin]"
          >
            {tampil.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted">Belum ada surat jenis ini{cursor !== null ? " di daftar yang sudah dimuat" : ""}.</p>
            ) : (
              <ul className="divide-y divide-line">
                {tampil.map((u, i) => {
                  const j = jenisUsulan(u.facts);
                  return (
                    <li key={u.id} className="muncul" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                      <Link
                        href={`/desa/${kode}/usulan/${u.id}`}
                        className="group flex min-h-14 items-center gap-3 px-3 py-2.5 transition-colors duration-200 hover:bg-paper"
                      >
                        <span
                          aria-hidden="true"
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full ${j === "alat" ? "bg-water-soft text-water" : "bg-ok-soft text-ok"}`}
                        >
                          {j === "alat" ? <IkonAlat /> : <IkonUang />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{labelKanal(u.kanal)}</span>
                          <span className="block truncate text-xs text-muted">
                            {JENIS_META[j].label} · {formatTanggal(u.createdAt)}
                            {u.facts.nomor ? ` · No. ${u.facts.nomor}` : ""}
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-sm font-bold">{u.facts.total_usulan}</span>
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {cursor !== null ? (
              <div className="border-t border-line p-2">
                <button type="button" onClick={muatLagi} disabled={memuat} className="btn btn-kedua w-full text-sm">
                  {memuat ? "Memuat…" : "Muat surat lama"}
                </button>
              </div>
            ) : null}
          </div>
          {galat ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-danger">
              {galat}
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

// ---------- Ikon (garis 24 px, mengikuti warna teks) ----------

function Ikon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

const IkonAlat = () => (
  <Ikon>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
  </Ikon>
);

const IkonUang = () => (
  <Ikon>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 10v4M18 10v4" />
  </Ikon>
);

const IkonSurat = ({ className = "" }: { className?: string }) => (
  <Ikon className={className}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M8 13h8M8 17h5" />
  </Ikon>
);

function IkonKanal({ kanal }: { kanal: Kanal }) {
  switch (kanal) {
    case "apbdes_perubahan":
      return (
        <Ikon>
          <path d="M3 10l9-6 9 6M5 10v9h14v-9M9 19v-5h6v5" />
        </Ikon>
      );
    case "bpbd":
      return (
        <Ikon>
          <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
          <path d="M12 9v6M9 12h6" />
        </Ikon>
      );
    case "daops":
      return (
        <Ikon>
          <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.6 1.2 2.5 2 3 0-3 .5-6 1-8.5z" />
        </Ikon>
      );
    case "csr":
      return (
        <Ikon>
          <path d="M4 21V8l5 3V8l5 3V4h6v17zM8 17h2M14 17h2" />
        </Ikon>
      );
  }
}
