/*
 * Penghubung tiruan: menggabungkan data contoh + isian desa (harga, paket) lalu memanggil mesin tiruan.
 * Menggantikan GET /api/desa/[kode]/prioritas dan PUT rencana. Hapus bersama `src/mocks/`.
 */
import type { HargaRow, PaketRow, PriorityResult, ReadinessItem } from "@/lib/types";
import { mockCatalog, mockHarga, mockPaket, mockReadiness } from "./demo";
import { cariUji, kesiapanUji, paketUji } from "./desaUji";
import { rankPriorities, skorDari } from "./engine";
import type { Simpanan } from "./store";

export interface KonteksContoh {
  items: ReadinessItem[];
  paket: PaketRow[];
  harga: HargaRow[];
  skorSekarang: number;
}

/** `kode` memilih desa uji; tanpa itu (atau kode lain) memakai Contoh Desa. */
export function bangunKonteks(s: Pick<Simpanan, "harga" | "paket">, kode?: string): KonteksContoh {
  const uji = kode ? cariUji(kode) : undefined;
  const dasar = uji ? kesiapanUji(uji) : mockReadiness;
  const paket: PaketRow[] = (uji ? paketUji(uji) : mockPaket).map((p) => {
    const ubah = s.paket.find((x) => x.itemKode === p.itemKode);
    return ubah ? { ...p, target: ubah.target, sumber: `Diubah desa: ${ubah.alasan}`, label: "bersumber" } : p;
  });
  const target = new Map(paket.map((p) => [p.itemKode, p.target]));
  const items = dasar.items.map((i) => {
    const t = target.get(i.itemKode) ?? i.target;
    return { ...i, target: t, coverage: t > 0 ? Math.min(i.berfungsi / t, 1) : 1 };
  });

  const harga: HargaRow[] = [...mockHarga];
  for (const h of s.harga) {
    const idx = harga.findIndex((x) => x.itemKode === h.itemKode && x.aksi === h.aksi);
    const baru: HargaRow = { itemKode: h.itemKode, aksi: h.aksi, hargaRp: h.hargaRp, sumber: `Diisi desa: ${h.sumber}` };
    if (idx >= 0) harga[idx] = baru;
    else harga.push(baru);
  }
  return { items, paket, harga, skorSekarang: skorDari(items, mockCatalog) };
}

export function hitungContoh(paguRp: number, k: KonteksContoh): PriorityResult {
  return rankPriorities({ catalog: mockCatalog, items: k.items, prices: k.harga, paguRp });
}
