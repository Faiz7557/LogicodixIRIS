import { handle } from "@/server/http";
import { getDesaGambut } from "@/server/queries";

// GET /api/gambut (TRD §8): desa bergambut seluruh Kalimantan. Publik, tanpa parameter.
export const GET = handle(async () => Response.json({ hasil: await getDesaGambut() }));
