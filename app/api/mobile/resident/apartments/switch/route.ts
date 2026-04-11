import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apartmentResidents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { apartmentId } = await req.json();
    const residentId = session.userId as string;

    // 1. Reset all links to non-primary
    await db.update(apartmentResidents)
      .set({ isPrimary: false })
      .where(eq(apartmentResidents.residentId, residentId));

    // 2. Set selected unit to primary (must be APPROVED to be primary)
    await db.update(apartmentResidents)
      .set({ isPrimary: true })
      .where(and(
        eq(apartmentResidents.residentId, residentId),
        eq(apartmentResidents.apartmentId, apartmentId),
        eq(apartmentResidents.status, 'APPROVED')
      ));

    return NextResponse.json({
      success: true,
      message: "Active apartment switched successfully"
    });

  } catch (error) {
    console.error("Switch Apartment Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
