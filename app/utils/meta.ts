const SITE_NAME = "Sean OBrien";
const SITE_URL = "https://www.sean-obrien.net";

interface PageMetaOptions {
  description: string;
  /** Path of the page, relative to the site root. Defaults to the root itself. */
  path?: string;
  title: string;
}

/** Builds the title, description, OpenGraph and Twitter meta tags shared by every page. */
export const buildPageMeta = ({ description, path = "", title }: PageMetaOptions) => {
  const fullTitle = `${title} - ${SITE_NAME}`;

  return [
    { title: fullTitle },
    { content: description, name: "description" },
    { content: description, property: "og:description" },
    { content: fullTitle, property: "og:title" },
    { content: "website", property: "og:type" },
    { content: `${SITE_URL}${path}`, property: "og:url" },
    { content: "summary", name: "twitter:card" },
    { content: description, name: "twitter:description" },
    { content: fullTitle, name: "twitter:title" },
  ];
};
