import { PROCESS_ENVS } from "../../utils/env-vars";

export const BGG_AUTH_HEADER = {
  Authorization: `Bearer ${PROCESS_ENVS.BGA_AUTH_TOKEN}`,
};

export const BASE_BGG_API_URL = "https://boardgamegeek.com/xmlapi2";

export const BGG_PAGE_SIZE = 100;
