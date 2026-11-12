"use client";

import { useEffect, useRef, useState } from "react";
import { formatRupiah } from "@/lib/format";
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
  const [teks, setTeks] = useState(formatRupiah(pagu));
  const fokus = useRef(false);

  // Sinkron saat nilai berubah dari luar (mis. dibulatkan server), bukan saat sedang mengetik.
  useEffect(() => {
    if (!fokus.current) setTeks(formatRupiah(pagu));
  }, [pagu]);

  return (
    <section aria-labelledby="pagu-judul" className="rounded-card border border-line bg-surface px-4 py-4">
      <h2 id="pagu-judul" className="text-lg font-bold">
        Pagu belanja kesiapan
      </h2>
      <p className="text-sm text-muted">
        Anggaran yang sudah ditetapkan desa untuk belanja kesiapan karhutla tahun ini. Bila belum ada pos khusus, isi Rp0 dan seluruh kebutuhan diajukan lewat kanal lain.
      </p>

      <label htmlFor="pagu-input" className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
        Jumlah pagu (Rupiah)
        <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Diisi desa</span>
      </label>
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
          setTeks(formatRupiah(pagu));
        }}
        onChange={(e) => {
          setTeks(e.target.value);
          onChange(parsePagu(e.target.value));
        }}
        aria-describedby={berlebih ? "pagu-ket pagu-peringatan" : "pagu-ket"}
        aria-invalid={berlebih || undefined}
        className={`tabular mt-1 min-h-12 w-full rounded-card border bg-surface px-3 text-xl font-bold transition-colors ${berlebih ? "border-warn" : "border-line"}`}
      />
      <p id="pagu-ket" className="mt-2 text-xs text-faint">
        Angka ini isian desa, bukan hitungan sistem. Tersimpan otomatis dan dipakai di langkah Keputusan dan Usulan.
      </p>
      {berlebih ? (
        <p id="pagu-peringatan" role="status" className="muncul mt-3 rounded-card border border-warn/40 bg-warn-soft px-3 py-2 text-sm">
          <span className="font-semibold">Periksa lagi angkanya.</span> Pagu {formatRupiah(pagu)} jauh di atas seluruh kebutuhan paket minimum (
          {formatRupiah(kebutuhan!)}). Bila memang benar, sisa {formatRupiah(pagu - kebutuhan!)} tidak terpakai untuk kesiapan karhutla.
        </p>
      ) : null}
    </section>
  );
}
