import { computeReadiness } from "@/lib/engine/readiness";
import type { ReadinessResult } from "@/lib/types";
import { getTargetEfektif } from "./efektif";
import { getInventaris } from "./inventaris";
import { getCatalog } from "./queries";

/** Skor kesiapan dihitung di server dari katalog, target efektif, dan inventaris tersimpan. */
export async function getKesiapan(kode: string): Promise<ReadinessResult> {
  const [catalog, targets, inventaris] = await Promise.all([getCatalog(), getTargetEfektif(kode), getInventaris(kode)]);
  const boleh = new Set(targets.map((t) => t.itemKode));
  return computeReadiness(catalog.filter((c) => boleh.has(c.kode)), targets, inventaris.rows);
}
