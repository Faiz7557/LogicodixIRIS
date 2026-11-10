import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/*
 * Model 3D prosedural pompa jinjing (pompa pemadam portabel bermesin bensin), mengikuti foto referensi:
 * alas hitam, rangka pipa merah dengan pegangan, mesin dengan tangki merah dan penutup starter bersirip,
 * rumah pompa merah dengan kopling kuningan, serta selang hisap biru bergelombang dengan saringan putih.
 * Satuan kira-kira 1 = 40 cm. Sumbu: -x sisi starter, +x sisi pompa, +z depan, +y atas.
 *
 * Tiap bagian adalah Group dengan posisi rakit dan `geserBuka` (posisi saat mesin dibuka / terurai).
 */

export interface Bagian {
  nama: string;
  objek: THREE.Object3D;
  rakit: THREE.Vector3;
  geserBuka: THREE.Vector3;
}

export interface ModelPompa {
  akar: THREE.Group;
  bagian: Bagian[];
  /** Dipanggil tiap frame: `buka` 0 (rakit) sampai 1 (terurai), `dt` detik. */
  perFrame: (buka: number, dt: number) => void;
  buang: () => void;
}

const mat = {
  merah: new THREE.MeshPhysicalMaterial({ color: 0xc41e1a, roughness: 0.32, metalness: 0.15, clearcoat: 0.7, clearcoatRoughness: 0.2 }),
  merahTua: new THREE.MeshStandardMaterial({ color: 0x8f1512, roughness: 0.45, metalness: 0.2 }),
  hitam: new THREE.MeshStandardMaterial({ color: 0x1d1f22, roughness: 0.62, metalness: 0.1 }),
  karet: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.9, metalness: 0 }),
  aluminium: new THREE.MeshStandardMaterial({ color: 0xb9bdc3, roughness: 0.38, metalness: 0.85 }),
  baja: new THREE.MeshStandardMaterial({ color: 0x55595f, roughness: 0.5, metalness: 0.8 }),
  kuningan: new THREE.MeshStandardMaterial({ color: 0xd2a94e, roughness: 0.28, metalness: 1 }),
  biru: new THREE.MeshStandardMaterial({ color: 0x2b7be4, roughness: 0.42, metalness: 0.05 }),
  putih: new THREE.MeshStandardMaterial({ color: 0xf1f0ea, roughness: 0.5, metalness: 0 }),
  oranye: new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.45, metalness: 0 }),
  kuning: new THREE.MeshStandardMaterial({ color: 0xf2b417, roughness: 0.6, metalness: 0, side: THREE.DoubleSide }),
};

function mesh(geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const me = new THREE.Mesh(geo, m);
  me.position.set(x, y, z);
  me.castShadow = true;
  me.receiveShadow = true;
  return me;
}

/** Silinder dengan sumbu X (bawaan Three.js bersumbu Y). */
function silinderX(r: number, panjang: number, m: THREE.Material, seg = 40): THREE.Mesh {
  const g = new THREE.CylinderGeometry(r, r, panjang, seg);
  g.rotateZ(Math.PI / 2);
  return mesh(g, m);
}

function silinderZ(r: number, panjang: number, m: THREE.Material, seg = 32): THREE.Mesh {
  const g = new THREE.CylinderGeometry(r, r, panjang, seg);
  g.rotateX(Math.PI / 2);
  return mesh(g, m);
}

function bagianBaru(nama: string, rakit: [number, number, number], geser: [number, number, number]): Bagian {
  const g = new THREE.Group();
  g.name = nama;
  g.position.set(...rakit);
  return { nama, objek: g, rakit: new THREE.Vector3(...rakit), geserBuka: new THREE.Vector3(...geser) };
}

/** Pipa dengan sudut membulat dari daftar titik sudut. */
function pipaSudut(titik: THREE.Vector3[], r: number, m: THREE.Material, bulat = 0.12): THREE.Mesh {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < titik.length - 1; i++) {
    const a = titik[i];
    const b = titik[i + 1];
    const awal = i === 0 ? a : a.clone().lerp(b, Math.min(bulat / a.distanceTo(b), 0.5));
    const akhir = i === titik.length - 2 ? b : b.clone().lerp(a, Math.min(bulat / a.distanceTo(b), 0.5));
    if (i > 0) {
      const sebelum = titik[i - 1];
      const masuk = a.clone().lerp(sebelum, Math.min(bulat / a.distanceTo(sebelum), 0.5));
      path.add(new THREE.QuadraticBezierCurve3(masuk, a, awal));
    }
    path.add(new THREE.LineCurve3(awal, akhir));
  }
  return mesh(new THREE.TubeGeometry(path, 160, r, 18, false), m);
}

export function bangunPompaJinjing(): ModelPompa {
  const akar = new THREE.Group();
  const bagian: Bagian[] = [];
  const tambah = (b: Bagian) => {
    bagian.push(b);
    akar.add(b.objek);
    return b.objek;
  };

  // ---------- Alas: pelat hitam, kaki karet, baut kuningan ----------
  const alas = tambah(bagianBaru("Alas", [0, 0, 0], [0, 0, 0]));
  alas.add(mesh(new RoundedBoxGeometry(2.0, 0.1, 1.35, 3, 0.03), mat.hitam, 0, 0.17, 0));
  for (const [x, z] of [[-0.88, -0.56], [0.88, -0.56], [-0.88, 0.56], [0.88, 0.56]]) {
    alas.add(mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.13, 20), mat.karet, x, 0.065, z));
    alas.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), mat.kuningan, x, 0.27, z));
  }

  // ---------- Blok mesin (inti, tidak bergeser) ----------
  const blok = tambah(bagianBaru("Blok mesin", [-0.3, 0, 0], [0, 0, 0]));
  blok.add(mesh(new RoundedBoxGeometry(0.72, 0.5, 0.62, 3, 0.05), mat.aluminium, 0, 0.5, 0));
  // sirip silinder di sisi belakang
  for (let i = 0; i < 6; i++) {
    blok.add(mesh(new THREE.BoxGeometry(0.42, 0.025, 0.2), mat.aluminium, 0.05, 0.36 + i * 0.06, -0.38));
  }
  // dudukan mesin
  blok.add(mesh(new THREE.BoxGeometry(0.78, 0.06, 0.7), mat.baja, 0, 0.25, 0));
  // busi dengan tutup oranye (terlihat di foto, sisi depan)
  blok.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 16), mat.putih, 0.12, 0.62, 0.36).rotateX(Math.PI / 2.4));
  blok.add(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.09, 16), mat.oranye, 0.12, 0.64, 0.44).rotateX(Math.PI / 2.4));
  // tuas gas hitam
  blok.add(mesh(new RoundedBoxGeometry(0.16, 0.05, 0.08, 2, 0.02), mat.hitam, -0.3, 0.72, 0.34));

  // Roda gila (flywheel): tersembunyi di balik penutup starter, berputar saat mesin dibuka.
  const rodaGila = new THREE.Group();
  rodaGila.position.set(-0.4, 0.5, 0);
  const cakram = silinderX(0.25, 0.06, mat.baja, 48);
  rodaGila.add(cakram);
  for (let i = 0; i < 12; i++) {
    const sirip = mesh(new THREE.BoxGeometry(0.05, 0.16, 0.025), mat.baja, -0.04, 0, 0);
    const sudut = (i / 12) * Math.PI * 2;
    sirip.position.set(-0.04, Math.cos(sudut) * 0.15, Math.sin(sudut) * 0.15);
    sirip.rotation.x = -sudut;
    rodaGila.add(sirip);
  }
  blok.add(rodaGila);

  // ---------- Tangki bensin merah dengan tutup hitam ----------
  const tangki = tambah(bagianBaru("Tangki bensin", [-0.25, 0.97, 0.02], [0, 0.62, 0]));
  tangki.add(mesh(new RoundedBoxGeometry(0.86, 0.3, 0.66, 4, 0.1), mat.merah));
  tangki.add(mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.08, 28), mat.hitam, 0.12, 0.18, -0.02));
  // panel merek hitam di sisi depan
  tangki.add(mesh(new RoundedBoxGeometry(0.42, 0.13, 0.02, 2, 0.01), mat.hitam, 0.12, 0.01, 0.335));
  tangki.add(mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 24), mat.merah, 0.0, 0.01, 0.35));

  // ---------- Penutup starter merah bersirip ----------
  const starter = tambah(bagianBaru("Penutup starter", [-0.8, 0.5, 0], [-0.6, 0, 0]));
  const tutup = silinderX(0.3, 0.16, mat.merah, 56);
  starter.add(tutup);
  starter.add(mesh(new THREE.TorusGeometry(0.3, 0.025, 12, 56).rotateY(Math.PI / 2), mat.merah, -0.08, 0, 0));
  // celah ventilasi melingkar
  for (let cincin = 0; cincin < 2; cincin++) {
    const r = 0.14 + cincin * 0.085;
    const jumlah = 14 + cincin * 8;
    for (let i = 0; i < jumlah; i++) {
      const s = (i / jumlah) * Math.PI * 2;
      const celah = mesh(new THREE.BoxGeometry(0.02, 0.055, 0.022), mat.hitam, -0.082, Math.cos(s) * r, Math.sin(s) * r);
      celah.rotation.x = -s;
      starter.add(celah);
    }
  }
  // lencana tengah
  const lencana = silinderX(0.085, 0.03, mat.hitam);
  lencana.position.x = -0.09;
  starter.add(lencana);
  const lencanaRing = mesh(new THREE.TorusGeometry(0.085, 0.01, 8, 32).rotateY(Math.PI / 2), mat.merah, -0.105, 0, 0);
  starter.add(lencanaRing);
  // gagang tarik starter
  starter.add(mesh(new RoundedBoxGeometry(0.06, 0.06, 0.22, 2, 0.02), mat.hitam, -0.06, -0.12, 0.36));

  // ---------- Filter udara hitam ----------
  const filter = tambah(bagianBaru("Filter udara", [-0.72, 0.86, -0.36], [-0.3, 0.15, -0.5]));
  filter.add(mesh(new RoundedBoxGeometry(0.3, 0.38, 0.34, 3, 0.04), mat.hitam));
  filter.add(mesh(new THREE.BoxGeometry(0.2, 0.1, 0.01), mat.putih, 0, 0.06, 0.172));

  // ---------- Knalpot ----------
  const knalpot = tambah(bagianBaru("Knalpot", [0.02, 0.56, -0.52], [0, 0.1, -0.5]));
  knalpot.add(mesh(new RoundedBoxGeometry(0.32, 0.2, 0.16, 3, 0.04), mat.baja));
  const pelindung = mesh(new RoundedBoxGeometry(0.36, 0.24, 0.02, 2, 0.008), mat.hitam, 0, 0, -0.09);
  knalpot.add(pelindung);

  // ---------- Rumah pompa merah dan saluran keluar kuningan ----------
  const pompa = tambah(bagianBaru("Rumah pompa", [0.42, 0.5, 0], [0.22, 0, 0]));
  pompa.add(silinderX(0.3, 0.24, mat.merah, 56));
  pompa.add(mesh(new THREE.TorusGeometry(0.3, 0.03, 12, 56).rotateY(Math.PI / 2), mat.merahTua, -0.12, 0, 0));
  // saluran keluar: pipa merah ke depan lalu kopling kuningan
  const leher = silinderZ(0.09, 0.22, mat.merah);
  leher.position.set(0.0, 0.18, 0.3);
  pompa.add(leher);
  const kopling = silinderZ(0.1, 0.14, mat.kuningan);
  kopling.position.set(0.0, 0.18, 0.47);
  pompa.add(kopling);
  pompa.add(mesh(new THREE.TorusGeometry(0.1, 0.02, 10, 28), mat.kuningan, 0, 0.18, 0.55));
  for (const s of [0, Math.PI]) {
    const kuping = mesh(new THREE.BoxGeometry(0.03, 0.05, 0.08), mat.kuningan, Math.cos(s) * 0.13, 0.18, 0.47);
    pompa.add(kuping);
  }
  // baut di dudukan pompa
  pompa.add(mesh(new THREE.BoxGeometry(0.3, 0.1, 0.5), mat.merahTua, 0, -0.27, 0));

  // Impeler kuningan di dalam rumah pompa: terlihat dan berputar saat penutup dibuka.
  const impeler = new THREE.Group();
  impeler.position.set(0.14, 0, 0);
  impeler.add(silinderX(0.22, 0.03, mat.kuningan, 48));
  for (let i = 0; i < 6; i++) {
    const sudu = new THREE.Group();
    sudu.rotation.x = (i / 6) * Math.PI * 2;
    const bilah = mesh(new THREE.BoxGeometry(0.08, 0.16, 0.025), mat.kuningan, 0.04, 0.1, 0);
    bilah.rotation.x = 0.5;
    sudu.add(bilah);
    impeler.add(sudu);
  }
  impeler.add(silinderX(0.05, 0.1, mat.baja));
  pompa.add(impeler);

  // ---------- Penutup pompa (sisi hisap) dengan baut dan selang biru ----------
  const penutup = tambah(bagianBaru("Penutup pompa dan selang hisap", [0.69, 0.5, 0], [0.62, 0.1, 0]));
  penutup.add(silinderX(0.3, 0.06, mat.merah, 56));
  for (let i = 0; i < 8; i++) {
    const s = (i / 8) * Math.PI * 2;
    penutup.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.04, 6).rotateZ(Math.PI / 2), mat.baja, 0.04, Math.cos(s) * 0.25, Math.sin(s) * 0.25));
  }
  const corong = silinderX(0.1, 0.12, mat.merah);
  corong.position.x = 0.09;
  penutup.add(corong);

  // Selang hisap bergelombang: TubeGeometry yang jari-jarinya naik-turun tiap beberapa ruas.
  const lintas = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.15, 0, 0),
    new THREE.Vector3(0.35, 0.05, -0.05),
    new THREE.Vector3(0.42, 0.45, -0.3),
    new THREE.Vector3(0.2, 0.85, -0.5),
    new THREE.Vector3(-0.3, 1.0, -0.42),
    new THREE.Vector3(-0.62, 1.02, -0.05),
  ]);
  const ruas = 360;
  const geoSelang = new THREE.TubeGeometry(lintas, ruas, 0.085, 20, false);
  const pos = geoSelang.attributes.position;
  const radial = 20 + 1;
  const pusat = new THREE.Vector3();
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const r = Math.floor(i / radial);
    lintas.getPointAt(Math.min(r / ruas, 1), pusat);
    v.fromBufferAttribute(pos, i).sub(pusat);
    const ujung = r < 6 || r > ruas - 6; // pangkal dan ujung polos
    v.multiplyScalar(ujung ? 1 : r % 6 < 3 ? 1.14 : 0.94);
    pos.setXYZ(i, pusat.x + v.x, pusat.y + v.y, pusat.z + v.z);
  }
  geoSelang.computeVertexNormals();
  penutup.add(mesh(geoSelang, mat.biru));
  // saringan putih di ujung selang
  const ujungSelang = lintas.getPointAt(1);
  const arah = lintas.getTangentAt(1);
  const saringan = new THREE.Group();
  saringan.position.copy(ujungSelang);
  saringan.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arah);
  saringan.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.12, 24), mat.hitam, 0, 0.04, 0));
  saringan.add(mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.24, 28), mat.putih, 0, 0.2, 0));
  for (let i = 0; i < 4; i++) {
    saringan.add(mesh(new THREE.TorusGeometry(0.128, 0.008, 6, 28).rotateX(Math.PI / 2), mat.hitam, 0, 0.12 + i * 0.05, 0));
  }
  saringan.add(mesh(new THREE.SphereGeometry(0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat.putih, 0, 0.32, 0));
  penutup.add(saringan);

  // ---------- Rangka pipa merah dengan pegangan karet ----------
  const rangka = tambah(bagianBaru("Rangka dan pegangan", [0, 0, 0], [0, 0.75, 0]));
  rangka.add(
    pipaSudut(
      [new THREE.Vector3(0.2, 0.22, 0.55), new THREE.Vector3(0.2, 1.42, 0.55), new THREE.Vector3(0.2, 1.42, -0.55), new THREE.Vector3(0.2, 0.22, -0.55)],
      0.045,
      mat.merah,
      0.2,
    ),
  );
  rangka.add(
    pipaSudut(
      [new THREE.Vector3(-0.85, 0.22, 0.55), new THREE.Vector3(-0.85, 0.9, 0.55), new THREE.Vector3(-0.85, 0.9, -0.55), new THREE.Vector3(-0.85, 0.22, -0.55)],
      0.035,
      mat.merah,
      0.15,
    ),
  );
  for (const z of [0.55, -0.55]) {
    rangka.add(mesh(new THREE.BoxGeometry(0.16, 0.05, 0.12), mat.merah, 0.2, 0.245, z));
    rangka.add(mesh(new THREE.BoxGeometry(0.14, 0.05, 0.1), mat.merah, -0.85, 0.245, z));
  }
  // pegangan karet bergerigi di tiang depan
  const pegangan = mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.4, 24), mat.karet, 0.2, 0.78, 0.55);
  rangka.add(pegangan);
  for (let i = 0; i < 7; i++) {
    rangka.add(mesh(new THREE.TorusGeometry(0.068, 0.01, 6, 24).rotateX(Math.PI / 2), mat.karet, 0.2, 0.62 + i * 0.053, 0.55));
  }

  // ---------- Label oli kuning (tanda di foto) ----------
  const label = tambah(bagianBaru("Label oli", [-0.95, 0.32, 0.45], [-0.15, 0, 0.1]));
  const kartu = mesh(new THREE.PlaneGeometry(0.16, 0.26), mat.kuning);
  kartu.rotation.set(0, -0.6, 0.12);
  label.add(kartu);

  let sudutRoda = 0;
  let sudutImpeler = 0;

  return {
    akar,
    bagian,
    perFrame(buka, dt) {
      // Ease in-out supaya bagian bergerak halus; bagian lebih jauh sedikit terlambat agar terasa berurutan.
      bagian.forEach((b, i) => {
        const t = THREE.MathUtils.clamp(buka * 1.25 - (i / bagian.length) * 0.25, 0, 1);
        const e = t * t * (3 - 2 * t);
        b.objek.position.copy(b.rakit).addScaledVector(b.geserBuka, e);
      });
      // Bagian dalam berputar pelan hanya saat terbuka.
      sudutRoda += dt * 2.2 * buka;
      sudutImpeler += dt * 3.2 * buka;
      rodaGila.rotation.x = sudutRoda;
      impeler.rotation.x = sudutImpeler;
    },
    buang() {
      akar.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
    },
  };
}

/** Bahan dipakai bersama semua model; dibuang terpisah saat penampil ditutup. */
export function buangBahan() {
  for (const m of Object.values(mat)) m.dispose();
}
