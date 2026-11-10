import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function KartuPaparanPage() {
  return (
    <Placeholder
      judul="Kartu Paparan Desa"
      fase="Fase 1"
      isi={[
        "Nama desa dan wilayah",
        "Kalimat utama: Terdeteksi satelit pada {k} dari {n} tahun kering ekstrem. {t} tahun terakhir tenang.",
        "Label tingkat paparan, dan label Tampak aman bila memenuhi",
        "YearStrip 2012-2026, tahun ekstrem ditandai",
        "Peluang kecamatan dengan rentang 5-95%",
        "Porsi gambut dan peta kecil poligon desa",
        "Tombol Periksa kesiapan desa ini",
        "Catatan: deteksi satelit bukan hitungan kebakaran",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/kesiapan`, label: "Periksa kesiapan desa ini" }}
    />
  );
}
