import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);

    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    const notifs = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, residentId))
      .orderBy(desc(notifications.createdAt))
      .limit(50); // Get recent 50

    return NextResponse.json({ success: true, data: notifs });
  } catch (error) {
    console.error("Notifications API Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
