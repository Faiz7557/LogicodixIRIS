"use client";

import { useEffect, useState } from "react";
import { gerakDikurangi } from "./dasar";

export type Wawasan = { angka: string; judul: string; isi: string };

const JEDA = 7000;

/**
 * Kartu wawasan bergradasi (pola kartu Insights). Beberapa temuan bergantian tiap 7 detik.
 * Bilah kemajuan berhenti di tempat saat dijeda dan melanjutkan dari posisi yang sama.
 * Berhenti saat disorot atau difokus, dan tidak berputar sendiri bila pengguna memilih gerak dikurangi.
 * Segmen di bawah adalah tombol: menunjukkan posisi dan bisa dipilih langsung.
 */
export function KartuWawasan({ daftar }: { daftar: Wawasan[] }) {
  const [i, setI] = useState(0);
  const [jeda, setJeda] = useState(false);
  const [diam, setDiam] = useState(true);

  // Putar otomatis hanya di browser dan bila gerak tidak dikurangi.
  useEffect(() => {
    const id = requestAnimationFrame(() => setDiam(gerakDikurangi()));
    return () => cancelAnimationFrame(id);
  }, []);

  // Pergantian dipicu oleh selesainya animasi bilah kemajuan, jadi jeda dan bilah selalu sejalan.
  const lanjut = () => setI((x) => (x + 1) % daftar.length);
  const mundur = () => setI((x) => (x - 1 + daftar.length) % daftar.length);

  const w = daftar[i];

  return (
    <section
      aria-labelledby="wawasan"
      aria-roledescription="karusel"
      onPointerEnter={() => setJeda(true)}
      onPointerLeave={() => setJeda(false)}
      onFocus={() => setJeda(true)}
      onBlur={() => setJeda(false)}
      onKeyDown={(e) => {
        if (daftar.length < 2) return;
        if (e.key === "ArrowLeft") mundur();
        else if (e.key === "ArrowRight") lanjut();
      }}
      className="masuk relative flex h-full min-h-64 flex-col overflow-hidden rounded-panel p-5 text-white shadow-card"
      style={{
        animationDelay: "240ms",
        background:
          "radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--ember) 85%, #f6c28b) 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, #1d3a5f 0%, transparent 60%), linear-gradient(160deg, #b8532a 0%, #6b3a3a 45%, #1f2a44 100%)",
      }}
    >
      {/* Kilau lembut di pojok, hiasan. */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-40 rotate-12 rounded-[2.5rem] border border-white/25 bg-white/10" />
      <h2 id="wawasan" className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />
        </svg>
        Wawasan
      </h2>

      <div aria-live={jeda || diam ? "polite" : "off"} className="relative mt-auto pt-6">
        <div key={i} className="masuk">
          <p className="tabular text-5xl font-semibold leading-none tracking-[-0.03em]">{w.angka}</p>
          <p className="mt-3 text-lg font-semibold leading-snug">{w.judul}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/80">{w.isi}</p>
        </div>
      </div>

      {daftar.length > 1 ? (
        <div className="relative mt-5 flex items-center gap-1.5">
          <TombolGeser arah="kiri" onClick={mundur} label="Wawasan sebelumnya" />
          {daftar.map((d, j) => (
            <button
              key={d.judul}
              type="button"
              aria-label={`Wawasan ${j + 1} dari ${daftar.length}`}
              aria-current={j === i ? "true" : undefined}
              onClick={() => setI(j)}
              className="group flex h-6 flex-1 items-center"
            >
              <span className="block h-1 w-full overflow-hidden rounded-full bg-white/25 group-hover:bg-white/40">
                {j === i ? (
                  diam ? (
                    <span className="block h-full w-full rounded-full bg-white" />
                  ) : (
                    <span
                      key={i}
                      onAnimationEnd={lanjut}
                      className="isi-maju block h-full rounded-full bg-white"
                      style={{ animationDuration: `${JEDA}ms`, animationPlayState: jeda ? "paused" : "running" }}
                    />
                  )
                ) : j < i ? (
                  <span className="block h-full w-full rounded-full bg-white/70" />
                ) : null}
              </span>
            </button>
          ))}
          <TombolGeser arah="kanan" onClick={lanjut} label="Wawasan berikutnya" />
        </div>
      ) : null}
    </section>
  );
}

/** Tombol bulat ‹ › untuk berpindah wawasan; berputar dari ujung ke ujung. */
function TombolGeser({ arah, onClick, label }: { arah: "kiri" | "kanan"; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="tekan flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-white"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={arah === "kiri" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
