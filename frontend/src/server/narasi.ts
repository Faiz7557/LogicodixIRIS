import type { Kanal } from "@/lib/types";
import { modelPenulis, tulisJson } from "./llm";
import { KATA_TERLARANG } from "./ringkasan";

/*
 * Isi surat usulan (TRD §7, plan 09 Task C4). Surat adalah proposal resmi yang dicetak dan diajukan, jadi isinya
 * hanya permohonan dengan bahasa formal: tanpa skor kesiapan, status, mata rantai terlemah, atau riwayat satelit.
 * Model sama sekali tidak melihat angka maupun nama: model hanya menerima nama placeholder dan kanal.
 * Keluaran model berisi {{placeholder}}; server memeriksanya, lalu mengisi nilai fakta. Gagal apa pun: template.
 * Tanpa `OPENAI_API_KEY`, narasi selalu memakai template.
 */

export type FaktaNarasi = Record<string, string>;

/** Fakta yang boleh muncul di isi surat pengadaan. Fakta lain (skor, status, paparan) tidak dimuat di surat. */
export const FAKTA_SURAT = ["desa", "kecamatan", "kabupaten", "total_usulan"];
/** Placeholder yang wajib ada di setiap narasi AI. */
const WAJIB = ["desa", "total_usulan"];
const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/g;
const WILAYAH_KARANGAN = /\b(Desa|Kecamatan|Kabupaten|Provinsi)\s+[A-Z]/;
/** Hal teknis aplikasi yang tidak dimuat di surat resmi. */
const BUKAN_ISI_SURAT = ["skor", "satelit", "mata rantai", "paparan"];

/** Paragraf harapan surat pengadaan alat, menurut penerima. */
const HARAPAN: Record<Kanal, string> = {
  apbdes_perubahan:
    "Kami mohon kiranya usulan ini dapat dibahas dalam Musyawarah Desa dan ditetapkan sebagai pos belanja pada Perubahan Anggaran Pendapatan dan Belanja Desa, sesuai ketentuan penggunaan Dana Desa yang berlaku.",
  bpbd: "Melalui surat ini kami mengharapkan adanya bantuan dari Pemerintah Kabupaten melalui Badan Penanggulangan Bencana Daerah, sehingga sarana pemadaman desa dapat dilengkapi sebelum musim kemarau berikutnya.",
  daops:
    "Melalui surat ini kami mengharapkan adanya bantuan dari Daerah Operasi Manggala Agni, sehingga sarana pemadaman desa dapat dilengkapi sebelum musim kemarau berikutnya.",
  csr: "Melalui surat ini kami mengharapkan adanya dukungan dari perusahaan Bapak/Ibu, sehingga sarana pemadaman desa dapat dilengkapi sebelum musim kemarau berikutnya.",
};

/**
 * Isi surat pengadaan alat, tanpa salam pembuka dan penutup: kop, "Kepada Yth.", "Dengan hormat,",
 * tabel alat, dan penutup disusun oleh dokumen. Paragraf dipisah baris kosong.
 */
export function renderTemplate(f: FaktaNarasi, kanal: Kanal): string {
  return [
    `Dalam rangka meningkatkan kesiapsiagaan ${f.desa}, Kecamatan ${f.kecamatan}, Kabupaten ${f.kabupaten} dalam menghadapi kebakaran hutan dan lahan pada musim kemarau, bersama ini kami mengajukan permohonan pengadaan alat pemadam kebakaran dengan nilai keseluruhan sebesar ${f.total_usulan}.`,
    HARAPAN[kanal],
  ].join("\n\n");
}

const PIHAK: Record<Kanal, string> = {
  apbdes_perubahan: "Pemerintah Desa melalui Perubahan Anggaran Pendapatan dan Belanja Desa",
  bpbd: "Pemerintah Kabupaten melalui Badan Penanggulangan Bencana Daerah",
  daops: "Daerah Operasi Manggala Agni",
  csr: "perusahaan Bapak/Ibu",
};

/**
 * Isi proposal permohonan bantuan anggaran (bukan pengadaan alat): sejumlah uang untuk sarana pemadaman.
 * Selalu template, tanpa AI: angka dan terbilang harus persis. Paragraf dipisah baris kosong.
 */
export function renderPermohonanAnggaran(f: FaktaNarasi, kanal: Kanal): string {
  return [
    `Dalam rangka meningkatkan kesiapsiagaan ${f.desa}, Kecamatan ${f.kecamatan}, Kabupaten ${f.kabupaten} dalam menghadapi kebakaran hutan dan lahan pada musim kemarau, bersama ini kami sampaikan proposal permohonan bantuan anggaran untuk pengadaan dan pemeliharaan sarana pemadaman kebakaran Tahun Anggaran ${f.tahun_anggaran} sebesar ${f.jumlah} (${f.terbilang}).`,
    `Melalui proposal ini kami mengharapkan adanya bantuan dari ${PIHAK[kanal]}, sehingga sarana pemadaman desa dapat dilengkapi sebelum musim kemarau berikutnya.`,
  ].join("\n\n");
}

/**
 * Pemeriksaan TRD §7: hanya placeholder yang dikenal, tanpa digit, tanpa nama wilayah karangan, placeholder wajib lengkap,
 * dan tanpa hal teknis aplikasi (skor, satelit) yang bukan isi surat resmi.
 */
export function validateNarrative(text: string, allowed: string[]): { ok: boolean; violations: string[] } {
  const v: string[] = [];
  if (!text.trim()) v.push("kosong");
  const dipakai = [...text.matchAll(PLACEHOLDER)].map((m) => m[1]);
  for (const p of new Set(dipakai)) if (!allowed.includes(p)) v.push(`placeholder:${p}`);
  for (const w of WAJIB) if (!dipakai.includes(w)) v.push(`wajib:${w}`);
  const luar = text.replace(PLACEHOLDER, "");
  if (/[{}]/.test(luar)) v.push("kurung_kurawal");
  if (/\d/.test(luar)) v.push("digit");
  if (WILAYAH_KARANGAN.test(luar)) v.push("wilayah");
  if (/[*#`]/.test(luar)) v.push("format");
  const kecil = luar.toLowerCase();
  for (const k of KATA_TERLARANG) if (kecil.includes(k)) v.push(`kata:${k}`);
  for (const k of BUKAN_ISI_SURAT) if (kecil.includes(k)) v.push(`bukan_isi:${k}`);
  return { ok: v.length === 0, violations: v };
}

export function renderNarrative(text: string, facts: Record<string, string>): string {
  return text.replace(PLACEHOLDER, (utuh, kunci: string) => facts[kunci] ?? utuh);
}

const PENERIMA: Record<Kanal, string> = {
  apbdes_perubahan: "Musyawarah Desa, untuk usulan pos belanja pada Perubahan APBDes",
  bpbd: "Kepala BPBD kabupaten (nama kabupaten ada di {{kabupaten}})",
  daops: "Kepala Daops Manggala Agni",
  csr: "pimpinan perusahaan di sekitar desa",
};

const SKEMA = {
  name: "narasi_usulan",
  schema: { type: "object", additionalProperties: false, required: ["teks"], properties: { teks: { type: "string" } } },
};

function aturan(allowed: string[]): string {
  return (
    "Kamu menulis isi surat resmi pemerintah desa berupa permohonan pengadaan alat pemadam kebakaran hutan dan lahan, dalam Bahasa Indonesia baku dan formal seperti surat dinas, tanpa markdown. " +
    'Jangan menulis salam pembuka atau penutup ("Kepada Yth.", "Dengan hormat", "Demikian", "terima kasih"); sistem menambahkannya. ' +
    "Tulis dua paragraf yang dipisah satu baris kosong: paragraf pertama menyampaikan maksud permohonan dan nilai keseluruhannya, paragraf kedua menyampaikan harapan bantuan dari penerima. " +
    "Kamu tidak tahu angka atau nama apa pun. Tulis setiap nilai hanya sebagai placeholder {{nama}}, persis dari daftar ini: " +
    allowed.map((a) => `{{${a}}}`).join(", ") +
    '. Wajib memakai {{desa}} dan {{total_usulan}}. Placeholder {{desa}} sudah memuat kata "Desa", jadi jangan menulis "Desa {{desa}}". ' +
    "Jangan menulis angka atau digit apa pun, jangan mengarang nama desa, kecamatan, kabupaten, atau orang. " +
    "Jangan menyebut skor, status kesiapan, data satelit, atau istilah teknis aplikasi. Jangan menyebut siapa yang membakar dan jangan menjanjikan hektare terselamatkan. " +
    "Paling banyak empat kalimat."
  );
}

export async function generateNarrative(
  facts: FaktaNarasi,
  kanal: Kanal,
): Promise<{ teks: string; sumber: "ai" | "template"; model: string | null }> {
  // Isi surat hanya memakai fakta surat; skor, status, dan paparan tidak dikirim ke model dan tidak boleh dipakai.
  const fakta = Object.fromEntries(FAKTA_SURAT.filter((k) => k in facts).map((k) => [k, facts[k]]));
  const allowed = Object.keys(fakta);
  // Hanya nama placeholder dan kanal yang dikirim. Nilai fakta tidak pernah keluar dari server.
  const user = `KANAL: ${kanal}\nPENERIMA: ${PENERIMA[kanal]}`;
  const mentah = await tulisJson(aturan(allowed), user, SKEMA);
  if (mentah) {
    try {
      const { teks } = JSON.parse(mentah) as { teks?: unknown };
      if (typeof teks === "string") {
        const v = validateNarrative(teks, allowed);
        if (v.ok) return { teks: renderNarrative(teks.trim(), fakta), sumber: "ai", model: modelPenulis() };
        console.warn("[narasi] ditolak:", kanal, v.violations.join(","));
      }
    } catch {
      console.warn("[narasi] bukan JSON:", kanal);
    }
  }
  return { teks: renderTemplate(facts, kanal), sumber: "template", model: null };
}
