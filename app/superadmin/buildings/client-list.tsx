"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, MapPin, Users, Shield, Plus, Search,
  ChevronRight, LayoutGrid, Edit3, Power, X, Check
} from "lucide-react";
import { toggleBuildingStatusAction, updateBuildingAction } from "@/lib/actions/buildings";

export function BuildingListClient({ 
  initialBuildings, 
  adminCount = 0,
  isSuperAdmin = false
}: { 
  initialBuildings: any[], 
  adminCount?: number,
  isSuperAdmin?: boolean
}) {
  const [search, setSearch] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [editBuilding, setEditBuilding] = useState<any | null>(null);

  const filtered = initialBuildings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = async (id: string, currentStatus: "ACTIVE" | "DISABLED") => {
    if (confirm(`Are you sure you want to ${currentStatus === 'ACTIVE' ? 'disable' : 'enable'} this building?`)) {
      setIsPending(true);
      await toggleBuildingStatusAction(id, currentStatus);
      setIsPending(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editBuilding) return;
    
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      latitude: formData.get("latitude") as string,
      longitude: formData.get("longitude") as string,
    };

    await updateBuildingAction(editBuilding.id, data);
    setEditBuilding(null);
    setIsPending(false);
  };

  const stats = [
    { label: "Total Buildings", value: initialBuildings.length.toString(), icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Residents", value: "—", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Units", value: "—", icon: LayoutGrid, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Admins", value: adminCount.toString(), icon: Shield, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className={`p-6 md:p-10 max-w-7xl mx-auto w-full ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header Section */}
      <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-3">
              <span>Registry</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-400">Directory</span>
            </nav>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 font-headline">
              Building Registry
            </h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xl">
              Manage all community complexes, monitor their active capacities, and configure their administrative roles from this central command dashboard.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..."
                className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all shadow-sm"
              />
            </div>
            {isSuperAdmin && (
              <Link
                href="/superadmin/buildings/new"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Property</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none font-headline">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Dense List View */}
      <section className="animate-in fade-in duration-500 delay-200">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-slate-900 text-lg font-headline">Property Listings</h3>
          <p className="text-sm text-slate-500 font-medium">
            <span className="text-slate-900 font-bold">{filtered.length}</span> results found
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-12 md:col-span-9 px-2">Property Name & Location</div>
            <div className="hidden md:block col-span-3 text-right px-2">Action</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((b, i) => {
              const detailHref = isSuperAdmin ? `/superadmin/buildings/${b.id}` : `/buildings/${b.id}`;
              return (
                <div key={b.id} className={`group relative flex flex-col md:grid md:grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors ${b.status === 'DISABLED' ? 'opacity-60 grayscale-[0.3]' : ''}`}>
                  <div className="col-span-12 md:col-span-9 flex items-center gap-4 w-full px-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
                      {b.imageUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.imageUrl} alt={b.name} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <Building2 size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={detailHref} className="inline-block">
                          <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate">
                            {b.name}
                          </h4>
                        </Link>
                        {b.status === 'DISABLED' && (
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-widest">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{b.address || "No address provided"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:flex col-span-3 items-center justify-end gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isSuperAdmin && (
                      <>
                        <button 
                          onClick={() => setEditBuilding(b)}
                          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm"
                          title="Edit Building"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(b.id, b.status)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-sm transition-all ${b.status === 'ACTIVE' ? 'bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50' : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'}`}
                          title={b.status === 'ACTIVE' ? 'Disable Building' : 'Enable Building'}
                        >
                          <Power size={16} />
                        </button>
                      </>
                    )}
                    <Link 
                      href={detailHref}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 group-hover:bg-blue-50 transition-all shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                  
                  <Link href={detailHref} className="absolute inset-0 md:hidden z-10"><span className="sr-only">View</span></Link>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-900">No properties found</h3>
                <p className="text-xs text-slate-500 mt-1">Ready to scale the platform? Click Add Property.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editBuilding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-headline">Edit Property</h3>
                <p className="text-sm text-slate-500 mt-1">Update core details for {editBuilding.name}</p>
              </div>
              <button 
                onClick={() => setEditBuilding(null)}
                className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Building Name</label>
                <input 
                  name="name"
                  defaultValue={editBuilding.name}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Address</label>
                <textarea 
                  name="address"
                  defaultValue={editBuilding.address}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Latitude</label>
                  <input 
                    name="latitude"
                    defaultValue={editBuilding.latitude}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Longitude</label>
                  <input 
                    name="longitude"
                    defaultValue={editBuilding.longitude}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button"
                  onClick={() => setEditBuilding(null)}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 px-8"
                >
                  {isPending ? "Updating Asset..." : (
                    <>
                      <Check size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
