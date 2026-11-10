import { handle } from "@/server/http";
import { getBacktest } from "@/server/queries";

// GET /api/backtest (TRD §8): metrik, grup, gerbang, 20 teratas beku.
export const GET = handle(async () => Response.json(await getBacktest()));
