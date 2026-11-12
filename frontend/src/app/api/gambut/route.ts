import { handle } from "@/server/http";
import { getDesaGambut } from "@/server/queries";

/*
 * GET /api/gambut (TRD §8): desa bergambut seluruh Kalimantan. Publik, tanpa sesi.
 *
 * Bawaan menyertakan `geomJson` (poligon desa, sudah disederhanakan) supaya frontend bisa
 * langsung menggambar peta. Respons ±2,4 MB untuk 1.220 desa. Kalau hanya perlu tabel,
 * pakai `?geom=0`: `geomJson` dihilangkan dan respons turun ke ±300 KB.
 */
export const GET = handle(async (req) => {
  const geom = new URL(req.url).searchParams.get("geom") !== "0";
  return Response.json({ hasil: await getDesaGambut({ geom }) });
});
