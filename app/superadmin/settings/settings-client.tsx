"use client";

import { useActionState, useState } from "react";
import { Shield, Key, Check, AlertCircle } from "lucide-react";
import { changePasswordAction } from "@/lib/actions/auth";

type Tab = "security";

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<Tab>("security");
  const [state, action, isPending] = useActionState(changePasswordAction, null);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            Platform Settings
          </h1>
          <p className="text-slate-500">
            Configure system-wide configurations and manage your superadmin account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <nav className="flex flex-col gap-2">
            {[
              { id: "security", label: "Account Security", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 text-left px-5 py-3.5 rounded-2xl font-bold border transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "hover:bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="col-span-1 md:col-span-3">
          <div className="bg-white border border-slate-200 shadow-sm rounded-[40px] p-10 min-h-[500px]">
            {activeTab === "security" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-2xl font-black text-slate-900 mb-8 font-headline flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                    <Key size={20} />
                  </div>
                  Account Security
                </h3>
                
                <form action={action} className="max-w-md space-y-6">
                  {state?.error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                      <AlertCircle size={18} />
                      {state.error}
                    </div>
                  )}
                  {state?.success && (
                    <div className="p-4 bg-green-50 border border-green-100 text-green-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                      <Check size={18} />
                      {state.success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                    <input 
                      type="password"
                      name="currentPassword"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password"
                        name="newPassword"
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-sm"
                        placeholder="Min. 8 characters"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input 
                        type="password"
                        name="confirmPassword"
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white w-full py-4 rounded-2xl font-black text-xs shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5 uppercase tracking-widest disabled:opacity-50"
                  >
                    {isPending ? "Updating Security Layer..." : (
                      <>
                        <Shield size={18} />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
