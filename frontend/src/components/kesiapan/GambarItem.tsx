/*
 * Gambar sederhana tiap item paket minimum, SVG sebaris (tanpa berkas gambar atau pustaka ikon).
 * Dekoratif: nama item selalu tertulis di sebelahnya, jadi gambar disembunyikan dari pembaca layar.
 * Warna dari token: garis tinta, air --water, aksen --ember.
 */
const garis = { fill: "none", stroke: "var(--ink)", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function SelangKeluar() {
  return (
    <>
      {/* penyangga gulungan */}
      <path d="M16 46l-6 12M36 46l6 12M6 58h40" {...garis} />
      {/* gulungan selang: lilitan tebal berwarna */}
      <circle cx="26" cy="32" r="17" {...garis} fill="var(--surface)" />
      <circle cx="26" cy="32" r="14" fill="none" stroke="var(--ember)" strokeWidth={4} />
      <circle cx="26" cy="32" r="9" fill="none" stroke="var(--ember)" strokeWidth={4} />
      <circle cx="26" cy="32" r="4" {...garis} fill="var(--paper)" />
      {/* ujung selang dan nosel */}
      <path d="M43 32c4 0 6-3 8-7" stroke="var(--ember)" strokeWidth={4} strokeLinecap="round" fill="none" />
      <path d="M49 25l6-6 4 4-6 6z" {...garis} fill="var(--ink)" />
      {/* semburan air */}
      <path d="M59 15l2-2M61 20l3-1M56 12l1-3" stroke="var(--water)" strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

function SumurBor() {
  return (
    <>
      {/* lapisan tanah */}
      <path d="M4 30h56" {...garis} />
      <path d="M4 30h56v28H4z" fill="var(--paper)" stroke="none" />
      <path d="M8 40h10M40 44h12M12 52h8M44 54h10" stroke="var(--line)" strokeWidth={2} strokeLinecap="round" />
      {/* pipa ke bawah dan air tanah */}
      <path d="M28 18v36h8V18" {...garis} fill="var(--surface)" />
      <path d="M22 56h20" stroke="var(--water)" strokeWidth={3} strokeLinecap="round" />
      {/* kepala sumur dan tuas */}
      <rect x="24" y="12" width="16" height="7" rx="2" {...garis} fill="var(--ember)" />
      <path d="M40 15l10-6M36 12V7h-8" {...garis} />
      {/* tetes air */}
      <path d="M50 22c2 3 3 4.500 3 6a3 3 0 0 1-6 0c0-1.500 1-3 3-6z" fill="var(--water)" stroke="none" />
    </>
  );
}

function PompaJinjing() {
  return (
    <>
      {/* rangka pegangan */}
      <path d="M10 22V14h44v8M10 50v6M54 50v6" {...garis} />
      {/* badan mesin */}
      <rect x="8" y="22" width="48" height="28" rx="5" {...garis} fill="var(--paper)" />
      <rect x="14" y="28" width="18" height="16" rx="3" {...garis} fill="var(--ember)" />
      <path d="M17 33h12M17 38h12" stroke="var(--surface)" strokeWidth={2} strokeLinecap="round" />
      {/* rumah pompa dan lubang keluar */}
      <circle cx="44" cy="36" r="7" {...garis} fill="var(--surface)" />
      <circle cx="44" cy="36" r="2" fill="var(--ink)" stroke="none" />
      <path d="M51 36h7" {...garis} />
      <path d="M60 32c1.500 2 1.500 6 0 8" stroke="var(--water)" strokeWidth={2} strokeLinecap="round" fill="none" />
    </>
  );
}

function DanaOperasi() {
  return (
    <>
      {/* dompet */}
      <path d="M8 22h40a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z" {...garis} fill="var(--paper)" />
      <path d="M8 22l30-10 4 10" {...garis} />
      <rect x="40" y="33" width="16" height="10" rx="3" {...garis} fill="var(--surface)" />
      <circle cx="46" cy="38" r="1.800" fill="var(--ink)" stroke="none" />
      {/* tumpukan koin */}
      <ellipse cx="22" cy="46" rx="8" ry="3" {...garis} fill="var(--ember)" />
      <path d="M14 46v-5M30 46v-5" {...garis} />
      <ellipse cx="22" cy="41" rx="8" ry="3" {...garis} fill="var(--ember)" />
      <path d="M14 41v-5M30 41v-5" {...garis} />
      <ellipse cx="22" cy="36" rx="8" ry="3" {...garis} fill="var(--ember)" />
    </>
  );
}

const GAMBAR: Record<string, () => React.ReactNode> = {
  selang_keluar: SelangKeluar,
  sumur_bor: SumurBor,
  pompa_jinjing: PompaJinjing,
  dana_operasi: DanaOperasi,
};

/** Kotak gambar item. Item tanpa gambar (kode di luar empat item inti) tidak menampilkan apa-apa. */
export function GambarItem({ kode, className = "" }: { kode: string; className?: string }) {
  const Gambar = GAMBAR[kode];
  if (!Gambar) return null;
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-xl bg-[#f4ebdd] ${className}`}>
      <svg viewBox="0 0 64 64" className="h-[78%] w-[78%]">
        <Gambar />
      </svg>
    </span>
  );
}
