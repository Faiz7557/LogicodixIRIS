"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { formatAngka } from "@/lib/format";
import { NAMA_BULAN, NAMA_BULAN_PENDEK } from "@/lib/satelitBulanan";
import { tingkat, type TahunSatelit } from "./skalaSatelit";

const JARAK = 1.1; // antar kotak
const LEBAR = 0.9;
const TINGGI_MAKS = 4; // tinggi balok tertinggi
// Sudut miring seperti kalender 3D Sparekit: grid memanjang diagonal sehingga mengisi bingkai.
const ARAH_AWAL = new THREE.Vector3(0.55, 1.05, 1).normalize();

/**
 * Hari ada titik api per bulan sebagai balok 3D (pola tampilan 3D kalender Sparekit):
 * kolom = tahun (sumbu x), baris = bulan (sumbu z), tinggi = hari, warna = skala yang sama dengan tampilan kotak.
 * Tahun kering ekstrem diberi lantai berwarna pasir di sepanjang kolomnya.
 * Seret untuk memutar, klik dua kali untuk mengembalikan. Balok tumbuh saat muncul kecuali gerak dikurangi.
 */
export default function Balok3DSatelit({ data }: { data: TahunSatelit[] }) {
  const wadah = useRef<HTMLDivElement>(null);
  const labelTahun = useRef(new Map<number, HTMLSpanElement>());
  const labelBulan = useRef(new Map<number, HTMLSpanElement>());
  const tipRef = useRef<HTMLDivElement>(null);
  const [galat, setGalat] = useState(false);
  const kunci = JSON.stringify(data);

  useEffect(() => {
    const el = wadah.current;
    if (!el) return;
    const tahun: TahunSatelit[] = JSON.parse(kunci);

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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    el.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const sinar = new THREE.DirectionalLight(0xffffff, 2.1);
    sinar.position.set(-8, 16, 10);
    sinar.castShadow = true;
    sinar.shadow.mapSize.set(1024, 1024);
    Object.assign(sinar.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12 });
    scene.add(sinar, new THREE.HemisphereLight(0xffffff, 0xd9d2c4, 1.5));

    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[] = [];
    const nT = tahun.length;
    const x0 = -((nT - 1) * JARAK) / 2;
    const z0 = -((12 - 1) * JARAK) / 2;
    const posX = (i: number) => x0 + i * JARAK;
    const posZ = (b: number) => z0 + b * JARAK;
    const maks = Math.max(10, ...tahun.flatMap((t) => t.bulan));

    const lantai = new THREE.Mesh(new THREE.PlaneGeometry(nT * JARAK + 4, 12 * JARAK + 4), new THREE.ShadowMaterial({ opacity: 0.12 }));
    geos.push(lantai.geometry);
    mats.push(lantai.material as THREE.Material);
    lantai.rotation.x = -Math.PI / 2;
    lantai.receiveShadow = true;
    scene.add(lantai);

    const geoAlas = new RoundedBoxGeometry(LEBAR, 0.1, LEBAR, 2, 0.04);
    const geoBalok = new RoundedBoxGeometry(LEBAR * 0.86, 1, LEBAR * 0.86, 2, 0.05);
    geoBalok.translate(0, 0.5, 0); // pangkal di y = 0 supaya skala y menumbuhkan dari lantai
    const geoPita = new THREE.PlaneGeometry(JARAK, 12 * JARAK + 0.3);
    geos.push(geoAlas, geoBalok, geoPita);
    const matAlas = new THREE.MeshStandardMaterial({ color: tingkat(0).hex, roughness: 0.9 });
    const matPita = new THREE.MeshStandardMaterial({ color: 0xf0e2c8, roughness: 1 });
    mats.push(matAlas, matPita);
    const matWarna = new Map<string, THREE.MeshStandardMaterial>();
    const bahan = (hex: string) => {
      let mm = matWarna.get(hex);
      if (!mm) {
        mm = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.75 });
        matWarna.set(hex, mm);
        mats.push(mm);
      }
      return mm;
    };

    const balok: { mesh: THREE.Mesh; tinggi: number; urutan: number }[] = [];
    tahun.forEach((t, i) => {
      if (t.ekstrem) {
        const pita = new THREE.Mesh(geoPita, matPita);
        pita.rotation.x = -Math.PI / 2;
        pita.position.set(posX(i), 0.005, 0);
        pita.receiveShadow = true;
        scene.add(pita);
      }
      t.bulan.forEach((h, b) => {
        const alas = new THREE.Mesh(geoAlas, matAlas);
        alas.position.set(posX(i), 0.05, posZ(b));
        alas.receiveShadow = true;
        scene.add(alas);
        if (h <= 0) return;
        const tinggi = 0.15 + (h / maks) * TINGGI_MAKS;
        const me = new THREE.Mesh(geoBalok, bahan(tingkat(h).hex));
        me.position.set(posX(i), 0.1, posZ(b));
        me.scale.y = geraKurang ? tinggi : 0.001;
        me.castShadow = true;
        me.receiveShadow = true;
        me.userData = { tahun: t.tahun, bulan: b, hari: h, ekstrem: t.ekstrem };
        scene.add(me);
        balok.push({ mesh: me, tinggi, urutan: i + b * 0.5 });
      });
    });

    const target = new THREE.Vector3(0, 0.8, 0);
    const kamera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
    const jarakPas = () => {
      const v = THREE.MathUtils.degToRad(kamera.fov);
      const h = 2 * Math.atan(Math.tan(v / 2) * kamera.aspect);
      const radius = Math.hypot((nT * JARAK) / 2, (12 * JARAK) / 2) * 0.86;
      return radius / Math.sin(Math.min(v, h) / 2);
    };
    const keAwal = () => kamera.position.copy(target).addScaledVector(ARAH_AWAL, jarakPas());

    const kontrol = new OrbitControls(kamera, renderer.domElement);
    kontrol.target.copy(target);
    kontrol.enableDamping = true;
    kontrol.enablePan = false;
    kontrol.minDistance = 6;
    kontrol.maxDistance = 70;
    kontrol.maxPolarAngle = Math.PI / 2 - 0.08;
    let disentuh = false;
    kontrol.addEventListener("start", () => (disentuh = true));
    const ulang = () => {
      disentuh = false;
      kontrol.target.copy(target);
      keAwal();
      kontrol.update();
    };
    renderer.domElement.addEventListener("dblclick", ulang);

    const ukur = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      kamera.aspect = w / h;
      kamera.updateProjectionMatrix();
      if (!disentuh) ulang();
    };
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    ukur();

    // Keterangan saat kursor di atas balok.
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const meshes = balok.map((b) => b.mesh);
    const onMove = (e: PointerEvent) => {
      const tip = tipRef.current;
      if (!tip) return;
      if (e.buttons || e.pointerType !== "mouse") {
        tip.hidden = true;
        return;
      }
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, kamera);
      const kena = ray.intersectObjects(meshes, false)[0];
      if (!kena) {
        tip.hidden = true;
        return;
      }
      const u = kena.object.userData as { tahun: number; bulan: number; hari: number; ekstrem: boolean };
      tip.firstElementChild!.textContent = `${NAMA_BULAN[u.bulan]} ${u.tahun}`;
      tip.lastElementChild!.textContent = `${formatAngka(u.hari)} hari ada titik api${u.ekstrem ? " · tahun kering ekstrem" : ""}`;
      tip.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
      tip.hidden = false;
    };
    const onLeave = () => tipRef.current && (tipRef.current.hidden = true);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const timer = new THREE.Timer();
    timer.connect(document);
    let terlihat = true;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);
    let umur = 0;
    const v = new THREE.Vector3();

    renderer.setAnimationLoop(() => {
      timer.update();
      if (!terlihat) return;
      const dt = Math.min(timer.getDelta(), 0.1);
      umur += dt;
      if (!geraKurang) {
        for (const b of balok) {
          const p = THREE.MathUtils.clamp((umur - b.urutan * 0.035) / 0.6, 0, 1);
          b.mesh.scale.y = Math.max(0.001, b.tinggi * (1 - Math.pow(1 - p, 3)));
        }
      }
      kontrol.update(dt);
      renderer.render(scene, kamera);

      // Label tahun di depan (setelah Desember), label bulan di sisi kiri.
      const w = el.clientWidth;
      const h = el.clientHeight;
      const taruh = (lab: HTMLSpanElement | undefined, p: THREE.Vector3) => {
        if (!lab) return;
        v.copy(p).project(kamera);
        lab.style.visibility = v.z < 1 ? "visible" : "hidden";
        lab.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, -50%)`;
      };
      tahun.forEach((t, i) => taruh(labelTahun.current.get(t.tahun), new THREE.Vector3(posX(i), 0, posZ(11) + JARAK)));
      for (let b = 0; b < 12; b += 2) taruh(labelBulan.current.get(b), new THREE.Vector3(posX(0) - JARAK * 1.1, 0, posZ(b)));
    });

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      kontrol.dispose();
      timer.dispose();
      renderer.domElement.removeEventListener("dblclick", ulang);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      for (const x of geos) x.dispose();
      for (const x of mats) x.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [kunci]);

  if (galat) {
    return <div className="flex h-[380px] items-center justify-center text-sm text-muted">Peramban ini tidak mendukung tampilan 3D (WebGL).</div>;
  }

  const ringkas = data.map((t) => `${t.tahun}: ${t.hari} hari${t.ekstrem ? ", kering ekstrem" : ""}`).join("; ");

  return (
    <div
      ref={wadah}
      role="img"
      aria-label={`Balok 3D hari ada titik api per bulan. Total per tahun: ${ringkas}. Rincian per bulan ada di tampilan kotak.`}
      className="@container relative h-[380px] cursor-grab select-none overflow-hidden active:cursor-grabbing md:h-[440px]"
    >
      {data.map((t) => (
        <span
          key={`t${t.tahun}`}
          aria-hidden="true"
          ref={(n) => {
            if (n) labelTahun.current.set(t.tahun, n);
            else labelTahun.current.delete(t.tahun);
          }}
          style={{ visibility: "hidden" }}
          className={`tabular pointer-events-none absolute left-0 top-0 text-xs ${t.ekstrem ? "font-bold text-ink" : "text-muted"}`}
        >
          &apos;{String(t.tahun).slice(2)}
        </span>
      ))}
      {[0, 2, 4, 6, 8, 10].map((b) => (
        <span
          key={`b${b}`}
          aria-hidden="true"
          ref={(n) => {
            if (n) labelBulan.current.set(b, n);
            else labelBulan.current.delete(b);
          }}
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute left-0 top-0 text-xs text-muted"
        >
          {NAMA_BULAN_PENDEK[b]}
        </span>
      ))}
      <div ref={tipRef} hidden className="pointer-events-none absolute left-0 top-0 z-10 rounded-xl bg-ink px-3 py-2 text-sm text-white shadow-lg">
        <p className="font-semibold" />
        <p className="text-white/85" />
      </div>
    </div>
  );
}
