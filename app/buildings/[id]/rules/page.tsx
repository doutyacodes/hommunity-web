"use client";

import { useState } from "react";
import { ChevronRight, Plus, FileText, X, Check, Clock, AlertTriangle, Shield } from "lucide-react";

const categories = ["Noise", "Safety", "Visitors", "Pets", "Parking", "Common Areas", "Maintenance"];

interface Rule {
  id: string;
  title: string;
  category: string;
  description: string;
  status: RuleStatus;
  createdAt: string;
  approvedAt: string | null;
}

const initialRules: Rule[] = [
  { id: "r1", title: "No Loud Noise After 10 PM", category: "Noise", description: "Residents must maintain quiet hours between 10:00 PM and 7:00 AM. No loud music, parties, or disruptive activities during this period.", status: "approved" as const, createdAt: "2025-11-15", approvedAt: "2025-11-20" },
  { id: "r2", title: "Pet Size Restriction — Max 25 lbs", category: "Pets", description: "Pets must weigh no more than 25 lbs. All pets must be registered with building management. Dogs must be leashed in all common areas.", status: "approved" as const, createdAt: "2025-11-10", approvedAt: "2025-11-18" },
  { id: "r3", title: "Visitor Overnight Policy — 5 Day Limit", category: "Visitors", description: "Non-resident visitors may stay overnight for a maximum of 5 consecutive nights per month. Extended stays require prior admin approval.", status: "pending" as const, createdAt: "2026-01-05", approvedAt: null },
  { id: "r4", title: "No Smoking in Common Areas", category: "Safety", description: "Smoking is strictly prohibited in all common areas including lobbies, elevators, hallways, gym, and rooftop. Designated smoking areas are available near the east parking lot.", status: "approved" as const, createdAt: "2025-10-20", approvedAt: "2025-10-25" },
  { id: "r5", title: "Garbage Disposal — Scheduled Hours", category: "Maintenance", description: "All garbage must be disposed of in designated bins on B1 level. Bulk items must be scheduled through management. No trash left in hallways.", status: "pending" as const, createdAt: "2026-01-08", approvedAt: null },
  { id: "r6", title: "Parking Space Assignment Protocol", category: "Parking", description: "Each unit is assigned one dedicated parking space. Unauthorized use of another resident's space will result in towing at owner's expense.", status: "draft" as const, createdAt: "2026-01-10", approvedAt: null },
];

type RuleStatus = "approved" | "pending" | "draft";
type FilterStatus = "all" | RuleStatus;

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [modal, setModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newRule, setNewRule] = useState({ title: "", category: "Noise", description: "" });

  const filtered = filter === "all" ? rules : rules.filter(r => r.status === filter);

  const addRule = () => {
    if (!newRule.title.trim()) return;
    setRules(prev => [{
      id: `r${prev.length + 1}`,
      ...newRule,
      status: "draft" as const,
      createdAt: new Date().toISOString().slice(0, 10),
      approvedAt: null,
    }, ...prev]);
    setModal(false);
    setNewRule({ title: "", category: "Noise", description: "" });
  };

  const statusConfig = {
    approved: { color: "#40e56c", bg: "rgba(64,229,108,0.1)", label: "Approved", icon: Check },
    pending: { color: "#ffb4ab", bg: "rgba(255,180,171,0.1)", label: "Pending Review", icon: Clock },
    draft: { color: "#8b919d", bg: "rgba(139,145,157,0.1)", label: "Draft", icon: FileText },
  };

  const counts = {
    all: rules.length,
    approved: rules.filter(r => r.status === "approved").length,
    pending: rules.filter(r => r.status === "pending").length,
    draft: rules.filter(r => r.status === "draft").length,
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Governance Rules</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Governance Rules
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Define community policies. Rules require client approval before enforcement.</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all font-headline"
          >
            <Plus size={15} />
            New Rule
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {(["all", "approved", "pending", "draft"] as const).map((s, i) => {
          const cfg = s === "all" ? { color: "#a4c9ff", bg: "rgba(164,201,255,0.1)", label: "Total Rules", icon: Shield } : statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={[
                "bg-[#1c1b1b] rounded-2xl p-5 flex items-center justify-between hover:bg-[#201f1f] transition-all text-left animate-in fade-in slide-in-from-bottom-4",
              ].join(" ")}
              style={{
                animationDelay: `${i * 60}ms`,
                outline: filter === s ? `1px solid ${cfg.color}40` : "none",
              }}
            >
              <div>
                <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{cfg.label}</p>
                <p
                  className="text-3xl font-black mt-1 font-headline"
                  style={{ color: cfg.color }}
                >
                  {String(counts[s]).padStart(2, "0")}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cfg.bg }}>
                <cfg.icon size={17} style={{ color: cfg.color }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Approval notice */}
      <div className="flex items-start gap-3 p-4 bg-[#ffb4ab]/5 rounded-2xl border border-[#ffb4ab]/10 mb-7">
        <AlertTriangle size={16} className="text-[#ffb4ab] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#e5e2e1] mb-0.5">Client Approval Required</p>
          <p className="text-xs text-[#8b919d]">
            Rules in "Pending Review" status must be approved by the authorized client/authority before they are enforced.
            {counts.pending > 0 && <span className="text-[#ffb4ab] font-bold"> {counts.pending} rule(s) awaiting approval.</span>}
          </p>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {filtered.map((rule, i) => {
          const cfg = statusConfig[rule.status];
          const isExpanded = expanded === rule.id;
          return (
            <div
              key={rule.id}
              className="bg-[#1c1b1b] rounded-2xl overflow-hidden hover:bg-[#201f1f] transition-colors animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : rule.id)}
                className="w-full flex items-center gap-5 p-5 text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cfg.bg }}
                >
                  <cfg.icon size={17} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-[#e5e2e1] text-sm">{rule.title}</h3>
                    <span className="text-[10px] font-bold bg-[#a4c9ff]/10 text-[#a4c9ff] px-2 py-0.5 rounded uppercase">
                      {rule.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span
                      className="text-[10px] font-black uppercase tracking-wider"
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-[#8b919d]">
                      Created {new Date(rule.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {rule.approvedAt && (
                      <span className="text-[10px] text-[#40e56c]">
                        ✓ Approved {new Date(rule.approvedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={["w-7 h-7 rounded-lg bg-[#131313] flex items-center justify-center text-[#8b919d] transition-transform duration-200", isExpanded ? "rotate-180" : ""].join(" ")}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-[#c1c7d3] leading-relaxed mb-4">{rule.description}</p>
                  <div className="flex items-center gap-3">
                    {rule.status === "draft" && (
                      <button
                        onClick={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: "pending" as const } : r))}
                        className="flex items-center gap-2 px-4 py-2 bg-[#ffb4ab]/10 hover:bg-[#ffb4ab]/20 text-[#ffb4ab] font-bold text-xs rounded-xl transition-all"
                      >
                        <Clock size={13} />
                        Submit for Review
                      </button>
                    )}
                    {rule.status === "pending" && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#ffb4ab]/10 text-[#ffb4ab] rounded-xl">
                        <Clock size={13} />
                        <span className="text-xs font-bold">Awaiting client approval</span>
                      </div>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#131313] hover:bg-[#2a2a2a] text-[#8b919d] hover:text-[#e5e2e1] font-bold text-xs rounded-xl transition-all ml-auto">
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
                      className="flex items-center gap-2 px-4 py-2 bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] font-bold text-xs rounded-xl transition-all"
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Rule Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                Create New Rule
              </h3>
              <button
                onClick={() => setModal(false)}
                className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Rule Title *</label>
                <input
                  value={newRule.title}
                  onChange={(e) => setNewRule(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm"
                  placeholder="e.g. No Loud Noise After 10 PM"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Category</label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none"
                >
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Description *</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm resize-none"
                  placeholder="Detailed description of this rule and its enforcement..."
                />
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#a4c9ff]/5 rounded-xl border border-[#a4c9ff]/10">
                <span className="material-symbols-outlined text-[16px] text-[#a4c9ff]">info</span>
                <p className="text-xs text-[#c1c7d3]">New rules are saved as <span className="text-[#8b919d] font-bold">Draft</span>. You can then submit them for client review before enforcement.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setModal(false)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">Cancel</button>
              <button onClick={addRule} className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline">
                <Check size={15} /> Save as Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
