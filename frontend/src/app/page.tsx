import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function BerandaPage() {
  return (
    <>
      <section className="mx-auto max-w-[720px] px-4 pt-8">
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Enam tahun tanpa api bukan berarti aman.</h1>
        <p className="mt-3 max-w-[65ch] text-muted">
          SiapKemarau membantu desa rawan karhutla mengetahui seberapa terpapar mereka di tahun kering ekstrem, alat
          padam apa yang benar-benar berfungsi, dan apa yang harus didanai lebih dulu, sebelum musim kering tiba.
        </p>
      </section>
      <Placeholder
        judul="Beranda dan pencarian desa"
        fase="Fase 1"
        isi={[
          "Kotak cari: mulai setelah 2 karakter, jeda 250 ms, maksimal 20 hasil",
          "Angka jumlah desa tampak aman di Kalbar dan Kalteng, dari data",
          "Tautan ke Time Machine dan Data dan Asumsi",
          "Keadaan: tidak ada hasil, kurang dari 2 karakter, gagal jaringan",
        ]}
        lanjut={{ href: `/desa/${MOCK_KODE}`, label: "Buka desa contoh" }}
      />
    </>
  );
}
