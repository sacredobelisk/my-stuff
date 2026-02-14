import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/use-api/use-api";
import type { CustomQueryOptions } from "../utils/types";
import type { BggCollectionItem, BggCollectionResponse } from "./types";
import { BASE_BGG_API_URL, BGG_AUTH_HEADER } from "./utils";

type Params = {
  minrating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rated?: 0 | 1;
  rating?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  subtype?: "boardgame" | "boardgameexpansion" | "boardgameaccessory" | "rpgitem" | "rpgissue" | "videogame";
  username?: string;
};

type QueryKey = [string, Params];
type Options = CustomQueryOptions<BggCollectionResponse, Error, BggCollectionItem[], QueryKey>;

const uri = `${BASE_BGG_API_URL}/collection`;

export const useBggCollectionApi = (params: Params, { enabled = true, ...options }: Options = {}) => {
  const { get } = useApi();
  return useQuery({
    queryFn: ({ signal }) =>
      get<BggCollectionResponse>(uri, {
        headers: BGG_AUTH_HEADER,
        queryParams: params,
        responseType: "xmlToJson",
        signal,
      }),
    queryKey: [uri, params],
    select: (data) => {
      const items = data.items?.item;
      if (!items) {
        return [];
      }
      return Array.isArray(items) ? items : [items];
    },
    ...options,
    enabled,
  });
};
