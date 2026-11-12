"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/*
 * Hero 3D "Lahan gambut di bawah satelit" (ilustrasi, bukan data desa nyata).
 * - Medan bergelombang dengan garis kontur yang dihitung di shader (menyambung gaya latar kontur SVG).
 * - Satelit melintas dan memancarkan jalur pindai; titik panas menyala saat dilewati, lalu meredup.
 *   Bara naik dari titik yang menyala (partikel dihitung di GPU).
 * - Kursor: lensa pantau menegaskan kontur di sekitarnya dan memicu titik panas terdekat; kamera
 *   miring halus mengikuti kursor (diredam, bisa disela). Klik/ketuk area kosong: gelombang pindai.
 * - Performa: piksel dibatasi, render berhenti saat hero tak terlihat atau dijeda, geometri lebih
 *   ringan di HP. Gerak dikurangi: satu gambar diam tanpa animasi.
 */

const LEBAR = 16;
const DALAM = 10;
const N_TITIK = 30;
const N_BARA = 24; // per titik
const PERIODE_LINTAS = 9; // detik per lintasan satelit

// ---------- Derau deterministik (sama di setiap muat) ----------
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function derau(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
/** Tinggi medan: fBm lembut, dataran gambut rendah di tengah, perbukitan di tepi. */
function tinggi(x: number, z: number) {
  let h = 0;
  let amp = 1;
  let f = 0.22;
  for (let i = 0; i < 5; i++) {
    h += derau(x * f + 11.3, z * f + 4.7) * amp;
    amp *= 0.5;
    f *= 2.05;
  }
  const tepi = Math.min(1, Math.hypot(x / (LEBAR * 0.5), z / (DALAM * 0.5)));
  return (h - 0.9) * 0.9 + tepi * tepi * 0.7;
}

export default function LahanSatelit({ onSiap }: { onSiap?: () => void }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [jeda, setJeda] = useState(false);
  const [diam, setDiam] = useState(false);
  const [jumlah, setJumlah] = useState(0);
  const jedaRef = useRef(false);
  const siapRef = useRef(onSiap);

  useEffect(() => {
    siapRef.current = onSiap;
  }, [onSiap]);

  useEffect(() => {
    jedaRef.current = jeda;
  }, [jeda]);

  useEffect(() => {
    const el = wadah.current;
    const hero = el?.closest("section");
    if (!el || !hero) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // latar SVG tetap tampil sebagai cadangan
    }
    const gerakKurang = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hp = window.matchMedia("(max-width: 767px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- preferensi gerak hanya bisa dibaca di peramban
    setDiam(gerakKurang);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, hp ? 1.5 : 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const kamera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    const POS_KAMERA = new THREE.Vector3(0, 6.2, 7.4);
    const PANDANG = new THREE.Vector3(0, -0.2, -0.6);
    kamera.position.copy(POS_KAMERA);
    kamera.lookAt(PANDANG);

    // ---------- Medan ----------
    const seg = hp ? [120, 76] : [220, 138];
    const geoMedan = new THREE.PlaneGeometry(LEBAR, DALAM, seg[0], seg[1]);
    geoMedan.rotateX(-Math.PI / 2);
    const pos = geoMedan.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, tinggi(pos.getX(i), pos.getZ(i)));
    geoMedan.computeVertexNormals();

    const seragam = {
      uWaktu: { value: 0 },
      uPindai: { value: -99 }, // posisi x pusat jalur pindai satelit
      uKursor: { value: new THREE.Vector3(0, 0, 99) },
      uKursorKuat: { value: 0 },
      uGelombang: { value: new THREE.Vector4(0, 0, -99, 0) }, // x, z, jari-jari, kekuatan
    };
    const bahanMedan = new THREE.ShaderMaterial({
      uniforms: seragam,
      transparent: true,
      depthWrite: true,
      vertexShader: /* glsl */ `
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          vPos = position;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uWaktu;
        uniform float uPindai;
        uniform vec3 uKursor;
        uniform float uKursorKuat;
        uniform vec4 uGelombang;
        varying vec3 vPos;
        varying vec3 vNormal;

        float garis(float v, float lebar) {
          // Garis setebal kira-kira lebar piksel di mana pun kemiringannya (fwidth)
          float f = abs(fract(v) - 0.5);
          float w = fwidth(v) * lebar;
          return smoothstep(0.5 - w, 0.5, f);
        }

        void main() {
          // Warna dasar: kertas, lembah sedikit lebih gelap (gambut basah), punggung sedikit hangat
          float h = vPos.y;
          vec3 kertas = vec3(0.961, 0.957, 0.945);
          vec3 lembah = vec3(0.905, 0.893, 0.865);
          vec3 warna = mix(lembah, kertas, smoothstep(-0.7, 0.4, h));
          float cahaya = clamp(dot(normalize(vNormal), normalize(vec3(-0.4, 1.0, 0.3))), 0.0, 1.0);
          warna *= 0.9 + 0.1 * cahaya;

          // Garis kontur: tipis di mana-mana, lebih tegas tiap kelipatan 5 dan di sekitar lensa pantau
          float k = h * 9.0;
          float c1 = garis(k, 1.1);
          float c5 = garis(k / 5.0, 1.6);
          float dKursor = distance(vPos.xz, uKursor.xz);
          float lensa = (1.0 - smoothstep(0.6, 2.2, dKursor)) * uKursorKuat;
          vec3 tinta = vec3(0.12, 0.10, 0.08);
          warna = mix(warna, tinta, c1 * (0.2 + 0.3 * lensa) + c5 * (0.26 + 0.3 * lensa));

          // Jalur pindai satelit: pita miring yang bergerak, dengan garis-garis halus
          float jarakPita = abs((vPos.x + vPos.z * 0.35) - uPindai);
          float pita = 1.0 - smoothstep(0.35, 1.25, jarakPita);
          float garisPindai = 0.5 + 0.5 * sin((vPos.z - vPos.x * 0.35) * 26.0);
          warna = mix(warna, vec3(0.98, 0.83, 0.70), pita * (0.28 + 0.10 * garisPindai));
          warna = mix(warna, vec3(0.71, 0.26, 0.10), (1.0 - smoothstep(0.0, 0.06, abs(jarakPita - 1.05))) * 0.35 * step(0.01, pita));

          // Gelombang pindai dari klik/ketuk
          float dG = distance(vPos.xz, uGelombang.xy);
          float cincin = 1.0 - smoothstep(0.0, 0.08, abs(dG - uGelombang.z));
          warna = mix(warna, vec3(0.71, 0.26, 0.10), cincin * uGelombang.w * 0.6);

          // Cincin lensa pantau
          float cincinLensa = 1.0 - smoothstep(0.0, 0.035, abs(dKursor - 0.85));
          warna = mix(warna, vec3(0.16, 0.16, 0.18), cincinLensa * 0.45 * uKursorKuat);

          // Memudar di tepi supaya menyatu dengan halaman
          float tepi = smoothstep(0.0, 1.6, ${(LEBAR / 2).toFixed(1)} - abs(vPos.x)) * smoothstep(0.0, 1.8, ${(DALAM / 2).toFixed(1)} - abs(vPos.z));
          gl_FragColor = vec4(warna, tepi);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });
    const medan = new THREE.Mesh(geoMedan, bahanMedan);
    scene.add(medan);

    // ---------- Titik panas (instanced) ----------
    const titik: { p: THREE.Vector3; kuat: number; target: number; fase: number; kiri: number }[] = [];
    for (let i = 0; titik.length < N_TITIK && i < 500; i++) {
      const x = (hash(i, 3.1) - 0.5) * LEBAR * 0.8;
      const z = (hash(i, 7.7) - 0.5) * DALAM * 0.75;
      const y = tinggi(x, z);
      if (y > 0.05) continue; // titik panas di dataran gambut rendah
      if (titik.some((t) => Math.hypot(t.p.x - x, t.p.z - z) < 0.75)) continue;
      titik.push({ p: new THREE.Vector3(x, y + 0.02, z), kuat: 0, target: 0, fase: hash(i, 9.9) * 6.28, kiri: x + z * 0.35 });
    }

    const geoCakram = new THREE.CircleGeometry(1, 40);
    geoCakram.rotateX(-Math.PI / 2);
    const aKuat = new THREE.InstancedBufferAttribute(new Float32Array(titik.length), 1);
    const aFase = new THREE.InstancedBufferAttribute(new Float32Array(titik.map((t) => t.fase)), 1);
    geoCakram.setAttribute("aKuat", aKuat);
    geoCakram.setAttribute("aFase", aFase);
    const bahanTitik = new THREE.ShaderMaterial({
      uniforms: { uWaktu: seragam.uWaktu },
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        attribute float aKuat;
        attribute float aFase;
        uniform float uWaktu;
        varying vec2 vUv;
        varying float vKuat;
        varying float vFase;
        void main() {
          vUv = position.xz;
          vKuat = aKuat;
          vFase = aFase;
          float skala = 0.22 + 0.5 * aKuat;
          vec3 p = position * skala;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uWaktu;
        varying vec2 vUv;
        varying float vKuat;
        varying float vFase;
        void main() {
          float r = length(vUv);
          float inti = 1.0 - smoothstep(0.18, 0.32, r);
          float pendar = (1.0 - smoothstep(0.2, 0.85, r)) * 0.38 * vKuat;
          float denyut = fract(uWaktu * 0.7 + vFase);
          float cincin = (1.0 - smoothstep(0.0, 0.07, abs(r - denyut))) * (1.0 - denyut) * vKuat;
          vec3 bara = mix(vec3(0.71, 0.26, 0.10), vec3(0.93, 0.42, 0.16), vKuat * (1.0 - smoothstep(0.25, 0.9, r) * 0.6));
          float a = max(inti * (0.55 + 0.45 * vKuat), max(pendar, cincin * 0.9));
          if (a < 0.01) discard;
          gl_FragColor = vec4(bara, a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });
    const cakram = new THREE.InstancedMesh(geoCakram, bahanTitik, titik.length);
    const boneka = new THREE.Object3D();
    titik.forEach((t, i) => {
      boneka.position.copy(t.p);
      boneka.updateMatrix();
      cakram.setMatrixAt(i, boneka.matrix);
    });
    cakram.renderOrder = 2;
    scene.add(cakram);

    // ---------- Bara naik (partikel di GPU) ----------
    const nBara = titik.length * (hp ? 12 : N_BARA);
    const posBara = new Float32Array(nBara * 3);
    const benihBara = new Float32Array(nBara * 2);
    const indeksBara = new Float32Array(nBara);
    for (let i = 0; i < nBara; i++) {
      const t = titik[i % titik.length];
      posBara.set([t.p.x, t.p.y, t.p.z], i * 3);
      benihBara.set([hash(i, 1.3), hash(i, 5.9)], i * 2);
      indeksBara[i] = i % titik.length;
    }
    const geoBara = new THREE.BufferGeometry();
    geoBara.setAttribute("position", new THREE.BufferAttribute(posBara, 3));
    geoBara.setAttribute("aBenih", new THREE.BufferAttribute(benihBara, 2));
    const kuatBara = new THREE.BufferAttribute(new Float32Array(nBara), 1);
    geoBara.setAttribute("aKuat", kuatBara);
    const bahanBara = new THREE.ShaderMaterial({
      uniforms: { uWaktu: seragam.uWaktu, uSkala: { value: 1 } },
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec2 aBenih;
        attribute float aKuat;
        uniform float uWaktu;
        uniform float uSkala;
        varying float vA;
        void main() {
          float t = fract(uWaktu * (0.25 + aBenih.x * 0.25) + aBenih.y);
          vec3 p = position;
          p.y += t * (0.9 + aBenih.x * 0.8);
          p.x += sin(t * 6.0 + aBenih.y * 12.0) * 0.08 * t + (aBenih.x - 0.5) * 0.18;
          p.z += cos(t * 5.0 + aBenih.x * 9.0) * 0.08 * t;
          vA = (1.0 - t) * smoothstep(0.0, 0.12, t) * aKuat;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (2.0 + 5.0 * (1.0 - t)) * uSkala * aKuat * (6.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          if (r > 0.5 || vA < 0.01) discard;
          gl_FragColor = vec4(mix(vec3(0.98, 0.62, 0.25), vec3(0.71, 0.26, 0.10), r * 1.6), vA * (1.0 - r * 2.0));
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });
    const bara = new THREE.Points(geoBara, bahanBara);
    bara.frustumCulled = false;
    bara.renderOrder = 3;
    scene.add(bara);

    // ---------- Satelit dan berkas pindai ----------
    const satelit = new THREE.Group();
    const mBadan = new THREE.MeshBasicMaterial({ color: 0x2b2d31 });
    const mPanel = new THREE.MeshBasicMaterial({ color: 0x3f6db3 });
    const badan = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.16), mBadan);
    const panelKiri = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.012, 0.18), mPanel);
    panelKiri.position.x = -0.34;
    const panelKanan = panelKiri.clone();
    panelKanan.position.x = 0.34;
    const antena = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), mBadan);
    antena.position.y = -0.14;
    satelit.add(badan, panelKiri, panelKanan, antena);
    satelit.scale.setScalar(hp ? 0.85 : 1);
    scene.add(satelit);

    const berkas = new THREE.Mesh(
      new THREE.ConeGeometry(1, 1, 32, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xf2a679, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }),
    );
    scene.add(berkas);

    // ---------- Interaksi ----------
    const ray = new THREE.Raycaster();
    const penunjuk = new THREE.Vector2();
    const bidang = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.25);
    const kenaBidang = new THREE.Vector3();
    const miring = { x: 0, y: 0, tx: 0, ty: 0 };
    let kursorAktif = false;
    let gelombang = { x: 0, z: 0, r: 99, kuat: 0 };

    const keDunia = (e: PointerEvent) => {
      const b = renderer.domElement.getBoundingClientRect();
      penunjuk.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(penunjuk, kamera);
      return ray.ray.intersectPlane(bidang, kenaBidang);
    };
    const interaktif = (t: EventTarget | null) => t instanceof Element && !!t.closest("a, button, input, textarea, select, label, [role=listbox], [data-tanpa-pindai]");

    const onMove = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      miring.tx = ((e.clientX - b.left) / b.width - 0.5) * 2;
      miring.ty = ((e.clientY - b.top) / b.height - 0.5) * 2;
      if (keDunia(e)) {
        seragam.uKursor.value.copy(kenaBidang);
        kursorAktif = !interaktif(e.target);
      }
    };
    const onLeave = () => {
      kursorAktif = false;
      miring.tx = miring.ty = 0;
    };
    const onDown = (e: PointerEvent) => {
      if (interaktif(e.target) || !keDunia(e)) return;
      gelombang = { x: kenaBidang.x, z: kenaBidang.z, r: 0, kuat: 1 };
    };
    if (!gerakKurang) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointerdown", onDown);
    }

    // ---------- Ukuran, keterlihatan ----------
    const ukur = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      kamera.aspect = w / h;
      // Layar sempit: mundur supaya medan tetap memenuhi lebar
      kamera.fov = w / h < 1 ? 58 : 38;
      kamera.updateProjectionMatrix();
      bahanBara.uniforms.uSkala.value = renderer.getPixelRatio() * (h / 700);
    };
    const ro = new ResizeObserver(ukur);
    ro.observe(el);
    ukur();

    let terlihat = true;
    const io = new IntersectionObserver(([e]) => (terlihat = e.isIntersecting));
    io.observe(el);

    const timer = new THREE.Timer();
    timer.connect(document);
    let waktu = 0;
    let jumlahLama = -1;
    const arahTurun = new THREE.Vector3();
    const arahNaik = new THREE.Vector3();
    const tanah = new THREE.Vector3();
    const atas = new THREE.Vector3(0, 1, 0);

    const langkah = (dt: number) => {
      waktu += dt;
      seragam.uWaktu.value = waktu;

      // Lintasan satelit: dari kiri ke kanan, berulang
      const p = (waktu % PERIODE_LINTAS) / PERIODE_LINTAS;
      const lintas = THREE.MathUtils.lerp(-LEBAR * 0.62, LEBAR * 0.62, p);
      seragam.uPindai.value = lintas;
      satelit.position.set(lintas + 3.5 * 0.35, 1.7, -3.5);
      satelit.rotation.set(0.15, 0, Math.sin(waktu * 0.6) * 0.05);
      // Berkas: kerucut dari satelit ke titik di tanah di bawah jalur
      tanah.set(lintas, -0.1, 0);
      arahTurun.subVectors(tanah, satelit.position);
      const panjang = arahTurun.length();
      berkas.position.copy(satelit.position).addScaledVector(arahTurun, 0.5);
      berkas.quaternion.setFromUnitVectors(atas, arahNaik.copy(arahTurun).normalize().negate());
      berkas.scale.set(1.1, panjang, 0.45);

      // Titik panas: menyala saat jalur pindai, lensa, atau gelombang melewatinya; lalu meredup
      gelombang.r += dt * 4.5;
      gelombang.kuat = Math.max(0, 1 - gelombang.r / 5);
      seragam.uGelombang.value.set(gelombang.x, gelombang.z, gelombang.r, gelombang.kuat);
      seragam.uKursorKuat.value = THREE.MathUtils.damp(seragam.uKursorKuat.value, kursorAktif ? 1 : 0, 6, dt);

      let menyala = 0;
      titik.forEach((t, i) => {
        if (Math.abs(t.kiri - lintas) < 0.6) t.target = 1;
        if (kursorAktif && t.p.distanceTo(seragam.uKursor.value) < 1.1) t.target = Math.max(t.target, 0.9);
        if (gelombang.kuat > 0 && Math.abs(Math.hypot(t.p.x - gelombang.x, t.p.z - gelombang.z) - gelombang.r) < 0.35) t.target = 1;
        t.kuat = THREE.MathUtils.damp(t.kuat, t.target, t.target > t.kuat ? 9 : 0.45, dt);
        t.target = Math.max(0, t.target - dt * 0.16); // padam perlahan
        aKuat.setX(i, t.kuat);
        if (t.kuat > 0.35) menyala++;
      });
      aKuat.needsUpdate = true;
      for (let i = 0; i < nBara; i++) kuatBara.setX(i, titik[indeksBara[i]].kuat);
      kuatBara.needsUpdate = true;
      if (menyala !== jumlahLama) {
        jumlahLama = menyala;
        setJumlah(menyala);
      }

      // Kamera: miring halus mengikuti kursor (teredam, mulai dari posisi saat ini)
      miring.x = THREE.MathUtils.damp(miring.x, miring.tx, 2.5, dt);
      miring.y = THREE.MathUtils.damp(miring.y, miring.ty, 2.5, dt);
      kamera.position.set(POS_KAMERA.x + miring.x * 0.9, POS_KAMERA.y - miring.y * 0.35, POS_KAMERA.z);
      kamera.lookAt(PANDANG.x + miring.x * 0.3, PANDANG.y, PANDANG.z);
    };

    let siapDilaporkan = false;
    const gambar = () => {
      renderer.render(scene, kamera);
      if (!siapDilaporkan) {
        siapDilaporkan = true;
        siapRef.current?.();
      }
    };

    let hidup = true;
    void renderer.compileAsync(scene, kamera).finally(() => {
      if (!hidup) return;
      if (gerakKurang) {
        // Satu gambar diam: beberapa titik menyala, jalur pindai di tengah.
        waktu = PERIODE_LINTAS * 0.5;
        titik.forEach((t, i) => (t.target = i % 3 === 0 ? 1 : 0));
        for (let k = 0; k < 120; k++) langkah(1 / 30);
        gambar();
        return;
      }
      renderer.setAnimationLoop(() => {
        timer.update();
        if (!terlihat || jedaRef.current) return;
        langkah(Math.min(timer.getDelta(), 0.05));
        gambar();
      });
    });

    return () => {
      hidup = false;
      renderer.setAnimationLoop(null);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("pointerdown", onDown);
      timer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose();
      });
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div
        ref={wadah}
        aria-hidden="true"
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_48%_at_50%_42%,rgba(0,0,0,0.3),#000_88%)] md:[mask-image:radial-gradient(ellipse_48%_42%_at_50%_34%,rgba(0,0,0,0.45),#000_75%)]"
      />
      <div data-tanpa-pindai className="absolute bottom-3 left-3 z-10 flex items-center gap-2 sm:bottom-4 sm:left-4">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/85 px-3 py-1.5 text-xs text-muted shadow-sm backdrop-blur">
          <span aria-hidden="true" className="relative flex size-2">
            {!diam && !jeda ? <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember/60" /> : null}
            <span className="relative inline-flex size-2 rounded-full bg-ember" />
          </span>
          <span>
            Satelit VIIRS · <span className="tabular font-semibold text-ink">{jumlah}</span> titik panas · ilustrasi
          </span>
        </p>
        {!diam ? (
          <button
            type="button"
            onClick={() => setJeda((j) => !j)}
            aria-pressed={jeda}
            aria-label={jeda ? "Putar animasi latar" : "Jeda animasi latar"}
            className="tekan inline-flex size-8 items-center justify-center rounded-full border border-line bg-surface/85 text-ink shadow-sm backdrop-blur hover:bg-surface"
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              {jeda ? <path d="M7 4l13 8-13 8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}
            </svg>
          </button>
        ) : null}
      </div>
    </>
  );
}
