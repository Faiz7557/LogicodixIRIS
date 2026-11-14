"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { PERAN_META, SANDI_MIN, cekSandi } from "@/lib/akun";
import { ApiError, api } from "@/lib/api-client";
import type { Akun, DesaHit, Peran } from "@/lib/types";

type Slot = { peran: Peran; username: string; terdaftar: boolean };
type Ketersediaan = { desa: DesaHit; slot: Slot[] };

const LANGKAH = ["Cari desa", "Pilih peran", "Buat password"] as const;

/**
 * Daftar akun dalam tiga langkah: cari desa yang terdaftar, pilih peran (ketua MPA atau sekdes),
 * lalu buat password. Nama pengguna dibentuk dari nama desa dan ditampilkan sebelum akun dibuat.
 * Satu desa hanya punya satu akun per peran; peran yang sudah terisi tidak bisa dipilih.
 */
export function DaftarForm() {
  const router = useRouter();
  const [langkah, setLangkah] = useState<0 | 1 | 2>(0);
  const [desa, setDesa] = useState<Ketersediaan | null>(null);
  const [peran, setPeran] = useState<Peran | null>(null);
  const [galat, setGalat] = useState("");
  const [memproses, mulai] = useTransition();

  const slot = desa?.slot.find((s) => s.peran === peran) ?? null;

  function pilihDesa(hit: DesaHit) {
    setGalat("");
    mulai(async () => {
      try {
        const k = await api<Ketersediaan>(`/api/auth/daftar?kode=${encodeURIComponent(hit.kode)}`);
        setDesa(k);
        // Peran pertama yang masih kosong dipilih lebih dulu.
        setPeran(k.slot.find((s) => !s.terdaftar)?.peran ?? null);
        setLangkah(1);
      } catch (e) {
        setGalat(e instanceof ApiError ? e.message : "Gagal memeriksa desa. Coba lagi.");
      }
    });
  }

  function daftar(sandi: string) {
    if (!desa || !peran) return;
    setGalat("");
    mulai(async () => {
      try {
        const { akun } = await api<{ akun: Akun }>("/api/auth/daftar", { method: "POST", json: { kode: desa.desa.kode, peran, password: sandi } });
        router.refresh();
        router.push(`/desa/${akun.desaKode}/kesiapan`);
      } catch (e) {
        setGalat(e instanceof ApiError ? e.message : "Terjadi galat. Coba lagi.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-[520px] px-4 py-8">
      <h1 className="text-2xl font-bold">Daftar akun desa</h1>
      <p className="mt-2 text-xl font-semibold leading-snug">Buat akun untuk ketua MPA atau sekretaris desa.</p>
      <p className="mt-1 text-sm text-muted">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-semibold text-water underline underline-offset-2">
          Masuk
        </Link>
      </p>

      <ol aria-label="Langkah pendaftaran" className="mt-6 grid grid-cols-3 gap-2">
        {LANGKAH.map((l, i) => {
          const on = i === langkah;
          const selesai = i < langkah;
          return (
            <li key={l} aria-current={on ? "step" : undefined} className="min-w-0">
              <span aria-hidden="true" className={`block h-1.5 rounded-full transition-colors duration-500 ${on || selesai ? "bg-ink" : "bg-line"}`} />
              <span className={`mt-1.5 block truncate text-xs ${on ? "font-semibold text-ink" : "text-muted"}`}>
                {i + 1}. {l}
              </span>
            </li>
          );
        })}
      </ol>

      <div key={langkah} className="masuk mt-5 rounded-panel border border-line bg-surface p-5 shadow-card">
        {langkah === 0 ? (
          <CariDesa onPilih={pilihDesa} memuat={memproses} />
        ) : langkah === 1 && desa ? (
          <PilihPeran desa={desa} peran={peran} onPeran={setPeran} onKembali={() => setLangkah(0)} onLanjut={() => setLangkah(2)} />
        ) : desa && slot ? (
          <BuatSandi desa={desa.desa} slot={slot} memproses={memproses} onKembali={() => setLangkah(1)} onKirim={daftar} />
        ) : null}
      </div>

      <p role="alert" className="mt-3 min-h-6 text-sm font-semibold text-danger">
        {galat}
      </p>
    </div>
  );
}

/** Langkah 1: cari desa terdaftar (GET /api/desa?q=, mulai dari 2 huruf, jeda 250 ms). */
function CariDesa({ onPilih, memuat }: { onPilih: (d: DesaHit) => void; memuat: boolean }) {
  const [q, setQ] = useState("");
  const [hasil, setHasil] = useState<{ untuk: string; hits: DesaHit[] } | { untuk: string; galat: true } | null>(null);
  const kata = q.trim();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => ref.current?.focus(), []);

  useEffect(() => {
    if (kata.length < 2) return;
    let batal = false;
    const t = setTimeout(() => {
      api<{ hasil: DesaHit[] }>(`/api/desa?q=${encodeURIComponent(kata)}`)
        .then(({ hasil }) => !batal && setHasil({ untuk: kata, hits: hasil }))
        .catch(() => !batal && setHasil({ untuk: kata, galat: true }));
    }, 250);
    return () => {
      batal = true;
      clearTimeout(t);
    };
  }, [kata]);

  const tampil = kata.length >= 2 && hasil?.untuk === kata ? hasil : null;

  return (
    <div>
      <label htmlFor="cari-desa" className="font-bold">
        Nama desa
      </label>
      <p className="text-sm text-muted">Ketik nama desa, kecamatan, atau kabupaten. Hanya desa yang terdaftar di Sigap Desa yang bisa dipilih.</p>
      <input
        ref={ref}
        id="cari-desa"
        type="search"
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="mis. Kali Bandung"
        className="mt-2 min-h-12 w-full rounded-card border border-line bg-surface px-3 text-base"
      />
      <div aria-live="polite" className="mt-3">
        {kata.length < 2 ? (
          <p className="text-sm text-muted">Mulai dari dua huruf.</p>
        ) : !tampil ? (
          <p className="text-sm text-muted">Mencari…</p>
        ) : "galat" in tampil ? (
          <p className="text-sm font-semibold text-danger">Gagal mencari. Periksa sinyal lalu ketik lagi.</p>
        ) : tampil.hits.length === 0 ? (
          <p className="text-sm text-muted">Tidak ada desa terdaftar dengan nama itu.</p>
        ) : (
          <ul className="max-h-80 divide-y divide-line overflow-y-auto overscroll-contain rounded-card border border-line">
            {tampil.hits.map((d, i) => (
              <li key={d.kode} className="muncul" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <button
                  type="button"
                  disabled={memuat}
                  onClick={() => onPilih(d)}
                  className="group flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-paper disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{d.nama}</span>
                    <span className="block truncate text-xs text-muted">
                      Kec. {d.kecNama}, {d.kabNama}, {d.provNama}
                    </span>
                  </span>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Langkah 2: pilih peran. Peran yang sudah punya akun di desa ini tampil terkunci. */
function PilihPeran({
  desa,
  peran,
  onPeran,
  onKembali,
  onLanjut,
}: {
  desa: Ketersediaan;
  peran: Peran | null;
  onPeran: (p: Peran) => void;
  onKembali: () => void;
  onLanjut: () => void;
}) {
  const semuaTerisi = desa.slot.every((s) => s.terdaftar);
  return (
    <div>
      <KartuDesa desa={desa.desa} onGanti={onKembali} />
      <fieldset className="mt-4">
        <legend className="font-bold">Daftar sebagai</legend>
        <div className="mt-2 grid gap-2">
          {desa.slot.map((s) => {
            const on = peran === s.peran;
            return (
              <label
                key={s.peran}
                className={`tekan flex min-h-14 items-start gap-3 rounded-card border px-4 py-3 transition-[border-color,box-shadow] duration-300 ${
                  s.terdaftar ? "cursor-not-allowed border-line bg-paper opacity-70" : on ? "cursor-pointer border-ink shadow-card ring-1 ring-ink" : "cursor-pointer border-line hover:border-line-2"
                }`}
              >
                <input
                  type="radio"
                  name="peran"
                  value={s.peran}
                  checked={on}
                  disabled={s.terdaftar}
                  onChange={() => onPeran(s.peran)}
                  className="mt-1 size-5 shrink-0 accent-[var(--ink)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2 font-bold">
                    {PERAN_META[s.peran].label}
                    {s.terdaftar ? <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted ring-1 ring-line">Sudah terdaftar</span> : null}
                  </span>
                  <span className="block text-sm text-muted">{PERAN_META[s.peran].keterangan}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {semuaTerisi ? (
        <p className="mt-3 text-sm text-muted">
          Desa ini sudah punya akun ketua MPA dan sekdes.{" "}
          <Link href="/masuk" className="font-semibold text-water underline underline-offset-2">
            Masuk
          </Link>{" "}
          dengan akun yang ada.
        </p>
      ) : null}
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onKembali} className="btn btn-kedua">
          Kembali
        </button>
        <button type="button" disabled={!peran} onClick={onLanjut} className="btn btn-utama flex-1">
          Lanjut
        </button>
      </div>
    </div>
  );
}

/** Langkah 3: password dan ulangi password. Nama pengguna ditampilkan supaya bisa dicatat. */
function BuatSandi({
  desa,
  slot,
  memproses,
  onKembali,
  onKirim,
}: {
  desa: DesaHit;
  slot: Slot;
  memproses: boolean;
  onKembali: () => void;
  onKirim: (sandi: string) => void;
}) {
  const [sandi, setSandi] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [coba, setCoba] = useState(false);
  const galatSandi = cekSandi(sandi);
  const galatUlang = ulang !== sandi ? "Password tidak sama." : null;
  const galat = galatSandi ?? galatUlang;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setCoba(true);
        if (!galat) onKirim(sandi);
      }}
    >
      <KartuDesa desa={desa} />
      <div className="mt-4 rounded-card bg-water-soft px-4 py-3">
        <p className="text-sm text-muted">Nama pengguna untuk masuk ({PERAN_META[slot.peran].label.toLowerCase()})</p>
        <p className="tabular text-lg font-bold text-water">{slot.username}</p>
        <p className="text-xs text-muted">Catat nama ini. Dipakai bersama password setiap kali masuk.</p>
      </div>

      <div className="mt-4">
        <label htmlFor="sandi-baru" className="text-sm font-semibold">
          Password
        </label>
        <input
          id="sandi-baru"
          type={lihat ? "text" : "password"}
          autoComplete="new-password"
          value={sandi}
          onChange={(e) => setSandi(e.target.value)}
          aria-invalid={coba && galatSandi ? true : undefined}
          aria-describedby="sandi-aturan"
          className={`mt-1 min-h-12 w-full rounded-card border bg-surface px-3 text-base ${coba && galatSandi ? "border-danger" : "border-line"}`}
        />
        <p id="sandi-aturan" className={`mt-1 text-xs ${coba && galatSandi ? "font-semibold text-danger" : "text-muted"}`}>
          {coba && galatSandi ? galatSandi : `Minimal ${SANDI_MIN} karakter.`}
        </p>
      </div>
      <div className="mt-3">
        <label htmlFor="sandi-ulang" className="text-sm font-semibold">
          Ulangi password
        </label>
        <input
          id="sandi-ulang"
          type={lihat ? "text" : "password"}
          autoComplete="new-password"
          value={ulang}
          onChange={(e) => setUlang(e.target.value)}
          aria-invalid={coba && !galatSandi && galatUlang ? true : undefined}
          aria-describedby="sandi-ulang-galat"
          className={`mt-1 min-h-12 w-full rounded-card border bg-surface px-3 text-base ${coba && !galatSandi && galatUlang ? "border-danger" : "border-line"}`}
        />
        <p id="sandi-ulang-galat" className="mt-1 min-h-4 text-xs font-semibold text-danger">
          {coba && !galatSandi && galatUlang ? galatUlang : ""}
        </p>
      </div>
      <label className="mt-1 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} className="size-4 accent-[var(--ink)]" />
        Tampilkan password
      </label>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={onKembali} disabled={memproses} className="btn btn-kedua">
          Kembali
        </button>
        <button
          type="submit"
          disabled={memproses}
          className="flex min-h-11 flex-1 items-center justify-center rounded-card bg-ember px-4 font-semibold text-white disabled:opacity-60"
        >
          {memproses ? "Membuat akun…" : "Buat akun dan masuk"}
        </button>
      </div>
    </form>
  );
}

function KartuDesa({ desa, onGanti }: { desa: DesaHit; onGanti?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-card border border-line bg-paper px-4 py-3">
      <span className="min-w-0">
        <span className="block text-xs text-muted">Desa</span>
        <span className="block truncate font-bold">{desa.nama}</span>
        <span className="block truncate text-xs text-muted">
          Kec. {desa.kecNama}, {desa.kabNama}
        </span>
      </span>
      {onGanti ? (
        <button type="button" onClick={onGanti} className="min-h-11 shrink-0 text-sm font-semibold text-water underline underline-offset-2">
          Ganti desa
        </button>
      ) : null}
    </div>
  );
}
