"use client";

import { useState } from "react";
import { ChevronRight, Plus, Building2, Layers, DoorOpen, X, Check } from "lucide-react";

type Tab = "blocks" | "floors" | "apartments";

const blocks = [
  { id: "A", name: "Block A", floors: 12, apartments: 48, status: "active" },
  { id: "B", name: "Block B", floors: 10, apartments: 40, status: "active" },
  { id: "C", name: "Block C", floors: 8, apartments: 32, status: "setup" },
];

const floors = [
  { id: "f1", number: "F01", block: "A", apartments: 4, occupied: 4, status: "full" },
  { id: "f2", number: "F02", block: "A", apartments: 4, occupied: 3, status: "active" },
  { id: "f3", number: "F03", block: "A", apartments: 4, occupied: 4, status: "full" },
  { id: "f4", number: "F04", block: "A", apartments: 4, occupied: 2, status: "active" },
  { id: "f5", number: "F01", block: "B", apartments: 4, occupied: 4, status: "full" },
  { id: "f6", number: "F02", block: "B", apartments: 4, occupied: 3, status: "active" },
  { id: "f7", number: "F03", block: "B", apartments: 4, occupied: 0, status: "empty" },
];

const apartments = [
  { id: "101A", unit: "101A", floor: "F01", block: "A", status: "occupied", resident: "James Carter", type: "owner" },
  { id: "101B", unit: "101B", floor: "F01", block: "A", status: "occupied", resident: "Maria Lopez", type: "tenant" },
  { id: "101C", unit: "101C", floor: "F01", block: "A", status: "occupied", resident: "Chen Wei", type: "owner" },
  { id: "101D", unit: "101D", floor: "F01", block: "A", status: "vacant", resident: null, type: null },
  { id: "201A", unit: "201A", floor: "F02", block: "A", status: "occupied", resident: "Sarah Kim", type: "tenant" },
  { id: "201B", unit: "201B", floor: "F02", block: "A", status: "occupied", resident: "Mike Torres", type: "owner" },
  { id: "201C", unit: "201C", floor: "F02", block: "A", status: "pending", resident: "Alex Johnson", type: "tenant" },
  { id: "201D", unit: "201D", floor: "F02", block: "A", status: "vacant", resident: null, type: null },
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
    active: "#40e56c",
    full: "#a4c9ff",
    empty: "#8b919d",
    occupied: "#40e56c",
    vacant: "#8b919d",
    pending: "#ffb4ab",
    setup: "#c8c6c5",
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Building Structure</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Structure Management
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Configure blocks, floors, and apartment units.</p>
          </div>
          <button
            onClick={() => setModal(tab === "blocks" ? "block" : tab === "floors" ? "floor" : "apartment")}
            className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all font-headline"
          >
            <Plus size={15} />
            Add {tab === "blocks" ? "Block" : tab === "floors" ? "Floor" : "Apartment"}
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-xl w-fit mb-7">
        {([
          { id: "blocks", label: "Blocks", icon: Building2 },
          { id: "floors", label: "Floors", icon: Layers },
          { id: "apartments", label: "Apartments", icon: DoorOpen },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              tab === t.id
                ? "bg-[#353534] text-[#a4c9ff] shadow-sm"
                : "text-[#8b919d] hover:text-[#c1c7d3]",
            ].join(" ")}
          >
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Blocks", value: blocks.length, color: "#a4c9ff" },
          { label: "Floors", value: floors.length, color: "#40e56c" },
          { label: "Apartments", value: apartments.length, color: "#c8c6c5" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1c1b1b] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{s.label}</p>
              <p
                className="text-3xl font-black mt-1 font-headline"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      {tab === "blocks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
          {blocks.map((block, i) => (
            <div
              key={block.id}
              className="bg-[#1c1b1b] rounded-3xl p-6 hover:bg-[#201f1f] hover:scale-[1.01] transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-[#00315d]"
                  style={{ background: "linear-gradient(135deg, #a4c9ff, #4d93e5)" }}
                >
                  {block.id}
                </div>
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ color: statusColor[block.status], backgroundColor: `${statusColor[block.status]}15` }}
                >
                  {block.status}
                </span>
              </div>
              <h3
                className="text-2xl font-black text-[#e5e2e1] mb-1 font-headline"
              >
                {block.name}
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: "Floors", value: block.floors },
                  { label: "Apartments", value: block.apartments },
                ].map((s) => (
                  <div key={s.label} className="bg-[#131313] rounded-xl p-3 text-center">
                    <p
                      className="text-xl font-black text-[#e5e2e1] font-headline"
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] text-[#8b919d] uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setSelectedBlock(block.id); setTab("floors"); }}
                className="mt-4 w-full py-2 text-[11px] font-bold text-[#a4c9ff] bg-[#a4c9ff]/5 hover:bg-[#a4c9ff]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                View Floors →
              </button>
            </div>
          ))}
          {/* Add block card */}
          <button
            onClick={() => setModal("block")}
            className="bg-[#1c1b1b] border-2 border-dashed border-[#414751] hover:border-[#a4c9ff]/40 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-[#8b919d] hover:text-[#a4c9ff] transition-all group min-h-[180px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#131313] flex items-center justify-center group-hover:bg-[#a4c9ff]/10 transition-colors">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold">Add New Block</span>
          </button>
        </div>
      )}

      {tab === "floors" && (
        <div className="animate-in fade-in duration-300">
          {/* Block filter */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-[#8b919d] font-bold">Filter by block:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedBlock(null)}
                className={["px-3 py-1.5 rounded-lg text-xs font-bold transition-all", selectedBlock === null ? "bg-[#a4c9ff] text-[#00315d]" : "bg-[#1c1b1b] text-[#8b919d] hover:text-[#c1c7d3]"].join(" ")}
              >
                All
              </button>
              {blocks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBlock(b.id)}
                  className={["px-3 py-1.5 rounded-lg text-xs font-bold transition-all", selectedBlock === b.id ? "bg-[#a4c9ff] text-[#00315d]" : "bg-[#1c1b1b] text-[#8b919d] hover:text-[#c1c7d3]"].join(" ")}
                >
                  Block {b.id}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredFloors.map((floor, i) => (
              <div
                key={floor.id}
                className="bg-[#1c1b1b] rounded-2xl p-5 hover:bg-[#201f1f] transition-all hover:scale-[1.01] cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#8b919d] uppercase">Block {floor.block}</span>
                    <h3
                      className="text-3xl font-black text-[#e5e2e1] font-headline"
                    >
                      {floor.number}
                    </h3>
                  </div>
                  <span
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded"
                    style={{ color: statusColor[floor.status], backgroundColor: `${statusColor[floor.status]}15` }}
                  >
                    {floor.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8b919d]">Apartments</span>
                    <span className="font-bold text-[#e5e2e1]">{floor.apartments}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8b919d]">Occupied</span>
                    <span className="font-bold" style={{ color: statusColor[floor.status] }}>{floor.occupied}/{floor.apartments}</span>
                  </div>
                </div>
                <div className="mt-3 h-1 bg-[#131313] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(floor.occupied / floor.apartments) * 100}%`,
                      backgroundColor: statusColor[floor.status],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "apartments" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-[#1c1b1b] rounded-3xl overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4">
              {["Unit", "Block / Floor", "Resident", "Type", "Status", ""].map((h) => (
                <span key={h} className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{h}</span>
              ))}
            </div>
            {apartments.map((apt, i) => (
              <div
                key={apt.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 hover:bg-[#201f1f] transition-colors items-center animate-in fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span
                  className="font-black text-[#e5e2e1] font-headline"
                >
                  {apt.unit}
                </span>
                <span className="text-sm text-[#c1c7d3]">Block {apt.block} / {apt.floor}</span>
                <span className="text-sm text-[#e5e2e1]">{apt.resident ?? <span className="text-[#8b919d] italic">Vacant</span>}</span>
                <span>
                  {apt.type && (
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                      style={{
                        color: apt.type === "owner" ? "#a4c9ff" : "#40e56c",
                        backgroundColor: apt.type === "owner" ? "rgba(164,201,255,0.1)" : "rgba(64,229,108,0.1)",
                      }}
                    >
                      {apt.type}
                    </span>
                  )}
                </span>
                <span>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ color: statusColor[apt.status], backgroundColor: `${statusColor[apt.status]}15` }}
                  >
                    {apt.status}
                  </span>
                </span>
                <button className="text-[#8b919d] hover:text-[#a4c9ff] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-md shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                Add {modal === "block" ? "Block" : modal === "floor" ? "Floor" : "Apartment"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {modal === "block" && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Block Name</label>
                    <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="e.g. Block D" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Number of Floors</label>
                    <input type="number" className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="12" />
                  </div>
                </>
              )}
              {modal === "floor" && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Block</label>
                    <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                      {blocks.map((b) => <option key={b.id}>Block {b.id}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Floor Number</label>
                    <input type="text" className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="e.g. F05" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Apartments per Floor</label>
                    <input type="number" className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="4" />
                  </div>
                </>
              )}
              {modal === "apartment" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Block</label>
                      <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                        {blocks.map((b) => <option key={b.id}>Block {b.id}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Floor</label>
                      <select className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm appearance-none">
                        {floors.map((f) => <option key={f.id}>{f.number} - Block {f.block}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Unit Number</label>
                    <input className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm" placeholder="e.g. 301C" />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-3 bg-[#0e0e0e] hover:bg-[#1c1b1b] text-[#e5e2e1] font-bold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline"
              >
                <Check size={15} />
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
