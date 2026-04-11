import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guards, buildings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);

    if (!session || session.role !== "GUARD") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const guardId = session.userId as string;

    const [guardData] = await db.select({
      guard: guards,
      buildingName: buildings.name,
      buildingAddress: buildings.address,
    })
    .from(guards)
    .innerJoin(buildings, eq(guards.buildingId, buildings.id))
    .where(eq(guards.id, guardId))
    .limit(1);

    if (!guardData) {
      return NextResponse.json({ error: "Guard not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {
       ...guardData.guard,
       buildingName: guardData.buildingName,
       buildingAddress: guardData.buildingAddress,
    }});
  } catch (error) {
    console.error("Guard Profile API Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
