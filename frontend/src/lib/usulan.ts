/*
 * Metadata kanal usulan (App Flow v2 §3.9). Teks isi dokumen dibuat backend (narasi.ts);
 * di sini hanya label, sapaan, dan penekanan untuk tampilan.
 */
import type { Kanal } from "./types";

export const KANAL: Kanal[] = ["apbdes_perubahan", "bpbd", "daops", "csr"];

export const KANAL_META: Record<Kanal, { label: string; sapaan: string; penekanan: string }> = {
  apbdes_perubahan: {
    label: "Perubahan APBDes",
    sapaan: "Musyawarah Desa",
    penekanan: "Pos belanja dan kesiapan",
  },
  bpbd: {
    label: "BPBD Kabupaten",
    sapaan: "Kepala BPBD Kabupaten",
    penekanan: "Paparan dan kesenjangan",
  },
  daops: {
    label: "Daops Manggala Agni / Kemenhut",
    sapaan: "Kepala Daops Manggala Agni",
    penekanan: "Alat dan kesiapan regu",
  },
  csr: {
    label: "CSR perusahaan sekitar",
    sapaan: "Perusahaan sekitar",
    penekanan: "Daftar barang dan dampak kesiapan",
  },
};

export const labelKanal = (k: Kanal) => KANAL_META[k].label;

// ---------- Surat (bentuk surat dinas desa) ----------

/** Dua jenis surat: usulan pengadaan alat (dari belanja yang disetujui) dan permohonan bantuan anggaran (sejumlah uang). */
export type JenisUsulan = "alat" | "anggaran";

export const JENIS_META: Record<JenisUsulan, { label: string; keterangan: string; perihal: string }> = {
  alat: {
    label: "Usulan pengadaan alat",
    keterangan: "Surat berisi daftar alat yang sudah disetujui di langkah Keputusan, lengkap dengan jumlah dan harga.",
    perihal: "Permohonan Pengadaan Alat Pemadam Kebakaran Hutan dan Lahan",
  },
  anggaran: {
    label: "Permohonan anggaran",
    keterangan: "Proposal meminta bantuan dana sejumlah tertentu, misalnya untuk menutup kekurangan anggaran desa.",
    perihal: "Proposal Permohonan Bantuan Anggaran Kesiapan Karhutla",
  },
};

/** Usulan lama (sebelum ada jenis) adalah usulan pengadaan alat. */
export const jenisUsulan = (facts: Record<string, string>): JenisUsulan => (facts.jenis === "anggaran" ? "anggaran" : "alat");

/** "Desa Uji D" -> "Uji D"; "Kali Bandung" tetap. Kop dan teks surat menambahkan kata "Desa" sendiri. */
export const namaDesaSaja = (nama: string) => nama.replace(/^desa\s+/i, "");

/** Penerima surat per kanal, untuk baris "Kepada Yth." */
export function penerimaSurat(kanal: Kanal, f: Record<string, string>): string {
  const desa = namaDesaSaja(f.desa ?? "");
  switch (kanal) {
    case "apbdes_perubahan":
      return `Pimpinan Musyawarah Desa ${desa}`;
    case "bpbd":
      return `Kepala BPBD Kabupaten ${f.kabupaten ?? ""}`.trim();
    case "daops":
      return "Kepala Daops Manggala Agni";
    case "csr":
      return `Pimpinan Perusahaan di Sekitar Desa ${desa}`;
  }
}

const ROMAWI = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** Nomor surat bila desa belum mengisi: ruang kosong untuk ditulis tangan, bulan Romawi, dan tahun. */
export function nomorKosong(isoTanggal: string): string {
  const d = new Date(isoTanggal);
  return `........./........./${ROMAWI[d.getUTCMonth()]}/${d.getUTCFullYear()}`;
}
