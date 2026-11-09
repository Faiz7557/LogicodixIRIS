import Link from "next/link";

const links = [
  { href: "/time-machine", label: "Time Machine" },
  { href: "/data", label: "Data" },
];

// Header publik. Status masuk/keluar ditambahkan setelah auth backend siap (Task 14).
export function SiteHeader() {
  return (
    <header className="no-print border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center text-base font-bold tracking-tight text-ink sm:text-lg"
        >
          SiapKemarau
        </Link>
        <nav aria-label="Navigasi utama">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-11 items-center whitespace-nowrap px-1.5 text-sm text-water underline-offset-4 hover:underline sm:px-3"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/masuk"
                className="ml-1 flex min-h-11 items-center whitespace-nowrap rounded-card border border-line bg-surface px-3 text-sm font-semibold text-ink"
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
