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
const openaiKunci = process.env.OPENAI_API_KEY;
const routerKunci = process.env.NINE_ROUTER_API_KEY;
const routerBase = process.env.NINE_ROUTER_BASE_URL;

const ISIAN = '[{"itemKode":"pompa_jinjing","total":2,"berfungsi":1}]';
const jawabanChat = (isi = ISIAN) =>
  new Response(JSON.stringify({ choices: [{ message: { content: isi } }] }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

describe("parseInventaris AI", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "uji";
    delete process.env.OPENAI_API_KEY;
    delete process.env.NINE_ROUTER_API_KEY;
    delete process.env.NINE_ROUTER_BASE_URL;
    create.mockReset();
  });

  it("memakai hasil AI yang valid", async () => {
    create.mockResolvedValue({ content: [{ type: "text", text: ISIAN }] });
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

  it("Anthropic menang atas OpenAI", async () => {
    process.env.OPENAI_API_KEY = "uji";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    create.mockResolvedValue({ content: [{ type: "text", text: ISIAN }] });
    const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
    expect(r.sumber).toBe("ai");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("memakai OpenAI bila Anthropic tidak tersedia", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.OPENAI_API_KEY = "uji";
    const fetchMock = vi.fn().mockResolvedValue(jawabanChat());
    vi.stubGlobal("fetch", fetchMock);

    const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
    expect(r).toEqual({
      hasil: [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }],
      sumber: "openai",
    });
    expect(fetchMock).toHaveBeenCalledWith("https://api.openai.com/v1/chat/completions", expect.objectContaining({ method: "POST" }));
    const badan = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(badan.model).toBe("gpt-6-luna");
    expect(badan.max_completion_tokens).toBe(1024);
    expect(badan.max_tokens).toBeUndefined();
    expect(badan.temperature).toBeUndefined();
  });

  it("memakai OpenAI bila Anthropic gagal", async () => {
    create.mockRejectedValue(new Error("jaringan"));
    process.env.OPENAI_API_KEY = "uji";
    const fetchMock = vi.fn().mockResolvedValue(jawabanChat());
    vi.stubGlobal("fetch", fetchMock);

    const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
    expect(r.sumber).toBe("openai");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("jatuh ke 9router bila OpenAI gagal", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.OPENAI_API_KEY = "uji";
    process.env.NINE_ROUTER_API_KEY = "uji";
    process.env.NINE_ROUTER_BASE_URL = "https://router.test";
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("", { status: 500 })).mockResolvedValueOnce(jawabanChat());
    vi.stubGlobal("fetch", fetchMock);

    const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
    expect(r.sumber).toBe("9router");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe("https://router.test/v1/chat/completions");
  });

  it("memakai 9router bila Anthropic dan OpenAI tidak tersedia", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.NINE_ROUTER_API_KEY = "uji";
    process.env.NINE_ROUTER_BASE_URL = "https://router.test";
    const fetchMock = vi.fn().mockResolvedValue(jawabanChat());
    vi.stubGlobal("fetch", fetchMock);

    const r = await parseInventoryTextDenganAi("Pompa jinjing 2, 1 berfungsi", mockCatalog);
    expect(r).toEqual({
      hasil: [{ itemKode: "pompa_jinjing", total: 2, berfungsi: 1 }],
      sumber: "9router",
    });
    expect(fetchMock).toHaveBeenCalledWith("https://router.test/v1/chat/completions", expect.objectContaining({ method: "POST" }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    if (kunci) process.env.ANTHROPIC_API_KEY = kunci;
    else delete process.env.ANTHROPIC_API_KEY;
    if (openaiKunci) process.env.OPENAI_API_KEY = openaiKunci;
    else delete process.env.OPENAI_API_KEY;
    if (routerKunci) process.env.NINE_ROUTER_API_KEY = routerKunci;
    else delete process.env.NINE_ROUTER_API_KEY;
    if (routerBase) process.env.NINE_ROUTER_BASE_URL = routerBase;
    else delete process.env.NINE_ROUTER_BASE_URL;
  });
});
