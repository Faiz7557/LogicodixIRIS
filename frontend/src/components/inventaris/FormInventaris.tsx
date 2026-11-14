"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { GambarItem } from "@/components/kesiapan/GambarItem";
import { KartuTerkunci } from "@/components/kesiapan/ItemTerkunci";
import { Stepper } from "@/components/ui/Stepper";
import { ApiError } from "@/lib/api-client";
import { formatAngka, formatWaktu, keteranganMeter } from "@/lib/format";
import {
  awalForm,
  bacaAngka,
  barisTerisi,
  ikutTotal,
  selaraskan,
  berubah,
  susunPayload,
  validasiBaris,
  type FormState,
  type GalatBaris,
  type NilaiForm,
} from "@/lib/inventaris";
import { simpanInventaris } from "@/lib/inventarisApi";
import type { CatalogItem, InventoryRow } from "@/lib/types";

type Fase = "diam" | "menyimpan" | "tersimpan" | "galat";

/**
 * Formulir Catat Alat (App Flow v2 §3.6). Satu kolom per item, bilah simpan menempel di bawah.
 * Prinsip UX: boleh disimpan sebagian, galat muncul dekat isian setelah disentuh atau saat simpan,
 * status simpan selalu terlihat, dan isian tidak pernah hilang saat penyimpanan gagal.
 */
export function FormInventaris({
  kode,
  catalog,
  target,
  tersimpan,
  terakhir,
  namaPengisi,
  onNilai,
  terkunci = [],
}: {
  kode: string;
  catalog: CatalogItem[];
  /** Paket minimum per item, untuk keterangan "Paket minimum: 10 buah". */
  target: Record<string, number>;
  tersimpan: InventoryRow[];
  terakhir: { oleh: string; waktu: string } | null;
  namaPengisi: string;
  /** Dipanggil tiap isian berubah, untuk pratinjau langsung di luar formulir. */
  onNilai?: (form: FormState) => void;
  /** Item yang belum terbuka untuk desa ini (mis. sumur bor di desa tanpa gambut): tampil tanpa isian. */
  terkunci?: CatalogItem[];
}) {
  const router = useRouter();
  const awal = useMemo(() => awalForm(catalog, tersimpan), [catalog, tersimpan]);
  const [form, setForm] = useState<FormState>(awal);
  const [dasar, setDasar] = useState<FormState>(awal); // keadaan terakhir yang tersimpan
  // Data tersimpan dari server bisa berganti tanpa komponen ini dibuat ulang (router.refresh, atau halaman
  // yang disimpan Next saat kembali). Isian yang belum disimpan dibiarkan; selain itu ikut data terbaru.
  const [awalTerakhir, setAwalTerakhir] = useState(awal);
  const [terakhirTerakhir, setTerakhirTerakhir] = useState(terakhir);
  const [disentuh, setDisentuh] = useState<Record<string, boolean>>({});
  const [sudahCobaSimpan, setSudahCobaSimpan] = useState(false);
  const [fase, setFase] = useState<Fase>("diam");
  const [pesanGalat, setPesanGalat] = useState("");
  const [info, setInfo] = useState(terakhir);
  const formRef = useRef<HTMLFormElement>(null);
  const [sorot, setSorot] = useState<string | null>(null);

  const kotor = berubah(dasar, form);
  if (awal !== awalTerakhir) {
    setAwalTerakhir(awal);
    if (!kotor && berubah(dasar, awal)) {
      setForm(awal);
      setDasar(awal);
    }
  }
  if (terakhir !== terakhirTerakhir) {
    setTerakhirTerakhir(terakhir);
    if (terakhir) setInfo(terakhir);
  }

  useEffect(() => {
    onNilai?.(form);
  }, [form, onNilai]);

  // Datang dari kartu item di Kesiapan (#alat-<kode>): gulir ke item itu, sorot, dan fokuskan isian pertamanya.
  useEffect(() => {
    const m = /^#alat-(.+)$/.exec(window.location.hash);
    if (!m || !catalog.some((c) => c.kode === m[1])) return;
    const kodeItem = m[1];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hash hanya bisa dibaca setelah mount
    setSorot(kodeItem);
    requestAnimationFrame(() => {
      const el = document.getElementById(`alat-${kodeItem}`);
      el?.scrollIntoView({ block: "start" });
      el?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true });
    });
  }, [catalog]);

  // Peringatan bila meninggalkan halaman dengan isian belum tersimpan.
  useEffect(() => {
    if (!kotor) return;
    const f = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", f);
    return () => window.removeEventListener("beforeunload", f);
  }, [kotor]);

  // Isian saat kolom total mulai diketik, acuan aturan "ikut total" selama mengetik.
  const awalKetik = useRef<Record<string, NilaiForm>>({});

  // `selaras` false: total sedang diketik (mis. "1" menuju "12"), jadi berfungsi belum dipotong;
  // pemotongan menyusul saat kolom total ditinggalkan. "Ikut total" tetap berlaku langsung.
  function ubah(kodeItem: string, kolom: "total" | "berfungsi" | "catatan", nilai: string, selaras = true) {
    const item = catalog.find((c) => c.kode === kodeItem)!;
    setForm((f) => {
      const lama = f[kodeItem];
      let baru = { ...lama, [kolom]: nilai };
      if (kolom === "total") baru = ikutTotal(item, selaras ? lama : (awalKetik.current[kodeItem] ?? lama), baru);
      return { ...f, [kodeItem]: selaras ? selaraskan(item, baru, kolom) : baru };
    });
    if (fase === "tersimpan" || fase === "galat") setFase("diam");
  }

  const galatTampil = (item: CatalogItem): GalatBaris => {
    if (!sudahCobaSimpan && !disentuh[item.kode]) return {};
    return validasiBaris(item, form[item.kode]);
  };

  const semuaGalat = catalog.filter((i) => barisTerisi(i, form[i.kode]) && Object.keys(validasiBaris(i, form[i.kode])).length > 0);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    setSudahCobaSimpan(true);
    const { baris, jumlahGalat } = susunPayload(catalog, form);
    if (jumlahGalat > 0) {
      // arahkan fokus ke isian bergalat pertama
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setFase("menyimpan");
    setPesanGalat("");
    try {
      const hasil = await simpanInventaris(kode, baris);
      setDasar(form);
      setInfo({ oleh: namaPengisi, waktu: hasil.disimpanPada });
      setFase("tersimpan");
      // Muat ulang data server: indikator di halaman ini dan layar lain (Kesiapan, Prioritas) ikut angka baru.
      router.refresh();
    } catch (err) {
      setPesanGalat(err instanceof ApiError ? err.message : "Penyimpanan gagal. Isian masih ada di layar. Coba lagi.");
      setFase("galat");
    }
  }

  // Teks status bilah simpan: selalu satu kalimat, selalu terlihat.
  let status: { teks: string; ragam: "normal" | "galat" | "ok" };
  if (fase === "menyimpan") status = { teks: "Menyimpan…", ragam: "normal" };
  else if (fase === "galat") status = { teks: pesanGalat, ragam: "galat" };
  else if (sudahCobaSimpan && semuaGalat.length > 0)
    status = { teks: `Periksa ${semuaGalat.length} item yang bertanda.`, ragam: "galat" };
  else if (kotor) status = { teks: "Ada perubahan yang belum disimpan.", ragam: "normal" };
  else if (fase === "tersimpan" && info)
    status = { teks: `Tersimpan oleh ${info.oleh}, ${formatWaktu(info.waktu)}.`, ragam: "ok" };
  else if (info) status = { teks: `Terakhir diisi oleh ${info.oleh}, ${formatWaktu(info.waktu)}.`, ragam: "normal" };
  else status = { teks: "Belum ada alat yang tersimpan.", ragam: "normal" };

  const warnaStatus = status.ragam === "galat" ? "text-danger font-semibold" : status.ragam === "ok" ? "text-ok font-semibold" : "text-muted";
  const selesai = fase === "tersimpan" && !kotor;

  return (
    <form ref={formRef} onSubmit={simpan} noValidate className="pb-32 md:pb-0">
      <div className="space-y-4">
        {catalog.map((item) => (
          <KartuItem
            key={item.kode}
            item={item}
            nilai={form[item.kode]}
            targetItem={target[item.kode]}
            galat={galatTampil(item)}
            onUbah={(kolom, v, selaras) => ubah(item.kode, kolom, v, selaras)}
            onSentuh={() => setDisentuh((d) => ({ ...d, [item.kode]: true }))}
            onTotalMulai={() => {
              awalKetik.current[item.kode] = form[item.kode];
            }}
            onTotalSelesai={() => {
              delete awalKetik.current[item.kode];
              setForm((f) => ({ ...f, [item.kode]: selaraskan(item, f[item.kode], "total") }));
            }}
            disorot={sorot === item.kode}
          />
        ))}
        {terkunci.map((item) => (
          <KartuTerkunci key={item.kode} item={item} />
        ))}
      </div>

      <div
        className="no-print fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-surface md:sticky md:bottom-0"
      >
        <div className="mx-auto flex max-w-[720px] items-center gap-3 px-4 py-2">
          <p aria-live="polite" className={`flex-1 text-sm leading-snug ${warnaStatus}`}>
            {status.teks}
          </p>
          {selesai ? (
            <Link
              href={`/desa/${kode}/kesiapan`}
              className="flex min-h-11 shrink-0 items-center rounded-card bg-ember px-4 font-semibold text-white"
            >
              Lihat kesiapan
            </Link>
          ) : (
            <button
              type="submit"
              disabled={fase === "menyimpan"}
              className="min-h-11 shrink-0 rounded-card bg-ember px-5 font-semibold text-white disabled:opacity-60"
            >
              {fase === "menyimpan" ? "Menyimpan…" : fase === "galat" ? "Coba lagi" : "Simpan"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function KartuItem({
  item,
  nilai,
  targetItem,
  galat,
  onUbah,
  onSentuh,
  onTotalMulai,
  onTotalSelesai,
  disorot,
}: {
  item: CatalogItem;
  nilai: { total: string; berfungsi: string; catatan: string };
  targetItem?: number;
  galat: GalatBaris;
  onUbah: (kolom: "total" | "berfungsi" | "catatan", v: string, selaras?: boolean) => void;
  onSentuh: () => void;
  onTotalMulai: () => void;
  onTotalSelesai: () => void;
  disorot?: boolean;
}) {
  const b = bacaAngka(nilai.berfungsi);
  const t = bacaAngka(nilai.total);
  // Batas atas "Yang berfungsi" = jumlah total (alat rusak tetap boleh membuat total lebih besar).
  const maks = item.punyaRusak && t.jenis === "ok" ? t.nilai : undefined;
  const ringkas =
    b.jenis === "ok" && targetItem !== undefined ? `${formatAngka(b.nilai)} / ${formatAngka(targetItem)} ${item.satuan}` : null;
  const id = `alat-${item.kode}`;

  return (
    <fieldset id={id} className={`@container scroll-mt-24 rounded-card border bg-surface px-4 py-4 ${disorot ? "border-ember ring-2 ring-ember/30" : "border-line"}`}>
      <legend className="float-left w-full">
        <span className="flex items-center gap-3">
          <GambarItem kode={item.kode} className="size-11" />
          <span>
            <span className="text-lg font-bold">{item.nama}</span>
            <span className="ml-2 text-sm text-muted">({item.satuan})</span>
          </span>
        </span>
      </legend>
      <div className="clear-both" />
      {targetItem !== undefined ? (
        <p className="mb-3 text-sm text-muted">Paket minimum: {formatAngka(targetItem)} {item.satuan}</p>
      ) : null}

      {item.punyaRusak ? (
        <div className="grid grid-cols-1 gap-x-6 @[31rem]:grid-cols-2">
          <Stepper
            id={`${id}-total`}
            label="Jumlah total"
            value={nilai.total}
            onChange={(v, dariTombol) => onUbah("total", v, dariTombol)}
            onFocus={onTotalMulai}
            onBlur={() => {
              onTotalSelesai();
              onSentuh();
            }}
            error={galat.total}
          />
          <Stepper
            id={`${id}-berfungsi`}
            label="Yang berfungsi"
            value={nilai.berfungsi}
            max={maks}
            bantuanMaks="Sudah sama dengan jumlah total. Tambah jumlah total dulu bila ada alat baru."
            onChange={(v) => onUbah("berfungsi", v)}
            onBlur={onSentuh}
            error={galat.berfungsi}
          />
        </div>
      ) : (
        <Stepper id={`${id}-berfungsi`} label={`Dana yang tersedia (${item.satuan})`} value={nilai.berfungsi} onChange={(v) => onUbah("berfungsi", v)} onBlur={onSentuh} error={galat.berfungsi} />
      )}

      {ringkas ? (
        <p className="tabular mt-1 text-sm font-semibold">
          {ringkas}
          {item.kode === "selang_keluar" && b.jenis === "ok" ? (
            <span className="ml-2 font-normal text-muted">{keteranganMeter(b.nilai)}</span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-3">
        <label htmlFor={`${id}-catatan`} className="text-sm font-semibold">
          Catatan <span className="font-normal text-muted">(boleh kosong)</span>
        </label>
        <input
          id={`${id}-catatan`}
          type="text"
          maxLength={200}
          value={nilai.catatan}
          onChange={(e) => onUbah("catatan", e.target.value)}
          onBlur={onSentuh}
          aria-invalid={galat.catatan ? true : undefined}
          aria-describedby={`${id}-catatan-bantu`}
          className={`mt-1 min-h-11 w-full rounded-card border bg-surface px-3 ${galat.catatan ? "border-danger" : "border-line"}`}
        />
        <p id={`${id}-catatan-bantu`} aria-live="polite" className={`mt-1 text-sm ${galat.catatan ? "text-danger" : "text-muted"}`}>
          {galat.catatan ?? "Jangan tulis nama, NIK, atau nomor HP."}
        </p>
      </div>
    </fieldset>
  );
}
