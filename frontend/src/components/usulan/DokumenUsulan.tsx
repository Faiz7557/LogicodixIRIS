import { AiBadge } from "@/components/ui/AiBadge";
import { PernyataanAsumsi, TEKS_DASAR_APBDES } from "@/components/ui/PernyataanAsumsi";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { KANAL_META } from "@/lib/usulan";
import type { Usulan } from "@/lib/types";
import { namaAksi } from "@/lib/prioritas";

/**
 * Dokumen usulan (App Flow v2 §3.10). Rapi di A4 tanpa navigasi dan latar (Design Brief §8).
 * Seluruh isi berasal dari objek Usulan yang sudah dibekukan saat terbit.
 * Teks dirender sebagai teks biasa, tidak pernah sebagai HTML.
 */
export function DokumenUsulan({ usulan, isDemo }: { usulan: Usulan; isDemo: boolean }) {
  const f = usulan.facts;
  const total = usulan.baris.reduce((s, b) => s + b.biayaRp, 0);
  const sumber = [...new Set(usulan.baris.map((b) => b.sumberHarga).filter(Boolean))] as string[];

  return (
    <article className="mx-auto max-w-[720px] bg-surface px-5 py-6 font-serif leading-relaxed print:max-w-none print:bg-white print:p-0 print:text-[11pt]">
      <header className="border-b-2 border-ink pb-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest">Usulan Belanja Kesiapan Karhutla</p>
        <h1 className="mt-1 text-2xl font-bold">Desa {f.desa}</h1>
        <p className="text-sm">
          Kecamatan {f.kecamatan}, Kabupaten {f.kabupaten}
        </p>
        <p className="text-sm">{formatTanggal(usulan.createdAt)}</p>
      </header>

      <section className="mt-5">
        <p>
          Kepada Yth. <strong>{KANAL_META[usulan.kanal].sapaan}</strong>
        </p>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold">1. Paparan dan kesiapan</h2>
        <p className="mt-1">
          Terdeteksi satelit pada {f.paparan}. Skor kesiapan desa {f.skor} dari 100 ({f.status}). Mata rantai terlemah: {f.rantai_terlemah}.
          Sesudah belanja yang diusulkan, skor menjadi {f.skor_sesudah}.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold">2. Belanja yang diusulkan</h2>
        <div className="mt-2 overflow-x-auto print:overflow-visible">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <caption className="sr-only">Belanja kesiapan yang disetujui desa</caption>
            <thead>
              <tr className="border-y border-ink text-left">
                <th scope="col" className="py-1.5 pr-2">No</th>
                <th scope="col" className="py-1.5 pr-2">Item</th>
                <th scope="col" className="py-1.5 pr-2">Jumlah</th>
                <th scope="col" className="py-1.5 pr-2">Alasan</th>
                <th scope="col" className="py-1.5 text-right">Biaya</th>
              </tr>
            </thead>
            <tbody>
              {usulan.baris.map((b, i) => (
                <tr key={`${b.itemKode}:${b.aksi}`} className="border-b border-line align-top">
                  <td className="py-1.5 pr-2">{i + 1}</td>
                  <td className="py-1.5 pr-2">
                    {namaAksi(b.aksi)} {b.nama ?? b.itemKode}
                  </td>
                  <td className="tabular py-1.5 pr-2">
                    {formatAngka(b.qty)} {b.satuan}
                  </td>
                  <td className="py-1.5 pr-2">{b.alasan}</td>
                  <td className="tabular py-1.5 text-right">{formatRupiah(b.biayaRp)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink font-bold">
                <td colSpan={4} className="py-1.5 pr-2 text-right">
                  Total usulan
                </td>
                <td className="tabular py-1.5 text-right">{formatRupiah(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-1 text-sm">Pagu yang dipertimbangkan desa: {f.pagu}.</p>
      </section>

      <section className="mt-5">
        <h2 className="text-lg font-bold">3. Uraian</h2>
        <p className="mt-1 whitespace-pre-line">{usulan.teks}</p>
        <div className="mt-2">
          <AiBadge sumber={usulan.sumberTeks} model={usulan.model} />
        </div>
      </section>

      <section className="mt-5">
        <PernyataanAsumsi />
        {usulan.kanal === "apbdes_perubahan" ? <p className="mt-2 text-sm">Dasar: {TEKS_DASAR_APBDES}.</p> : null}
      </section>

      <section className="mt-8 grid grid-cols-2 gap-6 text-center text-sm">
        <div>
          <p>Mengetahui,</p>
          <p className="font-semibold">Kepala Desa</p>
          <div className="h-20" />
          <p className="border-t border-ink pt-1">(.............................)</p>
        </div>
        <div>
          <p>{f.desa}, {f.tanggal}</p>
          <p className="font-semibold">Sekretaris Desa</p>
          <div className="h-20" />
          <p className="border-t border-ink pt-1">(.............................)</p>
        </div>
      </section>

      <footer className="mt-8 border-t border-line pt-3 text-xs">
        <p className="font-semibold">Lampiran: sumber data</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Paparan: deteksi satelit NASA FIRMS VIIRS S-NPP (sampai 2 Nov 2026), batas desa HDX COD-AB, porsi gambut WRI Global Peatlands.</li>
          {sumber.map((s) => (
            <li key={s}>Harga: {s}.</li>
          ))}
          <li>Paket minimum satu musim: asumsi tim.</li>
        </ul>
        {isDemo ? <p className="mt-2 font-semibold">Dokumen dari akun demonstrasi. Isian alat adalah data uji, bukan survei lapangan.</p> : null}
      </footer>
    </article>
  );
}
