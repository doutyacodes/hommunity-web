"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  ShieldCheck,
  Wallet,
  Bell,
  LineChart,
  DoorOpen,
  MessageSquare,
  Package,
  Wrench,
  Layers,
  ArrowUpRight,
  Zap,
  Globe,
  Lock,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import React from "react";
import Link from "next/link";

// ─── Scroll Progress Bar ─────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #6366f1, #22d3ee)",
      }}
    />
  );
};

// ─── Noise Texture Overlay ────────────────────────────────────────────────────
const Noise = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[200] opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px 128px",
    }}
  />
);

// ─── Animated Grid Background ─────────────────────────────────────────────────
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3 bg-[#080b12]/90 backdrop-blur-xl border-b border-white/5" : "py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg opacity-80 blur-[4px]" />
            <div className="relative w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
          </div>
          <span
            className="text-lg font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Hommunity
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["TenMan", "Hommunity Gate", "Features"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(" ", "-")}`}
              className="text-sm text-white/40 hover:text-white/90 transition-colors tracking-wide"
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "11px", letterSpacing: "0.08em" }}
            >
              {link.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/50" style={{ fontFamily: "var(--font-dm-mono)" }}>
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden bg-[#080b12]">
      <GridBackground />

      {/* Ambient blobs */}
      <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/8"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span
            className="text-[11px] tracking-[0.15em] text-indigo-300/80 uppercase"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            Unified Property Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.2rem,8vw,6rem)] font-black leading-[0.95] tracking-[-0.03em] text-white mb-6"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Two dashboards.{" "}
          <br />
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
            }}
          >
            One ecosystem.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-white/40 text-lg max-w-xl mx-auto leading-relaxed mb-14"
        >
          Hommunity powers two distinct platforms — built for landlords and for gated communities — with a shared enterprise backbone.
        </motion.p>

        {/* DUAL PORTAL CARDS ─ the main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          <PortalCard
            label="TenMan"
            tag="Property Management"
            description="Full control over leases, rent, tenants, and multi-property portfolios."
            accent="#6366f1"
            accentMuted="rgba(99,102,241,0.12)"
            accentBorder="rgba(99,102,241,0.25)"
            href="https://gatewise.vercel.app/login"
            icon={Building2}
          />
          <PortalCard
            label="Hommunity"
            tag="Gate & Community"
            description="Secure access control, visitor logs, and resident communications."
            accent="#22d3ee"
            accentMuted="rgba(34,211,238,0.08)"
            accentBorder="rgba(34,211,238,0.2)"
            href="/login"
            icon={ShieldCheck}
          />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] text-white/25 uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
};

// ─── Portal Card ──────────────────────────────────────────────────────────────
interface PortalCardProps {
  label: string;
  tag: string;
  description: string;
  accent: string;
  accentMuted: string;
  accentBorder: string;
  href: string;
  icon: React.ElementType;
}

const PortalCard = ({ label, tag, description, accent, accentMuted, accentBorder, href, icon: Icon }: PortalCardProps) => {
  const [hovered, setHovered] = useState(false);
  const isExternal = href.startsWith("http");

  const Content = (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.015, y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative group flex flex-col h-full items-start text-left p-6 sm:p-7 rounded-2xl border overflow-hidden cursor-pointer"
      style={{
        background: hovered ? accentMuted : "rgba(255,255,255,0.03)",
        borderColor: hovered ? accentBorder : "rgba(255,255,255,0.07)",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      {/* Glow corner */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(circle at top right, ${accent}30, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ background: accentMuted, border: `1px solid ${accentBorder}` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>

      {/* Tag */}
      <span
        className="text-[10px] tracking-[0.15em] uppercase mb-2 font-medium"
        style={{ fontFamily: "var(--font-dm-mono)", color: `${accent}cc` }}
      >
        {tag}
      </span>

      {/* Label */}
      <h3
        className="text-2xl font-black tracking-tight text-white mb-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {label}
      </h3>

      <p className="text-sm text-white/40 leading-relaxed mb-6 flex-1">{description}</p>

      {/* CTA */}
      <div className="flex items-center gap-2 group/cta">
        <span
          className="text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors duration-200"
          style={{ color: hovered ? accent : "rgba(255,255,255,0.35)", fontFamily: "var(--font-dm-mono)" }}
        >
          Enter Dashboard
        </span>
        <ArrowUpRight
          className="w-3.5 h-3.5 transition-all duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
          style={{ color: hovered ? accent : "rgba(255,255,255,0.25)" }}
        />
      </div>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {Content}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full">
      {Content}
    </Link>
  );
};

// ─── Section Divider ──────────────────────────────────────────────────────────
const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 mb-12">
    <div className="w-6 h-px bg-white/20" />
    <span
      className="text-[10px] tracking-[0.2em] text-white/25 uppercase"
      style={{ fontFamily: "var(--font-dm-mono)" }}
    >
      {text}
    </span>
  </div>
);

// ─── Feature Pill ─────────────────────────────────────────────────────────────
const FeaturePill = ({
  icon: Icon,
  title,
  delay,
  accent = "#6366f1",
}: {
  icon: React.ElementType;
  title: string;
  delay: number;
  accent?: string;
  key?: React.Key;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -2 }}
    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/6 bg-white/3 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group cursor-default"
  >
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
    </div>
    <span className="text-sm text-white/60 font-medium group-hover:text-white/80 transition-colors">{title}</span>
  </motion.div>
);

// ─── TenMan Section ───────────────────────────────────────────────────────────
const TenManSection = () => {
  const features = [
    { icon: Users, title: "Tenant & Lease Management" },
    { icon: Building2, title: "Multi-Property Units" },
    { icon: Wallet, title: "Rent & Payment Tracking" },
    { icon: LineChart, title: "Reports & Analytics" },
    { icon: Bell, title: "Automated Reminders" },
    { icon: Globe, title: "Web + Mobile Sync" },
  ];

  return (
    <section id="tenman" className="relative py-32 bg-[#080b12] overflow-hidden">
      <GridBackground />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionLabel text="01 — TenMan Platform" />

            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.0] tracking-tight text-white mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Command your
              <br />
              <span className="text-indigo-400">property portfolio.</span>
            </h2>

            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-md">
              A precision-built admin console for landlords managing multi-unit buildings, tracking leases, and monitoring revenue — all in one place.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-10">
              {features.map((f, i) => (
                <FeaturePill key={i} icon={f.icon} title={f.title} delay={i * 0.06} accent="#6366f1" />
              ))}
            </div>

            <motion.a
              href="https://gatewise.vercel.app/login"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-sm font-semibold text-indigo-400 tracking-wide">Open TenMan</span>
              <div className="w-7 h-7 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-500/25 group-hover:border-indigo-500/50">
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </motion.a>
          </motion.div>

          {/* Right: Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-indigo-500/8 rounded-3xl blur-[60px]" />
            <div className="relative rounded-2xl border border-white/8 bg-[#0d1119] overflow-hidden shadow-2xl">
              {/* Window bar */}
              <div className="h-10 bg-[#0a0e16] border-b border-white/5 flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.6 }} />
                  ))}
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5">
                  <Lock className="w-2.5 h-2.5 text-white/30" />
                  <span className="text-[10px] text-white/30" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    gatewise.vercel.app/dashboard
                  </span>
                </div>
              </div>

              {/* Dashboard body */}
              <div className="flex h-[360px]">
                {/* Sidebar */}
                <div className="w-44 border-r border-white/5 bg-[#080b12] p-4 space-y-1">
                  <div className="h-6 w-20 bg-white/5 rounded mb-4" />
                  {[80, 60, 75, 50, 65].map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                      style={{ background: i === 0 ? "rgba(99,102,241,0.12)" : "transparent" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i === 0 ? "#6366f1" : "rgba(255,255,255,0.15)" }}
                      />
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${w}%`, background: i === 0 ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-5 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Revenue", value: "₹4.2L", color: "#6366f1", up: "+12%" },
                      { label: "Tenants", value: "148", color: "#22d3ee", up: "+3" },
                      { label: "Overdue", value: "7", color: "#f59e0b", up: "" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/3 border border-white/5 rounded-xl p-3">
                        <div className="text-[9px] text-white/30 mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                          {s.label}
                        </div>
                        <div className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                          {s.value}
                        </div>
                        {s.up && (
                          <div className="text-[9px] text-emerald-400 mt-0.5">{s.up} this month</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white/3 border border-white/5 rounded-xl p-4 h-[120px] relative overflow-hidden">
                    <div className="text-[9px] text-white/25 mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      Monthly Revenue
                    </div>
                    <div className="flex items-end gap-1.5 h-[72px]">
                      {[45, 68, 52, 88, 62, 94, 71, 83, 60, 96, 74, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 11
                              ? "linear-gradient(to top, #6366f1, #818cf8)"
                              : "rgba(99,102,241,0.2)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tenants list */}
                  <div className="space-y-1.5">
                    {[
                      { unit: "Unit A-402", status: "Paid", amount: "₹12,000" },
                      { unit: "Unit B-201", status: "Pending", amount: "₹8,500" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/2 border border-white/4 rounded-lg">
                        <div className="text-[11px] text-white/50">{row.unit}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/60">{row.amount}</span>
                          <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
                            style={{
                              background: row.status === "Paid" ? "rgba(52,211,153,0.12)" : "rgba(251,191,36,0.12)",
                              color: row.status === "Paid" ? "#34d399" : "#fbbf24",
                            }}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Hommunity Section ────────────────────────────────────────────────────────
const HommunitySection = () => {
  const features = [
    { icon: DoorOpen, title: "Visitor Management" },
    { icon: ShieldCheck, title: "Resident Directory" },
    { icon: MessageSquare, title: "Notices & Alerts" },
    { icon: Wrench, title: "Complaint Tracker" },
    { icon: Package, title: "Delivery Handling" },
    { icon: Users, title: "Staff Scheduling" },
  ];

  return (
    <section id="hommunity-gate" className="relative py-32 bg-[#080b12] overflow-hidden border-t border-white/4">
      <GridBackground />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-cyan-500/5 rounded-3xl blur-[60px]" />

            {/* Phone frame */}
            <div className="relative w-64 rounded-[2.5rem] border-[6px] border-[#1a1f2e] bg-[#0d1119] shadow-2xl">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#1a1f2e] rounded-b-2xl z-10" />

              <div className="rounded-[2rem] overflow-hidden pt-8 pb-4 px-4 min-h-[520px] bg-[#080b12] border border-white/5">
                {/* App header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div
                      className="text-base font-black text-white"
                      style={{ fontFamily: "var(--font-outfit)" }}
                    >
                      Hello, Admin
                    </div>
                    <div className="text-[10px] text-white/30 mt-0.5" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      OAKWOOD COMMUNITY
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>

                {/* QR Gate Pass */}
                <div className="bg-white/4 border border-white/8 rounded-2xl p-4 mb-4 flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=hommunity-gate-pass-001"
                      alt="QR"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white mb-0.5">Gate Pass</div>
                    <div className="text-[10px] text-white/35" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      MAIN ENTRANCE • ACTIVE
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: DoorOpen, label: "Entry", color: "#22d3ee" },
                    { icon: Package, label: "Parcel", color: "#6366f1" },
                    { icon: Users, label: "Guest", color: "#a78bfa" },
                    { icon: Wrench, label: "Issue", color: "#f59e0b" },
                  ].map(({ icon: Icon, label, color }, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="text-[9px] text-white/35">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Visitor log */}
                <div className="bg-white/3 border border-white/5 rounded-xl p-3 mb-3">
                  <div
                    className="text-[9px] text-white/25 uppercase tracking-wider mb-2.5"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    Today's Visitors
                  </div>
                  {[
                    { name: "Arjun Menon", time: "10:32 AM", status: "In" },
                    { name: "Delivery — Delhivery", time: "09:15 AM", status: "Out" },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/4 last:border-0">
                      <div>
                        <div className="text-[11px] text-white/60">{v.name}</div>
                        <div className="text-[9px] text-white/25">{v.time}</div>
                      </div>
                      <span
                        className="text-[9px] px-2 py-0.5 rounded-full"
                        style={{
                          background: v.status === "In" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.06)",
                          color: v.status === "In" ? "#34d399" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Notice */}
                <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20">
                  <div className="w-1 h-full min-h-[24px] rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-amber-300">Water Supply Cut</div>
                    <div className="text-[9px] text-amber-400/60 mt-0.5">Tomorrow 10 AM – 2 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <SectionLabel text="02 — Hommunity Gate" />

            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.0] tracking-tight text-white mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Secure the gate.
              <br />
              <span className="text-cyan-400">Serve the residents.</span>
            </h2>

            <p className="text-white/40 text-base leading-relaxed mb-10 max-w-md">
              A smart digital layer for gated communities — from visitor pre-approvals to maintenance tickets, all managed through one admin interface.
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-10">
              {features.map((f, i) => (
                <FeaturePill key={i} icon={f.icon} title={f.title} delay={i * 0.06} accent="#22d3ee" />
              ))}
            </div>

            <motion.a
              href="/login"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-sm font-semibold text-cyan-400 tracking-wide">Open Hommunity</span>
              <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-500/25 group-hover:border-cyan-500/50">
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Shared Infra Section ─────────────────────────────────────────────────────
const SharedSection = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Role-Based Auth",
      desc: "Admins, Owners, Tenants, Guards — strict permission layers so everyone sees exactly what they need.",
      accent: "#6366f1",
      span: "md:col-span-2",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      desc: "Push notifications for rent reminders, visitor arrivals, and emergency broadcasts.",
      accent: "#22d3ee",
      span: "md:col-span-1",
    },
    {
      icon: Globe,
      title: "Mobile + Web",
      desc: "Real-time sync between Expo mobile app and web admin dashboard.",
      accent: "#a78bfa",
      span: "md:col-span-1",
    },
    {
      icon: Layers,
      title: "Multi-Property Scale",
      desc: "One account. Dozens of properties. No account switching, ever.",
      accent: "#34d399",
      span: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-[#080b12] border-t border-white/4 overflow-hidden">
      <GridBackground />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SectionLabel text="03 — Shared Infrastructure" />
          <h2
            className="text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            One core.{" "}
            <span className="text-white/25">Two platforms.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`${p.span} relative rounded-2xl border border-white/6 bg-white/2 p-7 overflow-hidden group hover:border-white/10 transition-all duration-400 cursor-default`}
            >
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top left, ${p.accent}10, transparent 60%)` }}
              />

              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}
              >
                <p.icon className="w-4.5 h-4.5" style={{ color: p.accent }} />
              </div>

              <h3
                className="text-lg font-black text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {p.title}
              </h3>
              <p className="text-sm text-white/35 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Footer ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="relative py-12 bg-[#080b12] border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between flex-col md:flex-row gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-md flex items-center justify-center">
          <Layers className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-bold text-white/60" style={{ fontFamily: "var(--font-outfit)" }}>
          Hommunity
        </span>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="https://gatewise.vercel.app/login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-white/25 hover:text-indigo-400 transition-colors tracking-wider uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          TenMan →
        </a>
        <Link
          href="/login"
          className="text-[11px] text-white/25 hover:text-cyan-400 transition-colors tracking-wider uppercase"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          Hommunity →
        </Link>
      </div>

      <span className="text-[11px] text-white/20" style={{ fontFamily: "var(--font-dm-mono)" }}>
        © {new Date().getFullYear()} HOMMUNITY
      </span>
    </div>
  </footer>
);

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div
      className="min-h-screen bg-[#080b12] text-white antialiased"
      style={{ scrollBehavior: "smooth" }}
    >
      <Noise />
      <ScrollProgress />
      <Navbar />

      <main>
        <Hero />
        <TenManSection />
        <HommunitySection />
        <SharedSection />
      </main>

      <Footer />
    </div>
  );
}
