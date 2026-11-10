import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mockCatalog } from "@/test/fixtures";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create };
  },
}));

import { parseInventoryTextDenganAi } from "./parseInventaris";

const kunci = process.env.ANTHROPIC_API_KEY;

describe("parseInventaris AI", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "uji";
    create.mockReset();
  });

  it("memakai hasil AI yang valid", async () => {
    create.mockResolvedValue({
      content: [{ type: "text", text: '[{"itemKode":"pompa_jinjing","total":2,"berfungsi":1}]' }],
    });
    expect(await parseInventoryTextDenganAi("pompa jinjing 2, 1 berfungsi", mockCatalog)).toEqual({
      hasil: [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }],
      sumber: "ai",
    });
  });

  it("jatuh ke deterministik saat keluaran AI di luar skema", async () => {
    create.mockResolvedValue({
      content: [{ type: "text", text: '[{"itemKode":"tank","total":1,"berfungsi":1}]' }],
    });
    const r = await parseInventoryTextDenganAi("Pompa jinjing 2", mockCatalog);
    expect(r.sumber).toBe("deterministik");
    expect(r.hasil).toEqual([{ itemKode: "pompa_jinjing", total: 2, berfungsi: 2 }]);
  });

  it("jatuh ke deterministik saat AI gagal", async () => {
    create.mockRejectedValue(new Error("jaringan"));
    const r = await parseInventoryTextDenganAi("Pompa jinjing 2", mockCatalog);
    expect(r.sumber).toBe("deterministik");
  });

  afterAll(() => {
    if (kunci) process.env.ANTHROPIC_API_KEY = kunci;
    else delete process.env.ANTHROPIC_API_KEY;
  });
});
