import { ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";

const metrics = [
  {
    label: "Total Residents",
    value: "1,284",
    sub: "+12 this month",
    icon: "groups",
    subIcon: TrendingUp,
    subColor: "#40e56c",
    bg: "#1c1b1b",
    span: "col-span-12 md:col-span-4",
  },
  {
    label: "Active Staff",
    value: "24",
    sub: "/ 32 on duty",
    icon: "shield_person",
    badge: "On Duty",
    badgeColor: "#a4c9ff",
    progress: 75,
    progressColor: "#a4c9ff",
    bg: "#1c1b1b",
    span: "col-span-12 md:col-span-3",
  },
  {
    label: "Pending Requests",
    value: "08",
    sub: "Action Required",
    icon: "assignment_late",
    badgeColor: "#40e56c",
    bg: "#1c1b1b",
    span: "col-span-12 md:col-span-3",
  },
  {
    label: "System Alerts",
    value: "03",
    icon: "warning",
    alertMode: true,
    span: "col-span-12 md:col-span-2",
  },
];

const activities = [
  { icon: "door_sensor", title: "Unscheduled Entry", meta: "North Loading Dock • 2 mins ago", action: "Dispatch Security", color: "#ffb4ab", colorBg: "rgba(255,180,171,0.08)" },
  { icon: "leak_add", title: "Water Leak Detected", meta: "Apartment 402B • 14 mins ago", action: "Notify Maintenance", color: "#a4c9ff", colorBg: "rgba(164,201,255,0.08)" },
  { icon: "verified_user", title: "Biometric Update", meta: "System-wide Registry • 45 mins ago", action: "View Report", color: "#40e56c", colorBg: "rgba(64,229,108,0.08)" },
  { icon: "person_add", title: "New Resident Request", meta: "Apartment 201C • 1 hr ago", action: "Review Request", color: "#a4c9ff", colorBg: "rgba(164,201,255,0.08)" },
];

const floorCards = [
  { floor: "F24", tag: "Penthouse Level", tagColor: "#40e56c", occupancy: "100%", stat1: { label: "HVAC", value: "Nominal", color: "#40e56c" }, stat2: { label: "Security Gate", value: "Locked", color: "#a4c9ff" }, borderColor: "#40e56c" },
  { floor: "F18", tag: "Maintenance", tagColor: "#ffb4ab", occupancy: "84%", stat1: { label: "Fire Suppression", value: "Warning", color: "#ffb4ab" }, stat2: { label: "Elevator", value: "Active" }, borderColor: "#ffb4ab", alert: true },
  { floor: "F12", tag: "Residential", tagColor: "#8b919d", occupancy: "96%", stat1: { label: "Utility Draw", value: "Standard" }, stat2: { label: "Access Log", value: "28 events" }, borderColor: "#a4c9ff" },
  { floor: "G00", tag: "Lobby Hub", tagColor: "#40e56c", occupancy: "—", stat1: { label: "Scanner Status", value: "Encrypted", color: "#40e56c" }, stat2: { label: "Staff Present", value: "04" }, borderColor: "#40e56c" },
];

const chartBars = [60, 65, 58, 70, 85, 92, 88, 75, 60, 68, 90, 82, 65, 72, 78, 95];

export default async function BuildingDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Page header */}
      <section className="mb-8 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-[0.2em] mb-2">
            <span>Registry</span>
            <ChevronRight size={10} />
            <span className="text-[#8b919d]">Building Overview</span>
          </nav>
          <h2 className="text-5xl font-black tracking-tighter text-[#e5e2e1] font-headline">
            Dashboard
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#1c1b1b] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#40e56c] security-pulse" />
              <span className="text-[11px] font-bold text-[#c1c7d3] uppercase tracking-wider">Node: Active</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1c1b1b] rounded-full">
              <span className="material-symbols-outlined text-[14px] text-[#a4c9ff]">location_on</span>
              <span className="text-[11px] font-medium text-[#c1c7d3] uppercase tracking-wider">Heights District</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#353534] text-[#e5e2e1] px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export Ledger
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] px-5 py-2.5 rounded-xl font-black text-sm active:scale-95 transition-all shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] font-headline"
          >
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            Security Override
          </button>
        </div>
      </section>

      {/* Bento metrics */}
      <section className="grid grid-cols-12 gap-5 mb-6">
        {/* Residents */}
        <div className="col-span-12 md:col-span-4 bg-[#1c1b1b] rounded-[24px] p-7 relative overflow-hidden group hover:bg-[#201f1f] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative z-10">
            <p className="text-xs font-bold text-[#8b919d] uppercase tracking-widest mb-1">Total Residents</p>
            <h3 className="text-6xl font-black tracking-tighter text-[#e5e2e1] mb-4 font-headline">
              1,284
            </h3>
            <div className="flex items-center gap-2 text-[#40e56c] text-sm font-bold">
              <TrendingUp size={16} />
              <span>+12 this month</span>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[200px]">groups</span>
          </div>
        </div>

        {/* Security Staff */}
        <div className="col-span-12 md:col-span-3 bg-[#1c1b1b] rounded-[24px] p-6 flex flex-col justify-between hover:bg-[#201f1f] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-[#a4c9ff]/10 rounded-2xl text-[#a4c9ff]">
                <span className="material-symbols-outlined">shield_person</span>
              </div>
              <span className="text-[10px] font-bold text-[#a4c9ff] bg-[#a4c9ff]/10 px-2 py-1 rounded uppercase">On Duty</span>
            </div>
            <p className="text-xs font-bold text-[#8b919d] uppercase tracking-widest">Active Staff</p>
            <h3 className="text-4xl font-bold mt-1 font-headline">
              24<span className="text-lg text-[#414751] ml-1">/32</span>
            </h3>
          </div>
          <div className="mt-4 h-1.5 bg-[#131313] rounded-full overflow-hidden">
            <div className="h-full bg-[#a4c9ff] rounded-full w-[75%] shadow-[0_0_10px_rgba(164,201,255,0.5)]" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="col-span-12 md:col-span-3 bg-[#1c1b1b] rounded-[24px] p-6 flex flex-col justify-between hover:bg-[#201f1f] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div className="p-3 bg-[#40e56c]/10 rounded-2xl text-[#40e56c]">
                <span className="material-symbols-outlined">assignment_late</span>
              </div>
              <span className="text-[10px] font-bold text-[#40e56c] bg-[#40e56c]/10 px-2 py-1 rounded uppercase">Action Required</span>
            </div>
            <p className="text-xs font-bold text-[#8b919d] uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-4xl font-bold mt-1 font-headline">
              08
            </h3>
          </div>
          <div className="mt-4 flex -space-x-2">
            {["JD", "SM", "AK", "+5"].map((a, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-[#353534] border-2 border-[#1c1b1b] flex items-center justify-center text-[9px] font-black text-[#c1c7d3]">
                {a}
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-12 md:col-span-2 bg-[#93000a]/20 rounded-[24px] p-6 border border-[#ffb4ab]/10 hover:bg-[#93000a]/25 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#ffb4ab] text-[#690005] flex items-center justify-center mb-4">
                <AlertTriangle size={18} />
              </div>
              <p className="text-xs font-bold text-[#ffb4ab] uppercase tracking-widest">System Alerts</p>
            </div>
            <h3 className="text-5xl font-black text-[#ffb4ab] font-headline">
              03
            </h3>
          </div>
        </div>
      </section>

      {/* System Health + Activity */}
      <section className="grid grid-cols-12 gap-5 mb-6">
        {/* Chart */}
        <div className="col-span-12 lg:col-span-8 bg-[#1c1b1b] rounded-[24px] p-7 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex justify-between items-center mb-7">
            <div>
              <h4 className="text-lg font-bold text-[#e5e2e1] mb-1 font-headline">
                System Health Monitor
              </h4>
              <p className="text-xs text-[#8b919d]">Real-time encryption and terminal status</p>
            </div>
            <div className="flex items-center gap-5">
              {[{ color: "#a4c9ff", label: "Encryption" }, { color: "#40e56c", label: "Uptime" }].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-44 flex items-end gap-1.5 px-1 relative">
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
              {[1, 2, 3, 4].map((r) => (
                <div key={r} className="border-t border-white/[0.04]" />
              ))}
            </div>
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-90"
                style={{
                  height: `${h}%`,
                  background: h > 80
                    ? `linear-gradient(to top, rgba(64,229,108,0.1), rgba(64,229,108,0.4))`
                    : `linear-gradient(to top, rgba(164,201,255,0.1), rgba(164,201,255,0.4))`,
                  boxShadow: h > 80 ? "0 0 12px rgba(64,229,108,0.2)" : "none",
                }}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-5">
            {[
              { label: "Signal Strength", value: "98.4%" },
              { label: "Latency", value: "12ms" },
              { label: "Threat Level", value: "MINIMAL", valueColor: "#40e56c" },
            ].map((s) => (
              <div key={s.label} className="bg-[#131313] p-4 rounded-2xl">
                <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xl font-bold font-headline" style={{ color: s.valueColor || "#e5e2e1" }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="col-span-12 lg:col-span-4 bg-[#1c1b1b] rounded-[24px] p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 delay-250">
          <h4 className="text-lg font-bold text-[#e5e2e1] mb-1 flex items-center justify-between font-headline">
            Critical Activity
            <span className="text-[10px] font-bold text-[#a4c9ff] bg-[#a4c9ff]/10 px-2 py-1 rounded uppercase tracking-wider">Live Log</span>
          </h4>
          <p className="text-xs text-[#8b919d] mb-5">Real-time security events</p>
          <div className="space-y-3 flex-1">
            {activities.map((a, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 rounded-2xl bg-[#131313] hover:bg-[#201f1f] transition-colors group cursor-pointer animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: a.colorBg, color: a.color }}
                >
                  <span className="material-symbols-outlined text-[18px]">{a.icon}</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#e5e2e1] mb-0.5">{a.title}</h5>
                  <p className="text-[10px] text-[#8b919d] mb-1.5">{a.meta}</p>
                  <button className="text-[10px] font-bold text-[#a4c9ff] group-hover:underline underline-offset-3">
                    {a.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full py-3 border border-white/5 rounded-xl text-xs font-bold text-[#8b919d] hover:text-[#e5e2e1] hover:bg-white/5 transition-all uppercase tracking-widest">
            View Full Command History
          </button>
        </div>
      </section>

      {/* Floor Status */}
      <section className="bg-[#1c1b1b] rounded-[24px] p-7 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h4 className="text-2xl font-bold tracking-tight text-[#e5e2e1] font-headline">
              Floor Integrity Status
            </h4>
            <p className="text-sm text-[#8b919d] mt-1">Cross-sectional analysis of residential block</p>
          </div>
          <div className="flex gap-2">
            {["grid_view", "view_list"].map((icon) => (
              <button key={icon} className="w-9 h-9 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#8b919d] hover:text-[#a4c9ff] transition-all">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {floorCards.map((f, i) => (
            <div
              key={f.floor}
              className="bg-[#131313] rounded-3xl p-5 border-l-4 hover:bg-[#1c1b1b] transition-all duration-200 hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
              style={{ borderLeftColor: `${f.borderColor}60`, animationDelay: `${i * 80}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h5 className="text-3xl font-black text-[#e5e2e1] font-headline">
                  {f.floor}
                </h5>
                <span
                  className="text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded"
                  style={{ color: f.tagColor, backgroundColor: `${f.tagColor}15` }}
                >
                  {f.tag}
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#8b919d]">Occupancy</span>
                  <span className="font-bold text-[#e5e2e1]">{f.occupancy}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#8b919d]">{f.stat1.label}</span>
                  <span className="font-bold" style={{ color: f.stat1.color || "#e5e2e1" }}>{f.stat1.value}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#8b919d]">{f.stat2.label}</span>
                  <span className="font-bold" style={{ color: f.stat2.color || "#e5e2e1" }}>{f.stat2.value}</span>
                </div>
              </div>
              {f.alert && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-[#ffb4ab]">
                  <AlertTriangle size={11} />
                  Attention Required
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
