import * as THREE from "three";
import type { ModelPompa } from "./bangunPompaJinjing";
import { bangunPompaJinjing, buangBahan } from "./bangunPompaJinjing";
import { bangunSelangKeluar, buangBahanSelang } from "./bangunSelangKeluar";
import { bangunSumurBor } from "./bangunSumurBor";

/**
 * Pengaturan penampil per alat: model, sudut kamera, titik pandang dan jari-jari bola yang harus masuk
 * layar saat rakit (buka = 0) dan saat terbuka (buka = 1), tinggi lantai bayangan, serta kata tombol.
 * Kamera ikut bergeser di antara dua keadaan itu supaya seluruh model tetap terlihat.
 */
export interface KonfigurasiModel {
  bangun: () => ModelPompa;
  buangBersama?: () => void;
  arahKamera: THREE.Vector3;
  target: [THREE.Vector3, THREE.Vector3];
  radius: [number, number];
  lantaiY: number;
  tombol: { buka: string; tutup: string };
  /** Kalimat untuk pembaca layar saat model dalam keadaan terbuka. */
  saatBuka: string;
}

export const KONFIGURASI: Record<string, KonfigurasiModel> = {
  pompa_jinjing: {
    bangun: bangunPompaJinjing,
    buangBersama: buangBahan,
    arahKamera: new THREE.Vector3(-2.7, 1.3, 2.9).normalize(),
    target: [new THREE.Vector3(0, 0.62, 0), new THREE.Vector3(0, 0.97, 0)],
    radius: [1.45, 1.45 * 1.55],
    lantaiY: 0,
    tombol: { buka: "Buka mesin", tutup: "Tutup mesin" },
    saatBuka: "Mesin sedang dibuka, bagian-bagiannya terurai.",
  },
  selang_keluar: {
    bangun: bangunSelangKeluar,
    buangBersama: buangBahanSelang,
    arahKamera: new THREE.Vector3(-1.2, 1.25, 2.6).normalize(),
    target: [new THREE.Vector3(-2.35, 0.22, 0.15), new THREE.Vector3(0.35, 0.3, 0)],
    radius: [0.85, 3.4],
    lantaiY: 0,
    tombol: { buka: "Gelar selang", tutup: "Gulung selang" },
    saatBuka: "Selang tergelar sepanjang 20 meter, berisi air, dan menyemburkan air dari nozel.",
  },
  sumur_bor: {
    bangun: bangunSumurBor,
    arahKamera: new THREE.Vector3(-2.6, 1.4, 2.4).normalize(),
    target: [new THREE.Vector3(0, -0.55, 0), new THREE.Vector3(-0.55, -0.6, 0)],
    radius: [1.75, 2.25],
    lantaiY: -1.62,
    tombol: { buka: "Lihat penampang", tutup: "Tutup penampang" },
    saatBuka: "Tanah terbelah: lapisan gambut, lempung, pasir berair, pipa, saringan, dan air tanah terlihat.",
  },
};
