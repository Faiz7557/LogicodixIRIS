import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function PrioritasPage() {
  return (
    <Placeholder
      judul="Prioritas"
      fase="Fase 3"
      isi={[
        "Input pagu Rupiah: penggeser dan kotak angka",
        "Ringkasan: terpakai, sisa, skor sekarang menuju skor sesudah",
        "Daftar terpilih: urutan, aksi, item, jumlah, biaya, alasan, tombol Setuju/Tolak/Tunda",
        "Daftar tidak terdanai, item tanpa harga, kesenjangan non-biaya",
        "Sumber target dan harga; ubah target wajib alasan",
        "Tombol Terbitkan usulan, aktif bila minimal satu baris disetujui",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/usulan`, label: "Ke usulan" }}
    />
  );
}
