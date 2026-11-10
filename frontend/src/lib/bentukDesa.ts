/*
 * Mengubah geom_json (GeoJSON Polygon/MultiPolygon) menjadi jalur SVG (MiniShape, P1).
 * Tanpa pustaka peta: tetap jalan offline (TRD v2 §3). Proyeksi sederhana: lon dikalikan cos(lintang tengah).
 */
type Cincin = number[][];

export interface BentukSvg {
  /** Perintah path SVG, satu "M...Z" per cincin. */
  path: string;
  lebar: number;
  tinggi: number;
}

function cincinDari(geom: unknown): Cincin[] {
  const g = geom as { type?: string; coordinates?: unknown };
  if (g?.type === "Polygon") return g.coordinates as Cincin[];
  if (g?.type === "MultiPolygon") return (g.coordinates as Cincin[][]).flat();
  return [];
}

export function bentukDesa(geomJson: string, lebarMaks = 280, tinggiMaks = 160, pad = 6): BentukSvg | null {
  let geom: unknown;
  try {
    geom = JSON.parse(geomJson);
  } catch {
    return null;
  }
  const cincin = cincinDari(geom).filter((r) => r.length >= 3);
  if (cincin.length === 0) return null;

  const semua = cincin.flat();
  const lats = semua.map((p) => p[1]);
  const kos = Math.cos((((Math.min(...lats) + Math.max(...lats)) / 2) * Math.PI) / 180);
  const x = (p: number[]) => p[0] * kos;
  const y = (p: number[]) => -p[1];

  const xs = semua.map(x);
  const ys = semua.map(y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX || 1e-9;
  const h = Math.max(...ys) - minY || 1e-9;
  const skala = Math.min((lebarMaks - 2 * pad) / w, (tinggiMaks - 2 * pad) / h);

  const px = (p: number[]) => (x(p) - minX) * skala + pad;
  const py = (p: number[]) => (y(p) - minY) * skala + pad;
  const f = (n: number) => Math.round(n * 10) / 10;

  const path = cincin.map((r) => "M" + r.map((p) => `${f(px(p))} ${f(py(p))}`).join("L") + "Z").join(" ");
  return { path, lebar: Math.ceil(w * skala + 2 * pad), tinggi: Math.ceil(h * skala + 2 * pad) };
}
