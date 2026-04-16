import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guards, securityShifts, gates, visitors } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
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

    // 1. Fetch Guard's active shifts
    const rawShifts = await db.select({
      id: securityShifts.id,
      gateName: gates.name,
      deliveryImageRequired: gates.deliveryImageRequired,
      start: securityShifts.startTime,
      end: securityShifts.endTime
    })
    .from(securityShifts)
    .innerJoin(gates, eq(securityShifts.gateId, gates.id))
    .where(eq(securityShifts.guardId, guardId));

    const { securityShiftDays } = await import("@/lib/db/schema");
    const shifts = await Promise.all(rawShifts.map(async (s: any) => {
      const days = await db.select({ day: securityShiftDays.day })
        .from(securityShiftDays)
        .where(eq(securityShiftDays.shiftId, s.id));
      return {
        gateName: s.gateName,
        deliveryImageRequired: !!s.deliveryImageRequired,
        days: days.map((d: any) => d.day).join(","),
        start: s.start,
        end: s.end
      };
    }));

    // 2. Fetch Visitor Stats for the guard's building
    const buildingId = session.buildingId as string;
    
    const [insideStats] = await db.select({ value: count() })
      .from(visitors)
      .where(and(
        eq(visitors.buildingId, buildingId),
        eq(visitors.status, "INSIDE")
      ));

    const [pendingStats] = await db.select({ value: count() })
      .from(visitors)
      .where(and(
        eq(visitors.buildingId, buildingId),
        eq(visitors.status, "AT_GATE")
      ));

    return NextResponse.json({
      success: true,
      data: {
        shifts,
        stats: {
          inside: insideStats.value,
          pending: pendingStats.value
        }
      }
    });
  } catch (error) {
    console.error("Guard Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
