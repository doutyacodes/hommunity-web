"use client";

import { useState } from "react";
import { ChevronRight, Check, X, Users, UserCheck, Clock, ArrowRightLeft, ChevronDown } from "lucide-react";

type Status = "pending" | "approved" | "rejected";

const residents = [
  { id: "r1", name: "James Carter", apartment: "101A", block: "A", floor: "F01", type: "owner" as const, status: "approved" as Status, date: "2025-12-10", phone: "+1 555-1001", email: "jcarter@mail.com" },
  { id: "r2", name: "Maria Lopez", apartment: "101B", block: "A", floor: "F01", type: "tenant" as const, status: "approved" as Status, date: "2025-12-12", phone: "+1 555-1002", email: "mlopez@mail.com" },
  { id: "r3", name: "Sarah Kim", apartment: "201A", block: "A", floor: "F02", type: "tenant" as const, status: "pending" as Status, date: "2026-01-03", phone: "+1 555-1003", email: "skim@mail.com" },
  { id: "r4", name: "Alex Johnson", apartment: "201C", block: "A", floor: "F02", type: "tenant" as const, status: "pending" as Status, date: "2026-01-05", phone: "+1 555-1004", email: "ajohnson@mail.com" },
  { id: "r5", name: "Chen Wei", apartment: "101C", block: "A", floor: "F01", type: "owner" as const, status: "approved" as Status, date: "2025-11-28", phone: "+1 555-1005", email: "cwei@mail.com" },
  { id: "r6", name: "David Park", apartment: "301B", block: "A", floor: "F03", type: "owner" as const, status: "pending" as Status, date: "2026-01-08", phone: "+1 555-1006", email: "dpark@mail.com" },
  { id: "r7", name: "Emma Wilson", apartment: "102A", block: "B", floor: "F01", type: "tenant" as const, status: "rejected" as Status, date: "2025-12-20", phone: "+1 555-1007", email: "ewilson@mail.com" },
  { id: "r8", name: "Omar Khalil", apartment: "201A", block: "B", floor: "F02", type: "owner" as const, status: "approved" as Status, date: "2025-12-01", phone: "+1 555-1008", email: "okhalil@mail.com" },
];

type ResidentType = "owner" | "tenant";

export default function ResidentsPage() {
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(residents.map((r) => [r.id, r.status]))
  );
  const [types, setTypes] = useState<Record<string, ResidentType>>(
    Object.fromEntries(residents.map((r) => [r.id, r.type]))
  );
  const [ownershipModal, setOwnershipModal] = useState<string | null>(null);
  const [newType, setNewType] = useState<ResidentType>("tenant");
  const [detailModal, setDetailModal] = useState<string | null>(null);

  const filtered = residents.filter((r) => statuses[r.id] === activeTab);

  const approve = (id: string) => setStatuses((p) => ({ ...p, [id]: "approved" }));
  const reject = (id: string) => setStatuses((p) => ({ ...p, [id]: "rejected" }));

  const openOwnershipModal = (id: string) => {
    setNewType(types[id] === "owner" ? "tenant" : "owner");
    setOwnershipModal(id);
  };

  const confirmOwnershipChange = () => {
    if (ownershipModal) {
      setTypes((p) => ({ ...p, [ownershipModal]: newType }));
      setOwnershipModal(null);
    }
  };

  const counts = {
    pending: residents.filter((r) => statuses[r.id] === "pending").length,
    approved: residents.filter((r) => statuses[r.id] === "approved").length,
    rejected: residents.filter((r) => statuses[r.id] === "rejected").length,
  };

  const resident = ownershipModal ? residents.find(r => r.id === ownershipModal) : null;
  const detailResident = detailModal ? residents.find(r => r.id === detailModal) : null;

  const tabConfig = [
    { id: "pending" as Status, label: "Pending", color: "#ffb4ab" },
    { id: "approved" as Status, label: "Approved", color: "#40e56c" },
    { id: "rejected" as Status, label: "Rejected", color: "#8b919d" },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Resident Management</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Resident Requests
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Review and manage apartment access requests.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {tabConfig.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={[
              "bg-[#1c1b1b] rounded-2xl p-5 flex items-center justify-between hover:bg-[#201f1f] transition-all text-left animate-in fade-in slide-in-from-bottom-4",
              activeTab === t.id ? "ring-1" : "",
            ].join(" ")}
            style={{
              animationDelay: `${i * 60}ms`,
              ...(activeTab === t.id ? { ringColor: t.color } : {}),
              outline: activeTab === t.id ? `1px solid ${t.color}40` : "none",
            }}
          >
            <div>
              <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{t.label}</p>
              <p
                className="text-3xl font-black mt-1 font-headline"
                style={{ color: t.color }}
              >
                {String(counts[t.id]).padStart(2, "0")}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${t.color}15` }}
            >
              {t.id === "pending" ? (
                <Clock size={18} style={{ color: t.color }} />
              ) : t.id === "approved" ? (
                <UserCheck size={18} style={{ color: t.color }} />
              ) : (
                <X size={18} style={{ color: t.color }} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-xl w-fit mb-6">
        {tabConfig.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              activeTab === t.id ? "bg-[#353534] shadow-sm" : "text-[#8b919d] hover:text-[#c1c7d3]",
            ].join(" ")}
            style={{ color: activeTab === t.id ? t.color : undefined }}
          >
            {t.label}
            <span
              className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${t.color}15`, color: t.color }}
            >
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <div className="bg-[#1c1b1b] rounded-3xl p-16 text-center animate-in fade-in duration-300">
          <Users size={40} className="text-[#414751] mx-auto mb-4" />
          <p className="text-[#8b919d] font-bold">No {activeTab} requests</p>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-300">
          {filtered.map((r, i) => {
            const currentType = types[r.id];
            return (
              <div
                key={r.id}
                className="bg-[#1c1b1b] rounded-2xl p-5 hover:bg-[#201f1f] transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-[#353534] flex items-center justify-center font-black text-sm text-[#a4c9ff] shrink-0">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-[#e5e2e1]">{r.name}</h3>
                      <span
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          color: currentType === "owner" ? "#a4c9ff" : "#40e56c",
                          backgroundColor: currentType === "owner" ? "rgba(164,201,255,0.1)" : "rgba(64,229,108,0.1)",
                        }}
                      >
                        {currentType}
                      </span>
                      {activeTab === "pending" && (
                        <span className="text-[10px] font-bold text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-0.5 rounded uppercase">
                          Awaiting Review
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-[#8b919d] flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">apartment</span>
                        Unit {r.apartment} — Block {r.block}, {r.floor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {activeTab === "pending" ? (
                      <>
                        <button
                          onClick={() => reject(r.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffb4ab] font-bold text-xs rounded-xl transition-all active:scale-95"
                        >
                          <X size={13} />
                          Reject
                        </button>
                        <button
                          onClick={() => approve(r.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-[#40e56c]/20 to-[#02c953]/20 hover:from-[#40e56c]/30 hover:to-[#02c953]/30 text-[#40e56c] font-bold text-xs rounded-xl border border-[#40e56c]/20 transition-all active:scale-95"
                        >
                          <Check size={13} />
                          Approve
                        </button>
                      </>
                    ) : activeTab === "approved" ? (
                      <>
                        <button
                          onClick={() => openOwnershipModal(r.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#a4c9ff]/10 hover:bg-[#a4c9ff]/20 text-[#a4c9ff] font-bold text-xs rounded-xl transition-all active:scale-95 border border-[#a4c9ff]/10"
                        >
                          <ArrowRightLeft size={13} />
                          Change {currentType === "owner" ? "to Tenant" : "to Owner"}
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center bg-[#131313] hover:bg-[#2a2a2a] text-[#8b919d] hover:text-[#e5e2e1] rounded-xl transition-all">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => approve(r.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1b1b] hover:bg-[#2a2a2a] text-[#8b919d] font-bold text-xs rounded-xl transition-all"
                      >
                        Reconsider
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Change Ownership/Tenant Modal */}
      {ownershipModal && resident && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                  Change Resident Type
                </h3>
                <p className="text-xs text-[#8b919d] mt-0.5">Update ownership or tenancy status</p>
              </div>
              <button
                onClick={() => setOwnershipModal(null)}
                className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Resident info */}
            <div className="flex items-center gap-3 p-4 bg-[#0e0e0e] rounded-2xl mb-6">
              <div className="w-11 h-11 rounded-xl bg-[#353534] flex items-center justify-center font-black text-sm text-[#a4c9ff]">
                {resident.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-[#e5e2e1]">{resident.name}</p>
                <p className="text-xs text-[#8b919d]">Unit {resident.apartment} — Block {resident.block}, {resident.floor}</p>
              </div>
              <div className="ml-auto">
                <span
                  className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                  style={{
                    color: types[resident.id] === "owner" ? "#a4c9ff" : "#40e56c",
                    backgroundColor: types[resident.id] === "owner" ? "rgba(164,201,255,0.1)" : "rgba(64,229,108,0.1)",
                  }}
                >
                  Current: {types[resident.id]}
                </span>
              </div>
            </div>

            {/* Type selector */}
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                Change to
              </label>
              {(["owner", "tenant"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewType(t)}
                  className={[
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left border",
                    newType === t
                      ? t === "owner"
                        ? "bg-[#a4c9ff]/10 border-[#a4c9ff]/30"
                        : "bg-[#40e56c]/10 border-[#40e56c]/30"
                      : "bg-[#131313] border-transparent hover:border-white/10",
                  ].join(" ")}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: (t === "owner" ? "#a4c9ff" : "#40e56c") + "15" }}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ color: t === "owner" ? "#a4c9ff" : "#40e56c", fontVariationSettings: "'FILL' 1" }}
                    >
                      {t === "owner" ? "house" : "person"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-bold capitalize"
                      style={{ color: t === "owner" ? "#a4c9ff" : "#40e56c" }}
                    >
                      {t}
                    </p>
                    <p className="text-xs text-[#8b919d]">
                      {t === "owner" ? "Owns the unit. Full residency rights." : "Rents the unit. Standard tenancy rights."}
                    </p>
                  </div>
                  <div
                    className={[
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      newType === t
                        ? t === "owner" ? "bg-[#a4c9ff] border-[#a4c9ff]" : "bg-[#40e56c] border-[#40e56c]"
                        : "border-[#414751]",
                    ].join(" ")}
                  >
                    {newType === t && <Check size={10} className="text-[#131313]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3.5 bg-[#a4c9ff]/5 rounded-xl border border-[#a4c9ff]/10 flex items-start gap-2.5 mb-6">
              <span className="material-symbols-outlined text-[16px] text-[#a4c9ff] mt-0.5">info</span>
              <p className="text-xs text-[#c1c7d3]">
                Changing from {types[resident.id]} to {newType} will update the resident's access rights immediately. This action is logged.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOwnershipModal(null)}
                className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmOwnershipChange}
                disabled={newType === types[resident.id]}
                className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed font-headline"
              >
                <ArrowRightLeft size={14} />
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
