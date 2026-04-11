import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blocks, floors, apartments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

    const buildingId = session.buildingId as string;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "blocks", "floors", "apartments"
    const blockId = searchParams.get("blockId");
    const floorId = searchParams.get("floorId");

    if (type === "blocks") {
      const data = await db.select().from(blocks).where(eq(blocks.buildingId, buildingId));
      return NextResponse.json({ success: true, data });
    }

    if (type === "floors") {
      if (!blockId) return NextResponse.json({ error: "blockId required" }, { status: 400 });
      const data = await db.select().from(floors).where(and(
        eq(floors.buildingId, buildingId),
        eq(floors.blockId, blockId)
      ));
      return NextResponse.json({ success: true, data });
    }

    if (type === "apartments") {
        if (!floorId) return NextResponse.json({ error: "floorId required" }, { status: 400 });
        const data = await db.select().from(apartments).where(and(
          eq(apartments.buildingId, buildingId),
          eq(apartments.floorId, floorId)
        ));
        return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error) {
    console.error("Hierarchy API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
