import { db } from "@/lib/db";
import { buildings, admins } from "@/lib/db/schema";
import { BuildingListClient } from "./client-list";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BuildingsPage() {
  const allBuildings = await db.select().from(buildings).orderBy(buildings.createdAt);
  const allAdmins = await db.select().from(admins);
  const session = await getSession();
  
  const isSuperAdmin = session?.role === "SUPERADMIN";

  return (
    <BuildingListClient 
      initialBuildings={allBuildings} 
      adminCount={allAdmins.length} 
      isSuperAdmin={isSuperAdmin}
    />
  );
}
