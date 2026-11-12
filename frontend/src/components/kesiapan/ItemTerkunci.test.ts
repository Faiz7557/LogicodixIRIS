import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FormInventaris } from "@/components/inventaris/FormInventaris";
import { ALASAN_TERKUNCI_GAMBUT, itemTerkunci } from "@/lib/kesiapan";
import { mockCatalog } from "@/test/fixtures";
import { KartuTerkunci } from "./ItemTerkunci";

describe("item terkunci (sumur bor di desa tanpa gambut)", () => {
  it("mengunci item khusus gambut hanya bila desa tidak bergambut", () => {
    expect(itemTerkunci(mockCatalog, 0).map((c) => c.kode)).toEqual(["sumur_bor"]);
    expect(itemTerkunci(mockCatalog, 0.0001)).toEqual([]);
  });

  it("kartu terkunci menyebut alasan dan tanpa isian", () => {
    const sumur = mockCatalog.find((c) => c.kode === "sumur_bor")!;
    const html = renderToStaticMarkup(createElement(KartuTerkunci, { item: sumur }));
    expect(html).toContain("Terkunci");
    expect(html).toContain(ALASAN_TERKUNCI_GAMBUT);
    expect(html).not.toContain("<input");
  });

  it("formulir Catat Alat menampilkan sumur bor terkunci tanpa kolom isian", () => {
    const terkunci = itemTerkunci(mockCatalog, 0);
    const html = renderToStaticMarkup(
      createElement(FormInventaris, {
        kode: "X",
        catalog: mockCatalog.filter((c) => !terkunci.includes(c)),
        target: {},
        tersimpan: [],
        terakhir: null,
        namaPengisi: "uji",
        terkunci,
      }),
    );
    expect(html).toContain("Sumur bor");
    expect(html).toContain("Terkunci");
    expect(html).not.toContain('id="alat-sumur_bor-total"');
    expect(html).toContain('id="alat-pompa_jinjing-total"');
  });
});
