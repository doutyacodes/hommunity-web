"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { 
  Building2, Layers, LayoutGrid, Plus, X, 
  Check, AlertCircle, Trash2, Home, ChevronRight,
  Pencil, MoreVertical, Trash
} from "lucide-react";
import { 
  createBlockAction, createFloorAction, createApartmentAction,
  updateBlockAction, deleteBlockAction, updateFloorAction,
  deleteFloorAction, updateApartmentAction, deleteApartmentAction
} from "@/lib/actions/infrastructure";
import { useRouter } from "next/navigation";

interface InfrastructureClientProps {
  buildingId: string;
  data: {
    blocks: any[];
    floors: any[];
    apartments: any[];
  };
}

export default function InfrastructureClient({ buildingId, data }: InfrastructureClientProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"block" | "floor" | "unit" | "edit-block" | "edit-floor" | "edit-unit" | "delete-confirm" | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | "none">("none");
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  
  // Edit/Delete Specific State
  const [targetItem, setTargetItem] = useState<any>(null);
  const [isDeleting, startDeletion] = useTransition();
  const [deleteError, setDeleteError] = useState("");

  // Unit Creation Mode State
  const [unitAddMode, setUnitAddMode] = useState<"single" | "bulk" | "range">("single");
  const [rangePrefix, setRangePrefix] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [bulkList, setBulkList] = useState("");

  const [createBlockState, blockAction, blockPending] = useActionState<any, FormData>(createBlockAction, null);
  const [createFloorState, floorAction, floorPending] = useActionState<any, FormData>(createFloorAction, null);
  const [createUnitState, unitAction, unitPending] = useActionState<any, FormData>(createApartmentAction, null);

  const [updateBlockState, editBlockAction, editBlockPending] = useActionState<any, FormData>(updateBlockAction, null);
  const [updateFloorState, editFloorAction, editFloorPending] = useActionState<any, FormData>(updateFloorAction, null);
  const [updateUnitState, editUnitAction, editUnitPending] = useActionState<any, FormData>(updateApartmentAction, null);

  useEffect(() => {
    if (updateBlockState?.success || updateFloorState?.success || updateUnitState?.success) {
      setActiveModal(null);
      setTargetItem(null);
      router.refresh();
    }
  }, [updateBlockState, updateFloorState, updateUnitState, router]);

  useEffect(() => {
    if (createBlockState?.success || createFloorState?.success || createUnitState?.success) {
      setActiveModal(null);
      router.refresh();
    }
  }, [createBlockState, createFloorState, createUnitState, router]);

  const stats = [
    { label: "Total Blocks", value: data.blocks.length, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Floors", value: data.floors.length, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Apartment Units", value: data.apartments.length, icon: Home, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const handleDelete = () => {
    setDeleteError("");
    startDeletion(async () => {
      let res;
      if (activeModal === "delete-confirm") {
        if (targetItem.type === "block") res = await deleteBlockAction(targetItem.id);
        else if (targetItem.type === "floor") res = await deleteFloorAction(targetItem.id);
        else if (targetItem.type === "unit") res = await deleteApartmentAction(targetItem.id);
      }

      if (res?.error) {
        setDeleteError(res.error);
      } else {
        setActiveModal(null);
        setTargetItem(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            Infrastructure Configuration
          </h1>
          <p className="text-slate-500">
            Build and manage the structural hierarchy (Blocks, Floors, Apartments) for this property.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveModal("block")}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Block
          </button>
          <button 
            onClick={() => setActiveModal("floor")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Floor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-[32px] p-7 shadow-sm group hover:shadow-md transition-shadow relative overflow-hidden">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 font-headline">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Blocks Management Quick View */}
      {data.blocks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900 font-headline uppercase tracking-tight">Active Blocks</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.blocks.map(block => (
              <div key={block.id} className="group flex items-center gap-4 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all">
                <span className="font-black text-slate-900 text-sm whitespace-nowrap">{block.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setTargetItem(block); setActiveModal("edit-block"); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button 
                    onClick={() => { setTargetItem({ ...block, type: 'block' }); setActiveModal("delete-confirm"); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 shadow-sm rounded-[40px] overflow-hidden min-h-[500px] flex flex-col">
        {data.floors.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-amber-50 border border-amber-100 text-amber-600 rounded-[28px] flex items-center justify-center mb-6 shadow-sm">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 font-headline">Empty Infrastructure</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">
              You haven't instantiated any physical boundaries for this building yet. Start by defining Floors or setting up individual Blocks.
            </p>
          </div>
        ) : (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
             {data.floors.map((floor) => (
               <div key={floor.id} className="group bg-slate-50/50 border border-slate-100 rounded-[32px] p-6 hover:bg-white hover:border-slate-200 hover:shadow-lg transition-all">
                 <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm">
                       {floor.floorNumber}
                     </div>
                     <div>
                       <div className="flex items-center gap-2 group/title">
                         <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">Floor {floor.floorNumber}</h4>
                         <div className="flex gap-1 opacity-0 group-hover/title:opacity-100 transition-opacity">
                            <button 
                                onClick={() => { setTargetItem(floor); setActiveModal("edit-floor"); }}
                                className="p-1 px-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm transition-all"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => { setTargetItem({ ...floor, type: 'floor', name: `Floor ${floor.floorNumber}` }); setActiveModal("delete-confirm"); }}
                                className="p-1 px-2 text-slate-400 hover:text-red-600 bg-white border border-slate-100 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm transition-all"
                            >
                                Delete
                            </button>
                         </div>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         {floor.blockId ? `Block: ${data.blocks.find(b => b.id === floor.blockId)?.name}` : 'Main Structure'}
                       </p>
                     </div>
                   </div>
                   <button 
                    onClick={() => {
                        setSelectedFloorId(floor.id);
                        setActiveModal("unit");
                    }}
                    className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                   >
                     <Plus size={14} /> Add Unit
                   </button>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                   {data.apartments.filter(a => a.floorId === floor.id).map((unit) => (
                     <div key={unit.id} className="aspect-square bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-2 group/unit hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer shadow-sm relative">
                        <span className="text-xs font-black text-slate-900">{unit.unitNumber}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">{unit.type || 'Standard'}</span>
                        
                        {/* Unit Actions Overlay */}
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover/unit:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-2xl">
                           <button 
                             onClick={() => { setTargetItem(unit); setActiveModal("edit-unit"); }}
                             className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                           >
                             <Pencil size={14} />
                           </button>
                           <button 
                             onClick={() => { setTargetItem({ ...unit, type: 'unit', name: `Unit ${unit.unitNumber}` }); setActiveModal("delete-confirm"); }}
                             className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                           >
                             <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                   ))}
                   {data.apartments.filter(a => a.floorId === floor.id).length === 0 && (
                     <div className="col-span-full py-4 text-center">
                       <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No units registered on this level</p>
                     </div>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {activeModal === "block" && (
        <Modal 
            title="Create Block" 
            desc="Add a new physical sector to the building hierarchy." 
            onClose={() => setActiveModal(null)}
        >
          <form action={blockAction} onSubmit={() => { if(!createBlockState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="buildingId" value={buildingId} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Block Name</label>
              <input name="name" required placeholder="e.g. Block A, East Wing..." className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
            </div>
            {createBlockState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createBlockState.error}</div>}
            <ModalButtons isPending={blockPending} onClose={() => setActiveModal(null)} />
          </form>
        </Modal>
      )}

      {activeModal === "edit-block" && (
        <Modal 
            title="Edit Block" 
            desc="Correct the identity of this physical sector." 
            onClose={() => { setActiveModal(null); setTargetItem(null); }}
        >
          <form action={editBlockAction} onSubmit={() => { if(!updateBlockState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="id" value={targetItem?.id} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Block Name</label>
              <input name="name" defaultValue={targetItem?.name} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
            </div>
            {updateBlockState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{updateBlockState.error}</div>}
            <ModalButtons isPending={editBlockPending} onClose={() => setActiveModal(null)} label="Save Changes" />
          </form>
        </Modal>
      )}

      {activeModal === "floor" && (
        <Modal 
            title="Create Floor" 
            desc="Instantiate a new vertical level." 
            onClose={() => setActiveModal(null)}
        >
          <form action={floorAction} onSubmit={() => { if(!createFloorState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="buildingId" value={buildingId} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Block (Optional)</label>
              <select name="blockId" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none font-medium">
                <option value="">Main Structure</option>
                {data.blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor Level</label>
              <input name="floorNumber" required placeholder="e.g. 1st, Ground, P1..." className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
            </div>
            {createFloorState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createFloorState.error}</div>}
            <ModalButtons isPending={floorPending} onClose={() => setActiveModal(null)} />
          </form>
        </Modal>
      )}

      {activeModal === "edit-floor" && (
        <Modal 
            title="Edit Floor" 
            desc="Reposition or rename this vertical level." 
            onClose={() => { setActiveModal(null); setTargetItem(null); }}
        >
          <form action={editFloorAction} onSubmit={() => { if(!updateFloorState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="id" value={targetItem?.id} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Block</label>
              <select name="blockId" defaultValue={targetItem?.blockId || "none"} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none font-medium">
                <option value="none">Main Structure</option>
                {data.blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor Level</label>
              <input name="floorNumber" defaultValue={targetItem?.floorNumber} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
            </div>
            {updateFloorState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{updateFloorState.error}</div>}
            <ModalButtons isPending={editFloorPending} onClose={() => setActiveModal(null)} label="Save Changes" />
          </form>
        </Modal>
      )}

      {activeModal === "unit" && (
        <Modal 
            title="Register Units" 
            desc="Add final residential or commercial units to this level." 
            onClose={() => setActiveModal(null)}
        >
          <form action={unitAction} onSubmit={() => { if(!createUnitState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="buildingId" value={buildingId} />
            <input type="hidden" name="floorId" value={selectedFloorId} />
            
            {/* Mode Selection Tabs */}
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {(["single", "bulk", "range"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setUnitAddMode(mode)}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    unitAddMode === mode 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {unitAddMode === "single" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Number</label>
                <input name="unitNumber" required placeholder="e.g. 101" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
              </div>
            )}

            {unitAddMode === "bulk" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comma Separated List</label>
                <textarea 
                  name="unitNumber" 
                  required 
                  placeholder="e.g. 101, 102, 103, 104..." 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium resize-none"
                />
              </div>
            )}

            {unitAddMode === "range" && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prefix</label>
                    <input 
                      value={rangePrefix}
                      onChange={(e) => setRangePrefix(e.target.value)}
                      placeholder="e.g. A-" 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start</label>
                    <input 
                      type="number"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      required 
                      placeholder="101" 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End</label>
                    <input 
                      type="number"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      required 
                      placeholder="120" 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" 
                    />
                  </div>
                </div>
                
                {/* Generated unitNumber for the single server action */}
                <input 
                  type="hidden" 
                  name="unitNumber" 
                  value={
                    Array.from(
                      { length: Math.max(0, parseInt(rangeEnd) - parseInt(rangeStart) + 1) }, 
                      (_, i) => `${rangePrefix}${parseInt(rangeStart) + i}`
                    ).join(", ")
                  } 
                />

                {rangeStart && rangeEnd && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <p className="text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-2">Range Preview</p>
                    <p className="text-xs text-indigo-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      {Array.from(
                        { length: Math.max(0, parseInt(rangeEnd) - parseInt(rangeStart) + 1) }, 
                        (_, i) => `${rangePrefix}${parseInt(rangeStart) + i}`
                      ).slice(0, 5).join(", ")}
                      {parseInt(rangeEnd) - parseInt(rangeStart) > 4 ? "..." : ""}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Property Type</label>
              <select name="type" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none font-medium">
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {createUnitState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createUnitState.error}</div>}
            <ModalButtons isPending={unitPending} onClose={() => setActiveModal(null)} />
          </form>
        </Modal>
      )}

      {activeModal === "edit-unit" && (
        <Modal 
            title="Edit Unit" 
            desc="Correct unit specifications." 
            onClose={() => { setActiveModal(null); setTargetItem(null); }}
        >
          <form action={editUnitAction} onSubmit={() => { if(!updateUnitState?.error) setActiveModal(null); }} className="space-y-6">
            <input type="hidden" name="id" value={targetItem?.id} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Number</label>
                <input name="unitNumber" defaultValue={targetItem?.unitNumber} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <select name="type" defaultValue={targetItem?.type || "Residential"} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none font-medium">
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
            </div>
            {updateUnitState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{updateUnitState.error}</div>}
            <ModalButtons isPending={editUnitPending} onClose={() => setActiveModal(null)} label="Save Changes" />
          </form>
        </Modal>
      )}

      {activeModal === "delete-confirm" && (
        <Modal 
            title="Confirm Deletion" 
            desc={`This action will permanently remove ${targetItem?.name || 'this item'} from the architectural ledger.`} 
            onClose={() => { setActiveModal(null); setTargetItem(null); setDeleteError(""); }}
        >
          <div className="space-y-6">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4 animate-pulse">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                    <h4 className="font-black text-red-900 text-sm uppercase tracking-tight">Destructive Action</h4>
                    <p className="text-xs text-red-700/80 font-medium leading-relaxed mt-1">
                        Deleting infrastructure components is irreversible. Any associated logic or children may also be affected or orphaned.
                    </p>
                </div>
            </div>

            {deleteError && (
              <div className="p-4 bg-red-100 border border-red-200 text-red-800 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                Error: {deleteError}
              </div>
            )}

            <div className="flex gap-4">
               <button 
                 onClick={() => { setActiveModal(null); setTargetItem(null); setDeleteError(""); }}
                 className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
               >
                 Keep Item
               </button>
               <button 
                 onClick={handleDelete}
                 disabled={isDeleting}
                 className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
               >
                 {isDeleting ? "Purging..." : "Confirm Purge"}
               </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, desc, children, onClose }: { title: string, desc: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-headline leading-none mb-2">{title}</h3>
            <p className="text-sm text-slate-500 font-medium">{desc}</p>
          </div>
          <button onClick={onClose} className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100 border border-slate-100 shadow-sm">
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalButtons({ isPending, onClose, label = "Initialize Component" }: { isPending: boolean, onClose: () => void, label?: string }) {
  return (
    <div className="flex gap-4 pt-4">
      <button 
        type="button"
        onClick={onClose}
        className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
      >
        Discard
      </button>
      <button 
        type="submit"
        disabled={isPending}
        className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
      >
        {isPending ? "Syncing..." : label}
      </button>
    </div>
  );
}
