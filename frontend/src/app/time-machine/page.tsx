import type { Metadata } from "next";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Time Machine" };

export default function TimeMachinePage() {
  return (
    <Placeholder
      judul="Time Machine"
      fase="Fase 4"
      lebar="1040"
      isi={[
        "Pernyataan: bayangkan hari ini 31 Desember 2025",
        "Peta desa teratas menurut peringkat beku",
        "Tombol Buka 2026: deteksi nyata 2026 muncul bertahap (maks 800 ms)",
        "Tabel capture top 10/20/30%: paparan, persistensi, gambut, acak",
        "Tiga kartu grup: tampak aman, aktif, tanpa riwayat ekstrem",
        "Apa yang tidak bisa dibuktikan halaman ini",
      ]}
    />
  );
}
