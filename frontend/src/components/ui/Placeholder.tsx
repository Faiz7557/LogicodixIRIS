import Link from "next/link";

/**
 * Kerangka sementara untuk halaman yang belum dibangun.
 * Mencantumkan isi wajib dari App Flow agar alur bisa diklik dari awal sampai akhir.
 * Ganti per halaman sesuai fasenya.
 */
export function Placeholder({
  judul,
  fase,
  isi,
  lanjut,
  lebar = "720",
}: {
  judul: string;
  fase: string;
  isi: string[];
  lanjut?: { href: string; label: string };
  lebar?: "720" | "1040";
}) {
  return (
    <div className={`mx-auto px-4 py-6 ${lebar === "1040" ? "max-w-[1040px]" : "max-w-[720px]"}`}>
      <p className="text-sm font-semibold text-muted">Kerangka · dibangun di {fase}</p>
      <h1 className="mt-1 text-2xl font-bold">{judul}</h1>
      <div className="mt-4 rounded-card border border-dashed border-line bg-surface px-4 py-4">
        <p className="font-semibold">Isi layar ini (App Flow §3):</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
          {isi.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      </div>
      {lanjut ? (
        <Link
          href={lanjut.href}
          className="mt-6 inline-flex min-h-11 items-center rounded-card bg-ember px-4 font-semibold text-white"
        >
          {lanjut.label}
        </Link>
      ) : null}
    </div>
  );
}
