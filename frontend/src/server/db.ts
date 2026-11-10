import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function db(): Client {
  client ??= createClient({ url: process.env.DATABASE_URL ?? "file:../data/siapkemarau.db" });
  return client;
}

/** Hanya untuk tes. */
export function setDb(c: Client | null): void {
  client = c;
}
