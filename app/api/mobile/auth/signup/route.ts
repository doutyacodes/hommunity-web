import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, apartments, buildings, familyInvitations, userPushTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { name, phone, email, buildingId, unitNumber, type, pushToken } = await req.json();

    if (!name || !phone || !buildingId || !unitNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Check if resident already exists
    let [resident] = await db.select().from(residents).where(eq(residents.phone, phone)).limit(1);

    if (!resident) {
      const [insertResult] = await db.insert(residents).values({
        name,
        phone,
        email,
      });
      [resident] = await db.select().from(residents).where(eq(residents.phone, phone)).limit(1);
    }

    // Save pushToken if provided (Multi-device support)
    if (pushToken && resident) {
      const [existing] = await db.select().from(userPushTokens).where(and(
        eq(userPushTokens.userId, resident.id),
        eq(userPushTokens.pushToken, pushToken)
      )).limit(1);

      if (!existing) {
        await db.insert(userPushTokens).values({
          userId: resident.id,
          userType: 'RESIDENT',
          pushToken: pushToken,
        });
      }
    }

    // 2. Find the apartment in that building
    const [apartment] = await db.select()
      .from(apartments)
      .where(and(
        eq(apartments.buildingId, buildingId),
        eq(apartments.unitNumber, unitNumber)
      ))
      .limit(1);

    if (!apartment) {
      return NextResponse.json({ error: "Apartment unit not found in this building" }, { status: 404 });
    }

    // 3. Link resident to apartment
    const [existingLink] = await db.select()
      .from(apartmentResidents)
      .where(and(
        eq(apartmentResidents.residentId, resident.id),
        eq(apartmentResidents.apartmentId, apartment.id)
      ))
      .limit(1);

    if (existingLink) {
      return NextResponse.json({ success: true, message: "Resident already registered for this unit" });
    }

    // 4. Owner Constraint: Only one owner allowed per apartment
    if (type === "OWNER") {
      const [existingOwner] = await db.select()
        .from(apartmentResidents)
        .where(and(
          eq(apartmentResidents.apartmentId, apartment.id),
          eq(apartmentResidents.type, "OWNER"),
          // status !== 'REJECTED' -- using neq wasn't imported, but we can check if it's NOT REJECTED
          // actually, it's safer to check for active/pending statuses
        ))
        .limit(1);

      // Refining check to exclude rejected ones properly
      const owners = await db.select()
        .from(apartmentResidents)
        .where(and(
          eq(apartmentResidents.apartmentId, apartment.id),
          eq(apartmentResidents.type, "OWNER")
        ));
      
      const activeOwner = owners.find((o: any) => o.status !== "REJECTED");

      if (activeOwner) {
        return NextResponse.json({ error: "This apartment already has a registered owner." }, { status: 400 });
      }
    }

    await db.insert(apartmentResidents).values({
      residentId: resident.id,
      apartmentId: apartment.id,
      type: type || "TENANT",
      status: "PENDING_APPROVAL",
    });

    // 4. Check for Shadow Invitations for this phone
    const pendingShadowInvites = await db.select()
      .from(familyInvitations)
      .where(eq(familyInvitations.phone, phone));

    for (const invite of pendingShadowInvites) {
      // Check if already linked from step 3 (e.g. if they just registered the same unit)
      const [alreadyLinked] = await db.select()
        .from(apartmentResidents)
        .where(and(
          eq(apartmentResidents.residentId, resident.id),
          eq(apartmentResidents.apartmentId, invite.apartmentId)
        ))
        .limit(1);

      if (!alreadyLinked) {
        await db.insert(apartmentResidents).values({
          residentId: resident.id,
          apartmentId: invite.apartmentId,
          type: "FAMILY",
          relation: invite.relation,
          status: "INVITED",
          canApproveVisitors: true,
        });
      }
      
      // Cleanup shadow invite
      await db.delete(familyInvitations).where(eq(familyInvitations.id, invite.id));
    }

    return NextResponse.json({ 
      success: true, 
      message: "Signup successful",
      residentId: resident.id,
      hasInvitations: pendingShadowInvites.length > 0
    });

  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
