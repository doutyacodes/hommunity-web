"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, MapPin, Users, Shield, Plus, Search,
  LayoutGrid, List, ChevronRight, TrendingUp,
  Bell, Settings, LogOut
} from "lucide-react";

const buildings = [
  {
    id: "1",
    name: "Maple Heights",
    address: "123 Oak Street, Heights District",
    units: 320,
    residents: 1284,
    admins: 2,
    gates: 3,
    status: "active",
    occupancy: 94,
    color: "#a4c9ff",
  },
  {
    id: "2",
    name: "Crystal Tower",
    address: "456 Crystal Ave, Downtown Core",
    units: 180,
    residents: 543,
    admins: 1,
    gates: 2,
    status: "active",
    occupancy: 88,
    color: "#40e56c",
  },
  {
    id: "3",
    name: "Sunrise Complex",
    address: "789 Sunrise Blvd, East Sector",
    units: 250,
    residents: 892,
    admins: 3,
    gates: 4,
    status: "active",
    occupancy: 97,
    color: "#c8c6c5",
  },
  {
    id: "4",
    name: "Harbor View",
    address: "22 Harbor Lane, Marina District",
    units: 140,
    residents: 0,
    admins: 0,
    gates: 0,
    status: "setup",
    occupancy: 0,
    color: "#4d93e5",
  },
];

const stats = [
  { label: "Total Buildings", value: "4", icon: Building2, color: "#a4c9ff" },
  { label: "Total Residents", value: "2,719", icon: Users, color: "#40e56c" },
  { label: "Total Units", value: "890", icon: LayoutGrid, color: "#c8c6c5" },
  { label: "Active Admins", value: "6", icon: Shield, color: "#4d93e5" },
];

export default function BuildingsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const filtered = buildings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#131313]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#131313]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span
              className="material-symbols-outlined text-[#a4c9ff] text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
            <div>
              <h1
                className="text-base font-black tracking-tighter text-[#a4c9ff] leading-none font-headline"
              >
                Hommunity
              </h1>
              <p className="text-[9px] text-[#414751] uppercase tracking-widest font-bold">Super Admin Console</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b919d] w-3.5 h-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buildings..."
              className="bg-[#353534] border-0 rounded-lg pl-9 pr-4 py-2 text-sm text-[#e5e2e1] placeholder:text-[#8b919d]/60 focus:ring-1 focus:ring-[#a4c9ff]/40 outline-none w-56 transition-all"
            />
          </div>
          <button className="p-2 text-[#8b919d] hover:bg-white/5 rounded-lg transition-colors">
            <Bell size={18} />
          </button>
          <button className="p-2 text-[#8b919d] hover:bg-white/5 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
          <div className="h-7 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#353534] flex items-center justify-center">
              <span className="text-[11px] font-black text-[#a4c9ff]">SA</span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-[#e5e2e1]">Super_Admin</p>
              <p className="text-[10px] text-[#8b919d]">Root Access</p>
            </div>
          </div>
          <Link href="/login" className="p-2 text-[#8b919d] hover:text-[#ffb4ab] transition-colors">
            <LogOut size={16} />
          </Link>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        {/* Page title */}
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-3">
            <span>Registry</span>
            <ChevronRight size={10} />
            <span className="text-[#8b919d]">Building Directory</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h2
                className="text-5xl font-black tracking-tighter text-[#e5e2e1] font-headline"
              >
                Building Registry
              </h2>
              <p className="text-[#8b919d] mt-1">Manage all apartment complexes and their configurations.</p>
            </div>
            <Link
              href="/buildings/new"
              className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-6 py-3 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.35)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.45)] active:scale-95 transition-all duration-200 uppercase tracking-wider font-headline"
            >
              <Plus size={16} />
              New Building
            </Link>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-[#1c1b1b] rounded-2xl p-5 flex items-center gap-4 hover:bg-[#201f1f] transition-colors group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{stat.label}</p>
                <p
                  className="text-2xl font-black text-[#e5e2e1] leading-tight font-headline"
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* View toggle + count */}
        <div className="flex items-center justify-between mb-5 animate-in fade-in duration-500 delay-200">
          <p className="text-sm text-[#8b919d]">
            <span className="text-[#e5e2e1] font-bold">{filtered.length}</span> buildings found
          </p>
          <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-lg">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={[
                  "p-2 rounded-md transition-all",
                  view === v ? "bg-[#353534] text-[#a4c9ff]" : "text-[#8b919d] hover:text-[#c1c7d3]",
                ].join(" ")}
              >
                {v === "grid" ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </div>

        {/* Buildings */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 animate-in fade-in duration-500">
            {filtered.map((b, i) => (
              <Link
                key={b.id}
                href={`/buildings/${b.id}`}
                className="group bg-[#1c1b1b] rounded-3xl p-7 hover:bg-[#201f1f] hover:scale-[1.01] transition-all duration-200 cursor-pointer relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Color accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
                  style={{ background: `linear-gradient(90deg, ${b.color}, transparent)` }}
                />

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={[
                          "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded",
                          b.status === "active"
                            ? "bg-[#40e56c]/10 text-[#40e56c]"
                            : "bg-[#a4c9ff]/10 text-[#a4c9ff]",
                        ].join(" ")}
                      >
                        {b.status === "active" ? "● Active" : "◎ Setup"}
                      </span>
                    </div>
                    <h3
                      className="text-2xl font-black tracking-tighter text-[#e5e2e1] group-hover:text-[#a4c9ff] transition-colors font-headline"
                    >
                      {b.name}
                    </h3>
                  </div>
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${b.color}12` }}
                  >
                    <Building2 size={20} style={{ color: b.color }} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[#8b919d] mb-5">
                  <MapPin size={12} />
                  <span className="text-xs">{b.address}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Units", value: b.units },
                    { label: "Residents", value: b.residents.toLocaleString() },
                    { label: "Admins", value: b.admins },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#131313] rounded-xl p-3 text-center">
                      <p
                        className="text-lg font-black text-[#e5e2e1] font-headline"
                      >
                        {s.value}
                      </p>
                      <p className="text-[10px] text-[#8b919d] uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>

                {b.status === "active" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#8b919d]">Occupancy</span>
                      <span className="font-bold text-[#e5e2e1]">{b.occupancy}%</span>
                    </div>
                    <div className="h-1.5 bg-[#131313] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${b.occupancy}%`,
                          backgroundColor: b.color,
                          boxShadow: `0 0 8px ${b.color}66`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-end">
                  <span className="text-[11px] font-bold text-[#a4c9ff] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Console <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2 animate-in fade-in duration-300">
            {filtered.map((b, i) => (
              <Link
                key={b.id}
                href={`/buildings/${b.id}`}
                className="group flex items-center gap-5 bg-[#1c1b1b] rounded-2xl p-5 hover:bg-[#201f1f] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${b.color}15` }}
                >
                  <Building2 size={18} style={{ color: b.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#e5e2e1] group-hover:text-[#a4c9ff] transition-colors">
                      {b.name}
                    </h3>
                    <span
                      className={[
                        "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                        b.status === "active" ? "bg-[#40e56c]/10 text-[#40e56c]" : "bg-[#a4c9ff]/10 text-[#a4c9ff]",
                      ].join(" ")}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#8b919d] flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {b.address}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-center">
                  {[
                    { l: "Units", v: b.units },
                    { l: "Residents", v: b.residents },
                    { l: "Admins", v: b.admins },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="text-sm font-bold text-[#e5e2e1]">{s.v}</p>
                      <p className="text-[10px] text-[#8b919d] uppercase">{s.l}</p>
                    </div>
                  ))}
                </div>
                <ChevronRight size={16} className="text-[#8b919d] group-hover:text-[#a4c9ff] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
