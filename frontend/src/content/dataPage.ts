/*
 * Isi halaman Data dan Asumsi, disalin dari dokumen v2 (PRD §6-8, TRD §4-5, Schema §6).
 * Akan digantikan oleh GET /api/data (tabel sumber_data, dq_issue, meta, paket_minimum, harga_item).
 */
export const SUMBER = [
  { nama: "NASA FIRMS VIIRS S-NPP", lisensi: "Cek saat unduh, dicantumkan", periode: "20 Jan 2012 – 2 Nov 2026", akses: "Belum diambil (pipeline)" },
  { nama: "HDX COD-AB Indonesia (sumber BPS)", lisensi: "CC BY-IGO", periode: "Geometri April 2020, ditinjau 30 Okt 2025", akses: "Belum diambil (pipeline)" },
  { nama: "WRI Global Peatlands", lisensi: "CC BY 4.0", periode: "–", akses: "Belum diambil (pipeline)" },
  { nama: "Pergub Kalteng 35/2025 (pedoman MPA, sarana prasarana)", lisensi: "Dokumen publik", periode: "7 Jul 2025", akses: "9 Nov 2026" },
  { nama: "Pergub Kalbar 56/2025 (pelaksanaan Perda 2/2022)", lisensi: "Dokumen publik", periode: "31 Des 2025", akses: "9 Nov 2026" },
  { nama: "Permendesa PDT 16/2025 (fokus Dana Desa 2026)", lisensi: "Dokumen publik", periode: "TA 2026", akses: "9 Nov 2026" },
  { nama: "Perbup Sanggau 32/2025 (standar satuan harga)", lisensi: "Dokumen publik", periode: "TA 2026", akses: "9 Nov 2026" },
  { nama: "Perwal Kediri 3/2025 (standar harga satuan)", lisensi: "Dokumen publik", periode: "2025", akses: "9 Nov 2026" },
  { nama: "Nurhidayah dkk. 2023 (pengelolaan api berbasis komunitas)", lisensi: "Sesuai penerbit", periode: "Data 2019, 6 desa", akses: "9 Nov 2026" },
  { nama: "Mongabay, kasus Kalibandung (31 Agu 2026)", lisensi: "Kutipan berita", periode: "2026", akses: "9 Nov 2026" },
  { nama: "Mongabay, kasus Talio Hulu (6 Okt 2021)", lisensi: "Kutipan berita", periode: "2021", akses: "9 Nov 2026" },
] as const;

export type Tingkat = "info" | "peringatan" | "batasan";

export const BATASAN: { kode: string; isi: string; tingkat: Tingkat }[] = [
  { kode: "belum_diuji_pengguna", isi: "Produk belum diuji dengan sekdes atau ketua MPA.", tingkat: "batasan" },
  { kode: "snpp_stop", isi: "Satelit S-NPP berhenti mengirim data 2 Nov 2026. Tanggal akhir data nyata ditulis di bagian Sensor.", tingkat: "batasan" },
  { kode: "sipongi_juli", isi: "Seri resmi luas terbakar berhenti Juli 2026.", tingkat: "info" },
  { kode: "awan_asap", isi: "Awan dan asap bisa menutupi api.", tingkat: "batasan" },
  { kode: "gambut_membara", isi: "Api gambut bersuhu rendah bisa terlewat satelit.", tingkat: "batasan" },
  { kode: "titik_bukan_api", isi: "Satu titik bukan satu kebakaran.", tingkat: "info" },
  { kode: "geometri_2020", isi: "Batas desa HDX: geometri 2020, tinjauan Okt 2025.", tingkat: "peringatan" },
  { kode: "kelurahan_tercampur", isi: "Data batas memuat kelurahan yang tidak menerima Dana Desa.", tingkat: "peringatan" },
  { kode: "luas_desa_bias", isi: "Desa luas lebih mudah terdeteksi.", tingkat: "peringatan" },
  { kode: "konsesi", isi: "Api di konsesi tidak bisa diselesaikan oleh anggaran desa.", tingkat: "batasan" },
  { kode: "paket_asumsi", isi: "Paket minimum dan bobot adalah asumsi tim.", tingkat: "batasan" },
  { kode: "harga_ssh_tertinggi", isi: "Standar satuan harga (SSH) adalah harga satuan tertinggi.", tingkat: "info" },
  { kode: "servis_pendekatan", isi: "Harga servis pompa berasal dari servis pompa air umum di Kediri.", tingkat: "peringatan" },
  { kode: "dana_operasi_satu_sumber", isi: "Biaya operasi berasal dari satu kesaksian di Riau, data 2019.", tingkat: "peringatan" },
  { kode: "dana_desa_2027", isi: "Belum ada Permendesa fokus Dana Desa 2027.", tingkat: "peringatan" },
  { kode: "dana_desa_kdmp", isi: "Sekitar 58,03% pagu Dana Desa 2026 dialokasikan ke Koperasi Merah Putih, sumber pemberitaan.", tingkat: "peringatan" },
  { kode: "alat_di_catchall", isi: "Pembelian pompa, selang, dan dana operasi tidak disebut eksplisit pada contoh Permendesa hlm. 13, sehingga perlu keputusan Musyawarah Desa.", tingkat: "peringatan" },
];

export const PAKET = [
  { item: "Dana operasi", satuan: "minggu", target: "1", bobot: "15", jangkar: "Rp5 juta per minggu untuk 7-10 ha, satu kesaksian (Nurhidayah 2023)" },
  { item: "Pompa jinjing berfungsi", satuan: "unit", target: "1", bobot: "20", jangkar: "Pergub Kalteng memuat 3 per regu" },
  { item: "Selang keluar", satuan: "buah", target: "10", bobot: "20", jangkar: "Kalibandung gagal dengan 100 m; Pergub Kalteng memuat 50 buah per regu" },
  { item: "Sumur bor berfungsi", satuan: "titik", target: "5", bobot: "20", jangkar: "Talio Hulu 8 dari 50 berfungsi; hanya desa bergambut" },
] as const;

export const HARGA = [
  { item: "Pompa jinjing", aksi: "beli", harga: "Rp28.028.610", sumber: "Perbup Sanggau 32/2025 hlm. 175", catatan: "Harga satuan tertinggi" },
  { item: "Pompa jinjing", aksi: "perbaiki", harga: "Rp510.000", sumber: "Perwal Kediri 3/2025 hlm. 269, item 4594", catatan: "Pendekatan dari servis pompa air umum" },
  { item: "Selang keluar", aksi: "beli", harga: "Rp6.669.000", sumber: "Perbup Sanggau 32/2025 hlm. 174", catatan: "Panjang tidak tertulis; pembanding Kediri Rp3.490.500 per 20 m" },
  { item: "Dana operasi", aksi: "beli", harga: "Rp5.000.000", sumber: "Nurhidayah dkk. 2023 hlm. 9", catatan: "Satu kesaksian, data 2019" },
  { item: "Sumur bor", aksi: "semua", harga: "Tanpa harga", sumber: "–", catatan: "Desa mengisi sendiri" },
] as const;

export const PARAMETER = [
  { kunci: "buffer_km", nilai: "2", label: "parameter", arti: "Penyangga area desa, karena api bisa datang dari tetangga" },
  { kunci: "min_det_days", nilai: "2", label: "parameter", arti: "Hari berdeteksi minimal agar satu tahun dihitung terpapar" },
  { kunci: "quiet_window", nilai: "3", label: "parameter", arti: "Tahun tenang minimal untuk label Tampak aman" },
  { kunci: "s_desa", nilai: "2", label: "parameter", arti: "Kekuatan penarikan desa ke rata-rata kecamatan (tetap, tidak diestimasi)" },
  { kunci: "freeze_date", nilai: "2025-12-31", label: "parameter", arti: "Batas pengetahuan Time Machine" },
  { kunci: "gate_min_lift", nilai: "1,5", label: "parameter", arti: "Uji A: rasio laju minimal" },
  { kunci: "gate_min_exposed", nilai: "30", label: "parameter", arti: "Uji A: desa tampak aman terpapar minimal" },
  { kunci: "gate_min_ratio_aktif", nilai: "0,6", label: "parameter", arti: "Uji B: rasio terhadap desa aktif minimal" },
  { kunci: "panjang_per_buah_m", nilai: "20", label: "asumsi_tim", arti: "Panjang selang per buah, hanya untuk keterangan turunan" },
] as const;

export const TAHUN_SENSOR = Array.from({ length: 15 }, (_, i) => 2012 + i);
