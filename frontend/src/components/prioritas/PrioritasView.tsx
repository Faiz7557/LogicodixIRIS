"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { ApiError, api } from "@/lib/api-client";
import { rankPriorities } from "@/lib/engine/priority";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import {
  PAGU_SLIDER_MAKS,
  barisDisetujui,
  kalimatPrioritas,
  keadaanPagu,
  keyBaris,
  ringkasKeputusan,
  totalBiaya,
  type KeputusanMap,
} from "@/lib/prioritas";
import type { Aksi, CatalogItem, HargaRow, Keputusan, KeputusanRow, PaketRow, PrioritasPayload, ReadinessResult } from "@/lib/types";
import { BatangPagu, CakupanSesudah, KurvaSkorPagu, RingkasKeputusan, type BarisCakupan } from "./GrafikPrioritas";
import { AksiLabel, PriorityRow } from "./PriorityRow";
import { PaguControl } from "./PaguControl";
import { PanelPaketHarga, type Edit } from "./PanelPaketHarga";

/** Jeda tulis pagu (Design Brief: PaguControl) dan jeda catatan agar satu ketukan tidak jadi satu permintaan. */
const JEDA_PAGU = 300;
const JEDA_CATATAN = 400;

function pesanGalat(e: unknown): string {
  return e instanceof ApiError ? e.pesan : "Terjadi galat. Coba lagi.";
}

function petaKeputusan(rows: KeputusanRow[]): Map<string, KeputusanRow> {
  return new Map(rows.map((r) => [keyBaris(r), r]));
}

/** Catatan yang masih menunggu jeda tulis; disimpan lengkap agar bisa dikirim saat layar ditinggalkan. */
type CatatanTertunda = {
  timer: ReturnType<typeof setTimeout>;
  itemKode: string;
  aksi: Aksi;
  keputusan: Keputusan;
  catatan: string;
};

/**
 * Layar Prioritas (App Flow v2 §3.8). Momen utama: skor sekarang menuju skor sesudah saat pagu berubah.
 * Urutan dan skor datang dari server; layar ini menyimpan pagu, keputusan, target, dan harga lewat API.
 */
export function PrioritasView({
  kode,
  namaDesa,
  catalog,
  awal,
  kesiapan,
  paket: paketAwal,
  harga: hargaAwal,
}: {
  kode: string;
  namaDesa: string;
  catalog: CatalogItem[];
  awal: PrioritasPayload;
  kesiapan: ReadinessResult;
  paket: PaketRow[];
  harga: HargaRow[];
}) {
  const [hasil, setHasil] = useState<PrioritasPayload>(awal);
  const [readiness, setReadiness] = useState<ReadinessResult>(kesiapan);
  const skorSekarang = readiness.skor;
  const [paket, setPaket] = useState<PaketRow[]>(paketAwal);
  const [harga, setHarga] = useState<HargaRow[]>(hargaAwal);
  const [pagu, setPagu] = useState(awal.paguRp);
  const [hitung, setHitung] = useState(0);
  const [galat, setGalat] = useState<string | null>(null);
  const [edit, setEdit] = useState<Edit>(null);
  const [panelBuka, setPanelBuka] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Pagu dan keputusan yang sudah tersimpan di server: dasar pembalikan saat API menolak.
  const paguServer = useRef(awal.paguRp);
  const terkonfirmasi = useRef(petaKeputusan(awal.keputusan));
  const nomorPagu = useRef(0);
  const penundaCatatan = useRef(new Map<string, CatatanTertunda>());

  const terapkan = useCallback((p: PrioritasPayload) => {
    setHasil(p);
    paguServer.current = p.paguRp;
    terkonfirmasi.current = petaKeputusan(p.keputusan);
  }, []);

  // Pagu tampil seketika; tulis dan hitung ulang di server menunggu jeda 300 ms.
  useEffect(() => {
    if (pagu === paguServer.current) return;
    const urutan = ++nomorPagu.current;
    const t = setTimeout(() => {
      void (async () => {
        setHitung((n) => n + 1);
        setGalat(null);
        try {
          await api(`/api/desa/${kode}/rencana`, { method: "PUT", json: { paguRp: pagu } });
          const p = await api<PrioritasPayload>(`/api/desa/${kode}/prioritas`);
          if (urutan !== nomorPagu.current) return;
          terapkan(p);
          if (p.paguRp !== pagu) setPagu(p.paguRp);
        } catch (e) {
          if (urutan !== nomorPagu.current) return;
          setGalat(pesanGalat(e));
          setPagu(paguServer.current);
        } finally {
          setHitung((n) => n - 1);
        }
      })();
    }, JEDA_PAGU);
    return () => clearTimeout(t);
  }, [kode, pagu, terapkan]);

  const keputusan = useMemo<KeputusanMap>(
    () => Object.fromEntries(hasil.keputusan.map((r) => [keyBaris(r), { keputusan: r.keputusan, catatan: r.catatan ?? undefined }])),
    [hasil],
  );
  const menghitung = hitung > 0;

  const nama = (k: string) => catalog.find((c) => c.kode === k)?.nama ?? k;
  const satuan = (k: string) => catalog.find((c) => c.kode === k)?.satuan ?? "";
  const sumberHarga = (k: string, aksi: Aksi) => harga.find((h) => h.itemKode === k && h.aksi === aksi)?.sumber;

  const keadaan = keadaanPagu(pagu, hasil, harga);
  const kalimat = kalimatPrioritas(pagu, skorSekarang, hasil, harga, catalog);
  const ringkas = ringkasKeputusan(hasil.terpilih, keputusan);
  const disetujui = barisDisetujui(hasil.terpilih, keputusan);
  const sisa = Math.max(0, pagu - hasil.terpakaiRp);
  const selisih = Math.round((hasil.skorSesudah - skorSekarang) * 10) / 10;

  // Kurva skor terhadap pagu: mesin urutan yang sama (fungsi murni) dihitung di sekitar 60 titik,
  // sampai sedikit di atas biaya semua kebutuhan. Katalog dibatasi ke item paket, sama seperti di server.
  const titikKurva = useMemo(() => {
    const boleh = new Set(paket.map((p) => p.itemKode));
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
      nama: nama(i.itemKode),
      satuan: satuan(i.itemKode),
      target: i.target,
      sebelum: i.berfungsi,
      sesudah: i.berfungsi + hasil.terpilih.filter((b) => b.itemKode === i.itemKode).reduce((a, b) => a + b.qty, 0),
    }));

  /** Tulis putusan lokal lebih dulu supaya tombol terasa langsung menanggapi. */
  const ubahLokal = useCallback((itemKode: string, aksi: Aksi, ubah: { keputusan?: Keputusan; catatan: string | null }) => {
    const kunci = keyBaris({ itemKode, aksi });
    setHasil((h) => {
      const gabung = (r?: KeputusanRow): KeputusanRow => ({
        itemKode,
        aksi,
        keputusan: ubah.keputusan ?? r?.keputusan ?? "tunda",
        catatan: ubah.catatan,
      });
      return h.keputusan.some((r) => keyBaris(r) === kunci)
        ? { ...h, keputusan: h.keputusan.map((r) => (keyBaris(r) === kunci ? gabung(r) : r)) }
        : { ...h, keputusan: [...h.keputusan, gabung()] };
    });
  }, []);

  /** Kembalikan satu baris ke nilai server terakhir. */
  const pulihkan = useCallback((itemKode: string, aksi: Aksi) => {
    const kunci = keyBaris({ itemKode, aksi });
    const asli = terkonfirmasi.current.get(kunci);
    setHasil((h) => ({
      ...h,
      keputusan: asli
        ? h.keputusan.some((r) => keyBaris(r) === kunci)
          ? h.keputusan.map((r) => (keyBaris(r) === kunci ? asli : r))
          : [...h.keputusan, asli]
        : h.keputusan.filter((r) => keyBaris(r) !== kunci),
    }));
  }, []);

  const kirimKeputusan = useCallback(
    async (itemKode: string, aksi: Aksi, keputusanBaru: Keputusan, catatan?: string) => {
      ubahLokal(itemKode, aksi, { keputusan: keputusanBaru, catatan: catatan ?? null });
      setHitung((n) => n + 1);
      setGalat(null);
      try {
        await api(`/api/desa/${kode}/keputusan`, {
          method: "PUT",
          json: { itemKode, aksi, keputusan: keputusanBaru, ...(catatan ? { catatan } : {}) },
        });
        terkonfirmasi.current.set(keyBaris({ itemKode, aksi }), { itemKode, aksi, keputusan: keputusanBaru, catatan: catatan ?? null });
      } catch (e) {
        pulihkan(itemKode, aksi);
        setGalat(pesanGalat(e));
      } finally {
        setHitung((n) => n - 1);
      }
    },
    [kode, pulihkan, ubahLokal],
  );

  const batalkanCatatan = useCallback((kunci: string) => {
    const tertunda = penundaCatatan.current.get(kunci);
    if (tertunda) {
      clearTimeout(tertunda.timer);
      penundaCatatan.current.delete(kunci);
    }
  }, []);

  // Catatan yang belum sempat terkirim tetap dikirim saat layar ditinggalkan.
  useEffect(() => {
    const penunda = penundaCatatan.current;
    return () => {
      for (const t of penunda.values()) {
        clearTimeout(t.timer);
        void kirimKeputusan(t.itemKode, t.aksi, t.keputusan, t.catatan);
      }
      penunda.clear();
    };
  }, [kirimKeputusan]);

  function pilihKeputusan(itemKode: string, aksi: Aksi, baru: Keputusan, catatanLama?: string) {
    batalkanCatatan(keyBaris({ itemKode, aksi }));
    void kirimKeputusan(itemKode, aksi, baru, catatanLama);
  }

  function ubahCatatan(itemKode: string, aksi: Aksi, keputusanBaru: Keputusan, teks: string) {
    ubahLokal(itemKode, aksi, { catatan: teks });
    const kunci = keyBaris({ itemKode, aksi });
    batalkanCatatan(kunci);
    const timer = setTimeout(() => {
      penundaCatatan.current.delete(kunci);
      void kirimKeputusan(itemKode, aksi, keputusanBaru, teks);
    }, JEDA_CATATAN);
    penundaCatatan.current.set(kunci, { timer, itemKode, aksi, keputusan: keputusanBaru, catatan: teks });
  }

  /** Setelah target atau harga berubah, urutan bisa berubah: ambil ulang paket, harga, dan prioritas. */
  const segarkan = useCallback(async () => {
    const [p, h, pr, k] = await Promise.all([
      api<{ hasil: PaketRow[] }>(`/api/desa/${kode}/paket`),
      api<{ hasil: HargaRow[] }>(`/api/desa/${kode}/harga`),
      api<PrioritasPayload>(`/api/desa/${kode}/prioritas`),
      api<ReadinessResult>(`/api/desa/${kode}/kesiapan`),
    ]);
    setPaket(p.hasil);
    setHarga(h.hasil);
    setReadiness(k);
    terapkan(pr);
  }, [kode, terapkan]);

  async function simpanTarget(itemKode: string, target: number, alasan: string) {
    setHitung((n) => n + 1);
    setGalat(null);
    try {
      await api(`/api/desa/${kode}/paket`, { method: "PUT", json: { itemKode, target, alasan } });
      await segarkan();
      setEdit(null);
    } catch (e) {
      setGalat(pesanGalat(e));
    } finally {
      setHitung((n) => n - 1);
    }
  }

  async function simpanHarga(itemKode: string, aksi: Aksi, hargaRp: number, sumber: string) {
    setHitung((n) => n + 1);
    setGalat(null);
    try {
      await api(`/api/desa/${kode}/harga`, { method: "PUT", json: { itemKode, aksi, hargaRp, sumber } });
      await segarkan();
      setEdit(null);
    } catch (e) {
      setGalat(pesanGalat(e));
    } finally {
      setHitung((n) => n - 1);
    }
  }

  function bukaIsiHarga(itemKode: string) {
    setEdit({ jenis: "harga", itemKode, aksi: "beli" });
    setPanelBuka(true);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-8">
      <header>
        <p className="text-sm font-semibold text-ember">Prioritas belanja · {namaDesa}</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Apa yang perlu dibeli dulu?</h1>
        <p aria-live="polite" className="mt-3 max-w-[70ch] text-lg font-semibold leading-snug">
          {kalimat}
        </p>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm font-semibold text-muted">
          {menghitung ? "Menghitung…" : ""}
        </p>
      </header>

      {galat ? (
        <p role="alert" className="mt-3 rounded-card border border-danger/40 bg-surface px-4 py-3 text-sm font-semibold text-danger">
          {galat}
        </p>
      ) : null}

      {/* Baris atas: pagu di kiri, angka utama dan pemakaian pagu di kanan. */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <PaguControl pagu={pagu} onChange={setPagu} />

        <div aria-busy={menghitung} className={`flex flex-col gap-4 transition-opacity duration-300 ${menghitung ? "opacity-60" : ""}`}>
          <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KartuKpi
              gelap
              label="Skor kesiapan"
              nilai={formatSkor(hasil.skorSesudah)}
              tambahan={
                selisih > 0 ? `dari ${formatSkor(skorSekarang)}, naik ${formatSkor(selisih)} poin` : `sama dengan sekarang (${formatSkor(skorSekarang)})`
              }
              naik={selisih > 0}
            />
            <KartuKpi
              label="Terpakai"
              nilai={formatRupiah(hasil.terpakaiRp)}
              tambahan={`${pagu > 0 ? Math.round((hasil.terpakaiRp / pagu) * 100) : 0}% dari pagu`}
            />
            <KartuKpi label="Sisa pagu" nilai={formatRupiah(sisa)} tambahan={sisa > 0 ? "belum terpakai" : "pagu habis terpakai"} />
            <KartuKpi
              label="Belanja terpilih"
              nilai={formatAngka(hasil.terpilih.length)}
              tambahan={`${ringkas.setuju} disetujui · ${hasil.tidakTerdanai.length} belum terdanai`}
            />
          </dl>
          <section aria-labelledby="pakai-pagu" className="rounded-panel border border-line bg-surface p-5 shadow-card">
            <h2 id="pakai-pagu" className="font-bold">
              Ke mana pagu dipakai?
            </h2>
            <div className="mt-2">
              <BatangPagu pagu={pagu} terpilih={hasil.terpilih} nama={nama} />
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
            ? ` ${hasil.tanpaHarga.map(nama).join(", ")} belum punya harga, jadi kurva berhenti di bawah 100 sampai harganya diisi.`
            : ""}
        </p>
        <div className="mt-3">
          <KurvaSkorPagu titik={titikKurva} pagu={pagu} skorSekarang={skorSekarang} onPilih={setPagu} />
        </div>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="cakupan" className="rounded-panel border border-line bg-surface p-5 shadow-card md:p-6">
          <h2 id="cakupan" className="text-lg font-bold">
            Cakupan paket minimum, sekarang dan sesudah belanja
          </h2>
          <p className="text-sm text-muted">Berapa persen paket minimum yang terpenuhi bila belanja terpilih dilaksanakan.</p>
          <div className="mt-3">
            <CakupanSesudah baris={cakupan} />
          </div>
        </section>
        <section aria-labelledby="keputusan" className="rounded-panel border border-line bg-surface p-5 shadow-card md:p-6">
          <h2 id="keputusan" className="text-lg font-bold">
            Keputusan desa
          </h2>
          <p className="text-sm text-muted">Dari {hasil.terpilih.length} belanja terpilih.</p>
          <div className="mt-3">
            <RingkasKeputusan jumlah={{ setuju: ringkas.setuju, tunda: ringkas.tunda, tolak: ringkas.tolak, belum: ringkas.belum }} />
          </div>
        </section>
      </div>

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
                  keputusan={keputusan[keyBaris(b)]?.keputusan}
                  catatan={keputusan[keyBaris(b)]?.catatan}
                  onKeputusan={(k) => pilihKeputusan(b.itemKode, b.aksi, k, keputusan[keyBaris(b)]?.catatan)}
                  onCatatan={(c) => ubahCatatan(b.itemKode, b.aksi, keputusan[keyBaris(b)]?.keputusan ?? "tunda", c)}
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
          paket={paket}
          harga={harga}
          edit={edit}
          setEdit={setEdit}
          buka={panelBuka}
          setBuka={setPanelBuka}
          onSimpanTarget={simpanTarget}
          onSimpanHarga={simpanHarga}
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
