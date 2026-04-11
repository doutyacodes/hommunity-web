import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { securityAlerts, eventLogs, guards } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { decrypt } from "@/lib/session";
import admin from 'firebase-admin';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type } = await req.json(); // FIRE, MEDICAL, SOS_BREACH

    const guardId = session.userId as string;
    const buildingId = session.buildingId as string;

    // 1. Log alert in DB
    await db.insert(securityAlerts).values({
      buildingId,
      guardId,
      type: type || "SOS_BREACH",
      status: "ACTIVE",
    });

    // 2. Record System Event
    await db.insert(eventLogs).values({
      buildingId,
      category: "SECURITY",
      eventName: "SOS_ALERT",
      metadata: { type: type || "SOS_BREACH", triggeredBy: guardId }
    });

    // 3. Notify ALL OTHER GUARDS in the same building
    const otherGuards = await db.select({
      token: guards.pushToken
    })
    .from(guards)
    .where(and(
      eq(guards.buildingId, buildingId),
      ne(guards.id, guardId) // Don't notify self
    ));

    const tokens = otherGuards.map((g: any) => g.token).filter((t: any): t is string => !!t);

    if (tokens.length > 0) {
      const message = {
        tokens,
        data: {
          uuid: crypto.randomUUID(),
          title: "🚨 SOS ALERT!",
          body: `An emergency alert (${type}) has been raised by ${session.name}. Action required!`,
          type: "sos_alert",
          priority: "high"
        }
      };
      await admin.messaging().sendEachForMulticast(message);
    }

    return NextResponse.json({ success: true, message: "SOS Alert Broadcasted" });

  } catch (error) {
    console.error("SOS API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
