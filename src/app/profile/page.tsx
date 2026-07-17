import { Navbar } from "@/components/layout/Navbar";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";
import { UserProfile } from "@/components/profile/UserProfile";
import { SupportChatFab } from "@/components/chat/SupportChatFab";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <ProtectedRoute>
        <UserProfile />
        <SupportChatFab />
      </ProtectedRoute>
    </>
  );
}
