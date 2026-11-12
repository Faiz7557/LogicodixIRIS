"use client";

import { useEffect, useState } from "react";
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
  const [tertutup, setTertutup] = useState(false);
  const [jauh, setJauh] = useState(false);
  const kata = q.trim();
  const kurang = kata.length < 2;

  useEffect(() => {
    if (kurang) return;
    let batal = false;
    const t = setTimeout(() => {
      // Hasil baru membuka laci lagi (posisi gulir saat ini jadi titik awalnya).
      const terima = (h: Hasil) => {
        if (batal) return;
        setHasil(h);
        setJauh(false);
      };
      api<{ hasil: DesaHit[] }>(`/api/desa?q=${encodeURIComponent(kata)}`)
        .then(({ hasil }) => terima({ untuk: kata, hits: hasil }))
        .catch(() => terima({ untuk: kata, galat: true }));
    }, 250);
    return () => {
      batal = true;
      clearTimeout(t);
    };
  }, [kata, kurang, ulang]);

  // Hasil lama untuk kata lain tidak ditampilkan: dianggap masih memuat.
  const terkini = hasil && hasil.untuk === kata ? hasil : null;
  const adaHasil = terkini !== null;
  const terbuka = adaHasil && !tertutup && !jauh;

  // Panel hasil seperti laci: menutup saat halaman digulir ke bawah (hero memudar saat keluar), membuka lagi
  // saat digulir kembali ke atas. Hasilnya tidak dihapus. Escape menutup sampai kotak cari difokuskan lagi.
  // Digulir di dalam panel tidak dihitung: peristiwa scroll elemen tidak sampai ke window.
  useEffect(() => {
    if (!adaHasil) return;
    const awal = window.scrollY;
    const onScroll = () => setJauh(window.scrollY > awal + 48);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTertutup(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [adaHasil]);

  return (
    <div className="relative rounded-2xl border border-line bg-surface p-2 shadow-xl">
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
            Cari desa, kecamatan, atau kabupaten di Kalimantan
          </label>
          <input
            id="cari-desa"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setHasil(null);
              setTertutup(false);
            }}
            onFocus={() => setTertutup(false)}
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

      {/* Satu baris status, tinggi tetap: hero tidak memanjang, jadi latar 3D tidak berubah bingkai. */}
      <div id="cari-status" aria-live="polite" className="px-3 pb-2 pt-2 text-sm text-muted">
        {kurang ? (
          "Khusus Kalimantan Barat dan Kalimantan Tengah. Ketik minimal 2 huruf."
        ) : !terkini ? (
          <span role="status">Mencari desa…</span>
        ) : "galat" in terkini ? (
          "Pencarian gagal."
        ) : terkini.hits.length === 0 ? (
          "Desa tidak ditemukan."
        ) : (
          `${terkini.hits.length} desa ditemukan.`
        )}
      </div>

      {/* Hasil mengambang di bawah kartu, bisa digulir, tidak mendorong isi halaman. */}
      {terkini ? (
        <div
          aria-hidden={!terbuka}
          className={`absolute inset-x-0 top-full z-30 mt-2 max-h-[min(30rem,60svh)] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-2 shadow-xl transition-[opacity,transform,visibility] duration-200 ${
            terbuka ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
          }`}
        >
          {"galat" in terkini ? (
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
            <ul className="space-y-3">
              {terkini.hits.map((d) => (
                <li key={d.kode}>
                  <KartuHasilDesa d={d} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
