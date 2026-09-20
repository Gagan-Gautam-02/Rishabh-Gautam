"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, ArrowRight, Clock, Users, Award, BookOpen, Calendar, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useT } from "@/store/localeStore";

// ── Types ────────────────────────────────────────────────────────
export interface WeekModule {
  week: string;
  weekHi: string;
  title: string;
  titleHi: string;
  topics: string[];
  topicsHi: string[];
}

export interface CourseData {
  id: string;
  slug: string;                  // "1-month" | "3-month" | "6-month"
  duration: string;
  durationHi: string;
  tagline: string;
  taglineHi: string;
  fee: string;
  level: string;
  levelHi: string;
  batchSize: string;
  heroImage: string;
  description: string;
  descriptionHi: string;
  teaches: string[];
  teachesHi: string[];
  modules: WeekModule[];
  outcomes: string[];
  outcomesHi: string[];
  prevNext: { prev?: string; next?: string };
}

// ── Rise animation ───────────────────────────────────────────────
function useRise() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 as const },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
}

// ── Accordion module card ────────────────────────────────────────
function ModuleCard({ mod, idx, isHi }: { mod: WeekModule; idx: number; isHi: boolean }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ border: "1px solid var(--brass-hairline)", background: open ? "rgba(31,111,79,0.08)" : "transparent" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-4">
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: open ? "var(--brass)" : "var(--emerald-wash)", color: open ? "var(--forest-deep)" : "var(--brass)", border: "1px solid var(--brass-hairline)" }}
          >
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="eyebrow text-[10px] mb-0.5">{isHi ? mod.weekHi : mod.week}</p>
            <p className="font-semibold text-sm" style={{ color: "var(--cream)" }}>{isHi ? mod.titleHi : mod.title}</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brass)" }} /> : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--cream-muted)" }} />}
      </button>
      {open && (
        <div className="px-5 pb-5">
          <ul className="space-y-2">
            {(isHi ? mod.topicsHi : mod.topics).map((topic, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--cream-muted)" }}>
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" style={{ color: "var(--brass)" }} />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export function YogaCoursePage({ course }: { course: CourseData }) {
  const { locale } = useT();
  const isHi = locale === "hi";
  const rise = useRise();
  const WA_HREF = "https://wa.me/917300530090";

  return (
    <main style={{ background: "var(--forest)" }} className="min-h-screen">

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        {/* bg fallback */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1711 0%, #1f6f4f 60%, #0d1f17 100%)" }} />
        <Image src={course.heroImage} alt={course.duration} fill className="object-cover" sizes="100vw" priority />
        {/* overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,23,17,0.95) 0%, rgba(10,23,17,0.4) 60%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,23,17,0.6) 0%, transparent 70%)" }} />

        <div className="relative h-full flex flex-col justify-end px-5 sm:px-10 lg:px-20 pb-12">
          <motion.div {...rise(0)}>
            <p className="eyebrow mb-3">{isHi ? "शास्त्रीय योगशाला" : "Shastriya Yogshala"} · {isHi ? course.levelHi : course.level}</p>
            <h1 className="heading text-[clamp(2.5rem,6vw,5rem)] leading-none mb-3">
              {isHi ? course.durationHi : course.duration}
            </h1>
            <p className="script text-[clamp(1.2rem,3vw,2rem)]" style={{ color: "var(--brass)" }}>
              {isHi ? course.taglineHi : course.tagline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ META STRIP ══════════════════════════════════════════════ */}
      <div style={{ background: "var(--forest-deep)", borderBottom: "1px solid var(--brass-hairline)" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: isHi ? "अवधि" : "Duration", value: isHi ? course.durationHi : course.duration },
            { icon: Award, label: isHi ? "स्तर" : "Level", value: isHi ? course.levelHi : course.level },
            { icon: Users, label: isHi ? "बैच आकार" : "Batch Size", value: course.batchSize },
            { icon: BookOpen, label: isHi ? "शुल्क" : "Fee", value: course.fee },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--emerald-wash)", border: "1px solid var(--brass-hairline)" }}>
                <Icon className="h-4 w-4" style={{ color: "var(--brass)" }} />
              </span>
              <div>
                <p className="eyebrow text-[10px] mb-0.5">{label}</p>
                <p className="text-sm font-semibold" style={{ color: "var(--cream)" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════ */}
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-20">

          {/* About this program */}
          <motion.section {...rise(0)}>
            <p className="eyebrow mb-3">{isHi ? "कार्यक्रम परिचय" : "About This Program"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-5">{isHi ? "इस पाठ्यक्रम के बारे में" : "Program Overview"}</h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--cream-muted)" }}>
              {isHi ? course.descriptionHi : course.description}
            </p>
          </motion.section>

          {/* What you'll learn */}
          <motion.section {...rise(0.05)}>
            <p className="eyebrow mb-3">{isHi ? "आप क्या सीखेंगे" : "Curriculum"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "पाठ्यक्रम सामग्री" : "What You Will Learn"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isHi ? course.teachesHi : course.teaches).map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(31,111,79,0.07)", border: "1px solid var(--brass-hairline)" }}>
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--brass)" }} />
                  <span className="text-sm" style={{ color: "var(--cream-muted)" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Roadmap / Modules */}
          <motion.section {...rise(0.07)}>
            <p className="eyebrow mb-3">{isHi ? "रोडमैप" : "Roadmap"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">
              {isHi ? "सप्ताह-दर-सप्ताह योजना" : "Week-by-Week Plan"}
            </h2>
            <div className="space-y-3">
              {course.modules.map((mod, i) => (
                <ModuleCard key={i} mod={mod} idx={i} isHi={isHi} />
              ))}
            </div>
          </motion.section>

          {/* Outcomes */}
          <motion.section {...rise(0.08)}>
            <p className="eyebrow mb-3">{isHi ? "परिणाम" : "Outcomes"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "आप क्या पाएंगे" : "What You Will Achieve"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(isHi ? course.outcomesHi : course.outcomes).map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--brass)", color: "var(--forest-deep)", fontSize: "0.65rem", fontWeight: 700 }}>
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--cream-muted)" }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── BATCH GALLERY ── */}
          <motion.section {...rise(0.1)}>
            <p className="eyebrow mb-3">{isHi ? "पिछले बैच" : "Previous Batches"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">
              {isHi ? "हमारे साधक" : "Our Students"}
            </h2>
            {/* Gallery grid — images will be added when provided */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: "rgba(31,111,79,0.08)", border: "1px dashed var(--brass-hairline)" }}>
                  <Calendar className="h-6 w-6" style={{ color: "var(--brass)", opacity: 0.5 }} />
                  <p className="text-xs text-center px-2" style={{ color: "var(--cream-faint)" }}>
                    {isHi ? "फ़ोटो शीघ्र आएगी" : "Photo coming soon"}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--cream-faint)" }}>
              {isHi ? "आप हमें बैच की फोटो WhatsApp पर भेज सकते हैं।" : "Send batch photos to us via WhatsApp and we will add them here."}
            </p>
          </motion.section>

        </div>

        {/* ── RIGHT SIDEBAR (sticky CTA) ── */}
        <div className="lg:block">
          <div className="sticky top-24 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--brass)", background: "var(--forest-deep)" }}>
            <div className="p-6">
              <p className="eyebrow mb-2 text-center">{isHi ? "अभी जुड़ें" : "Join This Batch"}</p>
              <p className="heading text-3xl text-center mb-1">{course.fee}</p>
              <p className="text-center text-xs mb-6" style={{ color: "var(--cream-muted)" }}>
                {isHi ? "पूरे कोर्स के लिए" : "for full program"}
              </p>

              {/* What's included */}
              <ul className="space-y-2.5 mb-6">
                {[
                  isHi ? "व्यक्तिगत शिक्षण" : "Personal instruction",
                  isHi ? "अभ्यास सामग्री" : "Study materials",
                  isHi ? "सर्टिफिकेट" : "Certificate of completion",
                  isHi ? "WhatsApp सहयोग" : "WhatsApp support group",
                  isHi ? "ऑनलाइन / ऑफलाइन" : "Online & Offline batches",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--cream-muted)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--brass)" }} />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Primary CTA — WhatsApp */}
              <a href={`${WA_HREF}?text=${encodeURIComponent(`Namaste! I am interested in the ${course.duration} Yoga Program at Shastriya Yogshala. Please share details.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:opacity-90 mb-3"
                style={{ background: "#25D366", color: "#fff" }}>
                <MessageCircle className="h-4 w-4" />
                {isHi ? "WhatsApp पर संपर्क करें" : "Enquire on WhatsApp"}
              </a>

              {/* Secondary CTA — Book */}
              <Link href="/signup">
                <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
                  style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                  {isHi ? "परामर्श बुक करें" : "Book a Consultancy"} <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* other programs */}
            <div className="px-6 pb-6">
              <p className="eyebrow text-[10px] mb-3">{isHi ? "अन्य कार्यक्रम" : "Other Programs"}</p>
              <div className="space-y-2">
                {[
                  { label: isHi ? "1 महीना — ₹2,500" : "1 Month — ₹2,500", href: "/yoga/1-month", active: course.slug === "1-month" },
                  { label: isHi ? "3 महीने — ₹6,500" : "3 Months — ₹6,500", href: "/yoga/3-month", active: course.slug === "3-month" },
                  { label: isHi ? "6 महीने — ₹11,000" : "6 Months — ₹11,000", href: "/yoga/6-month", active: course.slug === "6-month" },
                ].map(({ label, href, active }) => (
                  <Link key={href} href={href}>
                    <div className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 hover:bg-[var(--brass-soft)] cursor-pointer"
                      style={{
                        background: active ? "rgba(201,162,39,0.12)" : "transparent",
                        border: active ? "1px solid var(--brass)" : "1px solid var(--brass-hairline)",
                        color: active ? "var(--brass)" : "var(--cream-muted)",
                        fontWeight: active ? 600 : 400,
                      }}>
                      {label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM CTA ══════════════════════════════════════════════ */}
      <section className="py-20 px-5 text-center" style={{ background: "var(--forest-deep)", borderTop: "1px solid var(--brass-hairline)" }}>
        <motion.div {...rise(0)} className="max-w-2xl mx-auto">
          <p className="eyebrow mb-4">{isHi ? "तैयार हैं?" : "Ready to Begin?"}</p>
          <h2 className="heading text-[clamp(2rem,5vw,4rem)] mb-4">
            {isHi ? "अपनी योग यात्रा शुरू करें" : "Start Your Yoga Journey"}
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--cream-muted)" }}>
            {isHi
              ? "किसी भी प्रश्न के लिए हमसे WhatsApp पर संपर्क करें। प्रवेश सीमित हैं।"
              : "Contact us on WhatsApp for any queries. Seats are limited per batch."}
          </p>
          <a href={`${WA_HREF}?text=${encodeURIComponent(`Namaste! I am interested in the ${course.duration} Yoga Program. Please share the next batch schedule.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03]"
            style={{ background: "#25D366", color: "#fff" }}>
            <MessageCircle className="h-4 w-4" />
            {isHi ? "WhatsApp पर बात करें" : "Chat on WhatsApp"}
          </a>
        </motion.div>
      </section>

    </main>
  );
}
