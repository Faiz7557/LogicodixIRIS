"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BilahAksi, kelasAksiUtama } from "@/components/ui/BilahAksi";
import { EmptyState } from "@/components/ui/PageState";
import { ApiError, api } from "@/lib/api-client";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { totalBiaya } from "@/lib/prioritas";
import { KANAL, KANAL_META, labelKanal } from "@/lib/usulan";
import type { Kanal, PriorityRow, Usulan } from "@/lib/types";

/**
 * Layar Usulan (App Flow v2 §3.9): daftar usulan yang pernah terbit, pilihan kanal, tombol terbitkan.
 * Usulan tidak bisa diubah setelah terbit; untuk memperbarui, terbitkan yang baru.
 * Semua fakta dibekukan server saat terbit; layar ini hanya memilih kanal lalu pindah ke dokumen.
 */
export function UsulanView({
  kode,
  namaDesa,
  paguRp,
  disetujui,
  riwayat,
}: {
  kode: string;
  namaDesa: string;
  paguRp: number;
  disetujui: PriorityRow[];
  riwayat: Usulan[];
}) {
  const router = useRouter();
  const [kanal, setKanal] = useState<Kanal>("apbdes_perubahan");
  const [galat, setGalat] = useState("");
  const [mengirim, setMengirim] = useState(false);

  const total = totalBiaya(disetujui);

  async function terbitkan() {
    setGalat("");
    setMengirim(true);
    try {
      const { id } = await api<{ id: number }>(`/api/desa/${kode}/usulan`, { method: "POST", json: { kanal } });
      router.push(`/desa/${kode}/usulan/${id}`);
    } catch (e) {
      setGalat(e instanceof ApiError ? e.message : "Terjadi galat. Coba lagi.");
      setMengirim(false);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-6 pb-32 md:pb-6">
      <header>
        <h1 className="text-2xl font-bold">Usulan</h1>
        <p className="text-sm text-muted">{namaDesa}</p>
        <p className="mt-1 text-sm text-muted">Pagu rencana {formatRupiah(paguRp)}.</p>
        <p className="mt-3 text-xl font-semibold leading-snug">
          {disetujui.length > 0
            ? `${disetujui.length} baris disetujui, total ${formatRupiah(total)}. Pilih tujuan usulan.`
            : "Belum ada baris yang disetujui."}
        </p>
      </header>

      {galat ? (
        <p role="alert" className="mt-3 rounded-card border border-danger/40 bg-surface px-4 py-3 text-sm font-semibold text-danger">
          {galat}
        </p>
      ) : null}

      {disetujui.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="Setujui dulu minimal satu baris belanja." action={{ href: `/desa/${kode}/prioritas`, label: "Ke Prioritas" }}>
            Usulan hanya memuat baris yang sudah disetujui desa.
          </EmptyState>
        </div>
      ) : null}

      <fieldset className="mt-6">
        <legend className="text-lg font-bold">Tujuan usulan</legend>
        <p className="text-sm text-muted">Isi faktanya sama; sapaan dan penekanan menyesuaikan tujuan.</p>
        <div className="mt-3 grid gap-2">
          {KANAL.map((k) => (
            <label
              key={k}
              className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-card border px-4 py-3 ${
                kanal === k ? "border-ink bg-surface ring-2 ring-ink" : "border-line bg-surface"
              }`}
            >
              <input type="radio" name="kanal" value={k} checked={kanal === k} onChange={() => { setKanal(k); setGalat(""); }} className="mt-1 size-5 accent-[var(--ember)]" />
              <span>
                <span className="block font-bold">{KANAL_META[k].label}</span>
                <span className="block text-sm text-muted">
                  Kepada: {KANAL_META[k].sapaan}. Penekanan: {KANAL_META[k].penekanan}.
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {disetujui.length > 0 ? (
        <section aria-labelledby="isi" className="mt-6">
          <h2 id="isi" className="text-lg font-bold">
            Yang akan dimuat
          </h2>
          <ul className="mt-2 divide-y divide-line rounded-card border border-line bg-surface">
            {disetujui.map((b) => (
              <li key={`${b.itemKode}:${b.aksi}`} className="flex items-baseline justify-between gap-3 px-4 py-3">
                <span>{b.alasan}</span>
                <span className="tabular shrink-0 font-bold">{formatRupiah(b.biayaRp)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="riwayat" className="mt-8">
        <h2 id="riwayat" className="text-lg font-bold">
          Usulan yang pernah terbit
        </h2>
        {riwayat.length === 0 ? (
          <p className="mt-1 text-muted">Belum ada. Usulan pertama akan muncul di sini setelah diterbitkan.</p>
        ) : (
          <ul className="mt-2 divide-y divide-line rounded-card border border-line bg-surface">
            {riwayat.map((u) => (
              <li key={u.id}>
                <Link href={`/desa/${kode}/usulan/${u.id}`} className="flex min-h-14 items-center justify-between gap-3 px-4 py-3">
                  <span>
                    <span className="block font-semibold">{labelKanal(u.kanal)}</span>
                    <span className="block text-sm text-muted">{formatTanggal(u.createdAt)}</span>
                  </span>
                  <span className="tabular shrink-0 font-bold">{u.facts.total_usulan}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BilahAksi teks={disetujui.length > 0 ? `Tujuan: ${labelKanal(kanal)}.` : "Belum ada baris yang disetujui."} ragam="normal">
        <button
          type="button"
          onClick={terbitkan}
          disabled={mengirim || disetujui.length === 0}
          className={`${kelasAksiUtama} ${mengirim || disetujui.length === 0 ? "opacity-50" : ""}`}
        >
          {mengirim ? "Menerbitkan…" : "Terbitkan usulan"}
        </button>
      </BilahAksi>
    </div>
  );
}
