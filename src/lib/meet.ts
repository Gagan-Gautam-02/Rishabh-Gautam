import { parse } from "date-fns";

/** Parse booking date (YYYY-MM-DD) + time ("10:00 AM" / "09:00 AM") to Date. */
export function getSlotDateTime(date: string, timeSlot: string): Date {
  const normalized = timeSlot.replace(/^(\d):/, "0$1:");
  return parse(`${date} ${normalized}`, "yyyy-MM-dd hh:mm a", new Date());
}

/** Meet join unlocks 30 minutes before the booked slot. */
export function isMeetJoinUnlocked(date: string, timeSlot: string, now = new Date()): boolean {
  const slotStart = getSlotDateTime(date, timeSlot);
  if (Number.isNaN(slotStart.getTime())) return false;
  const unlockAt = new Date(slotStart.getTime() - 30 * 60 * 1000);
  // Keep join available until 2 hours after slot start
  const expireAt = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000);
  return now >= unlockAt && now <= expireAt;
}

export function isValidMeetUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      (parsed.hostname.includes("meet.google.com") ||
        parsed.hostname.includes("google.com"))
    );
  } catch {
    return false;
  }
}
