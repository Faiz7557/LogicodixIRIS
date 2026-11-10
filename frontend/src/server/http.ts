import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    public kode: string,
    public pesan: string,
    public headers?: HeadersInit,
  ) {
    super(pesan);
    this.name = "HttpError";
  }
}

export function jsonError(status: number, kode: string, pesan: string, headers?: HeadersInit): Response {
  return Response.json({ error: { kode, pesan } }, { status, headers });
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response>;

function logServerError(req: Request, e: unknown): void {
  let path = req.url;
  try {
    path = new URL(req.url).pathname;
  } catch {
    // URL relatif tetap dicatat apa adanya.
  }
  console.error("[api]", req.method, path, e);
}

export function handle<C>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return jsonError(e.status, e.kode, e.pesan, e.headers);
      if (e instanceof ZodError) return jsonError(400, "input_tidak_sah", e.issues[0]?.message ?? "Input tidak sah.");
      logServerError(req, e);
      return jsonError(500, "galat_server", "Terjadi galat di server.");
    }
  };
}
