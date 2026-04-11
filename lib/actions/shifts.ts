"use server";

import { db } from "@/lib/db";
import { securityShifts, securityShiftDays } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createShiftAction(prevState: any, formData: FormData) {
  try {
    const guardId = formData.get("guardId") as string;
    const gateId = formData.get("gateId") as string;
    const daysRaw = formData.getAll("days") as string[];
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    if (!guardId || !gateId || daysRaw.length === 0 || !startTime || !endTime) {
      return { error: "Missing required fields. Select at least one day." };
    }

    const [shiftResult] = await db.insert(securityShifts).values({
      guardId,
      gateId,
      startTime,
      endTime,
    }).$returningId();

    const shiftId = shiftResult.id;

    if (daysRaw.length > 0) {
      const dayInserts = daysRaw.map(day => ({
        shiftId,
        day: day as any,
      }));
      await db.insert(securityShiftDays).values(dayInserts);
    }

    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to create shift:", error);
    return { error: "Database error occurred" };
  }
}

export async function deleteShiftAction(id: string) {
  try {
    await db.delete(securityShiftDays).where(eq(securityShiftDays.shiftId, id));
    await db.delete(securityShifts).where(eq(securityShifts.id, id));
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete shift:", error);
    return { error: "Failed to end shift" };
  }
}
