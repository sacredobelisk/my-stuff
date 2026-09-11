/**
 * Served by netlify/functions/bgg.ts rather than BoardGameGeek directly, so the auth token their
 * XML API requires stays on the server instead of being inlined into the client bundle.
 */
export const BASE_BGG_API_URL = "/api/bgg";

export const BGG_PAGE_SIZE = 100;

export const BGG_USERNAME = "sobrien79";
