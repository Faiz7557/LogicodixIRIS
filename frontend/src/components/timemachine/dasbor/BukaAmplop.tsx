"use client";

import Link from "next/link";
import { useState } from "react";
import { KepalaKartu, kelasKartu, useAngkaNaik } from "@/components/paparan/dasbor/dasar";
import { formatAngka, formatSkor } from "@/lib/format";
import type { Backtest } from "@/server/queries";

const JEDA = 70;

/**
 * "Buka 2026": satu-satunya momen dramatis Time Machine. 20 desa teratas peringkat beku tampil sebagai
 * kartu berembun (hasil tersembunyi). Tombol membuka kartu satu per satu: embun menipis dan kartu
 * "mewujud" (blur + skala, bukan sekadar pudar). Penghitung naik bersamaan dan dibandingkan dengan
 * yang diharapkan bila desa dipilih acak. Gerak dikurangi: langsung terbuka tanpa jeda.
 */
export function BukaAmplop({ teratas, lajuDasar, tahunUji = 2026 }: { teratas: Backtest["teratas"]; lajuDasar: number | null; tahunUji?: number }) {
  const [buka, setBuka] = useState(false);
  const kena = teratas.filter((d) => d.terpapar2026).length;
  const hitung = useAngkaNaik(buka ? kena : 0, Math.min(teratas.length * JEDA + 300, 1700));
  const harapanAcak = lajuDasar === null ? null : lajuDasar * teratas.length;

  return (
    <section aria-labelledby="amplop" className={kelasKartu} style={{ animationDelay: "180ms" }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <KepalaKartu
          id="amplop"
          judul={`Peragaan: ${teratas.length} desa yang kami tebak paling rawan`}
          keterangan={`Daftar ini disusun dari data sampai 31 Desember ${tahunUji - 1}. Tekan "Buka ${tahunUji}" untuk melihat berapa yang benar-benar terdeteksi api.`}
        />
        <div className="flex items-center gap-4">
          <p aria-live="polite" className="text-right">
            <span className="tabular block text-3xl font-semibold leading-none tracking-[-0.03em]">
              {buka ? formatAngka(Math.round(hitung)) : "?"}
              <span className="text-lg text-muted"> / {teratas.length}</span>
            </span>
            <span className="text-xs text-muted">
              {buka ? `terdeteksi api pada ${tahunUji}` : "hasil masih tertutup"}
              {buka && harapanAcak !== null ? ` · kalau menebak asal, sekitar ${formatAngka(harapanAcak, 1)}` : ""}
            </span>
          </p>
          <button
            type="button"
            aria-pressed={buka}
            onClick={() => setBuka((x) => !x)}
            className={`tekan inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold transition-colors duration-300 ${
              buka ? "border border-line bg-surface text-ink" : "bg-ember text-white shadow-card"
            }`}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {buka ? <path d="M4 10l8 6 8-6M4 10v9h16v-9M4 10l8-6 8 6" /> : <path d="M4 7h16v12H4zM4 7l8 6 8-6" />}
            </svg>
            {buka ? "Tutup lagi" : `Buka ${tahunUji}`}
          </button>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {teratas.map((d, i) => {
          const jeda = `${buka ? i * JEDA : (teratas.length - 1 - i) * 25}ms`;
          return (
            <li key={d.kode} className="relative">
              <Link
                href={`/desa/${d.kode}`}
                className={`group relative flex h-full min-h-[5.5rem] flex-col justify-between overflow-hidden rounded-xl border p-3 transition-[background-color,border-color] duration-500 hover:shadow-card ${
                  buka && d.terpapar2026 ? "border-ember/50 bg-ember-soft" : "border-line bg-surface"
                }`}
                style={{ transitionDelay: jeda }}
              >
                <span className="flex items-start gap-2">
                  <span className="tabular text-xs font-semibold text-muted">#{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{d.nama}</span>
                    <span className="block truncate text-xs text-muted">
                      {d.kecNama} · skor {formatSkor(d.skor * 100)}
                    </span>
                  </span>
                </span>
                <span
                  className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold transition-[opacity,transform,filter] duration-500 [transition-timing-function:var(--pegas)] ${
                    buka ? "opacity-100 blur-0" : "translate-y-1 opacity-0 blur-sm"
                  } ${d.terpapar2026 ? "text-ember" : "text-muted"}`}
                  style={{ transitionDelay: jeda }}
                >
                  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    {d.terpapar2026 ? <circle cx="12" cy="12" r="5" fill="currentColor" /> : null}
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                  {buka ? (d.terpapar2026 ? "Ada api" : "Tidak ada api") : "Tertutup"}
                </span>
                {/* Lapisan embun: menutupi hasil sampai dibuka. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-surface-2 via-surface-2/90 to-transparent backdrop-blur-[2px] transition-[opacity,transform] duration-500 [transition-timing-function:var(--pegas)] ${
                    buka ? "translate-y-3 opacity-0" : "opacity-100"
                  }`}
                  style={{ transitionDelay: jeda }}
                >
                  <span className="absolute bottom-2 left-3 flex gap-1">
                    {[0, 1, 2].map((k) => (
                      <span key={k} className="size-1.5 rounded-full bg-faint/60" />
                    ))}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        {buka
          ? teratas.map((d, i) => `${i + 1}. ${d.nama}: ${d.terpapar2026 ? "terdeteksi" : "tidak terdeteksi"}`).join(". ")
          : `Hasil ${tahunUji} masih tertutup. Tekan Buka ${tahunUji}.`}
      </p>
    </section>
  );
}
