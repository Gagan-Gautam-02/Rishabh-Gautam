"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, X } from "lucide-react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { supportChatId } from "@/lib/chat";
import { useAuthStore } from "@/store/authStore";

interface SupportChatFabProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SupportChatFab({
  open: controlledOpen,
  onOpenChange,
}: SupportChatFabProps) {
  const { user, profile } = useAuthStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  function setOpen(next: boolean) {
    onOpenChange?.(next);
    if (controlledOpen === undefined) setInternalOpen(next);
  }

  if (!user || !profile || profile.role === "admin") return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22 }}
              className="mb-3 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl shadow-[var(--shadow-lg)]"
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-2 top-2 z-10 rounded-full bg-[var(--surface)] p-1.5 shadow-[var(--shadow-sm)]"
                  aria-label="Close support chat"
                >
                  <X className="h-4 w-4 text-[var(--ink)]" />
                </button>
                <ChatWindow
                  bookingId={supportChatId(user.uid)}
                  currentUserId={user.uid}
                  currentRole="user"
                  currentName={profile.name}
                  peerUserId={user.uid}
                  peerUserName={profile.name}
                  chatType="support"
                  title="Help & Support"
                  subtitle="Ask anything — we are here to help"
                  compact
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setOpen(!open)}
          className="group relative ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink)] shadow-[var(--glow)]"
          aria-label={open ? "Close help chat" : "Open help & support"}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Headphones className="h-6 w-6" />
          )}
          <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-[var(--ink)] px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Help &amp; Support
          </span>
        </motion.button>
      </div>
    </>
  );
}
