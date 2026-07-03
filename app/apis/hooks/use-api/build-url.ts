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

export const appendQueryParams = (url: string, queryParams?: RequestOptions["queryParams"]) => {
  if (!queryParams || !Object.keys(queryParams).length) return url;

  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([param, paramValue]) => {
    const values = Array.isArray(paramValue) ? paramValue : [paramValue];
    values.forEach((value) => searchParams.append(param, String(value)));
  });

  return `${url}${url.includes("?") ? "&" : "?"}${searchParams}`;
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
