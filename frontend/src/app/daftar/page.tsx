import type { Metadata } from "next";
import { DaftarForm } from "@/components/masuk/DaftarForm";

export const metadata: Metadata = { title: "Daftar" };

export default function DaftarPage() {
  return <DaftarForm />;
}
