export interface WeekModule {
  week: string;
  weekHi: string;
  title: string;
  titleHi: string;
  topics: string[];
  topicsHi: string[];
}

export interface DurationTier {
  key: string;           // "1m" | "3m" | "6m" | "1y"
  label: string;         // "1 Month"
  labelHi: string;       // "एक महीना"
  fee: string;
  teaches: string[];
  teachesHi: string[];
  modules: WeekModule[];
  outcomes: string[];
  outcomesHi: string[];
}

export interface YogaTypeData {
  slug: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  description: string;
  descriptionHi: string;
  heroImage: string;
  highlight?: string;
  highlightHi?: string;
  badge?: string;
  badgeHi?: string;
  tiers: DurationTier[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GROUP YOGA
// ─────────────────────────────────────────────────────────────────────────────
const groupYoga: YogaTypeData = {
  slug: "group",
  name: "Group Yoga Classes",
  nameHi: "समूह योग कक्षाएँ",
  tagline: "Community Practice — Classical Yoga Together",
  taglineHi: "सामुदायिक अभ्यास — एक साथ शास्त्रीय योग",
  description:
    "Our group yoga classes bring together students of all backgrounds to practice classical yoga in a supportive, community setting. Rooted in Patanjali's tradition, classes cover asana, pranayama, and meditation — 7 days a week, with no weekly off.",
  descriptionHi:
    "हमारी समूह योग कक्षाएँ सभी पृष्ठभूमि के छात्रों को एक सहयोगी सामुदायिक वातावरण में शास्त्रीय योग का अभ्यास करने के लिए एक साथ लाती हैं। पतंजलि की परंपरा में निहित, कक्षाओं में आसन, प्राणायाम और ध्यान शामिल हैं — सप्ताह में 7 दिन, बिना साप्ताहिक अवकाश के।",
  heroImage: "/YogaImage4.avif",
  highlight: "Daily Classes — 7 Days a Week · No Weekly Off",
  highlightHi: "प्रतिदिन कक्षाएँ — सप्ताह में 7 दिन · कोई साप्ताहिक अवकाश नहीं",
  badge: "Most Affordable",
  badgeHi: "सबसे किफायती",
  tiers: [
    {
      key: "1m",
      label: "1 Month",
      labelHi: "1 महीना",
      fee: "₹1,500",
      teaches: [
        "Surya Namaskar — 12 steps with breath sync",
        "Anulom Vilom & Bhramari Pranayama",
        "10 foundational asanas with alignment",
        "Basic seated meditation — 10 min daily",
        "Sattvic diet & Ahimsa principles",
        "Introduction to Yama & Niyama",
      ],
      teachesHi: [
        "सूर्य नमस्कार — श्वास समन्वय के साथ 12 चरण",
        "अनुलोम विलोम और भ्रामरी प्राणायाम",
        "संरेखण के साथ 10 मूल आसन",
        "बुनियादी ध्यान — प्रतिदिन 10 मिनट",
        "सात्विक आहार और अहिंसा सिद्धांत",
        "यम और नियम का परिचय",
      ],
      modules: [
        {
          week: "Week 1", weekHi: "सप्ताह 1",
          title: "Body Awareness & Breath", titleHi: "शरीर-जागरूकता और श्वास",
          topics: ["Tadasana, Vrikshasana, Dandasana", "Diaphragmatic breathing", "Yama: Ahimsa, Satya", "Body scan practice"],
          topicsHi: ["ताड़ासन, वृक्षासन, दण्डासन", "डायाफ्रामिक श्वास", "यम: अहिंसा, सत्य", "शरीर-स्कैन अभ्यास"],
        },
        {
          week: "Week 2", weekHi: "सप्ताह 2",
          title: "Surya Namaskar & Core", titleHi: "सूर्य नमस्कार और कोर",
          topics: ["Full Surya Namaskar (12 steps)", "Bhujangasana, Shalabhasana", "Intro to Anulom Vilom", "Niyama: Shaucha, Santosha"],
          topicsHi: ["पूर्ण सूर्य नमस्कार (12 चरण)", "भुजंगासन, शलभासन", "अनुलोम विलोम का परिचय", "नियम: शौच, संतोष"],
        },
        {
          week: "Week 3", weekHi: "सप्ताह 3",
          title: "Pranayama & Meditation", titleHi: "प्राणायाम और ध्यान",
          topics: ["Bhramari & basic Kapalbhati", "Trikonasana, Virabhadrasana", "Trataka meditation", "Sattvic diet guidance"],
          topicsHi: ["भ्रामरी और कपालभाति", "त्रिकोणासन, वीरभद्रासन", "त्राटक ध्यान", "सात्विक आहार मार्गदर्शन"],
        },
        {
          week: "Week 4", weekHi: "सप्ताह 4",
          title: "Integration & Home Practice", titleHi: "एकीकरण और घरेलू अभ्यास",
          topics: ["45-min self-guided session", "Yoga Nidra basics", "Shavasana mastery", "Building daily routine"],
          topicsHi: ["45 मिनट स्व-निर्देशित सत्र", "योग निद्रा की मूलबातें", "शवासन में निपुणता", "दैनिक दिनचर्या निर्माण"],
        },
      ],
      outcomes: [
        "Solid foundation in 10+ classical asanas",
        "Daily Surya Namaskar practice independently",
        "10–15 min Pranayama routine",
        "Basic meditation ability (10 min)",
        "Understanding of yogic lifestyle",
      ],
      outcomesHi: [
        "10+ शास्त्रीय आसनों में मजबूत नींव",
        "स्वतंत्र रूप से दैनिक सूर्य नमस्कार",
        "10–15 मिनट प्राणायाम दिनचर्या",
        "बुनियादी ध्यान क्षमता (10 मिनट)",
        "योगिक जीवनशैली की समझ",
      ],
    },
    {
      key: "3m",
      label: "3 Months",
      labelHi: "3 महीने",
      fee: "₹4,000",
      teaches: [
        "Intermediate asana sequences",
        "Nadi Shodhana — advanced ratios",
        "Chakra system theory & meditation",
        "Yoga Sutras: Chapter 1 & 2",
        "Yoga Nidra — full 40-min sessions",
        "Mudra & Bandha introduction",
        "Classical mantra chanting",
      ],
      teachesHi: [
        "मध्यवर्ती आसन अनुक्रम",
        "नाड़ी शोधन — उन्नत अनुपात",
        "चक्र प्रणाली सिद्धांत और ध्यान",
        "योग सूत्र: अध्याय 1 और 2",
        "योग निद्रा — पूर्ण 40 मिनट सत्र",
        "मुद्रा और बंध का परिचय",
        "शास्त्रीय मंत्र पाठ",
      ],
      modules: [
        {
          week: "Month 1", weekHi: "महीना 1",
          title: "Asana Refinement & Pranayama Depth", titleHi: "आसन परिष्कार और प्राणायाम गहनता",
          topics: ["Review & correct all foundational asanas", "Intermediate sequences", "Nadi Shodhana 1:4:2 ratio", "Yoga Sutras: Samadhi Pada"],
          topicsHi: ["मूल आसनों की समीक्षा और सुधार", "मध्यवर्ती अनुक्रम", "नाड़ी शोधन 1:4:2 अनुपात", "योग सूत्र: समाधि पाद"],
        },
        {
          week: "Month 2", weekHi: "महीना 2",
          title: "Chakras, Mudras & Philosophy", titleHi: "चक्र, मुद्राएँ और दर्शन",
          topics: ["7 Chakras detailed study", "10 classical mudras", "Yoga Sutras: Sadhana Pada", "Advanced Yoga Nidra"],
          topicsHi: ["7 चक्र विस्तृत अध्ययन", "10 शास्त्रीय मुद्राएँ", "योग सूत्र: साधन पाद", "उन्नत योग निद्रा"],
        },
        {
          week: "Month 3", weekHi: "महीना 3",
          title: "Integration & Inner Journey", titleHi: "एकीकरण और आंतरिक यात्रा",
          topics: ["75-min self-guided practice", "Samkhya Darshan overview", "Kumbhaka Pranayama", "Silent meditation sessions"],
          topicsHi: ["75 मिनट स्व-निर्देशित अभ्यास", "सांख्य दर्शन सिंहावलोकन", "कुम्भक प्राणायाम", "मौन ध्यान सत्र"],
        },
      ],
      outcomes: [
        "Proficiency in 20+ asanas",
        "Daily 20-min Nadi Shodhana practice",
        "Understanding of all 7 Chakras",
        "Ability to guide Yoga Nidra",
        "Reading Yoga Sutras Ch. 1 & 2",
      ],
      outcomesHi: [
        "20+ आसनों में दक्षता",
        "दैनिक 20 मिनट नाड़ी शोधन",
        "सभी 7 चक्रों की समझ",
        "योग निद्रा निर्देशित करने की क्षमता",
        "योग सूत्र अध्याय 1 और 2 का पठन",
      ],
    },
    {
      key: "6m",
      label: "6 Months",
      labelHi: "6 महीने",
      fee: "₹7,000",
      teaches: [
        "Advanced asanas — Sirsasana, Sarvangasana",
        "All 8 types of Pranayama",
        "Complete Yoga Sutras (all 4 chapters)",
        "Jyotish Vidya & yoga integration",
        "Samkhya philosophy in depth",
        "Classical texts — Hatha Yoga Pradipika",
        "Teaching methodology & sequencing",
        "Ayurveda basics for yogic health",
      ],
      teachesHi: [
        "उन्नत आसन — शीर्षासन, सर्वांगासन",
        "सभी 8 प्रकार के प्राणायाम",
        "पूर्ण योग सूत्र (सभी 4 अध्याय)",
        "ज्योतिष विद्या और योग एकीकरण",
        "गहन सांख्य दर्शन",
        "शास्त्रीय ग्रंथ — हठयोग प्रदीपिका",
        "शिक्षण पद्धति और अनुक्रम",
        "योगिक स्वास्थ्य के लिए आयुर्वेद",
      ],
      modules: [
        {
          week: "Month 1–2", weekHi: "महीना 1–2",
          title: "Advanced Asana & Pranayama", titleHi: "उन्नत आसन और प्राणायाम",
          topics: ["Inversions, backbends, twists", "Pranayama 1–4: Nadi Shodhana, Bhastrika, Surya Bhedana, Ujjayi", "Yoga Sutras Ch. 1–2", "Hatha Yoga Pradipika Ch. 1–2"],
          topicsHi: ["उलटे, पीछे और मोड़ आसन", "प्राणायाम 1–4: नाड़ी शोधन, भस्त्रिका, सूर्य भेदन, उज्जायी", "योग सूत्र अध्याय 1–2", "हठयोग प्रदीपिका अध्याय 1–2"],
        },
        {
          week: "Month 3–4", weekHi: "महीना 3–4",
          title: "Philosophy & Jyotish Vidya", titleHi: "दर्शन और ज्योतिष विद्या",
          topics: ["Pranayama 5–8: Chandra Bhedana, Sheetali, Sheetkari, Moorcha", "Samkhya: 25 Tattvas", "Jyotish Vidya: planetary effects on practice", "Class sequencing methodology"],
          topicsHi: ["प्राणायाम 5–8: चंद्र भेदन, शीतली, शीत्कारी, मूर्च्छा", "सांख्य: 25 तत्त्व", "ज्योतिष विद्या: ग्रहों का अभ्यास पर प्रभाव", "कक्षा अनुक्रम पद्धति"],
        },
        {
          week: "Month 5–6", weekHi: "महीना 5–6",
          title: "Mastery & Certification", titleHi: "निपुणता और प्रमाणन",
          topics: ["Ayurveda Doshas & seasonal practice", "90-min independent class (assessed)", "Silent 2-day retreat", "Final exam — written & practical"],
          topicsHi: ["आयुर्वेद दोष और मौसमी अभ्यास", "90 मिनट स्वतंत्र कक्षा (मूल्यांकन सहित)", "मौन 2 दिवसीय रिट्रीट", "अंतिम परीक्षा — लिखित और व्यावहारिक"],
        },
      ],
      outcomes: [
        "Full proficiency in advanced classical asanas",
        "Mastery of all 8 Pranayama types",
        "Complete knowledge of Yoga Sutras",
        "Understanding of Jyotish Vidya in practice",
        "Shastriya Yogshala Certificate",
      ],
      outcomesHi: [
        "उन्नत शास्त्रीय आसनों में पूर्ण दक्षता",
        "सभी 8 प्राणायाम में निपुणता",
        "योग सूत्रों का संपूर्ण ज्ञान",
        "अभ्यास में ज्योतिष विद्या की समझ",
        "शास्त्रीय योगशाला प्रमाण-पत्र",
      ],
    },
    {
      key: "1y",
      label: "1 Year",
      labelHi: "1 वर्ष",
      fee: "₹12,000",
      teaches: [
        "Complete classical yoga mastery",
        "All advanced asanas + therapeutic sequences",
        "All 8 Pranayama + Kumbhaka mastery",
        "Complete Yoga Sutras deep study",
        "Jyotish Vidya & Samkhya full course",
        "Full teaching certification program",
        "Ayurveda & lifestyle integration",
        "Vedic mantra chanting advanced",
        "Personal practice design for students",
      ],
      teachesHi: [
        "पूर्ण शास्त्रीय योग निपुणता",
        "सभी उन्नत आसन + चिकित्सीय अनुक्रम",
        "सभी 8 प्राणायाम + कुम्भक में निपुणता",
        "योग सूत्रों का गहन पूर्ण अध्ययन",
        "ज्योतिष विद्या और सांख्य पूर्ण पाठ्यक्रम",
        "पूर्ण शिक्षण प्रमाणन कार्यक्रम",
        "आयुर्वेद और जीवनशैली एकीकरण",
        "वैदिक मंत्र पाठ उन्नत",
        "छात्रों के लिए व्यक्तिगत अभ्यास डिज़ाइन",
      ],
      modules: [
        {
          week: "Q1 (Month 1–3)", weekHi: "Q1 (महीना 1–3)",
          title: "Foundation to Intermediate Mastery", titleHi: "नींव से मध्यवर्ती निपुणता",
          topics: ["Complete foundational & intermediate curriculum", "Yoga Sutras Ch. 1–2", "Pranayama 1–4 mastery", "Group teaching practice"],
          topicsHi: ["पूर्ण मूल और मध्यवर्ती पाठ्यक्रम", "योग सूत्र अध्याय 1–2", "प्राणायाम 1–4 में निपुणता", "समूह शिक्षण अभ्यास"],
        },
        {
          week: "Q2 (Month 4–6)", weekHi: "Q2 (महीना 4–6)",
          title: "Advanced Practice & Philosophy", titleHi: "उन्नत अभ्यास और दर्शन",
          topics: ["Advanced asanas & inversions", "Pranayama 5–8 + Kumbhaka", "Samkhya & Vedanta philosophy", "Jyotish Vidya integration"],
          topicsHi: ["उन्नत आसन और उलटे", "प्राणायाम 5–8 + कुम्भक", "सांख्य और वेदांत दर्शन", "ज्योतिष विद्या एकीकरण"],
        },
        {
          week: "Q3 (Month 7–9)", weekHi: "Q3 (महीना 7–9)",
          title: "Teaching Methodology & Classical Texts", titleHi: "शिक्षण पद्धति और शास्त्रीय ग्रंथ",
          topics: ["Hatha Yoga Pradipika complete", "Ayurveda Doshas deep study", "Class design for all levels", "Adjustments & hands-on technique"],
          topicsHi: ["हठयोग प्रदीपिका संपूर्ण", "आयुर्वेद दोष गहन अध्ययन", "सभी स्तरों के लिए कक्षा डिज़ाइन", "समायोजन और व्यावहारिक तकनीक"],
        },
        {
          week: "Q4 (Month 10–12)", weekHi: "Q4 (महीना 10–12)",
          title: "Integration, Retreat & Certification", titleHi: "एकीकरण, रिट्रीट और प्रमाणन",
          topics: ["Full 90-min class teaching (assessed)", "5-day silent retreat", "Personal practice design for students", "Final certification exam"],
          topicsHi: ["90 मिनट कक्षा शिक्षण (मूल्यांकन सहित)", "5 दिवसीय मौन रिट्रीट", "छात्रों के लिए व्यक्तिगत अभ्यास डिज़ाइन", "अंतिम प्रमाणन परीक्षा"],
        },
      ],
      outcomes: [
        "Complete classical yoga master practitioner",
        "Certified yoga teacher (Shastriya tradition)",
        "Full Jyotish Vidya & Samkhya knowledge",
        "Ability to design & run independent yoga programs",
        "Lifetime connection with Shastriya Yogshala",
      ],
      outcomesHi: [
        "पूर्ण शास्त्रीय योग मास्टर साधक",
        "प्रमाणित योग शिक्षक (शास्त्रीय परंपरा)",
        "पूर्ण ज्योतिष विद्या और सांख्य ज्ञान",
        "स्वतंत्र योग कार्यक्रम डिज़ाइन और संचालन की क्षमता",
        "शास्त्रीय योगशाला के साथ जीवन भर का संबंध",
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ONLINE PERSONAL YOGA
// ─────────────────────────────────────────────────────────────────────────────
const onlinePersonalYoga: YogaTypeData = {
  slug: "online-personal",
  name: "Online Personal Yoga Classes",
  nameHi: "ऑनलाइन व्यक्तिगत योग कक्षाएँ",
  tagline: "Daily 1-Hour — Live, Personal, Classical",
  taglineHi: "प्रतिदिन 1 घंटा — लाइव, व्यक्तिगत, शास्त्रीय",
  description:
    "Learn classical yoga one-on-one with your teacher via live online sessions — every single day, 7 days a week. Each session is 1 hour and fully personalized to your level, needs, and schedule. No group distractions — just you and pure classical practice.",
  descriptionHi:
    "लाइव ऑनलाइन सत्रों के माध्यम से अपने शिक्षक के साथ एकांत में शास्त्रीय योग सीखें — हर दिन, सप्ताह में 7 दिन। प्रत्येक सत्र 1 घंटे का है और पूरी तरह से आपके स्तर, जरूरतों और समय-सारणी के अनुसार व्यक्तिगत है।",
  heroImage: "/YogaImage5.avif",
  highlight: "Daily 1 Hour · Live Online · 7 Days a Week",
  highlightHi: "प्रतिदिन 1 घंटा · लाइव ऑनलाइन · सप्ताह में 7 दिन",
  badge: "Most Flexible",
  badgeHi: "सबसे लचीला",
  tiers: [
    {
      key: "1m", label: "1 Month", labelHi: "1 महीना", fee: "₹10,000",
      teaches: ["Personalized asana practice", "Pranayama tailored to your dosha", "One-on-one progress tracking", "Live corrections & adjustments", "Custom daily practice plan", "Weekly review calls"],
      teachesHi: ["व्यक्तिगत आसन अभ्यास", "आपके दोष के अनुसार प्राणायाम", "एकांत प्रगति ट्रैकिंग", "लाइव सुधार और समायोजन", "कस्टम दैनिक अभ्यास योजना", "साप्ताहिक समीक्षा कॉल"],
      modules: [
        { week: "Week 1", weekHi: "सप्ताह 1", title: "Assessment & Foundation Plan", titleHi: "मूल्यांकन और नींव योजना", topics: ["Body-mind assessment", "Personal practice plan creation", "Foundation asanas with live corrections", "Pranayama suited to constitution"], topicsHi: ["शरीर-मन मूल्यांकन", "व्यक्तिगत अभ्यास योजना निर्माण", "लाइव सुधार के साथ मूल आसन", "प्रकृति के अनुसार प्राणायाम"] },
        { week: "Week 2–3", weekHi: "सप्ताह 2–3", title: "Personalized Deepening", titleHi: "व्यक्तिगत गहनता", topics: ["Intermediate asanas based on progress", "Meditation technique matching your nature", "Pranayama ratio progression", "Diet & lifestyle guidance"], topicsHi: ["प्रगति के आधार पर मध्यवर्ती आसन", "आपकी प्रकृति के अनुरूप ध्यान तकनीक", "प्राणायाम अनुपात प्रगति", "आहार और जीवनशैली मार्गदर्शन"] },
        { week: "Week 4", weekHi: "सप्ताह 4", title: "Integration & Review", titleHi: "एकीकरण और समीक्षा", topics: ["Full personal practice session review", "Home practice routine finalization", "Monthly progress assessment", "Next phase planning"], topicsHi: ["पूर्ण व्यक्तिगत अभ्यास सत्र समीक्षा", "घरेलू अभ्यास दिनचर्या अंतिम रूप", "मासिक प्रगति मूल्यांकन", "अगले चरण की योजना"] },
      ],
      outcomes: ["Personalized classical yoga foundation", "Daily self-practice ability", "Customized Pranayama routine", "Direct teacher-student relationship"],
      outcomesHi: ["व्यक्तिगत शास्त्रीय योग नींव", "दैनिक स्वयं-अभ्यास क्षमता", "अनुकूलित प्राणायाम दिनचर्या", "प्रत्यक्ष गुरु-शिष्य संबंध"],
    },
    {
      key: "3m", label: "3 Months", labelHi: "3 महीने", fee: "₹27,000",
      teaches: ["Complete classical curriculum personalized", "Advanced asana based on individual capacity", "All core Pranayama types", "Chakra & energy work tailored to you", "Yoga Sutras study (guided)", "Mudra & Bandha practice", "Regular progress milestones"],
      teachesHi: ["व्यक्तिगत पूर्ण शास्त्रीय पाठ्यक्रम", "व्यक्तिगत क्षमता पर आधारित उन्नत आसन", "सभी मुख्य प्राणायाम प्रकार", "आपके लिए अनुकूलित चक्र और ऊर्जा कार्य", "योग सूत्र अध्ययन (निर्देशित)", "मुद्रा और बंध अभ्यास", "नियमित प्रगति मील के पत्थर"],
      modules: [
        { week: "Month 1", weekHi: "महीना 1", title: "Deep Foundation & Personal Assessment", titleHi: "गहरी नींव और व्यक्तिगत मूल्यांकन", topics: ["Full assessment & 3-month roadmap", "Personalized asana progression", "Pranayama 1–2 with custom ratios", "Yoga Sutras Ch. 1 study"], topicsHi: ["पूर्ण मूल्यांकन और 3 महीने का रोडमैप", "व्यक्तिगत आसन प्रगति", "कस्टम अनुपात के साथ प्राणायाम 1–2", "योग सूत्र अध्याय 1 अध्ययन"] },
        { week: "Month 2", weekHi: "महीना 2", title: "Chakras & Advanced Practices", titleHi: "चक्र और उन्नत अभ्यास", topics: ["7 Chakra meditation (personalized)", "Mudra & Bandha for your constitution", "Pranayama 3–4", "Yoga Sutras Ch. 2"], topicsHi: ["7 चक्र ध्यान (व्यक्तिगत)", "आपकी प्रकृति के अनुसार मुद्रा और बंध", "प्राणायाम 3–4", "योग सूत्र अध्याय 2"] },
        { week: "Month 3", weekHi: "महीना 3", title: "Mastery Integration", titleHi: "निपुणता एकीकरण", topics: ["75-min self-guided practice review", "Personal Yoga Nidra recording", "Kumbhaka practice", "3-month final assessment"], topicsHi: ["75 मिनट स्व-निर्देशित अभ्यास समीक्षा", "व्यक्तिगत योग निद्रा रिकॉर्डिंग", "कुम्भक अभ्यास", "3 महीने का अंतिम मूल्यांकन"] },
      ],
      outcomes: ["Advanced personalized asana practice", "All core Pranayama types mastered", "Deep chakra & energy understanding", "Strong guru-shishya relationship", "Customized 3-month transformation"],
      outcomesHi: ["उन्नत व्यक्तिगत आसन अभ्यास", "सभी मुख्य प्राणायाम में निपुणता", "गहरी चक्र और ऊर्जा समझ", "मजबूत गुरु-शिष्य संबंध", "अनुकूलित 3 महीने का परिवर्तन"],
    },
    {
      key: "6m", label: "6 Months", labelHi: "6 महीने", fee: "₹48,000",
      teaches: ["Complete advanced classical curriculum", "All 8 Pranayama types personalized", "Full Yoga Sutras deep study", "Jyotish Vidya personal integration", "Samkhya philosophy guided", "Teaching methodology (optional)", "Personal Ayurveda health plan"],
      teachesHi: ["पूर्ण उन्नत शास्त्रीय पाठ्यक्रम", "सभी 8 प्राणायाम व्यक्तिगत", "पूर्ण योग सूत्र गहन अध्ययन", "ज्योतिष विद्या व्यक्तिगत एकीकरण", "सांख्य दर्शन निर्देशित", "शिक्षण पद्धति (वैकल्पिक)", "व्यक्तिगत आयुर्वेद स्वास्थ्य योजना"],
      modules: [
        { week: "Month 1–2", weekHi: "महीना 1–2", title: "Advanced Foundation & Complete Pranayama", titleHi: "उन्नत नींव और पूर्ण प्राणायाम", topics: ["Advanced asana mastery plan", "All 8 Pranayama types with ratios", "Yoga Sutras Ch. 1–2 deep study", "Jyotish Vidya: birth chart & practice"], topicsHi: ["उन्नत आसन निपुणता योजना", "अनुपात के साथ सभी 8 प्राणायाम", "योग सूत्र अध्याय 1–2 गहन अध्ययन", "ज्योतिष विद्या: जन्म कुंडली और अभ्यास"] },
        { week: "Month 3–4", weekHi: "महीना 3–4", title: "Philosophy & Lifestyle Integration", titleHi: "दर्शन और जीवनशैली एकीकरण", topics: ["Samkhya 25 Tattvas personalized", "Ayurveda personal health plan", "Hatha Yoga Pradipika study", "Yoga Sutras Ch. 3–4"], topicsHi: ["सांख्य 25 तत्त्व व्यक्तिगत", "आयुर्वेद व्यक्तिगत स्वास्थ्य योजना", "हठयोग प्रदीपिका अध्ययन", "योग सूत्र अध्याय 3–4"] },
        { week: "Month 5–6", weekHi: "महीना 5–6", title: "Mastery & Certification Path", titleHi: "निपुणता और प्रमाणन मार्ग", topics: ["Personal retreat simulation (online)", "Final holistic assessment", "Personal practice document creation", "Shastriya Yogshala Online Certificate"], topicsHi: ["व्यक्तिगत रिट्रीट सिमुलेशन (ऑनलाइन)", "अंतिम समग्र मूल्यांकन", "व्यक्तिगत अभ्यास दस्तावेज निर्माण", "शास्त्रीय योगशाला ऑनलाइन प्रमाण-पत्र"] },
      ],
      outcomes: ["Complete advanced classical practice", "All 8 Pranayama mastered", "Deep philosophical foundation", "Personal Jyotish Vidya integration", "Online Certificate — Shastriya Yogshala"],
      outcomesHi: ["पूर्ण उन्नत शास्त्रीय अभ्यास", "सभी 8 प्राणायाम में निपुणता", "गहरी दार्शनिक नींव", "व्यक्तिगत ज्योतिष विद्या एकीकरण", "ऑनलाइन प्रमाण-पत्र — शास्त्रीय योगशाला"],
    },
    {
      key: "1y", label: "1 Year", labelHi: "1 वर्ष", fee: "₹84,000",
      teaches: ["Complete transformation program", "All levels of classical yoga", "All 8 Pranayama + advanced Kumbhaka", "Full Yoga Sutras & classical texts", "Complete Jyotish Vidya integration", "Teaching certification (if desired)", "Full Ayurveda-yoga lifestyle plan", "Monthly 1-on-1 deep review sessions"],
      teachesHi: ["पूर्ण परिवर्तन कार्यक्रम", "शास्त्रीय योग के सभी स्तर", "सभी 8 प्राणायाम + उन्नत कुम्भक", "पूर्ण योग सूत्र और शास्त्रीय ग्रंथ", "पूर्ण ज्योतिष विद्या एकीकरण", "शिक्षण प्रमाणन (यदि वांछित)", "पूर्ण आयुर्वेद-योग जीवनशैली योजना", "मासिक 1-on-1 गहन समीक्षा सत्र"],
      modules: [
        { week: "Q1", weekHi: "Q1", title: "Foundation to Intermediate (Personalized)", titleHi: "नींव से मध्यवर्ती (व्यक्तिगत)", topics: ["Full body-mind assessment", "Personalized 1-year roadmap", "Foundation & intermediate curriculum", "Pranayama 1–4 mastery"], topicsHi: ["पूर्ण शरीर-मन मूल्यांकन", "व्यक्तिगत 1 वर्ष का रोडमैप", "नींव और मध्यवर्ती पाठ्यक्रम", "प्राणायाम 1–4 में निपुणता"] },
        { week: "Q2", weekHi: "Q2", title: "Advanced Practice & Philosophy", titleHi: "उन्नत अभ्यास और दर्शन", topics: ["Advanced asanas & inversions", "Pranayama 5–8 + Kumbhaka", "Yoga Sutras all 4 chapters", "Jyotish Vidya deep study"], topicsHi: ["उन्नत आसन और उलटे", "प्राणायाम 5–8 + कुम्भक", "योग सूत्र सभी 4 अध्याय", "ज्योतिष विद्या गहन अध्ययन"] },
        { week: "Q3", weekHi: "Q3", title: "Classical Texts & Lifestyle Integration", titleHi: "शास्त्रीय ग्रंथ और जीवनशैली एकीकरण", topics: ["Hatha Yoga Pradipika complete", "Personal Ayurveda plan", "Samkhya complete 25 Tattvas", "Teaching methodology (if pursuing)"], topicsHi: ["हठयोग प्रदीपिका संपूर्ण", "व्यक्तिगत आयुर्वेद योजना", "सांख्य पूर्ण 25 तत्त्व", "शिक्षण पद्धति (यदि इच्छुक)"] },
        { week: "Q4", weekHi: "Q4", title: "Mastery, Retreat & Certification", titleHi: "निपुणता, रिट्रीट और प्रमाणन", topics: ["Online silent retreat (1 week)", "Final comprehensive assessment", "Personal practice document", "1-Year Mastery Certificate"], topicsHi: ["ऑनलाइन मौन रिट्रीट (1 सप्ताह)", "अंतिम व्यापक मूल्यांकन", "व्यक्तिगत अभ्यास दस्तावेज", "1 वर्ष निपुणता प्रमाण-पत्र"] },
      ],
      outcomes: ["Complete classical yoga master (online)", "All 8 Pranayama + Kumbhaka mastered", "Full philosophical & textual knowledge", "Teaching readiness (if chosen)", "1-Year Master Certificate — Shastriya Yogshala"],
      outcomesHi: ["पूर्ण शास्त्रीय योग मास्टर (ऑनलाइन)", "सभी 8 प्राणायाम + कुम्भक में निपुणता", "पूर्ण दार्शनिक और पाठ्य ज्ञान", "शिक्षण तत्परता (यदि चुना गया)", "1 वर्ष मास्टर प्रमाण-पत्र — शास्त्रीय योगशाला"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. IN-PERSON PERSONAL YOGA
// ─────────────────────────────────────────────────────────────────────────────
const personalYoga: YogaTypeData = {
  slug: "personal",
  name: "Personal Yoga Classes",
  nameHi: "व्यक्तिगत योग कक्षाएँ",
  tagline: "One-on-One · At Your Home or Any Location",
  taglineHi: "आमने-सामने · आपके घर या किसी भी स्थान पर",
  description:
    "The most intimate and effective way to learn classical yoga. Sessions are conducted in-person at your home or any location convenient to you. Your teacher comes to you — fully focused, fully personalized. Every session is 1-on-1 with no distractions, tailored completely to your body, health, and goals.",
  descriptionHi:
    "शास्त्रीय योग सीखने का सबसे घनिष्ठ और प्रभावी तरीका। सत्र आपके घर पर या आपके लिए सुविधाजनक किसी भी स्थान पर व्यक्तिगत रूप से आयोजित किए जाते हैं। आपका शिक्षक आपके पास आता है — पूरी तरह से केंद्रित, पूरी तरह से व्यक्तिगत।",
  heroImage: "/YogaImage1.jpg",
  highlight: "Teacher Comes to You · Your Home or Any Location",
  highlightHi: "शिक्षक आपके पास आते हैं · आपका घर या कोई भी स्थान",
  badge: "Most Personal",
  badgeHi: "सबसे व्यक्तिगत",
  tiers: [
    {
      key: "1m", label: "1 Month", labelHi: "1 महीना", fee: "₹15,000",
      teaches: ["Fully personalized in-person sessions", "Real-time physical adjustments", "Custom asana plan for your body", "Pranayama personalized to you", "Diet & lifestyle home guidance", "Daily practice routine designed for you"],
      teachesHi: ["पूर्णतः व्यक्तिगत आमने-सामने सत्र", "वास्तविक समय में शारीरिक समायोजन", "आपके शरीर के लिए कस्टम आसन योजना", "आपके लिए व्यक्तिगत प्राणायाम", "आहार और जीवनशैली घरेलू मार्गदर्शन", "आपके लिए दैनिक अभ्यास दिनचर्या"],
      modules: [
        { week: "Week 1", weekHi: "सप्ताह 1", title: "In-Person Assessment & Plan", titleHi: "आमने-सामने मूल्यांकन और योजना", topics: ["Full physical & postural assessment", "Custom 1-month plan creation", "Foundation asanas with hands-on correction", "Breathing assessment & pranayama base"], topicsHi: ["पूर्ण शारीरिक और मुद्रा मूल्यांकन", "कस्टम 1 महीने की योजना निर्माण", "हाथों से सुधार के साथ मूल आसन", "श्वास मूल्यांकन और प्राणायाम आधार"] },
        { week: "Week 2–3", weekHi: "सप्ताह 2–3", title: "Guided Progression at Your Pace", titleHi: "आपकी गति से निर्देशित प्रगति", topics: ["Progressive asana advancement", "Personalized pranayama techniques", "Meditation suitable for your nature", "Home environment yoga setup guidance"], topicsHi: ["प्रगतिशील आसन उन्नति", "व्यक्तिगत प्राणायाम तकनीक", "आपकी प्रकृति के लिए उपयुक्त ध्यान", "घरेलू वातावरण योग सेटअप मार्गदर्शन"] },
        { week: "Week 4", weekHi: "सप्ताह 4", title: "Review & Independent Practice Setup", titleHi: "समीक्षा और स्वतंत्र अभ्यास सेटअप", topics: ["Monthly progress review", "Home practice routine finalised", "Assessment & next phase recommendation", "WhatsApp support between sessions"], topicsHi: ["मासिक प्रगति समीक्षा", "घरेलू अभ्यास दिनचर्या अंतिम रूप", "मूल्यांकन और अगले चरण की सिफारिश", "सत्रों के बीच WhatsApp सहयोग"] },
      ],
      outcomes: ["Personalized physical foundation", "Correct posture & alignment from day 1", "Custom Pranayama routine", "Direct one-on-one teacher attention"],
      outcomesHi: ["व्यक्तिगत शारीरिक नींव", "पहले दिन से सही मुद्रा और संरेखण", "कस्टम प्राणायाम दिनचर्या", "प्रत्यक्ष एकांत शिक्षक ध्यान"],
    },
    {
      key: "3m", label: "3 Months", labelHi: "3 महीने", fee: "₹40,000",
      teaches: ["Deep classical curriculum in-person", "Advanced asanas with constant correction", "All core Pranayama types", "Chakra meditation personalized", "Yoga Sutras guided study", "Lifestyle & diet complete overhaul", "Mudra & Bandha hands-on practice"],
      teachesHi: ["आमने-सामने गहरा शास्त्रीय पाठ्यक्रम", "निरंतर सुधार के साथ उन्नत आसन", "सभी मुख्य प्राणायाम प्रकार", "व्यक्तिगत चक्र ध्यान", "योग सूत्र निर्देशित अध्ययन", "जीवनशैली और आहार का पूर्ण सुधार", "हाथों से मुद्रा और बंध अभ्यास"],
      modules: [
        { week: "Month 1", weekHi: "महीना 1", title: "Deep Foundation In-Person", titleHi: "आमने-सामने गहरी नींव", topics: ["Full in-person assessment + 3-month plan", "Personalized asana foundation", "Pranayama 1–2 with physical guidance", "Yogic lifestyle design for your home"], topicsHi: ["पूर्ण आमने-सामने मूल्यांकन + 3 महीने की योजना", "व्यक्तिगत आसन नींव", "शारीरिक मार्गदर्शन के साथ प्राणायाम 1–2", "आपके घर के लिए योगिक जीवनशैली डिज़ाइन"] },
        { week: "Month 2", weekHi: "महीना 2", title: "Advanced Practice & Philosophy", titleHi: "उन्नत अभ्यास और दर्शन", topics: ["Advanced asanas with hands-on adjustments", "7 Chakra work personalized", "Pranayama 3–4 with Kumbhaka intro", "Yoga Sutras Ch. 1–2 study"], topicsHi: ["हाथों से समायोजन के साथ उन्नत आसन", "7 चक्र कार्य व्यक्तिगत", "कुम्भक परिचय के साथ प्राणायाम 3–4", "योग सूत्र अध्याय 1–2 अध्ययन"] },
        { week: "Month 3", weekHi: "महीना 3", title: "Integration & Mastery", titleHi: "एकीकरण और निपुणता", topics: ["75-min self-practice with teacher present", "Mudra & Bandha in-person", "3-month holistic assessment", "Long-term practice design"], topicsHi: ["शिक्षक की उपस्थिति में 75 मिनट स्व-अभ्यास", "आमने-सामने मुद्रा और बंध", "3 महीने का समग्र मूल्यांकन", "दीर्घकालिक अभ्यास डिज़ाइन"] },
      ],
      outcomes: ["Advanced in-person classical practice", "Correct alignment deeply embedded", "All Pranayama types with guidance", "Personalized philosophical foundation", "3-month physical transformation"],
      outcomesHi: ["उन्नत आमने-सामने शास्त्रीय अभ्यास", "गहराई से अंतर्निहित सही संरेखण", "मार्गदर्शन के साथ सभी प्राणायाम प्रकार", "व्यक्तिगत दार्शनिक नींव", "3 महीने का शारीरिक परिवर्तन"],
    },
    {
      key: "6m", label: "6 Months", labelHi: "6 महीने", fee: "₹72,000",
      teaches: ["Complete advanced in-person curriculum", "All 8 Pranayama + Kumbhaka mastered", "Full Yoga Sutras in-person study", "Jyotish Vidya personal consultation", "Samkhya philosophy in-person", "Teaching methodology in-person", "Full Ayurveda personal health plan"],
      teachesHi: ["पूर्ण उन्नत आमने-सामने पाठ्यक्रम", "सभी 8 प्राणायाम + कुम्भक में निपुणता", "पूर्ण योग सूत्र आमने-सामने अध्ययन", "ज्योतिष विद्या व्यक्तिगत परामर्श", "सांख्य दर्शन आमने-सामने", "शिक्षण पद्धति आमने-सामने", "पूर्ण आयुर्वेद व्यक्तिगत स्वास्थ्य योजना"],
      modules: [
        { week: "Month 1–2", weekHi: "महीना 1–2", title: "Advanced Asana Mastery In-Person", titleHi: "आमने-सामने उन्नत आसन निपुणता", topics: ["Complete advanced asana plan", "All 8 Pranayama types in-person", "Yoga Sutras Ch. 1–2 with teacher", "Jyotish Vidya personal birth chart"], topicsHi: ["पूर्ण उन्नत आसन योजना", "आमने-सामने सभी 8 प्राणायाम", "शिक्षक के साथ योग सूत्र अध्याय 1–2", "ज्योतिष विद्या व्यक्तिगत जन्म कुंडली"] },
        { week: "Month 3–4", weekHi: "महीना 3–4", title: "Philosophy & Lifestyle Transformation", titleHi: "दर्शन और जीवनशैली परिवर्तन", topics: ["Samkhya 25 Tattvas in-person", "Ayurveda personal health overhaul", "Hatha Yoga Pradipika in-person study", "Yoga Sutras Ch. 3–4"], topicsHi: ["सांख्य 25 तत्त्व आमने-सामने", "आयुर्वेद व्यक्तिगत स्वास्थ्य सुधार", "हठयोग प्रदीपिका आमने-सामने अध्ययन", "योग सूत्र अध्याय 3–4"] },
        { week: "Month 5–6", weekHi: "महीना 5–6", title: "Mastery & Home Practice Certification", titleHi: "निपुणता और घरेलू अभ्यास प्रमाणन", topics: ["90-min independent practice assessment", "Teaching methodology basics", "Personal 6-month achievement review", "Shastriya Yogshala Personal Certificate"], topicsHi: ["90 मिनट स्वतंत्र अभ्यास मूल्यांकन", "शिक्षण पद्धति की मूलबातें", "व्यक्तिगत 6 महीने की उपलब्धि समीक्षा", "शास्त्रीय योगशाला व्यक्तिगत प्रमाण-पत्र"] },
      ],
      outcomes: ["Advanced in-person classical mastery", "All 8 Pranayama mastered with teacher", "Complete philosophical foundation in-person", "Jyotish Vidya personal integration", "6-Month Personal Certificate"],
      outcomesHi: ["आमने-सामने उन्नत शास्त्रीय निपुणता", "शिक्षक के साथ सभी 8 प्राणायाम में निपुणता", "आमने-सामने पूर्ण दार्शनिक नींव", "ज्योतिष विद्या व्यक्तिगत एकीकरण", "6 महीने का व्यक्तिगत प्रमाण-पत्र"],
    },
    {
      key: "1y", label: "12 Months", labelHi: "12 महीने", fee: "₹1,20,000",
      teaches: ["Ultimate in-person transformation", "Complete classical yoga from foundation to mastery", "All 8 Pranayama + advanced Kumbhaka", "Full classical texts in-person", "Complete Jyotish Vidya", "Full teaching certification path", "Ayurveda complete lifestyle design", "Quarterly personal retreat sessions"],
      teachesHi: ["अंतिम आमने-सामने परिवर्तन", "नींव से निपुणता तक पूर्ण शास्त्रीय योग", "सभी 8 प्राणायाम + उन्नत कुम्भक", "आमने-सामने पूर्ण शास्त्रीय ग्रंथ", "पूर्ण ज्योतिष विद्या", "पूर्ण शिक्षण प्रमाणन मार्ग", "आयुर्वेद पूर्ण जीवनशैली डिज़ाइन", "त्रैमासिक व्यक्तिगत रिट्रीट सत्र"],
      modules: [
        { week: "Q1", weekHi: "Q1", title: "Foundation to Intermediate (In-Person)", titleHi: "नींव से मध्यवर्ती (आमने-सामने)", topics: ["Complete physical assessment", "1-year personalized roadmap", "Foundation & intermediate in-person", "Pranayama 1–4 mastery"], topicsHi: ["पूर्ण शारीरिक मूल्यांकन", "1 वर्ष का व्यक्तिगत रोडमैप", "नींव और मध्यवर्ती आमने-सामने", "प्राणायाम 1–4 में निपुणता"] },
        { week: "Q2", weekHi: "Q2", title: "Advanced Practice & All Pranayama", titleHi: "उन्नत अभ्यास और सभी प्राणायाम", topics: ["Advanced inversions & backbends", "All 8 Pranayama + Kumbhaka", "Yoga Sutras all 4 chapters", "Jyotish Vidya complete integration"], topicsHi: ["उन्नत उलटे और पीछे के आसन", "सभी 8 प्राणायाम + कुम्भक", "योग सूत्र सभी 4 अध्याय", "ज्योतिष विद्या पूर्ण एकीकरण"] },
        { week: "Q3", weekHi: "Q3", title: "Classical Texts, Ayurveda & Teaching", titleHi: "शास्त्रीय ग्रंथ, आयुर्वेद और शिक्षण", topics: ["All classical texts complete", "Ayurveda full lifestyle plan", "Teaching methodology mastery", "Personal retreat (2-day, in-person)"], topicsHi: ["सभी शास्त्रीय ग्रंथ संपूर्ण", "आयुर्वेद पूर्ण जीवनशैली योजना", "शिक्षण पद्धति में निपुणता", "व्यक्तिगत रिट्रीट (2 दिन, आमने-सामने)"] },
        { week: "Q4", weekHi: "Q4", title: "Mastery, Final Retreat & Certification", titleHi: "निपुणता, अंतिम रिट्रीट और प्रमाणन", topics: ["90-min teaching session (assessed)", "Final personal retreat (3-day)", "Complete achievement portfolio", "12-Month Master Certificate — In-Person"], topicsHi: ["90 मिनट शिक्षण सत्र (मूल्यांकन सहित)", "अंतिम व्यक्तिगत रिट्रीट (3 दिन)", "पूर्ण उपलब्धि पोर्टफोलियो", "12 महीने का मास्टर प्रमाण-पत्र — आमने-सामने"] },
      ],
      outcomes: ["Ultimate in-person classical yoga mastery", "Teaching certification (Shastriya tradition)", "Complete Jyotish Vidya & Samkhya mastery", "Full Ayurveda-yoga lifestyle integration", "12-Month Master Certificate"],
      outcomesHi: ["अंतिम आमने-सामने शास्त्रीय योग निपुणता", "शिक्षण प्रमाणन (शास्त्रीय परंपरा)", "पूर्ण ज्योतिष विद्या और सांख्य निपुणता", "पूर्ण आयुर्वेद-योग जीवनशैली एकीकरण", "12 महीने का मास्टर प्रमाण-पत्र"],
    },
  ],
};

export const YOGA_TYPES: Record<string, YogaTypeData> = {
  group: groupYoga,
  "online-personal": onlinePersonalYoga,
  personal: personalYoga,
};
