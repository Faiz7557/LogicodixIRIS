import { z } from "zod";
import { assertOrigin, hitRateLimit, ipDari, requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import { getRingkasan } from "@/server/ringkasan";

// POST /api/ringkasan: ringkasan satu halaman. Klien hanya menyebut halaman dan kode; fakta disusun server.
const body = z.object({
  halaman: z.enum(["paparan", "kesiapan", "prioritas", "anggaran", "usulan", "timemachine"], { error: "Halaman tidak dikenal." }),
  kode: z.string().min(1).max(20).optional(),
});

const lewat = () =>
  new HttpError(429, "terlalu_banyak", "Terlalu banyak permintaan ringkasan. Coba lagi dalam 1 jam.", { "Retry-After": "3600" });

export const POST = handle(async (req) => {
  assertOrigin(req);
  const { halaman, kode } = body.parse(await req.json().catch(() => null));

  // Halaman berakun diperiksa sebelum apa pun, supaya akun lain tidak memicu panggilan OpenAI.
  let pemilik = ipDari(req);
  if (halaman === "kesiapan" || halaman === "prioritas" || halaman === "anggaran" || halaman === "usulan") {
    if (!kode) throw new HttpError(400, "input_tidak_sah", "Kode desa wajib diisi.");
    const akun = await requireDesaAccess(req, kode, halaman === "kesiapan" ? ["mpa", "desa"] : ["desa"]);
    pemilik = String(akun.id);
  }
  if (!(await hitRateLimit(`ringkas:${pemilik}`, 20, 60))) throw lewat();
  if (!(await hitRateLimit("ringkas:global", 300, 60))) throw lewat();

  return Response.json(await getRingkasan(halaman, kode));
});
