import type { RequestOptions } from "~/apis/utils/types";
import { removeTrailingSlash } from "~/helpers/strings";

const PATH_PARAM_PATTERN = /:\w+/;

export const replacePathParams = (url: string, pathParams?: RequestOptions["pathParams"]) => {
  if (!PATH_PARAM_PATTERN.test(url)) return url;

  const warning = `${url} has path params that should be replaced via pathParams in your request.`;
  const entries = Object.entries(pathParams ?? {});

  if (!entries.length) {
    console.warn(warning); // eslint-disable-line no-console
    return url;
  }

  // `\b` keeps `:id` from partially matching a longer placeholder such as `:idNumber`.
  const updatedUrl = entries.reduce(
    (acc, [param, value]) => acc.replace(new RegExp(`:${param}\\b`), encodeURIComponent(value)),
    url
  );

  if (PATH_PARAM_PATTERN.test(updatedUrl)) console.warn(warning); // eslint-disable-line no-console

  return updatedUrl;
};

export const appendQueryParams = (url: string, queryParams?: RequestOptions["queryParams"]) => {
  const searchParams = new URLSearchParams();

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const values = Array.isArray(value) ? value : [value];
    values.forEach((entry) => searchParams.append(key, String(entry)));
  });

  const queryString = searchParams.toString();
  if (!queryString) return url;

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
};

export const buildUrl = (
  url: string,
  pathParams?: RequestOptions["pathParams"],
  queryParams?: RequestOptions["queryParams"]
) => appendQueryParams(replacePathParams(removeTrailingSlash(url), pathParams), queryParams);
