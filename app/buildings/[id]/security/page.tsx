"use client";

import { useState } from "react";
import { ChevronRight, Plus, Shield, DoorOpen, X, Check, Clock } from "lucide-react";

type Tab = "gates" | "staff";

const gates = [
  { id: "g1", name: "Main Gate", location: "North Entrance", staff: 4, status: "active", type: "primary" },
  { id: "g2", name: "Service Gate", location: "South Entrance", staff: 2, status: "active", type: "service" },
  { id: "g3", name: "Emergency Exit B", location: "West Wing", staff: 0, status: "locked", type: "emergency" },
  { id: "g4", name: "Parking Gate", location: "Underground Level 1", staff: 1, status: "active", type: "vehicle" },
];

const staff = [
  { id: "s1", name: "Hassan Ali", badge: "SEC-001", gate: "Main Gate", shift: "Morning (06:00–14:00)", status: "on-duty", phone: "+1 555-0101" },
  { id: "s2", name: "Nina Okafor", badge: "SEC-002", gate: "Main Gate", shift: "Evening (14:00–22:00)", status: "off-duty", phone: "+1 555-0102" },
  { id: "s3", name: "Carlos Ramos", badge: "SEC-003", gate: "Service Gate", shift: "Morning (06:00–14:00)", status: "on-duty", phone: "+1 555-0103" },
  { id: "s4", name: "Yuki Tanaka", badge: "SEC-004", gate: "Service Gate", shift: "Night (22:00–06:00)", status: "off-duty", phone: "+1 555-0104" },
  { id: "s5", name: "Omar Shaikh", badge: "SEC-005", gate: "Parking Gate", shift: "Morning (06:00–14:00)", status: "on-duty", phone: "+1 555-0105" },
  { id: "s6", name: "Elena Volkov", badge: "SEC-006", gate: "Main Gate", shift: "Night (22:00–06:00)", status: "off-duty", phone: "+1 555-0106" },
];

const shifts = ["Morning (06:00–14:00)", "Evening (14:00–22:00)", "Night (22:00–06:00)", "Full Day (08:00–18:00)"];

export default function SecurityPage() {
  const [tab, setTab] = useState<Tab>("gates");
  const [modal, setModal] = useState<"gate" | "staff" | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<typeof staff[0] | null>(null);
  const [assignModal, setAssignModal] = useState(false);

  const gateTypeColor: Record<string, string> = {
    primary: "#a4c9ff",
    service: "#40e56c",
    emergency: "#ffb4ab",
    vehicle: "#c8c6c5",
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Security Hub</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Security Hub
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Manage gates, security personnel, and shift assignments.</p>
          </div>
          <button
            onClick={() => setModal(tab === "gates" ? "gate" : "staff")}
            className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all font-headline"
          >
            <Plus size={15} />
            Add {tab === "gates" ? "Gate" : "Staff"}
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Gates", value: gates.length, color: "#a4c9ff", icon: "door_open" },
          { label: "Active Gates", value: gates.filter(g => g.status === "active").length, color: "#40e56c", icon: "lock_open" },
          { label: "Security Staff", value: staff.length, color: "#c8c6c5", icon: "badge" },
          { label: "On Duty Now", value: staff.filter(s => s.status === "on-duty").length, color: "#40e56c", icon: "shield_person" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-[#1c1b1b] rounded-2xl p-5 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
              <span className="material-symbols-outlined text-[18px]" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{s.label}</p>
              <p className="text-2xl font-black font-headline" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-xl w-fit mb-7">
        {([
          { id: "gates", label: "Gates", icon: DoorOpen },
          { id: "staff", label: "Security Staff", icon: Shield },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              tab === t.id ? "bg-[#353534] text-[#a4c9ff]" : "text-[#8b919d] hover:text-[#c1c7d3]",
            ].join(" ")}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "gates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
          {gates.map((gate, i) => (
            <div
              key={gate.id}
              className="bg-[#1c1b1b] rounded-3xl p-6 hover:bg-[#201f1f] hover:scale-[1.01] transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${gateTypeColor[gate.type]}15` }}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ color: gateTypeColor[gate.type] }}>
                      {gate.type === "emergency" ? "emergency_home" : gate.type === "vehicle" ? "directions_car" : "door_front"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#e5e2e1] font-headline">{gate.name}</h3>
                    <p className="text-xs text-[#8b919d]">{gate.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      color: gate.status === "active" ? "#40e56c" : "#ffb4ab",
                      backgroundColor: gate.status === "active" ? "rgba(64,229,108,0.1)" : "rgba(255,180,171,0.1)",
                    }}
                  >
                    {gate.status === "active" ? "● Active" : "○ Locked"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[#131313] rounded-xl p-3">
                  <p className="text-[10px] text-[#8b919d] uppercase tracking-wide">Staff Assigned</p>
                  <p
                    className="text-2xl font-black mt-0.5 font-headline"
                    style={{ color: gateTypeColor[gate.type] }}
                  >
                    {gate.staff}
                  </p>
                </div>
                <div className="bg-[#131313] rounded-xl p-3">
                  <p className="text-[10px] text-[#8b919d] uppercase tracking-wide">Type</p>
                  <p
                    className="text-sm font-bold mt-1 capitalize"
                    style={{ color: gateTypeColor[gate.type] }}
                  >
                    {gate.type}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 py-2 text-[11px] font-bold text-[#a4c9ff] bg-[#a4c9ff]/5 hover:bg-[#a4c9ff]/10 rounded-lg transition-colors">
                  Manage Staff
                </button>
                <button className="flex-1 py-2 text-[11px] font-bold text-[#8b919d] bg-[#131313] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  Edit Gate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "staff" && (
        <div className="bg-[#1c1b1b] rounded-3xl overflow-hidden animate-in fade-in duration-300">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4">
            {["Badge", "Officer", "Assigned Gate", "Shift", "Status", ""].map((h) => (
              <span key={h} className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {staff.map((s, i) => (
            <div
              key={s.id}
              className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-5 hover:bg-[#201f1f] transition-colors items-center group animate-in fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                <span className="text-[10px] font-black text-[#a4c9ff]">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#e5e2e1]">{s.name}</p>
                <p className="text-[10px] text-[#8b919d]">{s.badge}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-[#8b919d]">door_front</span>
                <span className="text-sm text-[#c1c7d3]">{s.gate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-[#8b919d]" />
                <span className="text-xs text-[#c1c7d3]">{s.shift}</span>
              </div>
              <div>
                <span
                  className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{
                    color: s.status === "on-duty" ? "#40e56c" : "#8b919d",
                    backgroundColor: s.status === "on-duty" ? "rgba(64,229,108,0.1)" : "rgba(139,145,157,0.1)",
                  }}
                >
                  {s.status === "on-duty" ? "● On Duty" : "○ Off Duty"}
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setSelectedStaff(s); setAssignModal(true); }}
                  className="text-[11px] font-bold text-[#a4c9ff] hover:underline underline-offset-3"
                >
                  Reassign
                </button>
                <button className="text-[#8b919d] hover:text-[#e5e2e1] transition-colors ml-1">
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Gate Modal */}
      {modal === "gate" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                Add New Gate
              </h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Gate Name</label>
                <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="e.g. North Gate" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Location</label>
                <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="e.g. East Entrance" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Gate Type</label>
                <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                  <option>Primary</option>
                  <option>Service</option>
                  <option>Emergency</option>
                  <option>Vehicle</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">Cancel</button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline">
                <Check size={15} /> Create Gate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {modal === "staff" && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">Add Security Staff</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Full Name</label>
                  <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="Full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Phone</label>
                  <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="+1 555-0100" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Assign to Gate</label>
                <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                  {gates.map(g => <option key={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Shift</label>
                <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                  {shifts.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">Cancel</button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline">
                <Check size={15} /> Add Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {assignModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">Reassign Staff</h3>
              <button onClick={() => setAssignModal(false)} className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]"><X size={16} /></button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-[#0e0e0e] rounded-2xl mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1c1b1b] flex items-center justify-center font-black text-sm text-[#a4c9ff]">
                {selectedStaff.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-[#e5e2e1]">{selectedStaff.name}</p>
                <p className="text-xs text-[#8b919d]">Currently: {selectedStaff.gate}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">New Gate Assignment</label>
                <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none" defaultValue={selectedStaff.gate}>
                  {gates.map(g => <option key={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Shift</label>
                <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none" defaultValue={selectedStaff.shift}>
                  {shifts.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setAssignModal(false)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">Cancel</button>
              <button onClick={() => setAssignModal(false)} className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline">
                <Check size={15} /> Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
