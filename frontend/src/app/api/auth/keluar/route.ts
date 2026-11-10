import { assertOrigin, cookieSesi, deleteSession, tokenDari } from "@/server/auth";
import { handle } from "@/server/http";

export const POST = handle(async (req) => {
  assertOrigin(req);
  const token = tokenDari(req);
  if (token) await deleteSession(token);
  return new Response(null, { status: 204, headers: { "Set-Cookie": cookieSesi("", 0) } });
});
