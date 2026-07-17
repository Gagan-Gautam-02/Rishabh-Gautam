"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  UserRound,
  Video,
  ArrowLeft,
  X,
  type LucideIcon,
} from "lucide-react";
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
  createBooking,
  createServiceBooking,
  subscribeSlots,
  subscribeUserBookings,
  uploadPaymentScreenshot,
} from "@/lib/bookings";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import type { Booking, Slot } from "@/lib/types";

type Tab = "services" | "book" | "status";
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
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<Tab>("services");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
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
  const [supportOpen, setSupportOpen] = useState(false);
  const [paidChatOpen, setPaidChatOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured() || !user) {
      return;
    }
    const unsubSlots = subscribeSlots((s) => {
      setSlots(s);
      setLoading(false);
    });
    const unsubBookings = subscribeUserBookings(user.uid, setBookings);
    const unsubFee = subscribeConsultationFee(setConsultationFee);
    return () => {
      unsubSlots();
      unsubBookings();
      unsubFee();
    };
  }, [user]);

  function handleFile(f: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setFile(f);
  }

  const availableDates = useMemo(() => {
    const dates = new Set(slots.filter((s) => !s.isBooked).map((s) => s.date));
    return Array.from(dates).sort();
  }, [slots]);

  const timesForDate = useMemo(
    () =>
      slots
        .filter((s) => s.date === selectedDate && !s.isBooked)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [slots, selectedDate]
  );

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

  async function submitBooking() {
    if (!user || !profile || !selectedSlot || !file) {
      toast.error("Select slot and upload screenshot");
      return;
    }
    setSubmitting(true);
    try {
      const screenshotUrl = await uploadPaymentScreenshot(user.uid, file);
      await createBooking({
        userId: user.uid,
        userName: profile.name,
        userPhone: profile.phone,
        date: selectedSlot.date,
        timeSlot: selectedSlot.time,
        slotId: selectedSlot.id,
        amount: consultationFee,
        screenshotUrl,
      });
      toast.success("Booking submitted");
      setSelectedSlot(null);
      setSelectedDate("");
      handleFile(null);
      setTab("status");
      setPaidChatOpen(true);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Could not submit booking";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        toast.error(
          "Upload blocked. Publish storage.rules in Firebase Console → Storage → Rules, then retry."
        );
      } else if (msg.toLowerCase().includes("storage")) {
        toast.error("Storage upload failed. Check Storage is enabled.");
      } else {
        toast.error(msg.slice(0, 120) || "Could not submit booking");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openService(title: string, action: "book" | "chat") {
    if (action === "chat") {
      setSupportOpen(true);
      return;
    }
    setSelectedService(title);
    setServiceStep("form");
    setBirthDetails({
      name: profile?.name ?? "",
      dob: "",
      place: profile?.city ?? "",
      time: "",
    });
    setBirthErrors({});
    handleFile(null);
  }

  function resetServiceRequest() {
    setSelectedService(null);
    setServiceStep("form");
    setBirthErrors({});
    handleFile(null);
  }

  function continueToPayment() {
    const next: Record<string, string> = {};
    if (!birthDetails.name.trim()) next.name = "Name required";
    if (!birthDetails.dob) next.dob = "Date of birth required";
    if (!birthDetails.place.trim()) next.place = "Place of birth required";
    if (!birthDetails.time) next.time = "Time of birth required";
    setBirthErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Fill all birth details");
      return;
    }
    setServiceStep("payment");
  }

  async function submitServiceRequest() {
    if (!user || !profile || !selectedService || !file) {
      toast.error("Upload payment screenshot");
      return;
    }
    setSubmitting(true);
    try {
      const screenshotUrl = await uploadPaymentScreenshot(user.uid, file);
      await createServiceBooking({
        userId: user.uid,
        userName: profile.name,
        userPhone: profile.phone,
        amount: consultationFee,
        screenshotUrl,
        serviceName: selectedService,
        birthName: birthDetails.name.trim(),
        dob: birthDetails.dob,
        birthPlace: birthDetails.place.trim(),
        birthTime: birthDetails.time,
      });
      toast.success("Request submitted — sent to admin");
      resetServiceRequest();
      setTab("status");
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Could not submit request";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        toast.error(
          "Upload blocked. Publish storage.rules in Firebase Console → Storage → Rules, then retry."
        );
      } else if (msg.toLowerCase().includes("storage")) {
        toast.error("Storage upload failed. Check Storage is enabled.");
      } else {
        toast.error(msg.slice(0, 120) || "Could not submit request");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: typeof Calendar }[] = [
    { id: "services", label: "Services", icon: LayoutGrid },
    { id: "book", label: "Book Slot", icon: Calendar },
    { id: "status", label: "My Bookings", icon: History },
  ];

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <EmptyState
          title="Firebase not configured"
          description="Copy .env.local.example to .env.local and add your Firebase project keys."
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
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Your dashboard</p>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ink)]">
            Hello, {profile?.name?.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-1 text-sm text-[var(--faint)]">
            Book a consultation and track your session status
          </p>
        </div>
        <Link href="/profile">
          <Button size="sm" variant="secondary">
            <UserRound className="h-4 w-4" />
            My Profile
          </Button>
        </Link>
      </div>

      <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-[var(--primary)] text-[var(--ink)] shadow-[var(--shadow-sm)]"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--body)] hover:border-[var(--primary)]/40"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {tab === "services" && (
          <motion.div key="services" {...fade} className="w-full">
            {!selectedService ? (
              <>
                <div className="mb-5">
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
                    Astrology services
                  </h2>
                  <p className="mt-1 text-sm text-[var(--faint)]">
                    Choose a service, enter birth details, then complete payment
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {DASHBOARD_SERVICES.map((service, i) => {
                    const Icon = serviceIcons[service.icon] ?? Sparkles;
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
                        className="flex min-h-[168px] flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-center shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--gold)]/50 hover:shadow-[var(--shadow-md)]"
                      >
                        <p className="text-sm font-semibold text-[var(--ink)]">
                          {service.title}
                        </p>
                        <span className="my-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold-soft)] text-[var(--gold-ink)]">
                          <Icon className="h-6 w-6" strokeWidth={1.6} />
                        </span>
                        <p className="text-xs leading-relaxed text-[var(--faint)]">
                          {service.description}
                        </p>
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
                  {serviceStep === "payment" ? "Back to details" : "All services"}
                </button>

                <div>
                  <p className="eyebrow mb-1">Service request</p>
                  <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
                    {selectedService}
                  </h2>
                </div>

                {serviceStep === "form" && (
                  <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">
                        1
                      </span>
                      Birth details
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Name"
                        value={birthDetails.name}
                        error={birthErrors.name}
                        onChange={(e) =>
                          setBirthDetails({ ...birthDetails, name: e.target.value })
                        }
                      />
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={birthDetails.dob}
                        error={birthErrors.dob}
                        onChange={(e) =>
                          setBirthDetails({ ...birthDetails, dob: e.target.value })
                        }
                      />
                      <Input
                        label="Place of Birth"
                        value={birthDetails.place}
                        error={birthErrors.place}
                        onChange={(e) =>
                          setBirthDetails({
                            ...birthDetails,
                            place: e.target.value,
                          })
                        }
                      />
                      <Input
                        label="Time of Birth"
                        type="time"
                        value={birthDetails.time}
                        error={birthErrors.time}
                        onChange={(e) =>
                          setBirthDetails({
                            ...birthDetails,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={continueToPayment} className="mt-6 w-full sm:w-auto">
                      Continue to Payment
                    </Button>
                  </section>
                )}

                {serviceStep === "payment" && (
                  <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                    <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">
                        2
                      </span>
                      Payment
                    </h3>
                    <p className="mb-4 text-sm text-[var(--faint)]">
                      Pay ₹{consultationFee} via UPI, then upload the screenshot
                    </p>
                    <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3 text-sm text-[var(--body)]">
                      <p>
                        <span className="text-[var(--faint)]">Name:</span>{" "}
                        {birthDetails.name}
                      </p>
                      <p className="mt-1">
                        <span className="text-[var(--faint)]">DOB:</span>{" "}
                        {birthDetails.dob} · {birthDetails.time}
                      </p>
                      <p className="mt-1">
                        <span className="text-[var(--faint)]">Place:</span>{" "}
                        {birthDetails.place}
                      </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-5">
                        <div className="relative h-44 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-sm)]">
                          <Image
                            src={QR_CODE_URL}
                            alt="UPI QR Code"
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <button
                          type="button"
                          onClick={copyUpi}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--primary)]"
                        >
                          <span className="text-[var(--gold-ink)]">{UPI_ID}</span>
                          {copied ? (
                            <Check className="h-3.5 w-3.5 text-[var(--sage)]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <p className="mt-3 font-display text-2xl font-semibold text-[var(--ink)]">
                          ₹{consultationFee}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center gap-4">
                        <label
                          htmlFor="service-screenshot"
                          className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-alt)] px-4 py-6 text-center transition-colors hover:border-[var(--primary)]"
                        >
                          {previewUrl ? (
                            <span className="relative h-28 w-28 overflow-hidden rounded-lg border border-[var(--border)]">
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                              <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sage)] text-white">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </span>
                            </span>
                          ) : (
                            <UploadCloud className="h-8 w-8 text-[var(--faint)] transition-colors group-hover:text-[var(--primary)]" />
                          )}
                          <span className="mt-3 text-sm font-medium text-[var(--ink)]">
                            {file ? "Change screenshot" : "Upload payment screenshot"}
                          </span>
                          <span className="mt-1 text-xs text-[var(--faint)]">
                            PNG or JPG, up to 10 MB
                          </span>
                          <input
                            id="service-screenshot"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFile(e.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                        <Button
                          onClick={submitServiceRequest}
                          loading={submitting}
                          disabled={!file}
                          className="w-full"
                        >
                          Submit Request
                        </Button>
                        <p className="text-center text-xs text-[var(--faint)]">
                          Details go to the admin portal after payment verification.
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </motion.div>
        )}

        {tab === "book" && (
          <motion.div key="book" {...fade} className="w-full space-y-6">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">
                  1
                </span>
                Choose a date
              </h2>
              {loading ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : availableDates.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="h-6 w-6" />}
                  title="No slots available yet"
                  description="Check back soon — the astrologer will open new times."
                />
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {availableDates.map((date) => {
                    const active = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedSlot(null);
                        }}
                        className={`rounded-xl border px-3 py-3 text-sm transition-all ${
                          active
                            ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--ink)] shadow-[var(--shadow-sm)]"
                            : "border-[var(--border)] bg-[var(--bg-alt)] text-[var(--body)] hover:border-[var(--gold)]/60"
                        }`}
                      >
                        {format(parseISO(date), "MMM d")}
                        <span
                          className={`mt-0.5 block text-[10px] ${
                            active ? "text-[var(--ink)]/70" : "text-[var(--faint)]"
                          }`}
                        >
                          {format(parseISO(date), "EEE")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <AnimatePresence>
              {selectedDate && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
                >
                  <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">
                      2
                    </span>
                    Select a time
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {timesForDate.map((slot) => {
                      const active = selectedSlot?.id === slot.id;
                      return (
                        <motion.button
                          key={slot.id}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedSlot(slot)}
                          className={`min-h-[40px] rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                            active
                              ? "bg-[var(--primary)] text-[var(--ink)] shadow-[var(--shadow-sm)]"
                              : "border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--body)] hover:border-[var(--primary)]/40"
                          }`}
                        >
                          {slot.time}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selectedSlot && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6"
                >
                  <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-xs text-[var(--ink)]">
                      3
                    </span>
                    Payment
                  </h2>
                  <p className="mb-5 text-sm text-[var(--faint)]">
                    Pay ₹{consultationFee} via UPI, then upload the screenshot
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-5">
                      <div className="relative h-44 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-sm)]">
                        <Image
                          src={QR_CODE_URL}
                          alt="UPI QR Code"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <button
                        onClick={copyUpi}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] transition-colors hover:border-[var(--primary)]"
                      >
                        <span className="text-[var(--gold-ink)]">{UPI_ID}</span>
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-[var(--sage)]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <p className="mt-3 font-display text-2xl font-semibold text-[var(--ink)]">
                        ₹{consultationFee}
                      </p>
                      <p className="mt-1 text-xs text-[var(--faint)]">
                        {format(parseISO(selectedSlot.date), "MMM d, yyyy")} ·{" "}
                        {selectedSlot.time}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-4">
                      <label
                        htmlFor="screenshot"
                        className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-alt)] px-4 py-6 text-center transition-colors hover:border-[var(--primary)]"
                      >
                        {previewUrl ? (
                          <span className="relative h-28 w-28 overflow-hidden rounded-lg border border-[var(--border)]">
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sage)] text-white">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                          </span>
                        ) : (
                          <UploadCloud className="h-8 w-8 text-[var(--faint)] transition-colors group-hover:text-[var(--primary)]" />
                        )}
                        <span className="mt-3 text-sm font-medium text-[var(--ink)]">
                          {file ? "Change screenshot" : "Upload payment screenshot"}
                        </span>
                        <span className="mt-1 text-xs text-[var(--faint)]">
                          PNG or JPG, up to 10 MB
                        </span>
                        <input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>

                      <Button
                        onClick={submitBooking}
                        loading={submitting}
                        disabled={!file}
                        className="w-full"
                      >
                        Submit Booking
                      </Button>
                      <p className="text-center text-xs text-[var(--faint)]">
                        Your booking will be confirmed within a few hours of
                        payment verification.
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === "status" && (
          <motion.div key="status" {...fade} className="w-full space-y-3">
            {bookings.length === 0 ? (
              <EmptyState
                icon={<History className="h-6 w-6" />}
                title="No bookings yet"
                description="Book a slot to see your consultation status here."
                action={
                  <Button onClick={() => setTab("book")}>Book a Session</Button>
                }
              />
            ) : (
              bookings.map((b) => {
                const meetReady =
                  b.status === "confirmed" &&
                  Boolean(b.meetLink) &&
                  (Boolean(b.serviceName) ||
                    isMeetJoinUnlocked(b.date, b.timeSlot, new Date(now)));

                return (
                  <div
                    key={b.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {b.serviceName && (
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--gold-ink)]">
                            {b.serviceName}
                          </p>
                        )}
                        <p className="font-medium text-[var(--ink)]">
                          {b.serviceName
                            ? `${b.birthName ?? b.userName} · DOB ${b.dob ?? b.date}`
                            : `${format(parseISO(b.date), "EEEE, MMM d, yyyy")} · ${b.timeSlot}`}
                        </p>
                        <p className="mt-1 text-sm text-[var(--faint)]">
                          {b.serviceName
                            ? `${b.birthPlace ?? ""} · ${b.birthTime ?? b.timeSlot} · ₹${b.amount}`
                            : `₹${b.amount}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge status={b.status}>{b.status}</Badge>
                        {b.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setPaidChatOpen(true)}
                          >
                            Paid Chat
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
                              Google Meet session
                            </p>
                            <p className="mt-0.5 text-xs text-[var(--body)]">
                              You get the link 30 min before your booked time.
                            </p>
                            {!b.meetLink && (
                              <p className="mt-2 text-xs text-[var(--amber)]">
                                Waiting for the astrologer to add the Meet link.
                              </p>
                            )}
                            {b.meetLink && !meetReady && (
                              <p className="mt-2 text-xs text-[var(--faint)]">
                                Link is ready. Join opens 30 minutes before{" "}
                                {b.timeSlot}.
                              </p>
                            )}
                            {meetReady && b.meetLink && (
                              <a
                                href={b.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex"
                              >
                                <Button size="sm">
                                  <Video className="h-4 w-4" />
                                  Join Google Meet
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
                title="Consultation Chat"
                subtitle="Private chat for your paid session"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
