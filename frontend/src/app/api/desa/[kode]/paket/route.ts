import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { getTargetEfektif, setTarget } from "@/server/efektif";
import { handle } from "@/server/http";

// GET/PUT /api/desa/[kode]/paket (TRD §8). PUT hanya peran desa.
const body = z.object({
  itemKode: z.string({ error: "Item tidak dikenal." }).min(1, "Item tidak dikenal."),
  target: z.number({ error: "Target harus angka 0 atau lebih." }),
  alasan: z.string({ error: "Alasan wajib diisi." }),
});

export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/paket">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["mpa", "desa"]);
  return Response.json({ hasil: await getTargetEfektif(kode) });
});

export const PUT = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/paket">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { itemKode, target, alasan } = body.parse(await req.json().catch(() => null));
  await setTarget(kode, akun.id, itemKode, target, alasan);
  return new Response(null, { status: 204 });
});
