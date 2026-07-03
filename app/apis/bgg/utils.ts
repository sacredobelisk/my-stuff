import { PROCESS_ENVS } from "../../utils/env-vars";

export const BGG_AUTH_HEADER = {
  Authorization: `Bearer ${PROCESS_ENVS.BGG_AUTH_TOKEN}`,
};

export const BASE_BGG_API_URL = "https://boardgamegeek.com/xmlapi2";

export const BGG_PAGE_SIZE = 100;

export const BGG_USERNAME = "sobrien79";

/** BGG's XML API yields a single object instead of an array when there is exactly one item. */
export const toArray = <T>(value?: T | T[]): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};
