import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { getInventaris, saveInventaris } from "@/server/inventaris";

// GET/PUT /api/desa/[kode]/inventaris (TRD §8): baca dan simpan alat desa sendiri.
const body = z.array(
  z.object({
    itemKode: z.string({ error: "Item tidak dikenal." }),
    total: z.number({ error: "Isi dengan angka 0 atau lebih." }),
    berfungsi: z.number({ error: "Isi dengan angka 0 atau lebih." }),
    catatan: z.string({ error: "Catatan harus teks." }).optional(),
  }),
  { error: "Isian alat harus berupa daftar." },
);

export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/inventaris">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["mpa", "desa"]);
  return Response.json(await getInventaris(kode));
});

export const PUT = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/inventaris">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["mpa", "desa"]);
  const rows = body.parse(await req.json().catch(() => null));
  await saveInventaris(kode, akun.id, rows);
  return Response.json({ disimpanPada: new Date().toISOString() });
});
