import { hitRateLimit, ipDari } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { searchDesa } from "@/server/queries";

// GET /api/desa?q= (TRD §8): maks. 20 hasil. Di bawah 2 karakter tidak mencari.
export const GET = handle(async (req) => {
  if (!(await hitRateLimit(`cari:${ipDari(req)}`, 30, 1))) {
    throw new HttpError(429, "terlalu_banyak", "Terlalu banyak pencarian. Coba lagi sebentar.", { "Retry-After": "60" });
  }
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim();
  if (q.length > 80) throw new HttpError(400, "input_tidak_sah", "Kata pencarian terlalu panjang. Maksimal 80 karakter.");
  if (q.length < 2) return Response.json({ hasil: [] });
  return Response.json({ hasil: await searchDesa(q) });
});
