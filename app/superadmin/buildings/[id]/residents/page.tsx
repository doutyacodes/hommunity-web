"use client";

import { useState } from "react";
import { ChevronRight, Check, X, Users, UserCheck, Clock, ArrowRightLeft, FileText, AlertCircle, Eye, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

type Status = "pending" | "approved" | "rejected";
type ResidentType = "owner" | "tenant";

const residentsData = [
  { 
    id: "r1", 
    name: "Julian Thorne", 
    unit: "402", 
    level: "Penthouse", 
    type: "owner" as ResidentType, 
    status: "pending" as Status, 
    requestType: "Structural Balcony Modification",
    desc: "Proposed installation of glass wind-buffers and integrated planter systems. All materials adhere to the Tower Alpha safety guidelines.",
    tags: ["URGENT REVIEW"],
    date: "2026-04-08",
  },
  { 
    id: "r2", 
    name: "Elena Vance", 
    unit: "105", 
    level: "North Wing", 
    type: "tenant" as ResidentType, 
    status: "pending" as Status, 
    requestType: "Long-term Guest Entry Permit",
    desc: "Requesting biometric access for private nurse assistance from Oct 1 to Dec 15. Medical certification attached.",
    tags: ["PENDING DOCS"],
    docs: ["Medical_Cert_Vance.pdf", "Guest_ID_Verification.jpg"],
    date: "2026-04-09",
  },
  { 
    id: "r3", 
    name: "Marcus Sterling", 
    unit: "708", 
    level: "Executive Suite", 
    type: "owner" as ResidentType, 
    status: "pending" as Status, 
    requestType: "Lease Renewal Agreement",
    desc: "Renewing for an additional 24-month term. Note: requested parking spot realignment in Section B.",
    tags: ["DISCREPANCY"],
    alert: "ACTION REQUIRED: Proof of insurance update needed for Section B parking.",
    date: "2026-04-07",
  },
];

export default function ResidentsPage() {
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [residents, setResidents] = useState(residentsData);

  const approve = (id: string) => {
    setResidents(residents.map(r => r.id === id ? { ...r, status: "approved" as Status } : r));
  };

  const reject = (id: string) => {
    setResidents(residents.map(r => r.id === id ? { ...r, status: "rejected" as Status } : r));
  };

  const filtered = residents.filter(r => r.status === activeTab);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
          <span className="text-slate-400">Administration</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span>Resident Approvals</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-headline">
              Resident Approvals
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              Verify architectural modifications, lease renewals, and entry permits within the ledger system.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center min-w-[100px] shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending</p>
              <p className="text-2xl font-black text-slate-900 font-headline">{residents.filter(r => r.status === "pending").length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-center min-w-[100px] shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today</p>
              <p className="text-2xl font-black text-slate-900 font-headline">06</p>
            </div>
          </div>
        </div>
      </section>

      {/* List Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(["pending", "approved", "rejected"] as Status[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            placeholder="Search ledger..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none w-64 transition-all"
          />
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-20 text-center">
            <Users size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No {activeTab} requests found in the ledger.</p>
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-md transition-all group animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Section */}
                <div className="w-full lg:w-1/4 flex items-center lg:items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0">
                    <span className="text-white font-black text-lg">{r.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 font-headline">{r.name}</h4>
                    <p className="text-xs font-bold text-blue-600">Unit {r.unit} • {r.level}</p>
                    <div className="mt-2 flex gap-2">
                      {r.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded tracking-wider uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 border-l border-slate-100 pl-0 lg:pl-8">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Request Type</p>
                    <h5 className="text-md font-bold text-slate-800">{r.requestType}</h5>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[13px] text-slate-600 leading-relaxed italic">
                        "{r.desc}"
                      </p>
                    </div>

                    {(r.docs || r.alert) && (
                      <div className="w-full md:w-1/2 space-y-3">
                        {r.docs?.map(doc => (
                          <div key={doc} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-colors cursor-pointer group">
                            <FileText size={16} className="text-blue-500" />
                            <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600">{doc}</span>
                            <Eye size={14} className="ml-auto text-slate-300 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        ))}
                        {r.alert && (
                          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Action Required</p>
                              <p className="text-[11px] text-amber-700 font-medium mt-0.5">{r.alert}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Section */}
                <div className="lg:w-48 flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => approve(r.id)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm shadow-sm transition-all">
                    <Eye size={16} />
                    Review
                  </button>
                  <button 
                    onClick={() => reject(r.id)}
                    className="w-full flex items-center justify-center p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <AlertCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-between pb-10">
        <p className="text-xs text-slate-500">Showing {filtered.length} of {residents.length} pending entries</p>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30" disabled>
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs ${p === 1 ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
