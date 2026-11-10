import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { listUsulan, terbitkanUsulan } from "@/server/usulan";

// GET/POST /api/desa/[kode]/usulan (TRD §8): daftar dan terbitkan.
const body = z.object({ kanal: z.enum(["apbdes_perubahan", "bpbd", "daops", "csr"], { error: "Kanal tidak dikenal." }) });

export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["desa"]);
  return Response.json({ hasil: await listUsulan(kode) });
});

export const POST = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { kanal } = body.parse(await req.json().catch(() => null));
  const id = await terbitkanUsulan(kode, akun.id, kanal);
  return Response.json({ id }, { status: 201, headers: { Location: `/api/desa/${kode}/usulan/${id}` } });
});
