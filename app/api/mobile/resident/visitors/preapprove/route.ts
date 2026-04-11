import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, apartmentResidents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await decrypt(authHeader.split(" ")[1]);
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, category, categoryText, entryTime, vehicleNo, isPrivate, participantCount, schedulingDetails } = await req.json();

    if (!name || !category) {
      return NextResponse.json({ error: "Name and Category are required" }, { status: 400 });
    }

    // Identify resident's apartment
    const residentId = session.userId as string;
    const [aptRes] = await db.select().from(apartmentResidents).where(eq(apartmentResidents.residentId, residentId)).limit(1);

    if (!aptRes) {
      return NextResponse.json({ error: "Resident not linked to any apartment" }, { status: 403 });
    }

    // Generate 6-digit numeric passcode
    const passCode = Math.floor(100000 + Math.random() * 900000).toString();

    const [visitor] = await db.insert(visitors).values({
      buildingId: session.buildingId || (await getBuildingIdFromApt(aptRes.apartmentId)),
      apartmentId: aptRes.apartmentId,
      invitedByResidentId: residentId,
      name,
      phone,
      visitorCategory: category,
      purpose: categoryText || "Pre-approved Guest",
      status: "EXPECTED",
      passCode,
      entryTime: entryTime ? new Date(entryTime) : null,
      vehicleNo,
      isPrivate: !!isPrivate,
      participantCount: participantCount || "1",
      schedulingDetails: schedulingDetails || null,
    });

    return NextResponse.json({
      success: true,
      passCode,
      message: "Visitor pre-approved successfully"
    });

  } catch (error) {
    console.error("Preapprove API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function getBuildingIdFromApt(aptId: string) {
  const { apartments } = await import("@/lib/db/schema");
  const [apt] = await db.select().from(apartments).where(eq(apartments.id, aptId)).limit(1);
  return apt?.buildingId;
}
