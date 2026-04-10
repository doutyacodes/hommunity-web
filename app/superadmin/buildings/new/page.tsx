"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Building2, MapPin, Image as ImageIcon, ChevronLeft,
  ChevronRight, Check, Upload, Locate, Shield
} from "lucide-react";
import { createBuildingAction } from "@/lib/actions/buildings";

// Disable SSR for Leaflet Map
const MapPicker = dynamic<{
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}>(() => import("./map-picker"), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
      Loading interactive map...
    </div>
  )
});

const steps = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Media", icon: ImageIcon },
];

export default function NewBuildingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("coverImage", file);
    data.append("type", "photo");

    try {
      const res = await fetch("https://wowfy.in/wowfy_app_codebase/upload.php", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      
      if (json.success && json.filePath) {
        const fullUrl = `https://wowfy.in/wowfy_app_codebase/photos/${json.filePath}`;
        updateForm("imageUrl", fullUrl);
      } else {
        alert("Image upload failed: " + (json.error || "Unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error during upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = () => {
    setErrorMsg("");
    if (!formData.name || !formData.address) {
      setErrorMsg("Property Name and Full Address are required before saving.");
      setStep(1);
      return;
    }

    startTransition(async () => {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("address", formData.address);
      payload.append("description", formData.description);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append("imageUrl", formData.imageUrl);

      const res = await createBuildingAction(null, payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.success) {
        router.push("/superadmin/buildings");
      }
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto w-full">
      {/* Back nav */}
      <Link
        href="/superadmin/buildings"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold mb-8 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Registry
      </Link>

      {/* Header */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 font-headline">
          Register Property Node
        </h1>
        <p className="text-slate-500">Initialize a new building into the global ledger safely.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-3">
          <Shield size={18} />
          {errorMsg}
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              onClick={() => setStep(s.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={[
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border",
                  step === s.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                    : step > s.id
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50 cursor-pointer",
                ].join(" ")}
              >
                {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
              </div>
              <span
                className={[
                  "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                  step === s.id ? "text-blue-600" : step > s.id ? "text-green-600" : "text-slate-400",
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
                      ? "linear-gradient(90deg, #16a34a, rgba(22, 163, 74, 0.2))"
                      : "#e2e8f0",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1 font-headline">Basic Information</h2>
              <p className="text-slate-500 text-sm">Core identity of this building in the registry.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Property Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateForm("name", e.target.value)}
                placeholder="e.g. Maple Heights"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateForm("address", e.target.value)}
                placeholder="123 Oak Street, Heights District, City 00000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Brief description of this building..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm resize-none shadow-sm"
              />
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
              <Shield className="text-blue-600 shrink-0" size={18} />
              <p className="text-xs text-blue-800">
                <strong className="block mb-1">Architecture Note</strong>
                Blocks, Floors, and Admins are populated separately after this node is registered.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1 font-headline">Location Data</h2>
              <p className="text-slate-500 text-sm">Drag the map or type to pinpoint the exact property coordinate.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Latitude</label>
                <div className="relative">
                  <Locate className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => updateForm("latitude", e.target.value)}
                    placeholder="40.7128"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Longitude</label>
                <div className="relative">
                  <Locate className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => updateForm("longitude", e.target.value)}
                    placeholder="-74.0060"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl h-[400px] relative overflow-hidden border border-slate-300 shadow-inner group">
              <MapPicker 
                latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                onChange={(lat, lng) => {
                  updateForm("latitude", lat.toFixed(6));
                  updateForm("longitude", lng.toFixed(6));
                }}
              />
              <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur pointer-events-none px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
                <MapPin size={12} className="text-blue-600" />
                Click anywhere to drop pin
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1 font-headline">Property Media</h2>
              <p className="text-slate-500 text-sm">Upload a cover image directly to wowfy.in server.</p>
            </div>

            <label className="relative border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl p-12 text-center block cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImage}
              />
              
              {uploadingImage ? (
                <div className="py-6">
                  <span className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto block mb-3" />
                  <p className="text-blue-600 font-bold">Uploading Cover...</p>
                </div>
              ) : formData.imageUrl ? (
                <div className="relative w-full overflow-hidden rounded-xl bg-slate-200">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={formData.imageUrl} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2">
                    <Upload size={18} /> Replace Image
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-sm">
                    <Upload size={22} className="text-blue-600" />
                  </div>
                  <p className="text-slate-900 font-bold mb-1">Click to browse or drop an image</p>
                  <p className="text-slate-500 text-sm mb-4">PNG, JPG, WebP up to 10MB</p>
                  <span className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg shadow-sm">Choose File</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70 font-headline uppercase"
          >
            {isPending ? "Processing..." : "Register Property Node"}
            {!isPending && <Check size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
