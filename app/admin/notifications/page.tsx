"use client";

import { useState } from "react";
import { Send, Terminal, AlertCircle, CheckCircle2 } from "lucide-react";
import { sendManualNotificationAction } from "@/lib/actions/notifications";

export default function NotificationTestPage() {
  const [result, setResult] = useState<{ success?: boolean; error?: string; messageId?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const resp = await sendManualNotificationAction(formData);
      setResult(resp);
    } catch (e: any) {
      setResult({ error: e.message || "Action failed" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Push Notification Debugger</h1>
        <p className="text-slate-500 font-medium mt-1">
          Manually trigger FCM messages to test device connectivity and app behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <form action={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FCM Device Token</label>
              <input 
                name="token" 
                required 
                placeholder="Paste token from app console..." 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium text-sm" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notification Title</label>
                <input 
                  name="title" 
                  required 
                  placeholder="e.g. Test Alert" 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Body</label>
                <input 
                  name="body" 
                  required 
                  placeholder="e.g. Hello from Hommunity!" 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Data Payload (JSON)</label>
                <span className="text-[9px] font-bold text-slate-300 uppercase">Optional</span>
              </div>
              <textarea 
                name="payload" 
                rows={4}
                placeholder='{"type": "notice", "referenceId": "123"}' 
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-mono text-xs" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white p-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-100"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Test Notification
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`p-6 rounded-3xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
              result.success ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
            }`}>
              <div className="flex gap-4">
                {result.success ? (
                  <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                ) : (
                  <AlertCircle className="text-rose-500 shrink-0" size={24} />
                )}
                <div className="space-y-1">
                  <h3 className={`font-bold text-sm ${result.success ? "text-emerald-900" : "text-rose-900"}`}>
                    {result.success ? "Notification Dispatched" : "Dispatch Failed"}
                  </h3>
                  <p className={`text-xs font-medium ${result.success ? "text-emerald-700" : "text-rose-700"}`}>
                    {result.success ? `Message ID: ${result.messageId}` : result.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <Terminal size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">How to use</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400 italic">1. Get the token from your Flutter console:</p>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 font-mono text-[10px] text-indigo-300">
                  FCM DEVICE TOKEN FOR TESTING UI:
                  <br/>
                  <span className="text-white">ey...123-abc</span>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                2. Paste that token into the form and provide a title and body.
              </p>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                3. If the Android phone handles background messages, you will see a notification or a CallKit overlay.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 space-y-3">
             <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Debug Checklist</h4>
             <ul className="space-y-2">
                {[
                  "Is the device online?",
                  "Is notification permission granted?",
                  "Check Firebase console project ID",
                  "Are server environment variables correct?",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-medium text-indigo-700">
                    <div className="h-1 w-1 bg-indigo-400 rounded-full" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
