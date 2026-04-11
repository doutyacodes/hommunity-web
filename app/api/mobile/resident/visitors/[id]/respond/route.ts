import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, visitorLogs, eventLogs, guards } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";
import admin from 'firebase-admin';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json(); // "INSIDE" (Approved) or "DENIED"
    const visitorId = params.id;
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

    // 5. Notify guards in the building
    const buildingGuards = await db.select({ token: guards.pushToken })
      .from(guards)
      .where(eq(guards.buildingId, visitor.buildingId));

    const tokens = buildingGuards.map((g: any) => g.token).filter((t: any): t is string => !!t);

    if (tokens.length > 0) {
      await admin.messaging().sendEachForMulticast({
        tokens,
        data: {
          title: status === 'INSIDE' ? "Visitor Approved" : "Visitor Denied",
          body: `Visitor ${visitor.name} has been ${status === 'INSIDE' ? 'allowed' : 'declined'} by the resident.`,
          type: "approval_update",
          visitorId
        }
      });
    }

    return NextResponse.json({ success: true, message: `Visitor ${status}` });

  } catch (error) {
    console.error("Visitor Respond API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
