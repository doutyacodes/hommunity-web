"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Shield,
  Users,
  FileText,
  HelpCircle,
  UserCog,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "" },
  { label: "Structure", icon: Building2, href: "/structure" },
  { label: "Security", icon: Shield, href: "/security" },
  { label: "Residents", icon: Users, href: "/residents" },
  { label: "Rules", icon: FileText, href: "/rules" },
  { label: "Questions", icon: HelpCircle, href: "/questions" },
  { label: "Admins", icon: UserCog, href: "/admins" },
];

export function BuildingSidebar({ buildingId, buildingName }: { buildingId: string; buildingName?: string }) {
  const pathname = usePathname();
  const base = `/buildings/${buildingId}`;

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col py-8 px-4 z-50">
      {/* Logo / Building Name */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-[#a4c9ff] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          <span className="text-[#a4c9ff] font-headline font-extrabold text-sm uppercase tracking-widest">
            {buildingName || "Building Console"}
          </span>
        </div>
        <p className="text-[#414751] text-[10px] uppercase tracking-tighter ml-7">Architectural Ledger</p>
      </div>

      {/* Back to buildings */}
      <Link
        href="/buildings"
        className="flex items-center gap-2 px-4 py-2 mb-4 text-[#8b919d] hover:text-[#a4c9ff] transition-colors text-xs font-bold uppercase tracking-wider group"
      >
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        All Buildings
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const href = base + item.href;
          const isActive = item.href === ""
            ? pathname === base
            : pathname.startsWith(href);

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-[#a4c9ff]/12 to-transparent text-[#a4c9ff]"
                  : "text-[#8b919d] hover:text-[#e5e2e1] hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#a4c9ff] rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  isActive ? "text-[#a4c9ff]" : "text-current"
                )}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 space-y-3">
        <div className="px-4 py-3 bg-[#1c1b1b] rounded-xl flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#40e56c] security-pulse shrink-0" />
          <span className="text-[10px] font-bold text-[#40e56c] uppercase tracking-widest">System Live</span>
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1c1b1b] flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-[#a4c9ff]">AR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#e5e2e1] truncate">Admin_Root</p>
            <p className="text-[10px] text-[#8b919d]">Level 4 Clearance</p>
          </div>
          <Link href="/login" className="text-[#8b919d] hover:text-[#ffb4ab] transition-colors">
            <LogOut size={15} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
