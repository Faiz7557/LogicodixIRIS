"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { bangunPompaJinjing, buangBahan } from "./bangunPompaJinjing";

const ARAH_KAMERA = new THREE.Vector3(-2.7, 1.3, 2.9).normalize();
const TARGET = new THREE.Vector3(0, 0.62, 0);
const RADIUS_MODEL = 1.45; // bola yang memuat seluruh pompa saat terakit
// Saat terbuka bagian terurai melebar: kamera mundur dan naik sedikit supaya semua tetap terlihat.
const MUNDUR_BUKA = 0.55;
const NAIK_BUKA = 0.35;

/**
 * Penampil 3D pompa jinjing: seret untuk memutar, gulir atau cubit untuk memperbesar,
 * tombol Buka/Tutup mesin menguraikan dan merakit kembali bagian-bagiannya.
 * Render berhenti saat kotak tidak terlihat di layar. Gerak otomatis mati bila pengguna memilih gerak dikurangi.
 */
export default function PenampilPompa({ nama }: { nama: string }) {
  const wadah = useRef<HTMLDivElement>(null);
  const targetBuka = useRef(0);
  const aturUlang = useRef<() => void>(() => {});
  const [buka, setBuka] = useState(false);
  const [galat, setGalat] = useState(false);

  useEffect(() => {
    const el = wadah.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL hanya bisa diuji di peramban
      setGalat(true);
      return;
    }
    const geraKurang = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const ruang = new RoomEnvironment();
    scene.environment = pmrem.fromScene(ruang, 0.04).texture;
    scene.environmentIntensity = 0.55;
    ruang.dispose();
    pmrem.dispose();

    const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    // Jarak supaya model pas di kotak, dihitung dari sudut pandang tersempit (tegak atau mendatar).
    const jarakPas = () => {
      const v = THREE.MathUtils.degToRad(kamera.fov);
      const h = 2 * Math.atan(Math.tan(v / 2) * kamera.aspect);
      return (RADIUS_MODEL / Math.sin(Math.min(v, h) / 2)) * 1.02;
    };
    const keAwal = () => {
      kamera.position.copy(TARGET).addScaledVector(ARAH_KAMERA, jarakPas());
    };
    keAwal();

    const matahari = new THREE.DirectionalLight(0xffffff, 2.4);
    matahari.position.set(-3, 5, 4);
    matahari.castShadow = true;
    matahari.shadow.mapSize.set(1024, 1024);
    matahari.shadow.camera.left = -2.5;
    matahari.shadow.camera.right = 2.5;
    matahari.shadow.camera.top = 2.5;
    matahari.shadow.camera.bottom = -2.5;
    matahari.shadow.normalBias = 0.02;
    scene.add(matahari, new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 0.9));

    // Lantai bayangan saja: kotak latar halaman tetap terlihat.
    const lantai = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.ShadowMaterial({ opacity: 0.18 }));
    lantai.rotation.x = -Math.PI / 2;
    lantai.receiveShadow = true;
    scene.add(lantai);

    const model = bangunPompaJinjing();
    scene.add(model.akar);

    const kontrol = new OrbitControls(kamera, renderer.domElement);
    kontrol.target.copy(TARGET);
    kontrol.enableDamping = true;
    kontrol.enablePan = false;
    kontrol.minDistance = 2.2;
    kontrol.maxDistance = 12;
    kontrol.maxPolarAngle = Math.PI / 2 - 0.05; // tidak menembus lantai
    kontrol.autoRotate = !geraKurang;
    kontrol.autoRotateSpeed = 0.8;
    let disentuh = false;
    kontrol.addEventListener("start", () => {
      kontrol.autoRotate = false;
      disentuh = true;
    });

    let faktorLama = 1; // skala jarak kamera akibat buka/tutup pada frame sebelumnya
    let naikLama = 0;
    aturUlang.current = () => {
      kontrol.target.copy(TARGET).y += naikLama;
      keAwal();
      kamera.position.sub(TARGET).multiplyScalar(faktorLama).add(kontrol.target);
      kontrol.update();
    };

    const ukur = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      kamera.aspect = w / h;
      // Kotak sempit (HP): mundurkan kamera supaya seluruh pompa tetap masuk.
      kamera.fov = w / h < 1 ? 42 : 32;
      kamera.updateProjectionMatrix();
      if (!disentuh) aturUlang.current();
    };
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    ukur();

    const timer = new THREE.Timer();
    timer.connect(document);
    let nilaiBuka = 0;
    let terlihat = true;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);

    renderer.setAnimationLoop(() => {
      timer.update();
      if (!terlihat) return;
      const dt = Math.min(timer.getDelta(), 0.1);
      nilaiBuka = geraKurang ? targetBuka.current : THREE.MathUtils.damp(nilaiBuka, targetBuka.current, 4, dt);
      model.perFrame(nilaiBuka, dt);
      // Ikutkan kamera: ubah jarak ke target dan naikkan target sebanding tingkat buka.
      const faktor = 1 + MUNDUR_BUKA * nilaiBuka;
      const naik = NAIK_BUKA * nilaiBuka;
      if (faktor !== faktorLama || naik !== naikLama) {
        const dy = naik - naikLama;
        kontrol.target.y += dy;
        kamera.position.y += dy;
        const off = kamera.position.clone().sub(kontrol.target).multiplyScalar(faktor / faktorLama);
        kamera.position.copy(kontrol.target).add(off);
        faktorLama = faktor;
        naikLama = naik;
      }
      kontrol.update(dt);
      renderer.render(scene, kamera);
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      kontrol.dispose();
      timer.dispose();
      model.buang();
      buangBahan();
      lantai.geometry.dispose();
      (lantai.material as THREE.Material).dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  function alih() {
    const baru = !buka;
    setBuka(baru);
    targetBuka.current = baru ? 1 : 0;
  }

  if (galat) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">
        Peramban ini tidak mendukung tampilan 3D (WebGL).
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        ref={wadah}
        role="img"
        aria-label={`Model 3D ${nama}. Seret untuk memutar, gulir untuk memperbesar.${buka ? " Mesin sedang dibuka, bagian-bagiannya terurai." : ""}`}
        className="min-h-[300px] flex-1 cursor-grab active:cursor-grabbing lg:min-h-[400px]"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={alih}
            aria-pressed={buka}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {buka ? <path d="M4 12h16M12 4v16" /> : <path d="M3 3l6 6M21 3l-6 6M3 21l6-6M21 21l-6-6" />}
            </svg>
            {buka ? "Tutup mesin" : "Buka mesin"}
          </button>
          <button
            type="button"
            onClick={() => aturUlang.current()}
            className="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-semibold text-ink shadow-sm hover:bg-paper"
          >
            Atur ulang sudut
          </button>
        </div>
        <span className="rounded-full bg-surface px-3 py-1.5 text-sm text-muted shadow-sm">Seret untuk memutar</span>
      </div>
    </div>
  );
}
