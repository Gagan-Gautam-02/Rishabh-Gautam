"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";

export function UserProfile() {
  const { user, profile, updateProfileInfo } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[var(--faint)]">Loading profile…</p>
      </div>
    );
  }

  const display = editing
    ? form
    : { name: profile.name, phone: profile.phone, city: profile.city };

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  function startEdit() {
    setForm({
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
    });
    setErrors({});
    setEditing(true);
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name required";
    if (form.phone.replace(/\D/g, "").length < 10) {
      next.phone = "Valid phone required";
    }
    if (!form.city.trim()) next.city = "City required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfileInfo(form);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setErrors({});
    setEditing(false);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]"
      >
        <div className="relative border-b border-[var(--border)] bg-[var(--bg-alt)] px-6 py-8 sm:px-8">
          <div className="constellation pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] font-display text-2xl font-semibold text-[var(--ink)] shadow-[var(--glow)]">
              {initials || <UserRound className="h-8 w-8" />}
            </div>
            <div className="text-center sm:flex-1 sm:text-left">
              <p className="eyebrow mb-1">Your profile</p>
              <h1 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-[var(--faint)]">{profile.email}</p>
            </div>
            {!editing && (
              <Button size="sm" variant="secondary" onClick={startEdit}>
                Edit profile
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {!editing ? (
            <dl className="space-y-4">
              <InfoRow
                icon={<UserRound className="h-4 w-4" />}
                label="Full name"
                value={display.name}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={profile.email}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={display.phone || "—"}
              />
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="City"
                value={display.city || "—"}
              />
              <InfoRow
                icon={<Shield className="h-4 w-4" />}
                label="Account type"
                value={profile.role === "admin" ? "Admin" : "Member"}
              />
              <InfoRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Member since"
                value={format(profile.createdAt, "MMM d, yyyy")}
              />
            </dl>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              <Input
                label="Full name"
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                value={profile.email}
                disabled
                className="opacity-70"
              />
              <p className="-mt-2 text-xs text-[var(--faint)]">
                Email is linked to your login and cannot be changed here.
              </p>
              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="City"
                value={form.city}
                error={errors.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>
                  Save changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gold-soft)] text-[var(--gold-ink)]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-medium uppercase tracking-wide text-[var(--faint)]">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-[var(--ink)]">{value}</dd>
      </div>
    </div>
  );
}
