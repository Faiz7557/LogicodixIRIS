import { describe, expect, it } from "vitest";
import { teksHariIni } from "./TanggalHariIni";

describe("teksHariIni (tanggal WIB)", () => {
  it("menulis hari dan tanggal dalam WIB", () => {
    expect(teksHariIni(Date.parse("2026-11-10T05:00:00Z"))).toBe("Selasa, 10 November 2026");
  });
  it("berganti hari tepat setelah tengah malam WIB, bukan UTC", () => {
    expect(teksHariIni(Date.parse("2026-11-10T16:59:59Z"))).toBe("Selasa, 10 November 2026");
    expect(teksHariIni(Date.parse("2026-11-10T17:00:01Z"))).toBe("Rabu, 11 November 2026");
  });
});
