"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2, MapPin, Image as ImageIcon, Users, ChevronLeft,
  Plus, X, Check, Upload, Locate, Info
} from "lucide-react";

const availableAdmins = [
  { id: "a1", name: "Marcus Chen", email: "mchen@hommunity.sys", clearance: 3 },
  { id: "a2", name: "Sarah Williams", email: "swilliams@hommunity.sys", clearance: 3 },
  { id: "a3", name: "James Okoye", email: "jokoye@hommunity.sys", clearance: 2 },
  { id: "a4", name: "Priya Sharma", email: "psharma@hommunity.sys", clearance: 3 },
  { id: "a5", name: "David Nakamura", email: "dnakamura@hommunity.sys", clearance: 2 },
];

const steps = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Media", icon: ImageIcon },
  { id: 4, label: "Assign Admins", icon: Users },
];

export default function NewBuildingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleAdmin = (id: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => router.push("/buildings"), 1400);
  };

  return (
    <div className="min-h-screen bg-[#131313] p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back nav */}
        <Link
          href="/buildings"
          className="inline-flex items-center gap-2 text-[#8b919d] hover:text-[#a4c9ff] transition-colors text-sm font-bold mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Buildings
        </Link>

        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1
            className="text-4xl font-black tracking-tighter text-[#e5e2e1] mb-2 font-headline"
          >
            Register Building
          </h1>
          <p className="text-[#8b919d]">Add a new apartment complex to the Architectural Ledger.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(s.id)}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={[
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                    step === s.id
                      ? "bg-[#a4c9ff] text-[#00315d] shadow-[0_0_20px_rgba(164,201,255,0.4)]"
                      : step > s.id
                      ? "bg-[#40e56c]/20 text-[#40e56c]"
                      : "bg-[#1c1b1b] text-[#8b919d] group-hover:bg-[#2a2a2a]",
                  ].join(" ")}
                >
                  {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span
                  className={[
                    "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                    step === s.id ? "text-[#a4c9ff]" : step > s.id ? "text-[#40e56c]" : "text-[#8b919d]",
                  ].join(" ")}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px mx-3 mb-5">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      background: step > s.id
                        ? "linear-gradient(90deg, #40e56c, #40e56c66)"
                        : "rgba(255,255,255,0.06)",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-[#1c1b1b] rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-xl font-bold text-[#e5e2e1] mb-1 font-headline"
                >
                  Basic Information
                </h2>
                <p className="text-[#8b919d] text-sm">Core identity of this building in the registry.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                  Building Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maple Heights"
                  className="w-full bg-[#353534] border-0 rounded-xl py-4 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                  Full Address *
                </label>
                <input
                  type="text"
                  placeholder="123 Oak Street, Heights District, City 00000"
                  className="w-full bg-[#353534] border-0 rounded-xl py-4 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    placeholder="24"
                    className="w-full bg-[#353534] border-0 rounded-xl py-4 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                    Building Type
                  </label>
                  <select className="w-full bg-[#353534] border-0 rounded-xl py-4 px-5 text-[#e5e2e1] focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm appearance-none">
                    <option>Residential Tower</option>
                    <option>Complex (Multiple Blocks)</option>
                    <option>Mixed Use</option>
                    <option>Gated Community</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this building..."
                  className="w-full bg-[#353534] border-0 rounded-xl py-4 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-xl font-bold text-[#e5e2e1] mb-1 font-headline"
                >
                  Location Data
                </h2>
                <p className="text-[#8b919d] text-sm">GPS coordinates for precise registry mapping.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                    Latitude
                  </label>
                  <div className="relative">
                    <Locate className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b919d] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="40.7128"
                      className="w-full bg-[#353534] border-0 rounded-xl py-4 pl-11 pr-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">
                    Longitude
                  </label>
                  <div className="relative">
                    <Locate className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b919d] w-4 h-4" />
                    <input
                      type="text"
                      placeholder="-74.0060"
                      className="w-full bg-[#353534] border-0 rounded-xl py-4 pl-11 pr-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-[#131313] rounded-2xl h-56 flex items-center justify-center relative overflow-hidden border border-white/5">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(164,201,255,0.08) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(164,201,255,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="relative z-10 text-center">
                  <div className="w-6 h-6 rounded-full bg-[#a4c9ff] mx-auto mb-3 shadow-[0_0_20px_rgba(164,201,255,0.5)] animate-pulse" />
                  <p className="text-[#8b919d] text-sm">Map preview available with coordinates</p>
                  <p className="text-[#414751] text-xs mt-1">Enter lat/lng above to place the marker</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#a4c9ff]/5 rounded-xl border border-[#a4c9ff]/10">
                <Info size={15} className="text-[#a4c9ff] shrink-0 mt-0.5" />
                <p className="text-xs text-[#c1c7d3]">
                  Coordinates are used for map display and proximity features. You can enter them manually or use the detect button.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2
                  className="text-xl font-bold text-[#e5e2e1] mb-1 font-headline"
                >
                  Building Media
                </h2>
                <p className="text-[#8b919d] text-sm">Upload a cover image for the building profile.</p>
              </div>

              {/* Upload area */}
              <div className="border-2 border-dashed border-[#414751] hover:border-[#a4c9ff]/40 transition-colors rounded-2xl p-12 text-center cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-[#a4c9ff]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#a4c9ff]/20 transition-colors">
                  <Upload size={22} className="text-[#a4c9ff]" />
                </div>
                <p className="text-[#e5e2e1] font-bold mb-1">Drop image here or click to browse</p>
                <p className="text-[#8b919d] text-sm">PNG, JPG, WebP up to 10MB</p>
                <button className="mt-4 px-5 py-2 bg-[#353534] hover:bg-[#2a2a2a] text-[#e5e2e1] text-sm font-bold rounded-lg transition-colors">
                  Choose File
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Placeholder thumbnails */}
                {[1, 2].map((n) => (
                  <div key={n} className="bg-[#131313] rounded-xl h-32 flex items-center justify-center border border-white/5">
                    <ImageIcon size={24} className="text-[#414751]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="text-xl font-bold text-[#e5e2e1] mb-1 font-headline"
                  >
                    Assign Administrators
                  </h2>
                  <p className="text-[#8b919d] text-sm">Select admins who will manage this building.</p>
                </div>
                <span className="text-[11px] font-bold bg-[#a4c9ff]/10 text-[#a4c9ff] px-3 py-1.5 rounded-full">
                  {selectedAdmins.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {availableAdmins.map((admin) => {
                  const isSelected = selectedAdmins.includes(admin.id);
                  return (
                    <button
                      key={admin.id}
                      onClick={() => toggleAdmin(admin.id)}
                      className={[
                        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left",
                        isSelected
                          ? "bg-[#a4c9ff]/10 border border-[#a4c9ff]/20"
                          : "bg-[#131313] hover:bg-[#201f1f] border border-transparent",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all",
                          isSelected
                            ? "bg-[#a4c9ff] text-[#00315d]"
                            : "bg-[#353534] text-[#c1c7d3]",
                        ].join(" ")}
                      >
                        {admin.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#e5e2e1]">{admin.name}</p>
                        <p className="text-[11px] text-[#8b919d]">{admin.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#8b919d] bg-[#1c1b1b] px-2 py-1 rounded uppercase">
                          Lvl {admin.clearance}
                        </span>
                        <div
                          className={[
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-[#a4c9ff] border-[#a4c9ff]"
                              : "border-[#414751]",
                          ].join(" ")}
                        >
                          {isSelected && <Check size={11} className="text-[#00315d]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6 animate-in fade-in duration-500 delay-200">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 bg-[#1c1b1b] hover:bg-[#2a2a2a] text-[#e5e2e1] font-bold text-sm rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all font-headline"
            >
              Continue
              <Plus size={16} className="-rotate-45" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all disabled:opacity-70 uppercase tracking-wider font-headline"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#00315d]/30 border-t-[#00315d] rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Register Building
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
