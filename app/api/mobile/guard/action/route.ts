import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, visitorLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

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
    const { visitorId, action, notes } = await req.json();

    if (!visitorId || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Ensure the visitor exists
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);
    if (!visitor) {
      return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
    }

    let newStatus = visitor.status;

    if (action === "ALLOW") {
      newStatus = "INSIDE";
    } else if (action === "DENY") {
      newStatus = "DENIED";
    } else if (action === "CHECKOUT") {
      newStatus = "EXITED";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await db.update(visitors).set({
      status: newStatus as any,
      entryTime: newStatus === "INSIDE" ? new Date() : visitor.entryTime,
      exitTime: newStatus === "EXITED" ? new Date() : visitor.exitTime,
    }).where(eq(visitors.id, visitorId));

    await db.insert(visitorLogs).values({
      visitorId,
      action: action === "ALLOW" ? "CHECK_IN" : action === "DENY" ? "DENIED" : "CHECK_OUT",
      performedByRole: "GUARD",
      performedById: guardId,
      notes: notes || `Guard performed ${action}`,
    });

    return NextResponse.json({ success: true, message: `Visitor ${action} successfully` });
  } catch (error) {
    console.error("Guard Action API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
