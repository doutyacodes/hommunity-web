import { db } from "@/lib/db";
import { admins, buildings, buildingAdmins } from "@/lib/db/schema";
import { ClientAdminsView } from "./client-admins";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function SystemAdminsPage() {
  // Fetch active Local Admins (not SUPERADMIN)
  const localAdmins = await db.select().from(admins).where(eq(admins.role, "ADMIN"));
  
  // Fetch Buildings to populate drop-down for provisioning
  const availableBuildings = await db.select().from(buildings);
  
  // Fetch associations to map where admins are
  const assignments = await db.select().from(buildingAdmins);

  return (
    <ClientAdminsView 
      admins={localAdmins} 
      buildings={availableBuildings} 
      assignments={assignments} 
    />
  );
}
