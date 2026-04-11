"use client";

import { useState, useTransition } from "react";
import { 
  Users, Search, Filter, CheckCircle2, XCircle, 
  MoreVertical, Trash2, UserPlus, Mail, Phone, Home,
  Clock, Check, X, AlertCircle, Eye, Loader2, Car, Cat, ShieldCheck, MapPin
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
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [detailsData, setDetailsData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchDetails = async (id: string) => {
    setLoadingDetails(true);
    setViewingId(id);
    try {
      const res = await fetch(`/api/admin/residents/${id}`);
      const data = await res.json();
      if (data.success) {
        setDetailsData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

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
                       <button 
                        onClick={() => fetchDetails(res.id)}
                        className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-100 active:scale-90"
                        title="View Full Profile"
                      >
                        <Eye size={18} />
                      </button>
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

      {/* Resident Details Modal */}
      {viewingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-end animate-in fade-in duration-300">
          <div className="bg-white h-full w-full max-w-2xl shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100 uppercase">
                  {detailsData?.resident?.name?.charAt(0) || <Loader2 className="animate-spin" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-headline leading-tight">
                    {detailsData?.resident?.name || "Loading Profile..."}
                  </h3>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    <MapPin size={14} className="text-slate-300" /> Linked Resident Profile
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setViewingId(null); setDetailsData(null); }}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {loadingDetails ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Compiling Full Profile...</p>
                </div>
              ) : detailsData && (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                      <Users size={20} className="text-indigo-600 mb-3" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Household</p>
                      <h4 className="text-2xl font-black text-slate-900 font-headline">{detailsData.household?.length || 0}</h4>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                      <Car size={20} className="text-amber-600 mb-3" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicles</p>
                      <h4 className="text-2xl font-black text-slate-900 font-headline">{detailsData.vehicles?.length || 0}</h4>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100/50">
                      <Cat size={20} className="text-emerald-600 mb-3" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pets</p>
                      <h4 className="text-2xl font-black text-slate-900 font-headline">{detailsData.pets?.length || 0}</h4>
                    </div>
                  </div>

                  {/* HouseHold Section */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Household Members</h5>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tight">Active Unit</span>
                    </div>
                    <div className="space-y-3">
                      {detailsData.household?.map((member: any) => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-hover hover:border-indigo-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-sm leading-none">{member.name}</p>
                              <p className="text-slate-500 text-[10px] mt-1 font-bold">{member.phone}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            member.type === 'OWNER' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {member.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Vehicles & Pets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Registered Vehicles</h5>
                      <div className="space-y-3">
                        {detailsData.vehicles?.length > 0 ? detailsData.vehicles.map((v: any) => (
                          <div key={v.id} className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                              <Car size={14} className="text-amber-600" />
                              <p className="font-black text-amber-900 text-xs uppercase">{v.vehicleType}</p>
                            </div>
                            <p className="font-headline font-black text-lg text-slate-900 leading-none">{v.numberPlate}</p>
                            <p className="text-slate-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{v.model}</p>
                          </div>
                        )) : (
                          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Car size={24} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Vehicles</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section>
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Resident Pets</h5>
                      <div className="space-y-3">
                        {detailsData.pets?.length > 0 ? detailsData.pets.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-4 p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl">
                             <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                               <Cat size={18} />
                             </div>
                             <div>
                               <p className="font-black text-slate-900 text-sm leading-none">{p.name}</p>
                               <p className="text-emerald-700 text-[10px] font-bold mt-1 uppercase tracking-tight">{p.type} • {p.breed}</p>
                             </div>
                          </div>
                        )) : (
                          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Cat size={24} className="text-slate-300 mx-auto mb-2" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Pets</p>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Actions & Verification */}
                  <div className="p-8 bg-indigo-50/50 border border-indigo-100 rounded-[32px]">
                    <div className="flex items-start gap-4">
                      <ShieldCheck className="text-indigo-600 flex-shrink-0" size={24} />
                      <div>
                        <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight">Account Verification</h4>
                        <p className="text-[10px] text-indigo-700/80 font-medium leading-relaxed mt-1">
                          This resident is an approved member of the community with full access to {detailsData.household?.find((m: any) => m.name === detailsData.resident.name)?.type || 'Resident'} privileges.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
