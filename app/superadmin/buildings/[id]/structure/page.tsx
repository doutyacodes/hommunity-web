"use client";

import { useState } from "react";
import { ChevronRight, Plus, Building2, Layers, DoorOpen, X, Check, Search, MoreVertical, Building } from "lucide-react";
import Link from "next/link";

type Tab = "blocks" | "floors" | "apartments";

const blocks = [
  { id: "A", name: "Block Alpha", floors: 24, apartments: 96, status: "active", occupancy: "92%" },
  { id: "B", name: "Block Beta", floors: 18, apartments: 72, status: "active", occupancy: "84%" },
  { id: "C", name: "Executive Wing", floors: 12, apartments: 24, status: "setup", occupancy: "0%" },
];

const floors = [
  { id: "f1", number: "F24", block: "A", apartments: 4, occupied: 4, status: "full" },
  { id: "f2", number: "F23", block: "A", apartments: 4, occupied: 3, status: "active" },
  { id: "f3", number: "F22", block: "A", apartments: 4, occupied: 4, status: "full" },
  { id: "f4", number: "F21", block: "A", apartments: 4, occupied: 2, status: "active" },
  { id: "f5", number: "F18", block: "B", apartments: 4, occupied: 4, status: "full" },
];

const apartments = [
  { id: "402", unit: "402", floor: "F04", block: "A", status: "occupied", resident: "Julian Thorne", type: "owner" },
  { id: "105", unit: "105", floor: "F01", block: "A", status: "occupied", resident: "Elena Vance", type: "tenant" },
  { id: "708", unit: "708", floor: "F07", block: "B", status: "pending", resident: "Marcus Sterling", type: "owner" },
  { id: "801", unit: "801", floor: "F08", block: "B", status: "vacant", resident: null, type: null },
];

type ModalType = "block" | "floor" | "apartment" | null;

export default function StructurePage() {
  const [tab, setTab] = useState<Tab>("blocks");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);

  const filteredFloors = selectedBlock
    ? floors.filter((f) => f.block === selectedBlock)
    : floors;

  const statusColor: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    full: "bg-blue-50 text-blue-700 border-blue-200",
    empty: "bg-slate-50 text-slate-500 border-slate-200",
    occupied: "bg-green-50 text-green-700 border-green-200",
    vacant: "bg-slate-50 text-slate-500 border-slate-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    setup: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
          <span className="text-slate-400">Infrastructure</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span>Physical Structure</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-headline">
              Property Structure
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              Define and manage the physical hierarchy of the property node, from recursive blocks to individual units.
            </p>
          </div>
          <button
            onClick={() => setModal(tab === "blocks" ? "block" : tab === "floors" ? "floor" : "apartment")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Plus size={18} />
            Initialize {tab === "blocks" ? "Block" : tab === "floors" ? "Floor" : "Unit"}
          </button>
        </div>
      </section>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
          {([
            { id: "blocks", label: "Blocks", icon: Building },
            { id: "floors", label: "Floors", icon: Layers },
            { id: "apartments", label: "Units", icon: DoorOpen },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSelectedBlock(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            placeholder="Filter current view..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none w-64 shadow-sm"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {tab === "blocks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blocks.map((block, i) => (
              <div key={block.id} className="bg-white border border-slate-200 rounded-3xl p-7 hover:shadow-md transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-2xl text-slate-900">
                    {block.id}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${statusColor[block.status]}`}>
                    {block.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-headline mb-1">{block.name}</h3>
                <p className="text-sm text-slate-500 mb-6">Primary Residential Node</p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Floors</p>
                    <p className="text-xl font-black text-slate-900 font-headline">{block.floors}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Units</p>
                    <p className="text-xl font-black text-slate-900 font-headline">{block.apartments}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{block.occupancy} Occupancy</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedBlock(block.id); setTab("floors"); }}
                    className="text-xs font-bold text-blue-600 hover:underline underline-offset-4"
                  >
                    View Stack →
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setModal("block")}
              className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group min-h-[300px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                <Plus size={24} />
              </div>
              <p className="font-bold">Initialize New Block</p>
            </button>
          </div>
        )}

        {tab === "floors" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
              <button 
                onClick={() => setSelectedBlock(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${!selectedBlock ? "bg-slate-900 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600"}`}
              >
                All Nodes
              </button>
              {blocks.map(b => (
                <button 
                  key={b.id}
                  onClick={() => setSelectedBlock(b.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedBlock === b.id ? "bg-slate-900 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600"}`}
                >
                  Block {b.id}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFloors.map((floor, i) => (
                <div key={floor.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all cursor-pointer group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section {floor.block}</span>
                      <h4 className="text-3xl font-black text-slate-900 font-headline">{floor.number}</h4>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${statusColor[floor.status]}`}>
                      {floor.status}
                    </span>
                  </div>
                  <div className="space-y-3 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Units</span>
                      <span className="font-bold text-slate-900">{floor.apartments}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Status</span>
                      <span className="font-bold text-blue-600">{floor.occupied === floor.apartments ? "Allocated" : "Available"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "apartments" && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit Node</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hierarchy</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Resident</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {apartments.map((apt, i) => (
                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors group animate-in fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900 font-headline text-lg">{apt.unit}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <span className="text-blue-600">Block {apt.block}</span>
                          <ChevronRight size={10} className="text-slate-300" />
                          <span>{apt.floor}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-700">
                        {apt.resident ?? <span className="text-slate-300 italic font-normal">Unassigned</span>}
                      </td>
                      <td className="px-8 py-5">
                        {apt.type && (
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${apt.type === "owner" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                            {apt.type}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${statusColor[apt.status]}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-200">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Initialize Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-headline">
                  Initialize {modal === "block" ? "Block Node" : modal === "floor" ? "Floor Layer" : "Unit Node"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">Configure physical infrastructure parameters.</p>
              </div>
              <button 
                onClick={() => setModal(null)}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {modal === "block" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Node Identifier</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-inner" placeholder="e.g. D" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Alias Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all shadow-inner" placeholder="e.g. Riverside Tower" />
                  </div>
                </div>
              )}
              
              {/* Common Selector UI Pattern */}
              <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Architecture Note</p>
                  <p className="text-xs text-blue-600 leading-relaxed font-medium">Initial settings determine child inheritance. Ensure precision in identifier naming to prevent ledger discrepancies.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button 
                onClick={() => setModal(null)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setModal(null)}
                className="flex-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 px-10"
              >
                <Check size={18} />
                Confirm Initialization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
