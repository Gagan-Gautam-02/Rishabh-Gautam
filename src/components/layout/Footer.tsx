"use client";

import Link from "next/link";
import Image from "next/image";
import { AtSign, Mail } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { useT } from "@/store/localeStore";

function YtIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function WaIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useT();
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--forest-deep)]">
      {/* Background Image */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/SecondBgthree.avif"
          alt="Footer background"
          fill
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(10,23,17,0.92) 0%, rgba(8,17,13,0.97) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold"
              style={{
                background: "var(--emerald)",
                color: "var(--primary)",
                border: "1px solid var(--border)",
              }}
            >
              ॐ
            </span>
            <span className="heading text-base tracking-tight text-[var(--ink)]">
              {APP_NAME}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--faint)]">{t.footer.blurb}</p>

          {/* Social links */}
          <div className="mt-5 flex items-center gap-3">
            <a href="https://www.youtube.com/@ShastriyaYogshala" target="_blank" rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ background: "rgba(255,0,0,0.12)", color: "#FF0000", border: "1px solid rgba(255,0,0,0.2)" }}
              aria-label="YouTube">
              <YtIcon />
            </a>
            <a href="https://wa.me/917300530090" target="_blank" rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ background: "rgba(37,211,102,0.12)", color: "#25D366", border: "1px solid rgba(37,211,102,0.2)" }}
              aria-label="WhatsApp">
              <WaIcon />
            </a>
            <a href="mailto:shastriyayogshala@gmail.com"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
              style={{ background: "rgba(201,162,39,0.1)", color: "var(--gold-ink)", border: "1px solid var(--brass-hairline)" }}
              aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-4">{t.footer.contact}</h3>
          <ul className="space-y-2.5 text-sm text-[var(--body)]">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[var(--gold-ink)]" /> shastriyayogshala@gmail.com
            </li>
            <li className="flex items-center gap-2.5">
              <AtSign className="h-4 w-4 text-[var(--gold-ink)]" />
              <a href="https://www.youtube.com/@ShastriyaYogshala" target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors">
                @ShastriyaYogshala
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <WaIcon />
              <a href="https://wa.me/917300530090" target="_blank" rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors">
                WhatsApp
              </a>
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
              <Link href="/#yoga" className="transition-colors hover:text-[var(--primary)]">
                Yoga Programs
              </Link>
            </li>
            <li>
              <Link href="/#jyotish" className="transition-colors hover:text-[var(--primary)]">
                {t.footer.services}
              </Link>
            </li>
            <li>
              <a href="https://www.youtube.com/@ShastriyaYogshala" target="_blank" rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--primary)]">
                YouTube Channel
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-[var(--border)] py-5 text-center text-xs text-[var(--faint)]">
        © {new Date().getFullYear()} {APP_NAME}. {t.footer.rights}
      </div>
    </footer>
  );
}
