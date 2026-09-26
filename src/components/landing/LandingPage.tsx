"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown, ArrowLeft, CheckCircle2, Sparkles, HeartHandshake, Home, FileText, Atom, Phone } from "lucide-react";
import { SERVICES, APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";
import { WhatsAppSupportWidget } from "@/components/ui/WhatsAppSupportWidget";

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
function YtIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
function WaIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}


// ── Brass Line ───────────────────────────────────────────────────
function BrassLine() {
  return <hr className="brass-line my-0 w-full border-0" />;
}

// ── Data ─────────────────────────────────────────────────────────
const MARQUEE_EN = [
  "Birth Chart Reading", "Group Yoga Classes", "Horoscope Matching",
  "Vastu Consultation", "Auspicious Timing (Shubh Muhurat)", "Jyotish Vidya",
  "Online Personal Yoga", "In-Person Personal Yoga", "Scriptural Teachings",
];
const MARQUEE_HI = [
  "जन्म कुंडली विश्लेषण", "समूह योग कक्षाएँ", "विवाह कुंडली मिलान",
  "वास्तु परामर्श", "शुभ मुहूर्त", "ज्योतिष विद्या",
  "ऑनलाइन व्यक्तिगत योग", "व्यक्तिगत योग (आमने-सामने)", "शास्त्रीय शिक्षण",
];

const FEATURED_SLIDES = [
  {
    src: "/SecondBg.avif",
    alt: "Ancient wisdom, living practice",
    caption: "Ancient wisdom, living practice",
    captionHi: "प्राचीन ज्ञान, जीवित परंपरा",
    sub: "Shastriya Yogshala is more than modern fitness yoga — it is a sincere effort to preserve, practice, and carry forward the traditional wisdom of yoga rooted in Patanjali's Yoga Sutras.",
    subHi: "शास्त्रीय योगशाला आधुनिक फिटनेस योग से कहीं अधिक है — यह पतंजलि के योग सूत्रों में निहित शास्त्रीय परंपरा को संरक्षित करने, अभ्यास करने और आगे बढ़ाने का एक सच्चा प्रयास है।",
  },
  {
    src: "/SecondBgtwo.avif",
    alt: "Classical yoga — group practice",
    caption: "Community Practice",
    captionHi: "सामुदायिक अभ्यास",
    sub: "Join our group yoga classes — 7 days a week, no weekly off. Classical yoga in a supportive community setting, from ₹1,500 per month.",
    subHi: "हमारी समूह योग कक्षाओं में शामिल हों — सप्ताह में 7 दिन, कोई साप्ताहिक अवकाश नहीं। ₹1,500 प्रति माह से।",
  },
  {
    src: "/SecondBgthree.avif",
    alt: "Online personal yoga classes",
    caption: "Daily Personal Practice",
    captionHi: "दैनिक व्यक्तिगत अभ्यास",
    sub: "One-on-one online yoga classes — daily, 1 hour, live. Fully personalized classical yoga at your convenience.",
    subHi: "ऑनलाइन एकांत योग कक्षाएँ — प्रतिदिन, 1 घंटा, लाइव। आपकी सुविधा पर पूरी तरह से व्यक्तिगत शास्त्रीय योग।",
  },
  {
    src: "/YogaImage4.avif",
    alt: "Personal yoga at your home",
    caption: "Yoga at Your Doorstep",
    captionHi: "आपके द्वार पर योग",
    sub: "In-person one-on-one classical yoga at your home or chosen location. Your teacher comes to you.",
    subHi: "आपके घर या चुने हुए स्थान पर आमने-सामने शास्त्रीय योग। आपका शिक्षक आपके पास आता है।",
  },
];

// ── 3 Yoga program type cards shown on landing page ──────────────
const YOGA_TYPE_CARDS = [
  {
    id: "01", serial: "No. 001",
    name: "Group Yoga", nameHi: "समूह योग",
    tagline: "Community · Classical · 7 Days", taglineHi: "सामुदायिक · शास्त्रीय · 7 दिन",
    from: "₹1,500 / month", fromHi: "₹1,500 / माह से",
    image: "/YogaImage4.avif", href: "/yoga/group",
    badge: "Most Affordable", badgeHi: "सबसे किफायती",
    features: ["Daily classes, 7 days a week", "No weekly off", "1M / 3M / 6M / 1Y plans"],
    featuresHi: ["प्रतिदिन कक्षाएँ, 7 दिन", "कोई साप्ताहिक अवकाश नहीं", "1M / 3M / 6M / 1Y योजनाएँ"],
  },
  {
    id: "02", serial: "No. 002",
    name: "Online Personal Yoga", nameHi: "ऑनलाइन व्यक्तिगत योग",
    tagline: "Live · 1 Hour Daily · One-on-One", taglineHi: "लाइव · 1 घंटा प्रतिदिन · एकांत",
    from: "₹10,000 / month", fromHi: "₹10,000 / माह से",
    image: "/YogaImage5.avif", href: "/yoga/online-personal",
    badge: "Most Flexible", badgeHi: "सबसे लचीला",
    features: ["1-hour live session daily", "Fully personalized plan", "1M / 3M / 6M / 1Y plans"],
    featuresHi: ["प्रतिदिन 1 घंटे का लाइव सत्र", "पूरी तरह व्यक्तिगत योजना", "1M / 3M / 6M / 1Y योजनाएँ"],
  },
  {
    id: "03", serial: "No. 003",
    name: "Personal Yoga (In-Person)", nameHi: "व्यक्तिगत योग (आमने-सामने)",
    tagline: "At Your Home · One-on-One", taglineHi: "आपके घर पर · एकांत",
    from: "₹15,000 / month", fromHi: "₹15,000 / माह से",
    image: "/YogaImage1.jpg", href: "/yoga/personal",
    badge: "Most Personalized", badgeHi: "सबसे व्यक्तिगत",
    features: ["Teacher comes to your home", "Hands-on corrections daily", "1M / 3M / 6M / 12M plans"],
    featuresHi: ["शिक्षक आपके घर आते हैं", "प्रतिदिन हाथों से सुधार", "1M / 3M / 6M / 12M योजनाएँ"],
  },
];

const SERVICE_ICONS: Record<string, React.ElementType> = { Sparkles, HeartHandshake, Home, FileText, Atom, Phone };

const SOCIAL = [
  { label: "Instagram", handle: "@shastriyayogshala", href: "https://instagram.com/shastriyayogshala", Icon: IgIcon, color: "#E1306C" },
  { label: "Facebook", handle: "Shastriya Yogshala", href: "https://facebook.com/shastriyayogshala", Icon: FbIcon, color: "#1877F2" },
  { label: "YouTube", handle: "@ShastriyaYogshala", href: "https://www.youtube.com/@ShastriyaYogshala", Icon: YtIcon, color: "#FF0000" },
  { label: "WhatsApp", handle: "Chat with us", href: "https://wa.me/917300530090", Icon: WaIcon, color: "#25D366" },
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
  const MARQUEE_ITEMS = isHi ? MARQUEE_HI : MARQUEE_EN;
  const [slideIdx, setSlideIdx] = useState(0);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const prevSlide = () => setSlideIdx((i) => (i - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  const nextSlide = () => setSlideIdx((i) => (i + 1) % FEATURED_SLIDES.length);

  // Auto-swipe carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((i) => (i + 1) % FEATURED_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main style={{ background: "var(--forest)" }}>

      {/* ══ 1. HERO ════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[82vh] flex flex-col justify-start items-center text-center overflow-hidden px-5 sm:px-8 lg:px-16 pt-4 sm:pt-6 pb-16">
        {/* radial glow */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(31,111,79,0.24) 0%, transparent 70%)" }} />
        <div className="constellation pointer-events-none absolute inset-0 opacity-40" />

        {/* ── Top Center Logo & Location Badge ── */}
        <motion.div {...rise(0)} className="relative z-10 flex flex-col items-center mb-5 sm:mb-6">
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full overflow-hidden p-1 shadow-[0_0_50px_rgba(201,162,39,0.28)] border-2 border-[var(--brass)] bg-[var(--forest-deep)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_65px_rgba(201,162,39,0.42)]">
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <Image
                src="/astro-bodh-logo.png"
                alt="Shastriya Yogshala Logo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 144px"
              />
            </div>
          </div>

          {/* Location badge */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(201,162,39,0.08)", border: "1px solid var(--brass-hairline)", color: "var(--cream-muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brass)" }} />
            <span className="eyebrow tracking-widest text-[10px] sm:text-[11px]">
              {isHi ? "शास्त्रीय योगशाला · ब्रजभूमि, भारत · स्थापित 2024" : "Shastriya Yogshala · Braj Bhumi, India · Est. 2024"}
            </span>
          </div>
        </motion.div>

        {/* ── Display headline (single, localized) ── */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 {...rise(0.08)} className="heading text-[clamp(2.2rem,5.5vw,5rem)] leading-[1.05] tracking-tight mb-3">
            {t.landing.welcomeTitle}
          </motion.h1>

          <motion.p {...rise(0.16)} className="max-w-2xl text-base sm:text-lg leading-relaxed mb-8" style={{ color: "var(--cream-muted)" }}>
            {t.landing.heroSubtext}
          </motion.p>
        </div>

        {/* ── CTA row — Explore Courses first, Book Consultancy second ── */}
        <motion.div {...rise(0.3)} className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/#yoga">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03] shadow-[0_4px_20px_rgba(201,162,39,0.25)] cursor-pointer"
              style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
              {isHi ? "योग पाठ्यक्रम देखें" : "Explore Yoga Courses"} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href={bookHref}>
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[var(--brass-soft)] cursor-pointer"
              style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
              {isHi ? "ज्योतिष परामर्श बुक करें" : "Book Astrology Consultation"}
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

      {/* ══ 2. FEATURED VISUAL — CAROUSEL ═════════════════════════ */}
      <section className="relative h-[480px] sm:h-[560px] overflow-hidden group">
        {/* bg gradient fallback */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1711 0%, #1f6f4f 60%, #0d1f17 100%)" }} />

        {/* Slide images */}
        {FEATURED_SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === slideIdx ? 1 : 0, pointerEvents: i === slideIdx ? "auto" : "none" }}>
            <Image src={slide.src} alt={slide.alt} fill className="object-cover img-editorial" sizes="100vw" priority={i === 0} />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,23,17,0.88) 0%, rgba(10,23,17,0.55) 55%, rgba(10,23,17,0.15) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,23,17,0.7) 0%, transparent 50%)" }} />

        {/* Content overlay */}
        <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16 pb-16">
          <p className="eyebrow mb-2">
            No. {String(slideIdx + 1).padStart(3, "0")} — Featured
          </p>
          <p className="script text-[clamp(1.5rem,4vw,2.5rem)]">
            {isHi ? FEATURED_SLIDES[slideIdx].captionHi : FEATURED_SLIDES[slideIdx].caption}
          </p>
          <p className="mt-2 text-sm max-w-md leading-relaxed" style={{ color: "var(--cream-muted)" }}>
            {isHi ? FEATURED_SLIDES[slideIdx].subHi : FEATURED_SLIDES[slideIdx].sub}
          </p>
        </div>

        {/* Prev / Next arrow buttons */}
        <button onClick={prevSlide} aria-label="Previous slide"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{ background: "rgba(10,23,17,0.6)", border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button onClick={nextSlide} aria-label="Next slide"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
          style={{ background: "rgba(10,23,17,0.6)", border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {FEATURED_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIdx(i)} aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slideIdx ? "24px" : "8px",
                height: "8px",
                background: i === slideIdx ? "var(--brass)" : "rgba(201,162,39,0.35)",
              }} />
          ))}
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
          <p className="eyebrow mb-4">{isHi ? "शास्त्रीय योगशाला" : "Shastriya Yogshala"}</p>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="heading text-[clamp(2.5rem,6vw,5rem)]">Yoga</h2>
            <span className="script text-[clamp(1.5rem,4vw,3.5rem)]">Programs</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: "var(--cream-muted)" }}>
            {isHi
              ? "तीन प्रकार के शास्त्रीय योग कार्यक्रम — समूह, ऑनलाइन व्यक्तिगत और व्यक्तिगत (आमने-सामने)।"
              : "Three types of classical yoga programs — Group, Online Personal, and Personal (In-Person)."}
          </p>
        </motion.div>

        {/* 3 yoga type cards + Daily 7 Days highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:auto-rows-[310px]">

          {/* Card 1 — Group Yoga (tall, 2 rows on desktop, natural flex on mobile) */}
          <motion.div {...rise(0.05)} className="group card-editorial rounded-2xl lg:row-span-2 flex flex-col relative overflow-hidden"
            style={{ background: "linear-gradient(150deg, var(--emerald) 0%, var(--forest-deep) 100%)", border: "1px solid var(--brass-hairline)" }}>
            {/* Image banner */}
            <div className="relative w-full h-52 sm:h-60 lg:h-[46%] shrink-0 overflow-hidden">
              <Image src={YOGA_TYPE_CARDS[0].image} alt={YOGA_TYPE_CARDS[0].name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 400px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--emerald) 100%)" }} />
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-bold px-3 py-1 rounded-full shadow-md" style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                  {isHi ? YOGA_TYPE_CARDS[0].badgeHi : YOGA_TYPE_CARDS[0].badge}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 gap-4">
              <div>
                <p className="eyebrow mb-1" style={{ fontSize: "0.65rem" }}>{YOGA_TYPE_CARDS[0].serial}</p>
                <p className="heading text-2xl sm:text-3xl leading-tight">{isHi ? YOGA_TYPE_CARDS[0].nameHi : YOGA_TYPE_CARDS[0].name}</p>
                <p className="script text-lg mt-0.5" style={{ color: "var(--brass)" }}>{isHi ? YOGA_TYPE_CARDS[0].taglineHi : YOGA_TYPE_CARDS[0].tagline}</p>
                <ul className="space-y-1.5 mt-3">
                  {(isHi ? YOGA_TYPE_CARDS[0].featuresHi : YOGA_TYPE_CARDS[0].features).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--cream-muted)" }}>
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "var(--brass)" }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[var(--brass-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="eyebrow text-[9px] mb-0.5">{isHi ? "से शुरू" : "Starting from"}</p>
                  <span className="heading text-xl" style={{ color: "var(--brass)" }}>{isHi ? YOGA_TYPE_CARDS[0].fromHi : YOGA_TYPE_CARDS[0].from}</span>
                </div>
                <Link href={YOGA_TYPE_CARDS[0].href} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)", boxShadow: "0 2px 10px rgba(201,162,39,0.25)" }}>
                    {isHi ? "विवरण देखें" : "View Details"} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Online Personal Yoga (featured) */}
          <motion.div {...rise(0.1)} className="group card-editorial rounded-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between"
            style={{ background: "var(--forest-mid)", border: "1px solid var(--brass)" }}>
            <div className="absolute inset-y-0 left-0 w-[50%]">
              <Image src={YOGA_TYPE_CARDS[1].image} alt={YOGA_TYPE_CARDS[1].name} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 35%, var(--forest-mid) 100%)" }} />
            </div>
            {/* Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                {isHi ? YOGA_TYPE_CARDS[1].badgeHi : YOGA_TYPE_CARDS[1].badge}
              </span>
            </div>
            <div className="relative z-10 ml-auto w-[55%] h-full flex flex-col justify-between p-5">
              <div>
                <p className="eyebrow mb-1" style={{ fontSize: "0.6rem" }}>{YOGA_TYPE_CARDS[1].serial}</p>
                <p className="heading text-xl leading-tight">{isHi ? YOGA_TYPE_CARDS[1].nameHi : YOGA_TYPE_CARDS[1].name}</p>
                <p className="script text-base mt-0.5">{isHi ? YOGA_TYPE_CARDS[1].taglineHi : YOGA_TYPE_CARDS[1].tagline}</p>
              </div>
              <div className="mt-4">
                <div>
                  <p className="eyebrow text-[9px] mb-0.5">{isHi ? "से शुरू" : "From"}</p>
                  <span className="heading text-lg" style={{ color: "var(--brass)" }}>{isHi ? YOGA_TYPE_CARDS[1].fromHi : YOGA_TYPE_CARDS[1].from}</span>
                </div>
                <Link href={YOGA_TYPE_CARDS[1].href}>
                  <button className="mt-3 w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 hover:opacity-90"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                    {isHi ? "विवरण देखें" : "View Details"} <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Personal In-Person */}
          <motion.div {...rise(0.15)} className="group card-editorial rounded-2xl relative overflow-hidden min-h-[300px] flex flex-col justify-between"
            style={{ background: "linear-gradient(135deg, var(--forest-mid) 0%, rgba(31,111,79,0.2) 100%)", border: "1px solid var(--brass-hairline)" }}>
            <div className="absolute inset-y-0 left-0 w-[50%]">
              <Image src={YOGA_TYPE_CARDS[2].image} alt={YOGA_TYPE_CARDS[2].name} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 35%, var(--forest-mid) 100%)" }} />
            </div>
            {/* Badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(201,162,39,0.15)", color: "var(--brass)", border: "1px solid var(--brass)" }}>
                {isHi ? YOGA_TYPE_CARDS[2].badgeHi : YOGA_TYPE_CARDS[2].badge}
              </span>
            </div>
            <div className="relative z-10 ml-auto w-[55%] h-full flex flex-col justify-between p-5">
              <div>
                <p className="eyebrow mb-1" style={{ fontSize: "0.6rem" }}>{YOGA_TYPE_CARDS[2].serial}</p>
                <p className="heading text-xl leading-tight">{isHi ? YOGA_TYPE_CARDS[2].nameHi : YOGA_TYPE_CARDS[2].name}</p>
                <p className="script text-base mt-0.5">{isHi ? YOGA_TYPE_CARDS[2].taglineHi : YOGA_TYPE_CARDS[2].tagline}</p>
              </div>
              <div className="mt-4">
                <div>
                  <p className="eyebrow text-[9px] mb-0.5">{isHi ? "से शुरू" : "From"}</p>
                  <span className="heading text-lg" style={{ color: "var(--brass)" }}>{isHi ? YOGA_TYPE_CARDS[2].fromHi : YOGA_TYPE_CARDS[2].from}</span>
                </div>
                <Link href={YOGA_TYPE_CARDS[2].href}>
                  <button className="mt-3 w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 hover:bg-[var(--brass-soft)]"
                    style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
                    {isHi ? "विवरण देखें" : "View Details"} <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 4 — Daily 7 Days highlight (wide, fully responsive, zero trimming on mobile) */}
          <motion.div {...rise(0.2)} className="group card-editorial rounded-2xl lg:col-span-2 relative overflow-hidden h-auto min-h-0"
            style={{ background: "linear-gradient(90deg, var(--forest-deep) 0%, rgba(31,111,79,0.15) 100%)", border: "1px solid var(--brass-hairline)" }}>
            {/* Subtle animated glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 80% at 10% 50%, rgba(37,211,102,0.07) 0%, transparent 70%)" }} />
            <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 p-6 sm:p-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ade80" }} />
                  <span className="eyebrow text-[11px]" style={{ color: "#4ade80" }}>{isHi ? "प्रतिदिन उपलब्ध" : "Available Daily"}</span>
                </div>
                <h3 className="heading text-2xl sm:text-3xl lg:text-4xl mb-2">
                  {isHi ? "प्रतिदिन योग कक्षाएँ — 7 दिन" : "Daily Yoga Classes — 7 Days a Week"}
                </h3>
                <p className="script text-xl mb-3" style={{ color: "var(--brass)" }}>
                  {isHi ? "कोई साप्ताहिक अवकाश नहीं · निरंतर अभ्यास" : "No Weekly Off · Consistent Practice"}
                </p>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--cream-muted)" }}>
                  {isHi
                    ? "शास्त्रीय योगशाला में योग कभी रुकता नहीं — सोमवार से रविवार, हर दिन कक्षाएँ। असली परिवर्तन तब आता है जब अभ्यास नहीं रुकता।"
                    : "At Shastriya Yogshala, yoga never stops — classes every single day of the week. Real transformation comes from uninterrupted practice."}
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[240px] shrink-0">
                {YOGA_TYPE_CARDS.map((c) => (
                  <Link key={c.id} href={c.href}>
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                      style={{ background: "rgba(201,162,39,0.06)", border: "1px solid var(--brass-hairline)" }}>
                      <span className="text-xs font-medium" style={{ color: "var(--cream)" }}>{isHi ? c.nameHi : c.name}</span>
                      <span className="heading text-xs" style={{ color: "var(--brass)" }}>{isHi ? c.fromHi : c.from}</span>
                    </div>
                  </Link>
                ))}
                <Link href="/#yoga">
                  <button className="w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                    {isHi ? "सभी पाठ्यक्रम देखें" : "See All Programs"} <ArrowRight className="h-3 w-3" />
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
          <p className="eyebrow mb-4">ज्योतिष विद्या</p>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <h2 className="heading text-[clamp(2.5rem,6vw,5rem)]">Jyotish</h2>
            <span className="script text-[clamp(1.5rem,4vw,3.5rem)]">Vidya</span>
          </div>
          <p className="mt-3 heading text-base sm:text-lg" style={{ letterSpacing: "0.02em", lineHeight: "1.4", textTransform: "none" }}>
            <span style={{ color: "var(--cream-muted)", fontWeight: 400 }}>Shastriya Yogshala mein Jyotish ke dwara marg darshan</span>
          </p>
        </motion.div>

        {/* Numbered service rows */}
        <div style={{ borderTop: "1px solid var(--brass-hairline)" }}>
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[service.icon] ?? Sparkles;
            const targetUrl = user
              ? `/dashboard?service=${encodeURIComponent(service.title)}`
              : `/signup?service=${encodeURIComponent(service.title)}`;
            return (
              <motion.div key={service.title} {...rise(0.06 * i)}>
                <div
                  className="service-row group flex items-center justify-between gap-3 sm:gap-6 py-5 px-4 rounded-xl transition-all duration-300 hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid var(--brass-hairline)" }}
                >
                  {/* Service link area */}
                  <Link
                    href={targetUrl}
                    className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0"
                  >
                    {/* Index */}
                    <span className="eyebrow w-8 shrink-0" style={{ color: "var(--brass)", fontSize: "0.65rem" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Icon */}
                    <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg" style={{ background: "var(--emerald-wash)", border: "1px solid var(--brass-hairline)" }}>
                      <Icon className="h-4 w-4" style={{ color: "var(--emerald-soft)" }} />
                    </span>
                    {/* Title */}
                    <span className="heading text-base sm:text-lg flex-1 group-hover:text-[var(--brass)] transition-colors" style={{ letterSpacing: "-0.02em", lineHeight: "1.1" }}>
                      {service.title}
                    </span>
                    {/* Description — hidden on mobile */}
                    <span className="hidden md:block text-sm max-w-xs leading-relaxed" style={{ color: "var(--cream-muted)" }}>
                      {service.description}
                    </span>
                    {/* Arrow hint */}
                    <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--brass)" }} />
                  </Link>

                  {/* Book button */}
                  <Link href={targetUrl} onClick={(e) => e.stopPropagation()} className="shrink-0">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 cursor-pointer shadow-md"
                      style={{
                        background: "var(--brass)",
                        color: "var(--forest-deep)",
                      }}
                      title={isHi ? "परामर्श बुक करें" : "Book Service"}
                    >
                      <span>{isHi ? "बुक करें" : "Book"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section bottom Book CTA */}
        <motion.div {...rise(0.4)} className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border"
          style={{ background: "rgba(201, 162, 39, 0.04)", borderColor: "var(--brass-hairline)" }}>
          <div>
            <h3 className="heading text-base sm:text-lg text-white mb-1">
              {isHi ? "ज्योतिष एवं कुंडली मार्गदर्शन चाहिए?" : "Need Astrology or Kundali Guidance?"}
            </h3>
            <p className="text-xs sm:text-sm" style={{ color: "var(--cream-muted)" }}>
              {isHi ? "वैदिक ज्योतिष एवं कुंडली विश्लेषण के लिए आज ही परामर्श बुक करें।" : "Book a personalized consultation for in-depth Vedic astrology and kundali analysis."}
            </p>
          </div>
          <Link href={bookHref}>
            <button
              type="button"
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-md"
              style={{
                background: "var(--brass)",
                color: "var(--forest-deep)",
                boxShadow: "0 4px 16px rgba(201, 162, 39, 0.35)",
              }}
            >
              <span>{isHi ? "परामर्श बुक करें" : "Book Consultation"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>
      </section>

      <BrassLine />

      {/* ══ 6. CLOSING CTA ════════════════════════════════════════ */}
      <section id="contact" className="grain-local relative py-24 sm:py-32 px-5 sm:px-8 text-center overflow-hidden" style={{ background: "var(--forest-deep)" }}>
        {/* Background Image */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/SecondBgthree.avif"
            alt="Consultancy background"
            fill
            className="object-cover object-center opacity-25"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(10,23,17,0.88) 0%, rgba(10,23,17,0.72) 50%, rgba(10,23,17,0.92) 100%)",
            }}
          />
        </div>

        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(44,138,99,0.18) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div {...rise(0)}>
            <p className="eyebrow mb-6">{isHi ? "परामर्श एवं योग सत्र" : "Consultancy & Guidance"}</p>
            <h2 className="heading text-[clamp(2.5rem,7vw,6rem)] mb-3">
              {isHi ? "परामर्श बुक करें" : "Book a Consultancy"}
            </h2>
            <p className="script text-[clamp(1.2rem,3vw,2rem)] mb-8">
              Ancient wisdom, living practice
            </p>
            <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed mb-10" style={{ color: "var(--cream-muted)" }}>
              {isHi
                ? "किसी भी योग कोर्स, ज्योतिष परामर्श या आध्यात्मिक मार्गदर्शन के लिए सम्पर्क करें।"
                : "Get in touch for any yoga course, astrological consultation, or spiritual guidance."}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                type="button"
                onClick={() => setHelpModalOpen(true)}
                className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.03] flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  color: "#FFFFFF",
                  boxShadow: "0 6px 20px rgba(37, 211, 102, 0.35)",
                }}
              >
                <WaIcon className="h-4 w-4 fill-white" />
                <span>{isHi ? "सहायता एवं परामर्श" : "Get Help & Consultation"}</span>
              </button>
              <Link href="/#yoga">
                <button className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[var(--brass-soft)]"
                  style={{ border: "1px solid var(--brass-hairline)", color: "var(--brass)" }}>
                  {isHi ? "योग पाठ्यक्रम देखें" : "Explore Yoga Courses"}
                </button>
              </Link>
            </div>

            {/* Social row */}
            <div className="flex items-center justify-center gap-6">
              {SOCIAL.map(({ label, handle, href, Icon, color }) => {
                if (label === "WhatsApp") {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setHelpModalOpen(true)}
                      className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105"
                      title={isHi ? "व्हाट्सएप सहायता" : "WhatsApp Support"}
                    >
                      <span className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{ background: `${color}15`, border: "1px solid var(--brass-hairline)" }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                      </span>
                      <span className="hidden sm:block text-xs" style={{ color: "var(--cream-faint)" }}>{handle}</span>
                    </button>
                  );
                }
                return (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105">
                    <span className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ background: `${color}15`, border: "1px solid var(--brass-hairline)" }}>
                      <Icon className="h-5 w-5" style={{ color }} />
                    </span>
                    <span className="hidden sm:block text-xs" style={{ color: "var(--cream-faint)" }}>{handle}</span>
                  </a>
                );
              })}
            </div>

            {/* Footer note */}
            <p className="mt-14 text-xs" style={{ color: "var(--cream-faint)" }}>
              <span style={{ color: "var(--brass)" }}>◆</span>{" "}
              {isHi ? "शास्त्रीय योगशाला · ब्रजभूमि, भारत · स्थापित 2024" : "Shastriya Yogshala · Braj Bhumi, India · Est. 2024"}{" "}
              <span style={{ color: "var(--brass)" }}>◆</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Help & Support Widget without login */}
      <WhatsAppSupportWidget isOpen={helpModalOpen} onOpenChange={setHelpModalOpen} />

    </main>
  );
}
