"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, MessageCircle, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import {
  clearUnread,
  sendMessage,
  subscribeMessages,
  uploadChatImage,
} from "@/lib/chat";
import type { ChatMessage, ChatType, UserRole } from "@/lib/types";

interface ChatWindowProps {
  bookingId: string;
  currentUserId: string;
  currentRole: UserRole;
  currentName: string;
  peerUserId: string;
  peerUserName: string;
  chatType: ChatType;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export function ChatWindow({
  bookingId,
  currentUserId,
  currentRole,
  currentName,
  peerUserId,
  peerUserName,
  chatType,
  title,
  subtitle,
  compact = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = subscribeMessages(bookingId, setMessages);
    clearUnread(bookingId, currentRole).catch(() => undefined);
    return unsub;
  }, [bookingId, currentRole]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function clearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onPickImage(file: File | null) {
    if (!file) {
      clearImage();
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function onSend(e: FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !imageFile) return;
    setSending(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadChatImage(bookingId, imageFile);
      }
      await sendMessage({
        bookingId,
        senderId: currentUserId,
        senderRole: currentRole,
        senderName: currentName,
        text: trimmed,
        imageUrl,
        userId: peerUserId || currentUserId,
        userName: peerUserName,
        chatType,
      });
      setText("");
      clearImage();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Could not send";
      if (
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        toast.error("Upload blocked. Check Storage rules for chat-images.");
      } else {
        toast.error(msg.slice(0, 120));
      }
    } finally {
      setSending(false);
    }
  }

  const canSend = Boolean(text.trim() || imageFile);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] ${
        compact
          ? "h-[min(28rem,70vh)]"
          : "h-[70vh] max-h-[34rem] min-h-[24rem]"
      }`}
    >
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink)]">
          <MessageCircle className="h-4 w-4" />
        </span>
        <div>
          <p className="font-medium text-[var(--ink)]">
            {title ??
              (currentRole === "admin" ? peerUserName : "Astrologer")}
          </p>
          <p className="text-xs text-[var(--faint)]">
            {subtitle ??
              (chatType === "support"
                ? "Help & Support"
                : "Paid consultation chat")}
          </p>
        </div>
      </div>

      <div className="scroll-soft flex-1 space-y-3 overflow-y-auto bg-[var(--bg-alt)]/40 px-4 py-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-[var(--faint)]">
            No messages yet. Send a note or photo to start.
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const mine = m.senderId === currentUserId;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 shadow-[var(--shadow-sm)] ${
                    mine
                      ? "rounded-br-sm bg-[var(--primary)] text-[var(--ink)]"
                      : "rounded-bl-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]"
                  }`}
                >
                  <p
                    className={`text-[10px] font-medium ${
                      mine ? "text-[var(--ink)]/70" : "text-[var(--gold-ink)]"
                    }`}
                  >
                    {m.senderName}
                  </p>
                  {m.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setLightbox(m.imageUrl!)}
                      className="relative mt-1.5 block w-full max-w-[220px] overflow-hidden rounded-xl"
                    >
                      <Image
                        src={m.imageUrl}
                        alt="Chat attachment"
                        width={220}
                        height={220}
                        className="h-auto max-h-56 w-full object-cover"
                        unoptimized
                      />
                    </button>
                  )}
                  {m.text ? (
                    <p className="mt-1 text-sm leading-relaxed">{m.text}</p>
                  ) : null}
                  <p
                    className={`mt-1 text-[10px] ${
                      mine ? "text-[var(--ink)]/55" : "text-[var(--faint)]"
                    }`}
                  >
                    {format(m.createdAt, "h:mm a")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div className="flex items-center gap-3 border-t border-[var(--border)] bg-[var(--bg-alt)] px-3 py-2">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg border border-[var(--border)]">
            <Image
              src={imagePreview}
              alt="Selected"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-[var(--faint)]">
            {imageFile?.name}
          </p>
          <button
            type="button"
            onClick={clearImage}
            className="rounded-lg p-1.5 text-[var(--faint)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={onSend}
        className="flex gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onPickImage(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--bg-alt)] text-[var(--ink)] transition-colors hover:border-[var(--primary)] disabled:opacity-50"
          aria-label="Attach image"
        >
          <ImagePlus className="h-4.5 w-4.5" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-alt)] px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)]"
        />
        <Button type="submit" size="sm" loading={sending} disabled={!canSend}>
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ink)]/75 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              className="relative h-[80vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-[var(--surface)] p-2 shadow-[var(--shadow-lg)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-[var(--surface)] p-2 shadow-[var(--shadow-sm)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <Image
                src={lightbox}
                alt="Full size"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
