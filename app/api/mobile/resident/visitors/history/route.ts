import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, apartmentResidents } from "@/lib/db/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    // 1. Get resident's apartment
    const [aptRes] = await db.select().from(apartmentResidents).where(eq(apartmentResidents.residentId, residentId)).limit(1);

    if (!aptRes) {
      return NextResponse.json({ error: "No apartment linked" }, { status: 404 });
    }

    // 2. Fetch visitor history (Respecting privacy)
    const history = await db.select()
      .from(visitors)
      .where(and(
        eq(visitors.apartmentId, aptRes.apartmentId),
        or(
          eq(visitors.isPrivate, false),
          eq(visitors.invitedByResidentId, residentId)
        )
      ))
      .orderBy(desc(visitors.entryTime));

    return NextResponse.json({
      success: true,
      data: history
    });

  } catch (error) {
    console.error("Resident History API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
