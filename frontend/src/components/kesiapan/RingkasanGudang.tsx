import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatAngka, formatRupiah, formatSkor } from "@/lib/format";
import type { ItemView } from "@/lib/kesiapan";
import type { CatalogItem, HargaRow, Status } from "@/lib/types";

/*
 * Tiga bagian di bawah peta gudang (pola Sparekit): daftar yang perlu ditangani dulu,
 * skor sekarang dibanding sesudah belanja sesuai pagu, dan item yang melebihi paket minimum.
 * Murni tampilan: semua angka datang dari props.
 */

type Baris = {
  kunci: string;
  kode: string;
  nama: string;
  keadaan: string;
  aksi: string;
  biaya: number | null;
  ragam: "kurang" | "rusak" | "kosong";
};

const harga = (rows: HargaRow[], kode: string, aksi: "beli" | "perbaiki") => rows.find((h) => h.itemKode === kode && h.aksi === aksi)?.hargaRp ?? null;

/** Baris tindakan terurut dari item paling genting (urutan `items` sudah dari kesenjangan terbesar). */
export function barisTindakan(items: ItemView[], catalog: CatalogItem[], hargaRows: HargaRow[]): Baris[] {
  const out: Baris[] = [];
  for (const it of items) {
    const c = catalog.find((x) => x.kode === it.itemKode);
    const alat = c?.punyaRusak ?? true;
    const n = (x: number) => `${formatAngka(x)} ${it.satuan}`;
    if (it.belumDiisi) {
      out.push({ kunci: `${it.itemKode}:catat`, kode: it.itemKode, nama: it.nama, keadaan: "Belum dicatat, dihitung 0", aksi: "Catat jumlahnya", biaya: null, ragam: "kosong" });
      continue;
    }
    const kurang = Math.max(it.target - it.berfungsi, 0);
    if (kurang > 0) {
      const h = harga(hargaRows, it.itemKode, "beli");
      out.push({
        kunci: `${it.itemKode}:beli`,
        kode: it.itemKode,
        nama: it.nama,
        keadaan: alat ? `Ada ${formatAngka(it.berfungsi)}, butuh ${n(it.target)}` : `Tersedia ${formatAngka(it.berfungsi)}, butuh ${n(it.target)}`,
        aksi: alat ? `Beli ${n(kurang)}` : `Tambah dana ${n(kurang)}`,
        biaya: h === null ? null : kurang * h,
        ragam: "kurang",
      });
    }
    if (alat && it.rusak > 0) {
      const h = harga(hargaRows, it.itemKode, "perbaiki");
      out.push({
        kunci: `${it.itemKode}:perbaiki`,
        kode: it.itemKode,
        nama: it.nama,
        keadaan: `${n(it.rusak)} rusak`,
        aksi: `Perbaiki ${n(it.rusak)}`,
        biaya: h === null ? null : it.rusak * h,
        ragam: "rusak",
      });
    }
  }
  return out;
}

export function TanganiDulu({ kode, baris }: { kode: string; baris: Baris[] }) {
  return (
    <section aria-labelledby="tangani" className="overflow-hidden rounded-panel border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4 md:px-6">
        <h2 id="tangani" className="text-lg font-bold">
          Tangani ini lebih dulu
        </h2>
        <p className="text-sm text-muted">Urut dari item paling genting</p>
      </div>
      {baris.length === 0 ? (
        <p className="border-t border-line px-5 py-4 text-muted md:px-6">Tidak ada yang mendesak. Semua item paket minimum terpenuhi dan tidak ada yang rusak.</p>
      ) : (
        <ul className="divide-y divide-surface border-t border-line">
          {baris.map((b) => (
            <li key={b.kunci}>
              <Link
                href={`/desa/${kode}/kesiapan/${b.kode}`}
                className={`group grid gap-x-6 gap-y-0.5 px-5 py-3.5 transition-colors md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-center md:px-6 ${
                  b.ragam === "kurang" ? "bg-ember-soft/70 hover:bg-ember-soft" : b.ragam === "rusak" ? "bg-warn-soft/70 hover:bg-warn-soft" : "bg-paper hover:bg-line/40"
                }`}
              >
                <span className="font-semibold">{b.nama}</span>
                <span className="text-sm text-muted md:text-base">{b.keadaan}</span>
                <span className={`text-sm font-semibold md:text-base ${b.ragam === "kurang" ? "text-ember" : b.ragam === "rusak" ? "text-warn" : "text-water"}`}>
                  {b.aksi}
                  {b.ragam === "kosong" ? "" : b.biaya !== null ? ` · ${formatRupiah(b.biaya)}` : " · harga belum ada"}
                </span>
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden text-muted transition-transform group-hover:translate-x-0.5 md:block"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/*
 * Tiga kartu sejajar memakai kerangka yang sama supaya bagian-bagiannya segaris:
 * kepala (judul + label kanan), angka besar, visual, baris angka di bawah (garis atas), lalu tautan di pojok kanan bawah.
 */

const kelasKartu = "flex flex-col rounded-panel border border-line bg-surface p-5 shadow-card md:p-6";

function Kepala({ id, judul, kanan }: { id: string; judul: string; kanan: React.ReactNode }) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-3">
      <h2 id={id} className="text-lg font-bold leading-snug">
        {judul}
      </h2>
      <span className="shrink-0">{kanan}</span>
    </div>
  );
}

/** Label kecil di kanan judul, bentuknya sama dengan StatusBadge. */
function Lencana({ ragam, children }: { ragam: "ok" | "kurang" | "netral"; children: React.ReactNode }) {
  const warna = ragam === "ok" ? "bg-ok-soft text-ok" : ragam === "kurang" ? "bg-ember-soft text-ember" : "bg-paper text-muted";
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${warna}`}>{children}</span>;
}

function AngkaBesar({ nilai, keterangan }: { nilai: string; keterangan: string }) {
  return (
    <p className="mt-4 flex h-[3.75rem] items-end gap-x-2.5 overflow-hidden">
      <span className={`tabular shrink-0 font-semibold leading-none tracking-[-0.03em] ${nilai.length > 8 ? "text-4xl" : nilai.length > 6 ? "text-5xl" : "text-6xl"}`}>
        {nilai}
      </span>
      {/* Keterangan boleh dua baris di samping angka, tidak dipotong. */}
      <span className="line-clamp-2 min-w-0 pb-0.5 leading-tight text-muted">{keterangan}</span>
    </p>
  );
}

/** Area visual setinggi sama di ketiga kartu, lalu keterangan dua baris: garis-garisnya jadi sejajar antarkartu. */
function AreaVisual({ children, keterangan }: { children: React.ReactNode; keterangan: React.ReactNode }) {
  return (
    <>
      <div className="mt-5 flex h-[150px] flex-col justify-center">{children}</div>
      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-muted">{keterangan}</p>
    </>
  );
}

function BarisAngka({ isi }: { isi: { label: string; nilai: string; ragam?: "kurang" }[] }) {
  return (
    <dl className={`grid gap-x-4 gap-y-3 border-t border-line pt-4 ${isi.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {isi.map((x) => (
        <div key={x.label} className="flex min-w-0 flex-col-reverse justify-end">
          <dt className="truncate text-sm text-muted">{x.label}</dt>
          <dd className={`tabular truncate text-xl font-semibold tracking-tight ${x.ragam === "kurang" ? "text-ember" : ""}`} title={x.nilai}>
            {x.nilai}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TautanBawah({ href, children }: { href?: string; children: React.ReactNode }) {
  const isi = (
    <>
      <span className="underline underline-offset-2">{children}</span>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );
  const kelas = "group mt-2 inline-flex min-h-11 items-center gap-1.5 self-end text-sm font-semibold text-water";
  return href ? (
    <Link href={href} className={kelas}>
      {isi}
    </Link>
  ) : (
    <span className={kelas}>{isi}</span>
  );
}

/** Rupiah ringkas untuk kartu: Rp87,2 jt, Rp1,4 M. Angka lengkap tetap di atribut title. */
function rupiahRingkas(n: number): string {
  if (n >= 1e9) return `Rp${formatAngka(n / 1e9, 1)} M`;
  if (n >= 1e6) return `Rp${formatAngka(n / 1e6, 1)} jt`;
  return formatRupiah(n);
}

/** Skor sekarang (batang gelap) dan skor sesudah belanja sesuai pagu (batang terang di belakangnya). */
export function KartuSkor({
  skor,
  status,
  skorSesudah,
  paguRp,
  baris,
  kode,
  bisaPrioritas,
}: {
  skor: number;
  status: Status;
  skorSesudah: number;
  paguRp: number;
  baris: Baris[];
  kode: string;
  bisaPrioritas: boolean;
}) {
  const itemKurang = baris.filter((b) => b.ragam === "kurang").length;
  const totalBiaya = baris.reduce((a, b) => a + (b.biaya ?? 0), 0);
  const tanpaHarga = baris.filter((b) => b.ragam !== "kosong" && b.biaya === null).length;
  const rusak = baris.filter((b) => b.ragam === "rusak").length;

  return (
    <section aria-labelledby="skor-kartu" className={kelasKartu}>
      <Kepala id="skor-kartu" judul="Skor kesiapan" kanan={<StatusBadge status={status} />} />
      <AngkaBesar nilai={formatSkor(skor)} keterangan="dari 100" />
      <AreaVisual
        keterangan={
          <>
            Busur abu: <span className="tabular font-semibold text-ink">{formatSkor(skorSesudah)}</span> bila belanja sesuai pagu {rupiahRingkas(paguRp)}.
            {tanpaHarga > 0 ? ` ${formatAngka(tanpaHarga)} tindakan belum punya harga.` : ""}
          </>
        }
      >
        <SpeedometerApi skor={skor} skorSesudah={skorSesudah} paguRp={paguRp} />
      </AreaVisual>

      <div className="min-h-5 flex-1" />
      <BarisAngka
        isi={[
          { label: "item kurang", nilai: formatAngka(itemKurang) },
          { label: "item rusak", nilai: formatAngka(rusak) },
          { label: "perlu biaya", nilai: rupiahRingkas(totalBiaya) },
        ]}
      />
      {bisaPrioritas ? <TautanBawah href={`/desa/${kode}/prioritas/pagu`}>Isi anggaran</TautanBawah> : <TautanBawah href={`/desa/${kode}`}>Lihat bukti paparan</TautanBawah>}
    </section>
  );
}

/** Item yang melebihi paket minimum: batang paket (hijau) lalu cadangan (biru), dan nilai cadangannya. */
export function KartuLebih({ kode, items, hargaRows }: { kode: string; items: ItemView[]; hargaRows: HargaRow[] }) {
  const lebih = items
    .filter((it) => !it.belumDiisi && it.berfungsi > it.target)
    .sort((a, b) => b.berfungsi - b.target - (a.berfungsi - a.target));
  const nilai = lebih.reduce((a, it) => a + (it.berfungsi - it.target) * (harga(hargaRows, it.itemKode, "beli") ?? 0), 0);
  const teratas = lebih[0];

  return (
    <section aria-labelledby="lebih" className={kelasKartu}>
      <Kepala id="lebih" judul="Lebih dari paket" kanan={<Lencana ragam="netral">{formatAngka(lebih.length)} item</Lencana>} />
      <AngkaBesar nilai={lebih.length ? rupiahRingkas(nilai) : "–"} keterangan="nilai cadangan" />

      <AreaVisual
        keterangan={lebih.length === 0 ? "Belum ada item yang melebihi paket minimum." : "Nilai cadangan dihitung dari harga beli acuan tiap item."}
      >
        {lebih.length === 0 ? null : (
          <>
          <ul className="space-y-4">
            {lebih.slice(0, 3).map((it) => {
              const sisa = it.berfungsi - it.target;
              return (
                <li key={it.itemKode}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{it.nama}</span>
                    <span className="shrink-0 text-muted">
                      ada {formatAngka(it.berfungsi)}, paket {formatAngka(it.target)} {it.satuan}
                    </span>
                  </div>
                  <div
                    role="img"
                    aria-label={`${it.nama}: paket minimum ${formatAngka(it.target)} ${it.satuan}, cadangan ${formatAngka(sisa)} ${it.satuan}`}
                    className="mt-1.5 flex h-3 gap-0.5 overflow-hidden rounded-full"
                  >
                    <span className="rounded-l-full bg-ok" style={{ width: `${(it.target / it.berfungsi) * 100}%` }} />
                    <span className="flex-1 rounded-r-full bg-water" />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 rounded-sm bg-ok" /> Paket minimum
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2.5 rounded-sm bg-water" /> Cadangan
            </span>
          </p>
          </>
        )}
      </AreaVisual>

      <div className="min-h-5 flex-1" />
      <BarisAngka
        isi={[
          { label: "item lebih", nilai: formatAngka(lebih.length) },
          { label: "cadangan terbanyak", nilai: teratas ? `${formatAngka(teratas.berfungsi - teratas.target)} ${teratas.satuan}` : "–" },
        ]}
      />
      {teratas ? <TautanBawah href={`/desa/${kode}/kesiapan/${teratas.itemKode}`}>Lihat {teratas.nama.toLowerCase()}</TautanBawah> : null}
    </section>
  );
}

// ---------- Speedometer skor dengan api ----------

const CX = 130;
const CY = 128;
const R = 92;
const TANDA = [0, 25, 50, 75, 100];
/** Ikon api 24x24, ujung bawah di (12, 22). */
const API = "M12 2c.9 3.3 4.6 5.3 4.6 10.1a4.6 4.6 0 0 1-9.2 0c0-2.2 1-3.7 2.1-4.8.2 1.6.9 2.7 2 3.2-.1-3.1.5-5.6.5-8.5z";

function titik(nilai: number, r: number): [number, number] {
  const t = Math.PI * (1 - Math.min(Math.max(nilai, 0), 100) / 100);
  return [CX + r * Math.cos(t), CY - r * Math.sin(t)];
}

function busur(dari: number, ke: number, r = R): string {
  const [x1, y1] = titik(dari, r);
  const [x2, y2] = titik(ke, r);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/**
 * Speedometer 0 sampai 100: busur merah ke hijau, jarum di skor sekarang, busur terang sampai skor sesudah belanja.
 * Lima api di sepanjang skala mengecil dari 0 ke 100 (makin siap, makin kecil apinya); api terdekat dengan skor menyala.
 */
function SpeedometerApi({ skor, skorSesudah, paguRp }: { skor: number; skorSesudah: number; paguRp: number }) {
  const [jx, jy] = titik(skor, R - 26);
  return (
    <div>
      <svg
        viewBox="-10 -6 280 160"
        role="img"
        aria-label={`Skor sekarang ${formatSkor(skor)} dari 100. Bila belanja sesuai pagu ${formatRupiah(paguRp)}, skor menjadi ${formatSkor(skorSesudah)}.`}
        className="mx-auto block h-[150px] w-auto max-w-full"
      >
        <defs>
          {/* Sama dengan legenda peta: merah (rawan) di skor rendah, hijau di skor tinggi. */}
          <linearGradient id="gradien-skor" gradientUnits="userSpaceOnUse" x1={CX - R} x2={CX + R} y1="0" y2="0">
            <stop offset="0" stopColor="#c8442c" />
            <stop offset="0.35" stopColor="#e2763a" />
            <stop offset="0.7" stopColor="#e9c43b" />
            <stop offset="1" stopColor="#6aae4f" />
          </linearGradient>
        </defs>
        <path d={busur(0, 100)} fill="none" stroke="var(--line)" strokeWidth="16" strokeLinecap="round" />
        {skorSesudah > skor ? <path d={busur(0, skorSesudah)} fill="none" stroke="var(--ink)" strokeOpacity="0.12" strokeWidth="16" strokeLinecap="round" /> : null}
        {skor > 0 ? <path d={busur(0, skor)} fill="none" stroke="url(#gradien-skor)" strokeWidth="16" strokeLinecap="round" /> : null}

        {TANDA.map((v, i) => {
          // Makin rendah skor, makin besar apinya. Hanya api terdekat dengan skor sekarang yang menyala.
          const besar = 1.2 - i * 0.16;
          // Tengah api di luar busur; api besar sedikit lebih jauh supaya jarak tepinya ke busur sama.
          const [x, y] = titik(v, R + 12 + 11 * besar);
          const nyala = i === Math.round(Math.min(Math.max(skor, 0), 100) / 25);
          return (
            <g key={v} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${besar}) translate(-12 -12)`}>
              <path d={API} fill={nyala ? "var(--ember)" : "none"} stroke={nyala ? "var(--ember)" : "var(--line-2)"} strokeWidth={1.6 / besar} strokeLinejoin="round" />
            </g>
          );
        })}

        <line x1={CX} y1={CY} x2={jx.toFixed(2)} y2={jy.toFixed(2)} stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="7" fill="var(--ink)" />
        <circle cx={CX} cy={CY} r="2.5" fill="var(--surface)" />

        <text x={CX - R} y={CY + 18} textAnchor="middle" className="fill-muted text-[11px]">
          0
        </text>
        <text x={CX + R} y={CY + 18} textAnchor="middle" className="fill-muted text-[11px]">
          100
        </text>
      </svg>
    </div>
  );
}
