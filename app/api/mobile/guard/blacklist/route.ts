import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blacklistedVisitors } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "GUARD") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    const buildingId = session.buildingId as string;

    if (!phone) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

    const [blacklistEntry] = await db.select()
      .from(blacklistedVisitors)
      .where(and(
        eq(blacklistedVisitors.phone, phone),
        eq(blacklistedVisitors.buildingId, buildingId)
      ))
      .limit(1);

    return NextResponse.json({
      success: true,
      isBlacklisted: !!blacklistEntry,
      reason: blacklistEntry?.reason || null
    });

  } catch (error) {
    console.error("Blacklist API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
