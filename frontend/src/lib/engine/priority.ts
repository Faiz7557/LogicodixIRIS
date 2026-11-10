import type { Aksi, CatalogItem, PriorityInput, PriorityResult, PriorityRow } from "@/lib/types";
import { cmpKode, round1, skorDari } from "./readiness";

interface State {
  item: CatalogItem;
  target: number;
  berfungsiAwal: number;
  berfungsi: number;
  sisa: Record<Aksi, number>; // unit kandidat yang belum dipilih
  harga: Partial<Record<Aksi, number>>;
}

const coverage = (s: State) => Math.min(s.berfungsi / s.target, 1);

function alasan(s: State, cakupanSesudah: number): string {
  const { nama, satuan } = s.item;
  return `${nama} ${s.berfungsiAwal} dari ${s.target} ${satuan}. Menaikkan cakupan ke ${Math.round(cakupanSesudah * 100)}%.`;
}

export function rankPriorities({ catalog, readiness, prices, paguRp }: PriorityInput): PriorityResult {
  const byKode = new Map(catalog.map((c) => [c.kode, c]));
  const states: State[] = [];
  const tanpaHarga: string[] = [];

  for (const ri of readiness.items) {
    const item = byKode.get(ri.itemKode);
    if (!item) continue;
    const gap = Math.max(ri.target - ri.berfungsi, 0);
    if (gap === 0) continue;
    const harga: State["harga"] = {};
    for (const p of prices) if (p.itemKode === item.kode) harga[p.aksi] = p.hargaRp;
    const perbaiki = item.punyaRusak && harga.perbaiki !== undefined ? Math.min(ri.rusak, gap) : 0;
    // Unit rusak tanpa harga perbaikan jatuh ke kandidat beli.
    const beli = item.bisaDibeli && harga.beli !== undefined ? gap - perbaiki : 0;
    if (harga.perbaiki === undefined && harga.beli === undefined) {
      tanpaHarga.push(item.kode);
      continue;
    }
    states.push({ item, target: ri.target, berfungsiAwal: ri.berfungsi, berfungsi: ri.berfungsi, sisa: { perbaiki, beli }, harga });
  }

  // ponytail: greedy per unit, bukan knapsack optimal. Dipilih agar bisa dijelaskan di musyawarah.
  const rows = new Map<string, PriorityRow>(); // urutan sisip = urutan pemilihan pertama
  let sisaPagu = paguRp;
  for (;;) {
    let best: { s: State; aksi: Aksi; biaya: number; rasio: number } | null = null;
    for (const s of states) {
      const f = s.item.kritis && coverage(s) < 0.25 ? 1.5 : 1;
      const gain = s.item.bobot * (Math.min((s.berfungsi + 1) / s.target, 1) - coverage(s)) * f;
      for (const aksi of ["perbaiki", "beli"] as const) {
        const biaya = s.harga[aksi];
        if (s.sisa[aksi] <= 0 || biaya === undefined || biaya > sisaPagu) continue;
        const rasio = biaya > 0 ? gain / biaya : Infinity;
        const lebihBaik =
          !best ||
          rasio > best.rasio ||
          (rasio === best.rasio &&
            (aksi !== best.aksi ? aksi === "perbaiki" : cmpKode(s.item.kode, best.s.item.kode) < 0));
        if (lebihBaik) best = { s, aksi, biaya, rasio };
      }
    }
    if (!best) break;
    const { s, aksi, biaya } = best;
    s.sisa[aksi] -= 1;
    s.berfungsi += 1;
    sisaPagu -= biaya;
    const key = `${s.item.kode}|${aksi}`;
    const row = rows.get(key) ?? { itemKode: s.item.kode, aksi, qty: 0, biayaRp: 0, alasan: "" };
    row.qty += 1;
    row.biayaRp += biaya;
    row.alasan = alasan(s, coverage(s));
    rows.set(key, row);
  }

  const tidakTerdanai: PriorityRow[] = [];
  for (const s of states) {
    let berfungsi = s.berfungsi;
    for (const aksi of ["perbaiki", "beli"] as const) {
      const qty = s.sisa[aksi];
      if (qty <= 0) continue;
      berfungsi += qty;
      tidakTerdanai.push({
        itemKode: s.item.kode,
        aksi,
        qty,
        biayaRp: qty * s.harga[aksi]!,
        alasan: alasan(s, Math.min(berfungsi / s.target, 1)),
      });
    }
  }

  const naik = new Map(states.map((s) => [s.item.kode, coverage(s)]));
  const sesudah = readiness.items.map((i) => ({ itemKode: i.itemKode, coverage: naik.get(i.itemKode) ?? i.coverage }));

  return {
    paguRp,
    terpakaiRp: paguRp - sisaPagu,
    skorSesudah: round1(skorDari(sesudah, catalog)),
    terpilih: [...rows.values()],
    tidakTerdanai,
    tanpaHarga,
  };
}
