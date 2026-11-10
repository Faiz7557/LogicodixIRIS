import type { CatalogItem, InventoryRow, ReadinessItem, ReadinessResult, Status, TargetRow } from "@/lib/types";

export const round1 = (x: number) => Math.round(x * 10) / 10;
/** Urut kode biner, bukan locale, agar seri selalu deterministik. */
export const cmpKode = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Skor 0-100 (belum dibulatkan) dari daftar item dan bobot katalog. TRD §6. */
export function skorDari(items: Pick<ReadinessItem, "itemKode" | "coverage">[], catalog: CatalogItem[]): number {
  const bobot = new Map(catalog.map((c) => [c.kode, c.bobot]));
  let num = 0;
  let den = 0;
  for (const i of items) {
    const b = bobot.get(i.itemKode) ?? 0;
    num += b * i.coverage;
    den += b;
  }
  return den > 0 ? (100 * num) / den : 0;
}

export function computeReadiness(catalog: CatalogItem[], targets: TargetRow[], inventory: InventoryRow[]): ReadinessResult {
  const tgt = new Map(targets.map((t) => [t.itemKode, t.target]));
  const inv = new Map(inventory.map((r) => [r.itemKode, r]));

  const items: ReadinessItem[] = [];
  for (const c of catalog) {
    const target = tgt.get(c.kode) ?? 0;
    if (target <= 0) continue; // target 0 tidak dihitung
    const row = inv.get(c.kode);
    const berfungsi = row?.berfungsi ?? 0;
    const rusak = row && c.punyaRusak ? Math.max(row.total - row.berfungsi, 0) : 0;
    items.push({
      itemKode: c.kode,
      target,
      berfungsi,
      rusak,
      coverage: Math.min(berfungsi / target, 1),
      kritis: c.kritis,
      belumDiisi: !row,
    });
  }

  const skor = round1(skorDari(items, catalog));
  const kritis = items.filter((i) => i.kritis);
  let status: Status = "sebagian";
  if (skor < 40 || kritis.some((i) => i.coverage < 0.25)) status = "rawan";
  else if (skor >= 80 && kritis.every((i) => i.coverage >= 0.75)) status = "siap";

  const terlemah = [...kritis].sort((a, b) => a.coverage - b.coverage || cmpKode(a.itemKode, b.itemKode))[0];

  return {
    skor,
    status,
    rantaiTerlemah: terlemah?.itemKode ?? null,
    lengkap: items.every((i) => !i.belumDiisi),
    items,
  };
}
