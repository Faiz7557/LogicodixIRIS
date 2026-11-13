"use client";

import { useState, useTransition } from "react";
import { SANDI_MIN, cekSandi } from "@/lib/akun";
import { ApiError, api } from "@/lib/api-client";

/**
 * Ganti password: password lama, password baru, dan ulangi. Setelah berhasil, perangkat lain
 * yang masih masuk dengan akun ini dikeluarkan; perangkat ini tetap masuk.
 */
export function GantiSandiForm() {
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [coba, setCoba] = useState(false);
  const [pesan, setPesan] = useState<{ teks: string; ok: boolean } | null>(null);
  const [memproses, mulai] = useTransition();

  const galatBaru = cekSandi(baru) ?? (baru && baru === lama ? "Password baru harus berbeda dari password lama." : null);
  const galatUlang = ulang !== baru ? "Password tidak sama." : null;
  const galatLama = lama ? null : "Isi password lama.";

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    setCoba(true);
    setPesan(null);
    if (galatLama || galatBaru || galatUlang) return;
    mulai(async () => {
      try {
        await api("/api/auth/sandi", { method: "POST", json: { lama, baru } });
        setLama("");
        setBaru("");
        setUlang("");
        setCoba(false);
        setPesan({ teks: "Password sudah diganti. Perangkat lain yang masih masuk dengan akun ini sudah dikeluarkan.", ok: true });
      } catch (err) {
        setPesan({ teks: err instanceof ApiError ? err.message : "Gagal mengganti password. Coba lagi.", ok: false });
      }
    });
  }

  const kelas = (salah: boolean) => `mt-1 min-h-12 w-full rounded-card border bg-surface px-3 text-base ${salah ? "border-danger" : "border-line"}`;
  const tipe = lihat ? "text" : "password";

  return (
    <form noValidate onSubmit={kirim} aria-labelledby="ganti-sandi" className="masuk mt-4 rounded-panel border border-line bg-surface p-5 shadow-card md:p-6" style={{ animationDelay: "80ms" }}>
      <h2 id="ganti-sandi" className="text-lg font-bold">
        Ganti password
      </h2>
      <p className="text-sm text-muted">Masukkan password lama, lalu password baru dua kali.</p>

      <div className="mt-4 grid gap-3">
        <div>
          <label htmlFor="sandi-lama" className="text-sm font-semibold">
            Password lama
          </label>
          <input id="sandi-lama" type={tipe} autoComplete="current-password" value={lama} onChange={(e) => setLama(e.target.value)} aria-invalid={coba && galatLama ? true : undefined} className={kelas(coba && !!galatLama)} />
          {coba && galatLama ? <p className="mt-1 text-xs font-semibold text-danger">{galatLama}</p> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="sandi-baru" className="text-sm font-semibold">
              Password baru
            </label>
            <input id="sandi-baru" type={tipe} autoComplete="new-password" value={baru} onChange={(e) => setBaru(e.target.value)} aria-invalid={coba && galatBaru ? true : undefined} aria-describedby="sandi-baru-ket" className={kelas(coba && !!galatBaru)} />
            <p id="sandi-baru-ket" className={`mt-1 text-xs ${coba && galatBaru ? "font-semibold text-danger" : "text-muted"}`}>
              {coba && galatBaru ? galatBaru : `Minimal ${SANDI_MIN} karakter.`}
            </p>
          </div>
          <div>
            <label htmlFor="sandi-ulang" className="text-sm font-semibold">
              Ulangi password baru
            </label>
            <input id="sandi-ulang" type={tipe} autoComplete="new-password" value={ulang} onChange={(e) => setUlang(e.target.value)} aria-invalid={coba && !galatBaru && galatUlang ? true : undefined} className={kelas(coba && !galatBaru && !!galatUlang)} />
            {coba && !galatBaru && galatUlang ? <p className="mt-1 text-xs font-semibold text-danger">{galatUlang}</p> : null}
          </div>
        </div>
      </div>

      <label className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} className="size-4 accent-[var(--ink)]" />
        Tampilkan password
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={memproses} className="flex min-h-11 items-center justify-center rounded-card bg-ember px-5 font-semibold text-white disabled:opacity-60">
          {memproses ? "Menyimpan…" : "Simpan password baru"}
        </button>
        <p role="status" aria-live="polite" className={`text-sm font-semibold ${pesan?.ok ? "text-ok" : "text-danger"}`}>
          {pesan?.teks}
        </p>
      </div>
    </form>
  );
}
