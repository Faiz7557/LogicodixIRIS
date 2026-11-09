"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Peran } from "@/lib/types";

type Item = { seg: string; label: string; peran: Peran[]; icon: React.ReactNode };

const items: Item[] = [
  { seg: "kesiapan", label: "Kesiapan", peran: ["mpa", "desa"], icon: <IconGauge /> },
  { seg: "inventaris", label: "Alat", peran: ["mpa", "desa"], icon: <IconList /> },
  { seg: "prioritas", label: "Prioritas", peran: ["desa"], icon: <IconSort /> },
  { seg: "usulan", label: "Usulan", peran: ["desa"], icon: <IconDoc /> },
];

/**
 * Navigasi halaman berakun (App Flow §1).
 * HP: menempel di bawah. Laptop: tab di atas konten.
 * Akun `mpa` hanya melihat Kesiapan dan Alat.
 */
export function BottomNav({ kode, peran }: { kode: string; peran: Peran }) {
  const pathname = usePathname();
  const visible = items.filter((i) => i.peran.includes(peran));

  const linkFor = (i: Item, variant: "bottom" | "top") => {
    const href = `/desa/${kode}/${i.seg}`;
    const active = pathname === href || pathname.startsWith(`${href}/`);
    const base =
      variant === "bottom"
        ? "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs"
        : "flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm";
    const state = active
      ? variant === "bottom"
        ? "font-semibold text-ember"
        : "border-ember font-semibold text-ink"
      : variant === "bottom"
        ? "text-muted"
        : "border-transparent text-muted hover:text-ink";
    return (
      <li key={i.seg} className={variant === "bottom" ? "flex flex-1" : undefined}>
        <Link href={href} aria-current={active ? "page" : undefined} className={`${base} ${state}`}>
          {i.icon}
          <span>{i.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      <nav aria-label="Menu desa" className="no-print hidden border-b border-line md:block">
        <ul className="mx-auto flex max-w-[720px] px-4">{visible.map((i) => linkFor(i, "top"))}</ul>
      </nav>
      <nav
        aria-label="Menu desa"
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex">{visible.map((i) => linkFor(i, "bottom"))}</ul>
      </nav>
    </>
  );
}

function IconGauge() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
    </svg>
  );
}
function IconList() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  );
}
function IconSort() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h10M4 18h5" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}
