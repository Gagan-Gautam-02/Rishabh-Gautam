"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About Astrologer" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, logout } = useAuthStore();
  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--bg)]/85 shadow-[var(--shadow-sm)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink)]">
            <Moon className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-xl tracking-tight text-[var(--ink)]">
            {APP_NAME}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--body)] transition-colors hover:text-[var(--primary)]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href={isAdmin ? "/admin" : "/dashboard"}>
                <Button size="sm">{isAdmin ? "Admin" : "Dashboard"}</Button>
              </Link>
              {!isAdmin && (
                <Link href="/profile">
                  <Button size="sm" variant="ghost">
                    <UserRound className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-[var(--ink)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[var(--body)] transition-colors hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      onClick={() => setOpen(false)}
                    >
                      <Button className="w-full">
                        {isAdmin ? "Admin" : "Dashboard"}
                      </Button>
                    </Link>
                    {!isAdmin && (
                      <Link href="/profile" onClick={() => setOpen(false)}>
                        <Button variant="secondary" className="w-full">
                          Profile
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="secondary" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
