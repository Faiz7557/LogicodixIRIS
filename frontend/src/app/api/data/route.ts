import { handle } from "@/server/http";
import { getDataPage } from "@/server/queries";

// GET /api/data (TRD §8): sumber, masalah data, meta, paket, harga.
export const GET = handle(async () => Response.json(await getDataPage()));
