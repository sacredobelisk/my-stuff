import { describe, expect, it, vi } from "vitest";
import { appendQueryParams, buildUrl, replacePathParams } from "~/apis/hooks/use-api/build-url";

const url = "https://example.com/api";

describe("replacePathParams", () => {
  it("substitutes a path param", () => {
    expect(replacePathParams(`${url}/users/:id`, { id: 7 })).toBe(`${url}/users/7`);
  });

  it("encodes the substituted value", () => {
    expect(replacePathParams(`${url}/users/:name`, { name: "a b" })).toBe(`${url}/users/a%20b`);
  });

  it("leaves a url without placeholders alone", () => {
    expect(replacePathParams(url, { id: 7 })).toBe(url);
  });

  it("warns and returns the url unchanged when a placeholder has no matching param", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(replacePathParams(`${url}/users/:id`)).toBe(`${url}/users/:id`);
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
  });

  it("does not let a shorter param partially match a longer placeholder", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(replacePathParams(`${url}/:idNumber`, { id: 7 })).toBe(`${url}/:idNumber`);

    warn.mockRestore();
  });
});

describe("appendQueryParams", () => {
  it("returns the url unchanged when there are no params", () => {
    expect(appendQueryParams(url)).toBe(url);
    expect(appendQueryParams(url, {})).toBe(url);
  });

  it("appends params with a leading question mark", () => {
    expect(appendQueryParams(url, { page: 1, username: "sean" })).toBe(`${url}?page=1&username=sean`);
  });

  it("uses an ampersand when the url already has a query string", () => {
    expect(appendQueryParams(`${url}?existing=1`, { page: 2 })).toBe(`${url}?existing=1&page=2`);
  });

  it("expands array values into repeated keys", () => {
    expect(appendQueryParams(url, { tag: ["a", "b"] })).toBe(`${url}?tag=a&tag=b`);
  });

  it("skips empty arrays rather than leaving a dangling separator", () => {
    expect(appendQueryParams(url, { tag: [] })).toBe(url);
  });

  it("skips undefined values instead of stringifying them", () => {
    expect(appendQueryParams(url, { page: undefined, username: "sean" })).toBe(`${url}?username=sean`);
  });

  it("encodes keys and values", () => {
    expect(appendQueryParams(url, { "q u": "a&b" })).toBe(`${url}?q+u=a%26b`);
  });
});

describe("buildUrl", () => {
  it("trims the trailing slash before appending the query string", () => {
    expect(buildUrl(`${url}/`, undefined, { page: 1 })).toBe(`${url}?page=1`);
  });

  it("combines path params and query params", () => {
    expect(buildUrl(`${url}/users/:id`, { id: 7 }, { page: 2 })).toBe(`${url}/users/7?page=2`);
  });
});
