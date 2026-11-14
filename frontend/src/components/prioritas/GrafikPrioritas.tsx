"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import { keyBaris, namaAksi, type KeputusanMap } from "@/lib/prioritas";
import type { Aksi, PriorityRow } from "@/lib/types";

/*
 * Grafik dasbor Prioritas. Aturan (skill dataviz):
 * - Warna menurut tugas: aksi beli = water, perbaiki = ember (lolos validator: ΔE CVD 22,7, kontras >= 3:1);
 *   warna status (ok/warn/danger) hanya untuk keputusan, selalu dengan ikon + kata.
 * - Satu sumbu, tanda tipis (garis 2 px, ujung batang membulat, celah 2 px), kisi samar, teks memakai warna teks.
 * - Tiap grafik punya legenda bila > 1 seri, tooltip saat diarahkan, dan tabel cadangan.
 */

const WARNA_AKSI: Record<Aksi, string> = { beli: "var(--water)", perbaiki: "var(--ember)" };
const juta = (rp: number) => `${formatAngka(rp / 1_000_000, rp % 1_000_000 === 0 ? 0 : 1)} jt`;

function Swatch({ warna, garis = false }: { warna: string; garis?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-3 shrink-0 rounded-[3px]"
      style={garis ? { border: "1.5px solid var(--line-2)", background: "var(--surface)" } : { background: warna }}
    />
  );
}

/* ---------------------------------------------------------------------------------------------- */
/* Kurva skor terhadap pagu                                                                        */
/* ---------------------------------------------------------------------------------------------- */

const M = { l: 40, r: 12, t: 18, b: 34 };

export function KurvaSkorPagu({
  titik,
  pagu,
  skorSekarang,
  kebutuhan,
  coba,
  onPilih,
}: {
  /** Besar dana yang sedang dicoba (pagu + tambahan dari luar pagu). Ditandai bila lebih dari pagu. */
  coba?: number;
  /** Skor sesudah belanja untuk tiap besar pagu, urut naik. */
  titik: { pagu: number; skor: number }[];
  /** Pagu yang ditandai (pagu desa). */
  pagu: number;
  skorSekarang: number;
  /** Biaya semua kebutuhan; bila lebih dari pagu, rentang di antaranya ditandai sebagai kekurangan. */
  kebutuhan?: number;
  /** Bila ada, klik kurva memilih pagu. Tanpa ini kurva hanya bisa dibaca. */
  onPilih?: (pagu: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [arah, setArah] = useState<number | null>(null);
  const idGrad = useId();
  // Lebar viewBox = lebar nyata kotak, supaya teks sumbu tetap 11 px di HP maupun laptop.
  const [W, setW] = useState(640);
  const figur = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = figur.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = W < 480 ? 220 : 260;
  const maxP = titik.at(-1)?.pagu ?? 1;
  const x = (p: number) => M.l + (p / maxP) * (W - M.l - M.r);
  const y = (s: number) => M.t + (1 - s / 100) * (H - M.t - M.b);

  const garis = titik.map((t, i) => `${i ? "L" : "M"}${x(t.pagu).toFixed(1)},${y(t.skor).toFixed(1)}`).join("");
  const area = `${garis}L${x(maxP)},${y(0)}L${x(0)},${y(0)}Z`;
  const kasar = W < 480 ? 2 : 1; // layar sempit: label sumbu x lebih jarang
  const langkahX = (maxP > 60_000_000 ? 20_000_000 : maxP > 25_000_000 ? 10_000_000 : 5_000_000) * kasar;
  const ticksX = Array.from({ length: Math.floor(maxP / langkahX) + 1 }, (_, i) => i * langkahX);

  // Skor pada pagu terpilih: titik terdekat di bawahnya (kurva berundak).
  const skorPada = (p: number) => [...titik].reverse().find((t) => t.pagu <= p)?.skor ?? titik[0]?.skor ?? 0;
  const skorPagu = skorPada(Math.min(pagu, maxP));
  const aktif = arah !== null ? titik[arah] : null;
  const adaKurang = kebutuhan !== undefined && kebutuhan > pagu && pagu <= maxP;
  const ujungKurang = adaKurang ? Math.min(kebutuhan!, maxP) : 0;
  const adaCoba = coba !== undefined && coba > pagu && pagu <= maxP;
  const ujungCoba = adaCoba ? Math.min(coba!, maxP) : pagu;
  const skorCoba = skorPada(ujungCoba);
  const geser = "transform 450ms var(--pegas), width 450ms var(--pegas)";

  function dariPointer(e: { clientX: number }) {
    const r = svg.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const p = ((px - M.l) / (W - M.l - M.r)) * maxP;
    let terdekat = 0;
    titik.forEach((t, i) => {
      if (Math.abs(t.pagu - p) < Math.abs(titik[terdekat].pagu - p)) terdekat = i;
    });
    return terdekat;
  }

  return (
    <figure ref={figur} className="relative">
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        className={`block h-auto w-full touch-none select-none ${onPilih ? "cursor-crosshair" : "cursor-default"}`}
        role="img"
        aria-label={`Grafik skor kesiapan menurut besar dana. Dengan anggaran ${formatRupiah(pagu)} skor menjadi ${formatSkor(skorPagu)}${
          adaKurang ? `; bila semua kebutuhan ${formatRupiah(kebutuhan!)} terbeli, skor menjadi ${formatSkor(skorPada(ujungKurang))}` : ""
        }. Tabel tersedia di bawah grafik.`}
        onPointerMove={(e) => setArah(dariPointer(e))}
        onPointerLeave={() => setArah(null)}
        onClick={onPilih ? (e) => onPilih(titik[dariPointer(e)].pagu) : undefined}
      >
        <defs>
          <linearGradient id={idGrad} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--ember)" stopOpacity="0.18" />
            <stop offset="1" stopColor="var(--ember)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* kisi samar dan sumbu */}
        {[0, 25, 50, 75, 100].map((s) => (
          <g key={s}>
            <line x1={M.l} x2={W - M.r} y1={y(s)} y2={y(s)} stroke="var(--line)" strokeWidth="1" />
            <text x={M.l - 8} y={y(s)} dy="0.35em" textAnchor="end" fontSize="11" fill="var(--faint)">
              {s}
            </text>
          </g>
        ))}
        {ticksX.map((p) => (
          <text key={p} x={x(p)} y={H - M.b + 18} textAnchor="middle" fontSize="11" fill="var(--faint)">
            {p === 0 ? "Rp0" : juta(p)}
          </text>
        ))}

        {/* garis bantu skor sekarang */}
        <line x1={M.l} x2={W - M.r} y1={y(skorSekarang)} y2={y(skorSekarang)} stroke="var(--faint)" strokeWidth="1" strokeDasharray="4 4" />
        <text x={W - M.r} y={y(skorSekarang) + 14} textAnchor="end" fontSize="11" fill="var(--muted)">
          Skor sekarang {formatSkor(skorSekarang)}
        </text>

        {/* rentang kekurangan: dana yang perlu dicari di luar pagu */}
        {adaKurang ? (
          <g>
            <rect x={x(pagu)} y={M.t} width={Math.max(0, x(ujungKurang) - x(pagu))} height={y(0) - M.t} fill="var(--water)" opacity="0.07" />
            <line x1={x(ujungKurang)} x2={x(ujungKurang)} y1={M.t} y2={y(0)} stroke="var(--water)" strokeWidth="1" strokeDasharray="2 3" />
            <text
              opacity={adaCoba && ujungCoba >= ujungKurang ? 0 : 1}
              style={{ transition: "opacity 300ms ease-out" }}
              x={Math.min(x(ujungKurang), W - M.r) - 4}
              y={y(skorPada(ujungKurang)) + 28}
              textAnchor="end"
              fontSize="11"
              fontWeight="600"
              fill="var(--water)"
              stroke="var(--surface)"
              strokeWidth="3"
              paintOrder="stroke"
            >
              Semua terbeli: {formatSkor(skorPada(ujungKurang))}
            </text>
          </g>
        ) : null}

        {/* bagian kekurangan yang tertutup dana tambahan yang sedang dicoba */}
        {adaKurang ? (
          <rect x={x(pagu)} y={M.t} height={y(0) - M.t} fill="var(--water)" opacity="0.16" style={{ width: Math.max(0, x(ujungCoba) - x(pagu)), transition: geser }} />
        ) : null}

        <path d={area} fill={`url(#${idGrad})`} className="muncul-pelan" />
        <path d={garis} pathLength={1} fill="none" stroke="var(--ember)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="gambar-garis" />

        {/* penanda pagu yang dipilih */}
        {pagu <= maxP ? (
          <g>
            <line x1={x(pagu)} x2={x(pagu)} y1={M.t} y2={y(0)} stroke="var(--ink)" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx={x(pagu)} cy={y(skorPagu)} r="6" fill="var(--ember)" stroke="var(--surface)" strokeWidth="2" />
            <text
              x={Math.min(Math.max(x(pagu), M.l + 60), W - M.r - 60)}
              y={Math.max(y(skorPagu) - 14, M.t + 10)}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="var(--ink)"
            >
              Anggaran: {formatSkor(skorPagu)}
            </text>
          </g>
        ) : null}

        {/* penanda dana yang sedang dicoba: bergeser halus mengikuti penggeser */}
        {adaCoba ? (
          <g pointerEvents="none">
            <g style={{ transform: `translateX(${x(ujungCoba)}px)`, transition: geser }}>
              <line x1={0} x2={0} y1={M.t} y2={y(0)} stroke="var(--water)" strokeWidth="1.5" strokeDasharray="2 3" />
            </g>
            <g style={{ transform: `translate(${x(ujungCoba)}px, ${y(skorCoba)}px)`, transition: geser }}>
              <circle r="6" fill="var(--water)" stroke="var(--surface)" strokeWidth="2" className="denyut" />
              <text
                x={x(ujungCoba) > W - 150 ? -12 : 12}
                y={22}
                textAnchor={x(ujungCoba) > W - 150 ? "end" : "start"}
                fontSize="12"
                fontWeight="600"
                fill="var(--water)"
                stroke="var(--surface)"
                strokeWidth="3"
                paintOrder="stroke"
              >
                Dengan tambahan: {formatSkor(skorCoba)}
              </text>
            </g>
          </g>
        ) : null}

        {/* garis bidik saat diarahkan */}
        {aktif ? (
          <g pointerEvents="none">
            <line x1={x(aktif.pagu)} x2={x(aktif.pagu)} y1={M.t} y2={y(0)} stroke="var(--line-2)" strokeWidth="1" />
            <circle cx={x(aktif.pagu)} cy={y(aktif.skor)} r="5" fill="var(--surface)" stroke="var(--ember)" strokeWidth="2" />
          </g>
        ) : null}
      </svg>

      {aktif ? (
        <div
          role="status"
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-card"
          style={{ left: `${Math.min(Math.max((x(aktif.pagu) / W) * 100, 18), 82)}%` }}
        >
          <span className="tabular block font-semibold">{formatRupiah(aktif.pagu)}</span>
          <span className="tabular block text-muted">
            Skor {formatSkor(aktif.skor)}
            {aktif.skor > skorSekarang ? ` (+${formatSkor(aktif.skor - skorSekarang)})` : ""}
          </span>
          {aktif.pagu > pagu ? (
            <span className="tabular block text-xs text-faint">
              Perlu tambahan {formatRupiah(aktif.pagu - pagu)}{onPilih ? ". Klik untuk mencoba." : ""}
            </span>
          ) : null}
        </div>
      ) : null}

      <details className="mt-2 text-sm">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-water">Lihat sebagai tabel</summary>
        <div className="mt-2 max-h-56 overflow-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-paper">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  Besar dana
                </th>
                <th scope="col" className="px-3 py-2 text-right font-semibold">
                  Skor setelah belanja
                </th>
              </tr>
            </thead>
            <tbody>
              {titik
                .filter((_, i) => i % 4 === 0 || i === titik.length - 1)
                .map((t) => (
                  <tr key={t.pagu} className="border-t border-line">
                    <td className="tabular px-3 py-1.5">{formatRupiah(t.pagu)}</td>
                    <td className="tabular px-3 py-1.5 text-right">{formatSkor(t.skor)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/* Batang pemakaian pagu                                                                            */
/* ---------------------------------------------------------------------------------------------- */

/** Lebar minimum satu ruas batang: belanja kecil (mis. Rp120.000 dari Rp300 juta) tetap terlihat. */
const RUAS_MIN_PX = 10;

export function BatangPagu({
  pagu,
  terpilih,
  nama,
  satuan = () => "",
  keputusan,
}: {
  pagu: number;
  terpilih: PriorityRow[];
  nama: (kode: string) => string;
  satuan?: (kode: string) => string;
  /** Keputusan desa per baris (langkah 2). Bila ada, daftar di bawah batang menampilkan statusnya. */
  keputusan?: KeputusanMap;
}) {
  const [arah, setArah] = useState<number | null>(null);
  const total = terpilih.reduce((a, b) => a + b.biayaRp, 0);
  const sisa = Math.max(pagu - total, 0);
  const persen = pagu > 0 ? Math.round((total / pagu) * 100) : 0;
  const aksiAda = (["beli", "perbaiki"] as Aksi[]).filter((a) => terpilih.some((b) => b.aksi === a));
  const aktif = arah !== null ? terpilih[arah] : null;
  const labelLegenda = (a: Aksi) => namaAksi(a);

  return (
    <div>
      <p className="text-sm">
        <span className="tabular font-semibold">{formatRupiah(total)}</span> <span className="text-muted">terpakai dari {formatRupiah(pagu)}</span>{" "}
        <span className="tabular font-semibold">({persen}%)</span>
      </p>
      <div
        role="img"
        aria-label={`Pemakaian anggaran: ${terpilih.map((b) => `${namaAksi(b.aksi)} ${nama(b.itemKode)} ${formatRupiah(b.biayaRp)}`).join(", ") || "belum ada belanja"}; sisa ${formatRupiah(sisa)}.`}
        className="mt-2 flex h-6 w-full gap-[2px] overflow-hidden rounded-[6px]"
        onPointerLeave={() => setArah(null)}
      >
        {terpilih.map((b, i) => (
          <div
            key={`${b.itemKode}-${b.aksi}`}
            className="isi-maju h-full transition-[opacity,width] duration-500 [transition-timing-function:var(--pegas)]"
            style={{
              animationDuration: "700ms",
              animationDelay: `${i * 60}ms`,
              width: `${(b.biayaRp / Math.max(pagu, total)) * 100}%`,
              minWidth: RUAS_MIN_PX,
              flexShrink: 0,
              background: WARNA_AKSI[b.aksi],
              opacity: arah === null || arah === i ? 1 : 0.45,
            }}
            onPointerEnter={() => setArah(i)}
          />
        ))}
        {sisa > 0 ? <div className="h-full flex-1 rounded-[4px] border-[1.5px] border-line-2 bg-surface" style={{ minWidth: 4 }} /> : null}
      </div>
      <p aria-live="polite" className="mt-1 min-h-5 text-sm text-muted">
        {aktif ? (
          <>
            <span className="font-semibold text-ink">
              {namaAksi(aktif.aksi)} {nama(aktif.itemKode).toLowerCase()}
            </span>{" "}
            {formatAngka(aktif.qty)} × · <span className="tabular">{formatRupiah(aktif.biayaRp)}</span>
          </>
        ) : terpilih.length > 0 ? null : (
          "Anggaran ini belum cukup untuk membeli apa pun."
        )}
      </p>
      {terpilih.length > 0 ? (
        <ol className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line">
          {terpilih.map((b, i) => {
            // Ditunda sama dengan belum diputuskan (kolom Ditunda sudah dihapus dari papan).
            const asli = keputusan?.[keyBaris(b)]?.keputusan;
            const k: StatusKeputusan = asli === "setuju" || asli === "tolak" ? asli : "belum";
            const st = STATUS.find((x) => x.kunci === k)!;
            return (
              <li
                key={keyBaris(b)}
                className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-2 text-sm transition-colors ${arah === i ? "bg-paper" : ""}`}
                onPointerEnter={() => setArah(i)}
                onPointerLeave={() => setArah(null)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Swatch warna={WARNA_AKSI[b.aksi]} />
                  <span className="font-semibold">
                    {namaAksi(b.aksi)} {nama(b.itemKode).toLowerCase()}
                  </span>
                  <span className="text-muted">
                    · {formatAngka(b.qty)} {satuan(b.itemKode)}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  {keputusan ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: k === "belum" ? "var(--muted)" : st.warna }}>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        {st.ikon}
                      </svg>
                      {st.label}
                    </span>
                  ) : null}
                  <span className="tabular font-semibold">{formatRupiah(b.biayaRp)}</span>
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        {aksiAda.map((a) => (
          <li key={a} className="flex items-center gap-1.5">
            <Swatch warna={WARNA_AKSI[a]} /> {labelLegenda(a)}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <Swatch warna="" garis /> Sisa <span className="tabular">{formatRupiah(sisa)}</span>
        </li>
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/* Cakupan per item: sekarang -> sesudah belanja (dumbbell)                                        */
/* ---------------------------------------------------------------------------------------------- */

export interface BarisCakupan {
  kode: string;
  nama: string;
  satuan: string;
  target: number;
  sebelum: number; // berfungsi sekarang
  sesudah: number; // berfungsi sesudah belanja terpilih
  /** Berfungsi bila dana tambahan yang sedang dicoba ikut dibelanjakan (hanya di layar Pagu). */
  denganTambahan?: number;
}

const GERAK = "left 500ms var(--pegas), width 500ms var(--pegas), opacity 300ms ease-out";

export function CakupanSesudah({ baris, labelSesudah = "Setelah belanja" }: { baris: BarisCakupan[]; labelSesudah?: string }) {
  const [arah, setArah] = useState<string | null>(null);
  const pct = (n: number, t: number) => (t > 0 ? Math.min(n / t, 1) * 100 : 0);
  const adaTambahan = baris.some((b) => b.denganTambahan !== undefined && b.denganTambahan > b.sesudah);
  return (
    <div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block size-3 rounded-full border-2 border-faint bg-surface" /> Sekarang
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block size-3 rounded-full" style={{ background: "var(--water)" }} /> {labelSesudah}
        </li>
        {adaTambahan ? (
          <li className="muncul flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block size-3 rounded-full" style={{ background: "var(--ember)" }} /> Dengan dana tambahan
          </li>
        ) : null}
      </ul>
      <ul className="mt-3 space-y-3">
        {baris.map((b, urut) => {
          const a = pct(b.sebelum, b.target);
          const z = pct(b.sesudah, b.target);
          const t = b.denganTambahan !== undefined ? pct(b.denganTambahan, b.target) : z;
          const naik = Math.round(z) > Math.round(a);
          const naikLagi = Math.round(t) > Math.round(z);
          return (
            <li
              key={b.kode}
              style={{ animationDelay: `${urut * 70}ms` }}
              className={`masuk rounded-xl px-2 py-1.5 transition-colors ${arah === b.kode ? "bg-paper" : ""}`}
              onPointerEnter={() => setArah(b.kode)}
              onPointerLeave={() => setArah(null)}
            >
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-semibold">{b.nama}</span>
                <span className="tabular text-muted">
                  {naik || naikLagi ? (
                    <>
                      {Math.round(a)}% → <span className="font-semibold text-ink">{Math.round(z)}%</span>
                      {naikLagi ? (
                        <span className="muncul font-semibold text-ember" key={Math.round(t)}>
                          {" "}
                          → {Math.round(t)}%
                        </span>
                      ) : null}
                    </>
                  ) : (
                    <>{Math.round(a)}%, tidak berubah</>
                  )}
                </span>
              </div>
              <div
                role="img"
                aria-label={`${b.nama}: ${formatAngka(b.sebelum)} dari ${formatAngka(b.target)} ${b.satuan} berfungsi sekarang, ${formatAngka(b.sesudah)} sesudah belanja${
                  naikLagi ? `, ${formatAngka(b.denganTambahan!)} dengan dana tambahan` : ""
                }.`}
                className="relative mt-1.5 h-4"
              >
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-line" />
                {/* ruas sekarang -> sesudah -> dengan tambahan; lebar 0 saat tidak ada, supaya bisa bergeser masuk */}
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{ left: `${a}%`, width: `${naik ? z - a : 0}%`, background: "var(--water)", opacity: 0.45, transition: GERAK }}
                />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  style={{ left: `${z}%`, width: `${naikLagi ? t - z : 0}%`, background: "var(--ember)", opacity: 0.45, transition: GERAK }}
                />
                <span
                  className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-faint bg-surface"
                  style={{ left: `${a}%` }}
                />
                <span
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                  style={{ left: `${z}%`, background: "var(--water)", opacity: naik ? 1 : 0, transition: GERAK }}
                />
                <span
                  className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface"
                  style={{ left: `${t}%`, background: "var(--ember)", opacity: naikLagi ? 1 : 0, transition: GERAK }}
                />
              </div>
              {arah === b.kode ? (
                <p className="tabular mt-1 text-xs text-muted">
                  {formatAngka(b.sebelum)} → {formatAngka(b.sesudah)}
                  {naikLagi ? ` → ${formatAngka(b.denganTambahan!)}` : ""} dari jumlah minimum {formatAngka(b.target)} {b.satuan}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------- */
/* Ringkasan keputusan desa                                                                         */
/* ---------------------------------------------------------------------------------------------- */

type StatusKeputusan = "setuju" | "tolak" | "belum";

const STATUS: { kunci: StatusKeputusan; label: string; warna: string; ikon: React.ReactNode }[] = [
  { kunci: "setuju", label: "Disetujui", warna: "var(--ok)", ikon: <path d="M5 12l5 5 9-10" /> },
  { kunci: "tolak", label: "Ditolak", warna: "var(--danger)", ikon: <path d="M6 6l12 12M18 6L6 18" /> },
  { kunci: "belum", label: "Perlu diputuskan", warna: "var(--line-2)", ikon: <path d="M12 8v5M12 16h.01" /> },
];

export function RingkasKeputusan({ jumlah }: { jumlah: Record<StatusKeputusan, number> }) {
  const total = Object.values(jumlah).reduce((a, b) => a + b, 0);
  const isi = useMemo(() => STATUS.filter((s) => jumlah[s.kunci] > 0), [jumlah]);
  return (
    <div>
      <div
        role="img"
        aria-label={STATUS.map((s) => `${s.label} ${jumlah[s.kunci]}`).join(", ")}
        className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full bg-line"
      >
        {isi.map((s) => (
          <div key={s.kunci} style={{ width: `${(jumlah[s.kunci] / Math.max(total, 1)) * 100}%`, background: s.warna }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2">
        {STATUS.map((s) => (
          <li key={s.kunci} className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full" style={{ background: s.warna }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.kunci === "belum" ? "var(--ink)" : "#fff"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                {s.ikon}
              </svg>
            </span>
            <span className="min-w-0">
              <span className="tabular block text-lg font-semibold leading-tight">{jumlah[s.kunci]}</span>
              <span className="block truncate text-xs text-muted">{s.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
