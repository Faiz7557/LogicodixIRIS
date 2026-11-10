import { z } from "zod";
import { assertOrigin, requireDesaAccess } from "@/server/auth";
import { getHargaEfektif, setHarga } from "@/server/efektif";
import { handle } from "@/server/http";

// GET/PUT /api/desa/[kode]/harga (TRD §8). PUT hanya peran desa.
const body = z.object({
  itemKode: z.string({ error: "Item tidak dikenal." }).min(1, "Item tidak dikenal."),
  aksi: z.enum(["perbaiki", "beli"], { error: "Aksi tidak dikenal." }),
  hargaRp: z.number({ error: "Harga harus bilangan bulat rupiah." }),
  sumber: z.string({ error: "Sumber harga wajib diisi." }),
});

export const GET = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/harga">) => {
  const { kode } = await ctx.params;
  await requireDesaAccess(req, kode, ["mpa", "desa"]);
  return Response.json({ hasil: await getHargaEfektif(kode) });
});

export const PUT = handle(async (req, ctx: RouteContext<"/api/desa/[kode]/harga">) => {
  assertOrigin(req);
  const { kode } = await ctx.params;
  const akun = await requireDesaAccess(req, kode, ["desa"]);
  const { itemKode, aksi, hargaRp, sumber } = body.parse(await req.json().catch(() => null));
  await setHarga(kode, akun.id, itemKode, aksi, hargaRp, sumber);
  return new Response(null, { status: 204 });
});
