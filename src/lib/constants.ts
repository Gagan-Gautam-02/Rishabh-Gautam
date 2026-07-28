export const APP_NAME = "Astro Bodh";
export const ASTROLOGER_NAME = "Vedic Astrologer";
export const CONSULTATION_FEE = Number(
  process.env.NEXT_PUBLIC_CONSULTATION_FEE ?? 499
);
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "astrologer@upi";
export const QR_CODE_URL =
  process.env.NEXT_PUBLIC_QR_CODE_URL ?? "/payment-qr.svg";

export const SERVICES = [
  {
    title: "Birth Chart / Kundli",
    description: "Deep kundali analysis covering strengths, challenges, and remedies.",
    detailedDescription:
      "Uncover your planetary alignments, dasha cycles, and karmic strengths with a detailed birth chart reading designed to bring deep clarity and direction.",
    highlights: [
      "Complete Planetary Chart Analysis",
      "Dasha &amp; Transit Predictions",
      "Personalized Vedic Remedies",
    ],
    icon: "Sparkles",
    image: "/service-birth-chart.png",
    action: "book",
  },
  {
    title: "Match Horoscope",
    description: "In-depth Guna Milan and matrimonial compatibility evaluation.",
    detailedDescription:
      "Assess matrimonial compatibility, Guna Milan, and emotional harmony for bride and groom with classical astrological wisdom.",
    highlights: [
      "36 Guna Milan Scoring",
      "Manglik &amp; Dosha Evaluation",
      "Relationship Harmony Guidance",
    ],
    icon: "HeartHandshake",
    image: "/service-match-horoscope.png",
    action: "book",
  },
  {
    title: "Vastu Consultation",
    description: "Align your home and workspace energy for prosperity and peace.",
    detailedDescription:
      "Harmonize the natural elements in your living space and office to remove energy blockages, attracting health, wealth, and spiritual balance.",
    highlights: [
      "Home &amp; Office Energy Mapping",
      "Directional Balancing Remedies",
      "Non-Destructive Vastu Solutions",
    ],
    icon: "Home",
    image: "/service-vastu.png",
    action: "book",
  },
  {
    title: "Your Life Predictions",
    description: "Personalized forecast covering health, finance, love, and career.",
    detailedDescription:
      "Gain foresight into key life phases, upcoming planetary shifts, and opportunities across your health, wealth, love, and career journey.",
    highlights: [
      "Multi-Year Life Roadmap",
      "Career &amp; Wealth Guidance",
      "Timing of Key Life Events",
    ],
    icon: "FileText",
    image: "/service-life-predictions.png",
    action: "book",
  },
  {
    title: "Auspicious Time (Muhurat)",
    description: "Find favorable timings for weddings, business launches, and major decisions.",
    detailedDescription:
      "Choose the most auspicious planetary moments to launch new ventures, hold sacred ceremonies, or sign important contracts for maximum success.",
    highlights: [
      "Shubh Muhurat Selection",
      "Custom Event Timing",
      "Removal of Malefic Obstacles",
    ],
    icon: "Atom",
    image: "/service-gochar-phal.png",
    action: "book",
  },
  {
    title: "Ask to Astrologer",
    description: "Direct one-on-one consultation for pressing life questions.",
    detailedDescription:
      "Connect directly with an experienced Vedic Astrologer to get precise answers, remedies, and personal guidance for any specific concern or query.",
    highlights: [
      "1-on-1 Direct Consultation",
      "Private Chat &amp; Video Support",
      "Actionable Guidance &amp; Remedies",
    ],
    icon: "Phone",
    image: "/service-talk-astrologer.png",
    action: "book",
  },
] as const;

/** Free horoscope & astrology tools shown on the landing page only. */
export const FREE_FEATURES = [
  { title: "Kundli (Birth Chart)", icon: "Sparkles" },
  { title: "Horoscope Matching", icon: "HeartHandshake" },
  { title: "AstroSage Matrimony", icon: "Users" },
  { title: "Ask a Question", icon: "HelpCircle" },
  { title: "Dhruv Astro Software", icon: "Monitor" },
  { title: "Career Counselling", icon: "Briefcase" },
  { title: "Brihat Kundli", icon: "BookOpen" },
  { title: "Exam Results", icon: "ClipboardCheck" },
  { title: "Talk to Astrologer", icon: "Phone", featured: true },
  { title: "Paid Services", icon: "IndianRupee" },
  { title: "Horoscope 2026", icon: "Calendar" },
  { title: "Lal Kitab Horoscope", icon: "BookMarked" },
  { title: "Sade Sati Life Report", icon: "Orbit" },
  { title: "Year Analysis (Varshphal)", icon: "CalendarDays" },
  { title: "Baby Name Suggestion", icon: "Baby" },
  { title: "Gochar Phal (Transit Report)", icon: "Atom" },
  { title: "Life Report", icon: "FileText" },
  { title: "Online Astrology Software", icon: "Laptop" },
  { title: "Hindi Kundli", icon: "Languages" },
  { title: "Numerology Calculator", icon: "Hash" },
  { title: "Celebrity Horoscope", icon: "Star" },
  { title: "Learn Astrology", icon: "Lightbulb" },
  { title: "Love Horoscope", icon: "Heart" },
  { title: "Gemstones Report", icon: "Gem" },
  { title: "Mangal Dosha", icon: "Crosshair" },
  { title: "Dasha Phal Analysis", icon: "CircleDot" },
  { title: "Ascendant Calculator", icon: "Sun" },
  { title: "Today's Rahukaal", icon: "Clock" },
  { title: "AstroSage TV", icon: "Tv" },
  { title: "Occult Directory", icon: "Library" },
  { title: "Chinese Astrology", icon: "Orbit" },
  { title: "Kaalsarp Dosha", icon: "Crosshair" },
] as const;

/** Service directory shown on the user dashboard (title + short blurb + icon). */
export const DASHBOARD_SERVICES = [
  {
    title: "Birth Chart / Kundli",
    description: "Planetary position and your chart.",
    icon: "Sparkles",
    image: "/service-birth-chart.png",
    action: "book",
  },
  {
    title: "Match Horoscope",
    description: "Match Horoscope (Guna milan with your partner)",
    icon: "HeartHandshake",
    image: "/service-match-horoscope.png",
    action: "book",
  },
  {
    title: "Vastu",
    description: "Align your home or workspace energies for prosperity, peace, and positive flow.",
    icon: "Home",
    image: "/service-vastu.png",
    action: "book",
  },
  {
    title: "Your Life Predictions",
    description: "Know about your Nature, Love and Career.",
    icon: "FileText",
    image: "/service-life-predictions.png",
    action: "book",
  },
  {
    title: "Auspicious time",
    description: "A favorably chosen moment to launch any new venture, event, or life milestone to ensure maximum success and good fortune.",
    icon: "Atom",
    image: "/service-gochar-phal.png",
    action: "book",
  },
  {
    title: "Ask to Astrologer",
    description: "Direct 1-on-1 guidance & specific remedies with an experienced Vedic Astrologer.",
    icon: "Phone",
    image: "/service-talk-astrologer.png",
    action: "book",
  },
] as const;

function buildHourlySlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const period = hour < 12 ? "AM" : "PM";
    const display = hour % 12 === 0 ? 12 : hour % 12;
    slots.push(`${String(display).padStart(2, "0")}:00 ${period}`);
  }
  return slots;
}

// All 24 hours at 1-hour intervals (12:00 AM … 11:00 PM)
export const TIME_OPTIONS = buildHourlySlots();
