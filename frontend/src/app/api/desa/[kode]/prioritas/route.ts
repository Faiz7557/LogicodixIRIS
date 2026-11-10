import { requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { getPrioritas } from "@/server/prioritas";

// GET /api/desa/[kode]/prioritas (TRD §8): PriorityResult + keputusan. Hanya peran desa.
export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/prioritas">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["desa"]);
  return Response.json(await getPrioritas(kode));
});
