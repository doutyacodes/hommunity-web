"use client";

import { useState } from "react";
import {
  Edit3,
  Check,
  X,
  MapPin,
  LayoutGrid,
  Users,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import { updateBuildingAction } from "@/lib/actions/buildings";

// Dynamic import for Leaflet-dependent component
const StaticMap = dynamic(() => import("./static-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-slate-50 flex flex-col items-center justify-center animate-pulse rounded-[32px]">
      <MapPin size={32} className="text-slate-200" />
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
        Initializing Map...
      </span>
    </div>
  ),
});

interface BuildingDetailClientProps {
  building: any;
  stats: {
    residents: number;
    units: number;
    blocks: number;
  };
}

export default function BuildingDetailClient({
  building,
  stats,
}: BuildingDetailClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const lat = building.latitude ? parseFloat(building.latitude) : 0;
  const lng = building.longitude ? parseFloat(building.longitude) : 0;

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      latitude: formData.get("latitude") as string,
      longitude: formData.get("longitude") as string,
    };

    await updateBuildingAction(building.id, data);
    setIsPending(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex gap-6 items-start">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl rotate-3 shrink-0 relative">
            {building.imageUrl ? (
              <img
                src={building.imageUrl}
                alt={building.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Building2 size={40} />
              </div>
            )}
            <div
              className={`absolute inset-0 bg-blue-600/10 mix-blend-overlay ${building.status === "DISABLED" ? "grayscale" : ""}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline">
                {building.name}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${building.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}
              >
                {building.status}
              </span>
            </div>
            <p className="flex items-center gap-2 text-slate-500 font-medium bg-white w-max px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
              <MapPin size={16} className="text-slate-300" />
              {building.address}
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                <span className="text-xs font-bold text-slate-600">
                  ID:{" "}
                  <span className="text-slate-400 font-mono">
                    {building.id.slice(0, 8)}...
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Added:{" "}
                  {building.createdAt
                    ? new Date(building.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-[20px] font-black text-sm shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Edit3 size={18} />
          Modify Property
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Meta */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0 transition-all duration-500 group-hover:bg-blue-50/50" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-8 font-headline flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-500" />
                Asset Inventory
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Total Residents",
                    value: stats.residents,
                    icon: Users,
                    color: "text-blue-600",
                  },
                  {
                    label: "Residential Units",
                    value: stats.units,
                    icon: LayoutGrid,
                    color: "text-purple-600",
                  },
                  {
                    label: "Building Blocks",
                    value: stats.blocks,
                    icon: Shield,
                    color: "text-amber-600",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between p-5 rounded-[24px] bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <s.icon size={16} className={s.color} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {s.label}
                      </span>
                    </div>
                    <span
                      className={`text-xl font-black font-headline ${s.color}`}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white rounded-[40px] p-10 shadow-xl shadow-blue-200/50 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Shield size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-sm">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black font-headline mb-4">
                Root Node Authorization
              </h3>
              <p className="text-sm text-blue-100/80 font-medium leading-relaxed mb-8">
                You are currently accessing the core identity layer for this
                asset. Full administrative override privileges are active.
              </p>
              <button className="w-full py-4 bg-white text-blue-700 font-black text-[10px] rounded-[18px] hover:bg-blue-50 transition-all uppercase tracking-[1px] shadow-lg active:scale-95">
                Review Operational Integrity
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Map & Data */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-[40px] p-5 shadow-sm min-h-[450px] flex flex-col group">
            <div className="p-6 pb-2">
              <h3 className="text-xl font-black text-slate-900 font-headline flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <MapPin size={20} />
                </div>
                Geospatial Preview
              </h3>
            </div>
            <div className="flex-1 p-3">
              <StaticMap latitude={lat} longitude={lng} />
            </div>
            <div className="p-6 pt-2 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mr-2">
                    Latitude
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono tracking-tighter">
                    {lat.toFixed(6)}
                  </span>
                </div>
                <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase mr-2">
                    Longitude
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-mono tracking-tighter">
                    {lng.toFixed(6)}
                  </span>
                </div>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                Open in Search <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -z-0 opacity-50" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 font-headline leading-tight">
                    Property
                    <br />
                    Redefinition
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 font-medium">
                    Updating node parameters for{" "}
                    <span className="text-slate-900 font-bold">
                      {building.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100 border border-slate-100"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Friendly Name
                  </label>
                  <input
                    name="name"
                    defaultValue={building.name}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Registered Address
                  </label>
                  <textarea
                    name="address"
                    defaultValue={building.address}
                    rows={3}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm transition-all resize-none font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Lat Coordinate
                    </label>
                    <input
                      name="latitude"
                      defaultValue={building.latitude}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm font-mono transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Lon Coordinate
                    </label>
                    <input
                      name="longitude"
                      defaultValue={building.longitude}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-slate-900 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-sm font-mono transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-5 bg-slate-50 text-slate-600 font-black text-xs rounded-[20px] hover:bg-slate-100 transition-all uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-[2] py-5 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-[20px] shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-50"
                  >
                    {isPending ? (
                      "Updating Identity..."
                    ) : (
                      <>
                        <Check size={18} />
                        Apply Synchronization
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Building2({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
