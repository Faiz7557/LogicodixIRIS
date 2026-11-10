"use client";

import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { PAGU_PRESET, PAGU_SLIDER_LANGKAH, PAGU_SLIDER_MAKS, parsePagu } from "@/lib/prioritas";

/**
 * Kontrol pagu (Design Brief v2 §7). Tiga cara mengisi, semuanya setara:
 * kotak Rupiah (diketik), tombol preset (satu sentuhan), dan penggeser.
 * Menyeret bukan satu-satunya cara (WCAG 2.2 Dragging Movements).
 * Perubahan langsung dilaporkan; penundaan 300 ms untuk menghitung ulang ada di induknya.
 */
export function PaguControl({ pagu, onChange }: { pagu: number; onChange: (v: number) => void }) {
  const [teks, setTeks] = useState(formatRupiah(pagu));
  const fokus = useRef(false);

  // Sinkron saat nilai berubah dari penggeser atau preset (bukan saat sedang mengetik).
  useEffect(() => {
    if (!fokus.current) setTeks(formatRupiah(pagu));
  }, [pagu]);

  return (
    <section aria-labelledby="pagu-judul" className="rounded-card border border-line bg-surface px-4 py-4">
      <h2 id="pagu-judul" className="text-lg font-bold">
        Pagu belanja kesiapan
      </h2>
      <p className="text-sm text-muted">Dana yang bisa dipakai desa untuk satu musim. Bisa diubah kapan saja.</p>

      <label htmlFor="pagu-input" className="mt-3 block text-sm font-semibold">
        Jumlah pagu (Rupiah)
      </label>
      <input
        id="pagu-input"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={teks}
        onFocus={(e) => {
          fokus.current = true;
          e.currentTarget.select();
        }}
        onBlur={() => {
          fokus.current = false;
          setTeks(formatRupiah(pagu));
        }}
        onChange={(e) => {
          setTeks(e.target.value);
          onChange(parsePagu(e.target.value));
        }}
        className="tabular mt-1 min-h-12 w-full rounded-card border border-line bg-surface px-3 text-xl font-bold"
      />

      <div role="group" aria-label="Pilihan pagu cepat" className="mt-3 flex flex-wrap gap-2">
        {PAGU_PRESET.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={pagu === p}
            onClick={() => onChange(p)}
            className={`min-h-11 rounded-card border px-4 text-sm font-semibold ${
              pagu === p ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink"
            }`}
          >
            {formatRupiah(p)}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={pagu === 0}
          onClick={() => onChange(0)}
          className={`min-h-11 rounded-card border px-4 text-sm font-semibold ${
            pagu === 0 ? "border-ink bg-ink text-white" : "border-line bg-paper text-ink"
          }`}
        >
          Kosongkan
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="pagu-geser" className="text-sm text-muted">
          Atau geser (Rp0 sampai {formatRupiah(PAGU_SLIDER_MAKS)})
        </label>
        <input
          id="pagu-geser"
          type="range"
          min={0}
          max={PAGU_SLIDER_MAKS}
          step={PAGU_SLIDER_LANGKAH}
          value={Math.min(pagu, PAGU_SLIDER_MAKS)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={formatRupiah(pagu)}
          className="mt-1 h-11 w-full accent-[var(--ember)]"
        />
      </div>
    </section>
  );
}
