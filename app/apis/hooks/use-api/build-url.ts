import { removeTrailingSlash } from "../../../helpers/strings";
import type { RequestOptions } from "../../utils/types";

export const replacePathParams = (url: string, pathParams?: RequestOptions["pathParams"]) => {
  const pathParamKeys = pathParams ? Object.keys(pathParams) : [];
  const warning = `${url} has path params that should be replaced via pathParams in your request.`;

  if (!url.match(/(:\w+)/)) return url;
  if (!pathParamKeys.length || !pathParams) {
    console.warn(warning); // eslint-disable-line no-console
    return url;
  }

  let updatedUrl = url;

  pathParamKeys.forEach((param: string) => {
    const regex = new RegExp(`:${param}`);
    updatedUrl = updatedUrl.replace(regex, encodeURIComponent(pathParams[param]));
  });

  if (updatedUrl.match(/(:\w+)/)) console.warn(warning); // eslint-disable-line no-console

  return updatedUrl;
};

export const expandArrayParams = (key: string, values: Array<string | number | boolean>) =>
  values.reduce(
    (acc: string, value: string | number | boolean, index: number) =>
      `${acc}${index ? "&" : ""}${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    ""
  );

export const appendQueryParams = (url: string, queryParams?: RequestOptions["queryParams"]) => {
  const queryParamKeys = queryParams ? Object.keys(queryParams) : [];
  let updatedUrl = url;

  if (!queryParamKeys.length || !queryParams) return url;

  queryParamKeys.forEach((param: string, index: number) => {
    const paramValue = queryParams[param];
    const queryPartial = Array.isArray(paramValue)
      ? expandArrayParams(param, paramValue)
      : `${encodeURIComponent(param)}=${encodeURIComponent(paramValue)}`;
    updatedUrl = `${updatedUrl}${index ? "&" : "?"}${queryPartial}`;
  });

  return updatedUrl;
};

export const buildUrl = (
  url: string,
  pathParams?: RequestOptions["pathParams"],
  queryParams?: RequestOptions["queryParams"]
) => {
  let updatedUrl = url;
  updatedUrl = replacePathParams(removeTrailingSlash(updatedUrl), pathParams);
  updatedUrl = appendQueryParams(updatedUrl, queryParams);

  return updatedUrl;
};
