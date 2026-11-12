"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Puncak beranda: "Enam tahun tanpa api" (kisah Desa Kalibandung, Kubu Raya; Mongabay 31 Agu 2026,
 * sama dengan teks di bagian Kenapa). Panel disematkan dan scroll menjadi penggulir waktu:
 * 2020 sampai 2025 berlalu tenang, penghitung naik, lalu 2026 menyala, panel menghangat dan bara naik.
 * Tanpa JS atau saat gerak dikurangi: tidak disematkan, langsung menampilkan keadaan akhir.
 */
const TAHUN = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export function EnamTahun() {
  const luar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Bawaan = keadaan akhir (server, tanpa JS, gerak dikurangi)
  const [indeks, setIndeks] = useState(TAHUN.length);
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
      // 0..0.08 pembuka, 0.08..0.68 enam tahun tenang, 0.72 api 2026, 0.86 kisah lengkap
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

  const tenang = Math.min(Math.max(indeks, 0), 6); // tahun tanpa api yang sudah lewat
  const menyala = indeks >= 7;
  const lengkap = indeks >= 8;
  const tahunTampil = TAHUN[Math.max(Math.min(indeks, 7) - 1, 0)];

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
        {/* Bara naik saat api menyala */}
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
            <h2 id="enam-tahun" className="sr-only">
              Enam tahun tanpa api, lalu 2026
            </h2>
            <p aria-hidden="true" className="tabular mt-2 text-[clamp(5rem,16vw,11rem)] font-semibold leading-none tracking-[-0.05em]">
              <span key={tahunTampil} className="ganti-tahun inline-block">
                {tahunTampil}
              </span>
            </p>
            <div aria-live="polite" className="mt-4 min-h-[7.5rem] max-w-[34ch] text-xl font-semibold leading-snug">
              {indeks === 0 ? (
                <p className="ganti-tahun">Musim kering datang dan pergi. Tidak ada api.</p>
              ) : !menyala ? (
                <p key={tenang} className="ganti-tahun">
                  {tenang} tahun tanpa api.{" "}
                  <span className="opacity-60">{tenang >= 6 ? "Pos karhutla tidak lagi dianggarkan." : "Tidak ada asap, tidak ada rapat."}</span>
                </p>
              ) : !lengkap ? (
                <p className="ganti-tahun">Lalu 2026 datang. Api kembali.</p>
              ) : (
                <div className="ganti-tahun">
                  <p>Selang hanya 100 m. Warga patungan membeli BBM.</p>
                  <p className="mt-3 text-[#f39a5c]">Enam tahun tanpa api bukan berarti aman.</p>
                </div>
              )}
            </div>
          </div>

          {/* Garis waktu: enam tahun tenang lalu 2026 */}
          <div>
            <ol aria-label="Garis waktu 2020 sampai 2026" className="grid grid-cols-7 gap-1.5">
              {TAHUN.map((t, i) => {
                const lewat = i < tenang || (i === 6 && menyala);
                const api = i === 6;
                return (
                  <li key={t} className="flex flex-col items-center gap-2">
                    <span
                      className={`relative block h-28 w-full overflow-hidden rounded-xl border transition-[background-color,border-color,transform] duration-500 [transition-timing-function:var(--pegas)] ${
                        lewat ? (api ? "scale-y-110 border-[#f08a3c] bg-[#b4431a]" : "border-current/20 bg-current/10") : "border-current/15 bg-transparent"
                      }`}
                    >
                      {api && lewat ? <span className="absolute inset-0 animate-pulse bg-gradient-to-t from-[#ffb070]/70 to-transparent" /> : null}
                      {!api && lewat ? <span className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-current/30" /> : null}
                    </span>
                    <span className={`tabular text-xs ${api && lewat ? "font-bold text-[#f39a5c]" : "opacity-70"}`}>
                      {t}
                      <span className="sr-only">{api ? ": api datang" : ": tanpa api"}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-sm opacity-70">
              Satu kasus, bukan gambaran semua desa. Sumber: Mongabay, 31 Agu 2026.
            </p>
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
