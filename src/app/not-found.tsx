import { EmptyState } from "@/components/ui/PageState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <EmptyState
        title="Desa atau halaman ini tidak ada."
        action={{ href: "/", label: "Cari desa" }}
      >
        Cakupan saat ini Kalimantan Barat dan Kalimantan Tengah.
      </EmptyState>
    </div>
  );
}
