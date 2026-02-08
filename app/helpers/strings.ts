/**
 * Removes any trailing slashes in the passed in uri.
 * @param {string} uri
 */
export const removeTrailingSlash = (uri: string) => uri.replace(/^(.+?)\/*?$/, "$1");
