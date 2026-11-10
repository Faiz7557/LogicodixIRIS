/*
 * Satu pintu data untuk Server Component. Semua isi berasal dari DB nyata lewat `server/*`.
 * Client Component memakai `/api/...` melalui `lib/api-client.ts`.
 */
import { redirect } from "next/navigation";
import { getSesiAkun } from "@/server/auth";
import { getHargaEfektif, getReferensiPergub, getTargetEfektif } from "@/server/efektif";
import { getInventaris } from "@/server/inventaris";
import { getKesiapan } from "@/server/kesiapan";
import { getPrioritas } from "@/server/prioritas";
import { getCatalog, getDesaCard, getGerbang } from "@/server/queries";
import { getUsulan, listUsulan } from "@/server/usulan";
import type { Akun } from "./types";

/** Akun dari sesi nyata (cookie `sk_sesi`). Tanpa sesi: null. */
export function getSesi(): Promise<Akun | null> {
  return getSesiAkun();
}

/** Layar berakun: tanpa sesi menuju `/masuk`. */
export async function getAkun(): Promise<Akun> {
  return (await getSesiAkun()) ?? redirect("/masuk");
}

export { getCatalog, getDesaCard, getGerbang, getHargaEfektif as getHarga, getInventaris, getKesiapan };
export { getReferensiPergub, getTargetEfektif as getPaket };
export { getPrioritas, getUsulan, listUsulan };
