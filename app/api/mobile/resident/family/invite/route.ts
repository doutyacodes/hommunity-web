import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, familyInvitations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);

    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Family Invite Payload:", body);
    const { name, phone, relation, apartmentId } = body;

    if (!name || !phone || !apartmentId) {
      return NextResponse.json({ 
        error: `Missing required fields. Name: ${!!name}, Phone: ${!!phone}, ApartmentId: ${apartmentId}` 
      }, { status: 400 });
    }

    const inviterId = session.userId as string;

    // 1. Check if invited user already exists in residents table
    const [existingResident] = await db.select()
      .from(residents)
      .where(eq(residents.phone, phone))
      .limit(1);

    if (existingResident) {
      // Check if already linked to this apartment
      const [alreadyLinked] = await db.select()
        .from(apartmentResidents)
        .where(and(
          eq(apartmentResidents.residentId, existingResident.id),
          eq(apartmentResidents.apartmentId, apartmentId)
        ))
        .limit(1);

      if (alreadyLinked) {
        return NextResponse.json({ error: "This user is already part of the apartment" }, { status: 400 });
      }

      // Create a pending invitation link
      await db.insert(apartmentResidents).values({
        residentId: existingResident.id,
        apartmentId: apartmentId,
        type: "FAMILY",
        relation: relation,
        status: "INVITED",
        canApproveVisitors: true,
      });

      return NextResponse.json({ 
        success: true, 
        message: "Invitation sent to registered user" 
      });
    }

    // 2. User doesn't exist, create a Shadow Invitation
    // Check if a shadow invite already exists for this phone and apartment
    const [existingShadow] = await db.select()
      .from(familyInvitations)
      .where(and(
        eq(familyInvitations.phone, phone),
        eq(familyInvitations.apartmentId, apartmentId)
      ))
      .limit(1);

    if (existingShadow) {
      return NextResponse.json({ message: "Invitation already pending for this number" });
    }

    await db.insert(familyInvitations).values({
      apartmentId,
      inviterResidentId: inviterId,
      phone,
      name,
      relation,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Shadow invitation created. They will see it upon signup." 
    });

  } catch (error) {
    console.error("Invite Family API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
