"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MOCK_KODE } from "@/mocks/demo";

const BATAS_COBA = 10; // TRD §9: maksimal 10 percobaan per 15 menit
const AKUN_CONTOH: Record<string, "mpa" | "desa"> = { "demo-mpa": "mpa", "demo-sekdes": "desa" };

/**
 * Formulir Masuk (App Flow v2 §3.5). Pesan galat tidak menyebut mana yang salah.
 * Kata sandi boleh ditempel dan diisi pengelola kata sandi (WCAG 2.2 Accessible Authentication).
 * SEMENTARA: pemeriksaan akun tiruan; mengisi cookie `mock-peran` agar tampilan mpa dan desa bisa dicoba.
 */
export function MasukForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [sandi, setSandi] = useState("");
  const [lihat, setLihat] = useState(false);
  const [galat, setGalat] = useState("");
  const [memproses, setMemproses] = useState(false);
  const [coba, setCoba] = useState(0);
  const [sudahMasuk, setSudahMasuk] = useState(false);
  const refUser = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setSudahMasuk(document.cookie.includes("mock-peran="));
  }, []);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (coba >= BATAS_COBA) {
      setGalat("Coba lagi dalam 15 menit.");
      return;
    }
    setMemproses(true);
    setGalat("");
    await new Promise((r) => setTimeout(r, 600)); // meniru jeda jaringan
    const peran = AKUN_CONTOH[username.trim()];
    if (!peran || sandi.length === 0) {
      const n = coba + 1;
      setCoba(n);
      setGalat(n >= BATAS_COBA ? "Coba lagi dalam 15 menit." : "Username atau password salah.");
      setMemproses(false);
      refUser.current?.focus();
      return;
    }
    document.cookie = `mock-peran=${peran}; path=/; max-age=604800; samesite=lax`;
    router.push(`/desa/${MOCK_KODE}/kesiapan`);
  }

  function keluar() {
    document.cookie = "mock-peran=; path=/; max-age=0";
    setSudahMasuk(false);
    router.refresh();
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

      <aside className="mt-8 rounded-card border border-line bg-surface px-4 py-3 text-sm">
        <p className="font-semibold">Akun demonstrasi (data uji)</p>
        <ul className="mt-1 list-disc pl-5 text-muted">
          <li>
            <code>demo-mpa</code>: ketua MPA, hanya Kesiapan dan Alat.
          </li>
          <li>
            <code>demo-sekdes</code>: sekdes, semua layar desa.
          </li>
        </ul>
        <p className="mt-2 text-muted">Pratinjau: kata sandi apa saja diterima untuk dua akun ini.</p>
      </aside>

      {sudahMasuk ? (
        <button type="button" onClick={keluar} className="mt-4 min-h-11 rounded-card border border-line bg-surface px-4 font-semibold">
          Keluar dari akun contoh
        </button>
      ) : null}
    </div>
  );
}
