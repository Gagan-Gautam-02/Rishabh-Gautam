"use client";

import { create } from "zustand";
import { en } from "@/lib/i18n/en";
import { getDictionary, interpolate, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "astro-bodh-locale";

type LocaleState = {
  locale: Locale;
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  hydrate: () => void;
  t: typeof en;
};

function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.classList.toggle("lang-hi", locale === "hi");
}

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: "en",
  hydrated: false,
  t: en,

  hydrate: () => {
    if (get().hydrated) return;
    let locale: Locale = "en";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "hi" || saved === "en") locale = saved;
    } catch {
      /* ignore */
    }
    applyDocumentLocale(locale);
    set({ locale, t: getDictionary(locale), hydrated: true });
  },

  setLocale: (locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    applyDocumentLocale(locale);
    set({ locale, t: getDictionary(locale) });
  },
}));

/** Convenience hook — returns dictionary + helpers. */
export function useT() {
  const locale = useLocaleStore((s) => s.locale);
  const t = useLocaleStore((s) => s.t);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return {
    locale,
    t,
    setLocale,
    tf: (template: string, vars?: Record<string, string | number>) =>
      interpolate(template, vars),
  };
}
