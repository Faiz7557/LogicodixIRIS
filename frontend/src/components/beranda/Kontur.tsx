/*
 * Latar hero bergaya peta topografi, murni SVG (tanpa pustaka peta, jalan offline).
 * Dekoratif dan diam: tidak ada animasi latar (Design Brief §9). Titik-titik hanya hiasan, bukan lokasi desa.
 * Garis dibangkitkan deterministik agar sama di server dan browser.
 */
function blob(cx: number, cy: number, r: number, fase: number): string {
  const n = 72;
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k = 1 + 0.13 * Math.sin(3 * t + fase) + 0.07 * Math.sin(5 * t + fase * 1.7) + 0.04 * Math.sin(9 * t + fase * 0.6);
    pts.push(`${(cx + r * 1.55 * k * Math.cos(t)).toFixed(1)} ${(cy + r * 0.95 * k * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

const LINGKARAN = Array.from({ length: 9 }, (_, i) => blob(420, 250, 34 + i * 30, 0.4 + i * 0.22));
const KEDUA = Array.from({ length: 5 }, (_, i) => blob(110, 400, 20 + i * 24, 2 + i * 0.3));

// Posisi titik dalam persen; hiasan saja.
const TITIK = [
  { x: 12, y: 36, u: 14 },
  { x: 17, y: 64, u: 12 },
  { x: 71, y: 30, u: 14 },
  { x: 87, y: 52, u: 12 },
  { x: 80, y: 78, u: 14 },
  { x: 18, y: 80, u: 12 },
] as const;

export function Kontur() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg viewBox="0 0 840 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="var(--line)" strokeWidth="1.2">
          {LINGKARAN.map((d, i) => (
            <path key={i} d={d} opacity={0.95 - i * 0.07} />
          ))}
          {KEDUA.map((d, i) => (
            <path key={`k${i}`} d={d} opacity={0.7 - i * 0.1} />
          ))}
        </g>
      </svg>
      {TITIK.map((t, i) => (
        <span
          key={i}
          className="absolute hidden rounded-full border-[3px] border-surface bg-ember shadow-md md:block"
          style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.u * 2, height: t.u * 2 }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
