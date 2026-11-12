/**
 * Pemisah antarbagian: beberapa garis kontur yang tergambar mengikuti scroll (stroke-dashoffset dari `--p`,
 * lihat PenggerakGulir dan `.garis-gambar` di globals.css). Hiasan; tanpa JS garis tampil utuh.
 */
export function GarisKontur() {
  const garis = [
    "M0 40 C 180 10, 320 70, 520 38 S 860 8, 1040 44 S 1260 70, 1440 30",
    "M0 58 C 200 30, 360 86, 560 56 S 880 26, 1060 62 S 1280 88, 1440 50",
    "M0 76 C 220 52, 380 100, 600 74 S 900 46, 1080 80 S 1300 104, 1440 70",
  ];
  return (
    <div data-gulir="lewat" aria-hidden="true" className="garis-gambar pointer-events-none -my-6 overflow-hidden">
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="h-16 w-full sm:h-24">
        {garis.map((d, i) => (
          <path key={i} d={d} pathLength={1} fill="none" stroke={i === 1 ? "var(--ember)" : "var(--line-2)"} strokeOpacity={i === 1 ? 0.55 : 1} strokeWidth={i === 1 ? 1.6 : 1.2} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
    </div>
  );
}
