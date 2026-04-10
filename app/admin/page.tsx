import { db } from "@/lib/db";
import { buildings, buildingAdmins, blocks, floors, apartments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import InfrastructureClient from "./infrastructure-client";

export const dynamic = "force-dynamic";

export default async function LocalAdminDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  // Fetch assigned building
  const [assignedBuilding] = await db
    .select()
    .from(buildingAdmins)
    .innerJoin(buildings, eq(buildingAdmins.buildingId, buildings.id))
    .where(eq(buildingAdmins.adminId, session.adminId as string))
    .limit(1);

  if (!assignedBuilding) {
    return (
      <div className="p-10 text-center animate-in fade-in duration-500">
        <h2 className="text-2xl font-black text-slate-900 font-headline">No Building Assigned</h2>
        <p className="text-slate-500 mt-2">Contact a Superadmin to link your account to a property.</p>
      </div>
    );
  }

  const buildingId = assignedBuilding.buildings.id;

  // Fetch Infrastructure data
  const buildingBlocks = await db.select().from(blocks).where(eq(blocks.buildingId, buildingId));
  const buildingFloors = await db.select().from(floors).where(eq(floors.buildingId, buildingId));
  const buildingUnits = await db.select().from(apartments).where(eq(apartments.buildingId, buildingId));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <InfrastructureClient 
        buildingId={buildingId}
        data={{
          blocks: buildingBlocks,
          floors: buildingFloors,
          apartments: buildingUnits
        }}
      />
    </div>
  );
}
