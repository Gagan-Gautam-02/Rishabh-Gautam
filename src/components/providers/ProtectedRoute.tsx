"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, profile, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized || loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (adminOnly && profile?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, profile, loading, initialized, adminOnly, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) return null;
  if (adminOnly && profile?.role !== "admin") return null;

  return <>{children}</>;
}
