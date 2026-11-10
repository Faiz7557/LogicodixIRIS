import { requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { getUsulan } from "@/server/usulan";

// GET /api/desa/[kode]/usulan/[id] (TRD §8): satu usulan, fakta beku.
export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan/[id]">) => {
  const { kode, id } = await ctx.params;
  await requireDesaAccess(req, kode, ["desa"]);
  const nomor = Number(id);
  if (!Number.isInteger(nomor) || nomor < 1) {
    throw new HttpError(404, "usulan_tidak_ada", "Usulan tidak ditemukan.");
  }
  return Response.json(await getUsulan(kode, nomor));
});
