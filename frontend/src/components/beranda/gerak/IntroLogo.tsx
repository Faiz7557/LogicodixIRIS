"use client";

import { useEffect, useState } from "react";

/*
 * Intro pembuka beranda, tampil setiap kali beranda dibuka (termasuk saat kembali dari halaman lain).
 * Urutan (CSS murni, lihat `.intro` di globals.css): tetes air jatuh, memercik menjadi ubin logo
 * dengan riak air, nama "SiapKemarau" terbuka di sampingnya, lalu layar terangkat seperti tirai.
 * Dirender di server supaya menutup layar sejak cat pertama; dilepas dari DOM setelah tirai selesai.
 * Klik atau tombol apa pun mempercepat keluar. Tanpa JS tetap selesai sendiri; gerak dikurangi: tidak tampil.
 */
const NAMA = "SiapKemarau";

export function IntroLogo() {
  const [tampil, setTampil] = useState(true);
  const [cepat, setCepat] = useState(false);

  useEffect(() => {
    if (!tampil) return;
    const lewati = () => setCepat(true);
    window.addEventListener("keydown", lewati, { once: true });
    window.addEventListener("wheel", lewati, { once: true, passive: true });
    window.addEventListener("touchmove", lewati, { once: true, passive: true });
    return () => {
      window.removeEventListener("keydown", lewati);
      window.removeEventListener("wheel", lewati);
      window.removeEventListener("touchmove", lewati);
    };
  }, [tampil]);

  if (!tampil) return null;

  return (
    <div
      aria-hidden="true"
      className={`intro ${cepat ? "intro-cepat" : ""}`}
      onClick={() => setCepat(true)}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "intro-keluar") setTampil(false);
      }}
    >
      <div className="intro-isi">
        <div className="intro-logo">
          <span className="intro-ubin">
            <span className="intro-riak" />
            <span className="intro-riak" />
            <span className="intro-riak" />
          </span>
          <svg className="intro-tetes" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.5c3.2 4 6 7.1 6 10.7a6 6 0 0 1-12 0C6 9.6 8.8 6.5 12 2.5z" />
          </svg>
        </div>
        <span className="intro-kata">
          <span className="intro-kata-dalam">
            {NAMA.split("").map((h, i) => (
              <span key={i} style={{ ["--i" as string]: i }}>
                {h}
              </span>
            ))}
          </span>
        </span>
      </div>
      <p className="intro-sub">Kesiapan desa sebelum musim kering</p>
    </div>
  );
}
