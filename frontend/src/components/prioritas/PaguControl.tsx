"use client";

import { useEffect, useRef, useState } from "react";
import { formatAngka, formatRupiah } from "@/lib/format";
import { parsePagu } from "@/lib/prioritas";

/**
 * Isian pagu. Pagu bukan pilihan bebas: angkanya disalin dari anggaran kesiapan karhutla
 * yang sudah ditetapkan desa, jadi hanya ada kotak Rupiah, tanpa preset atau penggeser.
 * Perubahan langsung dilaporkan; penundaan 300 ms untuk menghitung ulang ada di induknya.
 */
export function PaguControl({
  pagu,
  onChange,
  kebutuhan,
}: {
  pagu: number;
  onChange: (v: number) => void;
  /** Biaya seluruh kebutuhan yang punya harga; dipakai untuk memperingatkan pagu yang jauh berlebih. */
  kebutuhan?: number;
}) {
  // Pagu dua kali lipat atau lebih dari seluruh kebutuhan hampir pasti salah ketik (mis. kelebihan nol).
  const berlebih = kebutuhan !== undefined && kebutuhan > 0 && pagu >= kebutuhan * 2;
  const [teks, setTeks] = useState(formatAngka(pagu));
  const fokus = useRef(false);

  // Sinkron saat nilai berubah dari luar (mis. dibulatkan server), bukan saat sedang mengetik.
  useEffect(() => {
    if (!fokus.current) setTeks(formatAngka(pagu));
  }, [pagu]);

  return (
    <section aria-labelledby="pagu-judul" className="flex h-full flex-col rounded-panel border border-line bg-surface p-5 shadow-card">
      <h2 id="pagu-judul" className="text-lg font-bold">
        Anggaran yang didapat
      </h2>
      <p className="text-sm text-muted">
        Uang yang didapat desa tahun ini untuk alat pemadam kebakaran lahan. Belum dapat? Isi Rp0, nanti semua kebutuhan bisa diajukan ke pihak lain.
      </p>

      <label htmlFor="pagu-input" className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
        Jumlah anggaran yang didapat (Rupiah)
        <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Diisi desa</span>
      </label>
      {/* "Rp" tetap di depan dan tidak bisa dihapus; kolom hanya menerima angka, titik ribuan ditambahkan otomatis. */}
      <div
        className={`mt-1 flex min-h-12 items-center rounded-card border bg-surface px-3 transition-colors focus-within:ring-2 focus-within:ring-ember ${berlebih ? "border-warn" : "border-line"}`}
      >
        <span aria-hidden="true" className="select-none pr-1.5 text-xl font-bold text-muted">
          Rp
        </span>
        <input
          id="pagu-input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={teks}
          onFocus={(e) => {
            fokus.current = true;
            e.currentTarget.select();
          }}
          onBlur={() => {
            fokus.current = false;
            setTeks(formatAngka(pagu));
          }}
          onChange={(e) => {
            const v = parsePagu(e.target.value);
            setTeks(formatAngka(v));
            onChange(v);
          }}
          aria-describedby={berlebih ? "pagu-ket pagu-peringatan" : "pagu-ket"}
          aria-invalid={berlebih || undefined}
          className="tabular min-w-0 flex-1 bg-transparent text-xl font-bold focus-visible:outline-none"
        />
      </div>
      <p id="pagu-ket" className="mt-2 text-xs text-faint">
        Salin dari anggaran desa (APBDes), bukan tebakan sistem. Tersimpan otomatis dan dipakai di langkah berikutnya.
      </p>
      {berlebih ? (
        <p id="pagu-peringatan" role="status" className="muncul mt-3 rounded-card border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
          <span className="font-semibold">Periksa lagi angkanya, mungkin kelebihan nol.</span> Anggaran {formatRupiah(pagu)} jauh di atas semua kebutuhan alat (
          {formatRupiah(kebutuhan!)}). Kalau memang benar, sisa {formatRupiah(pagu - kebutuhan!)} tidak terpakai untuk alat pemadam.
        </p>
      ) : null}
    </section>
  );
}
