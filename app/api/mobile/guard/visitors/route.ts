import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, guards } from "@/lib/db/schema";
import { eq, or, and, desc } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);

    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tab = searchParams.get("tab") || "live";
    const type = searchParams.get("type") || "all";

    const guardId = session.userId as string;
    const buildingId = session.buildingId as string;

    // We must accumulate conditions in an array to avoid Drizzle's .where() overwrite bug!!
    let conditions: any[] = [eq(visitors.buildingId, buildingId)];

    if (type === "delivery") {
      conditions.push(eq(visitors.visitorCategory, 'DELIVERY_GUEST'));
    }

    if (tab === "live") {
      conditions.push(or(eq(visitors.status, "EXPECTED"), eq(visitors.status, "AT_GATE"), eq(visitors.status, "INSIDE")));
    } else if (tab === "pending") {
      conditions.push(eq(visitors.status, "AT_GATE"));
    } else if (tab === "history") {
      conditions.push(or(eq(visitors.status, "EXITED"), eq(visitors.status, "DENIED")));
    }

    const orderByField = tab === "history" ? desc(visitors.exitTime) : desc(visitors.updatedAt);

    const data = await db.select()
      .from(visitors)
      .where(and(...conditions))
      .orderBy(orderByField);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Guard Visitors API Error:", error);
    return NextResponse.json({ error: "Failed to fetch visitors" }, { status: 500 });
  }
}
