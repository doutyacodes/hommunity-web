"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Shield, Info } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"super" | "admin">("super");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/buildings");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 blueprint-bg overflow-hidden relative">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#a4c9ff]/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#40e56c]/5 blur-[120px]" />
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[480px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Brand header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <span
              className="material-symbols-outlined text-4xl text-[#a4c9ff]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
            <h1
              className="text-3xl font-black tracking-tighter text-[#a4c9ff] font-headline"
            >
              Hommunity
            </h1>
          </div>
          <p
            className="text-[#8b919d] text-[10px] font-bold uppercase tracking-[0.25em] font-headline"
          >
            Architectural Ledger
          </p>
        </header>

        {/* Glass card */}
        <div className="glass-panel p-8 md:p-10 rounded-2xl shadow-[0px_20px_40px_rgba(0,0,0,0.5)] border border-white/8">
          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#e5e2e1] mb-1 font-headline"
            >
              Admin Portal
            </h2>
            <p className="text-[#8b919d] text-sm">Secure access to the community management ledger.</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Role segmented control */}
            <div className="p-1 bg-[#0e0e0e] rounded-xl flex gap-1">
              {(["super", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={[
                    "flex-1 py-2.5 px-4 text-xs font-bold rounded-lg transition-all duration-300",
                    "uppercase tracking-wider",
                    role === r
                      ? "bg-[#353534] text-[#a4c9ff] shadow-lg"
                      : "text-[#8b919d] hover:text-[#c1c7d3]",
                  + " font-headline"
                  ].join(" ")}
                >
                  {r === "super" ? "Super Admin" : "Admin"}
                </button>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider font-headline"
              >
                Access Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b919d] w-4 h-4" />
                <input
                  type="email"
                  placeholder="admin@hommunity.sys"
                  defaultValue={role === "super" ? "superadmin@hommunity.sys" : "admin@hommunity.sys"}
                  className="w-full bg-[#353534] border-0 rounded-xl py-4 pl-12 pr-4 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider font-headline"
                >
                  Security Key
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-[#a4c9ff] uppercase tracking-wider hover:underline underline-offset-4"
                >
                  Reset Credentials
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b919d] w-4 h-4" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  defaultValue="••••••••••••"
                  className="w-full bg-[#353534] border-0 rounded-xl py-4 pl-12 pr-12 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 transition-all outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b919d] hover:text-[#e5e2e1] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(164,201,255,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(164,201,255,0.4)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 font-headline"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#00315d]/40 border-t-[#00315d] rounded-full animate-spin" />
                  Authorizing...
                </span>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#40e56c] security-pulse shrink-0" />
              <span
                className="text-[10px] font-bold text-[#8b919d] uppercase tracking-widest font-headline"
              >
                System Online
              </span>
            </div>
            <div className="flex gap-3">
              <Shield className="w-4 h-4 text-[#8b919d] hover:text-[#a4c9ff] cursor-pointer transition-colors" />
              <Info className="w-4 h-4 text-[#8b919d] hover:text-[#a4c9ff] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p
            className="text-[10px] font-medium text-[#414751] uppercase tracking-[0.2em] font-headline"
          >
            © 2025 Hommunity Systems • Proprietary Management Software
          </p>
        </footer>
      </main>

      {/* Side architectural graphic */}
      <div className="hidden lg:flex fixed right-0 top-0 bottom-0 w-1/3 p-12 select-none opacity-[0.08] hover:opacity-[0.14] transition-opacity duration-700 flex-col justify-end">
        <div className="border-l border-[#a4c9ff]/30 h-full flex flex-col justify-end pl-8">
          <div className="space-y-4 mb-12">
            {[100, 75, 50, 30].map((w, i) => (
              <div key={i} className="h-0.5 bg-gradient-to-r from-[#a4c9ff]/60 to-transparent" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p
            className="font-black text-7xl text-[#e5e2e1]/5 leading-none font-headline"
          >
            STRUCTURAL<br />INTEGRITY
          </p>
        </div>
      </div>
    </div>
  );
}
