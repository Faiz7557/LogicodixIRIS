import { teksDariJawaban } from "./parseInventaris";

/*
 * Pemanggil OpenAI bersama untuk ringkasan halaman dan narasi usulan.
 * OpenAI hanya menulis kalimat; angka selalu dihitung server dan keluaran selalu divalidasi pemanggil.
 */

const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const modelPenulis = (): string =>
  process.env.OPENAI_MODEL_RINGKASAN || process.env.OPENAI_MODEL_CLASSIFIER || "gpt-6-luna";

/** `null` berarti pemanggil harus memakai template (tanpa kunci, HTTP gagal, waktu habis, atau jawaban kosong). Tidak pernah melempar. */
export async function tulisJson(
  system: string,
  user: string,
  skema: { name: string; schema: object },
): Promise<string | null> {
  const kunci = process.env.OPENAI_API_KEY;
  if (!kunci) return null;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${kunci}` },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model: modelPenulis(),
        max_completion_tokens: 2000,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_schema", json_schema: { name: skema.name, strict: true, schema: skema.schema } },
      }),
    });
    if (!res.ok) {
      console.error("[llm] OpenAI", res.status); // badan respons tidak dicatat: bisa memuat potongan prompt
      return null;
    }
    return teksDariJawaban(await res.json(), "OpenAI").trim() || null;
  } catch (e) {
    console.error("[llm] OpenAI gagal:", e instanceof Error ? e.message : e);
    return null;
  }
}
