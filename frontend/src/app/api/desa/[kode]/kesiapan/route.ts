import { requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { getKesiapan } from "@/server/kesiapan";

// GET /api/desa/[kode]/kesiapan (TRD §8): ReadinessResult dari data tersimpan.
export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/kesiapan">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["mpa", "desa"]);
  return Response.json(await getKesiapan(kode));
});
