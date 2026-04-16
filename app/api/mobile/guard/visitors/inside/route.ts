import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, apartments } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const buildingId = session.buildingId as string;

    // Fetch all visitors who are currently 'INSIDE' the building
    const insideVisitors = await db.select({
      id: visitors.id,
      name: visitors.name,
      phone: visitors.phone,
      visitorCategory: visitors.visitorCategory,
      entryTime: visitors.entryTime,
      vehicleNo: visitors.vehicleNo,
      unitNumber: apartments.unitNumber,
    })
    .from(visitors)
    .innerJoin(apartments, eq(visitors.apartmentId, apartments.id))
    .where(and(
      eq(visitors.buildingId, buildingId),
      eq(visitors.status, "INSIDE")
    ))
    .orderBy(desc(visitors.entryTime));

    return NextResponse.json({
      success: true,
      data: insideVisitors
    });

  } catch (error) {
    console.error("[INSIDE_VISITORS_API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
