import { XMLParser, type X2jOptions } from "fast-xml-parser";
import { type ResponseType } from "../../utils/types";

const xmlParserOptions: X2jOptions = {
  allowBooleanAttributes: true,
  attributeNamePrefix: "",
  ignoreAttributes: false,
  ignoreDeclaration: true,
  parseAttributeValue: true,
  trimValues: true,
};

export const parseResponse = async <T>(response: Response, responseType: ResponseType): Promise<T> => {
  switch (responseType) {
    case "json":
      return (await response.json()) as T;
    case "text":
      return (await response.text()) as T;
    case "blob":
      return (await response.blob()) as T;
    case "xmlToJson": {
      const text = await response.text();
      const parser = new XMLParser(xmlParserOptions);
      return parser.parse(text) as T;
    }
    case "xml": {
      const text = await response.text();
      const parser = new DOMParser();
      return parser.parseFromString(text, "application/xml") as T;
    }
  }
};
