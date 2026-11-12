"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { KONFIGURASI } from "./konfigurasi";

type Label = { teks: string; x: number; y: number } | null;

/**
 * Penampil 3D umum untuk alat kesiapan (pompa jinjing, selang keluar, sumur bor).
 * Seret untuk memutar, gulir atau cubit untuk memperbesar, tombol Buka/Tutup menjalankan keadaan "buka"
 * model (mesin terurai, selang tergelar, tanah terbelah). Kamera ikut bergeser supaya seluruh model tetap
 * masuk, tanpa membuang sudut putar pengguna. Arahkan kursor atau ketuk bagian untuk melihat namanya.
 * Render berhenti saat kotak tidak terlihat; gerak otomatis mati bila pengguna memilih gerak dikurangi.
 */
export default function PenampilModel({ kode, nama }: { kode: string; nama: string }) {
  const k = KONFIGURASI[kode];
  const wadah = useRef<HTMLDivElement>(null);
  const targetBuka = useRef(0);
  const aturUlang = useRef<() => void>(() => {});
  const [buka, setBuka] = useState(false);
  const [galat, setGalat] = useState(false);
  const [label, setLabel] = useState<Label>(null);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !k) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL hanya bisa diuji di peramban
      setGalat(true);
      return;
    }
    const gerakKurang = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    const kamera = new THREE.PerspectiveCamera(35, 1, 0.05, 80);
    const [t0, t1] = k.target;
    const [r0, r1] = k.radius;
    // Jarak supaya bola berjari-jari r pas di kotak, dari sudut pandang tersempit (tegak atau mendatar).
    const jarakPas = (r: number) => {
      const v = THREE.MathUtils.degToRad(kamera.fov);
      const h = 2 * Math.atan(Math.tan(v / 2) * kamera.aspect);
      return (r / Math.sin(Math.min(v, h) / 2)) * 1.02;
    };

    const matahari = new THREE.DirectionalLight(0xffffff, 2.4);
    matahari.position.set(-3, 5 + k.lantaiY, 4);
    matahari.castShadow = true;
    matahari.shadow.mapSize.set(1024, 1024);
    const lingkup = Math.max(r1 * 1.4, 2.5);
    Object.assign(matahari.shadow.camera, { left: -lingkup, right: lingkup, top: lingkup, bottom: -lingkup, near: 0.5, far: 20 });
    matahari.shadow.camera.updateProjectionMatrix();
    matahari.shadow.normalBias = 0.02;
    scene.add(matahari, new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 0.9));

    // Lantai bayangan saja: latar kotak halaman tetap terlihat.
    const lantai = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.ShadowMaterial({ opacity: 0.18 }));
    lantai.rotation.x = -Math.PI / 2;
    lantai.position.y = k.lantaiY;
    lantai.receiveShadow = true;
    scene.add(lantai);

    const model = k.bangun();
    scene.add(model.akar);
    model.perFrame(0, 0);

    const kontrol = new OrbitControls(kamera, renderer.domElement);
    kontrol.enableDamping = true;
    kontrol.enablePan = false;
    kontrol.minDistance = r0 * 1.2;
    kontrol.maxDistance = r1 * 6;
    kontrol.maxPolarAngle = Math.PI / 2 - 0.05; // tidak menembus lantai
    kontrol.autoRotate = !gerakKurang;
    kontrol.autoRotateSpeed = 0.8;
    let disentuh = false;
    kontrol.addEventListener("start", () => {
      kontrol.autoRotate = false;
      disentuh = true;
    });

    // Keadaan kamera akibat buka/tutup pada frame sebelumnya: geser titik pandang dan skala jarak.
    const targetLama = t0.clone();
    let faktorLama = 1;
    const tSekarang = new THREE.Vector3();
    const off = new THREE.Vector3();

    aturUlang.current = () => {
      kontrol.target.copy(targetLama);
      kamera.position.copy(targetLama).addScaledVector(k.arahKamera, jarakPas(r0) * faktorLama);
      kontrol.update();
    };

    const ukur = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      kamera.aspect = w / h;
      kamera.fov = w / h < 1 ? 42 : 32; // kotak sempit (HP): pandangan lebih lebar
      kamera.updateProjectionMatrix();
      if (!disentuh) aturUlang.current();
    };
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    ukur();

    // ---------- Label bagian: raycasting saat kursor diam di atas model, atau saat diketuk ----------
    const ray = new THREE.Raycaster();
    const penunjuk = new THREE.Vector2();
    let sorot: THREE.Object3D | null = null;
    const bahanAsli = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    const bahanSorot = new Map<THREE.Material, THREE.Material>();

    const labelDari = (o: THREE.Object3D | null): { teks: string; induk: THREE.Object3D } | null => {
      for (let p = o; p && p !== model.akar; p = p.parent) {
        if (p.userData.label) return { teks: p.userData.label as string, induk: p };
        if (p.parent === model.akar && p.name) return { teks: p.name, induk: p };
      }
      return null;
    };
    // Sorot dengan salinan bahan berpendar, supaya bahan yang dipakai bersama bagian lain tidak ikut menyala.
    const salinSorot = (m: THREE.Material) => {
      let s = bahanSorot.get(m);
      if (!s) {
        s = m.clone();
        const std = s as THREE.MeshStandardMaterial;
        if (std.emissive) {
          std.emissive.set(0xff7a3d);
          std.emissiveIntensity = 0.35;
        }
        bahanSorot.set(m, s);
      }
      return s;
    };
    const lepasSorot = () => {
      for (const [mesh, m] of bahanAsli) mesh.material = m;
      bahanAsli.clear();
      sorot = null;
    };
    const pasangSorot = (induk: THREE.Object3D) => {
      if (induk === sorot) return;
      lepasSorot();
      sorot = induk;
      induk.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh || mesh instanceof THREE.InstancedMesh) return;
        if (!(mesh.material as THREE.MeshStandardMaterial).emissive && !Array.isArray(mesh.material)) return;
        bahanAsli.set(mesh, mesh.material);
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(salinSorot) : salinSorot(mesh.material);
      });
    };
    const pilih = (e: PointerEvent) => {
      const b = renderer.domElement.getBoundingClientRect();
      penunjuk.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(penunjuk, kamera);
      const kena = ray.intersectObject(model.akar, true).find((h) => (h.object as THREE.Mesh).isMesh && h.object.visible);
      const hasil = labelDari(kena?.object ?? null);
      if (hasil) {
        pasangSorot(hasil.induk);
        setLabel({ teks: hasil.teks, x: e.clientX - b.left, y: e.clientY - b.top });
        renderer.domElement.style.cursor = "help";
      } else {
        lepasSorot();
        setLabel(null);
        renderer.domElement.style.cursor = "";
      }
    };
    let turun: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.buttons === 0) pilih(e);
    };
    const onDown = (e: PointerEvent) => {
      turun = { x: e.clientX, y: e.clientY };
      if (e.pointerType === "mouse") {
        lepasSorot();
        setLabel(null);
      }
    };
    const onUp = (e: PointerEvent) => {
      // Ketukan (tanpa seret) pada layar sentuh menampilkan label bagian yang diketuk.
      if (turun && Math.hypot(e.clientX - turun.x, e.clientY - turun.y) < 6 && e.pointerType !== "mouse") pilih(e);
      turun = null;
    };
    const onLeave = () => {
      lepasSorot();
      setLabel(null);
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const timer = new THREE.Timer();
    timer.connect(document);
    let nilaiBuka = 0;
    let terlihat = true;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);

    // Kompilasi shader lebih dulu supaya frame pertama tidak tersendat.
    let hidup = true;
    void renderer.compileAsync(scene, kamera).finally(() => {
      if (!hidup) return;
      renderer.setAnimationLoop(() => {
        timer.update();
        if (!terlihat) return;
        const dt = Math.min(timer.getDelta(), 0.1);
        nilaiBuka = gerakKurang ? targetBuka.current : THREE.MathUtils.damp(nilaiBuka, targetBuka.current, 3, dt);
        if (Math.abs(nilaiBuka - targetBuka.current) < 1e-4) nilaiBuka = targetBuka.current;
        model.perFrame(nilaiBuka, dt);

        // Ikutkan kamera: geser titik pandang dan skala jarak sebanding tingkat buka.
        const e = THREE.MathUtils.smoothstep(nilaiBuka, 0, 1);
        tSekarang.lerpVectors(t0, t1, e);
        const faktor = THREE.MathUtils.lerp(1, r1 / r0, e);
        if (faktor !== faktorLama || !tSekarang.equals(targetLama)) {
          off.subVectors(tSekarang, targetLama);
          kontrol.target.add(off);
          kamera.position.add(off);
          const jarak = kamera.position.clone().sub(kontrol.target).multiplyScalar(faktor / faktorLama);
          kamera.position.copy(kontrol.target).add(jarak);
          targetLama.copy(tSekarang);
          faktorLama = faktor;
          kontrol.minDistance = r0 * 1.2 * faktor;
        }
        kontrol.update(dt);
        renderer.render(scene, kamera);
      });
    });

    return () => {
      hidup = false;
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      lepasSorot();
      for (const m of bahanSorot.values()) m.dispose();
      kontrol.dispose();
      timer.dispose();
      model.buang();
      k.buangBersama?.();
      lantai.geometry.dispose();
      (lantai.material as THREE.Material).dispose();
      scene.environment?.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [k]);

  function alih() {
    const baru = !buka;
    setBuka(baru);
    targetBuka.current = baru ? 1 : 0;
  }

  if (galat || !k) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted">
        {galat ? "Peramban ini tidak mendukung tampilan 3D (WebGL)." : "Model 3D untuk alat ini belum tersedia."}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="relative min-h-[300px] flex-1 lg:min-h-[400px]">
        <div
          ref={wadah}
          role="img"
          aria-label={`Model 3D ${nama}. Seret untuk memutar, gulir untuk memperbesar, arahkan atau ketuk bagian untuk melihat namanya.${buka ? ` ${k.saatBuka}` : ""}`}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        />
        {label ? (
          <span
            aria-live="polite"
            className="pointer-events-none absolute z-10 max-w-[16rem] -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white shadow-card"
            style={{ left: label.x, top: label.y }}
          >
            {label.teks}
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={alih}
            aria-pressed={buka}
            className="tekan inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {buka ? <path d="M4 12h16M12 4v16" /> : <path d="M3 3l6 6M21 3l-6 6M3 21l6-6M21 21l-6-6" />}
            </svg>
            {buka ? k.tombol.tutup : k.tombol.buka}
          </button>
          <button
            type="button"
            onClick={() => aturUlang.current()}
            className="tekan inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-semibold text-ink shadow-sm hover:bg-paper"
          >
            Atur ulang sudut
          </button>
        </div>
        <span className="rounded-full bg-surface px-3 py-1.5 text-sm text-muted shadow-sm">Seret untuk memutar · arahkan untuk nama bagian</span>
      </div>
    </div>
  );
}
