import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apartmentResidents, apartments, buildings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    const units = await db.select({
      id: apartmentResidents.id,
      apartmentId: apartments.id,
      unitNumber: apartments.unitNumber,
      buildingId: buildings.id,
      buildingName: buildings.name,
      status: apartmentResidents.status,
      isPrimary: apartmentResidents.isPrimary
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(buildings, eq(apartments.buildingId, buildings.id))
    .where(eq(apartmentResidents.residentId, residentId));

    return NextResponse.json({ success: true, data: units });
  } catch (error) {
    console.error("Fetch Apartments Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
