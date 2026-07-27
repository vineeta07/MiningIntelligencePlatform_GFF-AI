"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Gem,
  Activity,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Operations Command Centre",
  },
  {
    label: "Rock Classification",
    href: "/classify",
    icon: Gem,
    description: "AI Image Analysis",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: Activity,
    description: "Trends & Reports",
  },
  {
    label: "Documentation",
    href: "/docs",
    icon: FileText,
    description: "System Documentation",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(255, 248, 240, 0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
              style={{ background: "var(--color-crimson)" }}
            >
              <Gem className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div
                className="text-base font-bold tracking-tight leading-none"
                style={{ color: "var(--color-text-primary)" }}
              >
                MIP
              </div>
              <div
                className="text-[11px] font-semibold tracking-wider uppercase mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                Mining Intelligence Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className="relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{
                      color: isActive
                        ? "var(--color-crimson)"
                        : "var(--color-text-secondary)",
                      background: isActive
                        ? "rgba(193, 18, 31, 0.06)"
                        : "transparent",
                    }}
                    whileHover={{
                      backgroundColor: isActive
                        ? "rgba(193, 18, 31, 0.08)"
                        : "rgba(61, 28, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                        style={{ background: "var(--color-crimson)" }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(96, 108, 56, 0.1)", color: "var(--color-olive)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              System Online
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: "var(--color-text-primary)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="pt-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium"
                      style={{
                        color: isActive
                          ? "var(--color-crimson)"
                          : "var(--color-text-secondary)",
                        background: isActive
                          ? "rgba(193, 18, 31, 0.06)"
                          : "transparent",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <div>
                        <div>{item.label}</div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
