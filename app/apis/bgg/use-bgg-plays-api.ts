import { useQuery } from "@tanstack/react-query";
import { useApi } from "../hooks/use-api/use-api";
import type { CustomQueryOptions } from "../utils/types";
import type { BggPlay, BggPlaysResponse } from "./types";
import { BASE_BGG_API_URL, BGG_AUTH_HEADER } from "./utils";

type Params = {
  id?: string;
  maxdate?: string;
  mindate?: string;
  page?: number;
  subtype?: string;
  type?: "family" | "thing";
  username?: string;
};

type QueryKey = [string, Params];
type Options = CustomQueryOptions<BggPlaysResponse, Error, BggPlay[], QueryKey>;

const uri = `${BASE_BGG_API_URL}/plays`;

export const useBggPlaysApi = ({ page = 1, ...restParams }: Params, { enabled = true, ...options }: Options = {}) => {
  const { get } = useApi();
  return useQuery({
    queryFn: ({ signal }) =>
      get<BggPlaysResponse>(uri, {
        headers: BGG_AUTH_HEADER,
        queryParams: { page, ...restParams },
        responseType: "xmlToJson",
        signal,
      }),
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
