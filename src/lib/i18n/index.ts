import { en } from "./en";
import { hi } from "./hi";
import type { Locale } from "./types";

export type { Locale, Dictionary } from "./types";
export { en, hi };

export const dictionaries = { en, hi } as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? en;
}

/** Replace `{name}` style placeholders in a string. */
export function interpolate(
  template: string,
  vars?: Record<string, string | number>
) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}
