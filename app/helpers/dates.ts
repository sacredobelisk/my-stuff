import { DateTimeFormatter } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";

export const MDY = DateTimeFormatter.ofPattern("MMMM d").withLocale(Locale.ENGLISH);
