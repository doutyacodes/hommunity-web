"use client";

import { useState } from "react";
import { ChevronRight, Plus, X, Check, UserCog, Shield, Mail, Phone, AlertTriangle } from "lucide-react";

const clearanceLevels = [
  { level: 1, label: "View Only", color: "#8b919d" },
  { level: 2, label: "Standard", color: "#c8c6c5" },
  { level: 3, label: "Senior", color: "#a4c9ff" },
  { level: 4, label: "Full Access", color: "#40e56c" },
];

const initialAdmins = [
  { id: "a1", name: "Marcus Chen", email: "mchen@hommunity.sys", phone: "+1 555-2001", clearance: 4, status: "active", joinedAt: "2025-10-01", lastActive: "2 mins ago" },
  { id: "a2", name: "Sarah Williams", email: "swilliams@hommunity.sys", phone: "+1 555-2002", clearance: 3, status: "active", joinedAt: "2025-11-15", lastActive: "1 hr ago" },
  { id: "a3", name: "James Okoye", email: "jokoye@hommunity.sys", phone: "+1 555-2003", clearance: 2, status: "active", joinedAt: "2025-12-01", lastActive: "Yesterday" },
];

const allAvailableAdmins = [
  { id: "a4", name: "Priya Sharma", email: "psharma@hommunity.sys" },
  { id: "a5", name: "David Nakamura", email: "dnakamura@hommunity.sys" },
  { id: "a6", name: "Elena Volkov", email: "evolkov@hommunity.sys" },
  { id: "a7", name: "Omar Khalil", email: "okhalil@hommunity.sys" },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [modal, setModal] = useState(false);
  const [removeModal, setRemoveModal] = useState<string | null>(null);
  const [editClearance, setEditClearance] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState({ selectedId: "", clearance: 3 });

  const removeAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    setRemoveModal(null);
  };

  const assignAdmin = () => {
    const found = allAvailableAdmins.find(a => a.id === newAdmin.selectedId);
    if (!found) return;
    setAdmins(prev => [...prev, {
      ...found,
      phone: "+1 555-0000",
      clearance: newAdmin.clearance,
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "Just now",
    }]);
    setModal(false);
    setNewAdmin({ selectedId: "", clearance: 3 });
  };

  const updateClearance = (id: string, level: number) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, clearance: level } : a));
    setEditClearance(null);
  };

  const adminToRemove = removeModal ? admins.find(a => a.id === removeModal) : null;
  const available = allAvailableAdmins.filter(a => !admins.find(admin => admin.id === a.id));

  const getClearanceConfig = (level: number) => clearanceLevels.find(c => c.level === level) ?? clearanceLevels[1];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Admin Management</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Admin Management
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Assign and manage building administrators and their access levels.</p>
          </div>
          <button
            onClick={() => setModal(true)}
            disabled={available.length === 0}
            className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-headline"
          >
            <Plus size={15} />
            Assign Admin
          </button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {clearanceLevels.map((cl, i) => (
          <div
            key={cl.level}
            className="bg-[#1c1b1b] rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">Level {cl.level}</p>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cl.color }} />
            </div>
            <p className="text-2xl font-black font-headline" style={{ color: cl.color }}>
              {admins.filter(a => a.clearance === cl.level).length}
            </p>
            <p className="text-[10px] text-[#8b919d] mt-0.5">{cl.label}</p>
          </div>
        ))}
      </div>

      {/* Admins list */}
      <div className="bg-[#1c1b1b] rounded-3xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-[#e5e2e1] font-headline">Assigned Administrators</h3>
          <span className="text-[10px] font-bold text-[#8b919d] bg-[#131313] px-3 py-1.5 rounded-full">
            {admins.length} active
          </span>
        </div>

        {admins.map((admin, i) => {
          const clearanceCfg = getClearanceConfig(admin.clearance);
          return (
            <div
              key={admin.id}
              className="flex items-center gap-5 px-6 py-5 hover:bg-[#201f1f] transition-colors group animate-in fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#a4c9ff]/20 to-[#4d93e5]/20 flex items-center justify-center font-black text-sm text-[#a4c9ff]">
                  {admin.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#1c1b1b]"
                  style={{ backgroundColor: admin.status === "active" ? "#40e56c" : "#8b919d" }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-bold text-[#e5e2e1]">{admin.name}</p>
                  <span
                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ color: clearanceCfg.color, backgroundColor: `${clearanceCfg.color}15` }}
                  >
                    Lvl {admin.clearance} — {clearanceCfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#8b919d]">
                  <span className="flex items-center gap-1">
                    <Mail size={11} />
                    {admin.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={11} />
                    {admin.phone}
                  </span>
                </div>
              </div>

              {/* Last active */}
              <div className="hidden md:block text-right">
                <p className="text-[11px] text-[#8b919d]">Last active</p>
                <p className="text-sm font-bold text-[#c1c7d3]">{admin.lastActive}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditClearance(editClearance === admin.id ? null : admin.id)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#131313] hover:bg-[#2a2a2a] text-[#8b919d] hover:text-[#a4c9ff] font-bold text-xs rounded-xl transition-all"
                >
                  <Shield size={12} />
                  Clearance
                </button>
                <button
                  onClick={() => setRemoveModal(admin.id)}
                  className="w-8 h-8 flex items-center justify-center bg-[#93000a]/20 hover:bg-[#93000a]/40 text-[#ffb4ab] rounded-xl transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Clearance editor (inline) */}
        {editClearance && (
          <div className="px-6 py-4 bg-[#131313] animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider mb-3">
              Update clearance for {admins.find(a => a.id === editClearance)?.name}
            </p>
            <div className="flex items-center gap-2">
              {clearanceLevels.map((cl) => (
                <button
                  key={cl.level}
                  onClick={() => updateClearance(editClearance, cl.level)}
                  className={[
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    admins.find(a => a.id === editClearance)?.clearance === cl.level
                      ? "text-[#00315d]"
                      : "bg-[#1c1b1b] text-[#8b919d] hover:text-[#c1c7d3]",
                  ].join(" ")}
                  style={
                    admins.find(a => a.id === editClearance)?.clearance === cl.level
                      ? { backgroundColor: cl.color }
                      : {}
                  }
                >
                  Lvl {cl.level} — {cl.label}
                </button>
              ))}
              <button
                onClick={() => setEditClearance(null)}
                className="ml-auto text-[#8b919d] hover:text-[#e5e2e1] transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {admins.length === 0 && (
          <div className="p-16 text-center">
            <UserCog size={40} className="text-[#414751] mx-auto mb-4" />
            <p className="text-[#8b919d] font-bold">No admins assigned to this building yet.</p>
          </div>
        )}
      </div>

      {/* Clearance legend */}
      <div className="mt-5 bg-[#1c1b1b] rounded-2xl p-5">
        <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider mb-3">Clearance Level Guide</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {clearanceLevels.map(cl => (
            <div key={cl.level} className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cl.color }} />
              <div>
                <p className="text-xs font-bold" style={{ color: cl.color }}>Level {cl.level}</p>
                <p className="text-[10px] text-[#8b919d]">{cl.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Admin Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                Assign Administrator
              </h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Select Administrator</label>
                <div className="space-y-2">
                  {available.length === 0 ? (
                    <p className="text-sm text-[#8b919d] italic">No more admins available to assign</p>
                  ) : (
                    available.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setNewAdmin(p => ({ ...p, selectedId: a.id }))}
                        className={[
                          "w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left",
                          newAdmin.selectedId === a.id
                            ? "bg-[#a4c9ff]/10"
                            : "bg-[#0e0e0e] hover:bg-[#1c1b1b]",
                        ].join(" ")}
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#1c1b1b] flex items-center justify-center font-black text-xs text-[#a4c9ff] shrink-0">
                          {a.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#e5e2e1]">{a.name}</p>
                          <p className="text-[11px] text-[#8b919d]">{a.email}</p>
                        </div>
                        {newAdmin.selectedId === a.id && (
                          <Check size={16} className="text-[#a4c9ff]" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Clearance Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {clearanceLevels.map(cl => (
                    <button
                      key={cl.level}
                      onClick={() => setNewAdmin(p => ({ ...p, clearance: cl.level }))}
                      className={[
                        "flex items-center gap-2 p-3 rounded-xl transition-all",
                        newAdmin.clearance === cl.level
                          ? ""
                          : "bg-[#0e0e0e] hover:bg-[#1c1b1b]",
                      ].join(" ")}
                      style={newAdmin.clearance === cl.level ? { backgroundColor: `${cl.color}15` } : {}}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cl.color }} />
                      <div className="text-left">
                        <p className="text-xs font-bold" style={{ color: cl.color }}>Level {cl.level}</p>
                        <p className="text-[10px] text-[#8b919d]">{cl.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button onClick={() => setModal(false)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">Cancel</button>
              <button
                onClick={assignAdmin}
                disabled={!newAdmin.selectedId}
                className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed font-headline"
              >
                <Check size={15} /> Assign Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove confirmation modal */}
      {removeModal && adminToRemove && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-[#93000a]/20 flex items-center justify-center mb-5 mx-auto">
              <AlertTriangle size={22} className="text-[#ffb4ab]" />
            </div>
            <h3 className="text-xl font-bold text-[#e5e2e1] text-center mb-2 font-headline">
              Remove Admin Access
            </h3>
            <p className="text-sm text-[#8b919d] text-center mb-6">
              Remove <span className="text-[#e5e2e1] font-bold">{adminToRemove.name}</span> from this building? They will lose all access immediately.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveModal(null)} className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors">
                Cancel
              </button>
              <button
                onClick={() => removeAdmin(removeModal)}
                className="flex-1 py-3 bg-[#93000a]/40 hover:bg-[#93000a]/60 text-[#ffb4ab] font-black text-sm rounded-xl active:scale-95 transition-all font-headline"
              >
                Remove Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
