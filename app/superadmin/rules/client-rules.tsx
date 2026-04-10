"use client";

import { useState } from "react";
import { Plus, Shield, Edit3, Trash2, Power, X, Check, MoreVertical } from "lucide-react";
import { createGlobalRule, updateGlobalRule, toggleRuleStatus, deleteGlobalRule } from "@/lib/actions/global-rules";
import { useRouter } from "next/navigation";

interface Rule {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "DISABLED";
  createdAt: Date;
}

export default function ClientRules({ initialRules }: { initialRules: Rule[] }) {
  const [modal, setModal] = useState<"ADD" | "EDIT" | null>(null);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleToggle = async (id: string, currentStatus: "ACTIVE" | "DISABLED") => {
    setIsPending(true);
    await toggleRuleStatus(id, currentStatus);
    setIsPending(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      setIsPending(true);
      await deleteGlobalRule(id);
      setIsPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    if (modal === "ADD") {
      await createGlobalRule(data);
    } else if (modal === "EDIT" && currentRule) {
      await updateGlobalRule(currentRule.id, data);
    }

    setModal(null);
    setCurrentRule(null);
    setIsPending(false);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            Global Security Rules
          </h1>
          <p className="text-slate-500">
            Define mandatory network protocols natively enforced across all Hommunity complexes.
          </p>
        </div>
        <button 
          onClick={() => setModal("ADD")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus size={18} />
          Append Rule
        </button>
      </div>

      {initialRules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialRules.map((rule) => (
            <div key={rule.id} className={`bg-white border text-left rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative group flex flex-col ${rule.status === 'DISABLED' ? 'opacity-60 border-slate-100 grayscale-[0.5]' : 'border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${rule.status === 'ACTIVE' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  <Shield size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setCurrentRule(rule); setModal("EDIT"); }}
                    className="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggle(rule.id, rule.status)}
                    className={`p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 ${rule.status === 'ACTIVE' ? 'text-amber-500 hover:text-amber-600' : 'text-green-500 hover:text-green-600'}`}
                  >
                    <Power size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(rule.id)}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-headline mb-2">{rule.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-3 flex-1 leading-relaxed">
                {rule.description}
              </p>
              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${rule.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {rule.status}
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  {new Date(rule.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-[40px] overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Shield size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-headline">Default Protocol Active</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            No custom rules have been added. The ledger is operating under standard Hommunity architecture constraints.
          </p>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-headline">
                  {modal === 'ADD' ? 'Append New Rule' : 'Modify Protocol'}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Configure global ledger constraints.</p>
              </div>
              <button 
                onClick={() => { setModal(null); setCurrentRule(null); }}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Rule Title</label>
                <input 
                  name="title"
                  defaultValue={currentRule?.title}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-inner"
                  placeholder="e.g. Visitor Threshold Breach"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Description</label>
                <textarea 
                  name="description"
                  defaultValue={currentRule?.description}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-inner resize-none"
                  placeholder="Define the specific logic or constraint for this rule..."
                  required
                />
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button"
                  onClick={() => { setModal(null); setCurrentRule(null); }}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 px-10 disabled:opacity-50"
                >
                  {isPending ? "Processing..." : (
                    <>
                      <Check size={18} />
                      {modal === 'ADD' ? 'Append Rule' : 'Update Protocol'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
