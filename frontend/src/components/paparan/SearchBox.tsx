"use client";

import { useEffect, useState } from "react";
import { SkeletonBlock } from "@/components/ui/PageState";
import { api } from "@/lib/api-client";
import type { DesaHit } from "@/lib/types";
import { KartuHasilDesa, type HasilCari } from "./KartuHasilDesa";

type Hasil = { untuk: string; hits: HasilCari[] } | { untuk: string; galat: true };

/**
 * Pencarian desa (App Flow v2 §3.1): mulai setelah 2 karakter, jeda 250 ms, maksimal 20 hasil.
 * Tampil sebagai kartu mengambang di hero: kolom besar + tombol bulat. Menekan tombol atau Enter
 * mengulang pencarian segera. Keadaan: petunjuk, memuat, hasil, tidak ada hasil, gagal jaringan.
 * Sumber: GET /api/desa?q= lewat api() di lib/api-client.
 */
export function SearchBox() {
  const [q, setQ] = useState("");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [ulang, setUlang] = useState(0);
  const kata = q.trim();
  const kurang = kata.length < 2;

  useEffect(() => {
    if (kurang) return;
    let batal = false;
    const t = setTimeout(() => {
      api<{ hasil: DesaHit[] }>(`/api/desa?q=${encodeURIComponent(kata)}`)
        .then(({ hasil }) => !batal && setHasil({ untuk: kata, hits: hasil }))
        .catch(() => !batal && setHasil({ untuk: kata, galat: true }));
    }, 250);
    return () => {
      batal = true;
      clearTimeout(t);
    };
  }, [kata, kurang, ulang]);

  // Hasil lama untuk kata lain tidak ditampilkan: dianggap masih memuat.
  const terkini = hasil && hasil.untuk === kata ? hasil : null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-2 shadow-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!kurang) {
            setHasil(null);
            setUlang((n) => n + 1);
          }
        }}
        className="flex items-center gap-2"
      >
        <div className="min-w-0 flex-1 px-3 py-1">
          <label htmlFor="cari-desa" className="block text-xs font-semibold text-muted">
            Cari desa, kecamatan, atau kabupaten
          </label>
          <input
            id="cari-desa"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setHasil(null);
            }}
            placeholder="Contoh: Kalibandung"
            aria-describedby="cari-status"
            className="min-h-9 w-full bg-transparent text-lg font-semibold placeholder:font-normal placeholder:text-muted/70 focus-visible:outline-none"
          />
        </div>
        <button
          type="submit"
          aria-label="Cari desa"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-white"
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>
      </form>

      <div id="cari-status" aria-live="polite" className="px-3 pb-2 pt-2">
        {kurang ? (
          <p className="text-sm text-muted">Ketik minimal 2 huruf nama desa, kecamatan, atau kabupaten.</p>
        ) : !terkini ? (
          <div role="status" aria-label="Mencari desa" className="space-y-2">
            <SkeletonBlock className="h-14 w-full" />
            <SkeletonBlock className="h-14 w-full" />
          </div>
        ) : "galat" in terkini ? (
          <div role="alert" className="rounded-card border border-danger/40 bg-paper px-4 py-4">
            <p className="font-semibold text-danger">Pencarian gagal. Periksa sinyal, lalu coba lagi.</p>
            <button
              type="button"
              onClick={() => {
                setHasil(null);
                setUlang((n) => n + 1);
              }}
              className="mt-2 min-h-11 rounded-card border border-line bg-surface px-4 font-semibold"
            >
              Coba lagi
            </button>
          </div>
        ) : terkini.hits.length === 0 ? (
          <p className="rounded-card border border-dashed border-line bg-paper px-4 py-4">
            Desa tidak ditemukan. Cakupan saat ini Kalimantan Barat dan Kalimantan Tengah.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted">{terkini.hits.length} desa ditemukan.</p>
            <ul className="mt-2 space-y-3">
              {terkini.hits.map((d) => (
                <li key={d.kode}>
                  <KartuHasilDesa d={d} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
