"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TombolKeluar } from "./TombolKeluar";

const links = [
  { href: "/time-machine", label: "Time Machine" },
  { href: "/data", label: "Data" },
];

// Halaman berakun: /desa/[kode]/kesiapan, inventaris, prioritas, usulan (dan turunannya).
const AKUN = /^\/desa\/[^/]+\/(kesiapan|inventaris|prioritas|usulan)(\/|$)/;
// Kartu Paparan /desa/[kode]: berakun bila sudah masuk dan itu desa akun sendiri.
const PAPARAN = /^\/desa\/([^/]+)\/?$/;

export type SesiHeader = { desaKode: string } | null;

/**
 * Header situs.
 * Publik: logo di kiri dalam kolom 1040 px, tautan Time Machine, Data, dan Masuk di kanan.
 * Berakun: selebar layar dengan logo di paling kiri, sejajar sidebar. Di laptop tidak ada tombol,
 * karena Time Machine, Data, dan Keluar ada di sidebar. Di HP (tanpa sidebar) tautan tetap ada.
 * Kartu Paparan, Time Machine, dan Data saat sudah masuk ikut mode berakun.
 * Halaman publik lain saat sudah masuk: tombol Masuk diganti "Dasbor desa".
 */
export function SiteHeader({ sesi = null }: { sesi?: SesiHeader }) {
  const path = usePathname();
  const paparan = PAPARAN.exec(path)?.[1];
  // Time Machine saat sudah masuk juga tampil di kerangka dasbor.
  const akun =
    AKUN.test(path) || (!!sesi && (path === "/time-machine" || path === "/data" || sesi.desaKode === paparan));

  return (
    <header className="no-print border-b border-line bg-surface">
      <div className={`flex items-center justify-between gap-2 ${akun ? "px-4 md:px-6" : "mx-auto max-w-[1040px] px-4"}`}>
        <Logo />
        <nav aria-label="Navigasi utama" className={akun ? "md:hidden" : undefined}>
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-11 items-center whitespace-nowrap px-1 text-sm text-muted hover:text-ink sm:px-3"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              {akun ? (
                <TombolKeluar className="ml-0.5 flex min-h-11 items-center whitespace-nowrap rounded-card border border-line-2 bg-surface px-2.5 text-sm font-semibold text-ink hover:border-ink hover:bg-surface-2 disabled:opacity-60 sm:ml-1 sm:px-3" />
              ) : sesi ? (
                <Link
                  href={`/desa/${sesi.desaKode}/kesiapan`}
                  className="ml-0.5 flex min-h-11 items-center whitespace-nowrap rounded-card border border-line-2 bg-surface px-2.5 text-sm font-semibold text-ink hover:border-ink hover:bg-surface-2 sm:ml-1 sm:px-3"
                >
                  Dasbor desa
                </Link>
              ) : (
                <Link
                  href="/masuk"
                  className="ml-0.5 flex min-h-11 items-center whitespace-nowrap rounded-card border border-line-2 bg-surface px-2.5 text-sm font-semibold text-ink hover:border-ink hover:bg-surface-2 sm:ml-1 sm:px-3"
                >
                  Masuk
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex min-h-11 shrink-0 items-center text-[15px] font-bold tracking-tight text-ink sm:text-lg">
      <span aria-hidden="true" className="mr-1.5 flex size-6 items-center justify-center rounded-lg bg-ink text-white sm:mr-2 sm:size-7">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5c3.2 4 6 7.1 6 10.7a6 6 0 0 1-12 0C6 9.6 8.8 6.500 12 2.500z" />
        </svg>
      </span>
      SiapKemarau
    </Link>
  );
}

/**
 * Header cadangan tanpa usePathname: tampil di prerender sebelum SiteHeader (yang membaca URL) siap.
 * Next 16 dengan cacheComponents mewajibkan pembaca URL di Client Component berada di dalam <Suspense>.
 */
export function SiteHeaderCadangan() {
  return (
    <header className="no-print border-b border-line bg-surface">
      <div className="mx-auto flex min-h-11 max-w-[1040px] items-center px-4">
        <Logo />
      </div>
    </header>
  );
}
