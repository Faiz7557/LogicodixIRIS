"use client";

import { useRef } from "react";
import { formatAngka } from "@/lib/format";
import { NAMA_BULAN, NAMA_BULAN_PENDEK } from "@/lib/satelitBulanan";
import { KepalaKartu, METRIK, batasRapi, kelasKartu, nilaiDari, type Metrik, type TahunDasbor } from "./dasar";

/**
 * Grafik utama: satu batang per tahun (pola grafik Payments pada referensi).
 * Batang berarsir = tahun terdeteksi, abu = ada titik tapi di bawah ambang, garis = nol.
 * Tahun kering ekstrem diberi latar pasir dan label tebal. Satu tahun selalu terpilih:
 * klik atau panah kiri/kanan memindahkan pilihan, tooltip ikut bergeser, rincian di kartu Paparan ikut berubah.
 * Tahun di luar rentang diredupkan, bukan dibuang, supaya sumbu tidak meloncat.
 */
export function GrafikRiwayat({
  data,
  metrik,
  dalam,
  pilih,
  onPilih,
}: {
  data: TahunDasbor[];
  metrik: Metrik;
  dalam: (t: number) => boolean;
  pilih: number;
  onPilih: (tahun: number) => void;
}) {
  const wadah = useRef<HTMLDivElement>(null);
  const satuan = METRIK.find((m) => m.nilai === metrik)!.satuan;
  const atas = batasRapi(Math.max(...data.map((d) => nilaiDari(d, metrik)), 1));
  const iPilih = Math.max(
    0,
    data.findIndex((d) => d.tahun === pilih),
  );
  const dipilih = data[iPilih];
  const tinggi = (d: TahunDasbor) => (nilaiDari(d, metrik) / atas) * 100;

  function geser(arah: number) {
    const j = Math.min(Math.max(iPilih + arah, 0), data.length - 1);
    onPilih(data[j].tahun);
    wadah.current?.querySelectorAll<HTMLButtonElement>("button[data-tahun]")[j]?.focus();
  }

  const posKiri = Math.min(Math.max(((iPilih + 0.5) / data.length) * 100, 9), 91);

  return (
    <section aria-labelledby="riwayat" className={`${kelasKartu} flex flex-col`}>
      <KepalaKartu
        id="riwayat"
        judul="Riwayat deteksi satelit"
        keterangan="Pilih tahun untuk melihat rinciannya."
        kanan={
          <ul aria-label="Keterangan" className="hidden shrink-0 flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-muted sm:flex">
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="arsir-ember h-3 w-2.5 rounded-sm" /> Terdeteksi
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="arsir-abu h-3 w-2.5 rounded-sm" /> Di bawah ambang
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="size-3 rounded-sm bg-[#f4ebdd] ring-1 ring-line" /> Kering ekstrem
            </li>
          </ul>
        }
      />

      {/* Grafik mengisi sisa tinggi kartu supaya sejajar dengan kartu Paparan di sebelahnya. */}
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-[2.25rem_minmax(0,1fr)] gap-2">
        {/* Sumbu nilai; jarak bawahnya setinggi baris label tahun. */}
        <div aria-hidden="true" className="flex flex-col">
        <div className="tabular relative min-h-52 flex-1 text-right text-xs text-faint">
          {[1, 0.5, 0].map((f) => (
            <span key={f} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - f) * 100}%` }}>
              {formatAngka(atas * f)}
            </span>
          ))}
        </div>
        <span className="invisible mt-1.5 text-xs">0</span>
        </div>

        <div className="flex flex-col">
          <div className="relative min-h-52 flex-1">
            {[1, 0.5].map((f) => (
              <span key={f} aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: `${(1 - f) * 100}%` }} />
            ))}
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 border-t border-line-2" />

            <div
              ref={wadah}
              role="group"
              aria-label={`${METRIK.find((m) => m.nilai === metrik)!.label} per tahun. Panah kiri dan kanan untuk memilih tahun.`}
              onKeyDown={(e) => {
                const arah = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                if (!arah) return;
                e.preventDefault();
                geser(arah);
              }}
              className="absolute inset-0 flex gap-1 sm:gap-1.5"
            >
              {data.map((d, i) => {
                const v = nilaiDari(d, metrik);
                const on = d.tahun === pilih;
                const masuk = dalam(d.tahun);
                return (
                  <button
                    key={d.tahun}
                    type="button"
                    data-tahun={d.tahun}
                    tabIndex={on ? 0 : -1}
                    aria-pressed={on}
                    aria-label={`${d.tahun}: ${formatAngka(v)} ${satuan}, ${d.terpapar ? "terdeteksi" : "tidak terdeteksi"}${d.ekstrem ? ", tahun kering ekstrem" : ""}`}
                    onClick={() => onPilih(d.tahun)}
                    className={`group relative flex h-full min-w-0 flex-1 items-end justify-center rounded-t-lg outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-ember ${
                      d.ekstrem ? "bg-[#f4ebdd]/80" : ""
                    } ${masuk ? "opacity-100" : "opacity-30"}`}
                  >
                    <span className="tumbuh flex h-full w-full items-end justify-center px-0.5" style={{ animationDelay: `${i * 35}ms` }}>
                      <span
                        className={`block w-full max-w-8 rounded-t-md transition-[height,filter,box-shadow] duration-500 [transition-timing-function:var(--pegas)] ${
                          v === 0 ? "rounded-b-md bg-line" : d.terpapar ? "arsir-ember" : "arsir-abu"
                        } ${on ? "shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--ink)] brightness-95" : "group-hover:brightness-95"}`}
                        style={{ height: v === 0 ? "4px" : `max(${tinggi(d)}%, 6px)` }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tooltip tahun terpilih, bergeser mengikuti pilihan. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-card transition-[left,bottom] duration-500 [transition-timing-function:var(--pegas)]"
              style={{ left: `${posKiri}%`, bottom: `calc(${Math.min(nilaiDari(dipilih, metrik) === 0 ? 2 : tinggi(dipilih), 82)}% + 12px)` }}
            >
              <span className="tabular font-semibold">{dipilih.tahun}</span>
              <span className="text-white/60"> · </span>
              <span className="tabular">
                {formatAngka(nilaiDari(dipilih, metrik))} {satuan}
              </span>
              <span className="text-white/60"> · </span>
              {dipilih.terpapar ? "terdeteksi" : "tidak terdeteksi"}
            </div>
          </div>

          <div aria-hidden="true" className="mt-1.5 flex gap-1 sm:gap-1.5">
            {data.map((d) => (
              <span
                key={d.tahun}
                className={`tabular min-w-0 flex-1 text-center text-xs transition-colors duration-300 ${d.tahun === pilih ? "font-semibold text-ink" : d.ekstrem ? "font-semibold text-ink/80" : "text-muted"}`}
              >
                <span className="lg:hidden">&apos;{String(d.tahun).slice(2)}</span>
                <span className="hidden lg:inline">{d.tahun}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Rincian tahun yang dipilih di grafik riwayat: status, dua angka, dan sebaran per bulan dari data satelit.
 * Tersusun tegak supaya muat di kartu Paparan yang sempit, dan mengisi sisa tinggi kartu.
 */
export function RincianTahun({ d }: { d: TahunDasbor }) {
  const maks = Math.max(...d.bulan, 1);
  const puncak = d.bulan.indexOf(Math.max(...d.bulan));
  return (
    <div aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-4 rounded-2xl bg-surface-2 p-4">
      <div>
        <p className="text-xs text-muted">Tahun yang dipilih di grafik</p>
        <p key={d.tahun} className="muncul mt-1 flex flex-wrap items-center gap-2">
          <span className="tabular text-3xl font-semibold leading-none tracking-[-0.02em]">{d.tahun}</span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${d.terpapar ? "bg-ember-soft text-ember" : "bg-surface text-muted ring-1 ring-line"}`}
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {d.terpapar ? <circle cx="12" cy="12" r="5" fill="currentColor" /> : null}
              <circle cx="12" cy="12" r="9" />
            </svg>
            {d.terpapar ? "Terdeteksi" : "Tidak terdeteksi"}
          </span>
          {d.ekstrem ? <span className="rounded-full bg-[#f4ebdd] px-2 py-0.5 text-xs font-semibold text-ink">Kering ekstrem</span> : null}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-muted">Hari deteksi</dt>
            <dd className="tabular text-2xl font-semibold">{formatAngka(d.hari)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Titik api</dt>
            <dd className="tabular text-2xl font-semibold">{formatAngka(d.titik)}</dd>
          </div>
        </dl>
      </div>

      <figure className="flex min-h-0 min-w-0 flex-1 flex-col">
        <figcaption className="flex items-center justify-between gap-2 text-xs text-muted">
          <span>{d.hari > 0 ? `Hari deteksi per bulan, puncak ${NAMA_BULAN[puncak]}` : "Tidak ada hari deteksi tahun ini"}</span>
        </figcaption>
        <div className="mt-2 flex min-h-16 flex-1 items-end gap-1">
          {d.bulan.map((b, i) => (
            <span key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span
                className={`block w-full rounded-sm transition-[height] duration-500 [transition-timing-function:var(--pegas)] ${b > 0 ? (i === puncak ? "bg-ember" : "bg-ember/45") : "bg-line"}`}
                style={{ height: b > 0 ? `${(b / maks) * 100}%` : "3px" }}
                title={`${NAMA_BULAN[i]} ${d.tahun}: ${b} hari`}
              />
            </span>
          ))}
        </div>
        <div aria-hidden="true" className="mt-1 flex gap-1 text-center text-[10px] text-faint">
          {NAMA_BULAN_PENDEK.map((n) => (
            <span key={n} className="min-w-0 flex-1">
              {n[0]}
            </span>
          ))}
        </div>
        <p className="sr-only">{d.bulan.map((b, i) => `${NAMA_BULAN[i]} ${b} hari`).join(", ")}</p>
      </figure>
    </div>
  );
}
