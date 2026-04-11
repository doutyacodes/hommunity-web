import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guardAttendance, securityShifts, securityShiftDays } from "@/lib/db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, shiftId } = await req.json(); // "CHECK_IN" or "CHECK_OUT"
    const guardId = session.userId as string;

    if (!action || !shiftId) return NextResponse.json({ error: "Action and shiftId required" }, { status: 400 });

    if (action === "CHECK_IN") {
      // 1. Double check shift existence
      const [shift] = await db.select().from(securityShifts).where(eq(securityShifts.id, shiftId)).limit(1);
      if (!shift) return NextResponse.json({ error: "Shift not found" }, { status: 404 });

      // 2. Create Attendance Record
      const id = crypto.randomUUID();
      await db.insert(guardAttendance).values({
        id,
        guardId,
        shiftId,
        checkIn: new Date(),
        status: "ON_TIME", // Simple logic for now, could compare with shift.startTime
      });

      return NextResponse.json({ success: true, message: "Checked in successfully", attendanceId: id });
    } 
    
    if (action === "CHECK_OUT") {
      // 1. Find active attendance
      const [active] = await db.select()
        .from(guardAttendance)
        .where(and(
          eq(guardAttendance.guardId, guardId),
          eq(guardAttendance.shiftId, shiftId),
          isNull(guardAttendance.checkOut)
        ))
        .limit(1);

      if (!active) return NextResponse.json({ error: "No active check-in found" }, { status: 400 });

      // 2. Update with Check-out
      await db.update(guardAttendance)
        .set({ checkOut: new Date() })
        .where(eq(guardAttendance.id, active.id));

      return NextResponse.json({ success: true, message: "Checked out successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guardId = session.userId as string;

    // 1. Get shifts assigned to this guard
    const shiftsRaw = await db.select().from(securityShifts).where(eq(securityShifts.guardId, guardId));

    // 1b. Fetch days for these shifts
    const shiftIds = shiftsRaw.map((s: any) => s.id);
    const shiftDays = shiftIds.length > 0 
      ? await db.select({ shiftId: securityShiftDays.shiftId, day: securityShiftDays.day })
          .from(securityShiftDays)
          .where(inArray(securityShiftDays.shiftId, shiftIds))
      : [];

    const shifts = shiftsRaw.map((s: any) => ({
      ...s,
      days: shiftDays.filter((sd: any) => sd.shiftId === s.id).map((sd: any) => sd.day).join(',')
    }));

    // 2. Get active attendance (if currently checked in)
    const [active] = await db.select().from(guardAttendance).where(and(
      eq(guardAttendance.guardId, guardId),
      isNull(guardAttendance.checkOut)
    )).limit(1);

    return NextResponse.json({
      success: true,
      data: {
        shifts,
        activeAttendance: active || null
      }
    });
  } catch (error) {
    console.error("Attendance API GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
