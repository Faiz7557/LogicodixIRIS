import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { listUsulanPage, terbitkanUsulan } from "@/server/usulan";

// GET/POST /api/desa/[kode]/usulan (TRD §8): daftar dan terbitkan.
const body = z.object({ kanal: z.enum(["apbdes_perubahan", "bpbd", "daops", "csr"], { error: "Kanal tidak dikenal." }) });

export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["desa"]);

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const cursorRaw = url.searchParams.get("cursor");
  const cursor = cursorRaw === null ? undefined : Number(cursorRaw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new HttpError(400, "input_tidak_sah", "Limit harus bilangan bulat 1 sampai 50.");
  }
  if (cursor !== undefined && (!Number.isInteger(cursor) || cursor < 1)) {
    throw new HttpError(400, "input_tidak_sah", "Cursor harus bilangan bulat positif.");
  }

  return Response.json(await listUsulanPage(kode, limit, cursor));
});

export const POST = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { kanal } = body.parse(await req.json().catch(() => null));
  const id = await terbitkanUsulan(kode, akun.id, kanal);
  return Response.json({ id }, { status: 201, headers: { Location: `/api/desa/${kode}/usulan/${id}` } });
});
