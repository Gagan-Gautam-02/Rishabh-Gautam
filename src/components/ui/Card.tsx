"use client";

import { motion } from "framer-motion";

export function Card({
  children,
  className = "",
  hover = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section";
}) {
  const Comp = as === "section" ? motion.section : motion.div;
  return (
    <Comp
      whileHover={
        hover
          ? { y: -4, boxShadow: "var(--shadow-lg)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] ${className}`}
    >
      {children}
    </Comp>
  );
}
