import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { securityAlerts, guards } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const buildingId = session.buildingId as string;

    const alerts = await db.select({
      id: securityAlerts.id,
      type: securityAlerts.type,
      status: securityAlerts.status,
      timestamp: securityAlerts.timestamp,
      guardName: guards.name,
    })
    .from(securityAlerts)
    .innerJoin(guards, eq(securityAlerts.guardId, guards.id))
    .where(eq(securityAlerts.buildingId, buildingId))
    .orderBy(desc(securityAlerts.timestamp))
    .limit(50);

    return NextResponse.json({ success: true, data: alerts });

  } catch (error) {
    console.error("Alerts Fetch Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
