import type { SumberTeks } from "@/lib/types";

// Teks badge persis dari App Flow v2 §3.10.
// Pernyataan "wajib ditinjau manusia" kini ada di pernyataan asumsi dokumen (PernyataanAsumsi).
export function AiBadge({ sumber, model }: { sumber: SumberTeks; model?: string | null }) {
  const ai = sumber === "ai";
  return (
    <p className={`rounded-card border px-3 py-2 text-sm ${ai ? "border-water/40 text-water" : "border-line text-muted"}`}>
      {ai
        ? `Disusun AI dari data terhitung${model ? ` (${model})` : ""}. Angka diisi sistem.`
        : "Disusun dari template."}
    </p>
  );
}
