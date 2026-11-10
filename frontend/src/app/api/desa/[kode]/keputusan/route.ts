import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { handle } from "@/server/http";
import { setKeputusan } from "@/server/prioritas";

// PUT /api/desa/[kode]/keputusan (TRD §8): keputusan satu baris.
const body = z.object({
  itemKode: z.string({ error: "Item tidak dikenal." }).min(1, "Item tidak dikenal."),
  aksi: z.enum(["perbaiki", "beli"], { error: "Aksi tidak dikenal." }),
  keputusan: z.enum(["setuju", "tolak", "tunda"], { error: "Keputusan tidak dikenal." }),
  catatan: z.string({ error: "Catatan harus teks." }).optional(),
});

export const PUT = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/keputusan">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { itemKode, aksi, keputusan, catatan } = body.parse(await req.json().catch(() => null));
  await setKeputusan(kode, akun.id, itemKode, aksi, keputusan, catatan);
  return new Response(null, { status: 204 });
});
