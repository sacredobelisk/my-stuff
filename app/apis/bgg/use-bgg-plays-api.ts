import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/use-api/use-api";
import type { CustomQueryOptions } from "../utils/types";
import type { BggPlay, BggPlaysResponse } from "./types";
import { BASE_BGG_API_URL, BGG_AUTH_HEADER, BGG_PAGE_SIZE } from "./utils";

type Params = {
  id?: string;
  maxdate?: string;
  mindate?: string;
  page?: "ALL" | number;
  subtype?:
    | "boardgame"
    | "boardgameaccessory"
    | "boardgamecompilation"
    | "boardgameexpansion"
    | "boardgameimplementation"
    | "boardgameintegration"
    | "rpg"
    | "rpgitem"
    | "videogame";
  type?: "family" | "thing";
  username?: string;
};

type QueryKey = [string, Params];
type Options = CustomQueryOptions<BggPlaysResponse, Error, BggPlay[], QueryKey>;

const uri = `${BASE_BGG_API_URL}/plays`;

export const useBggPlaysApi = ({ page = 1, ...restParams }: Params, { enabled = true, ...options }: Options = {}) => {
  const { get } = useApi();
  return useQuery({
    queryFn: async ({ signal }) => {
      const response = await get<BggPlaysResponse>(uri, {
        headers: BGG_AUTH_HEADER,
        queryParams: { page: page === "ALL" ? 1 : page, ...restParams },
        responseType: "xmlToJson",
        signal,
      });

      if (typeof page === "number") {
        return response;
      }
      const totalPlays = response.plays?.total || 0;
      if (totalPlays === 0) {
        return response;
      }

      const totalPages = Math.ceil(totalPlays / BGG_PAGE_SIZE);
      const responses: BggPlaysResponse[] = [response];
      const BATCH_SIZE = 5;
      let currentPage = 2;
      while (currentPage <= totalPages) {
        const batchPromises: Promise<BggPlaysResponse>[] = [];
        for (let i = 0; i < BATCH_SIZE && currentPage <= totalPages; i++, currentPage++) {
          batchPromises.push(
            get<BggPlaysResponse>(uri, {
              headers: BGG_AUTH_HEADER,
              queryParams: { page: currentPage, ...restParams },
              responseType: "xmlToJson",
              signal,
            })
          );
        }
        const batchResponses = await Promise.all(batchPromises);
        responses.push(...batchResponses);
      }

      const allPlays: BggPlay[] = responses.reduce((acc, current) => {
        const plays = current.plays?.play;
        if (!plays) {
          return acc;
        }
        const playsArray = Array.isArray(plays) ? plays : [plays];
        return [...acc, ...playsArray];
      }, [] as BggPlay[]);

      return { ...response, plays: { ...(response.plays ?? {}), play: allPlays } };
    },
    queryKey: [uri, { page, ...restParams }],
    select: (data) => {
      const plays = data.plays?.play;
      if (!plays) {
        return [];
      }
      return Array.isArray(plays) ? plays : [plays];
    },
    ...options,
    enabled,
  });
};
