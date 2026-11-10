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
