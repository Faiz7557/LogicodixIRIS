import type { Kanal } from "@/lib/types";

/* Narasi usulan. Untuk sekarang selalu template; AI menyusul di Task T40 dengan fallback ini. */

export type FaktaNarasi = Record<string, string>;

const ASUMSI =
  "Target, bobot, dan sebagian harga adalah asumsi tim, bukan standar yang mengikat desa, dan dokumen ini wajib ditinjau manusia.";

export function renderTemplate(f: FaktaNarasi, kanal: Kanal): string {
  const inti = `Skor kesiapan ${f.desa} saat ini ${f.skor} (${f.status}); mata rantai terlemah adalah ${f.rantai_terlemah}. Belanja yang diusulkan senilai ${f.total_usulan} menaikkan skor menjadi ${f.skor_sesudah}. Riwayat menunjukkan desa ini terdeteksi satelit pada ${f.paparan}.`;
  switch (kanal) {
    case "apbdes_perubahan":
      return `Kepada Yth. Musyawarah Desa ${f.desa}. Kami mengusulkan pos belanja kesiapan karhutla senilai ${f.total_usulan}, mengacu pada ketentuan fokus penggunaan Dana Desa yang berlaku pada Tahun Anggaran 2027. ${inti} ${ASUMSI}`;
    case "bpbd":
      return `Kepada Yth. Kepala BPBD Kabupaten ${f.kabupaten}. Kami menyampaikan paparan dan kesenjangan kesiapan ${f.desa}, ${f.kecamatan}. ${inti} Kami memohon pertimbangan dukungan sebesar ${f.total_usulan}. ${ASUMSI}`;
    case "daops":
      return `Kepada Yth. Kepala Daops Manggala Agni. Kami menyampaikan kondisi alat dan kesiapan regu ${f.desa}. ${inti} Kami memohon pertimbangan dukungan alat senilai ${f.total_usulan}. ${ASUMSI}`;
    case "csr":
      return `Kepada Yth. pimpinan perusahaan di sekitar ${f.desa}. Kami menyampaikan daftar barang kesiapan karhutla senilai ${f.total_usulan}. ${inti} ${ASUMSI}`;
  }
}

/** Tanpa `ANTHROPIC_API_KEY` (atau saat galat), narasi memakai template. */
export async function generateNarrative(
  facts: FaktaNarasi,
  kanal: Kanal,
): Promise<{ teks: string; sumber: "ai" | "template"; model: string | null }> {
  return { teks: renderTemplate(facts, kanal), sumber: "template", model: null };
}
