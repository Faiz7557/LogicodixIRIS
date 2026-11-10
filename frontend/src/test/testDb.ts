import type { Client } from "@libsql/client";
import { afterEach, beforeEach } from "vitest";
import { setDb } from "@/server/db";
import { buildTestDb } from "./buildTestDb";

export { buildTestDb };

/** DB baru per tes (`:memory:` aman: batch dan transaction memakai koneksi yang sama). */
export function useTestDb(): void {
  let c: Client | null = null;
  beforeEach(async () => {
    c = await buildTestDb(":memory:");
    setDb(c);
  });
  afterEach(() => {
    c?.close();
    c = null;
    setDb(null);
  });
}
