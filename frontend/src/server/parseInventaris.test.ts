import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockCatalog } from "@/test/fixtures";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create };
  },
}));

import { parseInventoryTextDenganAi } from "./parseInventaris";

const kunci = process.env.ANTHROPIC_API_KEY;
const routerKunci = process.env.NINE_ROUTER_API_KEY;

describe("parseInventaris AI", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "uji";
    delete process.env.NINE_ROUTER_API_KEY;
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

  it("memakai 9router bila Anthropic tidak tersedia", async () => {
    const anthropic = process.env.ANTHROPIC_API_KEY;
    const routerKunci = process.env.NINE_ROUTER_API_KEY;
    const routerBase = process.env.NINE_ROUTER_BASE_URL;
    delete process.env.ANTHROPIC_API_KEY;
    process.env.NINE_ROUTER_API_KEY = "uji";
    process.env.NINE_ROUTER_BASE_URL = "https://router.test";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: '[{"itemKode":"pompa_jinjing","total":2,"berfungsi":1}]' } }] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    try {
      const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
      expect(r).toEqual({
        hasil: [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }],
        sumber: "9router",
      });
      expect(fetchMock).toHaveBeenCalledWith("https://router.test/v1/chat/completions", expect.objectContaining({ method: "POST" }));
    } finally {
      if (anthropic) process.env.ANTHROPIC_API_KEY = anthropic;
      if (routerKunci) process.env.NINE_ROUTER_API_KEY = routerKunci;
      else delete process.env.NINE_ROUTER_API_KEY;
      if (routerBase) process.env.NINE_ROUTER_BASE_URL = routerBase;
      else delete process.env.NINE_ROUTER_BASE_URL;
      vi.unstubAllGlobals();
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    if (kunci) process.env.ANTHROPIC_API_KEY = kunci;
    else delete process.env.ANTHROPIC_API_KEY;
    if (routerKunci) process.env.NINE_ROUTER_API_KEY = routerKunci;
    else delete process.env.NINE_ROUTER_API_KEY;
  });
});
