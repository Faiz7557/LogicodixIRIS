import Link from "next/link";
import { KartuMiring } from "./gerak/KartuMiring";
import { KetikSendiri } from "./gerak/KetikSendiri";
import { SkorContoh } from "./gerak/SkorContoh";

/*
 * Kartu bento "alasan" (mengikuti referensi): satu kartu pencarian, satu kartu ikon, satu kartu lebar.
 * Kartu miring mengikuti kursor; kolom cari mengetik contoh nama desa; skor contoh berhitung naik.
 * Angka pada kartu lebar adalah contoh dari data uji, diberi label.
 */
const CONTOH_CARI = ["Kalibandung", "Kubu Raya", "Pulang Pisau"];

export function Sorotan() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <KartuMiring tunda={0}>
        <p aria-hidden="true" className="mb-4 flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-3 text-sm text-muted">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <KetikSendiri awalan="Cari: " daftar={CONTOH_CARI} />
        </p>
        <h3 className="font-bold">Paparan per desa</h3>
        <p className="mt-1 text-sm text-muted">Riwayat deteksi satelit 2012–2026, dengan kalimat yang jujur: desa tanpa deteksi bukan berarti aman.</p>
      </KartuMiring>

      <KartuMiring tunda={120}>
        <span aria-hidden="true" className="relative mb-4 flex size-11 items-center justify-center rounded-xl bg-ink text-white">
          <span className="absolute inset-0 animate-ping rounded-xl bg-ink/30 [animation-duration:2.4s]" />
          <svg className="relative" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l8 3v6c0 4.5-3.2 7.6-8 9-4.8-1.4-8-4.5-8-9V6z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </span>
        <h3 className="font-bold">Hasil apa adanya</h3>
        <p className="mt-1 text-sm text-muted">
          Time Machine membandingkan peringkat dengan deteksi nyata, termasuk saat peringkat kami kalah dari pembanding.
        </p>
      </KartuMiring>

      <div className="md:col-span-2">
        <KartuMiring tunda={240}>
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-bold">Prioritas di bawah pagu</h3>
              <p className="mt-1 text-sm text-muted">
                Isi pagu, lihat urutan belanja beserta alasan tiap baris. Skor kesiapan sebelum dan sesudah belanja tampil berdampingan.
              </p>
              <Link href="/data" className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-water underline underline-offset-2">
                Lihat sumber, harga, dan asumsi
              </Link>
            </div>
            <SkorContoh />
          </div>
        </KartuMiring>
      </div>
    </div>
  );
}

