import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    </>
  );
}
