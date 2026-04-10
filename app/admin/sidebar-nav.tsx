"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Building2, Layers, Key } from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Infrastructure", icon: Building2 },
    { href: "/admin/residents", label: "Residents", icon: Layers },
    { href: "/admin/gates", label: "Gates & Security", icon: Key },
  ];

  return (
    <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href) && 
          (link.href !== "/admin" || pathname === "/admin");
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group ${
              isActive
                ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-sm"
                : "hover:bg-slate-50 text-slate-600 font-bold hover:text-slate-900 border border-transparent shadow-none hover:shadow-sm"
            }`}
          >
            <Icon
              size={18}
              className={`${
                isActive ? "text-indigo-600" : "text-slate-400"
              } group-hover:scale-110 transition-all`}
            />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
