import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, eventLogs, apartments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";
import { sendNotificationToApartment } from "@/lib/utils/notifications";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, category, unitNumber, apartmentId, vehicleNo, photoUrl } = await req.json();
    const guardId = session.userId as string;
    const buildingId = session.buildingId as string;

    console.log("[GUARD_API] New Visitor Payload:", { name, unitNumber, apartmentId, vehicleNo });
    console.log("[GUARD_API] Session Context:", { guardId, buildingId });

    if (!name || (!unitNumber && !apartmentId) || !buildingId) {
      console.warn("[GUARD_API] Validation Failed: Missing required details");
      return NextResponse.json({ 
        error: "Missing required details", 
        debug: { name: !!name, target: !!(unitNumber || apartmentId), building: !!buildingId } 
      }, { status: 400 });
    }

    let finalApartmentId = apartmentId;

    // 1. Find the target apartment if only unitNumber is provided (Backward Compatibility)
    if (!finalApartmentId && unitNumber) {
      const [apartment] = await db.select().from(apartments).where(and(
        eq(apartments.buildingId, buildingId),
        eq(apartments.unitNumber, unitNumber)
      )).limit(1);

      if (!apartment) {
        return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
      }
      finalApartmentId = apartment.id;
    }

    // 2. Create visitor record with 'AT_GATE' status
    const visitorId = crypto.randomUUID();
    await db.insert(visitors).values({
      id: visitorId,
      buildingId,
      apartmentId: finalApartmentId,
      name,
      phone,
      visitorCategory: category || "UNINVITED",
      status: "AT_GATE",
      vehicleNo,
      photoUrl,
    });

    // 3. Record System Event
    await db.insert(eventLogs).values({
      buildingId,
      category: "VISITOR",
      eventName: "VISITOR_WAITING",
      metadata: { visitorId, guardId }
    });

    // 4. Trigger Real-time Notification with Intercom Call Support
    await sendNotificationToApartment(finalApartmentId, {
      title: "Visitor at Gate",
      body: `${name} is at the gate. Allow entry?`,
      type: 'guest_arrival',
      actionType: "INTERCOM_CALL",
      referenceId: visitorId,
      payloadData: { 
        visitorId,
        callerName: name,
        category: category,
        isIntercom: true,
        callUuid: crypto.randomUUID()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Notification sent to resident",
      visitorId
    });

  } catch (error) {
    console.error("Unexpected Visitor API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
