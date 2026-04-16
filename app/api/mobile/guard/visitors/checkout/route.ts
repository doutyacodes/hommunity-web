import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { visitorId } = await req.json();
    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
    }

    const buildingId = session.buildingId as string;

    // Update visitor status to 'EXITED' and record the current time
    const result = await db.update(visitors)
      .set({
        status: "EXITED",
        exitTime: new Date()
      })
      .where(and(
        eq(visitors.id, visitorId),
        eq(visitors.buildingId, buildingId),
        eq(visitors.status, "INSIDE") // Safety check: only check out those who are inside
      ));

    return NextResponse.json({
      success: true,
      message: "Visitor checked out successfully"
    });

  } catch (error) {
    console.error("[VISITOR_CHECKOUT_API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
