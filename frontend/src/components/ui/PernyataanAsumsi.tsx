// Wajib tampil di dokumen usulan (App Flow v2 §3.10) dan di dokumen cetak (Design Brief §8).
export const TEKS_ASUMSI =
  "Target, bobot, dan sebagian harga adalah asumsi tim, bukan standar yang mengikat desa. Dokumen wajib ditinjau manusia.";

// Wajib tampil di Beranda dan halaman Data (Design Brief v2 §12).
export const TEKS_BELUM_DIUJI = "Berbasis data publik, belum diuji pengguna.";

// Dokumen kanal apbdes_perubahan. Jangan menulis "berdasarkan Permendesa 16/2025" untuk TA 2027 (Jobdesk §3).
export const TEKS_DASAR_APBDES =
  "mengacu pada ketentuan fokus penggunaan Dana Desa yang berlaku pada Tahun Anggaran 2027";

export function PernyataanAsumsi() {
  return (
    <p className="rounded-card border border-line px-3 py-2 text-sm print:border-black">{TEKS_ASUMSI}</p>
  );
}
