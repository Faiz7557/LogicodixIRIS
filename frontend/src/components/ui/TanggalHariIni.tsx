"use client";

import { useSyncExternalStore } from "react";
import { formatTanggal } from "@/lib/format";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const WIB = 7 * 3600_000;

/** "Selasa, 10 November 2026" untuk saat ini, dalam WIB. */
export function teksHariIni(now = Date.now()): string {
  return `${HARI[new Date(now + WIB).getUTCDay()]}, ${formatTanggal(new Date(now).toISOString())}`;
}

/** Berlangganan pergantian hari: memicu render ulang tepat setelah tengah malam WIB, lalu tiap hari berikutnya. */
function langganan(beritahu: () => void): () => void {
  let t: ReturnType<typeof setTimeout>;
  const jadwal = () => {
    const wib = Date.now() + WIB;
    const sisa = 86_400_000 - (wib % 86_400_000) + 1000; // sampai 00.00.01 WIB
    t = setTimeout(() => {
      beritahu();
      jadwal();
    }, sisa);
  };
  jadwal();
  // Tab yang lama tertidur: periksa lagi saat kembali dibuka.
  document.addEventListener("visibilitychange", beritahu);
  return () => {
    clearTimeout(t);
    document.removeEventListener("visibilitychange", beritahu);
  };
}

/**
 * Tanggal hari ini (WIB) yang berganti sendiri saat hari berganti.
 * Dihitung di peramban, bukan saat prerender, karena Next 16 menolak nilai waktu di server render.
 */
export function TanggalHariIni({ cadangan = "hari ini" }: { cadangan?: string }) {
  const teks = useSyncExternalStore(langganan, () => teksHariIni(), () => null);
  return <time suppressHydrationWarning>{teks ?? cadangan}</time>;
}
