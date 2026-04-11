import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guards, residents, apartmentResidents, apartments, buildings, userPushTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { encrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { phone, otp, role, pushToken } = await req.json();

    // Debug Mode OTP Check
    if (otp !== "123456") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (role === "GUARD") {
      const [guard] = await db.select().from(guards).where(eq(guards.phone, phone)).limit(1);
      
      if (!guard) return NextResponse.json({ error: "Account not found" }, { status: 404 });

      // Save pushToken if provided (Multi-device support)
      if (pushToken) {
        const [existing] = await db.select().from(userPushTokens).where(and(
          eq(userPushTokens.userId, guard.id),
          eq(userPushTokens.pushToken, pushToken)
        )).limit(1);

        if (!existing) {
          await db.insert(userPushTokens).values({
            userId: guard.id,
            userType: 'GUARD',
            pushToken: pushToken,
          });
        }
      }

      // Create Session Token
      const token = await encrypt({
        userId: guard.id,
        role: "GUARD",
        buildingId: guard.buildingId,
        name: guard.name
      });

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: guard.id,
          name: guard.name,
          phone: guard.phone,
          buildingId: guard.buildingId,
          role: "GUARD"
        }
      });
    } else {
      // Resident Logic
      const [resident] = await db.select().from(residents).where(eq(residents.phone, phone)).limit(1);
      if (!resident) return NextResponse.json({ error: "Account not found" }, { status: 404 });

      // Save pushToken if provided (Multi-device support)
      if (pushToken) {
        const [existing] = await db.select().from(userPushTokens).where(and(
          eq(userPushTokens.userId, resident.id),
          eq(userPushTokens.pushToken, pushToken)
        )).limit(1);

        if (!existing) {
          await db.insert(userPushTokens).values({
            userId: resident.id,
            userType: 'RESIDENT',
            pushToken: pushToken,
          });
        }
      }

      // Fetch primary apartment
      const [aptRes] = await db.select()
        .from(apartmentResidents)
        .where(eq(apartmentResidents.residentId, resident.id))
        .limit(1);

      const token = await encrypt({
        userId: resident.id,
        role: "RESIDENT",
        apartmentId: aptRes?.apartmentId,
        buildingId: aptRes?.buildingId,
        name: resident.name
      });
      
      // Fetch building name for better UI
      const [building] = aptRes?.buildingId 
        ? await db.select().from(buildings).where(eq(buildings.id, aptRes.buildingId)).limit(1)
        : [null];

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: resident.id,
          name: resident.name,
          phone: resident.phone,
          role: "RESIDENT",
          apartmentId: aptRes?.apartmentId,
          buildingId: aptRes?.buildingId,
          buildingName: building?.name ?? 'Unknown Building',
          status: aptRes?.status ?? 'PENDING_APPROVAL'
        }
      });
    }
  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
