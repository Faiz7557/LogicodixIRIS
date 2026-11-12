import { vi } from "vitest";

type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

/** `fetch` tiruan yang membalas seperti OpenAI chat completions dengan `content` ini. */
export const jawabOpenAI = (content: string, status = 200) =>
  vi.fn<Fetch>(async () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status }));

/** Badan JSON dari panggilan `fetch` ke-`i`. */
export function badanPanggilan(f: ReturnType<typeof jawabOpenAI>, i = 0): string {
  return String(f.mock.calls[i][1]?.body);
}
