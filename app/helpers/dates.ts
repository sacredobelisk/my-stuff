import { DateTimeFormatter } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";

export const MD = DateTimeFormatter.ofPattern("MMMM d").withLocale(Locale.ENGLISH);
export const MY = DateTimeFormatter.ofPattern("MMMM yyyy").withLocale(Locale.ENGLISH);
