import type { Metadata } from "next";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Data dan Asumsi" };

export default function DataPage() {
  return (
    <Placeholder
      judul="Data dan Asumsi"
      fase="Fase 4"
      isi={[
        "Sumber: nama, lisensi, periode, tanggal akses",
        "Batasan data: S-NPP berhenti 2 Nov 2026, seri SiPongi berhenti Juli, awan dan asap, gambut membara",
        "Asumsi: parameter, bobot, target, sensitivitas",
        "Penggunaan AI: model, bagian yang memakai, batasnya",
      ]}
    />
  );
}
