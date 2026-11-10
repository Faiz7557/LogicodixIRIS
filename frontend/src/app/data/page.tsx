import type { Metadata } from "next";
import Link from "next/link";
import { TEKS_BELUM_DIUJI } from "@/components/ui/PernyataanAsumsi";
import { BATASAN, HARGA, PAKET, PARAMETER, SUMBER, TAHUN_SENSOR, type Tingkat } from "@/content/dataPage";

export const metadata: Metadata = { title: "Data dan Asumsi" };

const TINGKAT: Record<Tingkat, { teks: string; kelas: string }> = {
  batasan: { teks: "Batasan", kelas: "border-danger/50 text-danger" },
  peringatan: { teks: "Peringatan", kelas: "border-warn/60 text-warn" },
  info: { teks: "Info", kelas: "border-water/50 text-water" },
};

const DAFTAR_ISI = [
  ["status", "Status produk"],
  ["sumber", "Sumber"],
  ["sensor", "Sensor"],
  ["batasan", "Batasan data"],
  ["paket", "Paket minimum dan harga"],
  ["parameter", "Parameter"],
  ["gerbang", "Gerbang"],
  ["ai", "Penggunaan AI"],
] as const;

function Seksi({ id, judul, children }: { id: string; judul: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-j`} className="mt-10 scroll-mt-4">
      <h2 id={`${id}-j`} className="text-xl font-bold">
        {judul}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function TabelGulir({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface" tabIndex={0} role="region" aria-label={label}>
      {children}
    </div>
  );
}

const th = "px-3 py-2 text-left font-semibold";
const td = "px-3 py-2 align-top";

export default function DataPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-6">
      <h1 className="text-2xl font-bold">Data dan Asumsi</h1>
      <p className="mt-2 text-xl font-semibold leading-snug">Semua yang dipakai produk ini, asalnya, dan batasnya.</p>

      <nav aria-label="Daftar isi" className="mt-4 flex flex-wrap gap-2">
        {DAFTAR_ISI.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="flex min-h-11 items-center rounded-card border border-line bg-surface px-3 text-sm font-semibold text-water">
            {label}
          </a>
        ))}
      </nav>

      <Seksi id="status" judul="Status produk">
        <p className="rounded-card border border-warn/40 bg-surface px-4 py-3 font-semibold">{TEKS_BELUM_DIUJI}</p>
        <p className="mt-2 text-muted">
          Peran pengguna dan kebutuhannya berasal dari sumber sekunder. Produk belum diuji dengan sekdes atau ketua MPA. Isian demo adalah data uji.
        </p>
      </Seksi>

      <Seksi id="sumber" judul="Sumber">
        <TabelGulir label="Tabel sumber data">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={th}>Sumber</th>
                <th scope="col" className={th}>Lisensi</th>
                <th scope="col" className={th}>Periode</th>
                <th scope="col" className={th}>Diakses</th>
              </tr>
            </thead>
            <tbody>
              {SUMBER.map((s) => (
                <tr key={s.nama} className="border-b border-line last:border-0">
                  <th scope="row" className={`${td} font-semibold`}>{s.nama}</th>
                  <td className={td}>{s.lisensi}</td>
                  <td className={td}>{s.periode}</td>
                  <td className={td}>{s.akses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabelGulir>
        <p className="mt-2 text-sm text-muted">GADM tidak dipakai karena lisensinya melarang redistribusi.</p>
      </Seksi>

      <Seksi id="sensor" judul="Sensor">
        <p>
          Satu sensor agar jumlah deteksi konsisten: VIIRS S-NPP, hanya titik dengan confidence <em>nominal</em> atau <em>high</em>. NOAA-20 dan NOAA-21
          tidak digabung. Data dibagi menurut sumber SP (arsip standar) dan NRT (hampir waktu nyata).
        </p>
        <TabelGulir label="Deteksi per tahun">
          <table className="mt-0 w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={th}>Tahun</th>
                <th scope="col" className={th}>Satelit</th>
                <th scope="col" className={th}>Sumber</th>
                <th scope="col" className={`${th} text-right`}>Jumlah deteksi</th>
              </tr>
            </thead>
            <tbody>
              {TAHUN_SENSOR.map((t) => (
                <tr key={t} className="border-b border-line last:border-0">
                  <td className={`${td} tabular`}>{t}</td>
                  <td className={td}>S-NPP</td>
                  <td className={td}>{t >= 2026 ? "SP / NRT" : "SP"}</td>
                  <td className={`${td} text-right text-muted`}>menunggu pipeline</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabelGulir>
        <p className="mt-2 text-sm text-muted">Tanggal terakhir data nyata 2026 dan celah antara SP dan NRT ditulis di sini setelah pipeline selesai.</p>
      </Seksi>

      <Seksi id="batasan" judul="Batasan data">
        <ul className="divide-y divide-line rounded-card border border-line bg-surface">
          {BATASAN.map((b) => (
            <li key={b.kode} className="flex gap-3 px-4 py-3">
              <span className={`mt-0.5 h-fit shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${TINGKAT[b.tingkat].kelas}`}>{TINGKAT[b.tingkat].teks}</span>
              <span>{b.isi}</span>
            </li>
          ))}
        </ul>
      </Seksi>

      <Seksi id="paket" judul="Paket minimum dan harga">
        <p className="rounded-card border border-line bg-surface px-4 py-3">
          <strong>Asumsi tim.</strong> Semua jumlah dan bobot di bawah adalah asumsi tim, bukan standar yang mengikat desa. Desa boleh mengubahnya dengan alasan.
        </p>
        <h3 className="mt-4 font-bold">Paket minimum satu musim</h3>
        <TabelGulir label="Paket minimum">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={th}>Item</th>
                <th scope="col" className={th}>Target</th>
                <th scope="col" className={th}>Bobot</th>
                <th scope="col" className={th}>Jangkar sekunder</th>
              </tr>
            </thead>
            <tbody>
              {PAKET.map((p) => (
                <tr key={p.item} className="border-b border-line last:border-0">
                  <th scope="row" className={`${td} font-semibold`}>{p.item}</th>
                  <td className={`${td} tabular`}>{p.target} {p.satuan}</td>
                  <td className={`${td} tabular`}>{p.bobot}</td>
                  <td className={td}>{p.jangkar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabelGulir>
        <p className="mt-2 text-sm text-muted">
          Keterangan untuk desa Kalteng: Pergub Kalteng 35/2025 Pasal 18-19 memuat pompa jinjing 3, pompa punggung 10, dan selang 50 buah per regu. Kalimantan
          Barat belum memiliki angka alat per regu pada Pergub 56/2025. Panjang selang bukan target; keterangan meter selalu turunan.
        </p>
        <h3 className="mt-4 font-bold">Harga acuan</h3>
        <TabelGulir label="Harga acuan">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={th}>Item</th>
                <th scope="col" className={th}>Aksi</th>
                <th scope="col" className={th}>Harga</th>
                <th scope="col" className={th}>Sumber</th>
                <th scope="col" className={th}>Catatan</th>
              </tr>
            </thead>
            <tbody>
              {HARGA.map((h) => (
                <tr key={`${h.item}-${h.aksi}`} className="border-b border-line last:border-0">
                  <th scope="row" className={`${td} font-semibold`}>{h.item}</th>
                  <td className={td}>{h.aksi}</td>
                  <td className={`${td} tabular`}>{h.harga}</td>
                  <td className={td}>{h.sumber}</td>
                  <td className={td}>{h.catatan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabelGulir>
        <p className="mt-2 text-sm text-muted">Harga tanpa sumber tidak dimasukkan ke data.</p>
      </Seksi>

      <Seksi id="parameter" judul="Parameter">
        <TabelGulir label="Parameter">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className={th}>Kunci</th>
                <th scope="col" className={th}>Nilai</th>
                <th scope="col" className={th}>Label</th>
                <th scope="col" className={th}>Arti</th>
              </tr>
            </thead>
            <tbody>
              {PARAMETER.map((p) => (
                <tr key={p.kunci} className="border-b border-line last:border-0">
                  <th scope="row" className={`${td} font-mono text-xs font-semibold`}>{p.kunci}</th>
                  <td className={`${td} tabular`}>{p.nilai}</td>
                  <td className={td}>{p.label === "asumsi_tim" ? "asumsi tim" : "parameter"}</td>
                  <td className={td}>{p.arti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabelGulir>
        <p className="mt-2 text-sm text-muted">Sensitivitas penyangga (0, 2, 5 km), ambang hari (1, 2, 3), dan penarikan desa (0, 2, 5) ditampilkan di sini setelah pipeline selesai.</p>
      </Seksi>

      <Seksi id="gerbang" judul="Gerbang">
        <p>Sebelum data 2026 dibuka, kami menetapkan dua uji. Hasilnya menentukan apa yang boleh kami klaim, dan dilaporkan apa adanya.</p>
        <Link href="/time-machine" className="inline-flex min-h-11 items-center text-water underline underline-offset-2">
          Lihat hasilnya di Time Machine
        </Link>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li><strong>Uji A, riwayat memberi sinyal:</strong> laju terdeteksi desa tampak aman minimal 1,5 kali desa tanpa riwayat ekstrem, dengan minimal 30 desa, dan juga pada minimal 3 dari 4 kuartil luas desa.</li>
          <li><strong>Uji B, tenang tidak berarti aman:</strong> laju desa tampak aman minimal 0,6 kali desa yang baru terdeteksi.</li>
        </ul>
        <p className="mt-2 text-sm text-muted">Dua lulus: pertahankan klaim. A lulus, B gagal: lunakkan kalimat. A gagal: buang klaim &ldquo;tampak aman&rdquo;, fakta paparan tetap.</p>
      </Seksi>

      <Seksi id="ai" judul="Penggunaan AI">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Model:</strong> Claude (<code>claude-opus-5-5</code> bila kunci API tersedia).</li>
          <li><strong>Dipakai untuk:</strong> menyusun kalimat narasi dokumen usulan, dan (bila sempat) membantu mengisi formulir alat dari pesan yang ditempel.</li>
          <li><strong>Batas:</strong> AI tidak pernah menulis angka atau nama. Semua angka dan nama diisi sistem. Teks yang melanggar aturan ditolak dan diganti templat. Catatan bebas pengguna tidak dikirim ke AI.</li>
          <li><strong>Tanpa AI:</strong> semua fitur utama tetap jalan tanpa internet dan tanpa kunci API; dokumen memakai templat.</li>
          <li><strong>Tinjauan manusia:</strong> setiap dokumen wajib ditinjau desa sebelum dipakai.</li>
        </ul>
      </Seksi>
    </div>
  );
}
