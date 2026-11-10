import Link from "next/link";

const links = [
  { href: "/time-machine", label: "Time Machine" },
  { href: "/data", label: "Data" },
];

// Header publik. Status masuk/keluar ditambahkan setelah auth backend siap (Task 14).
export function SiteHeader() {
  return (
    <header className="no-print border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center text-[15px] font-bold tracking-tight text-ink sm:text-lg"
        >
          <span aria-hidden="true" className="mr-1.5 flex size-6 items-center justify-center rounded-lg bg-ink text-white sm:mr-2 sm:size-7">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5c3.2 4 6 7.1 6 10.7a6 6 0 0 1-12 0C6 9.6 8.8 6.500 12 2.500z" />
            </svg>
          </span>
          SiapKemarau
        </Link>
        <nav aria-label="Navigasi utama">
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
              <Link
                href="/masuk"
                className="ml-0.5 flex min-h-11 items-center whitespace-nowrap rounded-card border border-line-2 bg-surface px-2.5 text-sm font-semibold text-ink hover:border-ink hover:bg-surface-2 sm:ml-1 sm:px-3"
              >
                Masuk
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
