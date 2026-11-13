import type { Kanal } from "@/lib/types";
import { modelPenulis, tulisJson } from "./llm";
import { KATA_TERLARANG } from "./ringkasan";

/*
 * Narasi usulan (TRD §7, plan 09 Task C4). Dokumen ditandatangani perangkat desa, jadi model sama sekali tidak
 * melihat angka maupun nama: model hanya menerima nama placeholder, kanal, dan label kualitatif status.
 * Keluaran model berisi {{placeholder}}; server memeriksanya, lalu mengisi nilai fakta. Gagal apa pun: template.
 * Tanpa `OPENAI_API_KEY`, narasi selalu memakai template.
 */

export type FaktaNarasi = Record<string, string>;

const ASUMSI =
  "Target, bobot, dan sebagian harga adalah asumsi tim, bukan standar yang mengikat desa, dan dokumen ini wajib ditinjau manusia.";

/** Placeholder yang wajib ada di setiap narasi AI. */
const WAJIB = ["desa", "skor", "total_usulan"];
const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/g;
const WILAYAH_KARANGAN = /\b(Desa|Kecamatan|Kabupaten|Provinsi)\s+[A-Z]/;

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

/** Pemeriksaan TRD §7: hanya placeholder yang dikenal, tanpa digit, tanpa nama wilayah karangan, placeholder wajib lengkap. */
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
  return { ok: v.length === 0, violations: v };
}

export function renderNarrative(text: string, facts: Record<string, string>): string {
  return text.replace(PLACEHOLDER, (utuh, kunci: string) => facts[kunci] ?? utuh);
}

const PENERIMA: Record<Kanal, string> = {
  apbdes_perubahan: "Musyawarah Desa, untuk usulan pos belanja pada APBDes Perubahan",
  bpbd: "Kepala BPBD kabupaten (nama kabupaten ada di {{kabupaten}})",
  daops: "Kepala Daops Manggala Agni",
  csr: "pimpinan perusahaan pemegang izin di sekitar desa",
};

const SKEMA = {
  name: "narasi_usulan",
  schema: { type: "object", additionalProperties: false, required: ["teks"], properties: { teks: { type: "string" } } },
};

function aturan(allowed: string[]): string {
  return (
    "Kamu menulis satu paragraf surat usulan kesiapan karhutla dari pemerintah desa, dalam Bahasa Indonesia baku yang sopan dan ringkas, tanpa markdown. " +
    "Kamu tidak tahu angka atau nama apa pun. Tulis setiap nilai hanya sebagai placeholder {{nama}}, persis dari daftar ini: " +
    allowed.map((a) => `{{${a}}}`).join(", ") +
    ". Wajib memakai {{desa}}, {{skor}}, dan {{total_usulan}}. Placeholder {{desa}} sudah memuat kata \"Desa\", jadi jangan menulis \"Desa {{desa}}\". " +
    "Jangan menulis angka atau digit apa pun, jangan mengarang nama desa, kecamatan, kabupaten, atau orang. " +
    'Tulis "deteksi satelit", bukan "kebakaran". Jangan menyebut siapa yang membakar, jangan menjanjikan hektare terselamatkan, jangan menyatakan desa aman. ' +
    "Paling banyak lima kalimat. Jangan menulis pernyataan asumsi; sistem menambahkannya."
  );
}

export async function generateNarrative(
  facts: FaktaNarasi,
  kanal: Kanal,
): Promise<{ teks: string; sumber: "ai" | "template"; model: string | null }> {
  const allowed = Object.keys(facts);
  // Hanya nama placeholder, kanal, dan label kualitatif yang dikirim. Nilai fakta lain tidak pernah keluar dari server.
  const user = `KANAL: ${kanal}\nPENERIMA: ${PENERIMA[kanal]}\nSTATUS KESIAPAN (label): ${facts.status ?? "tidak diketahui"}`;
  const mentah = await tulisJson(aturan(allowed), user, SKEMA);
  if (mentah) {
    try {
      const { teks } = JSON.parse(mentah) as { teks?: unknown };
      if (typeof teks === "string") {
        const v = validateNarrative(teks, allowed);
        if (v.ok) return { teks: `${renderNarrative(teks.trim(), facts)} ${ASUMSI}`, sumber: "ai", model: modelPenulis() };
        console.warn("[narasi] ditolak:", kanal, v.violations.join(","));
      }
    } catch {
      console.warn("[narasi] bukan JSON:", kanal);
    }
  }
  return { teks: renderTemplate(facts, kanal), sumber: "template", model: null };
}
