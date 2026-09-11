import { useQuery } from "@tanstack/react-query";
import type { BggPlay, BggPlaysResponse } from "~/apis/bgg/types";
import { BASE_BGG_API_URL, BGG_PAGE_SIZE } from "~/apis/bgg/utils";
import { useApi } from "~/apis/hooks/use-api/use-api";
import type { CustomQueryOptions } from "~/apis/utils/types";

// A type alias rather than an interface so it keeps the implicit index signature `queryParams` needs.
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

type PageParams = Omit<Params, "page">;
type GetRequest = ReturnType<typeof useApi>["get"];
type QueryKey = [string, Params];
type Options = CustomQueryOptions<BggPlaysResponse, Error, BggPlay[], QueryKey>;

/** How many page requests to have in flight at once when pulling a full history. */
const PAGE_BATCH_SIZE = 5;

const uri = `${BASE_BGG_API_URL}/plays`;

/** The XML parser collapses a single `<play>` into an object, so normalise back to an array. */
const toPlaysArray = (response: BggPlaysResponse): BggPlay[] => {
  const plays = response.plays?.play;
  if (!plays) return [];
  return Array.isArray(plays) ? plays : [plays];
};

const fetchPlaysPage = (get: GetRequest, params: PageParams, page: number, signal?: AbortSignal) =>
  get<BggPlaysResponse>(uri, {
    queryParams: { ...params, page },
    responseType: "xmlToJson",
    signal,
  });

/**
 * Pulls every page of plays and merges them into the shape of the first response. Pages go out in
 * small batches rather than all at once, to stay friendly to BGG's rate limiting.
 */
const fetchAllPlaysPages = async (get: GetRequest, params: PageParams, signal?: AbortSignal) => {
  const firstPage = await fetchPlaysPage(get, params, 1, signal);
  const totalPages = Math.ceil((firstPage.plays?.total ?? 0) / BGG_PAGE_SIZE);

  if (totalPages <= 1) return firstPage;

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
  const responses: BggPlaysResponse[] = [firstPage];

  for (let start = 0; start < remainingPages.length; start += PAGE_BATCH_SIZE) {
    const batch = remainingPages.slice(start, start + PAGE_BATCH_SIZE);
    responses.push(...(await Promise.all(batch.map((page) => fetchPlaysPage(get, params, page, signal)))));
  }

  return { ...firstPage, plays: { ...firstPage.plays, play: responses.flatMap(toPlaysArray) } };
};

export const useBggPlaysApi = ({ page = 1, ...restParams }: Params, { enabled = true, ...options }: Options = {}) => {
  const { get } = useApi();

  return useQuery({
    queryFn: ({ signal }) =>
      page === "ALL" ? fetchAllPlaysPages(get, restParams, signal) : fetchPlaysPage(get, restParams, page, signal),
    queryKey: [uri, { page, ...restParams }],
    select: toPlaysArray,
    ...options,
    enabled,
  });
};
