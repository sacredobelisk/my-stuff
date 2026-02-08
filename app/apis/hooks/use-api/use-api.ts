import { useMemo, useRef } from "react";
import { ApiError, type RequestOptions, type UseApiOptions } from "../../utils/types";
import { parseResponse } from "./build-response";
import { buildUrl } from "./build-url";

export const useApi = (options: UseApiOptions = {}) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  return useMemo(() => {
    async function baseFetch<T>(
      url: string,
      method: string,
      body?: unknown,
      requestOptions: RequestOptions = {}
    ): Promise<T> {
      const { defaultHeaders = {}, onError } = optionsRef.current;
      const {
        headers: requestHeaders,
        responseType = "json",
        pathParams,
        queryParams,
        ...fetchOptions
      } = requestOptions;

      const headers: Record<string, string> = {
        ...defaultHeaders,
        ...(requestHeaders as Record<string, string>),
      };

      if (body !== undefined && !(body instanceof FormData) && !(body instanceof Blob)) {
        headers["Content-Type"] ??= "application/json";
      }

      const response = await fetch(buildUrl(url, pathParams, queryParams), {
        method,
        headers,
        body:
          body !== undefined
            ? body instanceof FormData || body instanceof Blob || typeof body === "string"
              ? body
              : JSON.stringify(body)
            : undefined,
        ...fetchOptions,
      });

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          // response body may not be JSON
        }

        const error = new ApiError(response.status, response.statusText, errorBody);
        onError?.(error);
        throw error;
      }

      return parseResponse<T>(response, responseType);
    }

    const get = <T>(url: string, options?: RequestOptions) => {
      return baseFetch<T>(url, "GET", undefined, options);
    };

    const post = <T>(url: string, body?: unknown, options?: RequestOptions) => {
      return baseFetch<T>(url, "POST", body, options);
    };

    const put = <T>(url: string, body?: unknown, options?: RequestOptions) => {
      return baseFetch<T>(url, "PUT", body, options);
    };

    const patch = <T>(url: string, body?: unknown, options?: RequestOptions) => {
      return baseFetch<T>(url, "PATCH", body, options);
    };

    const del = <T>(url: string, options?: RequestOptions) => {
      return baseFetch<T>(url, "DELETE", undefined, options);
    };

    return { del, get, patch, post, put };
  }, []);
};
