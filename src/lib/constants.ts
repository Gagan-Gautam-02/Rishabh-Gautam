export const APP_NAME = "Astro Bodh";
export const ASTROLOGER_NAME = "Acharya Rishabh Gautam";
export const CONSULTATION_FEE = Number(
  process.env.NEXT_PUBLIC_CONSULTATION_FEE ?? 499
);
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "astrologer@upi";
export const QR_CODE_URL =
  process.env.NEXT_PUBLIC_QR_CODE_URL ?? "/payment-qr.svg";

export const SERVICES = [
  {
    title: "Career Guidance",
    description:
      "Navigate career crossroads with planetary timing and remedial advice.",
    icon: "Briefcase",
  },
  {
    title: "Love & Relationships",
    description:
      "Understand compatibility, timing, and harmony in your relationships.",
    icon: "Heart",
  },
  {
    title: "Health Insights",
    description:
      "Holistic wellness guidance based on planetary influences on vitality.",
    icon: "Activity",
  },
  {
    title: "Vastu Consultation",
    description:
      "Align your home and workspace energy for prosperity and peace.",
    icon: "Home",
  },
  {
    title: "Numerology",
    description:
      "Decode life path numbers and name vibrations for clearer decisions.",
    icon: "Hash",
  },
  {
    title: "Birth Chart Reading",
    description:
      "Deep kundali analysis covering strengths, challenges, and remedies.",
    icon: "Sparkles",
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
    action: "book",
  },
  {
    title: "Match Horoscope",
    description: "Match Horoscope (Guna milan with your partner)",
    icon: "HeartHandshake",
    action: "book",
  },
  {
    title: "Talk to Astrologer",
    description: "Get First Chat Free with Certified Astrologers.",
    icon: "Phone",
    action: "chat",
  },
  {
    title: "Your Life Predictions",
    description: "Know about your Nature, Love and Career.",
    icon: "FileText",
    action: "book",
  },
  {
    title: "Gochar Phal (Transit Report)",
    description: "How does position of current planets impact you?",
    icon: "Atom",
    action: "book",
  },

  {
    title: "Lal Kitab Horoscope",
    description:
      "Know Lal Kitab (Red Book) predictions, remedies & tips for your problems.",
    icon: "BookMarked",
    action: "book",
  },
  {
    title: "Mangal Dosha",
    description:
      "Do you have Mangal dosha? What are the remedies? Impact on married life?",
    icon: "Crosshair",
    action: "book",
  },
  {
    title: "Ask A Question",
    description: "Get your personalized report by expert astrologers.",
    icon: "HelpCircle",
    action: "chat",
  },
  {
    title: "Ascendant",
    description:
      "What does your Ascendant, Nakshatra and Moon Sign tell about you.",
    icon: "Sun",
    action: "book",
  },
  {
    title: "Gemstones Report",
    description:
      "Which gemstone will suit you? Which gem should you wear? How to wear it?",
    icon: "Gem",
    action: "book",
  },
  {
    title: "Brihat Kundli",
    description: "250+ Pages Colored Kundli.",
    icon: "BookOpen",
    action: "book",
  },
  {
    title: "2026 Personalized Horoscope",
    description: "Get your personalized annual horoscope for 2026.",
    icon: "Calendar",
    action: "book",
  },
  {
    title: "My Day Today",
    description: "Know predictions for today based on your birth chart.",
    icon: "Clock",
    action: "book",
  },
  {
    title: "Year Analysis (Varshphal)",
    description:
      "How will this year be for you? What good and bad can you expect?",
    icon: "CalendarDays",
    action: "book",
  },
  {
    title: "Sade Sati Life Report",
    description: "Know about impact of Shani Sade Sati for whole life.",
    icon: "Orbit",
    action: "book",
  },
  {
    title: "Kalsarp Dosh / Yog",
    description: "Know about impact of Kaalsarp dosh for whole life.",
    icon: "CircleDot",
    action: "book",
  },
  {
    title: "Dasha Phal Analysis",
    description:
      "Know about rise and fall in life, good and bad events, change of time in advance.",
    icon: "Star",
    action: "book",
  },
  {
    title: "Love",
    description: "Know about your Love.",
    icon: "Heart",
    action: "book",
  },
  {
    title: "Career",
    description: "Know about your Career.",
    icon: "Briefcase",
    action: "book",
  },
  {
    title: "Nakshatra",
    description: "Know about your Nakshatra.",
    icon: "Sparkles",
    action: "book",
  },
  {
    title: "Nature",
    description: "Know about your Nature.",
    icon: "Lightbulb",
    action: "book",
  },
  {
    title: "Numerology",
    description: "Know your lucky number.",
    icon: "Hash",
    action: "book",
  },
  {
    title: "Health Index",
    description: "Check your immunity level.",
    icon: "Activity",
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
