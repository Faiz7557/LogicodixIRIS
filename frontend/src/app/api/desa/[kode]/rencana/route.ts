import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { setPagu } from "@/server/prioritas";

// PUT /api/desa/[kode]/rencana (TRD §8): pagu belanja desa.
const body = z.object({ paguRp: z.number({ error: "Pagu harus bilangan bulat rupiah." }) });

export const PUT = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/rencana">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { paguRp } = body.parse(await req.json().catch(() => null));
  await setPagu(kode, akun.id, paguRp);
  return new Response(null, { status: 204 });
});
