import { z } from "zod";
import { assertOrigin, hitRateLimit, requireDesaAccess } from "@/server/auth";
import { HttpError, handle } from "@/server/http";
import {
  listUsulanPage,
  terbitkanPermohonanAnggaran,
  terbitkanUsulan,
} from "@/server/usulan";

// GET/POST /api/desa/[kode]/usulan (TRD §8): daftar dan terbitkan.
// Dua jenis surat: pengadaan alat (baris yang dipilih dari yang disetujui) dan permohonan anggaran (sejumlah uang).
// Tanpa `jenis`, body lama { kanal } tetap diterima sebagai pengadaan alat berisi semua yang disetujui.
const kanal = z.enum(["apbdes_perubahan", "bpbd", "daops", "csr"], {
  error: "Kanal tidak dikenal.",
});
const nomor = z
  .string({ error: "Nomor surat harus teks." })
  .max(60, "Nomor surat maksimal 60 karakter.")
  .optional();
const body = z.preprocess(
  (v) =>
    v && typeof v === "object" && !("jenis" in v) ? { ...v, jenis: "alat" } : v,
  z.discriminatedUnion(
    "jenis",
    [
      z.object({
        jenis: z.literal("alat"),
        kanal,
        nomor,
        pilih: z
          .array(
            z.object({
              itemKode: z.string().min(1),
              aksi: z.enum(["perbaiki", "beli"]),
            }),
            { error: "Daftar alat tidak sah." },
          )
          .min(1, "Pilih minimal satu alat untuk dimuat di surat.")
          .max(50)
          .optional(),
      }),
      z.object({
        jenis: z.literal("anggaran"),
        kanal,
        nomor,
        jumlahRp: z
          .number({ error: "Jumlah anggaran harus angka." })
          .int("Jumlah anggaran harus bilangan bulat."),
        tahun: z
          .number({ error: "Tahun anggaran harus angka." })
          .int("Tahun anggaran harus bilangan bulat."),
      }),
    ],
    { error: "Jenis surat tidak dikenal." },
  ),
);

export const GET = handle(
  async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
    const { kode } = await ctx.params;
    await requireDesaAccess(req, kode, ["desa"]);

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const cursorRaw = url.searchParams.get("cursor");
    const cursor = cursorRaw === null ? undefined : Number(cursorRaw);
    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new HttpError(
        400,
        "input_tidak_sah",
        "Limit harus bilangan bulat 1 sampai 50.",
      );
    }
    if (cursor !== undefined && (!Number.isInteger(cursor) || cursor < 1)) {
      throw new HttpError(
        400,
        "input_tidak_sah",
        "Cursor harus bilangan bulat positif.",
      );
    }

    return Response.json(await listUsulanPage(kode, limit, cursor));
  },
);

export const POST = handle(
  async (req, ctx: RouteContext<"/api/desa/[kode]/usulan">) => {
    assertOrigin(req);
    const { kode } = await ctx.params;
    const akun = await requireDesaAccess(req, kode, ["desa"]);
    const isi = body.parse(await req.json().catch(() => null));
    // Tiap terbit bisa memanggil OpenAI untuk narasi: dibatasi per akun.
    if (!(await hitRateLimit(`narasi:${akun.id}`, 10, 60))) {
      throw new HttpError(
        429,
        "terlalu_banyak",
        "Terlalu banyak usulan diterbitkan. Coba lagi dalam 1 jam.",
        { "Retry-After": "3600" },
      );
    }
    const id =
      isi.jenis === "anggaran"
        ? await terbitkanPermohonanAnggaran(kode, akun.id, isi.kanal, {
            jumlahRp: isi.jumlahRp,
            tahun: isi.tahun,
            nomor: isi.nomor,
          })
        : await terbitkanUsulan(kode, akun.id, isi.kanal, {
            pilih: isi.pilih,
            nomor: isi.nomor,
          });
    return Response.json(
      { id },
      { status: 201, headers: { Location: `/api/desa/${kode}/usulan/${id}` } },
    );
  },
);
