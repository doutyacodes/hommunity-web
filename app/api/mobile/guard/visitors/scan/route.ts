import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, eventLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { passcode } = await req.json();
    const guardId = session.userId as string;
    const buildingId = session.buildingId as string;

    if (!passcode) {
      return NextResponse.json({ error: "Passcode is required" }, { status: 400 });
    }

    // 1. Find the visitor by passcode
    const [visitor] = await db.select().from(visitors).where(and(
      eq(visitors.passCode, passcode),
      eq(visitors.buildingId, buildingId),
      eq(visitors.status, "EXPECTED")
    )).limit(1);

    if (!visitor) {
      return NextResponse.json({ error: "Invalid passcode or already checked in" }, { status: 404 });
    }

    // 2. Update status to INSIDE
    await db.update(visitors).set({
      status: "INSIDE",
      entryTime: new Date(),
    }).where(eq(visitors.id, visitor.id));

    // 3. Record System Event
    await db.insert(eventLogs).values({
      buildingId,
      category: "VISITOR",
      eventName: "VISITOR_SCANNED_IN",
      metadata: { visitorId: visitor.id, guardId }
    });

    return NextResponse.json({ success: true, message: "Visitor Scanned In" });

  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
