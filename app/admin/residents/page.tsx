import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { buildingAdmins, residents, apartmentResidents, apartments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ResidentsClient from "./residents-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ResidentsPage() {
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
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-slate-100">
          <span className="text-4xl text-slate-300">🏢</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-headline mb-2">No Building Assigned</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Your administrative account is currently not linked to any specific property registry. Please contact your Super Admin.
        </p>
      </div>
    );
  }

  const buildingId = adminBuilding[0].buildingId;

  // Fetch residents with their apartment data
  const residentData = await db.select({
    id: apartmentResidents.id,
    status: apartmentResidents.status,
    type: apartmentResidents.type,
    residentName: residents.name,
    phone: residents.phone,
    email: residents.email,
    unitNumber: apartments.unitNumber,
    apartmentId: apartments.id,
    createdAt: apartmentResidents.createdAt,
  })
  .from(apartmentResidents)
  .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
  .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
  .where(eq(apartments.buildingId, buildingId));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <ResidentsClient initialData={residentData} buildingId={buildingId} />
    </div>
  );
}
