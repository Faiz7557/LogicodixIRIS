import { db } from "./db";

export async function writeAudit(akunId: number, desaKode: string, aksi: string, detail: unknown): Promise<void> {
  await db().execute({
    sql: "INSERT INTO audit_log (akun_id, desa_kode, aksi, detail_json, created_at) VALUES (?,?,?,?,?)",
    args: [akunId, desaKode, aksi, JSON.stringify(detail ?? null), new Date().toISOString()],
  });
}
