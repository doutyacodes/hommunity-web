import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, apartments, residents, buildingAdmins } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = (session as any).id || (session as any).adminId;
    const [adminBuilding] = await db.select()
      .from(buildingAdmins)
      .where(eq(buildingAdmins.adminId, adminId))
      .limit(1);

    if (!adminBuilding) {
      return NextResponse.json({ error: "No building assigned" }, { status: 403 });
    }

    const buildingId = adminBuilding.buildingId;

    // Fetch all visitors for this building
    const allVisitors = await db.select({
      id: visitors.id,
      name: visitors.name,
      phone: visitors.phone,
      category: visitors.visitorCategory,
      status: visitors.status,
      entryTime: visitors.entryTime,
      exitTime: visitors.exitTime,
      passCode: visitors.passCode,
      unitNumber: apartments.unitNumber,
      residentName: residents.name,
    })
    .from(visitors)
    .innerJoin(apartments, eq(visitors.apartmentId, apartments.id))
    .leftJoin(residents, eq(visitors.invitedByResidentId, residents.id))
    .where(eq(visitors.buildingId, buildingId))
    .orderBy(desc(visitors.updatedAt));

    return NextResponse.json({
      success: true,
      data: allVisitors
    });

  } catch (error) {
    console.error("Admin Visitors API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
