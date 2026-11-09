import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function KesiapanPage() {
  return (
    <Placeholder
      judul="Kesiapan Desa"
      fase="Fase 2"
      isi={[
        "Gauge skor 0-100 dan status dalam kata",
        "Mata rantai terlemah dalam satu kalimat",
        "Ringkasan paparan satu baris, tautan ke Kartu Paparan",
        "Hitung mundur ke bulan puncak deteksi (P1)",
        "Daftar item dari kesenjangan terbesar: batang cakupan, berfungsi/target, tanda rusak",
        "Tombol Susun prioritas (tidak tampil untuk akun mpa)",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/prioritas`, label: "Susun prioritas" }}
    />
  );
}
