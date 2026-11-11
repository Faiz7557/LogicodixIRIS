/*
 * Skala warna hari ada titik api dalam SATU BULAN, dipakai tampilan kotak dan 3D supaya warnanya sama persis.
 * Berurutan satu warna (ember), terang ke gelap. Batas hari tetap supaya antardesa bisa dibandingkan.
 */
export const TINGKAT = [
  { min: 0, hex: "#e7e4dd", warna: "bg-line/70 text-muted", label: "0 hari" },
  { min: 1, hex: "#f6dcc2", warna: "bg-[#f6dcc2] text-ink", label: "1 sampai 2 hari" },
  { min: 3, hex: "#ecaa72", warna: "bg-[#ecaa72] text-ink", label: "3 sampai 5 hari" },
  { min: 6, hex: "#db6e3d", warna: "bg-[#db6e3d] text-white", label: "6 sampai 10 hari" },
  { min: 11, hex: "#a8331a", warna: "bg-[#a8331a] text-white", label: "lebih dari 10 hari" },
] as const;

export type Tingkat = (typeof TINGKAT)[number];

export function tingkat(hari: number): Tingkat {
  let t: Tingkat = TINGKAT[0];
  for (const x of TINGKAT) if (hari >= x.min) t = x;
  return t;
}

export interface TahunSatelit {
  tahun: number;
  /** Total hari ada titik api dalam setahun. */
  hari: number;
  ekstrem: boolean;
  /** Hari ada titik api per bulan, Jan sampai Des (demo: diperkirakan dari total tahunan). */
  bulan: number[];
}
