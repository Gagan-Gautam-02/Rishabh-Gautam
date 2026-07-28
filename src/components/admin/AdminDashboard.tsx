"use client";

import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarClock,
  CalendarPlus,
  Check,
  CreditCard,
  IndianRupee,
  MessageCircle,
  Search,
  Users,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/Skeleton";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { CONSULTATION_FEE, TIME_OPTIONS } from "@/lib/constants";
import {
  subscribeConsultationFee,
  updateConsultationFee,
} from "@/lib/settings";
import {
  addSlots,
  deleteSlot,
  markNotificationRead,
  subscribeAllBookings,
  subscribeNotifications,
  subscribeSlots,
  updateBookingMeetLink,
  updateBookingStatus,
} from "@/lib/bookings";
import { isValidMeetUrl } from "@/lib/meet";
import { paidChatId, sendMessage, subscribeChatList, type ChatListItem } from "@/lib/chat";
import { subscribeUsers } from "@/lib/users";
import { isFirebaseConfigured } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useT } from "@/store/localeStore";
import type {
  Booking,
  Notification,
  Slot,
  AppUser,
  ChatType,
} from "@/lib/types";

type AdminTab =
  | "bookings"
  | "slots"
  | "users"
  | "notifications"
  | "support"
  | "paidChat"
  | "settings";

export function AdminDashboard() {
  const { user } = useAuthStore();
  const { t } = useT();
  const [tab, setTab] = useState<AdminTab>("bookings");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [supportChats, setSupportChats] = useState<ChatListItem[]>([]);
  const [paidChats, setPaidChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured());
  const [date, setDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState<Booking["status"] | "all">(
    "pending"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeSupportId, setActiveSupportId] = useState<string | null>(null);
  const [activePaidId, setActivePaidId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");
  const [fee, setFee] = useState(String(CONSULTATION_FEE));
  const [savingFee, setSavingFee] = useState(false);
  const [meetDrafts, setMeetDrafts] = useState<Record<string, string>>({});
  const [savingMeetId, setSavingMeetId] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }
    const unsubs = [
      subscribeSlots(setSlots),
      subscribeAllBookings((b) => {
        setBookings(b);
        setLoading(false);
      }),
      subscribeUsers(setUsers),
      subscribeNotifications(setNotifications),
      subscribeChatList(setSupportChats, "support"),
      subscribeChatList(setPaidChats, "paid"),
      subscribeConsultationFee((value) => setFee(String(value))),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const supportUnread = supportChats.reduce((n, c) => n + c.unreadByAdmin, 0);
  const paidUnread = paidChats.reduce((n, c) => n + c.unreadByAdmin, 0);

  const stats = useMemo(() => {
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: confirmed.length,
      revenue: confirmed
        .filter((b) => b.createdAt >= weekAgo)
        .reduce((sum, b) => sum + b.amount, 0),
    };
  }, [bookings, now]);

  const filteredUsers = useMemo(() => {
    const q = userQuery.toLowerCase();
    return users
      .filter((u) => u.role !== "admin")
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
  }, [users, userQuery]);

  const filteredBookings = useMemo(
    () =>
      bookingFilter === "all"
        ? bookings
        : bookings.filter((b) => b.status === bookingFilter),
    [bookings, bookingFilter]
  );

  const filteredSupportChats = useMemo(() => {
    const q = chatSearch.toLowerCase();
    return supportChats.filter((c) => c.userName.toLowerCase().includes(q));
  }, [supportChats, chatSearch]);

  const filteredPaidChats = useMemo(() => {
    const q = chatSearch.toLowerCase();
    return paidChats.filter((c) => c.userName.toLowerCase().includes(q));
  }, [paidChats, chatSearch]);

  async function handleAddSlots() {
    if (!date || selectedTimes.length === 0) {
      toast.error("Pick a date and at least one time");
      return;
    }
    setAdding(true);
    try {
      const added = await addSlots(date, selectedTimes);
      toast.success(added ? `Added ${added} slot(s)` : "Slots already exist");
      setSelectedTimes([]);
    } catch {
      toast.error("Failed to add slots");
    } finally {
      setAdding(false);
    }
  }

  async function handleStatus(booking: Booking, status: Booking["status"]) {
    try {
      await updateBookingStatus(booking.id, status, booking.slotId);
      if (status === "confirmed" && user) {
        await sendMessage({
          bookingId: paidChatId(booking.userId),
          senderId: user.uid,
          senderRole: "admin",
          senderName: user.displayName || "Astro Bodh Astrologer",
          text: `Your ${booking.serviceName || "consultation"} booking for ${booking.date} (${booking.timeSlot}) has been accepted! You can chat with me here.`,
          userId: booking.userId,
          userName: booking.userName,
          chatType: "paid",
        }).catch(() => undefined);
      }
      toast.success(`Booking ${status}`);
    } catch {
      toast.error("Update failed");
    }
  }

  async function handleSaveMeetLink(booking: Booking) {
    const link = (meetDrafts[booking.id] ?? booking.meetLink ?? "").trim();
    if (!link) {
      toast.error("Paste a Google Meet link");
      return;
    }
    if (!isValidMeetUrl(link)) {
      toast.error("Enter a valid Google Meet URL");
      return;
    }
    setSavingMeetId(booking.id);
    try {
      await updateBookingMeetLink(booking.id, link);
      toast.success("Meet link saved — visible to user");
    } catch {
      toast.error("Could not save Meet link");
    } finally {
      setSavingMeetId(null);
    }
  }

  async function handleSaveFee() {
    const value = Number(fee);
    setSavingFee(true);
    try {
      await updateConsultationFee(value);
      toast.success(`Consultation fee updated to ₹${value}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update fee");
    } finally {
      setSavingFee(false);
    }
  }

  const nav: { id: AdminTab; label: string; badge?: number }[] = [
    { id: "bookings", label: t.admin.bookings },
    { id: "slots", label: t.admin.slots },
    { id: "users", label: t.admin.users },
    { id: "notifications", label: t.admin.alerts, badge: unreadCount },
    { id: "support", label: t.admin.support, badge: supportUnread || undefined },
    { id: "paidChat", label: t.admin.paidChat, badge: paidUnread || undefined },
    { id: "settings", label: t.admin.fee },
  ];

  if (!isFirebaseConfigured()) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EmptyState
          title={t.dashboard.firebaseMissing}
          description={t.dashboard.firebaseMissingHint}
        />
      </div>
    );
  }

  const statCards = [
    { label: t.admin.totalBookings, value: stats.total, icon: CalendarClock },
    { label: t.admin.pending, value: stats.pending, icon: Bell },
    { label: t.admin.confirmed, value: stats.confirmed, icon: Check },
    {
      label: t.admin.revenue,
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">{t.admin.title}</p>
          <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[var(--ink)]">
            {t.admin.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--faint)]">
            {t.admin.subtitle}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setTab("notifications")}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)] px-3 py-2 text-sm font-medium text-[var(--gold-ink)]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount} new
          </button>
        )}
      </div>

      {/* Stats overview */}
      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--faint)]">{s.label}</p>
              <s.icon className="h-4 w-4 text-[var(--gold-ink)]" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold text-[var(--ink)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === item.id
                ? "bg-[var(--primary)] text-[var(--ink)] shadow-[var(--shadow-sm)]"
                : "border border-[var(--border)] bg-[var(--surface)] text-[var(--body)] hover:border-[var(--primary)]/40"
            }`}
          >
            {item.label}
            {item.badge ? (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--gold)] px-1.5 text-[10px] font-semibold text-[var(--ink)]">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28 }}
          className="w-full"
        >
          {tab === "slots" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                  <CalendarPlus className="h-5 w-5 text-[var(--gold-ink)]" />
                  Add available slots
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium text-[var(--ink)]">
                        Times (1-hour, 24h)
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTimes((prev) =>
                            prev.length === TIME_OPTIONS.length
                              ? []
                              : [...TIME_OPTIONS]
                          )
                        }
                        className="text-xs font-medium text-[var(--primary)] hover:underline"
                      >
                        {selectedTimes.length === TIME_OPTIONS.length
                          ? "Clear all"
                          : "Select all 24"}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {TIME_OPTIONS.map((t) => {
                        const active = selectedTimes.includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() =>
                              setSelectedTimes((prev) =>
                                active
                                  ? prev.filter((x) => x !== t)
                                  : [...prev, t]
                              )
                            }
                            className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                              active
                                ? "bg-[var(--primary)] text-[var(--ink)]"
                                : "border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--body)] hover:border-[var(--primary)]/40"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button onClick={handleAddSlots} loading={adding} className="w-full">
                    Save Slots
                  </Button>
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-[var(--ink)]">
                  Existing slots
                </h2>
                <div className="scroll-soft max-h-[28rem] space-y-2 overflow-y-auto">
                  {slots.length === 0 ? (
                    <EmptyState
                      icon={<CalendarClock className="h-6 w-6" />}
                      title="No slots yet"
                      description="Add dates and times on the left."
                    />
                  ) : (
                    slots.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-3.5 py-2.5"
                      >
                        <div>
                          <p className="text-sm text-[var(--ink)]">
                            {format(parseISO(s.date), "MMM d, yyyy")} · {s.time}
                          </p>
                          <p className="text-xs text-[var(--faint)]">
                            {s.isBooked ? "Booked" : "Open"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            await deleteSlot(s.id);
                            toast.success("Slot deleted");
                          }}
                          disabled={s.isBooked}
                        >
                          Delete
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          )}

          {tab === "settings" && (
            <section className="max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-[var(--ink)]">
                <CreditCard className="h-5 w-5 text-[var(--gold-ink)]" />
                Consultation fee
              </h2>
              <p className="mb-5 text-sm text-[var(--faint)]">
                New bookings use this amount immediately.
              </p>
              <div className="space-y-4">
                <Input
                  label="Fee (₹)"
                  type="number"
                  min="1"
                  max="1000000"
                  step="1"
                  value={fee}
                  onChange={(event) => setFee(event.target.value)}
                />
                <Button onClick={handleSaveFee} loading={savingFee} className="w-full">
                  Save Fee
                </Button>
              </div>
            </section>
          )}

          {tab === "users" && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-[var(--gold-ink)]" />
                <h2 className="font-display text-lg font-semibold text-[var(--ink)]">
                  Registered users
                </h2>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--faint)]" />
                <input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder={t.admin.searchUsers}
                  className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-alt)] py-2.5 pl-10 pr-4 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                />
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-[var(--faint)]">
                    <tr>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Phone</th>
                      <th className="pb-3 font-semibold">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.uid}
                        className="border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-alt)]"
                      >
                        <td className="py-3 font-medium text-[var(--ink)]">
                          {u.name}
                        </td>
                        <td className="py-3 text-[var(--body)]">{u.phone}</td>
                        <td className="py-3 text-[var(--body)]">{u.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="space-y-2 sm:hidden">
                {filteredUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-3"
                  >
                    <p className="font-medium text-[var(--ink)]">{u.name}</p>
                    <p className="mt-1 text-sm text-[var(--body)]">{u.phone}</p>
                    <p className="text-sm text-[var(--faint)]">{u.city}</p>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--faint)]">
                  No users found
                </p>
              )}
            </section>
          )}

          {tab === "notifications" && (
            <section className="space-y-2">
              {notifications.length === 0 ? (
                <EmptyState
                  icon={<Bell className="h-6 w-6" />}
                  title="No notifications"
                  description="New bookings will appear here."
                />
              ) : (
                notifications.map((n) => (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => markNotificationRead(n.id)}
                    className={`flex w-full items-start justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                      n.read
                        ? "border-[var(--border)] bg-[var(--surface)]"
                        : "border-[var(--gold)]/40 bg-[var(--gold-soft)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--gold)]" />
                      )}
                      <div>
                        <p className="text-sm text-[var(--ink)]">
                          New booking from <strong>{n.userName}</strong>
                        </p>
                        <p className="mt-1 text-xs text-[var(--faint)]">
                          {n.date && n.timeSlot
                            ? `${format(parseISO(n.date), "MMM d")} · ${n.timeSlot}`
                            : "Slot details"}
                        </p>
                      </div>
                    </div>
                    {!n.read && (
                      <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-medium text-[var(--ink)]">
                        New
                      </span>
                    )}
                  </motion.button>
                ))
              )}
            </section>
          )}

          {tab === "bookings" && (
            <section>
              <div className="mb-4 flex flex-wrap gap-2">
                {(["pending", "confirmed", "rejected", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setBookingFilter(f)}
                    className={`rounded-xl px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                      bookingFilter === f
                        ? "bg-[var(--primary)] text-[var(--ink)]"
                        : "border border-[var(--border)] bg-[var(--surface)] text-[var(--body)] hover:border-[var(--primary)]/40"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-28" />
                  ))}
                </div>
              ) : filteredBookings.length === 0 ? (
                <EmptyState
                  icon={<CalendarClock className="h-6 w-6" />}
                  title="No bookings"
                  description="Nothing in this filter yet."
                />
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-[var(--ink)]">
                              {b.userName}
                            </p>
                            <Badge status={b.status}>{b.status}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-[var(--faint)]">
                            {b.userPhone}
                          </p>
                          <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-3.5 py-3 text-sm">
                            <p className="font-semibold text-[var(--gold-ink)] mb-2">
                              📅 Consultation Meeting: {b.date && b.date.length > 5 ? format(parseISO(b.date), "EEE, MMM d, yyyy") : b.date || "Assigned on confirmation"} · {b.timeSlot}
                            </p>
                            {b.serviceName && (
                              <p className="text-xs font-semibold text-[var(--ink)] mb-2 uppercase tracking-wide">
                                Service: {b.serviceName}
                              </p>
                            )}
                            {b.brideName ? (
                              <div className="space-y-2">
                                <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                                  <p className="font-semibold text-xs text-[var(--gold-ink)] uppercase">Bride Birth Details</p>
                                  <p className="mt-1 text-[var(--body)]"><span className="text-[var(--faint)]">Name:</span> {b.brideName} ({b.brideAge} yrs)</p>
                                  <p className="text-[var(--body)]"><span className="text-[var(--faint)]">DOB:</span> {b.brideDob ? format(parseISO(b.brideDob), "dd MMM yyyy") : "—"} · {b.brideBirthTime}</p>
                                  <p className="text-[var(--body)]"><span className="text-[var(--faint)]">Place:</span> {b.brideBirthPlace}</p>
                                </div>
                                <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                                  <p className="font-semibold text-xs text-[var(--gold-ink)] uppercase">Groom Birth Details</p>
                                  <p className="mt-1 text-[var(--body)]"><span className="text-[var(--faint)]">Name:</span> {b.groomName} ({b.groomAge} yrs)</p>
                                  <p className="text-[var(--body)]"><span className="text-[var(--faint)]">DOB:</span> {b.groomDob ? format(parseISO(b.groomDob), "dd MMM yyyy") : "—"} · {b.groomBirthTime}</p>
                                  <p className="text-[var(--body)]"><span className="text-[var(--faint)]">Place:</span> {b.groomBirthPlace}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg bg-[var(--surface)] p-2.5 border border-[var(--border)]">
                                <p className="font-semibold text-xs text-[var(--gold-ink)] uppercase mb-1">User Birth Details</p>
                                <p className="text-[var(--body)]"><span className="text-[var(--faint)]">Name:</span> {b.birthName ?? b.userName}</p>
                                <p className="mt-0.5 text-[var(--body)]"><span className="text-[var(--faint)]">DOB:</span> {b.dob ? format(parseISO(b.dob), "dd MMM yyyy") : "—"} · {b.birthTime ?? "—"}</p>
                                <p className="mt-0.5 text-[var(--body)]"><span className="text-[var(--faint)]">Place:</span> {b.birthPlace ?? "—"}</p>
                              </div>
                            )}
                          </div>

                          {b.note && (
                            <div className="mt-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-soft)] px-3.5 py-2.5 text-xs text-[var(--ink)]">
                              <p className="font-semibold text-[var(--gold-ink)] flex items-center gap-1.5 mb-1">
                                📝 User Note / Special Request:
                              </p>
                              <p className="leading-relaxed text-[var(--body)]">{b.note}</p>
                            </div>
                          )}
                          <p className="mt-2 font-display text-lg font-semibold text-[var(--gold-ink)]">
                            ₹{b.amount}
                          </p>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          {b.screenshotUrl && (
                            <button
                              onClick={() => setPreviewUrl(b.screenshotUrl)}
                              className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--border)]"
                            >
                              <Image
                                src={b.screenshotUrl}
                                alt="Payment"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </button>
                          )}
                          {b.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleStatus(b, "confirmed")}
                              >
                                <Check className="h-4 w-4" /> {t.admin.accept}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleStatus(b, "rejected")}
                              >
                                <X className="h-4 w-4" /> {t.admin.reject}
                              </Button>
                            </div>
                          )}
                          {b.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setActivePaidId(paidChatId(b.userId));
                                setTab("paidChat");
                              }}
                            >
                              <MessageCircle className="h-4 w-4" /> Chat with {b.userName.split(" ")[0]}
                            </Button>
                          )}
                        </div>
                      </div>

                      {b.status === "confirmed" && (
                        <div className="mt-4 border-t border-[var(--border)] pt-4">
                          <p className="mb-1 flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                            <Video className="h-4 w-4 text-[var(--gold-ink)]" />
                            Google Meet link
                          </p>
                          <p className="mb-3 text-xs text-[var(--faint)]">
                            User sees Join Meet 30 minutes before {b.timeSlot}.
                          </p>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                              value={meetDrafts[b.id] ?? b.meetLink ?? ""}
                              onChange={(e) =>
                                setMeetDrafts((prev) => ({
                                  ...prev,
                                  [b.id]: e.target.value,
                                }))
                              }
                              placeholder="https://meet.google.com/abc-defg-hij"
                              className="w-full flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-alt)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
                            />
                            <Button
                              size="sm"
                              loading={savingMeetId === b.id}
                              onClick={() => handleSaveMeetLink(b)}
                            >
                              Save Link
                            </Button>
                          </div>
                          {b.meetLink && (
                            <p className="mt-2 truncate text-xs text-[var(--sage)]">
                              Saved: {b.meetLink}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "support" && (
            <AdminChatInbox
              title={t.admin.helpSupport}
              emptyHint={t.admin.supportEmpty}
              chats={filteredSupportChats}
              chatSearch={chatSearch}
              onSearch={setChatSearch}
              activeId={activeSupportId}
              onSelect={setActiveSupportId}
              chatType="support"
              adminId={user?.uid ?? ""}
            />
          )}

          {tab === "paidChat" && (
            <AdminChatInbox
              title={t.admin.paidConsultations}
              emptyHint={t.admin.paidEmpty}
              chats={filteredPaidChats}
              chatSearch={chatSearch}
              onSearch={setChatSearch}
              activeId={activePaidId}
              onSelect={setActivePaidId}
              chatType="paid"
              adminId={user?.uid ?? ""}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/70 p-4 backdrop-blur-sm"
            onClick={() => setPreviewUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              className="relative h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)]"
            >
              <Image
                src={previewUrl}
                alt="Payment screenshot"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminChatInbox({
  title,
  emptyHint,
  chats,
  chatSearch,
  onSearch,
  activeId,
  onSelect,
  chatType,
  adminId,
}: {
  title: string;
  emptyHint: string;
  chats: ChatListItem[];
  chatSearch: string;
  onSearch: (v: string) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  chatType: ChatType;
  adminId: string;
}) {
  const { t } = useT();
  const active = chats.find((c) => c.bookingId === activeId);

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-sm)]">
        <div className="mb-3 flex items-center gap-2 px-1">
          <MessageCircle className="h-4 w-4 text-[var(--gold-ink)]" />
          <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
        </div>
        <input
          value={chatSearch}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t.admin.searchUsers}
          className="mb-3 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--bg-alt)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--primary)]"
        />
        <div className="scroll-soft max-h-[26rem] space-y-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-[var(--faint)]">
              {emptyHint}
            </p>
          ) : (
            chats.map((c) => (
              <button
                key={c.bookingId}
                type="button"
                onClick={() => onSelect(c.bookingId)}
                className={`flex w-full items-start justify-between rounded-xl px-3 py-2.5 text-left transition-colors ${
                  activeId === c.bookingId
                    ? "bg-[var(--primary-soft)]"
                    : "hover:bg-[var(--bg-alt)]"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">
                    {c.userName}
                  </p>
                  <p className="truncate text-xs text-[var(--faint)]">
                    {c.lastMessage || t.chat.noMessages}
                  </p>
                </div>
                {c.unreadByAdmin > 0 && (
                  <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--gold)] px-1.5 text-[10px] font-semibold text-[var(--ink)]">
                    {c.unreadByAdmin}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </aside>
      <div>
        {activeId && active && adminId ? (
          <ChatWindow
            bookingId={activeId}
            currentUserId={adminId}
            currentRole="admin"
            currentName="Astrologer"
            peerUserId={active.userId}
            peerUserName={active.userName}
            chatType={chatType}
            title={active.userName}
            subtitle={
              chatType === "support" ? t.chat.helpSupport : t.chat.paidTitle
            }
          />
        ) : (
          <EmptyState
            icon={<MessageCircle className="h-6 w-6" />}
            title={t.admin.selectConversation}
            description={t.admin.selectConversationHint}
          />
        )}
      </div>
    </div>
  );
}
