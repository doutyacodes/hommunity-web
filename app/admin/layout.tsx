import { Building2, Layers, Key, Shield, LogOut } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { buildingAdmins, buildings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import SidebarNav from "./sidebar-nav";
import AdminSidebar from "./admin-sidebar";
import MobileHeader from "./mobile-header";

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
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <MobileHeader assignedBuildingName={assignedBuilding?.name} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 fixed inset-y-0 left-0 z-50">
        <AdminSidebar assignedBuildingName={assignedBuilding?.name} />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
