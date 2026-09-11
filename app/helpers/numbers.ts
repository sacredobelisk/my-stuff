const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

/** Formats a number as US currency, e.g. `1234.5` becomes `$1,234.50`. */
export const formatCurrency = (value: number) => CURRENCY_FORMATTER.format(value);

/** Rounds a number to two decimal places. */
export const roundToCents = (value: number) => Math.round(value * 100) / 100;
