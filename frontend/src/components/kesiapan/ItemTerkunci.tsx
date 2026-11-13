import type { ReactNode } from "react";
import { ALASAN_TERKUNCI_GAMBUT } from "@/lib/kesiapan";
import type { CatalogItem } from "@/lib/types";
import { GambarItem } from "./GambarItem";

/** Ikon gembok kecil (SVG sebaris), dekoratif. */
export function IkonGembok({ className = "size-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Lencana "Terkunci" yang dipakai di semua tempat item terkunci muncul. */
export function LencanaTerkunci() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">
      <IkonGembok className="size-3.5" />
      Terkunci
    </span>
  );
}

/**
 * Kartu item terkunci (seperti fitur gim yang belum terbuka): gambar alat diredupkan dan digembok,
 * alasan kenapa terkunci, dan syarat membukanya. Tanpa isian; item ini tidak dihitung dalam skor.
 */
export function KartuTerkunci({ item, children, as: Tag = "div" }: { item: CatalogItem; children?: ReactNode; as?: "div" | "section" }) {
  return (
    <Tag
      aria-label={`${item.nama}, terkunci. ${ALASAN_TERKUNCI_GAMBUT}`}
      className="relative overflow-hidden rounded-card border border-dashed border-line-2 bg-paper px-4 py-4"
    >
      <div className="flex items-start gap-3">
        <span className="relative shrink-0">
          <GambarItem kode={item.kode} className="size-11 opacity-35 grayscale" />
          <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-ink text-white ring-2 ring-paper">
            <IkonGembok className="size-3.5" />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-lg font-bold text-muted">{item.nama}</span>
            <LencanaTerkunci />
          </p>
          <p className="mt-1 text-sm font-semibold">{ALASAN_TERKUNCI_GAMBUT}</p>
          <p className="mt-1 max-w-[60ch] text-sm text-muted">
            {item.nama} dipakai untuk membasahi lahan gambut yang terbakar di bawah permukaan, jadi item ini tidak masuk paket
            minimum desa dan tidak mengurangi skor kesiapan. Terbuka otomatis bila peta gambut mencatat lahan gambut di desa ini.
          </p>
          {children}
        </div>
      </div>
    </Tag>
  );
}
