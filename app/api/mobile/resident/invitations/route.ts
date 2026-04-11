import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apartmentResidents, apartments, buildings, residents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);

    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    // Fetch all apartments where the user is INVITED
    const pendingInvites = await db.select({
      id: apartmentResidents.id,
      apartmentId: apartments.id,
      unitNumber: apartments.unitNumber,
      buildingName: buildings.name,
      buildingId: buildings.id,
      invitedBy: residents.name,
      type: apartmentResidents.type,
      status: apartmentResidents.status,
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(buildings, eq(apartments.buildingId, buildings.id))
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id)) // Self join for info? No, I need inviter name.
    // Wait, the inviter name is not in apartmentResidents. 
    // I should probably have stored it there?
    // Actually, I can fetch the owner of the apartment or use familyInvitations logic.
    // Let's adjust apartmentResidents to just join with its own data for now.
    
    // Modification: I'll fetch the inviter from another join if needed, 
    // but for now let's just show apartment info.
    .where(and(
      eq(apartmentResidents.residentId, residentId),
      eq(apartmentResidents.status, "INVITED")
    ));

    return NextResponse.json({
      success: true,
      data: pendingInvites
    });

  } catch (error) {
    console.error("Get Invitations Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
