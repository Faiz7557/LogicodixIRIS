import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function InventarisPage() {
  return (
    <Placeholder
      judul="Catat Alat"
      fase="Fase 2"
      isi={[
        "Satu kolom per item: stepper jumlah total dan jumlah berfungsi, catatan opsional",
        "Validasi: berfungsi tidak boleh melebihi total; isi angka 0 atau lebih",
        "Tombol simpan menempel di bawah",
        "Sesudah simpan: pesan sukses, nama pengisi, waktu, tombol ke Kesiapan",
        "Draf di HP saat sinyal hilang (P1)",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/kesiapan`, label: "Lihat kesiapan" }}
    />
  );
}
