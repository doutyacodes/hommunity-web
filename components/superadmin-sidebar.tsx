"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Users, 
  Shield, 
  Settings, 
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Bell
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
  { name: "Building Registry", href: "/superadmin/buildings", icon: Building2 },
  { name: "System Admins", href: "/superadmin/admins", icon: Users },
  { name: "Global Rules", href: "/superadmin/rules", icon: Shield },
  { name: "Settings", href: "/superadmin/settings", icon: Settings },
];

export function SuperadminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-blue-600 text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            domain
          </span>
          <span className="font-headline font-black text-slate-900">Hommunity</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0 pt-16" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="hidden lg:flex items-center gap-3 px-8 py-8">
          <span
            className="material-symbols-outlined text-blue-600 text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            domain
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 font-headline leading-none">
              Hommunity
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Super Admin Console</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Core Platform</p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href) && 
                (item.href !== "/superadmin" || pathname === "/superadmin");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group
                    ${isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <item.icon 
                    size={20} 
                    className={isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                <span className="text-sm font-black text-blue-700">SA</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">System Admin</p>
                <p className="text-[11px] text-slate-500">Root Access</p>
              </div>
            </div>
            <Link href="/login" className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors">
              <LogOut size={18} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
