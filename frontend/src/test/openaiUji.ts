import { vi } from "vitest";

/** `fetch` tiruan yang membalas seperti OpenAI chat completions dengan `content` ini. */
export const jawabOpenAI = (content: string, status = 200) =>
  vi.fn(async (..._args: unknown[]) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status }));

/** Badan JSON dari panggilan `fetch` ke-`i`. */
export function badanPanggilan(f: ReturnType<typeof vi.fn>, i = 0): string {
  return String((f.mock.calls[i] as unknown as [string, RequestInit])[1].body);
}
