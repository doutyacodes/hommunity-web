"use client";

import { useState, useTransition } from "react";
import { Users, Filter, Plus, Building2, Mail, Lock, X, Check } from "lucide-react";
import { provisionAdminAction } from "@/lib/actions/admins";
import { useRouter } from "next/navigation";

interface AdminProps {
  admins: any[];
  buildings: any[];
  assignments: any[];
}

export function ClientAdminsView({ admins, buildings, assignments }: AdminProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleProvision = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await provisionAdminAction(null, formData);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.success) {
        setShowModal(false);
        router.refresh();
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            System Administrators
          </h1>
          <p className="text-slate-500">
            Provision access credentials and assign Local Admins to your managed properties.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all">
            <Filter size={18} />
            Filter
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <Plus size={18} />
            Provision Admin
          </button>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-headline">No Admins Provisioned</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm mb-6">
            You haven't provisioned any Local Administrators yet. Ensure you have registered at least one Property Node before granting access.
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-blue-600 font-bold text-sm text-white rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
          >
            Provision First Admin
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider px-6">
            <div className="col-span-12 md:col-span-5">Identity Profile</div>
            <div className="col-span-12 md:col-span-5">Assigned Property</div>
            <div className="hidden md:block col-span-2 text-right">Status</div>
          </div>
          <div className="divide-y divide-slate-100">
            {admins.map((admin) => {
              // Find assignment link
              const link = assignments.find(a => a.adminId === admin.id);
              const property = link ? buildings.find(b => b.id === link.buildingId) : null;

              return (
                <div key={admin.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black">
                      {admin.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{admin.name}</p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                    {property ? (
                      <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg w-max">
                        <Building2 size={14} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-700">{property.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        Unassigned
                      </span>
                    )}
                  </div>
                  <div className="hidden md:flex col-span-2 justify-end">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Provisioning Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-slate-900 font-headline mb-1">Provision Admin</h2>
            <p className="text-sm text-slate-500 mb-6">Generate credentials and assign a property hub.</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleProvision} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input required type="text" name="name" placeholder="e.g. Alex Mercer" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="email" name="email" placeholder="alex@hommunity.sys" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Default Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="password" name="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400" />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assign to Property Node</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select required name="buildingId" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-900 appearance-none">
                    <option value="" disabled selected>Select a registered building...</option>
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name} - {b.address}</option>
                    ))}
                    {buildings.length === 0 && <option disabled>No buildings available</option>}
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 text-sm">
                  {isPending ? "Configuring..." : "Generate Access"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
