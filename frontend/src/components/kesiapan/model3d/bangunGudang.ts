import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { bangunPompaJinjing } from "./bangunPompaJinjing";

/*
 * Peta gudang alat MPA (pola peta kilang Sparekit): sketsa isometrik, dinding belakang dan kiri saja supaya isi terlihat.
 * Pompa jinjing dan selang keluar disimpan di dalam gudang; sumur bor ada di halaman bertanah gambut di sampingnya.
 * Tiap unit paket minimum digambar sebagai satu slot: utuh (berfungsi), abu-abu (rusak), atau kerangka kosong (kurang).
 * Satuan 1 = 1 m. Lantai gudang x -10..10, z -7..7, permukaan y = 0.
 */

export interface DataZona {
  kode: string;
  target: number;
  berfungsi: number;
  rusak: number;
}

export interface Zona {
  kode: string;
  /** Titik label di atas zona. */
  jangkar: THREE.Vector3;
  /** Kotak tak terlihat seluas zona, untuk deteksi arah kursor dan klik. */
  sasaran: THREE.Mesh;
}

export interface PetaGudang {
  akar: THREE.Group;
  zona: Zona[];
  buang: () => void;
}

/** Warna panas: hijau (sedikit kurang) ke kuning ke merah (banyak kurang). Sama dengan legenda di layar. */
export const SKALA_PANAS = ["#6aae4f", "#e9c43b", "#e2763a", "#c8442c"] as const;

export function warnaPanas(rasio: number): THREE.Color {
  const r = Math.min(Math.max(rasio, 0), 1) * (SKALA_PANAS.length - 1);
  const i = Math.min(Math.floor(r), SKALA_PANAS.length - 2);
  return new THREE.Color(SKALA_PANAS[i]).lerp(new THREE.Color(SKALA_PANAS[i + 1]), r - i);
}

// Batas jumlah slot yang digambar per barang; angka pada label tetap angka sebenarnya.
const MAKS_SLOT: Record<string, number> = { pompa_jinjing: 6, selang_keluar: 12, sumur_bor: 6 };

export function bangunGudang(data: DataZona[]): PetaGudang {
  const akar = new THREE.Group();
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const texs: THREE.Texture[] = [];
  const buangLain: (() => void)[] = [];

  const g = <T extends THREE.BufferGeometry>(x: T) => (geos.push(x), x);
  const m = <T extends THREE.Material>(x: T) => (mats.push(x), x);
  const std = (color: THREE.ColorRepresentation, rough = 0.85, metal = 0) => m(new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }));

  const warna = {
    rumput: std(0xdde7c6),
    tanahGambut: std(0xcdb594),
    jalan: std(0xcfd0cb),
    marka: std(0xf7f6f2),
    air: std(0xbcd6e8, 0.3),
    lantai: std(0xebe8e1),
    dinding: std(0xf5f2ec),
    pita: std(0x6f7984),
    kuning: std(0xf0c43a, 0.7),
    rakOranye: std(0xe0782f, 0.6, 0.2),
    kardus: std(0xd8b483),
    pintu: std(0xb9bec4, 0.5, 0.4),
    batang: std(0x8c6a4b),
    daun: std(0x8cc66a, 0.9),
    daunTua: std(0x6fae55, 0.9),
    beton: std(0xc9c6bf),
    pvc: std(0xf3f4f6, 0.4),
    pvcBiru: std(0x2d6fd1, 0.45),
    merah: std(0xc8281f, 0.45, 0.1),
    selang: std(0xeee8da, 0.8),
    kopling: std(0xd2a94e, 0.3, 1),
    baja: std(0x7b8087, 0.5, 0.7),
    rusak: std(0x9a9da2, 0.9),
    rusakGelap: std(0x777a80, 0.9),
    hantu: m(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false })),
    garisHantu: m(new THREE.LineDashedMaterial({ color: 0x5f6670, dashSize: 0.18, gapSize: 0.12 })),
    sasaran: m(new THREE.MeshBasicMaterial({ visible: false })),
  };

  function kotak(w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, bayang = true, bulat = 0): THREE.Mesh {
    const geo = g(bulat > 0 ? new RoundedBoxGeometry(w, h, d, 2, bulat) : new THREE.BoxGeometry(w, h, d));
    const me = new THREE.Mesh(geo, mat);
    me.position.set(x, y, z);
    me.castShadow = bayang;
    me.receiveShadow = true;
    return me;
  }
  function silinder(rAtas: number, rBawah: number, h: number, mat: THREE.Material, x: number, y: number, z: number, seg = 24): THREE.Mesh {
    const me = new THREE.Mesh(g(new THREE.CylinderGeometry(rAtas, rBawah, h, seg)), mat);
    me.position.set(x, y, z);
    me.castShadow = true;
    me.receiveShadow = true;
    return me;
  }
  /** Kerangka kosong bergaris putus-putus: unit yang kurang. Tidak bergantung warna. */
  function hantu(w: number, h: number, d: number, x: number, z: number): THREE.Group {
    const grup = new THREE.Group();
    const isi = new THREE.Mesh(g(new THREE.BoxGeometry(w, h, d)), warna.hantu);
    isi.position.y = h / 2;
    const tepi = new THREE.LineSegments(g(new THREE.EdgesGeometry(g(new THREE.BoxGeometry(w, h, d)))), warna.garisHantu);
    tepi.position.y = h / 2;
    tepi.computeLineDistances();
    grup.add(isi, tepi);
    grup.position.set(x, 0, z);
    return grup;
  }
  function jadikanRusak(o: THREE.Object3D) {
    let i = 0;
    o.traverse((c) => {
      if (c instanceof THREE.Mesh) c.material = i++ % 3 === 0 ? warna.rusakGelap : warna.rusak;
    });
  }

  // ---------- Lingkungan: rumput, jalan, kanal, pohon ----------
  const rumput = new THREE.Mesh(g(new THREE.PlaneGeometry(90, 90)), warna.rumput);
  rumput.rotation.x = -Math.PI / 2;
  rumput.position.y = -0.22;
  rumput.receiveShadow = true;
  akar.add(rumput);

  const kanal = new THREE.Mesh(g(new THREE.PlaneGeometry(40, 9)), warna.air);
  kanal.rotation.x = -Math.PI / 2;
  kanal.position.set(18, -0.2, -19);
  akar.add(kanal);

  function jalan(x: number, z: number, panjang: number, sepanjangX: boolean) {
    const lebar = 2.6;
    akar.add(kotak(sepanjangX ? panjang : lebar, 0.04, sepanjangX ? lebar : panjang, warna.jalan, x, -0.19, z, false));
    for (let t = -panjang / 2 + 1; t < panjang / 2; t += 2.4) {
      akar.add(kotak(sepanjangX ? 1.1 : 0.12, 0.02, sepanjangX ? 0.12 : 1.1, warna.marka, sepanjangX ? x + t : x, -0.16, sepanjangX ? z : z + t, false));
    }
  }
  jalan(4, 11.5, 70, true);
  jalan(-14.5, -6, 32, false);

  // Pohon berkelompok, posisi tetap (pseudo-acak berbenih) supaya peta selalu sama.
  let benih = 7;
  const acak = () => ((benih = (benih * 16807) % 2147483647) / 2147483647);
  const geoBatang = g(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 8));
  const geoDaun = g(new THREE.IcosahedronGeometry(1, 1));
  function pohon(x: number, z: number, s: number) {
    const b = new THREE.Mesh(geoBatang, warna.batang);
    b.position.set(x, 0.25, z);
    b.castShadow = true;
    const d = new THREE.Mesh(geoDaun, acak() > 0.5 ? warna.daun : warna.daunTua);
    d.position.set(x, 1.1 * s + 0.5, z);
    d.scale.setScalar(0.85 * s);
    d.castShadow = true;
    akar.add(b, d);
  }
  const kelompok: [number, number, number, number][] = [
    [-22, -2, 7, 9],
    [-21, 16, 5, 6],
    [24, 4, 4, 5],
    [10, 18, 9, 6],
    [-4, -16, 7, 5],
  ];
  for (const [cx, cz, rad, n] of kelompok) {
    for (let i = 0; i < n; i++) pohon(cx + (acak() - 0.5) * 2 * rad, cz + (acak() - 0.5) * 2 * rad, 0.7 + acak() * 0.6);
  }

  // ---------- Gudang ----------
  akar.add(kotak(20.6, 0.4, 14.6, warna.lantai, 0, -0.2, 0, false));
  const tinggi = 3.4;
  akar.add(kotak(20.6, tinggi, 0.3, warna.dinding, 0, tinggi / 2, -7.15));
  akar.add(kotak(0.3, tinggi, 14.6, warna.dinding, -10.15, tinggi / 2, 0));
  akar.add(kotak(20.6, 0.22, 0.34, warna.pita, 0, tinggi, -7.15, false));
  akar.add(kotak(0.34, 0.22, 14.6, warna.pita, -10.15, tinggi, 0, false));
  // Tiang di sisi terbuka, supaya bentuk bangunan tetap terbaca.
  for (const [x, z] of [
    [10.1, -7.1],
    [10.1, 7.1],
    [-10.1, 7.1],
    [0, 7.1],
    [10.1, 0],
  ] as const) {
    akar.add(kotak(0.3, tinggi, 0.3, warna.pita, x, tinggi / 2, z));
  }
  // Pintu gulung di dinding kiri, menghadap jalan.
  for (let i = 0; i < 9; i++) akar.add(kotak(0.08, 0.26, 3.4, warna.pintu, -9.98, 0.2 + i * 0.3, 3.2, false));

  // Papan nama di dinding belakang.
  const kanvas = document.createElement("canvas");
  kanvas.width = 1024;
  kanvas.height = 160;
  const cx = kanvas.getContext("2d");
  if (cx) {
    cx.fillStyle = "#3d4652";
    cx.fillRect(0, 0, 1024, 160);
    cx.fillStyle = "#ffffff";
    cx.font = "600 84px system-ui, sans-serif";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.fillText("GUDANG ALAT MPA", 512, 84);
  }
  const tekPapan = new THREE.CanvasTexture(kanvas);
  tekPapan.colorSpace = THREE.SRGBColorSpace;
  texs.push(tekPapan);
  const papan = new THREE.Mesh(g(new THREE.PlaneGeometry(6, 0.94)), m(new THREE.MeshBasicMaterial({ map: tekPapan })));
  papan.position.set(-1, 2.6, -6.98);
  akar.add(papan);

  // Rak dan kardus di dinding belakang (latar).
  function rak(x: number, z: number, panjang: number) {
    for (const dx of [-panjang / 2, panjang / 2]) for (const dz of [-0.35, 0.35]) akar.add(kotak(0.08, 2.2, 0.08, warna.rakOranye, x + dx, 1.1, z + dz));
    for (const y of [0.15, 0.95, 1.75]) {
      akar.add(kotak(panjang, 0.06, 0.8, warna.baja, x, y, z, false));
      for (let t = -panjang / 2 + 0.45; t < panjang / 2 - 0.2; t += 0.75) {
        if (acak() > 0.3) akar.add(kotak(0.55, 0.45, 0.55, warna.kardus, x + t, y + 0.26, z, true, 0.03));
      }
    }
  }
  rak(-6.6, -6.4, 5);
  rak(6.6, -6.4, 5);

  // Palet dan kardus di depan, plus APAR di tiang.
  akar.add(kotak(1.3, 0.14, 1.1, warna.batang, -7.5, 0.07, 5.2));
  akar.add(kotak(1.1, 0.7, 0.9, warna.kardus, -7.5, 0.5, 5.2, true, 0.04));
  akar.add(silinder(0.12, 0.12, 0.55, warna.merah, -9.7, 0.6, 6.4, 12));

  // ---------- Zona barang ----------
  const zona: Zona[] = [];
  const geoPanas = g(new THREE.PlaneGeometry(1, 1));
  const tekPanas = teksturPanas();
  texs.push(tekPanas);

  function zonaBaru(kode: string, cx: number, cz: number, w: number, d: number, tinggiLabel: number, lantaiGarisan: boolean) {
    const dz = data.find((x) => x.kode === kode)!;
    const kurang = Math.max(dz.target - dz.berfungsi, 0);
    const rasio = dz.target > 0 ? kurang / dz.target : 0;
    // Bercak panas di bawah zona, makin merah makin banyak yang kurang.
    const panas = new THREE.Mesh(
      geoPanas,
      m(new THREE.MeshBasicMaterial({ color: warnaPanas(rasio), alphaMap: tekPanas, transparent: true, opacity: 0.75, depthWrite: false })),
    );
    panas.rotation.x = -Math.PI / 2;
    panas.scale.set(w * 1.7, d * 1.7, 1);
    panas.position.set(cx, 0.015, cz);
    panas.renderOrder = 1;
    akar.add(panas);
    // Garis lantai kuning seperti penanda area gudang.
    if (lantaiGarisan) {
      const t = 0.08;
      akar.add(kotak(w, 0.01, t, warna.kuning, cx, 0.02, cz - d / 2, false));
      akar.add(kotak(w, 0.01, t, warna.kuning, cx, 0.02, cz + d / 2, false));
      akar.add(kotak(t, 0.01, d, warna.kuning, cx - w / 2, 0.02, cz, false));
      akar.add(kotak(t, 0.01, d, warna.kuning, cx + w / 2, 0.02, cz, false));
    }
    const sasaran = new THREE.Mesh(g(new THREE.BoxGeometry(w, 2.4, d)), warna.sasaran);
    sasaran.position.set(cx, 1.2, cz);
    sasaran.userData.kode = kode;
    akar.add(sasaran);
    zona.push({ kode, jangkar: new THREE.Vector3(cx, tinggiLabel, cz), sasaran });

    const total = Math.max(dz.target, dz.berfungsi + dz.rusak);
    const n = Math.min(total, MAKS_SLOT[kode] ?? 6);
    // Urutan slot: berfungsi, lalu rusak, lalu kosong (kurang).
    return Array.from({ length: n }, (_, i) => (i < dz.berfungsi ? "utuh" : i < dz.berfungsi + dz.rusak ? "rusak" : "kosong") as Slot);
  }

  type Slot = "utuh" | "rusak" | "kosong";

  function grid(n: number, kolom: number, cx: number, cz: number, jx: number, jz: number) {
    const baris = Math.ceil(n / kolom);
    return Array.from({ length: n }, (_, i) => {
      const r = Math.floor(i / kolom);
      const k = i % kolom;
      const kolomBaris = r === baris - 1 ? n - r * kolom : kolom;
      return [cx + (k - (kolomBaris - 1) / 2) * jx, cz + (r - (baris - 1) / 2) * jz] as const;
    });
  }

  // Pompa jinjing: model rinci yang sama dengan halaman item, diperkecil.
  if (data.some((x) => x.kode === "pompa_jinjing")) {
    const slot = zonaBaru("pompa_jinjing", -5, -1.4, 8, 5.4, 2.4, true);
    const dasar = bangunPompaJinjing();
    buangLain.push(dasar.buang);
    const kotakBatas = new THREE.Box3().setFromObject(dasar.akar);
    const ukuran = kotakBatas.getSize(new THREE.Vector3());
    const skala = 2.1 / Math.max(ukuran.x, ukuran.z);
    const lebar = ukuran.x * skala;
    const tinggiP = ukuran.y * skala;
    const dalam = ukuran.z * skala;
    grid(slot.length, 3, -5, -1.4, 2.6, 2.5).forEach(([x, z], i) => {
      if (slot[i] === "kosong") {
        akar.add(hantu(lebar, tinggiP, dalam, x, z));
        return;
      }
      const p = dasar.akar.clone(true);
      p.scale.setScalar(skala);
      p.position.set(x, -kotakBatas.min.y * skala, z);
      p.rotation.y = -0.25;
      if (slot[i] === "rusak") {
        jadikanRusak(p);
        p.rotation.z = 0.12;
      }
      akar.add(p);
    });
  }

  // Selang keluar: gulungan selang pada dudukan.
  if (data.some((x) => x.kode === "selang_keluar")) {
    const slot = zonaBaru("selang_keluar", 5, -1.6, 8, 5, 2.2, true);
    const geoGulung = g(new THREE.TorusGeometry(0.34, 0.07, 10, 28));
    const geoFlens = g(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 28));
    geoFlens.rotateX(Math.PI / 2);
    const geoKaki = g(new THREE.BoxGeometry(0.06, 0.7, 0.06));
    function gulungan(x: number, z: number, rusak: boolean): THREE.Group {
      const gr = new THREE.Group();
      for (const dz of [-0.2, 0.2]) {
        const f = new THREE.Mesh(geoFlens, rusak ? warna.rusakGelap : warna.merah);
        f.position.set(0, 0.62, dz);
        f.castShadow = true;
        gr.add(f);
        for (const dx of [-0.32, 0.32]) {
          const k = new THREE.Mesh(geoKaki, warna.baja);
          k.position.set(dx * 0.6, 0.3, dz);
          k.rotation.z = dx > 0 ? -0.35 : 0.35;
          gr.add(k);
        }
      }
      for (const dz of [-0.12, 0, 0.12]) {
        const s = new THREE.Mesh(geoGulung, rusak ? warna.rusak : warna.selang);
        s.position.set(0, 0.62, dz);
        s.castShadow = true;
        gr.add(s);
      }
      const kop = new THREE.Mesh(g(new THREE.CylinderGeometry(0.06, 0.06, 0.16, 12)), warna.kopling);
      kop.position.set(0.38, 0.32, 0.1);
      gr.add(kop);
      gr.position.set(x, 0, z);
      gr.scale.setScalar(1.25);
      if (rusak) gr.rotation.z = 0.15;
      return gr;
    }
    grid(slot.length, 6, 5, -1.6, 1.3, 2.3).forEach(([x, z], i) => {
      akar.add(slot[i] === "kosong" ? hantu(1.2, 1.2, 0.62, x, z) : gulungan(x, z, slot[i] === "rusak"));
    });
  }

  // Sumur bor: di halaman bertanah gambut, di luar gudang.
  if (data.some((x) => x.kode === "sumur_bor")) {
    akar.add(kotak(7, 0.06, 9, warna.tanahGambut, 15.5, -0.17, -1, false, 0));
    const slot = zonaBaru("sumur_bor", 15.5, -1, 6, 8, 2.2, false);
    function sumur(x: number, z: number, rusak: boolean): THREE.Group {
      const gr = new THREE.Group();
      gr.add(kotak(1, 0.16, 1, warna.beton, 0, -0.06, 0));
      gr.add(silinder(0.11, 0.11, 1.2, rusak ? warna.rusak : warna.pvc, 0, 0.6, 0, 16));
      gr.add(silinder(0.14, 0.14, 0.16, rusak ? warna.rusakGelap : warna.pvcBiru, 0, 1.0, 0, 16));
      const lengan = silinder(0.08, 0.08, 0.5, rusak ? warna.rusak : warna.pvc, 0.25, 1.08, 0, 12);
      lengan.rotation.z = Math.PI / 2;
      gr.add(lengan);
      const roda = new THREE.Mesh(g(new THREE.TorusGeometry(0.13, 0.025, 8, 20)), rusak ? warna.rusakGelap : warna.merah);
      roda.position.set(0, 1.28, 0);
      roda.rotation.x = Math.PI / 2;
      gr.add(roda);
      gr.add(silinder(0.03, 0.03, 1.5, warna.baja, -0.42, 0.75, 0.42, 8));
      gr.add(kotak(0.3, 0.2, 0.02, warna.kuning, -0.27, 1.38, 0.42, false));
      gr.position.set(x, 0, z);
      gr.scale.setScalar(1.3);
      if (rusak) gr.rotation.z = 0.1;
      return gr;
    }
    grid(slot.length, 2, 15.5, -1, 2.8, 2.6).forEach(([x, z], i) => {
      akar.add(slot[i] === "kosong" ? hantu(1.3, 1.8, 1.3, x, z) : sumur(x, z, slot[i] === "rusak"));
    });
  }

  return {
    akar,
    zona,
    buang: () => {
      for (const x of geos) x.dispose();
      for (const x of mats) x.dispose();
      for (const x of texs) x.dispose();
      for (const f of buangLain) f();
    },
  };
}

/** Bercak bundar lembut (putih di tengah, pudar ke tepi) sebagai alphaMap bercak panas. */
function teksturPanas(): THREE.Texture {
  const k = document.createElement("canvas");
  k.width = k.height = 128;
  const c = k.getContext("2d");
  if (c) {
    const gr = c.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, "#ffffff");
    gr.addColorStop(0.45, "#bdbdbd");
    gr.addColorStop(1, "#000000");
    c.fillStyle = gr;
    c.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(k);
}
