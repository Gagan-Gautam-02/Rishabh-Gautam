"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const variants = {
  primary:
    "bg-[var(--primary)] text-[var(--ink)] hover:bg-[var(--primary-2)] shadow-[var(--shadow-md)]",
  gold: "bg-[var(--gold)] text-[var(--ink)] hover:brightness-105 shadow-[var(--shadow-sm)]",
  secondary:
    "bg-[var(--surface)] text-[var(--ink)] border border-[var(--border-strong)] hover:border-[var(--primary)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--primary-soft)]",
  danger: "bg-[var(--clay)] text-white hover:brightness-110",
};

const sizes = {
  sm: "px-3.5 py-2 text-sm min-h-[38px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-7 py-3.5 text-base min-h-[52px]",
};

export function Button({
  children,
  variant = "primary",
  loading,
  size = "md",
  className = "",
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  );
}
