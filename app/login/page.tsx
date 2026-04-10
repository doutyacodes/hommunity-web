"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Shield, Info, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"super" | "admin">("super");
  const [showPass, setShowPass] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg("");

    startTransition(async () => {
      const result = await loginAdmin(null, formData);
      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success) {
        if (result.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/superadmin/buildings");
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/20 blur-[120px] pointer-events-none" />

      {/* Login Container */}
      <main className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Glass card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200">
          {/* Brand header */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm mb-4">
              <span
                className="material-symbols-outlined text-4xl text-blue-600"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                domain
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline mb-1">
              Hommunity
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Architectural Ledger Portal
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Role segmented control */}
            <div className="p-1 bg-slate-100 rounded-xl flex gap-1 border border-slate-200 shadow-inner">
              {(["super", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={[
                    "flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all duration-300",
                    "uppercase tracking-wider font-headline",
                    role === r
                      ? "bg-white text-blue-700 shadow border border-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
                  ].join(" ")}
                >
                  {r === "super" ? "Super Admin" : "Local Admin"}
                </button>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Access Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@hommunity.sys"
                  defaultValue={role === "super" ? "superadmin@hommunity.com" : "admin@hommunity.com"}
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Security Key
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline underline-offset-4"
                >
                  Reset Key
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  defaultValue="Apple@123"
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3.5 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 font-headline tracking-wide"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Authorizing...
                </>
              ) : (
                <>
                  Authorize Session
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Status */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse border border-green-200" />
              <span className="text-[9px] font-bold text-green-700 uppercase tracking-widest">
                Network Secure
              </span>
            </div>
            <div className="flex gap-2">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer transition-colors shadow-sm">
                <Shield className="w-4 h-4" />
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer transition-colors shadow-sm">
                <Info className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2026 Hommunity Systems • Proprietary Software
          </p>
        </footer>
      </main>
    </div>
  );
}
