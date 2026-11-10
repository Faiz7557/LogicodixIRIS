import { bentukDesa } from "@/lib/bentukDesa";

/**
 * Bentuk desa dari geom_json sebagai SVG satu poligon (P1). Tanpa pustaka peta, tanpa latar peta,
 * jadi selalu tampil, termasuk tanpa internet. Hanya ilustrasi bentuk, bukan batas resmi.
 */
export function MiniShape({ geomJson, nama }: { geomJson: string; nama: string }) {
  const b = bentukDesa(geomJson);
  if (!b) return null;
  return (
    <figure>
      <svg viewBox={`0 0 ${b.lebar} ${b.tinggi}`} role="img" aria-label={`Bentuk wilayah Desa ${nama}, ilustrasi`} className="h-auto max-h-44 w-full max-w-[280px]">
        <path d={b.path} fill="#fbe9e1" stroke="var(--ember)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <figcaption className="text-sm text-muted">Bentuk wilayah (ilustrasi, bukan batas resmi).</figcaption>
    </figure>
  );
}
