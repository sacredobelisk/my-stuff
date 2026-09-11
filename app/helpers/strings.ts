/**
 * Removes any trailing slashes from the passed in uri.
 * @param uri - The uri to trim.
 */
export const removeTrailingSlash = (uri: string) => uri.replace(/\/+$/, "");
