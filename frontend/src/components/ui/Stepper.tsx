"use client";

import { bacaAngka, geser } from "@/lib/inventaris";

/**
 * Stepper angka (Design Brief §7): minus, kotak angka, plus. Semua target 44 px.
 * Kotak angka tetap bisa diketik (HP dengan sinyal lemah lebih cepat mengetik daripada menekan plus
 * berkali-kali). Galat tampil dekat isian, dengan ikon + teks, dan diumumkan lewat aria-live.
 */
export function Stepper({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  satuan,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  satuan?: string;
}) {
  const kosongAtauNol = bacaAngka(value).jenis !== "ok" || value.trim() === "0";
  const tombol =
    "flex size-11 shrink-0 items-center justify-center rounded-card border border-line bg-surface text-2xl leading-none select-none active:bg-paper";

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          aria-label={`Kurangi ${label}`}
          aria-disabled={kosongAtauNol}
          onClick={() => onChange(geser(value, -1))}
          className={`${tombol} ${kosongAtauNol ? "opacity-40" : ""}`}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder="–"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-galat`}
          className={`tabular h-11 w-20 rounded-card border bg-surface text-center text-lg font-semibold ${
            error ? "border-danger" : "border-line"
          }`}
        />
        <button type="button" aria-label={`Tambah ${label}`} onClick={() => onChange(geser(value, 1))} className={tombol}>
          <span aria-hidden="true">+</span>
        </button>
        {satuan ? <span className="text-sm text-muted">{satuan}</span> : null}
      </div>
      <p id={`${id}-galat`} aria-live="polite" className="mt-1 min-h-5 text-sm text-danger">
        {error ? (
          <>
            <svg aria-hidden="true" className="mr-1 inline -translate-y-px" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l10 18H2z" />
              <path d="M12 10v5M12 18h.01" />
            </svg>
            {error}
          </>
        ) : null}
      </p>
    </div>
  );
}
