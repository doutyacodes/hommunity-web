import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, visitorLogs, eventLogs, guards, userPushTokens, apartments, floors, blocks } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { decrypt } from "@/lib/session";
import admin from 'firebase-admin';
import { sendNotificationToApartment } from "@/lib/utils/notifications";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: visitorId } = await params;
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json(); // "INSIDE" (Approved) or "DENIED"
    const residentId = session.userId as string;

    if (!['INSIDE', 'DENIED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status response" }, { status: 400 });
    }

    // 1. Fetch Visitor to check existence and building info
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);
    if (!visitor) return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    // 2. Update Visitor status
    await db.update(visitors)
      .set({ 
        status: status as any,
        entryTime: status === 'INSIDE' ? new Date() : null 
      })
      .where(and(
        eq(visitors.id, visitorId),
        eq(visitors.status, "AT_GATE")
      ));

    // 3. Create Audit Log
    await db.insert(visitorLogs).values({
      visitorId: visitor.id,
      action: status === 'INSIDE' ? 'APPROVED' : 'DENIED',
      performedByRole: "RESIDENT",
      performedById: residentId,
      notes: `Resident responded via Mobile App`
    });

    // 4. Record System Event
    await db.insert(eventLogs).values({
      buildingId: visitor.buildingId,
      category: "VISITOR",
      eventName: status === 'INSIDE' ? "VISITOR_APPROVED" : "VISITOR_DENIED",
      metadata: { visitorId: visitor.id, residentId }
    });

    // 5. Fetch Apartment Details for the notification
    const [apartmentDetail] = await db.select({
      unit: apartments.unitNumber,
      floor: floors.floorNumber,
      block: blocks.name
    })
    .from(apartments)
    .leftJoin(floors, eq(apartments.floorId, floors.id))
    .leftJoin(blocks, eq(floors.blockId, blocks.id))
    .where(eq(apartments.id, visitor.apartmentId))
    .limit(1);

    const locationStr = apartmentDetail 
      ? `Unit ${apartmentDetail.unit}${apartmentDetail.floor ? `, ${apartmentDetail.floor} Floor` : ''}${apartmentDetail.block ? `, ${apartmentDetail.block}` : ''}`
      : 'Unknown Unit';

    // 6. Notify guards in the building
    const buildingGuards = await db.select({ id: guards.id })
      .from(guards)
      .where(eq(guards.buildingId, visitor.buildingId));

    const guardIds = buildingGuards.map((g: { id: string }) => g.id);

    if (guardIds.length > 0) {
      const guardTokens = await db.select({ token: userPushTokens.pushToken })
        .from(userPushTokens)
        .where(and(
          inArray(userPushTokens.userId, guardIds),
          eq(userPushTokens.userType, 'GUARD')
        ));

      const tokens = guardTokens.map((gt: { token: string | null }) => gt.token).filter((t: string | null): t is string => !!t);

      if (tokens.length > 0) {
        const messageBody = `Visitor ${visitor.name} has been ${status === 'INSIDE' ? 'allowed' : 'declined'} by ${locationStr}.`;
        
        await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: status === 'INSIDE' ? "Visitor Approved" : "Visitor Denied",
            body: messageBody,
          },
          data: {
            title: status === 'INSIDE' ? "Visitor Approved" : "Visitor Denied",
            body: messageBody,
            type: "approval_update",
            visitorId
          }
        });
      }
    }

    // 7. Notify other residents in the apartment (Family Sync)
    await sendNotificationToApartment(visitor.apartmentId, {
      title: status === 'INSIDE' ? "Visitor Approved" : "Visitor Denied",
      body: `Visitor ${visitor.name} has been ${status === 'INSIDE' ? 'allowed' : 'declined'} by a resident.`,
      type: "approval_update",
      referenceId: visitorId,
      payloadData: { visitorId, status }
    });

    return NextResponse.json({ success: true, message: `Visitor ${status}` });

  } catch (error) {
    console.error("Visitor Respond API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
