import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, visitorLogs, eventLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";
import { sendNotificationToApartment } from "@/lib/utils/notifications";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await decrypt(authHeader.split(" ")[1]);
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { passCode } = await req.json();
    const guardId = session.userId as string;

    if (!passCode) {
      return NextResponse.json({ error: "Passcode is required" }, { status: 400 });
    }

    // 1. Find visitor by passcode
    const [visitor] = await db.select()
      .from(visitors)
      .where(and(
        eq(visitors.passCode, passCode),
        eq(visitors.status, "EXPECTED")
      ))
      .limit(1);

    if (!visitor) {
      return NextResponse.json({ error: "Invalid or expired passcode" }, { status: 404 });
    }

    // 2. Mark as INSIDE
    await db.update(visitors)
      .set({ 
        status: "INSIDE", 
        entryTime: new Date() 
      })
      .where(eq(visitors.id, visitor.id));

    // 3. Create Audit Log
    await db.insert(visitorLogs).values({
      visitorId: visitor.id,
      action: "CHECK_IN",
      performedByRole: "GUARD",
      performedById: guardId,
      notes: "Checked in via QR Scan"
    });

    // 4. Record System Event
    await db.insert(eventLogs).values({
      buildingId: visitor.buildingId,
      category: "VISITOR",
      eventName: "VISITOR_CHECKIN",
      metadata: { visitorId: visitor.id, guardId }
    });

    // 5. Notify Resident about arrival
    await sendNotificationToApartment(visitor.apartmentId, {
      title: "Visitor Arrived",
      body: `${visitor.name} has checked in at the gate.`,
      type: "guest_arrival",
      payloadData: { visitorId: visitor.id }
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      visitor: {
        name: visitor.name,
        category: visitor.visitorCategory,
        aptId: visitor.apartmentId
      }
    });

  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
