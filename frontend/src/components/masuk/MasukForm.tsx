"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ApiError, api } from "@/lib/api-client";
import type { Akun } from "@/lib/types";

/**
 * Formulir Masuk (App Flow v2 §3.5). Pesan galat tidak menyebut mana yang salah.
 * Kata sandi boleh ditempel dan diisi pengelola kata sandi (WCAG 2.2 Accessible Authentication).
 * Batas percobaan (10 per 15 menit) dijaga server; pesannya ditampilkan apa adanya.
 */
export function MasukForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [sandi, setSandi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  // Transisi: "sedang masuk" berakhir sendiri setelah pindah halaman, tidak tertahan saat kembali ke /masuk.
  const [memproses, mulai] = useTransition();
  const refUser = useRef<HTMLInputElement>(null);

  function kirim(e: React.FormEvent) {
    e.preventDefault();
    setGalat("");
    mulai(async () => {
      try {
        const { akun } = await api<{ akun: Akun }>("/api/auth/masuk", {
          method: "POST",
          json: { username: username.trim(), password: sandi },
        });
        // Kerangka (menu, tombol Masuk/Keluar) dan halaman yang tersimpan di peramban dimuat ulang dengan sesi baru.
        router.refresh();
        router.push(`/desa/${akun.desaKode}/kesiapan`);
      } catch (err) {
        // 401 "Username atau password salah.", 429 "Coba lagi dalam 15 menit." (App Flow §3.5)
        setGalat(err instanceof ApiError ? err.message : "Terjadi galat. Coba lagi.");
        refUser.current?.focus();
      }
    });
  }

  const kelasInput = `mt-1 min-h-12 w-full rounded-card border bg-surface px-3 text-base ${galat ? "border-danger" : "border-line"}`;

  return (
    <div className="mx-auto max-w-[420px] px-4 py-8">
      <h1 className="text-2xl font-bold">Masuk</h1>
      <p className="mt-2 text-xl font-semibold leading-snug">Masuk untuk mencatat alat dan menyusun prioritas desa.</p>
      <p className="mt-1 text-sm text-muted">Paparan, Time Machine, dan Data bisa dilihat tanpa akun.</p>

      <form onSubmit={kirim} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="text-sm font-semibold">
            Username
          </label>
          <input
            ref={refUser}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={galat ? true : undefined}
            aria-describedby="masuk-galat"
            className={kelasInput}
          />
        </div>
        <div>
          <label htmlFor="sandi" className="text-sm font-semibold">
            Password
          </label>
          <div className="relative">
            <input
              id="sandi"
              name="password"
              type={lihat ? "text" : "password"}
              autoComplete="current-password"
              value={sandi}
              onChange={(e) => setSandi(e.target.value)}
              aria-invalid={galat ? true : undefined}
              aria-describedby="masuk-galat"
              className={`${kelasInput} pr-24`}
            />
            <button
              type="button"
              aria-pressed={lihat}
              onClick={() => setLihat((v) => !v)}
              className="absolute right-1 top-1 mt-1 flex min-h-10 items-center rounded-card px-3 text-sm font-semibold text-water"
            >
              {lihat ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>

        <p id="masuk-galat" role="alert" className="min-h-6 text-sm font-semibold text-danger">
          {galat}
        </p>

        <button
          type="submit"
          disabled={memproses}
          className="flex min-h-12 w-full items-center justify-center rounded-card bg-ember px-4 text-base font-semibold text-white disabled:opacity-60"
        >
          {memproses ? "Memeriksa…" : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-semibold text-water underline underline-offset-2">
          Daftar akun desa
        </Link>
      </p>
    </div>
  );
}
