"use client";

import { useState, useTransition } from "react";
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  MoreVertical, Trash2, UserPlus, Mail, Phone, Home,
  Clock, Check, X, AlertCircle
} from "lucide-react";
import { updateResidentStatusAction, deleteResidentLinkAction } from "@/lib/actions/residents";
import { useRouter } from "next/navigation";

interface ResidentsClientProps {
  initialData: any[];
  buildingId: string;
}

export default function ResidentsClient({ initialData, buildingId }: ResidentsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED">("ALL");
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredData = initialData.filter(resident => {
    const matchesSearch = resident.residentName.toLowerCase().includes(search.toLowerCase()) || 
                         resident.unitNumber.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || resident.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: "Total Residents", value: initialData.length, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Pending Approval", value: initialData.filter(r => r.status === "PENDING_APPROVAL").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Approved", value: initialData.filter(r => r.status === "APPROVED").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    startTransition(async () => {
      const res = await updateResidentStatusAction(id, status);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteResidentLinkAction(id);
      if (res.success) {
        setConfirmDelete(null);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            Resident Registry
          </h1>
          <p className="text-slate-500">
            Monitor and moderate homeowners and tenants across your property.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-[32px] p-7 shadow-sm group hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 font-headline">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-[40px] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or unit number..." 
              className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all"
            />
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {(["ALL", "PENDING_APPROVAL", "APPROVED"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? "bg-white text-indigo-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Resident</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Unit Info</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100/50 shadow-sm shadow-indigo-100/20 uppercase">
                        {res.residentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-tight">{res.residentName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-slate-400">
                          <span className="flex items-center gap-1 text-[10px] font-bold"><Phone size={10} /> {res.phone}</span>
                          {res.email && <span className="flex items-center gap-1 text-[10px] font-bold"><Mail size={10} /> {res.email}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Home size={14} className="text-indigo-600" />
                        <span className="font-black text-slate-900 text-sm">Unit {res.unitNumber}</span>
                      </div>
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {res.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      res.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      res.status === "PENDING_APPROVAL" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {res.status === "PENDING_APPROVAL" ? <Clock size={12} /> : 
                       res.status === "APPROVED" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {res.status.replace("_APPROVAL", "")}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {res.status === "PENDING_APPROVAL" ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(res.id, "APPROVED")}
                            disabled={isPending}
                            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-90 disabled:opacity-50"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(res.id, "REJECTED")}
                            disabled={isPending}
                            className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-600 hover:border-red-100 transition-all hover:bg-red-50 active:scale-90 disabled:opacity-50"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => setConfirmDelete(res.id)}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-600 hover:border-red-100 transition-all hover:bg-red-50 active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search className="text-slate-300" size={32} />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No residents found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 font-headline leading-none mb-2">Unlink Resident</h3>
                <p className="text-sm text-slate-500 font-medium whitespace-pre-wrap">
                  This will remove the resident's access rights to the assigned apartment. Are you sure?
                </p>
              </div>
            </div>

            <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4 mb-8">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-black text-red-900 text-sm uppercase tracking-tight">Security Warning</h4>
                <p className="text-xs text-red-700/80 font-medium leading-relaxed mt-1">
                  The resident will lose all mobile app privileges for this unit immediately upon confirmation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(confirmDelete)}
                disabled={isPending}
                className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
              >
                {isPending ? "Syncing..." : "Unlink Resident"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
