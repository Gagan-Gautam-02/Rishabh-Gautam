"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Atom,
  Award,
  Briefcase,
  CheckCircle2,
  FileCheck,
  FileText,
  Hash,
  Heart,
  HeartHandshake,
  Home,
  Lock,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";

const serviceIconMap: Record<string, LucideIcon> = {
  Sparkles,
  HeartHandshake,
  Home,
  FileText,
  Atom,
  Phone,
  Briefcase,
  Heart,
  Activity,
  Hash,
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

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {SERVICES.map((service, i) => {
            const Icon = serviceIconMap[service.icon] ?? Sparkles;
            const localized = (t.services[service.title] as
              | { title?: string; description?: string; highlights?: string[] }
              | undefined) ?? service;
            const title = localized.title ?? service.title;
            const description = localized.description ?? service.detailedDescription;
            const highlights = localized.highlights ?? service.highlights;
            const isReverse = i % 2 === 1;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className={`group flex flex-col gap-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-md)] transition-all duration-500 hover:border-[var(--gold)]/50 hover:shadow-[var(--shadow-xl)] lg:flex-row lg:items-center ${
                  isReverse ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Service Image Side */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] shadow-inner lg:w-1/2">
                  <Image
                    src={service.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
                    <Icon className="h-4 w-4 text-[var(--gold)]" />
                    <span className="text-xs font-medium text-white/90">
                      {t.landing.servicesEyebrow} #{i + 1}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex flex-col justify-center space-y-4 lg:w-1/2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] transition-colors duration-300 group-hover:bg-[var(--gold-soft)] group-hover:text-[var(--gold-ink)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
                      {title}
                    </h3>
                  </div>

                  <p className="text-base leading-relaxed text-[var(--body)] sm:text-lg">
                    {description}
                  </p>

                  {highlights && highlights.length > 0 && (
                    <ul className="my-2 space-y-2.5">
                      {highlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-[var(--ink)]">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--gold-ink)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-2">
                    <Link
                      href={bookHref}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-[var(--shadow-sm)] transition-all duration-300 hover:bg-[var(--gold-soft)] hover:shadow-[var(--shadow-md)] hover:scale-[1.02]"
                    >
                      {t.landing.bookSession}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 100% Privacy & Anonymity Section */}
      <section id="privacy" className="border-t border-[var(--border)] bg-[var(--bg-alt)] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-[var(--gold-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--gold-ink)]">
              <ShieldCheck className="h-4 w-4" />
              <span>{t.privacy.eyebrow}</span>
            </div>
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ink)]">
              {t.privacy.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[var(--body)]">
              {t.privacy.subtitle}
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: t.privacy.feature1Title,
                desc: t.privacy.feature1Desc,
                icon: UserCheck,
              },
              {
                title: t.privacy.feature2Title,
                desc: t.privacy.feature2Desc,
                icon: FileCheck,
              },
              {
                title: t.privacy.feature3Title,
                desc: t.privacy.feature3Desc,
                icon: Shield,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)]"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--gold-soft)] p-3 text-[var(--gold-ink)]">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--body)]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-[var(--border)] bg-[var(--surface)]">
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
                <Sparkles className="h-12 w-12 text-[var(--gold)]" />
              </div>
              <p className="font-display text-2xl text-white">{t.landing.vedicAstrologer}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/60">Astro Bodh</p>
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
              {t.landing.aboutBio}
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
