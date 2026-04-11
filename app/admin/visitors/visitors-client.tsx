"use client";

import { useState, useEffect } from "react";
import { 
  Users, Search, Clock, CheckCircle2, XCircle, 
  MapPin, Phone, User, Calendar, QrCode, ArrowRight,
  Filter, Loader2, ExternalLink
} from "lucide-react";
import { format } from "date-fns";

export default function VisitorsClient() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<any>(null);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/visitors');
      const data = await res.json();
      if (data.success) {
        setVisitors(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = visitors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                         v.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
                         v.residentName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || v.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
            Visitor Monitor
          </h1>
          <p className="text-slate-500">
            Real-time visual tracking of all guest arrivals and security pass approvals.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchVisitors}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
          >
            <Loader2 size={14} className={loading ? "animate-spin" : ""} />
            Refresh Log
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-[40px] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by visitor, unit, or host..." 
              className="w-full bg-white border border-slate-100 pl-12 pr-4 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium transition-all shadow-sm"
            />
          </div>
          
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {["ALL", "EXPECTED", "INSIDE", "EXITED"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Visitor</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Destination</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Timing</th>
                <th className="text-left py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                <th className="text-right py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-8 px-8"><div className="h-8 bg-slate-50 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredData.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm border border-slate-200 uppercase">
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 leading-tight">{v.name}</h4>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-tight">{v.category.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-indigo-600" />
                        <span className="font-black text-slate-900 text-sm">Unit {v.unitNumber}</span>
                      </div>
                      <p className="text-slate-400 text-[10px] font-bold">Host: {v.residentName || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="space-y-1">
                      {v.entryTime ? (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={12} />
                          <span className="text-xs font-bold">{format(new Date(v.entryTime), 'h:mm a, d MMM')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Awaiting Entry</span>
                      )}
                      {v.exitTime && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <ArrowRight size={10} />
                          <span className="text-[10px] font-bold">Exited: {format(new Date(v.exitTime), 'h:mm a')}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      v.status === "EXPECTED" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                      v.status === "INSIDE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      v.status === "EXITED" ? "bg-slate-50 text-slate-400 border-slate-100" :
                      "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {v.status === "EXPECTED" ? <Calendar size={12} /> : 
                       v.status === "INSIDE" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {v.status}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button 
                      onClick={() => setSelectedPass(v)}
                      className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-90"
                    >
                      <QrCode size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Search className="mx-auto mb-4 text-slate-200" size={48} />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No visitor logs found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Pass Mockup Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
             {/* Ticket-like cutout effect */}
             <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/40 rounded-full" />
             <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900/40 rounded-full" />
             
             <div className="text-center mb-8">
                <div className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-4">
                  Security Pass
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-headline leading-tight">{selectedPass.name}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1 flex items-center justify-center gap-2">
                  <MapPin size={10} className="text-indigo-600" /> Unit {selectedPass.unitNumber}
                </p>
             </div>

             <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] mb-8 flex flex-col items-center justify-center gap-4 relative">
                <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100">
                   <QrCode size={120} className="text-slate-900" />
                </div>
                <p className="font-black text-indigo-600 tracking-[0.5em] text-lg">{selectedPass.passCode || '654 321'}</p>
                <div className="text-[8px] font-black text-slate-300 uppercase absolute bottom-4">Scan for verification</div>
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-xs">
                   <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Category</span>
                   <span className="font-black text-slate-900 uppercase">{selectedPass.category.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-4">
                   <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Valid For</span>
                   <span className="font-black text-slate-900">Today, {format(new Date(), 'dd MMM')}</span>
                </div>
             </div>

             <button 
               onClick={() => setSelectedPass(null)}
               className="w-full py-4 bg-slate-900 text-white font-black text-[10px] rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-[0.2em]"
             >
               Close Pass
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
