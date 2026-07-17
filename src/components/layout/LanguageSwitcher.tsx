"use client";

import { Languages } from "lucide-react";
import { useT } from "@/store/localeStore";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useT();

  function toggle() {
    const next: Locale = locale === "en" ? "hi" : "en";
    setLocale(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.nav.language}
      title={locale === "en" ? t.nav.hindi : t.nav.english}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--primary-soft)] ${
        compact ? "px-2" : ""
      }`}
    >
      <Languages className="h-4 w-4 text-[var(--gold-ink)]" />
      <span className="min-w-[2.5rem] text-center">
        {locale === "en" ? "हिं" : "EN"}
      </span>
    </button>
  );
}
