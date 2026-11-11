import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { Bagian, ModelPompa } from "./bangunPompaJinjing";

/*
 * Model 3D prosedural sumur bor di lahan gambut: balok tanah berlapis (gambut, lempung, pasir berair),
 * pipa PVC yang menembus sampai lapisan berair dengan saringan berlubang di ujung bawah, dan di atas tanah
 * cor beton, katup bola, kopling, tutup berantai, patok penanda, serta selang hisap biru menuju pompa.
 * "Buka" membelah tanah di bidang x = 0: separuh kiri bergeser menjauh sehingga penampang lapisan,
 * bagian dalam pipa, dan air tanah terlihat. Satuan 1 kira-kira 40 cm (kedalaman dipadatkan).
 */

const LEBAR = 2.4; // x
const DALAM = 1.6; // z
const LAPISAN = [
  { nama: "Gambut", label: "Lapisan gambut (mudah terbakar saat kering)", atas: 0, bawah: -0.72, tekstur: "gambut" },
  { nama: "Lempung", label: "Lapisan lempung", atas: -0.72, bawah: -1.0, tekstur: "lempung" },
  { nama: "Pasir berair", label: "Pasir berair (akuifer), sumber air sumur", atas: -1.0, bawah: -1.62, tekstur: "pasir" },
] as const;
const MUKA_AIR = -1.04;
const R_PIPA = 0.055;
const ATAS_PIPA = 0.36;
const BAWAH_PIPA = -1.52;
const SARINGAN = -1.16; // pipa berlubang dari sini ke bawah
const GESER_BUKA = 1.35;

type Jenis = (typeof LAPISAN)[number]["tekstur"] | "rumput";

/** Tekstur tanah dilukis di kanvas: gambut berserat, lempung berlapis, pasir berbintik. */
function teksturTanah(jenis: Jenis): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d")!;
  const acak = (() => {
    let s = jenis.length * 9973;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();
  if (jenis === "gambut") {
    x.fillStyle = "#3b2a1d";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      // serat dan akar halus
      x.strokeStyle = `rgba(${120 + acak() * 60},${80 + acak() * 40},${40 + acak() * 20},${0.25 + acak() * 0.35})`;
      x.lineWidth = 0.6 + acak() * 1.2;
      const px = acak() * 256;
      const py = acak() * 256;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px + (acak() - 0.5) * 26, py + (acak() - 0.3) * 10);
      x.stroke();
    }
    for (let i = 0; i < 120; i++) {
      x.fillStyle = `rgba(20,14,10,${0.3 + acak() * 0.4})`;
      x.fillRect(acak() * 256, acak() * 256, 2 + acak() * 5, 2 + acak() * 3);
    }
  } else if (jenis === "lempung") {
    x.fillStyle = "#7e7b74";
    x.fillRect(0, 0, 256, 256);
    for (let j = 0; j < 256; j += 4 + Math.floor(acak() * 6)) {
      x.fillStyle = `rgba(${90 + acak() * 50},${85 + acak() * 45},${80 + acak() * 40},.5)`;
      x.fillRect(0, j, 256, 2 + acak() * 3);
    }
  } else if (jenis === "pasir") {
    x.fillStyle = "#b39a6c";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3500; i++) {
      const g = 120 + acak() * 110;
      x.fillStyle = `rgba(${g},${g * 0.85},${g * 0.6},.6)`;
      x.fillRect(acak() * 256, acak() * 256, 1.5, 1.5);
    }
    // jenuh air: semburat biru
    x.fillStyle = "rgba(70,120,170,.22)";
    x.fillRect(0, 0, 256, 256);
  } else {
    x.fillStyle = "#5d6b33";
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2500; i++) {
      x.fillStyle = acak() > 0.5 ? "rgba(140,130,60,.5)" : "rgba(40,60,25,.5)";
      x.fillRect(acak() * 256, acak() * 256, 2, 2);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Pipa PVC: dibuat sebagai dua separuh silinder supaya bisa ikut terbelah bersama tanah. */
function separuhPipa(r: number, y0: number, y1: number, sisiKiri: boolean, bahan: THREE.Material) {
  // Sudut 0 di +Z pada CylinderGeometry; separuh kiri (x < 0) mulai di π.
  const g = new THREE.CylinderGeometry(r, r, y1 - y0, 32, 1, true, sisiKiri ? Math.PI : 0, Math.PI);
  const m = new THREE.Mesh(g, bahan);
  m.position.y = (y0 + y1) / 2;
  m.castShadow = m.receiveShadow = true;
  return m;
}

/** Air di dalam pipa dan muka air tanah: gradasi dan riak yang bergerak naik (dihitung di GPU). */
function bahanAir() {
  const seragam = { uWaktu: { value: 0 }, uAlir: { value: 0 } };
  const m = new THREE.ShaderMaterial({
    uniforms: seragam,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        vUv = uv;
        vPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uWaktu;
      uniform float uAlir;
      varying vec2 vUv;
      varying vec3 vPos;
      void main() {
        float riak = sin(vPos.y * 38.0 - uWaktu * (2.0 + uAlir * 6.0)) * 0.5 + 0.5;
        float kilau = smoothstep(0.75, 1.0, riak) * 0.35;
        vec3 warna = mix(vec3(0.16, 0.42, 0.7), vec3(0.45, 0.72, 0.95), kilau + vUv.y * 0.15);
        gl_FragColor = vec4(warna, 0.72);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  return { m, seragam };
}

/** Sprite teks untuk patok penanda. */
function papanNama(teks: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 96;
  const x = c.getContext("2d")!;
  x.fillStyle = "#ff6a1f";
  x.fillRect(0, 0, 128, 96);
  x.fillStyle = "#fff";
  x.font = "bold 34px sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(teks, 64, 40);
  x.font = "bold 16px sans-serif";
  x.fillText("SUMUR BOR", 64, 74);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function bangunSumurBor(): ModelPompa {
  const akar = new THREE.Group();
  const bagian: Bagian[] = [];
  const tekstur: THREE.Texture[] = [];
  const bahan: THREE.Material[] = [];
  const pakai = <T extends THREE.Material>(m: T) => (bahan.push(m), m);

  // Separuh kiri bergerak saat dibuka, separuh kanan diam.
  const kiri = new THREE.Group();
  kiri.name = "Tanah sisi kiri";
  const kanan = new THREE.Group();
  kanan.name = "Tanah sisi kanan";
  akar.add(kiri, kanan);
  bagian.push(
    { nama: kiri.name, objek: kiri, rakit: new THREE.Vector3(), geserBuka: new THREE.Vector3(-GESER_BUKA, -0.04, 0) },
    { nama: kanan.name, objek: kanan, rakit: new THREE.Vector3(), geserBuka: new THREE.Vector3() },
  );

  // ---------- Lapisan tanah ----------
  for (const l of LAPISAN) {
    const t = teksturTanah(l.tekstur);
    t.repeat.set(1.4, (l.atas - l.bawah) * 1.6);
    tekstur.push(t);
    const m = pakai(new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, metalness: 0 }));
    for (const sisi of [kiri, kanan]) {
      const blok = new THREE.Mesh(new THREE.BoxGeometry(LEBAR / 2, l.atas - l.bawah, DALAM), m);
      blok.position.set(sisi === kiri ? -LEBAR / 4 : LEBAR / 4, (l.atas + l.bawah) / 2, 0);
      blok.receiveShadow = true;
      blok.castShadow = true;
      blok.userData.label = l.label;
      sisi.add(blok);
    }
  }

  // Lapisan permukaan (serasah dan rumput) tipis di atas gambut
  const tRumput = teksturTanah("rumput");
  tekstur.push(tRumput);
  const mRumput = pakai(new THREE.MeshStandardMaterial({ map: tRumput, roughness: 1 }));
  for (const sisi of [kiri, kanan]) {
    const lapis = new THREE.Mesh(new THREE.BoxGeometry(LEBAR / 2, 0.035, DALAM), mRumput);
    lapis.position.set(sisi === kiri ? -LEBAR / 4 : LEBAR / 4, 0.0175, 0);
    lapis.receiveShadow = true;
    lapis.userData.label = "Serasah dan rumput kering musim kemarau";
    sisi.add(lapis);
  }

  // Rumput: satu InstancedMesh per sisi (satu draw call untuk ratusan helai), hijau bercampur kering.
  const helai = new THREE.ConeGeometry(0.012, 0.13, 3);
  helai.translate(0, 0.065, 0);
  const mHelai = pakai(new THREE.MeshStandardMaterial({ roughness: 0.9 }));
  const boneka = new THREE.Object3D();
  const warnaHelai = new THREE.Color();
  for (const sisi of [kiri, kanan]) {
    const n = 380;
    const rumput = new THREE.InstancedMesh(helai, mHelai, n);
    let j = 0;
    for (let i = 0; i < n * 3 && j < n; i++) {
      const x = (Math.random() * LEBAR) / 2 - (sisi === kiri ? LEBAR / 2 : 0);
      const z = (Math.random() - 0.5) * DALAM * 0.96;
      if (Math.hypot(x, z) < 0.3) continue; // sekitar cor beton bersih
      boneka.position.set(x, 0.035, z);
      boneka.rotation.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, (Math.random() - 0.5) * 0.5);
      boneka.scale.setScalar(0.6 + Math.random() * 0.9);
      boneka.updateMatrix();
      rumput.setMatrixAt(j, boneka.matrix);
      rumput.setColorAt(j, warnaHelai.setHSL(0.13 + Math.random() * 0.12, 0.45, 0.28 + Math.random() * 0.18));
      j++;
    }
    rumput.count = j;
    rumput.castShadow = true;
    rumput.userData.label = "Vegetasi kering di atas gambut";
    sisi.add(rumput);
  }

  // ---------- Pipa PVC dan saringan ----------
  const mPvc = pakai(new THREE.MeshStandardMaterial({ color: 0xdfe3e6, roughness: 0.45, metalness: 0, side: THREE.DoubleSide }));
  const tSaring = (() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    const x = c.getContext("2d")!;
    x.fillStyle = "#fff";
    x.fillRect(0, 0, 64, 64);
    x.fillStyle = "#000";
    for (let i = 0; i < 4; i++) x.fillRect(8 + i * 14, 26, 8, 12); // celah saringan
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 9);
    return t;
  })();
  tekstur.push(tSaring);
  const mSaring = pakai(new THREE.MeshStandardMaterial({ color: 0xdfe3e6, roughness: 0.5, alphaMap: tSaring, alphaTest: 0.5, side: THREE.DoubleSide }));

  for (const sisiKiri of [true, false]) {
    const sisi = sisiKiri ? kiri : kanan;
    const pipa = separuhPipa(R_PIPA, SARINGAN, 0, sisiKiri, mPvc);
    pipa.userData.label = "Pipa PVC 2 inci";
    const saring = separuhPipa(R_PIPA, BAWAH_PIPA, SARINGAN, sisiKiri, mSaring);
    saring.userData.label = "Saringan: pipa berlubang tempat air masuk";
    sisi.add(pipa, saring);
  }
  // Ujung bawah runcing (masuk ke pasir)
  const ujung = new THREE.Mesh(new THREE.ConeGeometry(R_PIPA, 0.12, 24), mPvc);
  ujung.rotation.x = Math.PI;
  ujung.position.y = BAWAH_PIPA - 0.06;
  ujung.userData.label = "Ujung pipa";
  kanan.add(ujung);

  // ---------- Air: kolom di dalam pipa dan garis muka air tanah di penampang ----------
  const { m: mAir, seragam } = bahanAir();
  bahan.push(mAir);
  const kolom = new THREE.Mesh(new THREE.CylinderGeometry(R_PIPA * 0.86, R_PIPA * 0.86, MUKA_AIR - BAWAH_PIPA, 24), mAir);
  kolom.position.y = (MUKA_AIR + BAWAH_PIPA) / 2;
  kolom.renderOrder = 2;
  kolom.userData.label = "Air tanah di dalam pipa";
  kanan.add(kolom);
  // Zona jenuh air di penampang: tersembunyi di dalam tanah kiri saat tertutup, tampak saat dibelah.
  const tinggiJenuh = MUKA_AIR - LAPISAN[2].bawah;
  const garisAir = new THREE.Mesh(new THREE.PlaneGeometry(DALAM, tinggiJenuh), mAir);
  garisAir.rotation.y = -Math.PI / 2;
  garisAir.position.set(-0.003, (MUKA_AIR + LAPISAN[2].bawah) / 2, 0);
  garisAir.renderOrder = 1;
  garisAir.userData.label = "Muka air tanah";
  kanan.add(garisAir);

  // ---------- Di atas tanah ----------
  const atas = new THREE.Group();
  atas.name = "Kepala sumur";
  kanan.add(atas);
  const mBeton = pakai(new THREE.MeshStandardMaterial({ color: 0x9c9890, roughness: 0.92 }));
  const cor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.12, 40), mBeton);
  cor.position.y = 0.06;
  cor.castShadow = cor.receiveShadow = true;
  cor.userData.label = "Cor beton penahan pipa";
  atas.add(cor);

  const mMerah = pakai(new THREE.MeshPhysicalMaterial({ color: 0xc41e1a, roughness: 0.35, clearcoat: 0.6 }));
  const mLogam = pakai(new THREE.MeshStandardMaterial({ color: 0xc4c8ce, roughness: 0.3, metalness: 0.9 }));
  const mKuningan = pakai(new THREE.MeshStandardMaterial({ color: 0xd2a94e, roughness: 0.3, metalness: 1 }));

  const katup = new THREE.Group();
  katup.position.y = 0.3;
  katup.userData.label = "Katup bola (buka/tutup aliran)";
  const badanKatup = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.13, 0.15, 3, 0.03), mKuningan);
  badanKatup.castShadow = true;
  const tuas = new THREE.Mesh(new RoundedBoxGeometry(0.26, 0.025, 0.05, 2, 0.01), mMerah);
  tuas.position.set(0.1, 0.09, 0);
  tuas.castShadow = true;
  katup.add(badanKatup, tuas);
  atas.add(katup);

  // Pipa di atas tanah utuh (tidak ikut terbelah), menembus katup sampai kopling.
  const pipaAtas = new THREE.Mesh(new THREE.CylinderGeometry(R_PIPA, R_PIPA, ATAS_PIPA + 0.16, 32), mPvc);
  pipaAtas.position.y = (ATAS_PIPA + 0.16) / 2;
  pipaAtas.castShadow = true;
  pipaAtas.userData.label = "Pipa PVC 2 inci";
  atas.add(pipaAtas);

  const kepalaKopling = new THREE.Mesh(
    new THREE.LatheGeometry(
      [[0, 0], [0.066, 0], [0.072, 0.02], [0.072, 0.06], [0.06, 0.08], [0, 0.08]].map(([r, y]) => new THREE.Vector2(r, y)),
      36,
    ),
    mLogam,
  );
  kepalaKopling.position.y = ATAS_PIPA + 0.16;
  kepalaKopling.castShadow = true;
  kepalaKopling.userData.label = "Kopling untuk selang hisap pompa";
  atas.add(kepalaKopling);

  // Selang hisap biru bergelombang dari kopling ke arah pompa (di luar bingkai)
  const jalur = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, ATAS_PIPA + 0.24, 0),
    new THREE.Vector3(0.1, ATAS_PIPA + 0.36, 0.05),
    new THREE.Vector3(0.45, 0.28, 0.25),
    new THREE.Vector3(0.85, 0.07, 0.42),
    new THREE.Vector3(1.15, 0.06, 0.55),
  ]);
  const geoHisap = new THREE.TubeGeometry(jalur, 140, 0.05, 16);
  // Gelombang selang: ubah jari-jari tiap cincin menurut posisinya
  {
    const pos = geoHisap.attributes.position;
    const pusat = new THREE.Vector3();
    const v = new THREE.Vector3();
    for (let i = 0; i <= 140; i++) {
      jalur.getPointAt(i / 140, pusat);
      const skala = 1 + 0.12 * Math.sin(i * 1.6);
      for (let k = 0; k <= 16; k++) {
        const idx = i * 17 + k;
        v.fromBufferAttribute(pos, idx).sub(pusat).multiplyScalar(skala).add(pusat);
        pos.setXYZ(idx, v.x, v.y, v.z);
      }
    }
    geoHisap.computeVertexNormals();
  }
  const hisap = new THREE.Mesh(geoHisap, pakai(new THREE.MeshStandardMaterial({ color: 0x2b7be4, roughness: 0.42 })));
  hisap.castShadow = true;
  hisap.userData.label = "Selang hisap ke pompa jinjing";
  atas.add(hisap);

  // Patok penanda
  const mKayu = pakai(new THREE.MeshStandardMaterial({ color: 0x7a5434, roughness: 0.85 }));
  const patok = new THREE.Group();
  patok.position.set(-0.55, 0, -0.45);
  patok.userData.label = "Patok penanda lokasi sumur";
  const tiang = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), mKayu);
  tiang.position.y = 0.3;
  tiang.castShadow = true;
  const tPapan = papanNama("SB-01");
  tekstur.push(tPapan);
  const papan = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.22, 0.02), [mKayu, mKayu, mKayu, mKayu, pakai(new THREE.MeshStandardMaterial({ map: tPapan, roughness: 0.6 })), mKayu]);
  papan.position.y = 0.52;
  papan.rotation.y = 0.5;
  papan.castShadow = true;
  patok.add(tiang, papan);
  kiri.add(patok);

  return {
    akar,
    bagian,
    perFrame(buka, dt) {
      for (const b of bagian) b.objek.position.copy(b.rakit).addScaledVector(b.geserBuka, buka);
      seragam.uWaktu.value += dt;
      seragam.uAlir.value = buka;
    },
    buang() {
      akar.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      helai.dispose();
      for (const t of tekstur) t.dispose();
      for (const m of bahan) m.dispose();
    },
  };
}
