"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown, CheckCircle2, Sparkles, HeartHandshake, Home, FileText, Atom, Phone } from "lucide-react";
import { SERVICES, APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";

// Social brand icons — lucide-react removed these, using inline SVGs
function IgIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FbIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.13 4.388 23.17 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.17 24 18.13 24 12.073z" />
    </svg>
  );
}


// ── Brass Line ───────────────────────────────────────────────────
function BrassLine() {
  return <hr className="brass-line my-0 w-full border-0" />;
}

// ── Data ─────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "शास्त्रीय योग", "Classical Hatha", "Vedic Astrology", "Pranayama", "KP System",
  "Dhyana", "Kundli Reading", "Surya Namaskar", "Jyotish Darshan", "Yoga Nidra",
];

const YOGA_COURSES = [
  {
    id: "01", duration: "1 Month", hindi: "एक महीना", tagline: "Foundation",
    fee: "₹2,500", serial: "No. 001",
    teaches: ["Surya Namaskar — 12 forms", "Anulom Vilom & Bhramari", "Basic Dhyana", "Foundational asanas", "Sattvic diet principles"],
  },
  {
    id: "02", duration: "3 Months", hindi: "तीन महीने", tagline: "Deepening",
    fee: "₹6,500", serial: "No. 002", featured: true,
    teaches: ["Intermediate sequences", "Nadi Shodhana Pranayama", "Chakra awareness", "Yoga Nidra", "Yoga Sutras intro", "Mudra & Bandha"],
  },
  {
    id: "03", duration: "6 Months", hindi: "छः महीने", tagline: "Mastery",
    fee: "₹11,000", serial: "No. 003",
    teaches: ["Advanced asanas", "Complete Pranayama (8 types)", "Jyotish & yoga integration", "Teaching methodology", "Samkhya philosophy"],
  },
];

const SERVICE_ICONS: Record<string, React.ElementType> = { Sparkles, HeartHandshake, Home, FileText, Atom, Phone };

const SOCIAL = [
  { label: "Instagram", handle: "@shastriyayogshala", href: "https://instagram.com/shastriyayogshala", Icon: IgIcon, color: "#E1306C" },
  { label: "Facebook", handle: "Shastriya Yogshala", href: "https://facebook.com/shastriyayogshala", Icon: FbIcon, color: "#1877F2" },
];

function useRise() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 as const },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
}

export function LandingPage() {
  const user = useAuthStore((s) => s.user);
  const { t, locale } = useT();
  const isHi = locale === "hi";
  const bookHref = user ? "/dashboard" : "/signup";
  const rise = useRise();

  return (
    <main style={{ background: "var(--forest)" }}>

      {/* ══ 1. HERO ════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[92vh] flex flex-col justify-center items-center text-center overflow-hidden px-5 sm:px-8 lg:px-16 pt-24 pb-16">
        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(31,111,79,0.24) 0%, transparent 70%)" }} />
        <div className="constellation pointer-events-none absolute inset-0 opacity-40" />

        {/* ── Top Center Logo & Location Badge ── */}
        <motion.div {...rise(0)} className="relative z-10 flex flex-col items-center mb-6">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full overflow-hidden p-1 shadow-[0_0_50px_rgba(201,162,39,0.28)] border-2 border-[var(--brass)] bg-[var(--forest-deep)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_65px_rgba(201,162,39,0.42)]">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image
                src="/astro-bodh-logo.png"
                alt="Shastriya Yogshala Logo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
              />
            </div>
          </div>

          {/* Location badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium"
            style={{ background: "rgba(201,162,39,0.08)", border: "1px solid var(--brass-hairline)", color: "var(--cream-muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brass)" }} />
            <span className="eyebrow tracking-widest text-[11px]">
              {isHi ? "शास्त्रीय योगशाला · ऋषिकेश, भारत · स्थापित 2012" : "Shastriya Yogshala · Rishikesh, India · Est. 2012"}
            </span>
          </div>
        </motion.div>

        {/* ── Display headline (single, localized) ── */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 {...rise(0.08)} className="heading text-[clamp(2.4rem,6vw,5.5rem)] leading-[1.05] tracking-tight mb-4">
            {t.landing.welcomeTitle}
          </motion.h1>

          <motion.p {...rise(0.16)} className="max-w-2xl text-base sm:text-lg leading-relaxed mb-8" style={{ color: "var(--cream-muted)" }}>
            {t.landing.heroSubtext}
          </motion.p>
        </div>

        {/* ── CTA row ── */}
        <motion.div {...rise(0.3)} className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href={bookHref}>
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] shadow-[0_4px_20px_rgba(201,162,39,0.25)]"
              style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
              {isHi ? "सत्र बुक करें" : "Book a Session"} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/#yoga">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[var(--brass-soft)]"
              style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
              {t.landing.exploreCourses}
            </button>
          </Link>
        </motion.div>

        {/* Scroll cue */}
        <motion.div {...rise(0.4)} className="mt-12 hidden sm:flex flex-col items-center gap-2">
          <span className="eyebrow text-[10px]" style={{ color: "var(--cream-faint)" }}>Scroll</span>
          <button
            onClick={() => {
              const el = document.getElementById("yoga");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-label="Scroll down"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:translate-y-1 hover:text-[var(--brass)]"
            style={{ border: "1px solid var(--brass-hairline)", color: "var(--cream-muted)" }}>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </section>

      <BrassLine />

      {/* ══ 2. FEATURED VISUAL ════════════════════════════════════ */}
      <section className="relative h-[480px] sm:h-[560px] overflow-hidden">
        {/* bg gradient fallback */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1711 0%, #1f6f4f 60%, #0d1f17 100%)" }} />

        {/* SecondBg background image */}
        <Image src="/SecondBg.avif" alt="Ancient wisdom, living practice" fill className="object-cover img-editorial" sizes="100vw" priority />

        {/* Forest-to-transparent gradient overlay for text readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,23,17,0.88) 0%, rgba(10,23,17,0.55) 55%, rgba(10,23,17,0.15) 100%)" }} />

        {/* Dark vignette at bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,23,17,0.7) 0%, transparent 50%)" }} />

        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16">
          <p className="eyebrow mb-2">No. 001 — Featured</p>
          <p className="script text-[clamp(1.5rem,4vw,2.5rem)]">Ancient wisdom, living practice</p>
          <p className="mt-2 text-sm max-w-sm" style={{ color: "var(--cream-muted)" }}>
            Classical yoga as documented in Patanjali's Yoga Sutras — preserved, practiced, and passed forward.
          </p>
        </div>
      </section>

      <BrassLine />

      {/* ══ 3. MARQUEE ════════════════════════════════════════════ */}
      <section className="overflow-hidden py-5" style={{ background: "var(--forest-deep)" }}>
        <div className="marquee-track select-none">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-sm font-semibold tracking-widest uppercase whitespace-nowrap" style={{ color: "var(--cream-muted)" }}>
              {item}
              <span style={{ color: "var(--brass)", fontSize: "0.6rem" }}>◆</span>
            </span>
          ))}
        </div>
      </section>

      <BrassLine />

      {/* ══ 4. YOGA COURSES GRID ══════════════════════════════════ */}
      <section id="yoga" className="py-20 sm:py-28 px-5 sm:px-8 lg:px-16 max-w-[1240px] mx-auto">
        <motion.div {...rise(0)} className="mb-14">
          <p className="eyebrow mb-4">शास्त्रीय योगशाला</p>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="heading text-[clamp(2.5rem,6vw,5rem)]">Yoga</h2>
            <span className="script text-[clamp(1.5rem,4vw,3.5rem)]">Programs</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--cream-muted)" }}>
            तीन स्तरों में उपलब्ध शास्त्रीय पाठ्यक्रम — नौसिखिए से उन्नत साधक तक।
          </p>
        </motion.div>

        {/* Asymmetric grid: card1 tall (2 rows), card2 square, card3 square, card4 wide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">

          {/* Card 1 — tall (2 rows) with YogaImage1 on top half */}
          <motion.div {...rise(0.05)} className="group card-editorial rounded-2xl lg:row-span-2 relative cursor-pointer overflow-hidden"
            style={{ background: "linear-gradient(150deg, var(--emerald) 0%, var(--forest-deep) 100%)", border: "1px solid var(--brass-hairline)" }}>
            {/* Image — top 50% */}
            <div className="absolute inset-x-0 top-0 h-[50%]">
              <Image
                src="/YogaImage1.jpg"
                alt="1 Month Yoga Program"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {/* gradient fade into card background */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--emerald) 100%)" }} />
            </div>
            {/* Text — bottom 50% */}
            <div className="absolute inset-x-0 bottom-0 h-[50%] flex flex-col justify-between p-5">
              <div>
                <p className="eyebrow mb-1" style={{ fontSize: "0.6rem" }}>{YOGA_COURSES[0].serial}</p>
                <p className="heading text-2xl sm:text-3xl leading-tight">{YOGA_COURSES[0].duration}</p>
                <p className="script text-lg mt-0.5">{YOGA_COURSES[0].hindi}</p>
              </div>
              <div>
                <ul className="space-y-1 mb-4">
                  {YOGA_COURSES[0].teaches.slice(0, 3).map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--cream-muted)" }}>
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "var(--brass)" }} /> {t}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="heading text-xl" style={{ color: "var(--brass)" }}>{YOGA_COURSES[0].fee}</span>
                  <Link href={bookHref}>
                    <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300 hover:gap-2.5"
                      style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
                      Enroll <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — square, featured, with YogaImage2 on left half */}
          <motion.div {...rise(0.1)} className="group card-editorial rounded-2xl relative cursor-pointer overflow-hidden"
            style={{ background: "var(--forest-mid)", border: "1px solid var(--brass)" }}>
            {/* Image — left 50% */}
            <div className="absolute inset-y-0 left-0 w-[50%]">
              <Image
                src="/YogaImage2.jpg"
                alt="3 Month Yoga Program"
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* fade into card background */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 40%, var(--forest-mid) 100%)" }} />
            </div>
            {/* Text — right 50% */}
            <div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="eyebrow" style={{ fontSize: "0.6rem" }}>{YOGA_COURSES[1].serial}</p>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>Popular</span>
                </div>
                <p className="heading text-2xl leading-tight">{YOGA_COURSES[1].duration}</p>
                <p className="script text-lg mt-0.5">{YOGA_COURSES[1].hindi}</p>
              </div>
              <div>
                <span className="heading text-xl" style={{ color: "var(--brass)" }}>{YOGA_COURSES[1].fee}</span>
                <Link href={bookHref}>
                  <button className="mt-3 w-full py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:opacity-90"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                    Enroll Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — square, with YogaImage3 on left half */}
          <motion.div {...rise(0.15)} className="group card-editorial rounded-2xl relative cursor-pointer overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--forest-mid) 0%, rgba(31,111,79,0.2) 100%)", border: "1px solid var(--brass-hairline)" }}>
            {/* Image — left 50% */}
            <div className="absolute inset-y-0 left-0 w-[50%]">
              <Image
                src="/YogaImage3.jpg"
                alt="6 Month Yoga Program"
                fill
                className="object-cover"
                sizes="200px"
              />
              {/* fade into card background */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 40%, var(--forest-mid) 100%)" }} />
            </div>
            {/* Text — right 50% */}
            <div className="absolute inset-y-0 right-0 w-[50%] flex flex-col justify-between p-5">
              <div>
                <p className="eyebrow mb-1" style={{ fontSize: "0.6rem" }}>{YOGA_COURSES[2].serial}</p>
                <p className="heading text-2xl leading-tight">{YOGA_COURSES[2].duration}</p>
                <p className="script text-lg mt-0.5">{YOGA_COURSES[2].hindi}</p>
              </div>
              <div>
                <span className="heading text-xl" style={{ color: "var(--brass)" }}>{YOGA_COURSES[2].fee}</span>
                <Link href={bookHref}>
                  <button className="mt-3 w-full py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:bg-[var(--brass-soft)]"
                    style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — wide editorial (span 2 cols) */}
          <motion.div {...rise(0.2)} className="group card-editorial rounded-2xl lg:col-span-2 relative cursor-pointer"
            style={{ background: "linear-gradient(90deg, var(--forest-deep) 0%, rgba(31,111,79,0.12) 100%)", border: "1px solid var(--brass-hairline)" }}>
            <div className="card-overlay-content h-full grid grid-cols-1 sm:grid-cols-2 gap-6 p-7 items-center">
              <div>
                <p className="eyebrow mb-3">Complete Journey</p>
                <h3 className="heading text-2xl sm:text-3xl mb-3">All Three Courses</h3>
                <p className="script text-lg">Transformation awaits</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--cream-muted)" }}>
                  Enroll in the full 6-month mastery program and experience the complete arc of classical yogic transformation — body, breath, and mind.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {YOGA_COURSES.map(c => (
                  <div key={c.id} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(201,162,39,0.06)", border: "1px solid var(--brass-hairline)" }}>
                    <span className="text-sm font-medium" style={{ color: "var(--cream)" }}>{c.duration}</span>
                    <span className="heading text-sm" style={{ color: "var(--brass)" }}>{c.fee}</span>
                  </div>
                ))}
                <Link href={bookHref}>
                  <button className="w-full py-3 rounded-full text-sm font-semibold mt-1 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                    Begin Your Journey <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <BrassLine />

      {/* ══ 5. JYOTISH — NUMBERED SERVICES ═══════════════════════ */}
      <section id="jyotish" className="py-20 sm:py-28 px-5 sm:px-8 lg:px-16 max-w-[1240px] mx-auto">
        <motion.div {...rise(0)} className="mb-14">
          <p className="eyebrow mb-4">ज्योतिष</p>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="heading text-[clamp(2.5rem,6vw,5rem)]">Jyotish</h2>
            <span className="script text-[clamp(1.5rem,4vw,3.5rem)]">Darshan</span>
          </div>
          <p className="mt-3 heading text-base sm:text-lg" style={{ letterSpacing: "0.02em", lineHeight: "1.4", textTransform: "none" }}>
            <span style={{ color: "var(--cream-muted)", fontWeight: 400 }}>Shastriya Yogshala mein Jyotish ke dwara marg darshan</span>
          </p>
        </motion.div>

        {/* Numbered service rows */}
        <div style={{ borderTop: "1px solid var(--brass-hairline)" }}>
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Sparkles;
            return (
              <motion.div key={service.title} {...rise(0.06 * i)}>
                <Link href={bookHref}>
                  <div className="service-row group flex items-center gap-6 py-5 px-4 rounded-xl cursor-pointer" style={{ borderBottom: "1px solid var(--brass-hairline)" }}>
                    {/* Index */}
                    <span className="eyebrow w-8 shrink-0" style={{ color: "var(--brass)", fontSize: "0.65rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Icon */}
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg" style={{ background: "var(--emerald-wash)", border: "1px solid var(--brass-hairline)" }}>
                      <Icon className="h-4 w-4" style={{ color: "var(--emerald-soft)" }} />
                    </span>
                    {/* Title */}
                    <span className="heading text-base sm:text-lg flex-1" style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}>
                      {service.title}
                    </span>
                    {/* Description — hidden on mobile */}
                    <span className="hidden md:block text-sm max-w-xs leading-relaxed" style={{ color: "var(--cream-muted)" }}>
                      {service.description}
                    </span>
                    {/* Arrow */}
                    <ArrowRight className="arrow-slide h-4 w-4 shrink-0" style={{ color: "var(--brass)" }} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <BrassLine />

      {/* ══ 6. CLOSING CTA ════════════════════════════════════════ */}
      <section id="contact" className="grain-local relative py-24 sm:py-32 px-5 sm:px-8 text-center overflow-hidden" style={{ background: "var(--forest-deep)" }}>
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(44,138,99,0.14) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div {...rise(0)}>
            <p className="eyebrow mb-6">परामर्श एवं योग सत्र</p>
            <h2 className="heading text-[clamp(2.5rem,7vw,6rem)] mb-3">
              Book a Session
            </h2>
            <p className="script text-[clamp(1.2rem,3vw,2rem)] mb-8">
              Ancient wisdom, living practice
            </p>
            <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed mb-10" style={{ color: "var(--cream-muted)" }}>
              किसी भी योग कोर्स, ज्योतिष परामर्श या आध्यात्मिक मार्गदर्शन के लिए सम्पर्क करें। सोमवार – शनिवार · प्रातः 6:00 – रात्रि 8:00
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href={bookHref}>
                <button className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.03]"
                  style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                  Book a Consultation
                </button>
              </Link>
              <Link href="/#yoga">
                <button className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[var(--brass-soft)]"
                  style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
                  Explore Courses
                </button>
              </Link>
            </div>

            {/* Social row */}
            <div className="flex items-center justify-center gap-6">
              {SOCIAL.map(({ label, handle, href, Icon, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{ background: `${color}15`, border: "1px solid var(--brass-hairline)" }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </span>
                  <span className="hidden sm:block text-xs" style={{ color: "var(--cream-faint)" }}>{handle}</span>
                </a>
              ))}
            </div>

            {/* Footer note */}
            <p className="mt-14 text-xs" style={{ color: "var(--cream-faint)" }}>
              <span style={{ color: "var(--brass)" }}>◆</span>{" "}
              {APP_NAME} · Rishikesh, India{" "}
              <span style={{ color: "var(--brass)" }}>◆</span>
            </p>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
