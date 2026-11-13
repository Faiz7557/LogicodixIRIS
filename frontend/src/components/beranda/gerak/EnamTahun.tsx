"use client";

import { useEffect, useRef, useState } from "react";
import { formatAngka } from "@/lib/format";
import { kisahJangkar } from "@/lib/kalimat";
import type { DesaTahun } from "@/lib/types";

/*
 * Puncak beranda: kisah Desa Kalibandung, Kubu Raya (Mongabay 31 Agu 2026), disandingkan dengan deteksi satelit
 * desa itu sendiri (plan 11 Task 5). Warga menyebut enam tahun tanpa kebakaran; satelit mencatat deteksi kecil
 * di sebagian besar tahun itu. Keduanya ditampilkan, tidak disamakan.
 * Panel disematkan dan scroll menjadi penggulir waktu: tiap tahun 2020-2025 lewat dengan angka deteksinya,
 * lalu 2026 menyala. Tinggi batang = jumlah deteksi satelit (skala linear, angkanya tertulis).
 * Tanpa JS atau saat gerak dikurangi: tidak disematkan, langsung menampilkan keadaan akhir.
 */
export function EnamTahun({ riwayat }: { riwayat: DesaTahun[] }) {
  const tahun = riwayat.map((r) => r.tahun);
  const luar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Bawaan = keadaan akhir (server, tanpa JS, gerak dikurangi)
  const [indeks, setIndeks] = useState(tahun.length + 1);
  const [gerak, setGerak] = useState(false);

  useEffect(() => {
    const el = luar.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id = 0;
    let lama = -1;
    const hitung = () => {
      id = 0;
      const r = el.getBoundingClientRect();
      const jarak = r.height - window.innerHeight;
      const p = Math.min(Math.max(-r.top / Math.max(jarak, 1), 0), 1);
      panel.current?.style.setProperty("--p", p.toFixed(4));
      // 0..0.08 pembuka, 0.08..0.68 enam tahun 2020-2025, 0.72 tahun 2026, 0.86 kisah lengkap
      const i = p < 0.08 ? 0 : p < 0.72 ? 1 + Math.min(Math.floor(((p - 0.08) / 0.6) * 6), 5) : p < 0.86 ? 7 : 8;
      const api = Math.min(Math.max((p - 0.68) / 0.1, 0), 1);
      panel.current?.style.setProperty("--api", api.toFixed(4));
      if (i !== lama) {
        lama = i;
        setIndeks(i);
      }
    };
    const minta = () => {
      if (!id) id = requestAnimationFrame(hitung);
    };
    setGerak(true);
    hitung();
    window.addEventListener("scroll", minta, { passive: true });
    window.addEventListener("resize", minta);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", minta);
      window.removeEventListener("resize", minta);
    };
  }, []);

  const { maksSebelum, nDet2026 } = kisahJangkar(riwayat);
  const maks = Math.max(...riwayat.map((r) => r.nDet), 1);
  const terakhir = riwayat.length - 1; // indeks 2026
  const lewatHingga = Math.min(Math.max(indeks, 0), riwayat.length); // jumlah tahun yang sudah tampil
  const menyala = indeks >= riwayat.length;
  const lengkap = indeks > riwayat.length;
  const kini = riwayat[Math.max(Math.min(indeks, riwayat.length) - 1, 0)];

  const kalimatTahun = (r: DesaTahun) =>
    r.nDet === 0 ? `${r.tahun}: tidak ada deteksi satelit.` : `${r.tahun}: ${formatAngka(r.nDet)} deteksi satelit di sekitar desa.`;

  return (
    <section ref={luar} aria-labelledby="enam-tahun" className={`relative ${gerak ? "h-[340vh]" : ""}`}>
      <div
        ref={panel}
        className={`${gerak ? "sticky top-0 h-[100svh]" : "py-16"} flex items-center overflow-hidden transition-colors duration-700`}
        style={{
          background: gerak ? "color-mix(in oklab, var(--paper), #1d130e calc(var(--api, 0) * 100%))" : "#1d130e",
          color: gerak ? undefined : "#fff",
        }}
      >
        {/* Bara naik saat 2026 menyala */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ opacity: gerak ? "var(--api, 0)" : 1 }}>
          {Array.from({ length: 34 }, (_, i) => (
            <span
              key={i}
              className="bara-naik absolute bottom-[-10px] block rounded-full"
              style={{
                left: `${(i * 37) % 100}%`,
                width: 3 + (i % 4),
                height: 3 + (i % 4),
                background: i % 3 ? "#f08a3c" : "#ffb070",
                animationDelay: `${(i * 0.37) % 5}s`,
                animationDuration: `${4 + (i % 5)}s`,
              }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#b4431a]/40 to-transparent" />
        </div>

        <div
          className="relative mx-auto grid w-full max-w-[1040px] gap-10 px-4 md:grid-cols-[1.1fr_1fr] md:items-center"
          style={gerak ? { color: "color-mix(in oklab, var(--ink), #fff calc(var(--api, 0) * 100%))" } : undefined}
        >
          <div>
            <p className="text-sm font-bold" style={{ color: menyala || !gerak ? "#f39a5c" : "var(--ember)" }}>
              Desa Kalibandung, Kubu Raya
            </p>
            <h2 id="enam-tahun" className="mt-1 text-balance text-xl font-semibold leading-snug">
              Enam tahun menurut warga, tujuh tahun menurut satelit
            </h2>
            <p aria-hidden="true" className="tabular mt-2 text-[clamp(5rem,16vw,11rem)] font-semibold leading-none tracking-[-0.05em]">
              <span key={kini.tahun} className="ganti-tahun inline-block">
                {kini.tahun}
              </span>
            </p>
            <div aria-live="polite" className="mt-4 min-h-[7.5rem] max-w-[34ch] text-xl font-semibold leading-snug">
              {indeks === 0 ? (
                <p className="ganti-tahun">Menurut warga, musim kering datang dan pergi tanpa kebakaran.</p>
              ) : !menyala ? (
                <p key={kini.tahun} className="ganti-tahun">
                  {kalimatTahun(kini)} <span className="opacity-60">Menurut warga: tahun tenang.</span>
                </p>
              ) : !lengkap ? (
                <p className="ganti-tahun">{kalimatTahun(riwayat[terakhir])} Lalu api datang.</p>
              ) : (
                <div className="ganti-tahun">
                  <p>Selang hanya 100 m. Warga patungan membeli BBM.</p>
                  <p className="mt-3 text-[#f39a5c]">Enam tahun tanpa api bukan berarti aman.</p>
                </div>
              )}
            </div>
          </div>

          {/* Batang per tahun: tinggi = jumlah deteksi satelit */}
          <div>
            <ol aria-label="Deteksi satelit per tahun, 2020 sampai 2026" className="grid grid-cols-7 gap-1.5">
              {riwayat.map((r, i) => {
                const lewat = i < lewatHingga;
                const api = i === terakhir;
                // Linear terhadap tahun terbanyak; deteksi kecil tetap terlihat setipis garis.
                const tinggi = r.nDet === 0 ? 0 : Math.max((r.nDet / maks) * 100, 3);
                return (
                  <li key={r.tahun} className="flex flex-col items-center gap-2">
                    <span className={`tabular text-sm ${lewat ? "opacity-100" : "opacity-0"} ${api ? "font-bold text-[#f39a5c]" : ""} transition-opacity duration-500`}>
                      {formatAngka(r.nDet)}
                    </span>
                    <span
                      className={`relative block h-28 w-full overflow-hidden rounded-xl border transition-[border-color] duration-500 ${
                        lewat ? (api ? "border-[#f08a3c]" : "border-current/25") : "border-current/15"
                      }`}
                    >
                      <span
                        className={`absolute inset-x-0 bottom-0 block origin-bottom transition-transform duration-700 [transition-timing-function:var(--pegas)] ${
                          api ? "bg-[#b4431a]" : "bg-current/40"
                        }`}
                        style={{ height: `${tinggi}%`, transform: `scaleY(${lewat ? 1 : 0})` }}
                      />
                      {api && lewat ? <span className="absolute inset-0 animate-pulse bg-gradient-to-t from-[#ffb070]/60 to-transparent" /> : null}
                    </span>
                    <span className={`tabular text-sm ${api && lewat ? "font-bold text-[#f39a5c]" : "opacity-70"}`}>
                      {r.tahun}
                      <span className="sr-only">: {r.nDet === 0 ? "tidak ada deteksi satelit" : `${formatAngka(r.nDet)} deteksi satelit`}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm opacity-80">
              Menurut warga, enam tahun tanpa kebakaran (Mongabay, 31 Agu 2026). Satelit mencatat paling banyak {formatAngka(maksSebelum)} deteksi
              setahun di sekitar desa pada 2020–2025, lalu {formatAngka(nDet2026)} pada 2026. Deteksi satelit bukan luas terbakar.
            </p>
            <p className="mt-2 text-sm opacity-70">Satu kasus, bukan gambaran semua desa.</p>
            {gerak ? (
              <span aria-hidden="true" className="mt-5 block h-1 overflow-hidden rounded-full bg-current/10">
                <span className="block h-full origin-left rounded-full bg-current/50" style={{ transform: "scaleX(var(--p, 0))" }} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
