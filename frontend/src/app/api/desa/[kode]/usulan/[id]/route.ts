import { requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { getUsulan } from "@/server/usulan";

// GET /api/desa/[kode]/usulan/[id] (TRD §8): satu usulan, fakta beku.
export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan/[id]">) => {
  const { kode, id } = await ctx.params;
  await requireDesaAccess(req, kode, ["desa"]);
  const nomor = Number(id);
  if (!Number.isInteger(nomor) || nomor < 1) {
    return Response.json({ error: { kode: "usulan_tidak_ada", pesan: "Usulan tidak ditemukan." } }, { status: 404 });
  }
  return Response.json(await getUsulan(kode, nomor));
});
