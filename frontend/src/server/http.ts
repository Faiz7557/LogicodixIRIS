import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, public kode: string, public pesan: string) {
    super(pesan);
    this.name = "HttpError";
  }
}

export function jsonError(status: number, kode: string, pesan: string): Response {
  return Response.json({ error: { kode, pesan } }, { status });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (req: Request, ctx: any) => Promise<Response>;

export function handle(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return jsonError(e.status, e.kode, e.pesan);
      if (e instanceof ZodError) return jsonError(400, "input_tidak_sah", e.issues[0]?.message ?? "Input tidak sah.");
      console.error(e);
      return jsonError(500, "galat_server", "Terjadi galat di server.");
    }
  };
}
