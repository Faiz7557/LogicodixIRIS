import { kelasKartu } from "@/components/paparan/dasbor/dasar";

/**
 * Penjelasan paling atas Time Machine: tiga langkah dengan analogi ujian, tanpa istilah teknis.
 * Tahun mengikuti tahun uji yang dipilih, jadi kalimatnya selalu cocok dengan hasil di bawahnya.
 */
export function CaraKerja({ tahunUji }: { tahunUji: number }) {
  const beku = tahunUji - 1;
  const langkah = [
    {
      judul: "Bekukan waktu",
      isi: `Kami berpura-pura hari ini 31 Desember ${beku}. Hanya data sebelum tanggal itu yang boleh dipakai. Kejadian ${tahunUji} belum dilihat sama sekali.`,
      ikon: "M12 2v20M4.9 6l14.2 12M19.1 6 4.9 18",
    },
    {
      judul: "Tebak desa mana yang kena api",
      isi: "Dari data itu, desa diurutkan dari yang paling mungkin terbakar. Daftar ini dikunci, tidak boleh diubah lagi.",
      ikon: "M4 6h16M4 12h12M4 18h8",
    },
    {
      judul: `Cocokkan dengan kenyataan ${tahunUji}`,
      isi: `Baru sesudah itu kami buka deteksi satelit ${tahunUji}. Kalau desa di urutan atas benar-benar terdeteksi api, berarti tebakan kami jitu.`,
      ikon: "M5 12l5 5 9-10",
    },
  ];

  return (
    <section aria-labelledby="cara-kerja" className={`${kelasKartu} masuk`} style={{ animationDelay: "20ms" }}>
      <h2 id="cara-kerja" className="font-semibold">
        Cara kerjanya, seperti ujian
      </h2>
      <p className="mt-0.5 max-w-[62ch] text-sm text-muted">
        Jawaban ditulis dulu, kunci jawaban dibuka belakangan. Dengan begitu tebakan tidak bisa &ldquo;menyontek&rdquo; hasil yang belum terjadi.
      </p>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {langkah.map((l, i) => (
          <li key={l.judul} className="rounded-xl border border-line bg-surface-2/60 p-4">
            <div className="flex items-center gap-2.5">
              <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{i + 1}</span>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-ember">
                <path d={l.ikon} />
              </svg>
            </div>
            <h3 className="mt-2.5 font-semibold">{l.judul}</h3>
            <p className="mt-1 text-sm text-muted">{l.isi}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
