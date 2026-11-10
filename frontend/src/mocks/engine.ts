/*
 * MESIN TIRUAN, hanya agar layar Prioritas terasa nyata sebelum mesin backend siap.
 * Mengikuti v2/v2/02_TRD.md §6 (greedy per unit). Mesin asli: src/lib/engine/ milik backend.
 * Hapus bersama folder `src/mocks/` sebelum code freeze.
 */
import type { CatalogItem, PriceRow, PriorityResult, PriorityRow, ReadinessItem, Status } from "@/lib/types";

export interface MasukanMesin {
  catalog: CatalogItem[];
  items: ReadinessItem[];
  prices: PriceRow[];
  paguRp: number;
}

const bulat1 = (n: number) => Math.round(n * 10) / 10;

/** skor = 100 * Σ(bobot * coverage) / Σ(bobot); item bertarget 0 tidak dihitung. */
export function skorDari(items: ReadinessItem[], catalog: CatalogItem[], berfungsiBaru?: Record<string, number>): number {
  const bobot = new Map(catalog.map((c) => [c.kode, c.bobot]));
  let atas = 0;
  let bawah = 0;
  for (const it of items) {
    if (it.target <= 0) continue;
    const b = bobot.get(it.itemKode) ?? 0;
    const ada = berfungsiBaru?.[it.itemKode] ?? it.berfungsi;
    atas += b * Math.min(ada / it.target, 1);
    bawah += b;
  }
  return bawah === 0 ? 0 : bulat1((100 * atas) / bawah);
}

export function rankPriorities({ catalog, items, prices, paguRp }: MasukanMesin): PriorityResult {
  const byKode = new Map(catalog.map((c) => [c.kode, c]));
  const harga = (kode: string, aksi: "beli" | "perbaiki") =>
    prices.find((p) => p.itemKode === kode && p.aksi === aksi)?.hargaRp;

  const cur: Record<string, number> = {};
  const rusak: Record<string, number> = {};
  for (const it of items) {
    cur[it.itemKode] = it.berfungsi;
    rusak[it.itemKode] = it.rusak;
  }
  const awal = { ...cur };

  const picks = new Map<string, { itemKode: string; aksi: "beli" | "perbaiki"; qty: number; biaya: number; dari: number }>();
  let sisa = Math.max(0, paguRp);

  for (;;) {
    let terbaik: { kode: string; aksi: "beli" | "perbaiki"; biaya: number; rasio: number } | null = null;
    for (const it of items) {
      const c = byKode.get(it.itemKode);
      if (!c || !c.bisaDibeli || it.target <= 0 || cur[it.itemKode] >= it.target) continue;
      const cov = cur[it.itemKode] / it.target;
      const f = c.kritis && cov < 0.25 ? 1.5 : 1;
      const gain = c.bobot * (1 / it.target) * f;
      for (const aksi of ["perbaiki", "beli"] as const) {
        if (aksi === "perbaiki" && rusak[it.itemKode] <= 0) continue;
        const biaya = harga(it.itemKode, aksi);
        if (biaya === undefined || biaya > sisa) continue;
        const rasio = gain / biaya;
        const lebihBaik =
          !terbaik ||
          rasio > terbaik.rasio ||
          (rasio === terbaik.rasio && aksi === "perbaiki" && terbaik.aksi !== "perbaiki") ||
          (rasio === terbaik.rasio && aksi === terbaik.aksi && it.itemKode < terbaik.kode);
        if (lebihBaik) terbaik = { kode: it.itemKode, aksi, biaya, rasio };
      }
    }
    if (!terbaik) break;
    const key = `${terbaik.kode}:${terbaik.aksi}`;
    const p = picks.get(key) ?? { itemKode: terbaik.kode, aksi: terbaik.aksi, qty: 0, biaya: 0, dari: cur[terbaik.kode] };
    p.qty += 1;
    p.biaya += terbaik.biaya;
    picks.set(key, p);
    cur[terbaik.kode] += 1;
    if (terbaik.aksi === "perbaiki") rusak[terbaik.kode] -= 1;
    sisa -= terbaik.biaya;
  }

  const target = new Map(items.map((i) => [i.itemKode, i.target]));
  const alasan = (kode: string, dari: number, sesudah: number) => {
    const c = byKode.get(kode)!;
    const t = target.get(kode) ?? 0;
    const pct = t > 0 ? Math.round((Math.min(sesudah / t, 1)) * 100) : 0;
    return `${c.nama} ${dari} dari ${t} ${c.satuan}. Menaikkan cakupan ke ${pct}%.`;
  };

  const terpilih: PriorityRow[] = [...picks.values()].map((p) => ({
    itemKode: p.itemKode,
    aksi: p.aksi,
    qty: p.qty,
    biayaRp: p.biaya,
    alasan: alasan(p.itemKode, p.dari, p.dari + p.qty),
  }));
  // perbaiki lebih dulu, lalu urutan katalog
  const urutan = new Map(catalog.map((c, i) => [c.kode, i]));
  terpilih.sort((a, b) => (a.aksi === b.aksi ? (urutan.get(a.itemKode)! - urutan.get(b.itemKode)!) : a.aksi === "perbaiki" ? -1 : 1));

  const tidakTerdanai: PriorityRow[] = [];
  const tanpaHarga: string[] = [];
  for (const it of items) {
    const c = byKode.get(it.itemKode);
    if (!c || !c.bisaDibeli || it.target <= 0) continue;
    const gapAwal = it.target - awal[it.itemKode];
    if (gapAwal <= 0) continue;
    if (harga(it.itemKode, "beli") === undefined && harga(it.itemKode, "perbaiki") === undefined) {
      tanpaHarga.push(it.itemKode);
      continue;
    }
    let gap = it.target - cur[it.itemKode];
    if (gap <= 0) continue;
    const hp = harga(it.itemKode, "perbaiki");
    const r = Math.min(rusak[it.itemKode], gap);
    if (hp !== undefined && r > 0) {
      tidakTerdanai.push({ itemKode: it.itemKode, aksi: "perbaiki", qty: r, biayaRp: r * hp, alasan: alasan(it.itemKode, cur[it.itemKode], cur[it.itemKode] + r) });
      gap -= r;
    }
    const hb = harga(it.itemKode, "beli");
    if (hb !== undefined && gap > 0) {
      tidakTerdanai.push({ itemKode: it.itemKode, aksi: "beli", qty: gap, biayaRp: gap * hb, alasan: alasan(it.itemKode, it.target - gap, it.target) });
    }
  }

  const terpakai = Math.max(0, paguRp) - sisa;
  return {
    paguRp,
    terpakaiRp: terpakai,
    skorSesudah: skorDari(items, catalog, cur),
    terpilih,
    tidakTerdanai,
    tanpaHarga,
  };
}

/** rawan: ada item kritis di bawah 25% atau skor < 40. siap: skor >= 80 dan semua kritis >= 75%. */
export function statusDari(items: ReadinessItem[], catalog: CatalogItem[], skor: number): Status {
  const kritis = new Set(catalog.filter((c) => c.kritis).map((c) => c.kode));
  const cov = items.filter((i) => kritis.has(i.itemKode) && i.target > 0).map((i) => Math.min(i.berfungsi / i.target, 1));
  if (cov.some((c) => c < 0.25) || skor < 40) return "rawan";
  if (skor >= 80 && cov.every((c) => c >= 0.75)) return "siap";
  return "sebagian";
}

/** Item kritis dengan cakupan terkecil; seri diurut kode. */
export function rantaiTerlemahDari(items: ReadinessItem[], catalog: CatalogItem[]): string | null {
  const kritis = new Set(catalog.filter((c) => c.kritis).map((c) => c.kode));
  const k = items.filter((i) => kritis.has(i.itemKode) && i.target > 0);
  if (k.length === 0) return null;
  return k.reduce((a, b) => {
    const ca = a.berfungsi / a.target;
    const cb = b.berfungsi / b.target;
    return cb < ca || (cb === ca && b.itemKode < a.itemKode) ? b : a;
  }).itemKode;
}
