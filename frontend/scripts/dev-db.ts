// Membangun data/dev.db berisi data uji (bukan hasil pipeline). Jalankan dari frontend/: npx tsx scripts/dev-db.ts
import { rmSync } from "node:fs";
import { buildTestDb } from "../src/test/buildTestDb";

async function main() {
  rmSync("../data/dev.db", { force: true });
  const c = await buildTestDb("file:../data/dev.db");
  const [{ n }] = (await c.execute("SELECT COUNT(*) AS n FROM desa")).rows;
  c.close();
  console.log(`data/dev.db siap: ${n} desa uji.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
