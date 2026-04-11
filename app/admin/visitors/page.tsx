import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { buildingAdmins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import VisitorsClient from "./visitors-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VisitorsAdminPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const adminId = (session as any).id || (session as any).adminId;
  const adminBuilding = await db.select()
    .from(buildingAdmins)
    .where(eq(buildingAdmins.adminId, adminId))
    .limit(1);
  
  if (adminBuilding.length === 0) {
    return <div className="p-20 text-center text-slate-500">No Building Assigned</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <VisitorsClient />
    </div>
  );
}
