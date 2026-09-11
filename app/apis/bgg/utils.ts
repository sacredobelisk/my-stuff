import { PROCESS_ENVS } from "~/utils/env-vars";

// Sending `Bearer ` with no token is worse than sending nothing, so drop the header when unset.
export const BGG_AUTH_HEADER: Record<string, string> = PROCESS_ENVS.BGG_AUTH_TOKEN
  ? { Authorization: `Bearer ${PROCESS_ENVS.BGG_AUTH_TOKEN}` }
  : {};

export const BASE_BGG_API_URL = "https://boardgamegeek.com/xmlapi2";

export const BGG_PAGE_SIZE = 100;

export const BGG_USERNAME = "sobrien79";
