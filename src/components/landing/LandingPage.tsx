"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Atom,
  Award,
  Baby,
  BookMarked,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarDays,
  CircleDot,
  ClipboardCheck,
  Clock,
  Crosshair,
  FileText,
  Gem,
  Hash,
  Heart,
  HeartHandshake,
  HelpCircle,
  Home,
  IndianRupee,
  Languages,
  Laptop,
  Library,
  Lightbulb,
  Monitor,
  Orbit,
  Phone,
  Sparkles,
  Star,
  Sun,
  Tv,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ASTROLOGER_NAME, FREE_FEATURES, SERVICES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";

const serviceIconMap = { Briefcase, Heart, Activity, Home, Hash, Sparkles };

/** YinYang / Snake aren't in lucide — use close substitutes. */
const freeIconMap: Record<string, LucideIcon> = {
  Sparkles,
  HeartHandshake,
  Users,
  HelpCircle,
  Monitor,
  Briefcase,
  BookOpen,
  ClipboardCheck,
  Phone,
  IndianRupee,
  Calendar,
  BookMarked,
  Orbit,
  CalendarDays,
  Baby,
  Atom,
  FileText,
  Laptop,
  Languages,
  Hash,
  Star,
  Lightbulb,
  Heart,
  Gem,
  Crosshair,
  CircleDot,
  Sun,
  Clock,
  Tv,
  Library,
};

export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { t, tf } = useT();
  const reduce = useReducedMotion();
  const bookHref = user ? "/dashboard" : "/signup";

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main>
      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-3 rounded-[2rem] border-2 border-[var(--gold)]/65 sm:inset-4 sm:rounded-[2.5rem]">
          <div className="constellation absolute inset-0 rounded-[2rem] opacity-70 sm:rounded-[2.5rem]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(252,173,3,0.14),_transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-24 pt-12 text-center sm:px-6 sm:pt-16">
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="glow-ring relative mb-8 h-36 w-36 overflow-hidden rounded-full border border-[var(--gold)]/40 shadow-[var(--shadow-md)] sm:mb-10 sm:h-44 sm:w-44"
          >
            <Image
              src="/astro-bodh-logo.png"
              alt="Astro Bodh logo"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 144px, 176px"
            />
          </motion.div>

          <motion.p {...rise(0.08)} className="eyebrow mb-4">
            {t.landing.philosophyTitle}
          </motion.p>
          <motion.h1
            {...rise(0.14)}
            className="max-w-4xl font-display text-[clamp(1.85rem,4.5vw,3rem)] font-semibold leading-[1.15] text-[var(--ink)]"
          >
            {t.landing.headline}
          </motion.h1>
          <motion.p
            {...rise(0.2)}
            className="mt-6 mb-7 max-w-2xl text-[clamp(0.95rem,2.5vw,1.125rem)] leading-relaxed text-[var(--body)]"
          >
            {t.landing.philosophyBody}
          </motion.p>
          <motion.div
            {...rise(0.28)}
            className="mt-2 flex flex-col items-center gap-4 sm:flex-row"
          >
            <div className="glow-ring">
              <Link href={bookHref}>
                <Button size="lg">{t.landing.bookSession}</Button>
              </Link>
            </div>
            <Link
              href="/#services"
              className="text-sm font-medium text-[var(--primary)] underline-offset-4 hover:underline"
            >
              {t.landing.learnMore}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Free Horoscope & Astrology Services */}
      <section
        id="free-tools"
        className="border-y border-[var(--border)] bg-[var(--bg-alt)]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="mb-4 text-center"
          >
            <p className="eyebrow mb-3">{t.landing.freeEyebrow}</p>
            <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold text-[var(--ink)]">
              {t.landing.freeTitle}
            </h2>
          </motion.div>
          <div className="divider-celestial mb-10">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] shadow-[var(--shadow-sm)]">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              {FREE_FEATURES.map((feature, i) => {
                const Icon = freeIconMap[feature.icon] ?? Sparkles;
                const featured =
                  "featured" in feature && feature.featured === true;
                const href = featured ? bookHref : "/#services";
                const label =
                  t.freeFeatures[feature.title] ?? feature.title;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      delay: Math.min(i * 0.015, 0.3),
                      duration: 0.3,
                    }}
                  >
                    <Link
                      href={href}
                      className={`flex min-h-[56px] items-center gap-3 px-4 py-3.5 transition-colors ${
                        featured
                          ? "bg-[var(--primary-soft)] hover:bg-[var(--gold-soft)]"
                          : "bg-[var(--surface)] hover:bg-[var(--bg-alt)]"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          featured
                            ? "bg-[var(--primary)] text-[var(--ink)]"
                            : "bg-[var(--gold-soft)] text-[var(--gold-ink)]"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="text-sm font-medium leading-snug text-[var(--ink)]">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <p className="eyebrow mb-3">{t.landing.servicesEyebrow}</p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ink)]">
            {t.landing.servicesTitle}
          </h2>
        </motion.div>
        <div className="divider-celestial mb-12">
          <Star className="h-3.5 w-3.5 fill-current" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = serviceIconMap[service.icon];
            const localized = t.services[service.title] ?? service;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:border-[var(--gold)]/50 hover:shadow-[var(--shadow-lg)]"
              >
                <div className="mb-5 inline-flex rounded-xl bg-[var(--primary-soft)] p-3 text-[var(--primary)] transition-colors duration-300 group-hover:bg-[var(--gold-soft)] group-hover:text-[var(--gold-ink)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
                  {localized.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--faint)]">
                  {localized.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="glow-ring relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--gold)]/40 bg-[linear-gradient(150deg,#3a3208,#1a1608)] shadow-[var(--glow)]"
          >
            <div className="constellation absolute inset-0 opacity-50" />
            <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--gold)]/60 bg-white/5 backdrop-blur">
                <span className="font-display text-4xl text-[var(--gold)]">RG</span>
              </div>
              <p className="font-display text-2xl text-white">{ASTROLOGER_NAME}</p>
              <p className="mt-1 text-sm text-white/60">{t.landing.vedicAstrologer}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-3">{t.landing.aboutEyebrow}</p>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ink)]">
              {t.landing.aboutTitle}
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--body)]">
              {tf(t.landing.aboutBio, { name: ASTROLOGER_NAME })}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: t.landing.yearsExp, value: "12+", icon: Award },
                { label: t.landing.consultations, value: "5,000+", icon: Users },
                { label: t.landing.avgRating, value: "4.9", icon: Star },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-[var(--shadow-sm)]"
                >
                  <stat.icon className="mx-auto mb-2 h-4 w-4 text-[var(--gold-ink)]" />
                  <p className="font-display text-2xl font-semibold text-[var(--primary)]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--faint)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-1 text-[var(--gold)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-[var(--faint)]">
                {t.landing.ratedBy}
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
