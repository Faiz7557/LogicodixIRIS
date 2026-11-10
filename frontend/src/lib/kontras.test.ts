import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  fileURLToPath(new URL("../app/globals.css", import.meta.url)),
  "utf8",
);

type Rgb = [number, number, number];

function tokenRoot(): Record<string, string> {
  const blok = css.match(/:root\s*\{([^}]*)\}/);
  if (!blok) throw new Error("blok :root tidak ditemukan di globals.css");
  const token: Record<string, string> = {};
  for (const m of blok[1].matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    token[m[1]] = m[2].trim();
  }
  return token;
}

function heksa(token: Record<string, string>, nama: string): Rgb {
  const nilai = token[nama];
  if (!nilai) throw new Error(`token --${nama} tidak ada di :root`);
  const m = nilai.match(/^#([0-9a-f]{6})$/i);
  if (!m) throw new Error(`--${nama} bukan heksa 6 digit: ${nilai}`);
  const h = m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

// Luminans relatif WCAG 2.x.
function luminans([r, g, b]: Rgb): number {
  const kanal = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
}

function rasioKontras(a: Rgb, b: Rgb): number {
  const [terang, gelap] = [luminans(a), luminans(b)].sort((x, y) => y - x);
  return (terang + 0.05) / (gelap + 0.05);
}

// [teks, latar], keduanya nama token tanpa awalan "--".
const PASANGAN: [string, string][] = [
  ["ink", "paper"],
  ["muted", "paper"],
  ["faint", "paper"],
  ["faint", "surface"],
  ["ember", "surface"],
  ["ember", "ember-soft"],
  ["water", "surface"],
  ["water", "water-soft"],
  ["ok", "ok-soft"],
  ["warn", "warn-soft"],
  ["danger", "danger-soft"],
  ["surface", "ink"],
];

describe("kontras teks AA di :root globals.css", () => {
  it.each(PASANGAN)("%s di atas %s minimal 4,5", (teks, latar) => {
    const token = tokenRoot();
    const rasio = rasioKontras(heksa(token, teks), heksa(token, latar));
    expect(rasio).toBeGreaterThanOrEqual(4.5);
  });
});
