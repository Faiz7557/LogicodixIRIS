import { getAkun } from "@/server/auth";
import { HttpError, handle } from "@/server/http";

export const GET = handle(async (req) => {
  const akun = await getAkun(req);
  if (!akun) throw new HttpError(401, "belum_masuk", "Masuk dulu untuk membuka halaman ini.");
  return Response.json({ akun });
});
