import { Shield, Users, Server, Building2, MapPin, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { buildings, admins, globalRules } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboard() {
  const allBuildings = await db.select().from(buildings).orderBy(desc(buildings.createdAt));
  const localAdmins = await db.select().from(admins).where(eq(admins.role, "ADMIN"));
  const [rulesCount] = await db.select({ count: sql<number>`count(*)` }).from(globalRules);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 font-headline mb-2">
          Global Operations
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Complete network overview of the Hommunity Ledger. Monitor system-wide health, active administrative nodes, and security rule enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Active Nodes", value: allBuildings.length.toString(), icon: Server, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
          { label: "System Admins", value: localAdmins.length.toString(), icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
          { label: "Security Rules", value: rulesCount.count.toString(), icon: Shield, color: "text-green-600", bg: "bg-green-50 border-green-200" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${stat.bg} ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 font-headline">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-3xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-headline">Recent Registry Logs</h3>
            <Link href="/superadmin/buildings" className="text-xs font-bold text-blue-600 hover:underline underline-offset-4 flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          
          {allBuildings.length > 0 ? (
            <div className="space-y-4">
              {allBuildings.slice(0, 3).map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{b.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {b.address}
                    </p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Just now'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <Activity size={32} className="text-slate-400 mb-3" />
              <p className="text-sm font-bold text-slate-600">No recent network activity</p>
              <p className="text-xs text-slate-400 mt-1">System running optimally.</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8">
          <h3 className="text-lg font-bold text-slate-900 font-headline mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/buildings/new" className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Server size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Register Building</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Initialize a new secure node.</p>
              </div>
            </Link>
            <Link href="/superadmin/admins" className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:shadow-sm transition-all group">
              <div className="w-10 h-10 bg-purple-50 border border-purple-200 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Manage Admins</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Revoke or assign clearance.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
