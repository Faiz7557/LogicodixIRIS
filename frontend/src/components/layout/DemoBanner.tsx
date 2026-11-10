// Wajib tampil pada akun demo (PRD risiko produk, App Flow §3.7).
export function DemoBanner() {
  return (
    <div role="note" className="no-print border-b border-warn/20 bg-warn-soft text-warn">
      <p className="mx-auto max-w-[720px] px-4 py-2 text-sm font-medium">
        Akun demonstrasi. Isian alat adalah data uji, bukan survei lapangan.
      </p>
    </div>
  );
}
