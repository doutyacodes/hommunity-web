import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, eventLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { visitorId } = await req.json();
    const guardId = session.userId as string;
    const buildingId = session.buildingId as string;

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
    }

    // 1. Find the visitor 
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);

    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }

    // 2. Update status to EXITED
    await db.update(visitors).set({
      status: "EXITED",
      exitTime: new Date(),
    }).where(eq(visitors.id, visitor.id));

    // 3. Record System Event
    await db.insert(eventLogs).values({
      buildingId,
      category: "VISITOR",
      eventName: "VISITOR_EXITED",
      metadata: { visitorId: visitor.id, guardId }
    });

    return NextResponse.json({ success: true, message: "Visitor marked as exited" });

  } catch (error) {
    console.error("Exit API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
