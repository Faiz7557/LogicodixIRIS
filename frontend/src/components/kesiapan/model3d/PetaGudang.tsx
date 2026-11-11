"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls } from "three/addons/controls/MapControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GambarItem } from "@/components/kesiapan/GambarItem";
import { formatAngka } from "@/lib/format";
import { buangBahan } from "./bangunPompaJinjing";
import { SKALA_PANAS, bangunGudang } from "./bangunGudang";

export interface BarangPeta {
  kode: string;
  nama: string;
  satuan: string;
  target: number;
  berfungsi: number;
  rusak: number;
  belumDiisi: boolean;
}

type AksiKamera = { zoom: (faktor: number) => void; putar: (sudut: number) => void; ulang: () => void };

const TARGET_AWAL = new THREE.Vector3(4, 0, -1);
const ARAH_AWAL = new THREE.Vector3(0.55, 1.05, 1).normalize();
const RADIUS_PETA = 10.5;

function teksKurang(b: BarangPeta): { angka: string; sisa: string } {
  if (b.belumDiisi) return { angka: "", sisa: "belum dicatat" };
  const kurang = Math.max(b.target - b.berfungsi, 0);
  if (kurang === 0) return { angka: "", sisa: `lengkap, ${formatAngka(b.target)} ${b.satuan}` };
  return { angka: formatAngka(kurang), sisa: `dari ${formatAngka(b.target)} ${b.satuan} kurang` };
}

/**
 * Peta 3D gudang alat (pola peta kilang Sparekit). Seret untuk menggeser, gulir untuk memperbesar, seret klik kanan untuk memutar.
 * Label tiap barang adalah tautan ke halaman rinciannya; barang di peta juga bisa diklik.
 * Render berhenti saat peta tidak terlihat. Gerak animasi kamera mati bila pengguna memilih gerak dikurangi.
 */
export default function PetaGudang({ kode, barang }: { kode: string; barang: BarangPeta[] }) {
  const router = useRouter();
  const wadah = useRef<HTMLDivElement>(null);
  const labelRef = useRef(new Map<string, HTMLAnchorElement>());
  const tipRef = useRef<HTMLDivElement>(null);
  const aksi = useRef<AksiKamera>({ zoom: () => {}, putar: () => {}, ulang: () => {} });
  const [galat, setGalat] = useState(false);
  const kunciData = JSON.stringify(barang);

  useEffect(() => {
    const el = wadah.current;
    if (!el) return;
    const data: BarangPeta[] = JSON.parse(kunciData);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL hanya bisa diuji di peramban
      setGalat(true);
      return;
    }
    const geraKurang = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xdde7c6);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    el.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const ruang = new RoomEnvironment();
    scene.environment = pmrem.fromScene(ruang, 0.04).texture;
    scene.environmentIntensity = 0.3;
    ruang.dispose();
    pmrem.dispose();

    const matahari = new THREE.DirectionalLight(0xfff6e8, 2.4);
    matahari.position.set(-14, 26, 12);
    matahari.castShadow = true;
    matahari.shadow.mapSize.set(2048, 2048);
    Object.assign(matahari.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, far: 80 });
    matahari.shadow.normalBias = 0.03;
    scene.add(matahari, new THREE.HemisphereLight(0xffffff, 0xb9c7a0, 0.6));

    const peta = bangunGudang(data.map((b) => ({ kode: b.kode, target: b.target, berfungsi: b.berfungsi, rusak: b.rusak })));
    scene.add(peta.akar);

    const kamera = new THREE.PerspectiveCamera(28, 1, 0.5, 200);
    const kontrol = new MapControls(kamera, renderer.domElement);
    kontrol.enableDamping = true;
    kontrol.minDistance = 12;
    kontrol.maxDistance = 75;
    kontrol.minPolarAngle = 0.35;
    kontrol.maxPolarAngle = 1.2;
    kontrol.zoomToCursor = true;

    const jarakPas = () => {
      const v = THREE.MathUtils.degToRad(kamera.fov);
      const h = 2 * Math.atan(Math.tan(v / 2) * kamera.aspect);
      // Peta tegak (HP): radius lebih lebar supaya gudang dan halaman sumur tetap masuk.
      return (RADIUS_PETA * (kamera.aspect < 1 ? 1.5 : 1)) / Math.sin(Math.min(v, h) / 2);
    };
    const posisiAwal = () => TARGET_AWAL.clone().addScaledVector(ARAH_AWAL, jarakPas());
    kamera.position.copy(posisiAwal());
    kontrol.target.copy(TARGET_AWAL);

    // Animasi kamera untuk tombol: geser posisi dan target bersamaan.
    let anim: { dariP: THREE.Vector3; dariT: THREE.Vector3; keP: THREE.Vector3; keT: THREE.Vector3; t: number } | null = null;
    const ke = (keP: THREE.Vector3, keT: THREE.Vector3) => {
      if (geraKurang) {
        kamera.position.copy(keP);
        kontrol.target.copy(keT);
        kontrol.update();
        return;
      }
      anim = { dariP: kamera.position.clone(), dariT: kontrol.target.clone(), keP, keT, t: 0 };
    };
    aksi.current = {
      zoom: (f) => {
        const off = kamera.position.clone().sub(kontrol.target);
        const jarak = THREE.MathUtils.clamp(off.length() * f, kontrol.minDistance, kontrol.maxDistance);
        ke(kontrol.target.clone().add(off.setLength(jarak)), kontrol.target.clone());
      },
      putar: (a) => {
        const off = kamera.position.clone().sub(kontrol.target).applyAxisAngle(new THREE.Vector3(0, 1, 0), a);
        ke(kontrol.target.clone().add(off), kontrol.target.clone());
      },
      ulang: () => ke(posisiAwal(), TARGET_AWAL.clone()),
    };

    let disentuh = false;
    kontrol.addEventListener("start", () => {
      disentuh = true;
      anim = null;
    });

    const ukur = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      kamera.aspect = w / h;
      kamera.updateProjectionMatrix();
      if (!disentuh) {
        kamera.position.copy(posisiAwal());
        kontrol.target.copy(TARGET_AWAL);
      }
    };
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    ukur();

    // Arahkan kursor ke barang: kursor tangan dan keterangan kecil; klik (bukan seret) membuka rinciannya.
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const sasaran = peta.zona.map((z) => z.sasaran);
    const kena = (e: PointerEvent): string | null => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, kamera);
      return (ray.intersectObjects(sasaran, false)[0]?.object.userData.kode as string | undefined) ?? null;
    };
    let ditekan: { x: number; y: number } | null = null;
    let sorot: string | null = null;
    const setSorot = (k: string | null, e?: PointerEvent) => {
      if (k !== sorot) {
        if (sorot) labelRef.current.get(sorot)?.removeAttribute("data-sorot");
        if (k) labelRef.current.get(k)?.setAttribute("data-sorot", "");
        sorot = k;
      }
      renderer.domElement.style.cursor = k ? "pointer" : "";
      const tip = tipRef.current;
      if (!tip) return;
      if (!k || !e) {
        tip.hidden = true;
        return;
      }
      const b = data.find((x) => x.kode === k);
      if (!b) return;
      const t = teksKurang(b);
      tip.firstElementChild!.textContent = b.nama;
      tip.lastElementChild!.textContent = `${t.angka ? `${t.angka} ` : ""}${t.sisa} · klik untuk membuka`;
      const r = el.getBoundingClientRect();
      tip.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
      tip.hidden = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.buttons) return setSorot(null);
      setSorot(kena(e), e);
    };
    const onDown = (e: PointerEvent) => (ditekan = { x: e.clientX, y: e.clientY });
    const onUp = (e: PointerEvent) => {
      if (!ditekan || e.button !== 0) return;
      const geser = Math.hypot(e.clientX - ditekan.x, e.clientY - ditekan.y);
      ditekan = null;
      if (geser > 6) return;
      const k = kena(e);
      if (k) router.push(`/desa/${kode}/kesiapan/${k}`);
    };
    const onLeave = () => setSorot(null);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const timer = new THREE.Timer();
    timer.connect(document);
    let terlihat = true;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);
    const v = new THREE.Vector3();

    renderer.setAnimationLoop(() => {
      timer.update();
      if (!terlihat) return;
      const dt = Math.min(timer.getDelta(), 0.1);
      if (anim) {
        anim.t = Math.min(anim.t + dt / 0.45, 1);
        const s = anim.t * anim.t * (3 - 2 * anim.t);
        kamera.position.lerpVectors(anim.dariP, anim.keP, s);
        kontrol.target.lerpVectors(anim.dariT, anim.keT, s);
        if (anim.t === 1) anim = null;
      }
      // Jaga peta tetap di layar: titik tengah geser dibatasi.
      kontrol.target.x = THREE.MathUtils.clamp(kontrol.target.x, -14, 20);
      kontrol.target.z = THREE.MathUtils.clamp(kontrol.target.z, -12, 12);
      kontrol.target.y = 0;
      kontrol.update(dt);
      renderer.render(scene, kamera);

      // Label HTML mengikuti titik jangkar tiap zona.
      const w = el.clientWidth;
      const h = el.clientHeight;
      for (const z of peta.zona) {
        const lab = labelRef.current.get(z.kode);
        if (!lab) continue;
        v.copy(z.jangkar).project(kamera);
        const tampak = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15;
        lab.style.visibility = tampak ? "visible" : "hidden";
        // Jaga label di dalam peta dan tidak menutupi kolom tombol di kanan (lebar 44 px + jarak).
        const lw = lab.offsetWidth;
        const x = THREE.MathUtils.clamp(((v.x + 1) / 2) * w, lw / 2 + 8, Math.max(lw / 2 + 8, w - lw / 2 - 64));
        lab.style.transform = `translate(${x}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -100%)`;
      }
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      kontrol.dispose();
      timer.dispose();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      peta.buang();
      buangBahan();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [kode, kunciData, router]);

  function jalankan(id: (typeof TOMBOL)[number]["id"]) {
    const a = aksi.current;
    if (id === "masuk") a.zoom(0.7);
    else if (id === "keluar") a.zoom(1.4);
    else if (id === "kiri") a.putar(-Math.PI / 4);
    else if (id === "kanan") a.putar(Math.PI / 4);
    else a.ulang();
  }

  if (galat) {
    return <div className="flex h-[420px] items-center justify-center p-6 text-center text-sm text-muted">Peramban ini tidak mendukung tampilan 3D (WebGL).</div>;
  }

  const ringkas = barang.map((b) => {
    const t = teksKurang(b);
    return `${b.nama} ${t.angka} ${t.sisa}`.replace(/\s+/g, " ");
  });

  return (
    <div
      ref={wadah}
      role="group"
      aria-label={`Peta gudang alat. ${ringkas.join(". ")}.`}
      className="@container relative h-[440px] overflow-hidden rounded-panel border border-line select-none md:h-[540px]"
    >
      {/* Legenda */}
      <div className="pointer-events-none absolute left-3 top-3 w-[min(250px,calc(100%-4.5rem))] rounded-2xl bg-surface/95 p-3 shadow-card md:left-4 md:top-4 md:p-4">
        <p className="text-sm font-semibold leading-snug">Alat kurang untuk kemarau</p>
        <span aria-hidden="true" className="mt-2 block h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${SKALA_PANAS.join(", ")})` }} />
        <span className="mt-1 flex justify-between text-xs text-muted">
          <span>Sedikit</span>
          <span>Banyak</span>
        </span>
        <ul className="mt-2 hidden gap-3 border-t border-line pt-2 text-xs text-muted sm:flex">
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-sm bg-[#c8281f]" /> Ada
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-sm bg-[#9a9da2]" /> Rusak
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-sm border border-dashed border-[#5f6670] bg-white/60" /> Kurang
          </li>
        </ul>
      </div>

      {/* Label barang: tautan sungguhan, bisa dijangkau keyboard. */}
      {barang.map((b) => {
        const t = teksKurang(b);
        return (
          <Link
            key={b.kode}
            href={`/desa/${kode}/kesiapan/${b.kode}`}
            ref={(n) => {
              if (n) labelRef.current.set(b.kode, n);
              else labelRef.current.delete(b.kode);
            }}
            style={{ visibility: "hidden" }}
            className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-surface py-1 pl-1 pr-3 text-sm shadow-card transition-[box-shadow,background-color] hover:bg-paper focus-visible:outline-2 focus-visible:outline-water data-[sorot]:bg-paper data-[sorot]:shadow-md @[44rem]:gap-2.5 @[44rem]:py-1.5 @[44rem]:pl-1.5 @[44rem]:pr-4 @[44rem]:text-base"
          >
            <GambarItem kode={b.kode} className="size-7 rounded-full @[44rem]:size-8" />
            <span className="font-semibold">{b.nama}</span>
            {t.angka ? <span className="tabular font-bold">{t.angka}</span> : null}
            <span className="hidden text-muted @[44rem]:inline">{t.sisa}</span>
          </Link>
        );
      })}

      <div ref={tipRef} hidden className="pointer-events-none absolute left-0 top-0 z-10 rounded-xl bg-ink px-3 py-2 text-sm text-white shadow-lg">
        <p className="font-semibold" />
        <p className="text-white/85" />
      </div>

      {/* Kontrol kamera */}
      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-2xl bg-surface shadow-card md:right-4 md:top-4">
        {TOMBOL.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => jalankan(t.id)}
            aria-label={t.label}
            title={t.label}
            className="flex size-11 items-center justify-center border-b border-line text-ink last:border-b-0 hover:bg-paper"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {t.ikon}
            </svg>
          </button>
        ))}
      </div>

      <p className="pointer-events-none absolute inset-x-3 bottom-3 w-fit max-w-[calc(100%-1.5rem)] rounded-2xl bg-surface/95 px-3 py-2 text-xs text-muted shadow-card @[52rem]:inset-x-4 @[52rem]:bottom-4 @[52rem]:rounded-full @[52rem]:px-4 @[52rem]:text-sm">
        <span className="hidden @[52rem]:inline">
          Seret untuk menggeser · Gulir untuk memperbesar · Seret klik kanan untuk memutar · Klik barang untuk membukanya · Gambarnya sketsa, angkanya nyata
        </span>
        <span className="@[52rem]:hidden">Seret untuk menggeser · Ketuk label untuk membuka</span>
      </p>
    </div>
  );
}

const TOMBOL = [
  { id: "masuk", label: "Perbesar", ikon: <path d="M12 5v14M5 12h14" /> },
  { id: "keluar", label: "Perkecil", ikon: <path d="M5 12h14" /> },
  { id: "kiri", label: "Putar ke kiri", ikon: <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /> },
  { id: "kanan", label: "Putar ke kanan", ikon: <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" /> },
  {
    id: "awal",
    label: "Kembali ke sudut awal",
    ikon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5z" />
      </>
    ),
  },
] as const;
