import { describe, expect, it } from "vitest";
import { removeTrailingSlash } from "~/helpers/strings";

describe("removeTrailingSlash", () => {
  it("removes a single trailing slash", () => {
    expect(removeTrailingSlash("https://example.com/api/")).toBe("https://example.com/api");
  });

  it("removes repeated trailing slashes", () => {
    expect(removeTrailingSlash("https://example.com/api///")).toBe("https://example.com/api");
  });

  it("leaves a url without a trailing slash alone", () => {
    expect(removeTrailingSlash("https://example.com/api")).toBe("https://example.com/api");
  });

  it("does not touch slashes in the middle of the url", () => {
    expect(removeTrailingSlash("https://example.com/a/b/c")).toBe("https://example.com/a/b/c");
  });
});
