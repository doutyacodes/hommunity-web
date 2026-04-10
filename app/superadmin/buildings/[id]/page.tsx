import { ChevronRight, TrendingUp, AlertTriangle, Building2, MapPin, Shield, Users, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { buildings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BuildingDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const buildingRows = await db.select().from(buildings).where(eq(buildings.id, id)).limit(1);
  const building = buildingRows[0];

  if (!building) {
    return notFound();
  }

  const activities = [
    { icon: Shield, title: "Unscheduled Entry", meta: "North Loading Dock • 2 mins ago", action: "Dispatch Security", color: "text-red-600", colorBg: "bg-red-50 border-red-100" },
    { icon: Clock, title: "Water Leak Detected", meta: "Apartment 402B • 14 mins ago", action: "Notify Maintenance", color: "text-blue-600", colorBg: "bg-blue-50 border-blue-100" },
    { icon: Shield, title: "Biometric Update", meta: "System-wide Registry • 45 mins ago", action: "View Report", color: "text-green-600", colorBg: "bg-green-50 border-green-100" },
    { icon: Users, title: "New Resident Request", meta: "Apartment 201C • 1 hr ago", action: "Review Request", color: "text-blue-600", colorBg: "bg-blue-50 border-blue-100" },
  ];

  const floorCards = [
    { floor: "F24", tag: "Penthouse Level", tagColor: "text-green-700", tagBg: "bg-green-50 border-green-200", occupancy: "100%", stat1: { label: "HVAC", value: "Nominal", color: "text-green-600" }, stat2: { label: "Security Gate", value: "Locked", color: "text-blue-600" }, borderColor: "border-green-400" },
    { floor: "F18", tag: "Maintenance", tagColor: "text-red-700", tagBg: "bg-red-50 border-red-200", occupancy: "84%", stat1: { label: "Fire Suppression", value: "Warning", color: "text-red-600" }, stat2: { label: "Elevator", value: "Active", color: "text-slate-900" }, borderColor: "border-red-400", alert: true },
    { floor: "F12", tag: "Residential", tagColor: "text-slate-700", tagBg: "bg-slate-100 border-slate-200", occupancy: "96%", stat1: { label: "Utility Draw", value: "Standard", color: "text-slate-900" }, stat2: { label: "Access Log", value: "28 events", color: "text-slate-900" }, borderColor: "border-slate-300" },
    { floor: "G00", tag: "Lobby Hub", tagColor: "text-blue-700", tagBg: "bg-blue-50 border-blue-200", occupancy: "—", stat1: { label: "Scanner Status", value: "Encrypted", color: "text-green-600" }, stat2: { label: "Staff Present", value: "04", color: "text-slate-900" }, borderColor: "border-blue-400" },
  ];

  const chartBars = [60, 65, 58, 70, 85, 92, 88, 75, 60, 68, 90, 82, 65, 72, 78, 95];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500 text-slate-900 bg-slate-50 min-h-screen">
      {/* Page header */}
      <section className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-2">
            <Link href="/superadmin/buildings" className="hover:text-blue-800 transition-colors">Registry</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-400">Building Overview</span>
          </nav>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 font-headline">
            {building.name}
          </h2>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Node: Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm text-slate-600">
              <MapPin size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[200px]">{building.address}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:shadow">
            <ArrowUpRight size={18} />
            Export Ledger
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all font-headline tracking-wide">
            <Shield size={18} />
            Security Override
          </button>
        </div>
      </section>

      {/* Bento metrics */}
      <section className="grid grid-cols-12 gap-5 mb-8">
        {/* Residents */}
        <div className="col-span-12 border border-slate-200 shadow-sm md:col-span-4 bg-white rounded-3xl p-7 relative overflow-hidden group hover:shadow-md hover:border-slate-300 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Residents</p>
            <h3 className="text-5xl font-black tracking-tight text-slate-900 mb-4 font-headline">
              1,284
            </h3>
            <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1.5 w-max rounded-lg border border-green-100">
              <TrendingUp size={16} />
              <span>+12 this month</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <Users size={180} className="text-slate-900" />
          </div>
        </div>

        {/* Security Staff */}
        <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600">
                <Shield size={20} />
              </div>
              <span className="text-[10px] font-bold border px-2 py-1 rounded-md uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200">On Duty</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Staff</p>
            <h3 className="text-4xl font-black mt-1 text-slate-900 font-headline">
              24<span className="text-lg text-slate-400 font-semibold ml-1">/32</span>
            </h3>
          </div>
          <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[75%]" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-span-12 md:col-span-3 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-amber-600">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold border border-amber-200 text-amber-700 bg-amber-50 px-2 py-1 rounded-md uppercase tracking-wider">Action Required</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-4xl font-black mt-1 text-slate-900 font-headline">
              08
            </h3>
          </div>
          <div className="mt-4 flex -space-x-2">
            {["JD", "SM", "AK", "+5"].map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-12 md:col-span-2 bg-red-50 rounded-3xl p-6 border border-red-200 hover:bg-red-100/60 shadow-sm transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center mb-4 shadow-sm border border-red-100">
                <AlertTriangle size={20} />
              </div>
              <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest">System Alerts</p>
            </div>
            <h3 className="text-5xl font-black text-red-700 font-headline">
              03
            </h3>
          </div>
        </div>
      </section>

      {/* System Health + Activity */}
      <section className="grid grid-cols-12 gap-5 mb-8">
        {/* Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 shadow-sm rounded-3xl p-7 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-1 font-headline">
                System Health Monitor
              </h4>
              <p className="text-xs text-slate-500">Real-time encryption and terminal status</p>
            </div>
            <div className="flex items-center gap-5">
              {[{ color: "bg-blue-500", label: "Encryption" }, { color: "bg-green-500", label: "Uptime" }].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${l.color}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-44 flex items-end gap-1.5 px-1 relative">
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
              {[1, 2, 3, 4].map((r) => (
                <div key={r} className="border-t border-slate-100" />
              ))}
            </div>
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${h}%`,
                  background: h > 80 ? "#22c55e" : "#3b82f6", 
                }}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5">
            {[
              { label: "Signal Strength", value: "98.4%" },
              { label: "Latency", value: "12ms" },
              { label: "Threat Level", value: "MINIMAL", valueColor: "text-green-600" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-xl font-black font-headline ${s.valueColor || "text-slate-900"}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
          <h4 className="text-lg font-bold text-slate-900 mb-1 flex items-center justify-between font-headline">
            Critical Activity
            <span className="text-[9px] border border-blue-200 font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">Live Log</span>
          </h4>
          <p className="text-xs text-slate-500 mb-5">Real-time security events</p>
          <div className="space-y-3 flex-1">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 hover:shadow-sm transition-all group cursor-pointer animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className={`w-10 h-10 border rounded-xl flex items-center justify-center shrink-0 ${a.colorBg} ${a.color}`}
                >
                  <a.icon size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900 mb-0.5">{a.title}</h5>
                  <p className="text-[10px] text-slate-500 mb-1.5">{a.meta}</p>
                  <button className="text-[10px] font-bold text-blue-600 group-hover:underline underline-offset-4">
                    {a.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all uppercase tracking-widest bg-white">
            View Full Command History
          </button>
        </div>
      </section>

      {/* Floor Status */}
      <section className="bg-white border border-slate-200 shadow-sm rounded-3xl p-7 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 font-headline">
              Floor Integrity Status
            </h4>
            <p className="text-sm text-slate-500 mt-1">Cross-sectional analysis of residential block</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {floorCards.map((f, i) => (
            <div
              key={f.floor}
              className={`bg-slate-50/50 rounded-3xl p-6 border border-slate-200 border-l-4 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 cursor-pointer ${f.borderColor}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between items-start mb-5">
                <h5 className="text-3xl font-black text-slate-900 font-headline">
                  {f.floor}
                </h5>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${f.tagBg} ${f.tagColor}`}
                >
                  {f.tag}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 font-medium">Occupancy</span>
                  <span className="font-bold text-slate-900">{f.occupancy}</span>
                </div>
                <div className="flex justify-between text-[11px] border-b border-slate-200/50 pb-2">
                  <span className="text-slate-500 font-medium">{f.stat1.label}</span>
                  <span className={`font-bold ${f.stat1.color}`}>{f.stat1.value}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">{f.stat2.label}</span>
                  <span className={`font-bold ${f.stat2.color}`}>{f.stat2.value}</span>
                </div>
              </div>
              {f.alert && (
                <div className="mt-4 pt-3 border-t border-red-200 flex items-center justify-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg py-1.5">
                  <AlertTriangle size={14} />
                  SECURITY ALERT
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
