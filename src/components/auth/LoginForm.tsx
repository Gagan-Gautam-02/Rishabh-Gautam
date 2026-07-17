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

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }
    if (!isFirebaseConfigured()) {
      toast.error("Add Firebase keys to .env.local");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      const profile = useAuthStore.getState().profile;
      router.push(profile?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      toast.error(message.replace("Firebase: ", "").split("(")[0]);
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
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">
        Sign in to continue
      </h1>
      <p className="mt-1.5 text-sm text-[var(--faint)]">
        Manage your bookings and consultations
      </p>
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-[var(--faint)]">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
