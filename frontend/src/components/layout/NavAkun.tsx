"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GambarItem } from "@/components/kesiapan/GambarItem";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatSkor } from "@/lib/format";
import type { Peran, Status } from "@/lib/types";
import { TombolKeluar } from "./TombolKeluar";

type Item = {
  href: (kode: string) => string;
  label: string;
  peran: Peran[];
  icon: React.ReactNode;
  aktifSampai?: "persis";
  /** Kode item paket: menu ini memakai lencana kurang/terpenuhi dan hilang bila desa tidak punya item itu. */
  item?: string;
};
type Kelompok = { tanya: string; items: Item[] };

// Pengelompokan menurut pertanyaan yang ingin dijawab pengguna (pola dari referensi Sparekit).
const kelompok: Kelompok[] = [
  {
    tanya: "Seberapa siap kita?",
    items: [{ href: (k) => `/desa/${k}/kesiapan`, label: "Kesiapan", peran: ["mpa", "desa"], icon: <IconGauge />, aktifSampai: "persis" }],
  },
  {
    tanya: "Apa yang perlu dibeli?",
    items: [
      // Tiga langkah berurutan: cek pagu, putuskan saran, terbitkan usulan.
      { href: (k) => `/desa/${k}/prioritas/pagu`, label: "1. Pagu", peran: ["desa"], icon: <IconSlider /> },
      { href: (k) => `/desa/${k}/prioritas`, label: "2. Keputusan", peran: ["desa"], icon: <IconSort />, aktifSampai: "persis" },
      { href: (k) => `/desa/${k}/usulan`, label: "3. Usulan", peran: ["desa"], icon: <IconDoc /> },
    ],
  },
  {
    tanya: "Bisa dipercaya?",
    items: [
      { href: (k) => `/desa/${k}`, label: "Bukti satelit", peran: ["mpa", "desa"], icon: <IconSatelit />, aktifSampai: "persis" },
      { href: () => "/time-machine", label: "Time Machine", peran: ["mpa", "desa"], icon: <IconWaktu /> },
      { href: () => "/data", label: "Sumber dan batasan", peran: ["mpa", "desa"], icon: <IconData /> },
    ],
  },
];

// Menu bawah di HP hanya memuat layar kerja akun, bukan tautan bukti.
const KERJA = ["kesiapan", "pagu", "prioritas", "usulan"];

type ItemNav = { kode: string; nama: string; kurang: number; belumDiisi: boolean; alat: boolean };

export type RingkasanNav = {
  kode: string;
  peran: Peran;
  namaTampil: string;
  peranLabel: string;
  desaNama: string;
  /** null = belum ada alat yang dicatat. */
  skor: number | null;
  status: Status;
  /** Item paket minimum desa ini. Hanya alat yang tampil di bawah Kesiapan. */
  items: ItemNav[];
};

/**
 * Navigasi halaman berakun (App Flow §1).
 * Laptop: sidebar bergrup pertanyaan + kartu akun + kartu skor. HP: menempel di bawah.
 * Akun `mpa` hanya melihat Kesiapan (plus tautan bukti publik).
 */
export function NavAkun({ r }: { r: RingkasanNav }) {
  const pathname = usePathname();
  const aktif = (i: Item) => {
    const href = i.href(r.kode);
    return i.aktifSampai === "persis" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  };
  const punya = (i: Item) => i.peran.includes(r.peran) && (!i.item || r.items.some((x) => x.kode === i.item));
  const alat = r.items.filter((x) => x.alat);
  const bawah = kelompok.flatMap((g) => g.items).filter((i) => punya(i) && KERJA.some((s) => i.href(r.kode).endsWith(`/${s}`)));

  return (
    <>
      <aside className="no-print hidden md:block">
        <nav
          aria-label="Menu desa"
          className="sticky top-0 flex max-h-dvh min-h-[calc(100dvh-3rem)] flex-col gap-5 overflow-y-auto border-r border-line bg-surface/60 px-3 py-5"
        >
          <div className="space-y-4">
            {kelompok.map((g) => {
              const tampil = g.items.filter(punya);
              if (tampil.length === 0) return null;
              return (
                <section key={g.tanya} aria-label={g.tanya}>
                  <p className="px-3 text-xs font-semibold text-muted">{g.tanya}</p>
                  <ul className="mt-1 space-y-0.5">
                    {tampil.map((i) => {
                      const on = aktif(i);
                      return (
                        <li key={i.label}>
                          <Link
                            href={i.href(r.kode)}
                            aria-current={on ? "page" : undefined}
                            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm ${
                              on ? "bg-[#f7e3d8] font-semibold text-ink" : "text-muted hover:bg-paper hover:text-ink"
                            }`}
                          >
                            <span className={on ? "text-ember" : ""}>{i.icon}</span>
                            <span className="min-w-0 flex-1 truncate">{i.label}</span>
                            {i.item ? <LencanaItem it={r.items.find((x) => x.kode === i.item)!} /> : null}
                          </Link>
                          {i.label === "Kesiapan" && alat.length ? <SubItem kode={r.kode} items={alat} pathname={pathname} /> : null}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <div className="mt-auto space-y-3">
            <TombolKeluar className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-muted hover:bg-paper hover:text-ink disabled:opacity-60" ikon={<IconKeluar />} />
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3">
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f7e3d8] text-sm font-bold text-ember">
                {inisial(r.namaTampil)}
              </span>
              <p className="min-w-0 text-sm leading-tight">
                <span className="block truncate font-semibold">{r.namaTampil}</span>
                <span className="block truncate text-muted">{r.peranLabel}</span>
              </p>
            </div>

            <Link href={`/desa/${r.kode}/kesiapan`} className="block rounded-2xl border border-line bg-paper p-3">
              <span className="block truncate text-xs font-semibold text-muted">Kesiapan {r.desaNama}</span>
              {r.skor === null ? (
                <span className="mt-1 block text-sm font-semibold">Belum ada alat dicatat</span>
              ) : (
                <>
                  <span className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="tabular text-2xl font-bold leading-none">{formatSkor(r.skor)}</span>
                    <span className="text-sm text-muted">dari 100</span>
                  </span>
                  <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
                    <span className="block h-full rounded-full bg-ember" style={{ width: `${Math.min(Math.max(r.skor, 0), 100)}%` }} />
                  </span>
                  <span className="mt-2 block">
                    <StatusBadge status={r.status} />
                  </span>
                </>
              )}
            </Link>
          </div>
        </nav>
      </aside>

      <nav
        aria-label="Menu desa"
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex">
          {bawah.map((i) => {
            const on = aktif(i);
            return (
              <li key={i.label} className="flex flex-1">
                <Link
                  href={i.href(r.kode)}
                  aria-current={on ? "page" : undefined}
                  className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs ${on ? "font-semibold text-ember" : "text-muted"}`}
                >
                  {i.icon}
                  <span>{i.label.replace(/^\d\.\s/, "")}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

/**
 * Sub-menu item di bawah Kesiapan (pola daftar mesin Sparekit): gambar kecil, nama, lencana jumlah kurang.
 * Lencana bertuliskan angka dan diberi teks pembaca layar; item terpenuhi bertanda centang.
 */
function SubItem({ kode, items, pathname }: { kode: string; items: ItemNav[]; pathname: string }) {
  return (
    <ul aria-label="Alat kesiapan" className="ml-5 mt-0.5 space-y-0.5 border-l border-line pl-2">
      {items.map((it) => {
        const href = `/desa/${kode}/kesiapan/${it.kode}`;
        const on = pathname === href;
        return (
          <li key={it.kode}>
            <Link
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2.5 rounded-xl px-2 text-sm ${
                on ? "bg-[#f7e3d8] font-semibold text-ink" : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              <GambarItem kode={it.kode} className="size-8 rounded-lg" />
              <span className="min-w-0 flex-1 truncate">{it.nama}</span>
              <LencanaItem it={it} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Lencana jumlah kurang: angka dengan teks pembaca layar, centang bila terpenuhi, tanda pisah bila belum dicatat. */
function LencanaItem({ it }: { it: ItemNav }) {
  return it.belumDiisi ? (
    <span className="shrink-0 rounded-md bg-paper px-1.5 text-sm text-muted">
      –<span className="sr-only">, belum dicatat</span>
    </span>
  ) : it.kurang > 0 ? (
    <span className="tabular shrink-0 rounded-md bg-ember-soft px-1.5 text-sm font-semibold text-ember">
      {it.kurang}
      <span className="sr-only"> kurang</span>
    </span>
  ) : (
    <span className="shrink-0 text-ok">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
      </svg>
      <span className="sr-only">terpenuhi</span>
    </span>
  );
}

function inisial(nama: string): string {
  const huruf = nama
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]!.toUpperCase());
  return huruf.join("") || "?";
}

const ikon = { "aria-hidden": true, width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function IconGauge() {
  return (
    <svg {...ikon}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </svg>
  );
}
function IconSort() {
  return (
    <svg {...ikon}>
      <path d="M4 6h16M4 12h10M4 18h5" />
    </svg>
  );
}
function IconSlider() {
  return (
    <svg {...ikon}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg {...ikon}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}
function IconSatelit() {
  return (
    <svg {...ikon}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}
function IconWaktu() {
  return (
    <svg {...ikon}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconData() {
  return (
    <svg {...ikon}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.700 3.100 3 7 3s7-1.300 7-3V6M5 12v6c0 1.700 3.100 3 7 3s7-1.300 7-3v-6" />
    </svg>
  );
}
function IconKeluar() {
  return (
    <svg {...ikon}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </svg>
  );
}
