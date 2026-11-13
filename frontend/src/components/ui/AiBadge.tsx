import type { SumberTeks } from "@/lib/types";

// Teks badge persis dari App Flow v2 §3.10.
// Surat usulan tetap wajib ditinjau manusia sebelum dikirim.
export function AiBadge({ sumber, model }: { sumber: SumberTeks; model?: string | null }) {
  const ai = sumber === "ai";
  return (
    <p
      className={`rounded-card border px-3 py-2 text-sm ${
        ai ? "border-water/30 bg-water-soft text-water" : "border-line bg-surface-2 text-muted"
      }`}
    >
      {ai
        ? `Disusun AI dari data terhitung${model ? ` (${model})` : ""}. Angka diisi sistem.`
        : "Disusun dari template."}
    </p>
  );
}
