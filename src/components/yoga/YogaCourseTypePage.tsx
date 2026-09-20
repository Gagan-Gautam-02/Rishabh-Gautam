"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2, ArrowRight, Clock, Users, Award, BookOpen,
  Calendar, ChevronDown, ChevronUp, MessageCircle, MapPin, Wifi, User,
} from "lucide-react";
import { useT } from "@/store/localeStore";
import { useAuthStore } from "@/store/authStore";
import type { YogaTypeData, DurationTier, WeekModule } from "@/lib/yogaCourses";

// ── Rise animation ───────────────────────────────────────────────
function useRise() {
  const reduce = useReducedMotion();
  return (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 as const },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });
}

// ── Module accordion card ────────────────────────────────────────
function ModuleCard({ mod, idx, isHi }: { mod: WeekModule; idx: number; isHi: boolean }) {
  const [open, setOpen] = useState(idx === 0);
  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ border: "1px solid var(--brass-hairline)", background: open ? "rgba(31,111,79,0.08)" : "transparent" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: open ? "var(--brass)" : "var(--emerald-wash)", color: open ? "var(--forest-deep)" : "var(--brass)", border: "1px solid var(--brass-hairline)" }}>
            {String(idx + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="eyebrow text-[10px] mb-0.5">{isHi ? mod.weekHi : mod.week}</p>
            <p className="font-semibold text-sm" style={{ color: "var(--cream)" }}>{isHi ? mod.titleHi : mod.title}</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: "var(--brass)" }} />
          : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: "var(--cream-muted)" }} />}
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

// ── Duration Tab Selector ────────────────────────────────────────
function DurationTabs({ tiers, active, onChange, isHi }: {
  tiers: DurationTier[];
  active: string;
  onChange: (key: string) => void;
  isHi: boolean;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tiers.map((tier) => (
        <button key={tier.key} onClick={() => onChange(tier.key)}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: tier.key === active ? "var(--brass)" : "transparent",
            color: tier.key === active ? "var(--forest-deep)" : "var(--brass)",
            border: tier.key === active ? "1px solid var(--brass)" : "1px solid var(--brass-hairline)",
          }}>
          {isHi ? tier.labelHi : tier.label}
        </button>
      ))}
    </div>
  );
}

// ── Type Icon ────────────────────────────────────────────────────
function TypeIcon({ slug }: { slug: string }) {
  if (slug === "group") return <Users className="h-5 w-5" />;
  if (slug === "online-personal") return <Wifi className="h-5 w-5" />;
  return <User className="h-5 w-5" />;
}

// ── Main component ───────────────────────────────────────────────
export function YogaCourseTypePage({ data }: { data: YogaTypeData }) {
  const { locale } = useT();
  const user = useAuthStore((s) => s.user);
  const isHi = locale === "hi";
  const rise = useRise();
  const WA_HREF = "https://wa.me/917300530090";
  const bookHref = user ? "/dashboard" : "/signup";

  const [activeTierKey, setActiveTierKey] = useState(data.tiers[0].key);
  const tier = data.tiers.find((t) => t.key === activeTierKey) ?? data.tiers[0];

  const waMsg = encodeURIComponent(
    `Namaste! I am interested in the ${isHi ? data.nameHi : data.name} (${isHi ? tier.labelHi : tier.label}) at Shastriya Yogshala. Please share details.`
  );

  return (
    <main style={{ background: "var(--forest)" }} className="min-h-screen">

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1711 0%, #1f6f4f 60%, #0d1f17 100%)" }} />
        <Image src={data.heroImage} alt={data.name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,23,17,0.96) 0%, rgba(10,23,17,0.45) 60%, transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,23,17,0.65) 0%, transparent 65%)" }} />

        <div className="relative h-full flex flex-col justify-end px-5 sm:px-10 lg:px-20 pb-12">
          <motion.div {...rise(0)}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                <TypeIcon slug={data.slug} />
              </span>
              {data.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                  {isHi ? data.badgeHi : data.badge}
                </span>
              )}
            </div>
            <h1 className="heading text-[clamp(2rem,5vw,4.5rem)] leading-none mb-3">
              {isHi ? data.nameHi : data.name}
            </h1>
            <p className="script text-[clamp(1rem,2.5vw,1.8rem)]" style={{ color: "var(--brass)" }}>
              {isHi ? data.taglineHi : data.tagline}
            </p>
            {data.highlight && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", color: "#4ade80" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {isHi ? data.highlightHi : data.highlight}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══ DURATION SELECTOR STRIP ═════════════════════════════════ */}
      <div style={{ background: "var(--forest-deep)", borderBottom: "1px solid var(--brass-hairline)" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="eyebrow text-[10px] mb-2">{isHi ? "अवधि चुनें" : "Select Duration"}</p>
            <DurationTabs tiers={data.tiers} active={activeTierKey} onChange={setActiveTierKey} isHi={isHi} />
          </div>
          <div className="text-right">
            <p className="eyebrow text-[10px] mb-1">{isHi ? "शुल्क" : "Fee"}</p>
            <p className="heading text-3xl" style={{ color: "var(--brass)" }}>{tier.fee}</p>
            <p className="text-xs" style={{ color: "var(--cream-muted)" }}>{isHi ? "पूरे कोर्स के लिए" : "for full program"}</p>
          </div>
        </div>
      </div>

      {/* ══ META STRIP ══════════════════════════════════════════════ */}
      <div style={{ background: "rgba(10,23,17,0.6)", borderBottom: "1px solid var(--brass-hairline)" }}>
        <div className="max-w-[1100px] mx-auto px-5 sm:px-10 py-4 flex flex-wrap gap-6">
          {[
            { icon: Clock, label: isHi ? "अवधि" : "Duration", value: isHi ? tier.labelHi : tier.label },
            { icon: Award, label: isHi ? "प्रकार" : "Type", value: isHi ? data.nameHi : data.name },
            { icon: data.slug === "group" ? Users : data.slug === "online-personal" ? Wifi : MapPin, label: isHi ? "माध्यम" : "Mode", value: data.slug === "group" ? (isHi ? "समूह · ऑफलाइन" : "Group · Offline") : data.slug === "online-personal" ? (isHi ? "ऑनलाइन" : "Online · Live") : (isHi ? "आपके स्थान पर" : "At Your Location") },
            { icon: BookOpen, label: isHi ? "शुल्क" : "Fee", value: tier.fee },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--emerald-wash)", border: "1px solid var(--brass-hairline)" }}>
                <Icon className="h-3.5 w-3.5" style={{ color: "var(--brass)" }} />
              </span>
              <div>
                <p className="eyebrow text-[9px] mb-0.5">{label}</p>
                <p className="text-xs font-semibold" style={{ color: "var(--cream)" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════ */}
      <div className="max-w-[1100px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-20">

          {/* About */}
          <motion.section {...rise(0)}>
            <p className="eyebrow mb-3">{isHi ? "कार्यक्रम परिचय" : "About This Program"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-5">{isHi ? "इस कार्यक्रम के बारे में" : "Overview"}</h2>
            <p className="text-base leading-relaxed" style={{ color: "var(--cream-muted)" }}>
              {isHi ? data.descriptionHi : data.description}
            </p>
          </motion.section>

          {/* What you learn — tier-specific */}
          <motion.section {...rise(0.04)}>
            <p className="eyebrow mb-3">{isHi ? "आप क्या सीखेंगे" : "Curriculum"} — {isHi ? tier.labelHi : tier.label}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "पाठ्यक्रम सामग्री" : "What You Will Learn"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(isHi ? tier.teachesHi : tier.teaches).map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(31,111,79,0.07)", border: "1px solid var(--brass-hairline)" }}>
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--brass)" }} />
                  <span className="text-sm" style={{ color: "var(--cream-muted)" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Roadmap — tier-specific */}
          <motion.section {...rise(0.06)}>
            <p className="eyebrow mb-3">{isHi ? "रोडमैप" : "Roadmap"} — {isHi ? tier.labelHi : tier.label}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "चरण-दर-चरण योजना" : "Step-by-Step Plan"}</h2>
            <div className="space-y-3">
              {tier.modules.map((mod, i) => (
                <ModuleCard key={i} mod={mod} idx={i} isHi={isHi} />
              ))}
            </div>
          </motion.section>

          {/* Outcomes — tier-specific */}
          <motion.section {...rise(0.08)}>
            <p className="eyebrow mb-3">{isHi ? "परिणाम" : "Outcomes"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "आप क्या पाएंगे" : "What You Will Achieve"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(isHi ? tier.outcomesHi : tier.outcomes).map((item, i) => (
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

          {/* All pricing tiers comparison */}
          <motion.section {...rise(0.09)}>
            <p className="eyebrow mb-3">{isHi ? "सभी योजनाएँ" : "All Plans"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "अवधि और शुल्क" : "Duration & Fees"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {data.tiers.map((t) => (
                <button key={t.key} onClick={() => setActiveTierKey(t.key)}
                  className="p-4 rounded-xl text-left transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: t.key === activeTierKey ? "rgba(201,162,39,0.12)" : "rgba(31,111,79,0.06)",
                    border: t.key === activeTierKey ? "1px solid var(--brass)" : "1px solid var(--brass-hairline)",
                  }}>
                  <p className="eyebrow text-[9px] mb-1">{isHi ? t.labelHi : t.label}</p>
                  <p className="heading text-xl" style={{ color: "var(--brass)" }}>{t.fee}</p>
                </button>
              ))}
            </div>
          </motion.section>

          {/* ── BATCH GALLERY ── */}
          <motion.section {...rise(0.1)}>
            <p className="eyebrow mb-3">{isHi ? "पिछले बैच" : "Previous Batches"}</p>
            <h2 className="heading text-[clamp(1.8rem,4vw,3rem)] mb-6">{isHi ? "हमारे साधक" : "Our Students"}</h2>
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
              {isHi ? "बैच की फोटो हमें WhatsApp पर भेजें।" : "Send your batch photos via WhatsApp and we will add them here."}
            </p>
          </motion.section>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div>
          <div className="sticky top-24 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--brass)", background: "var(--forest-deep)" }}>
            <div className="p-6">
              {/* Duration tabs compact */}
              <p className="eyebrow text-[10px] mb-2">{isHi ? "अवधि चुनें" : "Select Duration"}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {data.tiers.map((t) => (
                  <button key={t.key} onClick={() => setActiveTierKey(t.key)}
                    className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: t.key === activeTierKey ? "var(--brass)" : "transparent",
                      color: t.key === activeTierKey ? "var(--forest-deep)" : "var(--brass)",
                      border: "1px solid var(--brass-hairline)",
                    }}>
                    {isHi ? t.labelHi : t.label}
                  </button>
                ))}
              </div>

              <p className="text-center heading text-3xl mb-0.5">{tier.fee}</p>
              <p className="text-center text-xs mb-5" style={{ color: "var(--cream-muted)" }}>
                {isHi ? `${tier.labelHi} के लिए` : `for ${tier.label}`}
              </p>

              <ul className="space-y-2.5 mb-5">
                {[
                  isHi ? "व्यक्तिगत शिक्षण" : "Classical instruction",
                  isHi ? "शास्त्रीय पाठ्यक्रम" : "Full classical curriculum",
                  isHi ? "सर्टिफिकेट" : "Certificate of completion",
                  isHi ? "WhatsApp सहयोग" : "WhatsApp support",
                  isHi ? "7 दिन · कोई अवकाश नहीं" : "7 Days a week · No off",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--cream-muted)" }}>
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--brass)" }} />
                    {item}
                  </li>
                ))}
              </ul>

              <a href={`${WA_HREF}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.02] mb-3"
                style={{ background: "#25D366", color: "#fff" }}>
                <MessageCircle className="h-4 w-4" />
                {isHi ? "WhatsApp पर पूछें" : "Enquire on WhatsApp"}
              </a>

              <Link href={bookHref}>
                <button className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
                  style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                  {isHi ? "परामर्श बुक करें" : "Book Consultancy"} <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>

            {/* Other programs */}
            <div className="px-6 pb-6">
              <p className="eyebrow text-[10px] mb-3">{isHi ? "अन्य कार्यक्रम" : "Other Programs"}</p>
              <div className="space-y-2">
                {[
                  { label: isHi ? "समूह योग" : "Group Yoga", subLabel: isHi ? "₹1,500 से शुरू" : "From ₹1,500/mo", href: "/yoga/group", active: data.slug === "group" },
                  { label: isHi ? "ऑनलाइन व्यक्तिगत" : "Online Personal", subLabel: isHi ? "₹10,000 से शुरू" : "From ₹10,000/mo", href: "/yoga/online-personal", active: data.slug === "online-personal" },
                  { label: isHi ? "व्यक्तिगत (आमने-सामने)" : "Personal (In-Person)", subLabel: isHi ? "₹15,000 से शुरू" : "From ₹15,000/mo", href: "/yoga/personal", active: data.slug === "personal" },
                ].map(({ label, subLabel, href, active }) => (
                  <Link key={href} href={href}>
                    <div className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer mb-2"
                      style={{
                        background: active ? "rgba(201,162,39,0.12)" : "transparent",
                        border: active ? "1px solid var(--brass)" : "1px solid var(--brass-hairline)",
                        color: active ? "var(--brass)" : "var(--cream-muted)",
                      }}>
                      <p className="font-semibold text-xs">{label}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: active ? "var(--brass)" : "var(--cream-faint)" }}>{subLabel}</p>
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
              ? "किसी भी प्रश्न के लिए हमसे WhatsApp पर संपर्क करें। बैच सीमित हैं।"
              : "Contact us on WhatsApp for queries about the next batch. Seats are limited."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`${WA_HREF}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "#25D366", color: "#fff" }}>
              <MessageCircle className="h-4 w-4" />
              {isHi ? "WhatsApp पर बात करें" : "Chat on WhatsApp"}
            </a>
            <Link href={bookHref}>
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90"
                style={{ background: "var(--brass)", color: "var(--forest-deep)" }}>
                {isHi ? "परामर्श बुक करें" : "Book Consultancy"} <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
