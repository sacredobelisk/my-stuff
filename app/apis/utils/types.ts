import type { DefaultError, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import type { PartialProperty } from "../../utils/types";
import { ERROR_MESSAGES } from "./utils";

export type ResponseType = "blob" | "json" | "text" | "xml" | "xmlToJson";

export type QueryParamObject = { [key: string]: (string | number | boolean) | Array<string | number | boolean> };

export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  pathParams?: Record<string, string | number | boolean>;
  queryParams?: QueryParamObject;
  responseType?: ResponseType;
}

export interface UseApiOptions {
  defaultHeaders?: Record<string, string>;
  onError?: (error: ApiError) => void;
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;

  constructor(status: number, statusText: string, body?: unknown) {
    super(ERROR_MESSAGES[status] ?? `HTTP Error ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export type CustomQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = PartialProperty<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey">;
