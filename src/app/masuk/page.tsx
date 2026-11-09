import type { Metadata } from "next";
import { Placeholder } from "@/components/ui/Placeholder";
import { MOCK_KODE } from "@/mocks/demo";

export const metadata: Metadata = { title: "Masuk" };

export default function MasukPage() {
  return (
    <Placeholder
      judul="Masuk"
      fase="Fase 2"
      isi={[
        "Isian username dan password dengan label",
        "Gagal: Username atau password salah (tanpa menyebut mana yang salah)",
        "Terlalu banyak percobaan: Coba lagi dalam 15 menit",
        "Berhasil: menuju halaman Kesiapan desa akun",
      ]}
      lanjut={{ href: `/desa/${MOCK_KODE}/kesiapan`, label: "Lanjut sebagai akun demo" }}
    />
  );
}
