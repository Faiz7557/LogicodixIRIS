import { z } from "zod";
import { parseInventoryText } from "@/lib/parseInventaris";
import { assertOrigin, hitRateLimit, requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { getCatalog } from "@/server/queries";

// POST /api/desa/[kode]/inventaris/parse (TRD §8, FR-19): teks menjadi isian formulir.
const body = z.object({
  teks: z
    .string({ error: "Teks wajib diisi." })
    .min(1, "Teks wajib diisi.")
    .max(2000, "Teks maksimal 2.000 karakter."),
});

export const POST = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/inventaris/parse">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["mpa", "desa"]);
  if (!(await hitRateLimit(`parse:${akun.id}`, 10, 60))) {
    throw new HttpError(429, "terlalu_banyak", "Coba lagi dalam 1 jam.", { "Retry-After": "3600" });
  }

  const { teks } = body.parse(await req.json().catch(() => null));
  const catalog = await getCatalog();

  try {
    return Response.json({ hasil: await parseInventoryText(teks, catalog) });
  } catch (e) {
    if (e instanceof Error) throw new HttpError(422, "input_tidak_sah", e.message);
    throw e;
  }
});
