import * as THREE from "three";
import type { Bagian, ModelPompa } from "./bangunPompaJinjing";

/*
 * Model 3D prosedural selang keluar (selang kanvas pemadam, lay-flat, 30 m per buah), digulung rapat
 * seperti saat disimpan. "Buka" menggelar selang: gulungan menggelinding ke depan dan meninggalkan
 * selang pipih di tanah (bukan sekadar animasi geser), lalu nozel tersambung, selang menggembung
 * berisi air, dan air menyembur. Satuan 1 kira-kira 40 cm; panjang selang dipadatkan supaya muat di layar.
 */

const L = 5.2; // panjang selang di adegan (mewakili 30 m)
const LEBAR = 0.17; // lebar selang pipih
const TEBAL = 0.034; // tebal selang pipih
const R0 = 0.1; // jari-jari lubang tengah gulungan
const PITCH = TEBAL * 1.18; // tambahan jari-jari tiap putaran
const X0 = -L / 2; // ujung luar selang (kopling A) saat digelar
const M = 460; // titik sampel sepanjang selang
const K = 18; // titik keliling penampang

/** Sudut spiral Archimedes untuk panjang busur `a` dari pusat (kebalikan dari a = R0·θ + PITCH·θ²/4π). */
function sudutDari(a: number): number {
  const p = PITCH / (2 * Math.PI);
  return (-R0 + Math.sqrt(R0 * R0 + 2 * p * a)) / p;
}
const jari = (t: number) => R0 + (PITCH * t) / (2 * Math.PI);

const mat = {
  kanvas: new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0, bumpScale: 0.6 }),
  aluminium: new THREE.MeshStandardMaterial({ color: 0xc4c8ce, roughness: 0.32, metalness: 0.9 }),
  kuningan: new THREE.MeshStandardMaterial({ color: 0xd2a94e, roughness: 0.3, metalness: 1 }),
  karet: new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.9 }),
  merah: new THREE.MeshPhysicalMaterial({ color: 0xc41e1a, roughness: 0.35, clearcoat: 0.6 }),
};

/** Tenunan kanvas merah dengan garis putih dan tulisan, dilukis di kanvas 2D (warna + bump). */
function teksturKanvas(): { warna: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const w = 512;
  const h = 128;
  const buat = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    return [c, c.getContext("2d")!] as const;
  };
  const [cw, x] = buat();
  x.fillStyle = "#b51d19";
  x.fillRect(0, 0, w, h);
  // Benang lusi dan pakan
  for (let i = 0; i < w; i += 3) {
    x.fillStyle = i % 6 ? "rgba(0,0,0,.10)" : "rgba(255,255,255,.06)";
    x.fillRect(i, 0, 1, h);
  }
  for (let j = 0; j < h; j += 3) {
    x.fillStyle = j % 6 ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.05)";
    x.fillRect(0, j, w, 1);
  }
  // Garis putih dan tulisan di satu sisi selang
  x.fillStyle = "#f1efe8";
  x.fillRect(0, h * 0.18, w, 5);
  x.font = "bold 22px sans-serif";
  x.fillText("SELANG PEMADAM · 2,5\" · 20 M", 24, h * 0.42);

  const [cb, y] = buat();
  y.fillStyle = "#808080";
  y.fillRect(0, 0, w, h);
  for (let i = 0; i < w; i += 3) {
    y.fillStyle = i % 2 ? "#9a9a9a" : "#6a6a6a";
    y.fillRect(i, 0, 1, h);
  }
  for (let j = 0; j < h; j += 3) {
    y.fillStyle = "rgba(255,255,255,.12)";
    y.fillRect(0, j, w, 1);
  }

  const warna = new THREE.CanvasTexture(cw);
  warna.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(cb);
  for (const t of [warna, bump]) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
  }
  return { warna, bump };
}

/** Kopling (sambungan) aluminium bertelinga, dari profil yang diputar (lathe), sumbu +X. */
function kopling(): THREE.Group {
  const g = new THREE.Group();
  const profil = [
    [0, -0.07], [0.052, -0.07], [0.058, -0.05], [0.062, -0.02], [0.07, -0.015], [0.07, 0.02],
    [0.063, 0.025], [0.058, 0.06], [0.05, 0.075], [0, 0.075],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const badan = new THREE.Mesh(new THREE.LatheGeometry(profil, 40), mat.aluminium);
  badan.rotation.z = -Math.PI / 2;
  g.add(badan);
  for (const s of [1, -1]) {
    const telinga = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.035, 0.05), mat.aluminium);
    telinga.position.set(0.02, 0, 0.085 * s);
    g.add(telinga);
  }
  const cincin = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.008, 10, 40), mat.karet);
  cincin.rotation.y = Math.PI / 2;
  cincin.position.x = 0.07;
  g.add(cincin);
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
  });
  return g;
}

/** Nozel (pipa pancar) aluminium dengan pegangan karet dan ujung kuningan, sumbu +X, ujung di x = 0.62. */
function nozel(): THREE.Group {
  const g = new THREE.Group();
  const profil = [
    [0, 0], [0.06, 0], [0.065, 0.05], [0.055, 0.1], [0.05, 0.35], [0.034, 0.52], [0.03, 0.56], [0, 0.56],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const badan = new THREE.Mesh(new THREE.LatheGeometry(profil, 36), mat.aluminium);
  badan.rotation.z = -Math.PI / 2;
  g.add(badan);
  const pegangan = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.066, 0.16, 28), mat.karet);
  pegangan.rotation.z = Math.PI / 2;
  pegangan.position.x = 0.22;
  g.add(pegangan);
  for (let i = 0; i < 5; i++) {
    const alur = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.006, 6, 28), mat.karet);
    alur.rotation.y = Math.PI / 2;
    alur.position.x = 0.15 + i * 0.035;
    g.add(alur);
  }
  const ujung = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.032, 0.07, 24), mat.kuningan);
  ujung.rotation.z = Math.PI / 2;
  ujung.position.x = 0.59;
  g.add(ujung);
  // Tuas pembuka aliran
  const tuas = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.03), mat.merah);
  tuas.position.set(0.1, 0.075, 0);
  tuas.rotation.z = 0.25;
  g.add(tuas);
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
  });
  return g;
}

/** Penanda jarak di tanah ("5 m", "10 m", ...) sebagai sprite teks. */
function penandaJarak(teks: string): THREE.Sprite {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;
  const x = c.getContext("2d")!;
  x.fillStyle = "rgba(29,31,34,.85)";
  x.beginPath();
  x.roundRect(6, 10, 116, 44, 22);
  x.fill();
  x.fillStyle = "#fff";
  x.font = "bold 26px sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(teks, 64, 33);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, opacity: 0 }));
  s.scale.set(0.34, 0.17, 1);
  return s;
}

/** Semburan air: partikel yang dihitung seluruhnya di GPU (posisi dari waktu dan benih, tanpa loop per partikel di CPU). */
function semburan(): { titik: THREE.Points; seragam: { uWaktu: { value: number }; uKuat: { value: number }; uAsal: { value: THREE.Vector3 }; uArah: { value: THREE.Vector3 } } } {
  const n = 900;
  const benih = new Float32Array(n * 3);
  for (let i = 0; i < benih.length; i++) benih[i] = Math.random();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute("aBenih", new THREE.BufferAttribute(benih, 3));
  const seragam = {
    uWaktu: { value: 0 },
    uKuat: { value: 0 },
    uAsal: { value: new THREE.Vector3() },
    uArah: { value: new THREE.Vector3(1, 0, 0) },
  };
  const bahan = new THREE.ShaderMaterial({
    uniforms: seragam,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      attribute vec3 aBenih;
      uniform float uWaktu;
      uniform float uKuat;
      uniform vec3 uAsal;
      uniform vec3 uArah;
      varying float vUmur;
      void main() {
        float t = fract(uWaktu * 0.85 + aBenih.x);
        vUmur = t;
        vec3 samping = normalize(cross(uArah, vec3(0.0, 1.0, 0.0)));
        vec3 sebar = samping * (aBenih.y - 0.5) * 0.55 + vec3(0.0, 1.0, 0.0) * (aBenih.z - 0.5) * 0.35;
        float laju = 4.2 * uKuat;
        vec3 p = uAsal + uArah * laju * t + sebar * t * t * 1.4 + vec3(0.0, -2.6, 0.0) * t * t;
        p.y = max(p.y, 0.01);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uKuat * (14.0 + 26.0 * t) * (1.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uKuat;
      varying float vUmur;
      void main() {
        vec2 d = gl_PointCoord - 0.5;
        float r = length(d);
        if (r > 0.5 || uKuat < 0.01) discard;
        float a = smoothstep(0.5, 0.1, r) * (1.0 - vUmur) * 0.55 * uKuat;
        gl_FragColor = vec4(mix(vec3(0.85, 0.95, 1.0), vec3(0.45, 0.7, 0.95), vUmur), a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const titik = new THREE.Points(geo, bahan);
  titik.frustumCulled = false; // posisi dihitung di shader; bola batas CPU tidak tahu
  return { titik, seragam };
}

export function bangunSelangKeluar(): ModelPompa {
  const akar = new THREE.Group();
  const bagian: Bagian[] = [];
  const { warna, bump } = teksturKanvas();
  mat.kanvas.map = warna;
  mat.kanvas.bumpMap = bump;

  // ---------- Selang: geometri sendiri yang diperbarui hanya saat bentuknya berubah ----------
  const posisi = new Float32Array(M * (K + 1) * 3);
  const uv = new Float32Array(M * (K + 1) * 2);
  const indeks: number[] = [];
  for (let i = 0; i < M; i++) {
    for (let k = 0; k <= K; k++) {
      uv[(i * (K + 1) + k) * 2] = (i / (M - 1)) * 26; // pola tenunan berulang sepanjang selang
      uv[(i * (K + 1) + k) * 2 + 1] = k / K;
      if (i < M - 1 && k < K) {
        const a = i * (K + 1) + k;
        const b = a + K + 1;
        indeks.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geoSelang = new THREE.BufferGeometry();
  geoSelang.setAttribute("position", new THREE.BufferAttribute(posisi, 3).setUsage(THREE.DynamicDrawUsage));
  geoSelang.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geoSelang.setIndex(indeks);
  const selang = new THREE.Mesh(geoSelang, mat.kanvas);
  selang.castShadow = selang.receiveShadow = true;
  selang.userData.label = "Selang kanvas 30 m (pipih saat kosong)";

  const gSelang = new THREE.Group();
  gSelang.name = "Selang kanvas";
  gSelang.add(selang);
  akar.add(gSelang);
  bagian.push({ nama: "Selang kanvas", objek: gSelang, rakit: new THREE.Vector3(), geserBuka: new THREE.Vector3() });

  const koplingA = kopling();
  koplingA.name = "Kopling A";
  koplingA.userData.label = "Kopling (sambungan) ke pompa";
  const koplingB = kopling();
  koplingB.name = "Kopling B";
  koplingB.userData.label = "Kopling ujung, tempat nozel dipasang";
  const pipaPancar = nozel();
  pipaPancar.name = "Nozel";
  pipaPancar.userData.label = "Nozel (pipa pancar) dengan tuas aliran";
  akar.add(koplingA, koplingB, pipaPancar);

  const { titik: air, seragam } = semburan();
  akar.add(air);

  const penanda = [5, 10, 15, 20].map((m) => {
    const s = penandaJarak(`${m} m`);
    s.position.set(X0 + (m / 20) * L, 0.2, 0.28);
    akar.add(s);
    return { s, jarak: (m / 20) * L };
  });

  // Titik dan bingkai sepanjang selang, dipakai ulang tiap pembaruan (tanpa alokasi di loop).
  const P = Array.from({ length: M }, () => new THREE.Vector3());
  const T = new THREE.Vector3();
  const W = new THREE.Vector3();
  const N = new THREE.Vector3();
  const Z = new THREE.Vector3(0, 0, 1);
  const X = new THREE.Vector3(1, 0, 0);
  const q = new THREE.Quaternion();
  const sementara = new THREE.Vector3();
  let uLama = -1;
  let waktu = 0;

  const poseNozelSimpan = { p: new THREE.Vector3(X0 + 0.15, 0.07, 0.5), q: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.5) };

  function perbarui(u: number) {
    const gelar = u * L; // panjang yang sudah tergelar
    const isi = THREE.MathUtils.smoothstep(u, 0.82, 0.97); // selang menggembung berisi air
    const a = THREE.MathUtils.lerp(LEBAR / 2, LEBAR * 0.34, isi);
    const b = THREE.MathUtils.lerp(TEBAL / 2, LEBAR * 0.32, isi);
    const n = THREE.MathUtils.lerp(6, 2, isi); // penampang kotak membulat -> elips
    const sisa = Math.max(L - gelar, 1e-4);
    const tSisa = sudutDari(sisa);
    const rSisa = jari(tSisa);
    const cx = X0 + gelar;
    const cy = rSisa + TEBAL / 2;

    for (let i = 0; i < M; i++) {
      const s = (i / (M - 1)) * L;
      if (s <= gelar) {
        P[i].set(X0 + s, b, 0);
      } else {
        const t = sudutDari(L - s);
        const phi = -Math.PI / 2 + (tSisa - t);
        const r = jari(t);
        P[i].set(cx + r * Math.cos(phi), cy + r * Math.sin(phi), 0);
      }
    }

    const pos = geoSelang.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < M; i++) {
      const sb = P[Math.max(i - 1, 0)];
      const ss = P[Math.min(i + 1, M - 1)];
      T.subVectors(ss, sb).normalize();
      W.copy(Z).addScaledVector(T, -Z.dot(T)).normalize(); // lebar selang: horizontal, tegak lurus arah
      N.crossVectors(W, T).normalize(); // tebal selang
      for (let k = 0; k <= K; k++) {
        const th = (k / K) * Math.PI * 2;
        const c = Math.cos(th);
        const sn = Math.sin(th);
        const xk = a * Math.sign(c) * Math.abs(c) ** (2 / n);
        const yk = b * Math.sign(sn) * Math.abs(sn) ** (2 / n);
        sementara.copy(P[i]).addScaledVector(W, xk).addScaledVector(N, yk);
        pos.setXYZ(i * (K + 1) + k, sementara.x, sementara.y, sementara.z);
      }
    }
    pos.needsUpdate = true;
    geoSelang.computeVertexNormals();
    geoSelang.computeBoundingSphere();

    // Kopling A di ujung luar (selalu di tanah, menghadap -X)
    koplingA.position.set(X0 - 0.07, b + 0.005, 0);
    koplingA.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

    // Kopling B mengikuti ujung dalam dan arah selang di sana
    T.subVectors(P[M - 1], P[M - 3]).normalize();
    koplingB.position.copy(P[M - 1]).addScaledVector(T, 0.06);
    koplingB.quaternion.setFromUnitVectors(X, T);

    // Nozel: tergeletak di samping gulungan, lalu berpindah ke ujung selang dan sedikit menengadah
    const pasang = THREE.MathUtils.smoothstep(u, 0.7, 0.93);
    const pAkhir = sementara.copy(koplingB.position).addScaledVector(T, 0.06);
    q.setFromUnitVectors(X, T).multiply(new THREE.Quaternion().setFromAxisAngle(Z, 0.2));
    pipaPancar.position.lerpVectors(poseNozelSimpan.p, pAkhir, pasang);
    pipaPancar.position.y += Math.sin(pasang * Math.PI) * 0.35; // terangkat saat berpindah
    pipaPancar.quaternion.slerpQuaternions(poseNozelSimpan.q, q, pasang);

    for (const pd of penanda) (pd.s.material as THREE.SpriteMaterial).opacity = THREE.MathUtils.clamp((gelar - pd.jarak + 0.15) / 0.3, 0, 1) * (1 - isi * 0.6);
  }

  return {
    akar,
    bagian,
    perFrame(buka, dt) {
      waktu += dt;
      if (Math.abs(buka - uLama) > 1e-4) {
        perbarui(buka);
        uLama = buka;
      }
      // Semburan: hanya saat selang sudah tergelar penuh dan nozel terpasang
      const kuat = THREE.MathUtils.smoothstep(buka, 0.93, 1);
      seragam.uKuat.value = kuat;
      seragam.uWaktu.value = waktu;
      if (kuat > 0) {
        pipaPancar.updateMatrixWorld();
        seragam.uAsal.value.set(0.64, 0, 0).applyMatrix4(pipaPancar.matrixWorld);
        seragam.uArah.value.set(1, 0, 0).applyQuaternion(pipaPancar.quaternion).normalize();
      }
    },
    buang() {
      akar.traverse((o) => {
        if (o instanceof THREE.Sprite) {
          // Geometri sprite dipakai bersama oleh semua Sprite di Three.js: hanya bahan dan teksturnya yang dibuang.
          o.material.map?.dispose();
          o.material.dispose();
        } else if (o instanceof THREE.Points) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        } else if ((o as THREE.Mesh).isMesh) {
          (o as THREE.Mesh).geometry.dispose();
        }
      });
      warna.dispose();
      bump.dispose();
    },
  };
}

/** Bahan dipakai bersama antar-pemasangan; dibuang saat penampil ditutup. */
export function buangBahanSelang() {
  for (const m of Object.values(mat)) m.dispose();
}
