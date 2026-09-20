"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";
import { useT } from "@/store/localeStore";
import { useAuthStore } from "@/store/authStore";

function WhatsAppIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

interface WhatsAppSupportWidgetProps {
  /** Optional custom trigger button instead of default floating button */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideFloatingButton?: boolean;
}

export function WhatsAppSupportWidget({
  isOpen,
  onOpenChange,
  hideFloatingButton = false,
}: WhatsAppSupportWidgetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const profile = useAuthStore((s) => s.profile);
  const { locale } = useT();
  const isHi = locale === "hi";

  const [name, setName] = useState(profile?.name ?? "");
  const [error, setError] = useState("");

  const PHONE_NUMBER = "917300530090";

  function handleOpen() {
    if (profile?.name && !name) {
      setName(profile.name);
    }
    setError("");
    setOpen(true);
  }

  function handleSend() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(isHi ? "कृपया अपना नाम दर्ज करें" : "Please enter your name");
      return;
    }

    const defaultMsg = isHi
      ? `नमस्ते! मेरा नाम ${trimmedName} है। मुझे शास्त्रीय योगशाला के बारे में सहायता एवं जानकारी चाहिए।`
      : `Namaste! My name is ${trimmedName}. I need help and support regarding Shastriya Yogshala.`;

    const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(defaultMsg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const previewName = name.trim() || (isHi ? "आपका नाम" : "Your Name");
  const previewMessage = isHi
    ? `नमस्ते! मेरा नाम ${previewName} है। मुझे शास्त्रीय योगशाला के बारे में सहायता एवं जानकारी चाहिए।`
    : `Namaste! My name is ${previewName}. I need help and support regarding Shastriya Yogshala.`;

  return (
    <>
      {/* ── Floating WhatsApp Logo Button (without login) ── */}
      {!hideFloatingButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleOpen}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              color: "#FFFFFF",
              boxShadow: "0 8px 28px rgba(37, 211, 102, 0.45)",
              border: "1.5px solid rgba(255, 255, 255, 0.25)",
            }}
            aria-label="WhatsApp Support"
          >
            <WhatsAppIcon className="h-7 w-7 fill-white drop-shadow-sm transition-transform duration-300 group-hover:scale-110" />

            {/* Active pulse indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#25D366] border-2 border-white"></span>
            </span>

            {/* Hover tooltip */}
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[var(--forest-deep)] px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1 border border-white/15">
              {isHi ? "व्हाट्सएप सहायता" : "WhatsApp Support"}
            </span>
          </motion.button>
        </div>
      )}

      {/* ── Name Input & WhatsApp Redirect Modal ── */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl p-6 sm:p-7 shadow-2xl border"
              style={{
                background: "linear-gradient(170deg, #10261D 0%, #0A1912 100%)",
                borderColor: "var(--brass-hairline)",
                color: "var(--cream)",
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/10 text-white/70 hover:text-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl shadow-md"
                  style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                >
                  <WhatsAppIcon className="h-6 w-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">
                    {isHi ? "सहायता एवं समर्थन" : "Help & Support"}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--brass)" }}>
                    {isHi ? "व्हाट्सएप पर तुरंत संपर्क करें" : "Instant WhatsApp Assistance"}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed mb-5" style={{ color: "var(--cream-muted)" }}>
                {isHi
                  ? "कृपया अपना नाम दर्ज करें। आपको सीधे शास्त्रीय योगशाला के व्हाट्सएप नंबर पर पुनर्निर्देशित किया जाएगा।"
                  : "Please enter your name to connect directly with Shastriya Yogshala on WhatsApp."}
              </p>

              {/* Name Input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brass)" }}>
                  {isHi ? "आपका नाम *" : "Your Name *"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={isHi ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                    className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: error ? "1.5px solid #EF4444" : "1.5px solid var(--brass-hairline)",
                    }}
                  />
                </div>
                {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
              </div>

              {/* Default Message Preview */}
              <div className="mb-6 rounded-xl p-3.5 border text-xs" style={{ background: "rgba(37, 211, 102, 0.08)", borderColor: "rgba(37, 211, 102, 0.25)" }}>
                <p className="font-semibold text-[11px] uppercase tracking-wide mb-1 text-emerald-400">
                  {isHi ? "व्हाट्सएप पर जाने वाला संदेश:" : "WhatsApp Message Preview:"}
                </p>
                <p className="italic text-white/90 leading-relaxed">
                  &ldquo;{previewMessage}&rdquo;
                </p>
              </div>

              {/* CTA Action Button */}
              <button
                type="button"
                onClick={handleSend}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-300 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  boxShadow: "0 8px 24px rgba(37, 211, 102, 0.4)",
                }}
              >
                <WhatsAppIcon className="h-4 w-4 fill-white" />
                <span>{isHi ? "व्हाट्सएप पर चैट शुरू करें" : "Continue to WhatsApp"}</span>
                <Send className="h-3.5 w-3.5 ml-1" />
              </button>

              <p className="mt-3 text-center text-[11px] text-white/50">
                {isHi ? "हेल्पलाइन: +91 7300530090" : "Helpline: +91 7300530090"}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
