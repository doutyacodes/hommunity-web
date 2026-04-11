import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, visitorLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
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

    const guardId = session.userId as string;
    const { visitorId } = await req.json();

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
    }

    // 1. Fetch visitor details
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);
    
    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }

    // 2. Insert Log entry for the call
    await db.insert(visitorLogs).values({
      visitorId,
      action: "INTERCOM_CALL",
      performedByRole: "GUARD",
      performedById: guardId,
      notes: "Guard initiated intercom call to resident",
    });

    // 3. Trigger Intercom-Type Notification (CallKit compatible)
    await sendNotificationToApartment(visitor.apartmentId, {
      title: "Incoming Intercom Call",
      body: `${visitor.name} is at the gate.`,
      type: "guest_arrival", // The app should handle this as a call based on actionType
      actionType: "INTERCOM_CALL",
      referenceId: visitorId,
      payloadData: {
        visitorId,
        callerName: visitor.name,
        category: visitor.visitorCategory,
        isIntercom: true,
        callUuid: crypto.randomUUID()
      }
    });

    return NextResponse.json({ success: true, message: "Intercom call initiated" });

  } catch (error) {
    console.error("Intercom Call API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
