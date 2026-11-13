"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, api } from "@/lib/api-client";
import { formatRupiah, formatSkor } from "@/lib/format";
import {
  anggaranSementara,
  barisDisetujui,
  kalimatPrioritas,
  keadaanPagu,
  keyBaris,
  ringkasKeputusan,
  skorSetelahDisetujui,
  totalBiaya,
  type KeputusanMap,
} from "@/lib/prioritas";
import type { Aksi, CatalogItem, HargaRow, Keputusan, KeputusanRow, PaketRow, PrioritasPayload, ReadinessResult } from "@/lib/types";

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

export type DataPrioritas = {
  kode: string;
  namaDesa: string;
  catalog: CatalogItem[];
  awal: PrioritasPayload;
  kesiapan: ReadinessResult;
  paket: PaketRow[];
  harga: HargaRow[];
};

/**
 * Keadaan bersama dua layar Prioritas (Pagu dan Keputusan). Urutan dan skor datang dari server;
 * hook ini menyimpan pagu, keputusan, target, dan harga lewat API dengan pembaruan optimistis.
 */
export function usePrioritas({ kode, catalog, awal, kesiapan, paket: paketAwal, harga: hargaAwal }: DataPrioritas) {
  const [hasil, setHasil] = useState<PrioritasPayload>(awal);
  const [readiness, setReadiness] = useState<ReadinessResult>(kesiapan);
  const [paket, setPaket] = useState<PaketRow[]>(paketAwal);
  const [harga, setHarga] = useState<HargaRow[]>(hargaAwal);
  const [pagu, setPagu] = useState(awal.paguRp);
  const [hitung, setHitung] = useState(0);
  const [galat, setGalat] = useState<string | null>(null);

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

  const nama = (k: string) => catalog.find((c) => c.kode === k)?.nama ?? k;
  const satuan = (k: string) => catalog.find((c) => c.kode === k)?.satuan ?? "";
  const sumberHarga = (k: string, aksi: Aksi) => harga.find((h) => h.itemKode === k && h.aksi === aksi)?.sumber;

  const skorSekarang = readiness.skor;

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

  /** Simpan lalu segarkan; `true` bila berhasil. */
  async function simpanLalu(tulis: () => Promise<unknown>): Promise<boolean> {
    setHitung((n) => n + 1);
    setGalat(null);
    try {
      await tulis();
      await segarkan();
      return true;
    } catch (e) {
      setGalat(pesanGalat(e));
      return false;
    } finally {
      setHitung((n) => n - 1);
    }
  }

  const simpanTarget = (itemKode: string, target: number, alasan: string) =>
    simpanLalu(() => api(`/api/desa/${kode}/paket`, { method: "PUT", json: { itemKode, target, alasan } }));

  const simpanHarga = (itemKode: string, aksi: Aksi, hargaRp: number, sumber: string) =>
    simpanLalu(() => api(`/api/desa/${kode}/harga`, { method: "PUT", json: { itemKode, aksi, hargaRp, sumber } }));

  const ringkas = ringkasKeputusan(hasil.terpilih, keputusan);
  const disetujui = barisDisetujui(hasil.terpilih, keputusan);
  const sementara = anggaranSementara(pagu, disetujui);
  // Satu kalimat keadaan untuk penunjuk tiga langkah.
  const ringkasLangkah: [string, string, string] = [
    disetujui.length > 0
      ? `Anggaran ${formatRupiah(pagu)}, sisa sementara ${formatRupiah(sementara.sisaRp)}`
      : `Anggaran ${formatRupiah(pagu)}, skor ${formatSkor(skorSekarang)} → ${formatSkor(hasil.skorSesudah)}`,
    hasil.terpilih.length > 0 ? `${hasil.terpilih.length} saran, ${ringkas.belum} belum diputuskan` : "Belum ada saran untuk anggaran ini",
    disetujui.length > 0 ? `${disetujui.length} disetujui, ${formatRupiah(totalBiaya(disetujui))}` : "Setujui minimal satu saran",
  ];

  return {
    hasil,
    ringkasLangkah,
    readiness,
    paket,
    harga,
    pagu,
    setPagu,
    galat,
    menghitung: hitung > 0,
    keputusan,
    skorSekarang,
    selisih: Math.round((hasil.skorSesudah - skorSekarang) * 10) / 10,
    sisa: Math.max(0, pagu - hasil.terpakaiRp),
    keadaan: keadaanPagu(pagu, hasil, harga),
    kalimat: kalimatPrioritas(pagu, skorSekarang, hasil, harga, catalog),
    ringkas,
    disetujui,
    /** Total belanja yang disetujui; mengurangi anggaran sementara. */
    disetujuiRp: sementara.disetujuiRp,
    /** Anggaran dikurangi belanja yang disetujui. */
    sisaSementara: sementara.sisaRp,
    /** Skor bila hanya yang disetujui dibeli atau diperbaiki. */
    skorDisetujui: skorSetelahDisetujui(readiness, catalog, disetujui),
    nama,
    satuan,
    sumberHarga,
    pilihKeputusan,
    ubahCatatan,
    simpanTarget,
    simpanHarga,
  };
}
