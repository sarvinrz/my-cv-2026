"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Replace ASCII digits with Persian digits when locale is `fa`. */
export function localizeDigits(value: string | number, locale: string): string {
  if (locale !== "fa") return String(value);
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)]!);
}

export function formatIndex(n: number, locale: string, pad = 2): string {
  return localizeDigits(String(n).padStart(pad, "0"), locale);
}

export function formatCounter(current: number, total: number, locale: string): string {
  return `${localizeDigits(current, locale)} / ${localizeDigits(total, locale)}`;
}

export function useLocaleFormat() {
  const locale = useLocale();

  return useMemo(
    () => ({
      locale,
      digits: (value: string | number) => localizeDigits(value, locale),
      index: (n: number, pad = 2) => formatIndex(n, locale, pad),
      counter: (current: number, total: number) => formatCounter(current, total, locale),
      number: (n: number, options?: Intl.NumberFormatOptions) =>
        new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US", options).format(n),
    }),
    [locale],
  );
}
