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

export const useBggPlaysApi = (params: Params, { enabled = true, ...options }: Options = {}) => {
  const { get } = useApi();

  const { page = 1, ...restParams } = params;

  return useQuery({
    queryFn: ({ signal }) =>
      get<BggPlaysResponse>(uri, {
        headers: BGG_AUTH_HEADER,
        queryParams: { page, ...restParams },
        responseType: "xmlToJson",
        signal,
      }),
    queryKey: [uri, params],
    select: (data) => data.plays?.play ?? [],
    ...options,
    enabled,
  });
};
