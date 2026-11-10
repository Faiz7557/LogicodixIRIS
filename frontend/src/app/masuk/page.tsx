import type { Metadata } from "next";
import { MasukForm } from "@/components/masuk/MasukForm";

export const metadata: Metadata = { title: "Masuk" };

export default function MasukPage() {
  return <MasukForm />;
}
