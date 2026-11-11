import type { ApiErrorBody } from "./types";

/** Galat API berbentuk `{ error: { kode, pesan } }` (TRD §8). */
export class ApiError extends Error {
  constructor(
    public status: number,
    public kode: string,
    public pesan: string,
  ) {
    super(pesan);
  }
}

/**
 * Pemanggil API untuk Client Component (cari desa, simpan alat, ubah pagu, keputusan).
 * Halaman server membaca data lewat fungsi di `lib/` milik backend, bukan lewat ini.
 */
export async function api<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  let res: Response;
  try {
    res = await fetch(path, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...rest.headers,
      },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
      credentials: "same-origin",
    });
  } catch {
    throw new ApiError(0, "jaringan", "Tidak ada sinyal. Coba lagi saat koneksi kembali.");
  }

  if (res.status === 204) return undefined as T;
  const body = (await res.json().catch(() => null)) as T | ApiErrorBody | null;

  if (!res.ok) {
    const err = (body as ApiErrorBody | null)?.error;
    throw new ApiError(res.status, err?.kode ?? "galat", err?.pesan ?? "Terjadi galat. Coba lagi.");
  }
  return body as T;
}
