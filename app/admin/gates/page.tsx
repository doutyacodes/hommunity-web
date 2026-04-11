import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { buildingAdmins, gates, guards, securityShifts, securityShiftDays } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import GatesClient from "./gates-client";

export const dynamic = "force-dynamic";

export default async function GatesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const adminId = (session as any).id || (session as any).adminId;
  const adminBuilding = await db
    .select()
    .from(buildingAdmins)
    .where(eq(buildingAdmins.adminId, adminId))
    .limit(1);

  if (adminBuilding.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <span className="text-4xl text-slate-300">🏢</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-headline mb-2">
          No Building Assigned
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Your administrative account is currently not linked to any specific
          property registry.
        </p>
      </div>
    );
  }

  const buildingId = adminBuilding[0].buildingId;

  const gateData = await db
    .select()
    .from(gates)
    .where(eq(gates.buildingId, buildingId));
  const guardData = await db
    .select()
    .from(guards)
    .where(eq(guards.buildingId, buildingId));

  // Fetch shifts for these guards
  type Guard = {
    id: number; // or string depending on your DB
  };

  const guardIds = guardData.map((g: Guard) => g.id);
  const shiftData =
    guardIds.length > 0
      ? await (async () => {
        const shifts = await db
          .select()
          .from(securityShifts)
          .where(inArray(securityShifts.guardId, guardIds));
        
        // Fetch days for these shifts
        const shiftIds = shifts.map((s: any) => s.id);
        const shiftDays = shiftIds.length > 0 
          ? await db.select().from(securityShiftDays).where(inArray(securityShiftDays.shiftId, shiftIds))
          : [];

        // Map days back to shifts as a comma-separated string for compatibility with GatesClient
        return shifts.map((s: any) => ({
          ...s,
          days: shiftDays.filter((sd: any) => sd.shiftId === s.id).map((sd: any) => sd.day).join(',')
        }));
      })()
    : [];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <GatesClient
        initialGates={gateData}
        initialGuards={guardData}
        initialShifts={shiftData}
        buildingId={buildingId}
      />
    </div>
  );
}
