import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export default function UsulanPage() {
  return (
    <Placeholder
      judul="Usulan"
      fase="Fase 3"
      isi={[
        "Daftar usulan yang pernah terbit",
        "Pilihan kanal: perubahan APBDes, BPBD, Daops/Kemenhut, CSR",
        "Tombol terbitkan",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/usulan/1`, label: "Lihat contoh dokumen" }}
    />
  );
}
