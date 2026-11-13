import { afterEach, describe, expect, it, vi } from "vitest";
import { badanPanggilan, jawabOpenAI as jawab } from "@/test/openaiUji";
import { modelPenulis, tulisJson } from "./llm";

const SKEMA = { name: "uji", schema: { type: "object" } };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("tulisJson", () => {
  it("null tanpa kunci, tanpa memanggil fetch", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const f = jawab("{}");
    vi.stubGlobal("fetch", f);
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });
  it("mengembalikan isi pesan", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubGlobal("fetch", jawab('{"a":1}'));
    expect(await tulisJson("s", "u", SKEMA)).toBe('{"a":1}');
  });
  it("mengirim json_schema strict dan model dari env", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", "model-uji");
    const f = jawab("{}");
    vi.stubGlobal("fetch", f);
    await tulisJson("s", "u", SKEMA);
    const body = JSON.parse(badanPanggilan(f));
    expect(body.model).toBe("model-uji");
    expect(body.response_format.json_schema).toMatchObject({ name: "uji", strict: true });
  });
  it("null saat HTTP 500", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", jawab("x", 500));
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
  });
  it("null saat fetch melempar", async () => {
    vi.stubEnv("OPENAI_API_KEY", "kunci-uji");
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("putus"); }));
    expect(await tulisJson("s", "u", SKEMA)).toBeNull();
  });
  it("model jatuh ke classifier lalu bawaan", () => {
    vi.stubEnv("OPENAI_MODEL_RINGKASAN", "");
    vi.stubEnv("OPENAI_MODEL_CLASSIFIER", "");
    expect(modelPenulis()).toBe("gpt-6-luna");
    vi.stubEnv("OPENAI_MODEL_CLASSIFIER", "kelas");
    expect(modelPenulis()).toBe("kelas");
  });
});
