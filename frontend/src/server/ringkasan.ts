import { kesimpulanBacktest } from "@/lib/backtest";
import { formatAngka, formatPersen, formatRupiah, formatSkor } from "@/lib/format";
import { LABEL_TIER, headlinePaparan, labelTampakAman } from "@/lib/kalimat";
import { barisTindakan, urutkanKesenjangan } from "@/lib/kesiapan";
import { keyBaris, ringkasAnggaran, ringkasKeputusan, type KeputusanMap } from "@/lib/prioritas";
import { NAMA_BULAN, statistikSatelit } from "@/lib/satelitBulanan";
import type { CatalogItem, HalamanRingkasan, Ringkasan, Status } from "@/lib/types";
import { getHargaEfektif } from "./efektif";
import { HttpError } from "./http";
import { getKesiapan } from "./kesiapan";
import { modelPenulis, tulisJson } from "./llm";
import { getPrioritas } from "./prioritas";
import { getBacktest, getCatalog, getDesaCard } from "./queries";

/*
 * Ringkasan satu halaman (plan 09 Bagian C). Server menyusun fakta yang sudah diformat persis seperti di layar,
 * OpenAI hanya menulis kalimat dari fakta itu, lalu keluarannya diperiksa. Gagal apa pun: template berlabel.
 * Yang tidak pernah masuk fakta: nama dan kode desa, kecamatan, kabupaten, nama akun, catatan pengguna.
 */

export type Fakta = Record<string, string | string[]>;

const ANGKA = /\d+(?:[.,]\d+)*/g;
const MAKS_JUDUL = 160;
const MAKS_BUTIR = 240;
const TAHUN_UJI = 2026;

export const KATA_TERLARANG = [
  "penyebab",
  "pelaku",
  "dibakar oleh",
  "asal api",
  "perusahaan membakar",
  "hektare terselamatkan",
  "tervalidasi",
  "dijamin aman",
  "pasti aman",
  "bebas api",
];

const STATUS_TEKS: Record<Status, string> = { siap: "siap", sebagian: "sebagian siap", rawan: "rawan" };
const AKSI_TEKS = { beli: "Beli", perbaiki: "Perbaiki" } as const;
const STATUS_KEPUTUSAN = { setuju: "disetujui", tunda: "ditunda", tolak: "ditolak", belum: "belum diputuskan" } as const;

const CATATAN_WAJIB: Record<HalamanRingkasan, string> = {
  paparan: "Tanpa deteksi satelit bukan berarti aman. Ini deteksi satelit, bukan luas terbakar.",
  kesiapan: "Skor mengukur kelengkapan paket minimum asumsi tim, bukan jaminan api bisa dipadamkan.",
  prioritas: "Urutan ini hasil hitungan dengan sebagian harga asumsi tim; keputusan tetap di musyawarah desa.",
  anggaran: "Anggaran dan harga berasal dari acuan tim; sisa anggaran bukan berarti alat sudah cukup.",
  timemachine: "Ini uji mundur pada deteksi satelit, bukan ramalan kebakaran di desa tertentu.",
};

const SKEMA = {
  name: "ringkasan",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["judul", "butir"],
    properties: { judul: { type: "string" }, butir: { type: "array", items: { type: "string" } } },
  },
};

const namaItem = (catalog: CatalogItem[], kode: string) => catalog.find((c) => c.kode === kode)?.nama ?? kode;
const teks = (f: Fakta, k: string, cadangan = "") => {
  const v = f[k];
  return typeof v === "string" ? v : cadangan;
};
const larik = (f: Fakta, k: string): string[] => {
  const v = f[k];
  return Array.isArray(v) ? v : [];
};

function wajibKode(kode: string | undefined): string {
  if (!kode) throw new HttpError(400, "input_tidak_sah", "Kode desa wajib diisi.");
  return kode;
}

export async function faktaRingkasan(halaman: HalamanRingkasan, kode?: string): Promise<Fakta> {
  const catatan_wajib = CATATAN_WAJIB[halaman];

  if (halaman === "timemachine") {
    const bt = await getBacktest();
    const cap = (s: string) =>
      bt.metrik.find((m) => m.tahunUji === TAHUN_UJI && m.unit === "desa" && m.metrik === "capture_20" && m.strategi === s)?.nilai;
    const paparan = cap("paparan");
    const acak = cap("acak");
    const kohort = (nama: string) => bt.grup.find((g) => g.grup === nama && g.strata === "semua");
    const kohortTeks = (nama: string) => {
      const g = kohort(nama);
      return g ? `${formatAngka(g.nTerpapar2026)} dari ${formatAngka(g.nDesa)} desa` : "belum ada";
    };
    return {
      tahun_uji: String(TAHUN_UJI),
      keputusan_gerbang: bt.gerbang.keputusan,
      uji_a: bt.gerbang.a ? "lulus" : "tidak lulus",
      uji_b: bt.gerbang.b ? "lulus" : "tidak lulus",
      kesimpulan_2026: kesimpulanBacktest(bt.metrik, TAHUN_UJI),
      data_akhir_2026: bt.dataAkhir2026 ?? "belum ada",
      capture_20_paparan: paparan === undefined ? "belum ada" : formatPersen(paparan),
      capture_20_acak: acak === undefined ? "belum ada" : formatPersen(acak),
      kohort_tampak_aman: kohortTeks("tampak_aman"),
      kohort_aktif: kohortTeks("aktif"),
      catatan_wajib,
    };
  }

  const k = wajibKode(kode);
  const card = await getDesaCard(k);
  if (!card) throw new HttpError(404, "desa_tidak_ada", "Desa tidak ditemukan.");

  if (halaman === "paparan") {
    const p = card.paparan;
    // Angka kalender satelit dari fungsi yang sama dengan yang dirender di layar (lib/satelitBulanan).
    const st = statistikSatelit(card.strip);
    return {
      k_ext: formatAngka(p.kExt),
      n_ext: formatAngka(p.nExt),
      // Dipakai kalimat "sejak 2012" saat tidak ada deteksi, supaya template lolos pengaman angka.
      tahun_awal: "2012",
      tahun_ekstrem: card.tahunEkstrem.map(String),
      tahun_terdeteksi: card.strip.filter((s) => s.terpapar && card.tahunEkstrem.includes(s.tahun)).map((s) => String(s.tahun)),
      jumlah_tahun_terdeteksi: st.totalTahun ? `${st.terdeteksi} dari ${st.totalTahun}` : "belum ada",
      tahun_tenang: formatAngka(p.tahunTenang),
      tingkat: LABEL_TIER[p.tier],
      porsi_gambut: formatPersen(card.desa.peatFrac),
      bulan_ravan: st.rawan.hari > 0 ? NAMA_BULAN[st.rawan.i] : "belum ada",
      musim: st.musim.length ? `${NAMA_BULAN[st.musim[0]]} sampai ${NAMA_BULAN[st.musim[st.musim.length - 1]]}` : "belum ada",
      hari_terbanyak: formatAngka(st.terpadat.detDays),
      tahun_hari_terbanyak: String(st.terpadat.tahun),
      titik_total: formatAngka(st.titikTotal),
      hari_total: formatAngka(st.hariTotal),
      tahun_titik_terbanyak: st.tahunTitikTerbanyak ? String(st.tahunTitikTerbanyak) : "belum ada",
      tampak_aman: labelTampakAman({ tampakAman: p.tampakAman, keputusan: card.gerbang }) ? "ya" : "tidak",
      kecamatan_rata_rata: formatPersen(card.kecamatan.pMean),
      catatan_wajib,
    };
  }

  const [catalog, hasil] = await Promise.all([getCatalog(), getKesiapan(k)]);

  if (halaman === "kesiapan") {
    // Tabel "Tangani ini lebih dulu" di layar memakai fungsi yang sama, jadi angkanya tidak bisa berbeda.
    const baris = barisTindakan(urutkanKesenjangan(hasil.items, catalog), catalog, await getHargaEfektif(k));
    return {
      skor: formatSkor(hasil.skor),
      status: STATUS_TEKS[hasil.status],
      rantai_terlemah: hasil.rantaiTerlemah ? namaItem(catalog, hasil.rantaiTerlemah) : "tidak ada",
      lengkap: hasil.lengkap ? "ya" : "tidak",
      tindakan: baris.map((b) => `${b.nama}: ${b.aksi}${b.biaya === null ? "" : `, ${formatRupiah(b.biaya)}`}`),
      item: hasil.items.map((it) => {
        const satuan = catalog.find((x) => x.kode === it.itemKode)?.satuan ?? "";
        const nama = namaItem(catalog, it.itemKode);
        if (it.belumDiisi) return `${nama}: belum dicatat, paket minimum ${formatAngka(it.target)} ${satuan}`;
        // Dua sisi sekaligus: angka yang berfungsi dan angka yang kurang. Label peta memakai sisi "kurang",
        // jadi fakta harus memuatnya supaya ringkasan tidak menyebut hal yang berlawanan tanpa angka pembanding.
        const ada = `${formatAngka(it.berfungsi)} dari ${formatAngka(it.target)} ${satuan} berfungsi`;
        const kurang = Math.max(it.target - it.berfungsi, 0);
        return kurang > 0 ? `${nama}: ${ada}, kurang ${formatAngka(kurang)}` : `${nama}: ${ada}, paket minimum terpenuhi`;
      }),
      catatan_wajib,
    };
  }

  // prioritas dan anggaran. Kolom catatan keputusan tidak dibaca sama sekali.
  const pr = await getPrioritas(k);
  const keputusan: KeputusanMap = Object.fromEntries(pr.keputusan.map((x) => [keyBaris(x), { keputusan: x.keputusan }]));
  const dana = ringkasAnggaran(pr, hasil, catalog, pr.paguRp, keputusan);
  const rk = ringkasKeputusan(pr.terpilih, keputusan);
  const barisTerpilih = pr.terpilih.map((b) => {
    const c = catalog.find((x) => x.kode === b.itemKode);
    const status = keputusan[keyBaris(b)]?.keputusan ?? "belum";
    return `${AKSI_TEKS[b.aksi]} ${c?.nama ?? b.itemKode} ${formatAngka(b.qty)} ${c?.satuan ?? ""}, ${formatRupiah(b.biayaRp)}, ${STATUS_KEPUTUSAN[status]}`;
  });

  if (halaman === "anggaran") {
    return {
      pagu: formatRupiah(pr.paguRp),
      skor: formatSkor(hasil.skor),
      skor_sesudah: formatSkor(pr.skorSesudah),
      skor_naik: formatSkor(Math.max(pr.skorSesudah - hasil.skor, 0)),
      disetujui_rp: formatRupiah(dana.disetujuiRp),
      disetujui_jumlah: formatAngka(dana.jumlahDisetujui),
      disetujui_persen: pr.paguRp > 0 ? formatPersen(dana.disetujuiRp / pr.paguRp) : "0%",
      sisa_anggaran: formatRupiah(dana.sisaRp),
      kurang_rp: formatRupiah(dana.kekurangan),
      kebutuhan_rp: formatRupiah(dana.kebutuhan),
      cukup: dana.cukup ? "ya" : "tidak",
      pagu_berlebih: dana.berlebih ? "ya" : "tidak",
      cakupan: dana.cakupan.map((c) => `${c.nama}: ${formatAngka(c.persenSebelum)}% menjadi ${formatAngka(c.persenSesudah)}%`),
      jumlah_terpilih: formatAngka(pr.terpilih.length),
      terpilih: barisTerpilih,
      catatan_wajib,
    };
  }

  return {
    pagu: formatRupiah(pr.paguRp),
    total_terpilih: formatRupiah(pr.terpakaiRp),
    skor: formatSkor(hasil.skor),
    skor_sesudah: formatSkor(pr.skorSesudah),
    skor_disetujui: formatSkor(dana.skorDisetujui),
    sisa_anggaran: formatRupiah(dana.sisaRp),
    keputusan: `${rk.setuju} disetujui, ${rk.tunda} ditunda, ${rk.tolak} ditolak, ${rk.belum} belum diputuskan`,
    jumlah_terpilih: formatAngka(pr.terpilih.length),
    terpilih: barisTerpilih,
    jumlah_tidak_terpilih: formatAngka(pr.tidakTerdanai.length),
    catatan_wajib,
  };
}

export function validasiRingkasan(keluaran: unknown, fakta: Fakta): { ok: boolean; pelanggaran: string[] } {
  const o = keluaran as { judul?: unknown; butir?: unknown } | null;
  if (!o || typeof o !== "object" || typeof o.judul !== "string" || !Array.isArray(o.butir) || o.butir.some((b) => typeof b !== "string")) {
    return { ok: false, pelanggaran: ["bentuk"] };
  }
  const butir = o.butir as string[];
  const p: string[] = [];
  if (butir.length !== 3) p.push("jumlah_butir");
  if (!o.judul.trim() || o.judul.length > MAKS_JUDUL) p.push("panjang_judul");
  if (butir.some((b) => !b.trim() || b.length > MAKS_BUTIR)) p.push("panjang_butir");
  const semua = [o.judul, ...butir].join("\n");
  if (/[*#`]|\{\{/.test(semua)) p.push("format");
  const boleh = new Set(JSON.stringify(Object.values(fakta)).match(ANGKA) ?? []);
  for (const a of new Set(semua.match(ANGKA) ?? [])) if (!boleh.has(a)) p.push(`angka:${a}`);
  const kecil = semua.toLowerCase();
  for (const k of KATA_TERLARANG) if (kecil.includes(k)) p.push(`kata:${k}`);
  return { ok: p.length === 0, pelanggaran: p };
}

/** "a, b, dan c". */
function daftar(x: string[]): string {
  if (x.length <= 2) return x.join(" dan ");
  return `${x.slice(0, -1).join(", ")}, dan ${x[x.length - 1]}`;
}

/** Angka berformat Indonesia kembali ke number: "1.234" -> 1234. */
const keAngka = (s: string) => Number(s.replace(/\./g, "").replace(",", ".")) || 0;

/** Template cadangan. Setiap keluarannya harus lolos `validasiRingkasan` terhadap faktanya sendiri (dijaga tes). */
export function templateRingkasan(halaman: HalamanRingkasan, f: Fakta): { judul: string; butir: string[] } {
  const catatan = teks(f, "catatan_wajib", CATATAN_WAJIB[halaman]);
  switch (halaman) {
    case "paparan": {
      const judul = headlinePaparan({
        kExt: keAngka(teks(f, "k_ext", "0")),
        nExt: keAngka(teks(f, "n_ext", "0")),
        tahunTenang: keAngka(teks(f, "tahun_tenang", "0")),
      });
      const terdeteksi = larik(f, "tahun_terdeteksi");
      const satu = terdeteksi.length
        ? `Tahun kering ekstrem yang terdeteksi satelit: ${daftar(terdeteksi)}.`
        : "Tidak ada tahun kering ekstrem yang terdeteksi satelit.";
      const gambut = teks(f, "porsi_gambut");
      const rata = teks(f, "kecamatan_rata_rata");
      const musim = teks(f, "musim", "belum ada");
      const dua =
        `${teks(f, "tingkat", "Tingkat paparan belum ada")}${gambut ? `, porsi gambut ${gambut}` : ""}.` +
        (rata ? ` Rata-rata kecamatan: ${rata} desa terdeteksi satelit pada tahun kering ekstrem.` : "") +
        (musim === "belum ada" ? "" : ` Titik api paling sering muncul ${musim}.`);
      return { judul, butir: [satu, dua, catatan] };
    }
    case "kesiapan": {
      const rantai = teks(f, "rantai_terlemah", "tidak ada");
      const tindakan = larik(f, "tindakan")[0];
      const satu =
        (rantai === "tidak ada" ? "Tidak ada mata rantai yang kurang." : `Mata rantai terlemah: ${rantai}.`) +
        (tindakan ? ` Langkah pertama: ${tindakan}.` : "");
      const gabung = `${larik(f, "item").join("; ")}.`;
      const dua =
        teks(f, "lengkap") === "tidak"
          ? "Sebagian alat belum dicatat; item yang belum dicatat dihitung nol."
          : gabung.length <= MAKS_BUTIR
            ? gabung
            : "Semua alat sudah dicatat.";
      return { judul: `Skor kesiapan ${teks(f, "skor")} (${teks(f, "status")}).`, butir: [satu, dua, catatan] };
    }
    case "prioritas": {
      const terpilih = larik(f, "terpilih");
      const jumlah = teks(f, "jumlah_terpilih", "0");
      let satu = terpilih.length
        ? `Terpilih ${jumlah} baris belanja; yang pertama: ${terpilih[0]}.`
        : "Belum ada belanja yang terpilih dalam pagu ini.";
      if (satu.length > MAKS_BUTIR) satu = `Terpilih ${jumlah} baris belanja.`;
      const dua = `${teks(f, "jumlah_tidak_terpilih", "0")} baris lain belum terdanai dalam pagu ini.`;
      return {
        judul: `Belanja terpilih ${teks(f, "total_terpilih")} dari pagu ${teks(f, "pagu")} menaikkan skor dari ${teks(f, "skor")} menjadi ${teks(f, "skor_sesudah")}.`,
        butir: [satu, dua, catatan],
      };
    }
    case "anggaran": {
      const berlebih = teks(f, "pagu_berlebih") === "ya";
      const judul = berlebih
        ? `Anggaran ${teks(f, "pagu")} jauh di atas kebutuhan ${teks(f, "kebutuhan_rp")}.`
        : `Belanja ${teks(f, "disetujui_rp")} dari anggaran ${teks(f, "pagu")} menaikkan skor dari ${teks(f, "skor")} menjadi ${teks(f, "skor_sesudah")}.`;
      const satu = `${teks(f, "disetujui_jumlah", "0")} belanja disetujui (${teks(f, "disetujui_rp")}); sisa anggaran ${teks(f, "sisa_anggaran")}.`;
      const cak = larik(f, "cakupan")[0];
      const dua = berlebih
        ? `Sisa ${teks(f, "sisa_anggaran")} tidak terpakai untuk alat pemadam; periksa lagi angkanya.`
        : (cak ? `Cakupan ${cak}. ` : "") +
          (teks(f, "cukup") === "ya"
            ? "Anggaran sudah cukup untuk semua alat yang harganya diketahui."
            : `Uang yang masih kurang ${teks(f, "kurang_rp")}.`);
      return { judul, butir: [satu, dua, catatan] };
    }
    case "timemachine": {
      const kes = teks(f, "kesimpulan_2026", "Hasil uji belum tersedia.");
      // Kalimat pertama kesimpulan menjadi judul; sisanya (bila ada) menjadi butir pertama.
      const titik = kes.indexOf(". ");
      const judul = titik > 0 ? kes.slice(0, titik + 1) : kes;
      const sisa = titik > 0 ? kes.slice(titik + 2) : "";
      const pap = teks(f, "capture_20_paparan", "belum ada");
      const satu =
        sisa ||
        (pap === "belum ada"
          ? `Angka uji ${teks(f, "tahun_uji")} belum tersedia.`
          : `Pada uji ${teks(f, "tahun_uji")}, peringkat riwayat menangkap ${pap} dan urutan acak ${teks(f, "capture_20_acak", "belum ada")}.`);
      const kohort = teks(f, "kohort_tampak_aman", "belum ada");
      const dua =
        `Keputusan gerbang data: ${teks(f, "keputusan_gerbang")}. Data ${teks(f, "tahun_uji")} sampai: ${teks(f, "data_akhir_2026", "belum ada")}.` +
        (kohort === "belum ada" ? "" : ` Desa yang tampak aman sebelumnya, terdeteksi pada ${teks(f, "tahun_uji")}: ${kohort}.`);
      return { judul, butir: [satu, dua, catatan] };
    }
  }
}

const ATURAN =
  "Kamu menulis ringkasan satu halaman aplikasi kesiapan karhutla desa untuk perangkat desa. " +
  "Pakai hanya angka yang ada di FAKTA dan salin persis seperti tertulis. Jangan menghitung, membulatkan, atau menambah angka, tahun, nama, maupun sebab. " +
  'Untuk alat, pisahkan angka yang berfungsi dan angka yang kurang. Bila FAKTA menulis "kurang N", sebut kekurangan itu sebagai "kurang N", jangan menukarnya dengan angka yang berfungsi. ' +
  'Sebut desa sebagai "desa ini". Tulis "deteksi satelit", bukan "kebakaran". Jangan menyatakan desa aman. Jangan menyebut siapa yang membakar atau dari mana api berasal. ' +
  "Bahasa Indonesia baku yang sederhana, tanpa markdown. " +
  "judul: satu hal terpenting, paling banyak 20 kata. butir: tepat tiga kalimat pendek; kalimat ketiga adalah langkah pertama yang bisa dilakukan, dan sebut biayanya bila FAKTA memuat biaya tindakan. " +
  "Bila FAKTA memuat bulan rawan atau musim, sebut bulan awalnya sebagai waktu bersiap. " +
  'Bila FAKTA memuat "pagu_berlebih" bernilai "ya", ingatkan memeriksa angka anggaran karena sisanya jauh melebihi kebutuhan alat. ' +
  "Isi catatan_wajib harus tetap benar dalam tulisanmu.";

// Cache di memori proses, hilang saat cold start serverless. Batas biaya dijaga rate_limit di DB (route).
// Hanya keluaran AI yang lolos yang disimpan; pelanggaran dan template tidak.
const cache = new Map<string, Ringkasan>();

/** Untuk tes. */
export function kosongkanCacheRingkasan(): void {
  cache.clear();
}

export async function getRingkasan(halaman: HalamanRingkasan, kode?: string): Promise<Ringkasan> {
  const fakta = await faktaRingkasan(halaman, kode);
  // Muncul di terminal `make dev`. Isinya persis yang dikirim ke model; tanpa nama wilayah.
  if (process.env.NODE_ENV !== "production") console.log("[ringkasan]", halaman, JSON.stringify(fakta));
  const kunci = `${halaman}:${JSON.stringify(fakta)}`;
  const ada = cache.get(kunci);
  if (ada) return ada;
  const mentah = await tulisJson(`${ATURAN} Halaman: ${halaman}.`, `FAKTA\n${JSON.stringify(fakta)}`, SKEMA);
  if (mentah) {
    try {
      const j = JSON.parse(mentah) as { judul: string; butir: string[] };
      const v = validasiRingkasan(j, fakta);
      if (v.ok) {
        const hasil: Ringkasan = { judul: j.judul.trim(), butir: j.butir.map((b) => b.trim()), sumber: "ai", model: modelPenulis() };
        cache.set(kunci, hasil);
        return hasil;
      }
      console.warn("[ringkasan] ditolak:", halaman, v.pelanggaran.join(","));
    } catch {
      console.warn("[ringkasan] bukan JSON:", halaman);
    }
  }
  return { ...templateRingkasan(halaman, fakta), sumber: "template", model: null };
}
