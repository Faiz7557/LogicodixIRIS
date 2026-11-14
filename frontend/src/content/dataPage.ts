/*
 * Teks halaman Sumber dan Batasan Data yang tidak disimpan di basis data: pengantar, keterangan bagian,
 * catatan batas, gerbang, dan penggunaan AI. Daftar sumber, sensor, batasan, paket, harga, dan
 * parameter dibaca dari GET /api/data (tabel sumber_data, deteksi_ringkas, dq_issue, paket_minimum,
 * harga_item, meta). Sumber dokumen: PRD §6-8, TRD §4-5, Schema §6.
 */

export type Tingkat = "info" | "peringatan" | "batasan";

export const KEPALA = {
  kicker: "Sumber dan batasan · berlaku untuk semua desa",
  judul: "Dari mana angka TetesPas berasal?",
  ringkas: "Semua yang dipakai produk ini, asalnya, dan batasnya. Isi halaman ini sama untuk setiap desa.",
} as const;

/** Keterangan kotak ringkasan. Angka dan rentang tahun dihitung dari data. */
export const RINGKAS = {
  sumber: "Data publik, lisensi dicantumkan",
  sensor: "VIIRS S-NPP, tanpa NOAA-20/21",
  tahunKosong: "Belum ada data deteksi",
  batasanKeras: "di antaranya batasan keras",
} as const;

export const KETERANGAN = {
  sumber: "Data mentah yang diolah pipeline. GADM tidak dipakai karena lisensinya melarang redistribusi.",
  sensor:
    "Satu sensor agar jumlah deteksi konsisten: VIIRS S-NPP, hanya titik dengan confidence nominal atau high. Data dibagi menurut sumber SP (arsip standar) dan NRT (hampir waktu nyata).",
  sensorCatatan: "Jumlah deteksi per tahun, tanggal terakhir data 2026, dan celah SP–NRT ditulis di sini setelah pipeline selesai.",
  batasan: "Hal yang tidak bisa disimpulkan dari data ini.",
  paket: "Jumlah minimum alat per desa beserta dasarnya. Desa boleh mengubahnya dengan alasan.",
  parameter: "Angka yang mengatur perhitungan beserta jenisnya.",
  gerbang: "Dua uji yang ditetapkan sebelum data 2026 dibuka. Hasilnya menentukan klaim apa yang boleh dipakai, dan dilaporkan apa adanya.",
  ai: "AI hanya membantu menulis kalimat; angka dan nama selalu dari sistem.",
} as const;

export const CATATAN_PAKET =
  "Desa Kalteng: Pergub Kalteng 35/2025 Pasal 18–19 memuat pompa jinjing 3, pompa punggung 10, dan selang 50 buah per regu. Kalimantan Barat belum memiliki angka alat per regu pada Pergub 56/2025. Panjang selang bukan target; keterangan meter selalu turunan.";

export const CATATAN_HARGA = "Harga tanpa sumber tidak dimasukkan ke data.";

export const CATATAN_PARAMETER =
  "Sensitivitas penyangga (0, 2, 5 km), ambang hari (1, 2, 3), dan penarikan desa (0, 2, 5) ditampilkan setelah pipeline selesai.";

export const UJI = [
  {
    label: "Uji A",
    judul: "Riwayat memberi sinyal",
    isi: "Laju terdeteksi desa tampak aman minimal 1,5 kali desa tanpa riwayat ekstrem, dengan minimal 30 desa, dan juga pada minimal 3 dari 4 kuartil luas desa.",
  },
  {
    label: "Uji B",
    judul: "Tenang tidak berarti aman",
    isi: "Laju desa tampak aman minimal 0,6 kali desa yang baru terdeteksi.",
  },
] as const;

export const AKIBAT_UJI =
  "Dua lulus: pertahankan klaim. A lulus, B gagal: lunakkan kalimat. A gagal: buang klaim “tampak aman”, fakta paparan tetap.";

export const AI = [
  { label: "Model", isi: "Claude (claude-opus-5-5), OpenAI (gpt-6-luna), atau 9router (gemini-3.8-flash-low) bila kunci API tersedia." },
  { label: "Dipakai untuk", isi: "Membantu mengisi formulir alat dari pesan yang ditempel. Narasi dokumen usulan masih memakai templat. Tanpa kunci API, isian alat memakai parser deterministik." },
  {
    label: "Batas",
    isi: "AI tidak pernah menulis angka atau nama. Teks yang melanggar aturan ditolak dan diganti templat. Catatan bebas pengguna tidak dikirim ke AI.",
  },
  { label: "Tanpa AI", isi: "Semua fitur utama tetap jalan tanpa internet dan tanpa kunci API; dokumen memakai templat." },
  { label: "Tinjauan manusia", isi: "Setiap dokumen wajib ditinjau desa sebelum dipakai." },
] as const;
