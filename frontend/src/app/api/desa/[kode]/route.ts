import { HttpError, handle } from "@/server/http";
import { getDesaCard } from "@/server/queries";

// GET /api/desa/[kode] (TRD §8): DesaCard atau 404.
export const GET = handle(async (_req, ctx: RouteContext<"/api/desa/[kode]">) => {
  const { kode } = await ctx.params;
  const card = await getDesaCard(kode);
  if (!card) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");
  return Response.json(card);
});
