"use client";

import { useEffect } from "react";

// Galat apa pun pada layar desa berakun: pesan jelas, tombol coba lagi (Design Brief §10).
// Next.js 16 memberi fungsi pemulih bernama `retry`.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6">
      <div role="alert" className="rounded-card border border-danger/40 bg-surface px-4 py-5">
        <p className="font-semibold text-danger">Data desa gagal dimuat. Periksa sinyal, lalu coba lagi.</p>
        <p className="mt-1 text-sm text-muted">Isian yang sudah disimpan tidak hilang.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-3 inline-flex min-h-11 items-center rounded-card border border-line bg-paper px-4 font-semibold"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
