import { Placeholder } from "@/components/ui/Placeholder";

export default function DokumenUsulanPage() {
  return (
    <Placeholder
      judul="Dokumen Usulan"
      fase="Fase 3"
      isi={[
        "Identitas desa, ringkasan paparan, kondisi kesiapan",
        "Tabel item disetujui dengan biaya dan alasan",
        "Narasi dengan badge sumber (AI atau template)",
        "Kolom tanda tangan kosong, lampiran sumber data",
        "Tombol Cetak (window.print), rapi di A4 tanpa navigasi",
        "Tidak ada klaim hektare terselamatkan",
      ]}
    />
  );
}
