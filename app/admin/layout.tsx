import { Building2, Layers, Key, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { buildingAdmins, buildings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import SidebarNav from "./sidebar-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/superadmin");
  }

  // Fetch assigned building
  const [assignedBuilding] = await db
    .select({ name: buildings.name })
    .from(buildingAdmins)
    .innerJoin(buildings, eq(buildingAdmins.buildingId, buildings.id))
    .where(eq(buildingAdmins.adminId, session.adminId as string))
    .limit(1);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen fixed left-0 top-0 text-slate-900 shadow-sm z-50 animate-in slide-in-from-left duration-500">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <Shield size={16} />
          </div>
          <span className="font-black text-sm tracking-wide font-headline">Local Admin</span>
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Building</p>
            <p className="text-xs font-black text-slate-900 truncate">{assignedBuilding?.name || "No Building Linked"}</p>
          </div>
          <Link 
            href="/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-600 font-bold hover:text-red-700 border border-transparent hover:border-red-200 transition-all text-sm group"
          >
            <LogOut size={16} className="text-slate-400 group-hover:text-red-600" />
            Logout
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
