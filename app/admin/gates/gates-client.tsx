"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
import { 
  Shield, Plus, X, Pencil, Trash2, MapPin, 
  DoorOpen, Check, AlertCircle, ChevronRight,
  Users, Phone, Mail, Lock, UserCog
} from "lucide-react";
import { createGateAction, updateGateAction, deleteGateAction } from "@/lib/actions/gates";
import { createGuardAction, updateGuardAction, deleteGuardAction } from "@/lib/actions/guards";
import { createShiftAction, deleteShiftAction } from "@/lib/actions/shifts";
import { useRouter } from "next/navigation";

interface GatesClientProps {
  initialGates: any[];
  initialGuards: any[];
  initialShifts: any[];
  buildingId: string;
}

export default function GatesClient({ initialGates, initialGuards, initialShifts, buildingId }: GatesClientProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"create-gate" | "edit-gate" | "delete-gate" | "create-guard" | "edit-guard" | "delete-guard" | null>(null);
  const [targetItem, setTargetItem] = useState<any>(null);
  const [isDeleting, startDeletion] = useTransition();

  const [createGateState, createGateActionWrap, createGatePending] = useActionState<any, FormData>(createGateAction, null);
  const [updateGateState, editGateActionWrap, editGatePending] = useActionState<any, FormData>(updateGateAction, null);
  
  const [createGuardState, createGuardActionWrap, createGuardPending] = useActionState<any, FormData>(createGuardAction, null);
  const [updateGuardState, editGuardActionWrap, editGuardPending] = useActionState<any, FormData>(updateGuardAction, null);
  
  const [createShiftState, createShiftActionWrap, createShiftPending] = useActionState<any, FormData>(createShiftAction, null);

  useEffect(() => {
    if (createGateState?.success || updateGateState?.success || createGuardState?.success || updateGuardState?.success || createShiftState?.success) {
      setActiveModal(null);
      setTargetItem(null);
      router.refresh();
    }
  }, [createGateState, updateGateState, createGuardState, updateGuardState, createShiftState, router]);

  const handleDeleteGate = async () => {
    startDeletion(async () => {
      const res = await deleteGateAction(targetItem.id);
      if (res.success) {
        setActiveModal(null);
        setTargetItem(null);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteGuard = async () => {
    startDeletion(async () => {
      const res = await deleteGuardAction(targetItem.id);
      if (res.success) {
        setActiveModal(null);
        setTargetItem(null);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleEndShift = async (shiftId: string) => {
    if (confirm("End this guard's active shift?")) {
      startDeletion(async () => {
        const res = await deleteShiftAction(shiftId);
        if (res.success) {
          router.refresh();
        } else {
          alert(res.error);
        }
      });
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Gates Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
              Gates Management
            </h1>
            <p className="text-slate-500">
              Configure physical access points and entry protocols.
            </p>
          </div>
          <button 
            onClick={() => setActiveModal("create-gate")}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex-shrink-0 active:scale-95"
          >
            <Plus size={16} /> Define New Gate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialGates.map((gate) => (
            <div key={gate.id} className="group bg-white border border-slate-200 rounded-[40px] p-8 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <DoorOpen size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setTargetItem(gate); setActiveModal("edit-gate"); }}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => { setTargetItem(gate); setActiveModal("delete-gate"); }}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 font-headline uppercase tracking-tight mb-2">
                {gate.name}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Shield size={12} className="text-indigo-500" /> Authorized Access Point
              </div>

               <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                   {initialShifts.filter(s => s.gateId === gate.id).map(shift => {
                      const guard = initialGuards.find(g => g.id === shift.guardId);
                      const days = shift.days.split(',').map((d: string) => d.charAt(0)).join('/');
                      return (
                        <div key={shift.id} className="relative group/avatar">
                          <button 
                            onClick={() => handleEndShift(shift.id)}
                            className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                            title={`End shift for ${guard?.name || 'Unknown'}`}
                          >
                            {guard?.name?.charAt(0).toUpperCase() || '?'}
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded-[10px] font-bold shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="flex flex-col gap-0.5 whitespace-nowrap">
                              <span>{guard?.name}</span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-tighter">{days} • {shift.startTime} - {shift.endTime}</span>
                            </div>
                          </div>
                        </div>
                      )
                   })}
                   <button 
                    onClick={() => { setTargetItem(gate); setActiveModal("assign-guard" as any); }}
                    className="w-8 h-8 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer"
                    title="Assign Guard"
                   >
                    <Plus size={12} />
                   </button>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Monitoring</span>
              </div>
            </div>
          ))}

          {initialGates.length === 0 && (
            <div className="col-span-full py-20 bg-slate-50/50 border border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm mb-6 border border-slate-100">
                <MapPin size={32} />
              </div>
              <h4 className="text-xl font-black text-slate-900 font-headline uppercase tracking-tight mb-2">No Gates Defined</h4>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">
                Identify the entry points for your property.
              </p>
              <button 
                onClick={() => setActiveModal("create-gate")}
                className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
              >
                Add first gate <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Security Personnel Section */}
      <section className="space-y-8 pt-10 border-t border-slate-200">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
              Security Personnel
            </h2>
            <p className="text-slate-500">
              Manage the security guards and team members for your building.
            </p>
          </div>
          <button 
            onClick={() => setActiveModal("create-guard")}
            className="flex items-center gap-3 bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex-shrink-0 active:scale-95"
          >
            <UserCog size={16} /> Register Guard
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Guard Name</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact Info</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialGuards.map((guard) => (
                <tr key={guard.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-transparent group-hover:border-indigo-100 shadow-sm">
                        {guard.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">{guard.name}</h4>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                        <Phone size={14} className="text-slate-400" /> {guard.phone}
                      </div>
                      {initialShifts.find(s => s.guardId === guard.id) ? (
                        <div className="flex flex-col gap-1 mt-2">
                           <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[9px] uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-max">
                              In-Shift: {initialGates.find(g => g.id === initialShifts.find(s => s.guardId === guard.id).gateId)?.name}
                           </div>
                           <div className="text-[8px] text-slate-400 font-bold uppercase tracking-tight ml-1">
                              {initialShifts.find(s => s.guardId === guard.id).days.split(',').join('/')} • {initialShifts.find(s => s.guardId === guard.id).startTime}-{initialShifts.find(s => s.guardId === guard.id).endTime}
                           </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[9px] uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded w-max mt-2">
                           Off-Duty
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setTargetItem(guard); setActiveModal("edit-guard"); }}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-blue-600 hover:border-blue-100 transition-all hover:bg-blue-50 active:scale-90"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => { setTargetItem(guard); setActiveModal("delete-guard"); }}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-red-600 hover:border-red-100 transition-all hover:bg-red-50 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialGuards.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
                      <Users size={32} />
                    </div>
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs font-headline">No security guards registered yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODALS */}
      
      {/* Create Gate Modal */}
      {activeModal === "create-gate" && (
        <Modal title="Define Gate" desc="Register a new entry point." onClose={() => setActiveModal(null)}>
          <form action={createGateActionWrap} className="space-y-6">
            <input type="hidden" name="buildingId" value={buildingId} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gate Name</label>
              <input name="name" required placeholder="e.g. Main Entry Gate A" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
            </div>
            {createGateState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createGateState.error}</div>}
            <ModalButtons isPending={createGatePending} onClose={() => setActiveModal(null)} label="Register Gate" />
          </form>
        </Modal>
      )}

      {/* Edit Gate Modal */}
      {activeModal === "edit-gate" && (
        <Modal title="Refine Gate" desc="Update gate identity." onClose={() => setActiveModal(null)}>
          <form action={editGateActionWrap} className="space-y-6">
            <input type="hidden" name="id" value={targetItem?.id} />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gate Name</label>
              <input name="name" defaultValue={targetItem?.name} required placeholder="e.g. West Exit" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
            </div>
            {updateGateState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{updateGateState.error}</div>}
            <ModalButtons isPending={editGatePending} onClose={() => setActiveModal(null)} label="Save Changes" />
          </form>
        </Modal>
      )}

      {/* Delete Gate Modal */}
      {activeModal === "delete-gate" && (
        <Modal title="Decommission Gate" desc="Permanently remove this access point." onClose={() => setActiveModal(null)}>
          <div className="space-y-8">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-black text-red-900 text-sm uppercase tracking-tight">Security Notice</h4>
                <p className="text-xs text-red-700/80 font-medium leading-relaxed mt-1">
                  Removing a gate will unlink associated shifts. This action is final.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest">Cancel</button>
              <button onClick={handleDeleteGate} disabled={isDeleting} className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-red-200 transition-all uppercase tracking-widest disabled:opacity-50">
                {isDeleting ? "Removing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Guard Modal */}
      {activeModal === "create-guard" && (
        <Modal title="Register Staff" desc="Add a new security professional to the building pool." onClose={() => setActiveModal(null)}>
          <form action={createGuardActionWrap} className="space-y-6">
            <input type="hidden" name="buildingId" value={buildingId} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="name" required placeholder="Guard Name" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input name="phone" required placeholder="+1234..." className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email <span className="opacity-40">(Opt)</span></label>
                <input name="email" type="email" placeholder="email@example.com" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile App Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input name="password" type="password" required placeholder="Minimum 6 characters" className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
                </div>
              </div>
            </div>
            {createGuardState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createGuardState.error}</div>}
            <ModalButtons isPending={createGuardPending} onClose={() => setActiveModal(null)} label="Register Personnel" />
          </form>
        </Modal>
      )}

      {/* Edit Guard Modal */}
      {activeModal === "edit-guard" && (
        <Modal title="Update Staff" desc="Refine security personnel details." onClose={() => setActiveModal(null)}>
          <form action={editGuardActionWrap} className="space-y-6">
            <input type="hidden" name="id" value={targetItem?.id} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="name" defaultValue={targetItem?.name} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input name="phone" defaultValue={targetItem?.phone} required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input name="email" defaultValue={targetItem?.email} type="email" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Password <span className="text-[9px] opacity-40 lowercase">(leave blank to keep current)</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input name="password" type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
                </div>
              </div>
            </div>
            {updateGuardState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{updateGuardState.error}</div>}
            <ModalButtons isPending={editGuardPending} onClose={() => setActiveModal(null)} label="Update Personnel" />
          </form>
        </Modal>
      )}

      {/* Delete Guard Modal */}
      {activeModal === "delete-guard" && (
        <Modal title="Remove Personnel" desc="Revoke mobile app access for this guard." onClose={() => setActiveModal(null)}>
          <div className="space-y-8">
            <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-black text-red-900 text-sm uppercase tracking-tight">Revocation Notice</h4>
                <p className="text-xs text-red-700/80 font-medium leading-relaxed mt-1">
                  This guard will be immediately logged out and unable to access the property monitoring systems.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest">Cancel</button>
              <button onClick={handleDeleteGuard} disabled={isDeleting} className="flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-red-200 transition-all uppercase tracking-widest disabled:opacity-50">
                {isDeleting ? "Revoking..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Guard Modal */}
      {activeModal === ("assign-guard" as any) && (
        <Modal title="Weekly Deployment" desc={`Configure schedule for ${targetItem?.name}`} onClose={() => setActiveModal(null)}>
          <form action={createShiftActionWrap} className="space-y-6">
            <input type="hidden" name="gateId" value={targetItem?.id} />
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Security Guard</label>
              <select name="guardId" required defaultValue="" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all appearance-none">
                <option value="" disabled>Choose from staff pool...</option>
                {initialGuards.map(guard => (
                  <option key={guard.id} value={guard.id}>{guard.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Days</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Mon", value: "MON" },
                  { label: "Tue", value: "TUE" },
                  { label: "Wed", value: "WED" },
                  { label: "Thu", value: "THU" },
                  { label: "Fri", value: "FRI" },
                  { label: "Sat", value: "SAT" },
                  { label: "Sun", value: "SUN" },
                ].map((day) => (
                  <label key={day.value} className="relative group cursor-pointer inline-flex items-center">
                    <input type="checkbox" name="days" value={day.value} className="peer sr-only" />
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all group-hover:border-indigo-200">
                      {day.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Start</label>
                <input name="startTime" type="time" required defaultValue="05:00" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily End</label>
                <input name="endTime" type="time" required defaultValue="14:00" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all" />
              </div>
            </div>

            {createShiftState?.error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-bold">{createShiftState.error}</div>}
            <ModalButtons isPending={createShiftPending} onClose={() => setActiveModal(null)} label="Confirm Schedule" />
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, desc, children, onClose }: { title: string, desc: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 font-headline leading-none mb-2 lowercase first-letter:uppercase">{title}</h3>
            <p className="text-sm text-slate-500 font-medium">{desc}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalButtons({ isPending, onClose, label = "Save" }: { isPending: boolean, onClose: () => void, label?: string }) {
  return (
    <div className="flex gap-4 pt-4">
      <button 
        type="button" 
        onClick={onClose} 
        className="flex-1 py-4 bg-slate-50 text-slate-600 font-black text-[10px] rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={isPending}
        className="flex-[2] py-4 bg-indigo-600 hover:bg-slate-900 text-white font-black text-[10px] rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
      >
        {isPending ? "Syncing..." : label}
      </button>
    </div>
  );
}
