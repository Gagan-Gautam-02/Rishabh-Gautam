"use client";

import type { BookingStatus } from "@/lib/types";

const styles: Record<string, string> = {
  pending: "bg-[var(--amber-soft)] text-[var(--amber)]",
  confirmed: "bg-[var(--sage-soft)] text-[var(--sage)]",
  rejected: "bg-[var(--clay-soft)] text-[var(--clay)]",
  neutral: "bg-[var(--primary-soft)] text-[var(--primary)]",
};

const dotColor: Record<string, string> = {
  pending: "bg-[var(--amber)]",
  confirmed: "bg-[var(--sage)]",
  rejected: "bg-[var(--clay)]",
  neutral: "bg-[var(--primary)]",
};

export function Badge({
  status = "neutral",
  children,
  dot = true,
  className = "",
}: {
  status?: BookingStatus | "neutral";
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[status]} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor[status]}`} />
      )}
      {children}
    </span>
  );
}
