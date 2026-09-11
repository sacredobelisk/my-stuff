import type { Config } from "@netlify/functions";

const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";

/** Only the endpoints the site actually uses, so this cannot be driven as a general proxy. */
const ALLOWED_ENDPOINTS = new Set(["collection", "plays"]);

const CACHE_SECONDS = 300;

/**
 * Proxies BoardGameGeek's XML API so the auth token it requires stays on the server.
 *
 * A `VITE_`-prefixed variable is inlined into the client bundle by Vite and readable by anyone, so
 * the token is read here from `BGG_AUTH_TOKEN` (no prefix) and never reaches the browser.
 */
export default async (request: Request) => {
  const url = new URL(request.url);

  // Taken from the path rather than `context.params` so this works whether Netlify routes via the
  // configured path below or falls back to the reserved /.netlify/functions/ URL.
  const endpoint = url.pathname.split("/").filter(Boolean).pop();

  if (!endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return new Response("Unknown endpoint", { status: 404 });
  }

  const token = process.env.BGG_AUTH_TOKEN;

  if (!token) {
    return new Response("BGG_AUTH_TOKEN is not configured", { status: 500 });
  }

  const upstream = new URL(`${BGG_BASE_URL}/${endpoint}`);
  upstream.search = url.search;

  const response = await fetch(upstream, {
    headers: { Authorization: `Bearer ${token}` },
    signal: request.signal,
  });

  // Passed straight through as XML; the client still parses it with fast-xml-parser.
  return new Response(response.body, {
    status: response.status,
    headers: {
      "cache-control": `public, max-age=${CACHE_SECONDS}`,
      "content-type": response.headers.get("content-type") ?? "application/xml",
    },
  });
};

export const config: Config = { path: "/api/bgg/:endpoint" };
