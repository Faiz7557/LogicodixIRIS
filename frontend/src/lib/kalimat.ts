/*
 * Kalimat dan label halaman paparan (App Flow v2 §3.2; rencana v2 Task 17).
 * Selalu "deteksi satelit", bukan "kebakaran". Desa tanpa deteksi tidak pernah dinyatakan aman.
 */
import { formatAngka } from "./format";
import type { DesaTahun, KeputusanGerbang, Tier } from "./types";

export function headlinePaparan(p: { kExt: number; nExt: number; tahunTenang: number }): string {
  if (p.kExt === 0) {
    return "Belum ada deteksi satelit memenuhi ambang sejak 2012. Ini bukan jaminan aman.";
  }
  const dasar = `Terdeteksi satelit pada ${formatAngka(p.kExt)} dari ${formatAngka(p.nExt)} tahun kering ekstrem.`;
  if (p.tahunTenang <= 0) return `${dasar} Tahun terakhir pun terdeteksi.`;
  return `${dasar} ${formatAngka(p.tahunTenang)} tahun terakhir tenang.`;
}

/** Label "Tampak aman" disembunyikan bila gerbang data memutuskan `buang` (Jobdesk, TRD §5). */
export function labelTampakAman(p: { tampakAman: boolean; keputusan: KeputusanGerbang | string }): boolean {
  return p.tampakAman && p.keputusan !== "buang";
}

/** Tagline hanya boleh tampil bila gerbang memutuskan `pertahankan` (Jobdesk §1). */
export function bolehTagline(keputusan: KeputusanGerbang | string): boolean {
  return keputusan === "pertahankan";
}

export const LABEL_TIER: Record<Tier, string> = {
  tinggi: "Paparan tinggi",
  sedang: "Paparan sedang",
  rendah: "Paparan rendah",
};

/** Laju kecamatan dalam kalimat. Tidak pernah per desa (PRD FR-03). */
/** "Kecamatan X": nama dari data kadang sudah memuat kata "Kecamatan", jadi jangan diulang. */
export function sebutKecamatan(namaKec: string): string {
  return /^kecamatan\s/i.test(namaKec) ? namaKec : `Kecamatan ${namaKec}`;
}

export function kalimatKecamatan(k: { pMean: number; rateMin: number; rateMax: number }, namaKec: string): string {
  const p = (x: number) => `${formatAngka(Math.round(x * 100))}%`;
  return `Di ${sebutKecamatan(namaKec)}, rata-rata ${p(k.pMean)} desa terdeteksi satelit pada tahun kering ekstrem (terendah ${p(k.rateMin)}, tertinggi ${p(k.rateMax)} antar tahun).`;
}


/**
 * Kisah desa jangkar (Kali Bandung) dari deteksi satelit, plan 11 Task 5.
 * `tenang`: tahun 2020-2025 tanpa deteksi yang memenuhi ambang. `maksSebelum`: deteksi terbanyak 2020-2025.
 * Tahun yang tidak ada di larik dihitung nol.
 */
export function kisahJangkar(r: Pick<DesaTahun, "tahun" | "nDet" | "terpapar">[]): { tenang: number; maksSebelum: number; nDet2026: number } {
  const sebelum = r.filter((x) => x.tahun >= 2020 && x.tahun <= 2025);
  return {
    tenang: sebelum.filter((x) => !x.terpapar).length,
    maksSebelum: sebelum.reduce((m, x) => Math.max(m, x.nDet), 0),
    nDet2026: r.find((x) => x.tahun === 2026)?.nDet ?? 0,
  };
}
