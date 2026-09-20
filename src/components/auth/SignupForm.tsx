"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const service = searchParams ? searchParams.get("service") : null;
  const redirectParam = searchParams ? searchParams.get("redirect") : null;
  const targetPath = service
    ? `/dashboard?service=${encodeURIComponent(service)}`
    : redirectParam || "/dashboard";

  const { signup, googleLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const next: Record<string, string> = {};
    if (!email.includes("@")) next.email = "Valid email required";
    if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!isFirebaseConfigured()) {
      toast.error("Firebase not configured");
      return;
    }
    setLoading(true);
    try {
      await signup({ email, password });
      toast.success("Account created! Welcome 🙏");
      router.push(targetPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      toast.error(msg.replace("Firebase: ", "").split("(")[0].trim());
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isFirebaseConfigured()) {
      toast.error("Firebase not configured");
      return;
    }
    setGoogleLoading(true);
    try {
      await googleLogin();
      toast.success("Welcome 🙏");
      router.push(targetPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg.replace("Firebase: ", "").split("(")[0].trim());
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-[var(--surface)] p-7 shadow-[var(--shadow-lg)] sm:p-9"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Grain texture */}
      <div className="constellation pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40" />

      {/* Header */}
      <p className="eyebrow mb-2">नया खाता बनाएं</p>
      <h1 className="heading text-[clamp(1.6rem,4vw,2rem)] mb-1">{APP_NAME}</h1>
      <p className="script-accent text-base mb-6">Join the sacred journey</p>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 rounded-2xl border py-3 text-sm font-medium transition-all duration-300 hover:bg-[var(--emerald)]/10 mb-4"
        style={{ borderColor: "var(--border)", color: "var(--ink)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? "Connecting…" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="divider-celestial mb-4">
        <span className="text-xs text-[var(--faint)] px-2">or</span>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" loading={loading}>
          Create Account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--faint)]">
        Already have an account?{" "}
        <Link
          href={service ? `/login?service=${encodeURIComponent(service)}` : (redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : "/login")}
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
