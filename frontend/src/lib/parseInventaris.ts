import { z } from "zod";
import type { CatalogItem } from "./types";
import { PESAN, type InventoryInput } from "./inventaris";

export const MAKS_TEKS = 2000;

/** Hapus deret 9 digit atau lebih, termasuk format telepon bertitik/strip. */
export function stripPhones(teks: string): string {
  return teks.replace(/\+?\d[\d\s.\-]{7,}\d/g, (bagian) => (bagian.replace(/\D/g, "").length >= 9 ? " " : bagian));
}

const baris = z.object({
  itemKode: z.string().min(1),
  total: z.number({ error: PESAN.angka }).min(0, PESAN.angka),
  berfungsi: z.number({ error: PESAN.angka }).min(0, PESAN.angka),
  catatan: z.string().max(500).optional(),
});

export const parsedInventorySchema = z.array(baris).max(100).superRefine((rows, ctx) => {
  for (const r of rows) {
    if (r.berfungsi > r.total) {
      ctx.addIssue({ code: "custom", message: PESAN.melebihi });
      return;
    }
  }
});

function angkaDi(teks: string): number[] {
  return (teks.match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map((n) => Number(n.replace(",", ".")))
    .filter(Number.isFinite);
}

/**
 * Parser deterministik untuk pesan pendek. AI belum dipakai: teks hanya dipetakan ke nama
 * katalog, lalu angka pada baris yang sama dibaca sebagai total dan berfungsi.
 */
export async function parseInventoryText(teks: string, catalog: CatalogItem[]): Promise<InventoryInput[]> {
  if (teks.length > MAKS_TEKS) throw new Error(`Teks maksimal ${MAKS_TEKS.toLocaleString("id-ID")} karakter.`);

  const bersih = stripPhones(teks).toLowerCase();
  const lines = bersih.split(/\r?\n/);
  const hasil: InventoryInput[] = [];

  for (const item of catalog) {
    const nama = item.nama.toLowerCase();
    const kode = item.kode.toLowerCase();
    const line = lines.find((l) => l.includes(nama) || l.includes(kode));
    if (!line) continue;

    const angka = angkaDi(line);
    if (angka.length === 0) continue;

    const total = Math.max(0, Math.round(angka[0]));
    const berfungsi = angka.length > 1 ? Math.max(0, Math.round(angka[1])) : total;
    if (berfungsi > total) throw new Error(PESAN.melebihi);
    hasil.push({ itemKode: item.kode, total, berfungsi });
  }

  const parsed = parsedInventorySchema.safeParse(hasil);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Isian tidak sah.");
  return parsed.data;
}
