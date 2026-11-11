"use client";

import { useState } from "react";
import { KepalaKartu, kelasKartu } from "@/components/paparan/dasbor/dasar";
import { formatAngka } from "@/lib/format";
import type { KeputusanGerbang } from "@/lib/types";
import type { Backtest } from "@/server/queries";

type Kunci = "tampak_aman" | "aktif" | "tanpa_riwayat_ekstrem";

const KOHORT: { kunci: Kunci; label: string; ket: string }[] = [
  { kunci: "tampak_aman", label: "Tampak aman", ket: "Pernah terdeteksi saat kering ekstrem, lalu tenang" },
  { kunci: "aktif", label: "Aktif", ket: "Masih terdeteksi beberapa tahun terakhir" },
  { kunci: "tanpa_riwayat_ekstrem", label: "Tanpa riwayat ekstrem", ket: "Tidak pernah terdeteksi saat kering ekstrem" },
];

const KEPUTUSAN: Record<KeputusanGerbang, { label: string; kelas: string; isi: string }> = {
  pertahankan: { label: "Pertahankan klaim", kelas: "bg-ok-soft text-ok", isi: "Label Tampak aman tetap ditampilkan apa adanya." },
  lunakkan: { label: "Lunakkan klaim", kelas: "bg-warn-soft text-warn", isi: "Label Tampak aman tetap tampil, dengan kalimat yang lebih hati-hati." },
  buang: { label: "Buang klaim", kelas: "bg-danger-soft text-danger", isi: "Label Tampak aman disembunyikan dari Bukti satelit." },
};

/**
 * Tiga kelompok desa per 31 Desember 2025 sebagai grafik wafel: satu titik = satu desa,
 * titik penuh = terdeteksi 2026. Menyorot satu kelompok meredupkan yang lain.
 */
export function KartuKohort({ grup }: { grup: Backtest["grup"] }) {
  const [sorot, setSorot] = useState<Kunci | null>(null);
  const ambil = (k: Kunci) => grup.find((g) => g.strata === "semua" && g.grup === k);

  return (
    <section aria-labelledby="kohort" className={kelasKartu} style={{ animationDelay: "220ms" }}>
      <KepalaKartu id="kohort" judul="Apakah desa yang tampak aman benar-benar aman?" keterangan="Laju terdeteksi 2026 menurut keadaan desa per 31 Desember 2025. Satu titik = satu desa." />
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {KOHORT.map((k, ki) => {
          const g = ambil(k.kunci);
          const redup = sorot !== null && sorot !== k.kunci;
          return (
            <li
              key={k.kunci}
              onPointerEnter={() => setSorot(k.kunci)}
              onPointerLeave={() => setSorot(null)}
              className={`rounded-xl border p-3.5 transition-[opacity,border-color] duration-300 ${redup ? "opacity-45" : ""} ${
                k.kunci === "tampak_aman" ? "border-warn/50 bg-warn-soft/40" : "border-line bg-surface-2/60"
              }`}
            >
              <p className="text-sm font-semibold">{k.label}</p>
              <p className="text-xs text-muted">{k.ket}</p>
              <p className="tabular mt-2 text-3xl font-semibold tracking-[-0.03em]">{g ? `${Math.round(g.rate * 100)}%` : "–"}</p>
              {g ? (
                <>
                  <div aria-hidden="true" className="mt-2 flex flex-wrap gap-1">
                    {Array.from({ length: g.nDesa }, (_, i) => (
                      <span
                        key={i}
                        className={`masuk size-3 rounded-full ${i < g.nTerpapar2026 ? "bg-ember" : "bg-surface ring-1 ring-inset ring-line-2"}`}
                        style={{ animationDelay: `${300 + ki * 120 + i * 18}ms` }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {formatAngka(g.nTerpapar2026)} dari {formatAngka(g.nDesa)} desa terdeteksi
                  </p>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted">Data kelompok belum tersedia.</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Gerbang data: dua uji dengan ambang yang dicatat sebelum 2026 dibuka. Tiap uji berupa bilah nilai
 * dengan garis ambang, plus lencana lulus/tidak lulus (ikon + kata). Lalu keputusan klaim.
 */
export function KartuGerbang({ grup, gerbang }: { grup: Backtest["grup"]; gerbang: Backtest["gerbang"] }) {
  const ambil = (k: Kunci) => grup.find((g) => g.strata === "semua" && g.grup === k);
  const tampak = ambil("tampak_aman");
  const aktif = ambil("aktif");
  const tanpa = ambil("tanpa_riwayat_ekstrem");
  const rasioA = tampak && tanpa && tanpa.rate > 0 ? tampak.rate / tanpa.rate : null;
  const rasioB = tampak && aktif && aktif.rate > 0 ? tampak.rate / aktif.rate : null;
  const k = KEPUTUSAN[gerbang.keputusan];

  const uji = [
    {
      judul: "Uji A · riwayat memberi sinyal",
      rumus: "tampak aman ÷ tanpa riwayat",
      nilai: rasioA,
      ambang: 1.5,
      skala: 3,
      syarat: `minimal 1,5 dan 30 desa (sekarang ${formatAngka(tampak?.nDesa ?? 0)})`,
      lulus: gerbang.a,
    },
    { judul: "Uji B · tenang bukan berarti aman", rumus: "tampak aman ÷ aktif", nilai: rasioB, ambang: 0.6, skala: 1.5, syarat: "minimal 0,6", lulus: gerbang.b },
  ];

  return (
    <section aria-labelledby="gerbang" className={`${kelasKartu} flex flex-col`} style={{ animationDelay: "260ms" }}>
      <KepalaKartu id="gerbang" judul="Gerbang data" keterangan="Ambang ditetapkan sebelum data 2026 dibuka." />
      <ul className="mt-4 space-y-4">
        {uji.map((u) => (
          <li key={u.judul}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold">{u.judul}</p>
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${u.lulus ? "bg-ok-soft text-ok" : "bg-danger-soft text-danger"}`}>
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d={u.lulus ? "M5 12l5 5 9-10" : "M7 7l10 10M17 7 7 17"} />
                </svg>
                {u.lulus ? "Lulus" : "Tidak lulus"}
              </span>
            </div>
            <div aria-hidden="true" className="relative mt-5 h-2.5 rounded-full bg-surface-2">
              <span
                className={`isi-maju absolute inset-y-0 left-0 rounded-full ${u.lulus ? "arsir-ok" : "arsir-ember"}`}
                style={{ width: `${Math.min((u.nilai ?? 0) / u.skala, 1) * 100}%`, animationDuration: "900ms", animationDelay: "400ms", animationTimingFunction: "var(--pegas)" }}
              />
              <span className="absolute -inset-y-1.5 w-0.5 rounded-full bg-ink" style={{ left: `${(u.ambang / u.skala) * 100}%` }}>
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold">ambang {String(u.ambang).replace(".", ",")}</span>
              </span>
            </div>
            <p className="mt-1.5 text-xs text-muted">
              {u.rumus} ={" "}
              <span className="tabular font-semibold text-ink">{u.nilai === null ? "–" : u.nilai.toFixed(2).replace(".", ",")}</span> · syarat {u.syarat}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-4">
        <div className="rounded-xl bg-surface-2 p-3">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${k.kelas}`}>Keputusan: {k.label}</span>
          <p className="mt-1.5 text-sm">{k.isi}</p>
          <p className="mt-1 text-xs text-muted">Gagal tidak menghentikan produk, tetapi mengubah klaim.</p>
        </div>
      </div>
    </section>
  );
}
