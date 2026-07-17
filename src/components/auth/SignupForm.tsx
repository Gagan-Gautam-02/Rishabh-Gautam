"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { isFirebaseConfigured } from "@/lib/firebase";
import { APP_NAME } from "@/lib/constants";

export function SignupForm() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name required";
    if (!form.email.includes("@")) next.email = "Valid email required";
    if (form.phone.replace(/\D/g, "").length < 10) next.phone = "Valid phone required";
    if (!form.city.trim()) next.city = "City required";
    if (form.password.length < 6) next.password = "Min 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!isFirebaseConfigured()) {
      toast.error("Add Firebase keys to .env.local");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created");
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Signup error:", err);
      const message =
        err instanceof Error ? err.message : "Signup failed. Try again.";
      const clean = message.includes("Firestore")
        ? message
        : message.replace("Firebase: ", "").split("(")[0].trim();
      toast.error(clean || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow-lg)] sm:p-9"
    >
      <div className="constellation pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60" />
      <p className="eyebrow mb-3">Get started</p>
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-[var(--faint)]">
        Join {APP_NAME} to book a session
      </p>
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Phone Number"
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
        <Input
          label="Password"
          type="password"
          value={form.password}
          error={errors.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign Up
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-[var(--faint)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Login
        </Link>
      </p>
    </motion.div>
  );
}
