import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, apartments, buildings } from "@/lib/db/schema";
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

    // 1. Fetch Resident Details
    const [resident] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);

    if (!resident) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Linked Apartment
    const [aptRes] = await db.select({
      id: apartments.id,
      unit: apartments.unitNumber,
      building: buildings.name,
      address: buildings.address,
      type: apartmentResidents.type,
      status: apartmentResidents.status
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(buildings, eq(apartments.buildingId, buildings.id))
    .where(eq(apartmentResidents.residentId, residentId))
    .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        id: resident.id,
        name: resident.name,
        phone: resident.phone,
        email: resident.email,
        apartment: aptRes
      }
    });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
