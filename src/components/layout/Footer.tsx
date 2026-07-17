"use client";

import Link from "next/link";
import { AtSign, Mail, Phone, Moon } from "lucide-react";
import { APP_NAME, ASTROLOGER_NAME } from "@/lib/constants";
import { useT } from "@/store/localeStore";

export function Footer() {
  const { t, tf } = useT();
  const handle = APP_NAME.toLowerCase().replace(/\s/g, "");
  return (
    <footer
      id="contact"
      className="border-t border-[var(--border)] bg-[var(--bg-alt)]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink)]">
              <Moon className="h-4 w-4" />
            </span>
            <span className="font-display text-lg text-[var(--ink)]">
              {APP_NAME}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--faint)]">
            {tf(t.footer.blurb, { name: ASTROLOGER_NAME })}
          </p>
        </div>

        <div>
          <h3 className="eyebrow mb-4">{t.footer.contact}</h3>
          <ul className="space-y-2.5 text-sm text-[var(--body)]">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[var(--gold-ink)]" /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[var(--gold-ink)]" /> consult@{handle}.com
            </li>
            <li className="flex items-center gap-2.5">
              <AtSign className="h-4 w-4 text-[var(--gold-ink)]" /> @{handle}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-4">{t.footer.quickLinks}</h3>
          <ul className="space-y-2.5 text-sm text-[var(--body)]">
            <li>
              <Link href="/signup" className="transition-colors hover:text-[var(--primary)]">
                {t.footer.bookSession}
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-[var(--primary)]">
                {t.footer.login}
              </Link>
            </li>
            <li>
              <Link href="/#services" className="transition-colors hover:text-[var(--primary)]">
                {t.footer.services}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--faint)]">
        © {new Date().getFullYear()} {APP_NAME}. {t.footer.rights}
      </div>
    </footer>
  );
}
