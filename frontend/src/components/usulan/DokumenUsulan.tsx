import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { namaAksi } from "@/lib/prioritas";
import { JENIS_META, jenisUsulan, namaDesaSaja, nomorKosong, penerimaSurat } from "@/lib/usulan";
import type { Usulan } from "@/lib/types";

/** "Kabupaten Uji Barat" -> "Uji Barat", "Kubu Raya" tetap; kop menulis awalannya sendiri. */
const tanpaAwalan = (teks: string, awalan: string) => teks.replace(new RegExp(`^${awalan}\\s+`, "i"), "");

/**
 * Usulan lama (sebelum bentuk surat) menyimpan teks yang diawali "Kepada Yth. ..." dan diakhiri pernyataan asumsi.
 * Keduanya sudah ditulis oleh kop dan tidak dimuat di surat, jadi dibuang saat ditampilkan.
 */
function isiSurat(teks: string): string[] {
  return teks
    .replace(/^Kepada Yth\.[^.]*\.\s*/, "")
    .replace(/\s*Target, bobot, dan sebagian harga adalah asumsi tim[^.]*\.\s*$/, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Dokumen usulan dalam bentuk surat dinas desa: kop, nomor/lampiran/perihal, alamat tujuan, isi, (tabel alat), penutup,
 * dan tanda tangan Kepala Desa. Rapi di A4 tanpa navigasi dan latar (Design Brief §8).
 * Seluruh isi berasal dari objek Usulan yang dibekukan saat terbit. Teks dirender sebagai teks biasa, tidak pernah sebagai HTML.
 */
export function DokumenUsulan({ usulan }: { usulan: Usulan }) {
  const f = usulan.facts;
  const jenis = jenisUsulan(f);
  const desa = namaDesaSaja(f.desa ?? "");
  const total = usulan.baris.reduce((s, b) => s + b.biayaRp, 0);
  const tanggal = f.tanggal ?? formatTanggal(usulan.createdAt);

  return (
    <article className="mx-auto max-w-[760px] bg-surface px-5 py-8 font-serif text-[15px] leading-relaxed text-ink sm:px-10 print:max-w-none print:bg-white print:p-0 print:text-[11.5pt] print:leading-snug">
      {/* Kop surat */}
      <header className="border-b-[3px] border-double border-ink pb-3 text-center">
        <p className="text-base font-bold uppercase tracking-wide">Pemerintah Kabupaten {tanpaAwalan(f.kabupaten ?? "", "Kabupaten")}</p>
        <p className="text-base font-bold uppercase tracking-wide">Kecamatan {tanpaAwalan(f.kecamatan ?? "", "Kecamatan")}</p>
        <p className="text-2xl font-bold uppercase tracking-wide">Desa {desa}</p>
      </header>

      {/* Nomor, lampiran, perihal */}
      <table className="mt-6 border-collapse align-top print:mt-4">
        <tbody>
          <tr>
            <td className="w-24 pr-2 align-top">Nomor</td>
            <td className="pr-2 align-top">:</td>
            <td className="tabular">{f.nomor || nomorKosong(usulan.createdAt)}</td>
          </tr>
          <tr>
            <td className="pr-2 align-top">Lampiran</td>
            <td className="pr-2 align-top">:</td>
            <td>-</td>
          </tr>
          <tr>
            <td className="pr-2 align-top">Perihal</td>
            <td className="pr-2 align-top">:</td>
            <td>{JENIS_META[jenis].perihal}</td>
          </tr>
        </tbody>
      </table>

      {/* Alamat tujuan */}
      <div className="mt-6 print:mt-4">
        <p>Kepada</p>
        <p className="font-bold">Yth. {penerimaSurat(usulan.kanal, f)}</p>
        <p className="font-bold sm:pl-9">di</p>
        <p className="font-bold sm:pl-9">Tempat</p>
      </div>

      {/* Isi */}
      <div className="mt-6 space-y-4 text-justify sm:pl-9 print:mt-4 print:space-y-3 print:pl-9">
        <p>Dengan hormat,</p>
        {isiSurat(usulan.teks).map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}

        {jenis === "alat" && usulan.baris.length > 0 ? (
          <>
            <p>Adapun rincian alat yang kami mohonkan adalah sebagai berikut:</p>
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full min-w-[480px] border-collapse text-left text-[14px] print:text-[11pt]">
                <caption className="sr-only">Rincian alat yang dimohonkan</caption>
                <thead>
                  <tr>
                    <th scope="col" className="border border-ink px-2 py-1 text-center">No.</th>
                    <th scope="col" className="border border-ink px-2 py-1">Rincian alat</th>
                    <th scope="col" className="border border-ink px-2 py-1 text-right">Jumlah</th>
                    <th scope="col" className="border border-ink px-2 py-1 text-right">Harga satuan</th>
                    <th scope="col" className="border border-ink px-2 py-1 text-right">Jumlah harga</th>
                  </tr>
                </thead>
                <tbody>
                  {usulan.baris.map((b, i) => (
                    <tr key={`${b.itemKode}:${b.aksi}`} className="align-top">
                      <td className="border border-ink px-2 py-1 text-center">{i + 1}.</td>
                      <td className="border border-ink px-2 py-1">
                        {namaAksi(b.aksi)} {(b.nama ?? b.itemKode).toLowerCase()}
                      </td>
                      <td className="tabular border border-ink px-2 py-1 text-right">
                        {formatAngka(b.qty)} {b.satuan}
                      </td>
                      <td className="tabular border border-ink px-2 py-1 text-right">{formatRupiah(b.qty > 0 ? Math.round(b.biayaRp / b.qty) : b.biayaRp)}</td>
                      <td className="tabular border border-ink px-2 py-1 text-right">{formatRupiah(b.biayaRp)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={4} className="border border-ink px-2 py-1 text-right">
                      Total
                    </td>
                    <td className="tabular border border-ink px-2 py-1 text-right">{formatRupiah(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : null}

      </div>

      {/* Penutup dan tanda tangan selalu satu halaman: tanda tangan tidak boleh tercetak sendirian di halaman berikutnya. */}
      <div className="surat-penutup mt-4 print:mt-3">
        <p className="text-justify sm:pl-9 print:pl-9">
          Demikian {jenis === "anggaran" ? "proposal" : "surat permohonan"} ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan
          terima kasih.
        </p>
        <div className="mt-10 flex justify-end print:mt-6">
          <div className="min-w-[15rem] text-center">
            <p>
              {desa}, {tanggal}
            </p>
            <p>Kepala Desa {desa}</p>
            <div className="h-24 print:h-16" />
            <p className="font-bold">(..................................................)</p>
          </div>
        </div>
      </div>
    </article>
  );
}
