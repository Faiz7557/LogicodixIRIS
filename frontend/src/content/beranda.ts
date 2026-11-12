/*
 * Isi Beranda. Semua angka berasal dari definisi produk di dokumen v2 (PRD §6-7), bukan hasil ukur:
 * 2012-2026 = rentang data VIIRS S-NPP; 4 tahun ekstrem = 2015, 2019, 2023, 2026; 4 item = paket minimum.
 */
export const STATISTIK = [
  { angka: "15", label: "tahun", keterangan: "riwayat deteksi satelit, 2012–2026" },
  { angka: "4", label: "tahun", keterangan: "kering ekstrem dinilai: 2015, 2019, 2023, 2026" },
  { angka: "2", label: "provinsi", keterangan: "cakupan: Kalimantan Barat dan Kalimantan Tengah" },
  { angka: "4", label: "item", keterangan: "belanja inti: biaya operasi pemadaman, pompa, selang, sumur bor" },
] as const;

export const LANGKAH = [
  { judul: "Lihat paparan", isi: "Berapa tahun kering ekstrem desa terdeteksi satelit sejak 2012." },
  { judul: "Catat alat", isi: "Ketua MPA mengisi jumlah alat yang ada dan yang masih berfungsi, lewat HP." },
  { judul: "Lihat kesiapan", isi: "Skor terhadap paket minimum satu musim, dan mata rantai yang paling lemah." },
  { judul: "Susun prioritas", isi: "Isi pagu. Urutan belanja muncul dengan alasan tiap baris. Desa yang memutuskan." },
  { judul: "Terbitkan usulan", isi: "Satu dokumen siap cetak untuk APBDes, BPBD, Daops, atau CSR." },
] as const;

export const PERAN = [
  {
    peran: "Sekdes atau kades",
    bisa: "Melihat kesiapan, mengubah paket dan harga dengan alasan, menyusun prioritas, memutuskan tiap baris, dan menerbitkan usulan.",
  },
  {
    peran: "Ketua MPA",
    bisa: "Mencatat alat yang ada dan yang berfungsi, serta melihat kesiapan desanya.",
  },
  {
    peran: "Publik dan juri",
    bisa: "Melihat paparan desa, Time Machine, serta sumber dan batasan data. Tanpa akun.",
  },
] as const;

/** Tahun contoh pada kartu pratinjau. Hanya ilustrasi tampilan, bukan data desa mana pun. */
export const CONTOH_TERDETEKSI = [2015, 2019, 2026];
export const CONTOH_TAHUN = Array.from({ length: 15 }, (_, i) => 2012 + i);
