import type { CSSProperties } from "react";
import { PenggerakGulir } from "@/components/beranda/gerak/PenggerakGulir";
import { AngkaHitung } from "@/components/ui/AngkaHitung";
import { Panel } from "@/components/ui/Panel";
import { AI, AKIBAT_UJI, CATATAN_HARGA, CATATAN_PAKET, CATATAN_PARAMETER, KEPALA, KETERANGAN, RINGKAS, UJI, type Tingkat } from "@/content/dataPage";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { namaAksi } from "@/lib/prioritas";
import type { DataPage } from "@/server/queries";
import { DaftarIsi } from "./DaftarIsi";
import { GulirKeHash } from "./GulirKeHash";

/** Jeda muncul bertahap untuk [data-muncul] (dibaca CSS sebagai --tunda). */
const tunda = (ms: number) => ({ ["--tunda" as string]: `${ms}ms` }) as CSSProperties;

/*
 * Sumber dan Batasan Data (App Flow v2 §3.4). Isinya sama untuk semua desa dan dibaca dari basis data
 * (GET /api/data): sumber, sensor, batasan, paket minimum, harga acuan, parameter/gerbang, dan AI.
 * Pola tampilan mengikuti layar lain: judul berupa pertanyaan, kotak ringkasan, lalu satu Panel per bagian.
 */

const TINGKAT: Record<Tingkat, { teks: string; kelas: string; ikon: React.ReactNode }> = {
  batasan: {
    teks: "Batasan",
    kelas: "bg-danger-soft text-danger",
    ikon: <path d="M12 8v5M12 16h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  },
  peringatan: { teks: "Peringatan", kelas: "bg-warn-soft text-warn", ikon: <path d="M12 8v5M12 16h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
  info: { teks: "Info", kelas: "bg-water-soft text-water", ikon: <path d="M12 11v5M12 8h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
};

/** Label `meta.label`: parameter dihitung, ditetapkan tim, atau hasil. */
const LABEL_META: Record<DataPage["meta"][number]["label"], { teks: string; kelas: string }> = {
  parameter: { teks: "parameter", kelas: "bg-surface-2 text-muted" },
  asumsi_tim: { teks: "ditetapkan tim", kelas: "bg-surface-2 text-muted" },
  hasil: { teks: "hasil", kelas: "bg-water-soft text-water" },
};

const DAFTAR_ISI = [
  ["sumber", "Sumber"],
  ["sensor", "Sensor"],
  ["batasan", "Batasan data"],
  ["paket", "Paket minimum dan harga"],
  ["parameter", "Parameter"],
  ["gerbang", "Gerbang"],
  ["ai", "Penggunaan AI"],
] as const;

const th = "px-4 py-2.5 text-left text-sm font-semibold text-muted";
const td = "px-4 py-3 align-top";

function Bagian({ id, judul, ket, children }: { id: string; judul: string; ket?: string; children: React.ReactNode }) {
  return (
    <div data-muncul>
      <Panel className="p-5 md:p-6">
        <div id={id} aria-labelledby={`${id}-j`} role="region" className="scroll-mt-36">
          <h2 id={`${id}-j`} className="flex items-center gap-2.5 text-lg font-bold">
            <span aria-hidden="true" className="tabular flex size-7 items-center justify-center rounded-lg bg-ember-soft text-xs font-bold text-ember">
              {String(DAFTAR_ISI.findIndex(([x]) => x === id) + 1).padStart(2, "0")}
            </span>
            {judul}
          </h2>
          {ket ? <p className="mt-0.5 text-sm text-muted">{ket}</p> : null}
          <div className="mt-4">{children}</div>
        </div>
      </Panel>
    </div>
  );
}

/** Tabel yang bisa digeser di HP. Tanpa bingkai sendiri karena sudah di dalam Panel. */
function Tabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto md:-mx-6" tabIndex={0} role="region" aria-label={label}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function Kepala({ kolom, kanan = [] }: { kolom: string[]; kanan?: number[] }) {
  return (
    <thead>
      <tr className="border-y border-line bg-paper">
        {kolom.map((k, i) => (
          <th key={k} scope="col" className={`${th} ${kanan.includes(i) ? "text-right" : ""} first:pl-5 last:pr-5 md:first:pl-6 md:last:pr-6`}>
            {k}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Kosong() {
  return <p className="text-sm text-muted">Belum ada data.</p>;
}

const baris = "border-b border-line last:border-0 [&>*:first-child]:pl-5 [&>*:last-child]:pr-5 md:[&>*:first-child]:pl-6 md:[&>*:last-child]:pr-6";

export function DataView({ data }: { data: DataPage }) {
  const jumlahBatasan = data.dq.filter((b) => b.tingkat === "batasan").length;
  const satelit = [...new Set(data.sensor.map((s) => s.satellite))];
  const tahun = [...new Set(data.sensor.map((s) => s.tahun))].sort((a, b) => a - b);
  const namaItem = new Map(data.paket.map((p) => [p.itemKode, { nama: p.nama, satuan: p.satuan }]));
  const ringkas = [
    { nilai: data.sumber.length, satuan: "sumber", ket: RINGKAS.sumber },
    { nilai: satelit.length, satuan: "sensor", ket: RINGKAS.sensor },
    {
      nilai: tahun.length,
      satuan: "tahun",
      ket: tahun.length > 0 ? `Riwayat ${tahun[0]}–${tahun[tahun.length - 1]}` : RINGKAS.tahunKosong,
    },
    { nilai: data.dq.length, satuan: "catatan batas", ket: `${formatAngka(jumlahBatasan)} ${RINGKAS.batasanKeras}` },
  ];

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-6 md:px-8 md:py-8">
      {/* Animasi masuk: bagian muncul bertahap saat terlihat (tanpa JS atau gerak dikurangi: tampil biasa). */}
      <PenggerakGulir />
      <header>
        <p data-muncul className="text-sm font-semibold text-ember">
          {KEPALA.kicker}
        </p>
        <h1 data-muncul style={tunda(80)} className="mt-1 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {KEPALA.judul}
        </h1>
        <p data-muncul style={tunda(150)} className="mt-1 max-w-[65ch] text-muted">
          {KEPALA.ringkas}
        </p>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ringkas.map((r, i) => (
          <div
            key={r.satuan}
            data-muncul
            style={tunda(280 + i * 80)}
            className="flex flex-col-reverse justify-end rounded-panel border border-line bg-surface p-4 shadow-card"
          >
            <dd className="mt-0.5 text-sm text-muted">{r.ket}</dd>
            <dt>
              <span className="tabular text-3xl font-semibold tracking-[-0.03em]">
                <AngkaHitung nilai={r.nilai} tunda={300 + i * 80} />
              </span>{" "}
              <span className="text-sm">{r.satuan}</span>
            </dt>
          </div>
        ))}
      </dl>

      <DaftarIsi isi={DAFTAR_ISI} />

      <div className="mt-2 space-y-4">
        <Bagian id="sumber" judul="Sumber" ket={KETERANGAN.sumber}>
          {data.sumber.length > 0 ? (
            <Tabel label="Tabel sumber data">
              <Kepala kolom={["Sumber", "Lisensi", "Periode", "Diakses"]} />
              <tbody>
                {data.sumber.map((s) => (
                  <tr key={s.kode} className={baris}>
                    <th scope="row" className={`${td} min-w-[200px] text-left font-semibold`}>
                      {s.nama}
                      {s.url ? (
                        <a href={s.url} className="mt-0.5 block text-sm font-normal text-water underline underline-offset-2">
                          {s.url}
                        </a>
                      ) : null}
                    </th>
                    <td className={`${td} min-w-[140px]`}>{s.lisensi}</td>
                    <td className={`${td} min-w-[150px]`}>{s.periode}</td>
                    <td className={`${td} min-w-[120px]`}>{s.diakses}</td>
                  </tr>
                ))}
              </tbody>
            </Tabel>
          ) : (
            <Kosong />
          )}
        </Bagian>

        <Bagian id="sensor" judul="Sensor" ket={KETERANGAN.sensor}>
          {data.sensor.length > 0 ? (
            <Tabel label="Deteksi per tahun">
              <Kepala kolom={["Tahun", "Satelit", "Sumber", "Deteksi"]} kanan={[0, 3]} />
              <tbody>
                {data.sensor.map((s) => (
                  <tr key={`${s.tahun}-${s.satellite}-${s.sumber}`} className={baris}>
                    <td className={`${td} tabular whitespace-nowrap text-right`}>{formatAngka(s.tahun)}</td>
                    <td className={`${td} min-w-[130px]`}>{s.satellite}</td>
                    <td className={td}>{s.sumber}</td>
                    <td className={`${td} tabular whitespace-nowrap text-right`}>{formatAngka(s.nDet)}</td>
                  </tr>
                ))}
              </tbody>
            </Tabel>
          ) : (
            <Kosong />
          )}
          <p className="mt-3 text-sm text-muted">{KETERANGAN.sensorCatatan}</p>
        </Bagian>

        <Bagian id="batasan" judul="Batasan data" ket={KETERANGAN.batasan}>
          {data.dq.length > 0 ? (
            <ul className="space-y-2">
              {data.dq.map((b) => {
                const t = TINGKAT[b.tingkat];
                return (
                  <li key={b.kode} className="flex gap-3 rounded-xl border border-line px-4 py-3">
                    <span className={`inline-flex h-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${t.kelas}`}>
                      <svg
                        aria-hidden="true"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {t.ikon}
                      </svg>
                      {t.teks}
                    </span>
                    <span className="text-sm">
                      <span className="block font-semibold">{b.judul}</span>
                      <span className="block">{b.isi}</span>
                      {b.sumberUrl ? (
                        <a href={b.sumberUrl} className="mt-0.5 inline-block text-water underline underline-offset-2">
                          {b.sumberUrl}
                        </a>
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Kosong />
          )}
        </Bagian>

        <Bagian id="paket" judul="Paket minimum dan harga" ket={KETERANGAN.paket}>
          <h3 className="font-semibold">Paket minimum satu musim</h3>
          <div className="mt-2">
            {data.paket.length > 0 ? (
              <Tabel label="Paket minimum">
                <Kepala kolom={["Item", "Target", "Sumber", "Label"]} kanan={[1]} />
                <tbody>
                  {data.paket.map((p) => (
                    <tr key={p.itemKode} className={baris}>
                      <th scope="row" className={`${td} min-w-[140px] text-left font-semibold`}>
                        {p.nama}
                      </th>
                      <td className={`${td} tabular min-w-[110px] text-right`}>
                        {formatAngka(p.target)} {p.satuan}
                      </td>
                      <td className={`${td} min-w-[180px]`}>{p.sumber}</td>
                      <td className={td}>
                        <span className="whitespace-nowrap rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold text-muted">
                          {p.label === "asumsi_tim" ? "ditetapkan tim" : "bersumber"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tabel>
            ) : (
              <Kosong />
            )}
          </div>
          <p className="mt-3 text-sm text-muted">{CATATAN_PAKET}</p>

          <h3 className="mt-6 font-semibold">Harga acuan</h3>
          <div className="mt-2">
            {data.harga.length > 0 ? (
              <Tabel label="Harga acuan">
                <Kepala kolom={["Item", "Aksi", "Harga", "Sumber", "Catatan"]} kanan={[2]} />
                <tbody>
                  {data.harga.map((h) => {
                    const item = namaItem.get(h.itemKode);
                    return (
                      <tr key={`${h.itemKode}-${h.aksi}`} className={baris}>
                        <th scope="row" className={`${td} min-w-[130px] text-left font-semibold`}>
                          {item?.nama ?? h.itemKode}
                        </th>
                        <td className={td}>{namaAksi(h.aksi)}</td>
                        <td className={`${td} tabular whitespace-nowrap text-right`}>
                          {formatRupiah(h.hargaRp)}
                          {item ? <span className="block text-sm font-normal text-muted">/{item.satuan}</span> : null}
                        </td>
                        <td className={`${td} min-w-[180px]`}>{h.sumber}</td>
                        <td className={`${td} min-w-[180px] text-muted`}>
                          {h.tanggal ? <span className="block text-sm">Diperiksa {formatTanggal(h.tanggal)}</span> : null}
                          {h.catatan}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Tabel>
            ) : (
              <Kosong />
            )}
          </div>
          <p className="mt-3 text-sm text-muted">{CATATAN_HARGA}</p>
        </Bagian>

        <Bagian id="parameter" judul="Parameter" ket={KETERANGAN.parameter}>
          {data.meta.length > 0 ? (
            <Tabel label="Parameter">
              <Kepala kolom={["Kunci", "Nilai", "Label"]} kanan={[1]} />
              <tbody>
                {data.meta.map((p) => {
                  const label = LABEL_META[p.label];
                  return (
                    <tr key={p.kunci} className={baris}>
                      <th scope="row" className={`${td} text-left font-mono text-xs font-semibold`}>
                        {p.kunci}
                      </th>
                      <td className={`${td} tabular whitespace-nowrap text-right`}>{p.nilai}</td>
                      <td className={td}>
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${label.kelas}`}>{label.teks}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Tabel>
          ) : (
            <Kosong />
          )}
          <p className="mt-3 text-sm text-muted">{CATATAN_PARAMETER}</p>
        </Bagian>

        <Bagian id="gerbang" judul="Gerbang" ket={KETERANGAN.gerbang}>
          <div className="grid gap-3 md:grid-cols-2">
            {UJI.map((u) => (
              <div key={u.label} className="rounded-xl border border-line p-4">
                <p className="text-sm font-semibold text-muted">{u.label}</p>
                <p className="font-bold">{u.judul}</p>
                <p className="mt-1 text-sm">{u.isi}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{AKIBAT_UJI}</p>
        </Bagian>

        <Bagian id="ai" judul="Penggunaan AI" ket={KETERANGAN.ai}>
          <dl className="grid gap-3 sm:grid-cols-2">
            {AI.map((a) => (
              <div key={a.label} className="rounded-xl border border-line p-4">
                <dt className="text-sm font-semibold text-muted">{a.label}</dt>
                <dd className="mt-0.5 text-sm">{a.isi}</dd>
              </div>
            ))}
          </dl>
        </Bagian>
      </div>
      <GulirKeHash />
    </div>
  );
}
