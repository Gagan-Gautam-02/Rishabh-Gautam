import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { UserDashboard } from "@/components/dashboard/UserDashboard";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <Suspense fallback={<div className="min-h-screen" />}>
          <UserDashboard />
        </Suspense>
      </ProtectedRoute>
    </>
  );
}
