"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HasilCari } from "@/components/paparan/KartuHasilDesa";
import { cariDesaContoh } from "@/mocks/pencarian";

type Hasil = { untuk: string; hits: HasilCari[] } | { untuk: string; galat: true };

/**
 * Kotak cari desa di sidebar akun (pola "Find a part" Sparekit). Hasil menuju Kartu Paparan publik desa itu,
 * jadi akun MPA bisa melihat paparan desa mana pun tanpa membuka data desa lain.
 * Mulai setelah 2 huruf, jeda 250 ms, paling banyak 6 hasil. Ctrl+K atau / memfokuskan kotak.
 * SEMENTARA: memakai pencarian tiruan, sama dengan SearchBox di Beranda; ganti dengan GET /api/desa?q=.
 */
export function CariDesaSidebar() {
  const [q, setQ] = useState("");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const kata = q.trim();
  const kurang = kata.length < 2;

  useEffect(() => {
    if (kurang) return;
    let batal = false;
    const t = setTimeout(() => {
      cariDesaContoh(kata)
        .then((hits) => !batal && setHasil({ untuk: kata, hits }))
        .catch(() => !batal && setHasil({ untuk: kata, galat: true }));
    }, 250);
    return () => {
      batal = true;
      clearTimeout(t);
    };
  }, [kata, kurang]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const ketik = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !ketik)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const terkini = hasil && hasil.untuk === kata ? hasil : null;

  return (
    <div role="search" className="px-1">
      <label htmlFor="cari-desa-sidebar" className="sr-only">
        Cari desa
      </label>
      <div className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3 focus-within:border-ink">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          ref={input}
          id="cari-desa-sidebar"
          type="search"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHasil(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQ("");
          }}
          placeholder="Cari desa"
          aria-describedby="cari-desa-sidebar-status"
          className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted focus-visible:outline-none"
        />
        <kbd aria-hidden="true" className="hidden shrink-0 rounded-md border border-line px-1.5 text-sm text-muted lg:inline">
          Ctrl K
        </kbd>
      </div>

      <div id="cari-desa-sidebar-status" aria-live="polite">
        {kurang ? null : !terkini ? (
          <p role="status" className="px-2 pt-2 text-sm text-muted">
            Mencari…
          </p>
        ) : "galat" in terkini ? (
          <p role="alert" className="px-2 pt-2 text-sm text-danger">
            Pencarian gagal. Periksa sinyal, lalu coba lagi.
          </p>
        ) : terkini.hits.length === 0 ? (
          <p className="px-2 pt-2 text-sm text-muted">Desa tidak ditemukan.</p>
        ) : (
          <ul className="mt-1.5 space-y-0.5 rounded-xl border border-line bg-surface p-1">
            {terkini.hits.slice(0, 6).map((d) => (
              <li key={d.kode}>
                <Link href={`/desa/${d.kode}`} className="block min-h-11 rounded-lg px-2.5 py-1.5 hover:bg-paper">
                  <span className="block truncate text-sm font-semibold">{d.nama}</span>
                  <span className="block truncate text-sm text-muted">
                    {d.kecNama}, {d.provNama}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
