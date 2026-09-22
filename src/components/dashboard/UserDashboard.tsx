"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Activity,
  Atom,
  BookMarked,
  BookOpen,
  Briefcase,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Clock,
  Copy,
  Crosshair,
  FileText,
  Gem,
  Hash,
  Heart,
  HeartHandshake,
  HelpCircle,
  History,
  LayoutGrid,
  Lightbulb,
  Monitor,
  Orbit,
  Phone,
  Sparkles,
  Star,
  Sun,
  UploadCloud,
  Video,
  ArrowLeft,
  X,
  CreditCard,
  Lock,
  QrCode,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { processRazorpayPayment } from "@/lib/razorpay";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState, Skeleton } from "@/components/ui/Skeleton";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { SupportChatFab } from "@/components/chat/SupportChatFab";
import {
  CONSULTATION_FEE,
  DASHBOARD_SERVICES,
  QR_CODE_URL,
  UPI_ID,
} from "@/lib/constants";
import { paidChatId } from "@/lib/chat";
import { subscribeConsultationFee } from "@/lib/settings";
import { isMeetJoinUnlocked } from "@/lib/meet";
import {
  createMatchHoroscopeBooking,
  createServiceBooking,
  subscribeUserBookings,
  uploadPaymentScreenshot,
} from "@/lib/bookings";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";
import type { Booking } from "@/lib/types";

type Tab = "services" | "status";
type ServiceStep = "form" | "payment";

const serviceIcons: Record<string, LucideIcon> = {
  Sparkles,
  HeartHandshake,
  Phone,
  FileText,
  Atom,
  Monitor,
  BookMarked,
  Crosshair,
  HelpCircle,
  Sun,
  Gem,
  BookOpen,
  Calendar,
  Clock,
  CalendarDays,
  Orbit,
  CircleDot,
  Star,
  Heart,
  Briefcase,
  Lightbulb,
  Hash,
  Activity,
};

export function UserDashboard() {
  const { user, profile } = useAuthStore();
  const { t } = useT();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("services");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [consultationFee, setConsultationFee] = useState(CONSULTATION_FEE);
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceStep, setServiceStep] = useState<ServiceStep>("form");
  const [birthDetails, setBirthDetails] = useState({
    name: "",
    dob: "",
    place: "",
    time: "",
  });
  const [birthErrors, setBirthErrors] = useState<Record<string, string>>({});
  const [matchDetails, setMatchDetails] = useState({
    brideName: "", brideAge: "", brideDob: "", brideBirthPlace: "", brideBirthTime: "",
    groomName: "", groomAge: "", groomDob: "", groomBirthPlace: "", groomBirthTime: "",
  });
  const [matchErrors, setMatchErrors] = useState<Record<string, string>>({});
  const [serviceNote, setServiceNote] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [paidChatOpen, setPaidChatOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("101");
  const [paymentMode, setPaymentMode] = useState<"razorpay" | "upi">("razorpay");
  const [payingWithRazorpay, setPayingWithRazorpay] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !user) {
      return;
    }
    const unsubBookings = subscribeUserBookings(user.uid, (b) => {
      setBookings(b);
      setLoading(false);
    });
    const unsubFee = subscribeConsultationFee(setConsultationFee);
    return () => {
      unsubBookings();
      unsubFee();
    };
  }, [user]);

  function handleFile(f: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setFile(f);
  }

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      toast.success("UPI ID copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  function openService(title: string, action: "book" | "chat") {
    if (action === "chat") {
      setSupportOpen(true);
      return;
    }
    setSelectedService(title);
    setServiceStep("form");
    setBirthDetails({ name: profile?.name ?? "", dob: "", place: profile?.city ?? "", time: "" });
    setBirthErrors({});
    setMatchDetails({ brideName: "", brideAge: "", brideDob: "", brideBirthPlace: "", brideBirthTime: "", groomName: "", groomAge: "", groomDob: "", groomBirthPlace: "", groomBirthTime: "" });
    setMatchErrors({});
    setServiceNote("");
    handleFile(null);
  }

  const searchParams = useSearchParams();
  const serviceParam = searchParams ? searchParams.get("service") : null;

  useEffect(() => {
    if (!serviceParam) return;
    setTab("services");
    const norm = serviceParam.toLowerCase().replace(/[^a-z0-9]/g, "");
    const match = DASHBOARD_SERVICES.find((s) => {
      const sNorm = s.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      return sNorm === norm || sNorm.includes(norm) || norm.includes(sNorm);
    });
    if (match) {
      openService(match.title, match.action);
    } else {
      openService(serviceParam, "book");
    }
  }, [serviceParam, profile]);

  function resetServiceRequest() {
    setSelectedService(null);
    setServiceStep("form");
    setBirthErrors({});
    setMatchErrors({});
    setServiceNote("");
    setCustomAmount("101");
    setPaymentMode("razorpay");
    setPayingWithRazorpay(false);
    handleFile(null);
  }

  function continueMatchToPayment() {
    const e: Record<string, string> = {};
    if (!matchDetails.brideName.trim()) e.brideName = "Required";
    if (!matchDetails.brideAge.trim()) e.brideAge = "Required";
    if (!matchDetails.brideDob) e.brideDob = "Required";
    if (!matchDetails.brideBirthPlace.trim()) e.brideBirthPlace = "Required";
    if (!matchDetails.brideBirthTime) e.brideBirthTime = "Required";
    if (!matchDetails.groomName.trim()) e.groomName = "Required";
    if (!matchDetails.groomAge.trim()) e.groomAge = "Required";
    if (!matchDetails.groomDob) e.groomDob = "Required";
    if (!matchDetails.groomBirthPlace.trim()) e.groomBirthPlace = "Required";
    if (!matchDetails.groomBirthTime) e.groomBirthTime = "Required";
    setMatchErrors(e);
    if (Object.keys(e).length > 0) { toast.error("Please fill all fields"); return; }
    setServiceStep("payment");
  }

  async function handleRazorpayPayment() {
    if (!user || !profile || !selectedService) return;
    const amt = Number(customAmount);
    if (!amt || amt < 1) {
      toast.error("Please enter a valid contribution amount (minimum ₹1)");
      return;
    }
    setPayingWithRazorpay(true);

    processRazorpayPayment({
      amount: amt,
      serviceName: selectedService,
      userName: profile.name || user.displayName || "Client",
      userEmail: user.email || "",
      userPhone: profile.phone || "",
      onSuccess: async (rzpResult) => {
        try {
          if (selectedService === "Match Horoscope") {
            await createMatchHoroscopeBooking({
              userId: user.uid,
              userName: profile.name,
              userPhone: profile.phone,
              amount: amt,
              paymentMethod: "razorpay",
              razorpayPaymentId: rzpResult.razorpay_payment_id,
              status: "confirmed",
              ...matchDetails,
              note: serviceNote.trim() || undefined,
            });
          } else {
            await createServiceBooking({
              userId: user.uid,
              userName: profile.name,
              userPhone: profile.phone,
              amount: amt,
              paymentMethod: "razorpay",
              razorpayPaymentId: rzpResult.razorpay_payment_id,
              status: "confirmed",
              serviceName: selectedService,
              birthName: birthDetails.name.trim(),
              dob: birthDetails.dob,
              birthPlace: birthDetails.place.trim(),
              birthTime: birthDetails.time,
              note: serviceNote.trim() || undefined,
            });
          }
          toast.success("Payment verified! Consultation request confirmed 🙏");
          resetServiceRequest();
          setTab("status");
        } catch (err: unknown) {
          console.error("Booking creation after payment failed:", err);
          // Fallback in case Firestore rules haven't updated or only allow 'pending'
          try {
            if (selectedService === "Match Horoscope") {
              await createMatchHoroscopeBooking({
                userId: user.uid,
                userName: profile.name,
                userPhone: profile.phone,
                amount: amt,
                paymentMethod: "razorpay",
                razorpayPaymentId: rzpResult.razorpay_payment_id,
                status: "pending",
                ...matchDetails,
                note: (serviceNote.trim() ? serviceNote.trim() + " | " : "") + `Razorpay Paid: ${rzpResult.razorpay_payment_id}`,
              });
            } else {
              await createServiceBooking({
                userId: user.uid,
                userName: profile.name,
                userPhone: profile.phone,
                amount: amt,
                paymentMethod: "razorpay",
                razorpayPaymentId: rzpResult.razorpay_payment_id,
                status: "pending",
                serviceName: selectedService,
                birthName: birthDetails.name.trim(),
                dob: birthDetails.dob,
                birthPlace: birthDetails.place.trim(),
                birthTime: birthDetails.time,
                note: (serviceNote.trim() ? serviceNote.trim() + " | " : "") + `Razorpay Paid: ${rzpResult.razorpay_payment_id}`,
              });
            }
            toast.success("Payment verified! Request registered 🙏");
            resetServiceRequest();
            setTab("status");
          } catch (retryErr: unknown) {
            console.error("Retry booking creation failed:", retryErr);
            toast.error("Payment received! Please note Payment ID: " + rzpResult.razorpay_payment_id);
          }
        } finally {
          setPayingWithRazorpay(false);
        }
      },
      onError: (errorMsg) => {
        setPayingWithRazorpay(false);
        toast.error(errorMsg);
      },
    });
  }

  async function submitMatchHoroscope() {
    if (!user || !profile || !file) { toast.error(t.dashboard.uploadScreenshot); return; }
    const amt = Number(customAmount) || consultationFee;
    setSubmitting(true);
    try {
      const screenshotUrl = await uploadPaymentScreenshot(user.uid, file);
      await createMatchHoroscopeBooking({
        userId: user.uid, userName: profile.name, userPhone: profile.phone,
        amount: amt, screenshotUrl,
        paymentMethod: "upi_manual",
        ...matchDetails,
        note: serviceNote.trim() || undefined,
      });
      toast.success(t.dashboard.requestSubmitted);
      resetServiceRequest();
      setTab("status");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not submit";
      toast.error(msg.slice(0, 120));
    } finally {
      setSubmitting(false);
    }
  }

  function continueToPayment() {
    const next: Record<string, string> = {};
    if (!birthDetails.name.trim()) next.name = "Name required";
    if (!birthDetails.dob) next.dob = "Date of birth required";
    if (!birthDetails.place.trim()) next.place = "Place of birth required";
    if (!birthDetails.time) next.time = "Time of birth required";
    setBirthErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(t.dashboard.fillBirthDetails);
      return;
    }
    setServiceStep("payment");
  }

  async function submitServiceRequest() {
    if (!user || !profile || !selectedService || !file) {
      toast.error(t.dashboard.uploadScreenshot);
      return;
    }
    const amt = Number(customAmount) || consultationFee;
    setSubmitting(true);
    try {
      const screenshotUrl = await uploadPaymentScreenshot(user.uid, file);
      await createServiceBooking({
        userId: user.uid,
        userName: profile.name,
        userPhone: profile.phone,
        amount: amt,
        screenshotUrl,
        paymentMethod: "upi_manual",
        serviceName: selectedService,
        birthName: birthDetails.name.trim(),
        dob: birthDetails.dob,
        birthPlace: birthDetails.place.trim(),
        birthTime: birthDetails.time,
        note: serviceNote.trim() || undefined,
      });
      toast.success(t.dashboard.requestSubmitted);
      resetServiceRequest();
      setTab("status");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Could not submit request";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        toast.error(t.dashboard.uploadBlocked);
      } else if (msg.toLowerCase().includes("storage")) {
        toast.error(t.dashboard.storageFailed);
      } else {
        toast.error(msg.slice(0, 120) || "Could not submit request");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: "services", label: t.dashboard.tabServices, icon: LayoutGrid },
    { id: "status", label: t.dashboard.tabBookings, icon: History },
  ];

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <EmptyState
          title={t.dashboard.firebaseMissing}
          description={t.dashboard.firebaseMissingHint}
        />
      </div>
    );
  }

  const fade = {
    initial: { opacity: 0, y: reduce ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduce ? 0 : -8 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-7 flex justify-center">
        <div className="inline-flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/55 p-2 shadow-[var(--shadow-sm)] backdrop-blur-md">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === id
                  ? "bg-[var(--primary)] text-[var(--ink)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--body)] hover:bg-[var(--primary-soft)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {tab === "services" && (
          <motion.div key="services" {...fade} className="w-full">
            {!selectedService ? (
              <>
                <div className="mb-5">
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
                    {t.dashboard.astrologyServices}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--faint)]">
                    {t.dashboard.servicesHint}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DASHBOARD_SERVICES.map((service, i) => {
                    const trans = t.dashboardServices[service.title as keyof typeof t.dashboardServices];
                    const displayTitle = trans?.title ?? service.title;
                    const displayDesc = trans?.description ?? service.description;
                    return (
                      <motion.button
                        key={service.title}
                        type="button"
                        initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(i * 0.02, 0.35),
                          duration: 0.3,
                        }}
                        whileHover={reduce ? undefined : { y: -3 }}
                        onClick={() => openService(service.title, service.action)}
                        className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left shadow-[var(--shadow-sm)] transition-all duration-300 hover:border-[var(--gold)]/50 hover:shadow-[var(--shadow-md)]"
                      >
                        {/* Service image */}
                        <span className="relative block h-36 w-full overflow-hidden bg-[var(--surface-2)]">
                          <Image
                            src={"image" in service ? service.image : ""}
                            alt={displayTitle}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        </span>
                        {/* Text */}
                        <span className="flex flex-col gap-1 px-4 py-3.5">
                          <span className="text-sm font-semibold text-[var(--ink)]">
                            {displayTitle}
                          </span>
                          <span className="text-xs leading-relaxed text-[var(--faint)]">
                            {displayDesc}
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

              </>
            ) : (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() =>
                    serviceStep === "payment"
                      ? setServiceStep("form")
                      : resetServiceRequest()
                  }
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {serviceStep === "payment" ? t.dashboard.backToDetails : t.dashboard.allServices}
                </button>

                <div>
                  <p className="eyebrow mb-1">{t.dashboard.serviceRequest}</p>
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
                    {t.dashboardServices[selectedService as keyof typeof t.dashboardServices]?.title ?? selectedService}
                  </h2>
                </div>

                {/* ── Match Horoscope: Bride + Groom form ── */}
                {selectedService === "Match Horoscope" && serviceStep === "form" && (
                  <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">1</span>
                      {t.dashboard.brideGroomDetails}
                    </h3>

                    {/* Bride */}
                    <p className="eyebrow mb-3">{t.dashboard.bride}</p>
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Input label={t.dashboard.name} value={matchDetails.brideName} error={matchErrors.brideName}
                        onChange={(e) => setMatchDetails({ ...matchDetails, brideName: e.target.value })} />
                      <Input label="Age" type="number" value={matchDetails.brideAge} error={matchErrors.brideAge}
                        onChange={(e) => setMatchDetails({ ...matchDetails, brideAge: e.target.value })} />
                      <Input label={t.dashboard.dob} type="date" value={matchDetails.brideDob} error={matchErrors.brideDob}
                        onChange={(e) => setMatchDetails({ ...matchDetails, brideDob: e.target.value })} />
                      <Input label={t.dashboard.place} value={matchDetails.brideBirthPlace} error={matchErrors.brideBirthPlace}
                        onChange={(e) => setMatchDetails({ ...matchDetails, brideBirthPlace: e.target.value })} />
                      <Input label={t.dashboard.time} type="time" value={matchDetails.brideBirthTime} error={matchErrors.brideBirthTime}
                        onChange={(e) => setMatchDetails({ ...matchDetails, brideBirthTime: e.target.value })} />
                    </div>

                    {/* Groom */}
                    <p className="eyebrow mb-3">{t.dashboard.groom}</p>
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Input label={t.dashboard.name} value={matchDetails.groomName} error={matchErrors.groomName}
                        onChange={(e) => setMatchDetails({ ...matchDetails, groomName: e.target.value })} />
                      <Input label="Age" type="number" value={matchDetails.groomAge} error={matchErrors.groomAge}
                        onChange={(e) => setMatchDetails({ ...matchDetails, groomAge: e.target.value })} />
                      <Input label={t.dashboard.dob} type="date" value={matchDetails.groomDob} error={matchErrors.groomDob}
                        onChange={(e) => setMatchDetails({ ...matchDetails, groomDob: e.target.value })} />
                      <Input label={t.dashboard.place} value={matchDetails.groomBirthPlace} error={matchErrors.groomBirthPlace}
                        onChange={(e) => setMatchDetails({ ...matchDetails, groomBirthPlace: e.target.value })} />
                      <Input label={t.dashboard.time} type="time" value={matchDetails.groomBirthTime} error={matchErrors.groomBirthTime}
                        onChange={(e) => setMatchDetails({ ...matchDetails, groomBirthTime: e.target.value })} />
                    </div>

                    {/* Note / Specific Questions */}
                    <div className="mb-6">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                        Special Note / Questions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={serviceNote}
                        onChange={(e) => setServiceNote(e.target.value)}
                        placeholder="Any specific questions or details for the astrologer..."
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                      />
                    </div>

                    <Button onClick={continueMatchToPayment} className="w-full sm:w-auto">
                      {t.dashboard.continuePayment}
                    </Button>
                  </section>
                )}

                {/* ── Other services: single birth details form ── */}
                {selectedService !== "Match Horoscope" && serviceStep === "form" && (
                  <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">1</span>
                      {t.dashboard.birthDetails}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input label={t.dashboard.name} value={birthDetails.name} error={birthErrors.name}
                        onChange={(e) => setBirthDetails({ ...birthDetails, name: e.target.value })} />
                      <Input label={t.dashboard.dob} type="date" value={birthDetails.dob} error={birthErrors.dob}
                        onChange={(e) => setBirthDetails({ ...birthDetails, dob: e.target.value })} />
                      <Input label={t.dashboard.place} value={birthDetails.place} error={birthErrors.place}
                        onChange={(e) => setBirthDetails({ ...birthDetails, place: e.target.value })} />
                      <Input label={t.dashboard.time} type="time" value={birthDetails.time} error={birthErrors.time}
                        onChange={(e) => setBirthDetails({ ...birthDetails, time: e.target.value })} />
                    </div>

                    {/* Note / Specific Questions */}
                    <div className="mb-6">
                      <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                        Special Note / Questions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={serviceNote}
                        onChange={(e) => setServiceNote(e.target.value)}
                        placeholder="Any specific questions or details for the astrologer..."
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                      />
                    </div>

                    <Button onClick={continueToPayment} className="w-full sm:w-auto">
                      {t.dashboard.continuePayment}
                    </Button>
                  </section>
                )}

                {/* ── Payment step (shared) ── */}
                {serviceStep === "payment" && (
                  <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">2</span>
                        {t.dashboard.payment}
                      </h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--brass-hairline)] bg-[var(--brass-soft)] text-[var(--brass)] font-medium">
                        श्रद्धा अनुसार दक्षिणा · Your Choice
                      </span>
                    </div>
                    <p className="mb-4 text-xs sm:text-sm text-[var(--faint)]">
                      परामर्श के लिए कोई निश्चित शुल्क नहीं है — आप अपनी इच्छा व सामर्थ्य अनुसार दक्षिणा चुन सकते हैं।
                    </p>

                    {/* Summary */}
                    <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 text-sm text-[var(--body)]">
                      {selectedService === "Match Horoscope" ? (
                        <>
                          <p><span className="text-[var(--faint)]">Bride:</span> {matchDetails.brideName}, Age {matchDetails.brideAge}, DOB {matchDetails.brideDob} · {matchDetails.brideBirthTime}</p>
                          <p className="mt-1"><span className="text-[var(--faint)]">Place:</span> {matchDetails.brideBirthPlace}</p>
                          <p className="mt-2"><span className="text-[var(--faint)]">Groom:</span> {matchDetails.groomName}, Age {matchDetails.groomAge}, DOB {matchDetails.groomDob} · {matchDetails.groomBirthTime}</p>
                          <p className="mt-1"><span className="text-[var(--faint)]">Place:</span> {matchDetails.groomBirthPlace}</p>
                        </>
                      ) : (
                        <>
                          <p><span className="text-[var(--faint)]">Name:</span> {birthDetails.name}</p>
                          <p className="mt-1"><span className="text-[var(--faint)]">DOB:</span> {birthDetails.dob} · {birthDetails.time}</p>
                          <p className="mt-1"><span className="text-[var(--faint)]">Place:</span> {birthDetails.place}</p>
                        </>
                      )}
                      {serviceNote.trim() && (
                        <p className="mt-2.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--body)]">
                          <span className="font-semibold text-[var(--gold-ink)]">Note:</span> {serviceNote}
                        </p>
                      )}
                    </div>

                    {/* ── Voluntary Contribution (User's choice of amount) ── */}
                    <div className="mb-6 rounded-xl border border-[var(--brass-hairline)] bg-[var(--bg-alt)] p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="eyebrow text-[10px] text-[var(--brass)]">सहयोग / दक्षिणा राशि चुनें</p>
                          <h4 className="heading text-base text-[var(--ink)]">Select Your Contribution Amount</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-[var(--cream-muted)]">चयनित राशि:</span>
                          <span className="heading text-xl text-[var(--brass)]">₹{Number(customAmount) || 101}</span>
                        </div>
                      </div>

                      {/* Quick presets */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
                        {[51, 101, 251, 501, 1100, 2100].map((amt) => {
                          const isSel = customAmount === String(amt);
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setCustomAmount(String(amt))}
                              className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                                isSel
                                  ? "border-[var(--brass)] bg-[var(--brass)] text-[var(--forest-deep)] shadow-md scale-[1.03]"
                                  : "border-[var(--brass-hairline)] bg-[var(--surface)] text-[var(--cream)] hover:border-[var(--brass)] hover:bg-[var(--brass-soft)]"
                              }`}
                            >
                              ₹{amt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom input */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-[var(--brass-hairline)]/40">
                        <label className="text-xs text-[var(--cream-muted)] shrink-0">
                          अपनी इच्छा अनुसार कोई भी राशि दर्ज करें (Custom Amount):
                        </label>
                        <div className="relative flex-1 max-w-xs">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--brass)]">₹</span>
                          <input
                            type="number"
                            min="1"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter any amount"
                            className="w-full pl-7 pr-3 py-1.5 rounded-lg text-sm border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Payment Method Toggle ── */}
                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMode("razorpay")}
                        className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start justify-between gap-3 ${
                          paymentMode === "razorpay"
                            ? "border-[var(--brass)] bg-[var(--brass-soft)] shadow-md"
                            : "border-[var(--border)] bg-[var(--bg-alt)] hover:border-[var(--brass-dim)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--forest-mid)] border border-[var(--brass-hairline)] shrink-0">
                            <Zap className="h-4 w-4 text-[#25D366]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-[var(--ink)]">Razorpay Online</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#25D366]/20 text-[#25D366] font-bold">REALTIME</span>
                            </div>
                            <p className="text-xs text-[var(--cream-muted)] mt-1">
                              UPI (GPay, PhonePe, Paytm), Cards, NetBanking
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          paymentMode === "razorpay" ? "border-[var(--brass)] bg-[var(--brass)]" : "border-[var(--cream-faint)]"
                        }`}>
                          {paymentMode === "razorpay" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--forest-deep)]" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMode("upi")}
                        className={`p-4 rounded-xl border transition-all duration-200 text-left flex items-start justify-between gap-3 ${
                          paymentMode === "upi"
                            ? "border-[var(--brass)] bg-[var(--brass-soft)] shadow-md"
                            : "border-[var(--border)] bg-[var(--bg-alt)] hover:border-[var(--brass-dim)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--forest-mid)] border border-[var(--brass-hairline)] shrink-0">
                            <QrCode className="h-4 w-4 text-[var(--brass)]" />
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-[var(--ink)]">Direct UPI QR Code</span>
                            <p className="text-xs text-[var(--cream-muted)] mt-1">
                              Scan QR & upload payment screenshot
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center shrink-0 ${
                          paymentMode === "upi" ? "border-[var(--brass)] bg-[var(--brass)]" : "border-[var(--cream-faint)]"
                        }`}>
                          {paymentMode === "upi" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--forest-deep)]" />}
                        </div>
                      </button>
                    </div>

                    {/* ── Mode 1: Razorpay Realtime ── */}
                    {paymentMode === "razorpay" && (
                      <div className="rounded-xl border border-[var(--brass-hairline)] bg-[var(--bg-alt)] p-6 sm:p-8 text-center max-w-lg mx-auto">
                        <p className="eyebrow text-xs mb-1">Total Contribution</p>
                        <p className="font-display text-4xl sm:text-5xl font-bold text-[var(--brass)] mb-2">
                          ₹{Number(customAmount) || 101}
                        </p>
                        <p className="text-xs sm:text-sm text-[var(--cream-muted)] mb-6 max-w-sm mx-auto">
                          Instant confirmation via Razorpay. Supports UPI, Google Pay, PhonePe, Paytm, Debit/Credit Card & NetBanking.
                        </p>
                        <Button
                          onClick={handleRazorpayPayment}
                          loading={payingWithRazorpay}
                          className="w-full py-4 rounded-xl text-base font-semibold shadow-lg transition-transform hover:scale-[1.02]"
                          style={{
                            background: "linear-gradient(135deg, #c9a227 0%, #b88e1a 100%)",
                            color: "#0a1711",
                            boxShadow: "0 6px 20px rgba(201, 162, 39, 0.3)",
                          }}
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Pay ₹{Number(customAmount) || 101} & Book Now
                        </Button>
                        <p className="mt-4 text-[11px] text-[var(--cream-faint)] flex items-center justify-center gap-1.5">
                          <Lock className="h-3 w-3" /> 256-bit Encrypted Secure Payment
                        </p>
                      </div>
                    )}

                    {/* ── Mode 2: Direct UPI QR Code ── */}
                    {paymentMode === "upi" && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-5">
                          <div className="relative h-44 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-sm)]">
                            <Image src={QR_CODE_URL} alt="UPI QR Code" fill className="object-contain" unoptimized />
                          </div>
                          <button type="button" onClick={copyUpi}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--primary)]">
                            <span className="text-[var(--gold-ink)]">{UPI_ID}</span>
                            {copied ? <Check className="h-3.5 w-3.5 text-[var(--sage)]" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <p className="mt-3 font-display text-2xl font-semibold text-[var(--ink)]">₹{Number(customAmount) || 101}</p>
                          <p className="text-[11px] text-[var(--cream-faint)] mt-1">Scan to pay chosen amount</p>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                          <label htmlFor="service-screenshot"
                            className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-alt)] px-4 py-6 text-center transition-colors hover:border-[var(--primary)]">
                            {previewUrl ? (
                              <span className="relative h-28 w-28 overflow-hidden rounded-lg border border-[var(--border)]">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
                                <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sage)] text-white">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </span>
                              </span>
                            ) : (
                              <UploadCloud className="h-8 w-8 text-[var(--faint)] transition-colors group-hover:text-[var(--primary)]" />
                            )}
                            <span className="mt-3 text-sm font-medium text-[var(--ink)]">{t.dashboard.uploadScreenshot}</span>
                            <span className="mt-1 text-xs text-[var(--faint)]">PNG or JPG, up to 10 MB</span>
                            <input id="service-screenshot" type="file" accept="image/*" className="hidden"
                              onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
                          </label>
                          <Button
                            onClick={selectedService === "Match Horoscope" ? submitMatchHoroscope : submitServiceRequest}
                            loading={submitting} disabled={!file} className="w-full">
                            {t.dashboard.submitRequest}
                          </Button>
                          <p className="text-center text-xs text-[var(--faint)]">{t.dashboard.paymentNote}</p>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </motion.div>
        )}

        {tab === "status" && (
          <motion.div key="status" {...fade} className="w-full space-y-3">
            {bookings.length === 0 ? (
              <EmptyState
                icon={<History className="h-6 w-6" />}
                title={t.dashboard.noBookings}
                description={t.dashboard.noBookingsHint}
                action={
                  <Button onClick={() => setTab("services")}>{t.dashboard.bookASession}</Button>
                }
              />
            ) : (
              bookings.map((b) => {
                const meetReady =
                  b.status === "confirmed" &&
                  Boolean(b.meetLink) &&
                  (Boolean(b.serviceName) ||
                    isMeetJoinUnlocked(b.date, b.timeSlot, new Date(now)));
                const statusLabel =
                  b.status === "pending"
                    ? t.status.pending
                    : b.status === "confirmed"
                      ? t.status.confirmed
                      : t.status.rejected;
                const serviceLabel = b.serviceName
                  ? t.dashboardServices[b.serviceName]?.title ?? b.serviceName
                  : null;

                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {serviceLabel && (
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--gold-ink)]">
                            {serviceLabel}
                          </p>
                        )}
                        <p className="font-medium text-[var(--ink)]">
                          {b.brideName
                            ? `${b.brideName} & ${b.groomName}`
                            : b.serviceName
                              ? `${b.birthName ?? b.userName} · ${t.dashboard.dob} ${b.dob ?? b.date}`
                              : `${format(parseISO(b.date), "EEEE, MMM d, yyyy")} · ${b.timeSlot}`}
                        </p>
                        <p className="mt-1 text-sm text-[var(--faint)]">
                          {b.brideName
                            ? `Bride DOB: ${b.brideDob ?? b.date} · Groom DOB: ${b.groomDob ?? "—"} · ₹${b.amount}`
                            : b.serviceName
                              ? `${b.birthPlace ?? ""} · ${b.birthTime ?? b.timeSlot} · ₹${b.amount}`
                              : `₹${b.amount}`}
                        </p>
                        {b.note && (
                          <p className="mt-2 text-xs text-[var(--body)] bg-[var(--bg-alt)] p-2.5 rounded-lg border border-[var(--border)] italic">
                            <span className="font-semibold text-[var(--gold-ink)] not-italic">Note:</span> "{b.note}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status={b.status}>{statusLabel}</Badge>
                        {b.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setPaidChatOpen(true)}
                          >
                            {t.dashboard.chat}
                          </Button>
                        )}
                      </div>
                    </div>

                    {b.status === "confirmed" && (b.slotId || b.meetLink) && (
                      <div className="rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)] px-4 py-3.5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink)]">
                            <Video className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[var(--ink)]">
                              Google Meet
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--body)]">
                              {t.dashboard.meetLocked}
                            </p>
                            {meetReady && b.meetLink && (
                              <a
                                href={b.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex"
                              >
                                <Button size="sm">
                                  <Video className="h-4 w-4" />
                                  {t.dashboard.meetLink}
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <SupportChatFab open={supportOpen} onOpenChange={setSupportOpen} />

      <AnimatePresence>
        {paidChatOpen && user && profile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--ink)]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setPaidChatOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="relative w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPaidChatOpen(false)}
                className="absolute -top-2 right-2 z-10 rounded-full bg-[var(--surface)] p-2 shadow-[var(--shadow-sm)] sm:-right-2"
                aria-label="Close paid chat"
              >
                <X className="h-4 w-4" />
              </button>
              <ChatWindow
                bookingId={paidChatId(user.uid)}
                currentUserId={user.uid}
                currentRole="user"
                currentName={profile.name}
                peerUserId={user.uid}
                peerUserName={profile.name}
                chatType="paid"
                title={t.chat.paidTitle}
                subtitle={t.chat.helpSubtitle}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
