import Link from "next/link";
import { TEKS_BELUM_DIUJI } from "@/components/ui/PernyataanAsumsi";
import { Panel } from "@/components/ui/Panel";
import { GulirKeHash } from "./GulirKeHash";
import { BATASAN, HARGA, PAKET, PARAMETER, SUMBER, TAHUN_SENSOR, type Tingkat } from "@/content/dataPage";

/*
 * Data dan Asumsi (App Flow v2 §3.4). Isinya tetap dan sama untuk semua desa: sumber, sensor, batasan,
 * paket minimum, harga acuan, parameter, gerbang, dan penggunaan AI. Tidak membaca data desa mana pun.
 * Pola tampilan mengikuti layar lain: judul berupa pertanyaan, kotak ringkasan, lalu satu Panel per bagian.
 */

const TINGKAT: Record<Tingkat, { teks: string; kelas: string; ikon: React.ReactNode }> = {
  batasan: { teks: "Batasan", kelas: "bg-danger-soft text-danger", ikon: <path d="M12 8v5M12 16h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /> },
  peringatan: { teks: "Peringatan", kelas: "bg-warn-soft text-warn", ikon: <path d="M12 8v5M12 16h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
  info: { teks: "Info", kelas: "bg-water-soft text-water", ikon: <path d="M12 11v5M12 8h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" /> },
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
    <Panel className="p-5 md:p-6">
      <div id={id} aria-labelledby={`${id}-j`} role="region" className="scroll-mt-36">
        <h2 id={`${id}-j`} className="text-lg font-bold">
          {judul}
        </h2>
        {ket ? <p className="mt-0.5 text-sm text-muted">{ket}</p> : null}
        <div className="mt-4">{children}</div>
      </div>
    </Panel>
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

const baris = "border-b border-line last:border-0 [&>*:first-child]:pl-5 [&>*:last-child]:pr-5 md:[&>*:first-child]:pl-6 md:[&>*:last-child]:pr-6";

export function DataView() {
  const jumlahBatasan = BATASAN.filter((b) => b.tingkat === "batasan").length;
  const ringkas = [
    { angka: String(SUMBER.length), satuan: "sumber", ket: "Data publik, lisensi dicantumkan" },
    { angka: "1", satuan: "sensor", ket: "VIIRS S-NPP, tanpa NOAA-20/21" },
    { angka: String(TAHUN_SENSOR.length), satuan: "tahun", ket: `Riwayat ${TAHUN_SENSOR[0]}–${TAHUN_SENSOR.at(-1)}` },
    { angka: String(BATASAN.length), satuan: "catatan batas", ket: `${jumlahBatasan} di antaranya batasan keras` },
  ];

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-6 md:px-8 md:py-8">
      <header>
        <p className="text-sm font-semibold text-ember">Sumber dan batasan · berlaku untuk semua desa</p>
        <h1 className="mt-1 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">Dari mana angka SiapKemarau berasal?</h1>
        <p className="mt-1 max-w-[65ch] text-muted">Semua yang dipakai produk ini, asalnya, dan batasnya. Isi halaman ini sama untuk setiap desa.</p>
      </header>

      {/* Status produk: hal pertama yang perlu diketahui pembaca. */}
      <section aria-labelledby="status-j" id="status" className="mt-6 flex gap-3 rounded-panel border-2 border-warn bg-warn-soft px-5 py-4">
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-warn">
          {TINGKAT.peringatan.ikon}
        </svg>
        <div>
          <h2 id="status-j" className="font-bold text-warn">
            Status produk: {TEKS_BELUM_DIUJI.charAt(0).toLowerCase() + TEKS_BELUM_DIUJI.slice(1)}
          </h2>
          <p className="mt-1 text-sm">
            Peran pengguna dan kebutuhannya berasal dari sumber sekunder. Produk belum diuji dengan sekdes atau ketua MPA. Isian demo adalah data uji.
          </p>
        </div>
      </section>

      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ringkas.map((r) => (
          <div key={r.satuan} className="flex flex-col-reverse justify-end rounded-panel bg-surface-2 p-4">
            <dd className="mt-0.5 text-sm text-muted">{r.ket}</dd>
            <dt>
              <span className="tabular text-3xl font-semibold tracking-[-0.03em]">{r.angka}</span> <span className="text-sm">{r.satuan}</span>
            </dt>
          </div>
        ))}
      </dl>

      <nav aria-label="Daftar isi" className="sticky top-0 z-10 -mx-4 mt-4 overflow-x-auto [scrollbar-width:none] bg-paper/95 px-4 py-2 backdrop-blur md:mx-0 md:px-0">
        <ul className="flex gap-2 md:flex-wrap">
          {DAFTAR_ISI.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="flex min-h-10 items-center whitespace-nowrap rounded-full border border-line bg-surface px-3.5 text-sm font-semibold hover:border-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-2 space-y-4">
        <Bagian id="sumber" judul="Sumber" ket="Data mentah yang diolah pipeline. GADM tidak dipakai karena lisensinya melarang redistribusi.">
          <Tabel label="Tabel sumber data">
            <Kepala kolom={["Sumber", "Lisensi", "Periode", "Diakses"]} />
            <tbody>
              {SUMBER.map((s) => (
                <tr key={s.nama} className={baris}>
                  <th scope="row" className={`${td} min-w-[200px] text-left font-semibold`}>{s.nama}</th>
                  <td className={`${td} min-w-[140px]`}>{s.lisensi}</td>
                  <td className={`${td} min-w-[150px]`}>{s.periode}</td>
                  <td className={`${td} min-w-[120px]`}>{s.akses}</td>
                </tr>
              ))}
            </tbody>
          </Tabel>
        </Bagian>

        <Bagian
          id="sensor"
          judul="Sensor"
          ket="Satu sensor agar jumlah deteksi konsisten: VIIRS S-NPP, hanya titik dengan confidence nominal atau high. Data dibagi menurut sumber SP (arsip standar) dan NRT (hampir waktu nyata)."
        >
          <ul aria-label="Deteksi per tahun" className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
            {TAHUN_SENSOR.map((t) => (
              <li key={t} className="rounded-xl border border-line px-3 py-2">
                <span className="tabular block font-semibold">{t}</span>
                <span className="block text-xs text-muted">S-NPP · {t >= 2026 ? "SP/NRT" : "SP"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">Jumlah deteksi per tahun, tanggal terakhir data 2026, dan celah SP–NRT ditulis di sini setelah pipeline selesai.</p>
        </Bagian>

        <Bagian id="batasan" judul="Batasan data" ket="Hal yang tidak bisa disimpulkan dari data ini.">
          <ul className="space-y-2">
            {BATASAN.map((b) => {
              const t = TINGKAT[b.tingkat];
              return (
                <li key={b.kode} className="flex gap-3 rounded-xl border border-line px-4 py-3">
                  <span className={`inline-flex h-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${t.kelas}`}>
                    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      {t.ikon}
                    </svg>
                    {t.teks}
                  </span>
                  <span className="text-sm">{b.isi}</span>
                </li>
              );
            })}
          </ul>
        </Bagian>

        <Bagian id="paket" judul="Paket minimum dan harga" ket="Asumsi tim, bukan standar yang mengikat desa. Desa boleh mengubahnya dengan alasan.">
          <h3 className="font-semibold">Paket minimum satu musim</h3>
          <div className="mt-2">
            <Tabel label="Paket minimum">
              <Kepala kolom={["Item", "Target", "Bobot", "Jangkar sekunder"]} kanan={[2]} />
              <tbody>
                {PAKET.map((p) => (
                  <tr key={p.item} className={baris}>
                    <th scope="row" className={`${td} min-w-[140px] text-left font-semibold`}>{p.item}</th>
                    <td className={`${td} tabular min-w-[110px]`}>{p.target} {p.satuan}</td>
                    <td className={`${td} tabular text-right`}>{p.bobot}</td>
                    <td className={`${td} min-w-[220px]`}>{p.jangkar}</td>
                  </tr>
                ))}
              </tbody>
            </Tabel>
          </div>
          <p className="mt-3 text-sm text-muted">
            Desa Kalteng: Pergub Kalteng 35/2025 Pasal 18–19 memuat pompa jinjing 3, pompa punggung 10, dan selang 50 buah per regu. Kalimantan Barat belum
            memiliki angka alat per regu pada Pergub 56/2025. Panjang selang bukan target; keterangan meter selalu turunan.
          </p>

          <h3 className="mt-6 font-semibold">Harga acuan</h3>
          <div className="mt-2">
            <Tabel label="Harga acuan">
              <Kepala kolom={["Item", "Aksi", "Harga", "Sumber", "Catatan"]} kanan={[2]} />
              <tbody>
                {HARGA.map((h) => (
                  <tr key={`${h.item}-${h.aksi}`} className={baris}>
                    <th scope="row" className={`${td} min-w-[130px] text-left font-semibold`}>{h.item}</th>
                    <td className={td}>{h.aksi}</td>
                    <td className={`${td} tabular whitespace-nowrap text-right`}>{h.harga}</td>
                    <td className={`${td} min-w-[180px]`}>{h.sumber}</td>
                    <td className={`${td} min-w-[180px] text-muted`}>{h.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </Tabel>
          </div>
          <p className="mt-3 text-sm text-muted">Harga tanpa sumber tidak dimasukkan ke data.</p>
        </Bagian>

        <Bagian id="parameter" judul="Parameter" ket="Angka yang mengatur perhitungan. Label menunjukkan mana yang asumsi tim.">
          <Tabel label="Parameter">
            <Kepala kolom={["Kunci", "Nilai", "Label", "Arti"]} kanan={[1]} />
            <tbody>
              {PARAMETER.map((p) => (
                <tr key={p.kunci} className={baris}>
                  <th scope="row" className={`${td} text-left font-mono text-xs font-semibold`}>{p.kunci}</th>
                  <td className={`${td} tabular whitespace-nowrap text-right`}>{p.nilai}</td>
                  <td className={td}>
                    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${p.label === "asumsi_tim" ? "bg-warn-soft text-warn" : "bg-surface-2 text-muted"}`}>
                      {p.label === "asumsi_tim" ? "asumsi tim" : "parameter"}
                    </span>
                  </td>
                  <td className={`${td} min-w-[220px]`}>{p.arti}</td>
                </tr>
              ))}
            </tbody>
          </Tabel>
          <p className="mt-3 text-sm text-muted">Sensitivitas penyangga (0, 2, 5 km), ambang hari (1, 2, 3), dan penarikan desa (0, 2, 5) ditampilkan setelah pipeline selesai.</p>
        </Bagian>

        <Bagian id="gerbang" judul="Gerbang" ket="Dua uji yang ditetapkan sebelum data 2026 dibuka. Hasilnya menentukan klaim apa yang boleh dipakai, dan dilaporkan apa adanya.">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-line p-4">
              <p className="text-sm font-semibold text-muted">Uji A</p>
              <p className="font-bold">Riwayat memberi sinyal</p>
              <p className="mt-1 text-sm">
                Laju terdeteksi desa tampak aman minimal 1,5 kali desa tanpa riwayat ekstrem, dengan minimal 30 desa, dan juga pada minimal 3 dari 4 kuartil
                luas desa.
              </p>
            </div>
            <div className="rounded-xl border border-line p-4">
              <p className="text-sm font-semibold text-muted">Uji B</p>
              <p className="font-bold">Tenang tidak berarti aman</p>
              <p className="mt-1 text-sm">Laju desa tampak aman minimal 0,6 kali desa yang baru terdeteksi.</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">
            Dua lulus: pertahankan klaim. A lulus, B gagal: lunakkan kalimat. A gagal: buang klaim &ldquo;tampak aman&rdquo;, fakta paparan tetap.
          </p>
          <Link href="/time-machine" className="mt-1 inline-flex min-h-11 items-center font-semibold text-water underline underline-offset-2">
            Lihat hasilnya di Time Machine
          </Link>
        </Bagian>

        <Bagian id="ai" judul="Penggunaan AI" ket="AI hanya membantu menulis kalimat; angka dan nama selalu dari sistem.">
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["Model", <>Claude (<code>claude-opus-5-5</code> bila kunci API tersedia).</>],
              ["Dipakai untuk", "Menyusun kalimat narasi dokumen usulan, dan (bila sempat) membantu mengisi formulir alat dari pesan yang ditempel."],
              ["Batas", "AI tidak pernah menulis angka atau nama. Teks yang melanggar aturan ditolak dan diganti templat. Catatan bebas pengguna tidak dikirim ke AI."],
              ["Tanpa AI", "Semua fitur utama tetap jalan tanpa internet dan tanpa kunci API; dokumen memakai templat."],
              ["Tinjauan manusia", "Setiap dokumen wajib ditinjau desa sebelum dipakai."],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-xl border border-line p-4">
                <dt className="text-sm font-semibold text-muted">{k}</dt>
                <dd className="mt-0.5 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </Bagian>
      </div>
      <GulirKeHash />
    </div>
  );
}
