"use client";

import Link from "next/link";
import { useState } from "react";
import { kesimpulanBacktest } from "@/lib/backtest";
import { formatAngka, formatSkor } from "@/lib/format";
import type { KeputusanGerbang } from "@/lib/types";
import type { Backtest } from "@/server/queries";
import { MetricTable } from "./MetricTable";

type GrupKunci = "tampak_aman" | "aktif" | "tanpa_riwayat_ekstrem";

const LABEL_GRUP: Record<GrupKunci, string> = {
  tampak_aman: "Tampak aman",
  aktif: "Aktif",
  tanpa_riwayat_ekstrem: "Tanpa riwayat ekstrem",
};

const LABEL_KEPUTUSAN: Record<KeputusanGerbang, string> = {
  pertahankan: "Pertahankan klaim",
  lunakkan: "Lunakkan klaim",
  buang: "Buang klaim",
};

/**
 * Time Machine (App Flow v2 §3.3). Menampilkan hasil apa adanya, termasuk saat peringkat paparan kalah.
 * "Buka 2026" adalah satu-satunya momen dramatis: deteksi nyata 2026 muncul bertahap, maksimal 800 ms.
 */
export function TimeMachineView({ data }: { data: Backtest }) {
  const tahunUji = [...new Set(data.metrik.map((m) => m.tahunUji))].sort((a, b) => a - b);
  const [tahun, setTahun] = useState<number>(() => (tahunUji.includes(2026) ? 2026 : (tahunUji[tahunUji.length - 1] ?? 2026)));
  const [terbuka, setTerbuka] = useState(false);

  const grup = (kunci: GrupKunci) => data.grup.find((g) => g.strata === "semua" && g.grup === kunci);
  const tampak = grup("tampak_aman");
  const aktif = grup("aktif");
  const tanpa = grup("tanpa_riwayat_ekstrem");
  const rasioA = tampak && tanpa && tanpa.rate > 0 ? tampak.rate / tanpa.rate : null;
  const rasioB = tampak && aktif && aktif.rate > 0 ? tampak.rate / aktif.rate : null;
  const adaMetrik = data.metrik.length > 0;

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-6">
      <h1 className="text-2xl font-bold">Time Machine</h1>
      <p className="mt-2 text-xl font-semibold leading-snug">
        Bayangkan hari ini 31 Desember 2025. Hanya data sampai tanggal itu yang dipakai.
      </p>
      <p className="mt-2 max-w-[65ch] text-muted">
        Kami membekukan pengetahuan pada tanggal itu, menyusun peringkat desa, lalu melihat deteksi satelit yang benar-benar terjadi sesudahnya.
        Tidak ada hasil yang disimulasikan.
      </p>

      {adaMetrik ? (
        <section aria-labelledby="uji" className="mt-8">
          <h2 id="uji" className="text-lg font-bold">Hasil uji per tahun</h2>
          <div role="group" aria-label="Pilih tahun uji" className="mt-2 flex flex-wrap gap-2">
            {tahunUji.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tahun === t}
                onClick={() => setTahun(t)}
                className={`min-h-11 rounded-card border px-5 font-semibold ${tahun === t ? "border-ink bg-ink text-white" : "border-line bg-surface"}`}
              >
                Uji {t}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-3 text-lg font-semibold leading-snug">
            {kesimpulanBacktest(data.metrik, tahun)}
          </p>
          <div className="mt-3">
            <MetricTable rows={data.metrik} tahunUji={tahun} />
          </div>
          <p className="mt-2 text-sm text-muted">
            Tangkap 20% = berapa persen desa yang kemudian terdeteksi satelit, yang ada di 20% teratas peringkat. Pembanding: persistensi (deteksi tahun
            terakhir), total riwayat, porsi gambut, dan acak.
          </p>
        </section>
      ) : (
        <p role="status" className="mt-8 rounded-card border border-line bg-surface px-4 py-6 text-center font-semibold text-muted">
          Gerbang data belum dijalankan.
        </p>
      )}

      {data.teratas.length > 0 ? (
        <section aria-labelledby="teratas" className="mt-10">
          <h2 id="teratas" className="text-lg font-bold">20 desa teratas menurut peringkat beku</h2>
          <p className="text-sm text-muted">Peringkat disusun dari data sampai 31 Desember 2025.</p>

          <div className="mt-3">
            {terbuka ? (
              <button type="button" onClick={() => setTerbuka(false)} className="min-h-12 rounded-card border border-line bg-surface px-5 font-semibold">
                Tutup 2026
              </button>
            ) : (
              <button type="button" onClick={() => setTerbuka(true)} className="min-h-12 rounded-card bg-ember px-6 text-base font-semibold text-white">
                Buka 2026
              </button>
            )}
          </div>

          <ol className="mt-3 grid gap-2 md:grid-cols-2">
            {data.teratas.map((d, i) => (
              <li key={d.kode} className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-1 rounded-card border border-line bg-surface px-3 py-2">
                <span className="tabular flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-bold">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{d.nama}</span>
                  <span className="block text-sm text-muted">
                    {d.kecNama} · skor {formatSkor(d.skor)}
                  </span>
                </span>
                {terbuka ? (
                  <span
                    className="muncul ml-11 shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold md:ml-0"
                    style={{ animationDelay: `${i * 40}ms`, borderColor: d.terpapar2026 ? "var(--ember)" : "var(--line)", color: d.terpapar2026 ? "var(--ember)" : "var(--muted)" }}
                  >
                    {d.terpapar2026 ? "● Terdeteksi 2026" : "– Tidak terdeteksi"}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {adaMetrik ? (
        <section aria-labelledby="grup" className="mt-10">
          <h2 id="grup" className="text-lg font-bold">Apakah desa yang tampak aman benar-benar aman?</h2>
          <p className="text-sm text-muted">Laju terdeteksi satelit pada 2026, menurut keadaan desa per 31 Desember 2025.</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {(Object.keys(LABEL_GRUP) as GrupKunci[]).map((kunci) => {
              const g = grup(kunci);
              return (
                <li key={kunci} className="rounded-card border border-line bg-surface px-4 py-3">
                  <p className="font-bold">{LABEL_GRUP[kunci]}</p>
                  <p className="tabular text-3xl font-bold">{g ? `${Math.round(g.rate * 100)}%` : "–"}</p>
                  <p className="text-sm text-muted">
                    {g ? `${formatAngka(g.nTerpapar2026)} dari ${formatAngka(g.nDesa)} desa terdeteksi` : "Data grup belum tersedia."}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 rounded-card border border-line bg-surface px-4 py-3">
            <p className="font-bold">Gerbang data</p>
            <ul className="mt-1 list-disc pl-5 text-sm">
              <li>
                Uji A, riwayat memberi sinyal: laju tampak aman ÷ tanpa riwayat = {rasioA === null ? "–" : rasioA.toFixed(1).replace(".", ",")} (syarat minimal 1,5 dan 30 desa). {data.gerbang.a ? "Lulus." : "Tidak lulus."}
              </li>
              <li>
                Uji B, tenang tidak berarti aman: laju tampak aman ÷ aktif = {rasioB === null ? "–" : rasioB.toFixed(2).replace(".", ",")} (syarat minimal 0,6). {data.gerbang.b ? "Lulus." : "Tidak lulus."}
              </li>
            </ul>
            <p className="mt-2 font-semibold">Keputusan: {LABEL_KEPUTUSAN[data.gerbang.keputusan]}.</p>
            <p className="mt-2 text-sm text-muted">Ambang ditetapkan dan dicatat sebelum data 2026 dibuka. Gagal tidak menghentikan produk, tetapi mengubah klaim.</p>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="batas" className="mt-10 rounded-card border border-warn/40 bg-surface px-4 py-4">
        <h2 id="batas" className="text-lg font-bold">Apa yang tidak bisa dibuktikan halaman ini</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Tidak mengukur hektare yang terselamatkan, dan tidak membuktikan belanja kesiapan menurunkan api.</li>
          <li>Targetnya deteksi satelit, bukan kebakaran. Awan dan asap bisa menutupi api; api gambut membara bisa terlewat.</li>
          <li>2026 berada di luar rezim normal (El Niño sangat kuat), jadi bukan gambaran tahun biasa.</li>
          <li>Data satelit 2026 berakhir {data.dataAkhir2026 ?? "belum ada"}; tanggal akhir yang sebenarnya ditulis di halaman Data.</li>
        </ul>
        <p className="mt-3">
          <Link href="/data" className="inline-flex min-h-11 items-center text-water underline underline-offset-2">Lihat Data dan Asumsi</Link>
        </p>
      </section>
    </div>
  );
}
