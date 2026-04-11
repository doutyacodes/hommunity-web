import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildings, apartments, blocks, floors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get("buildingId");

    if (buildingId) {
      const bData = await db.select().from(buildings).where(eq(buildings.id, buildingId)).limit(1);
      const bBlocks = await db.select().from(blocks).where(eq(blocks.buildingId, buildingId));
      const bFloors = await db.select().from(floors).where(eq(floors.buildingId, buildingId));
      const bUnits = await db.select().from(apartments).where(eq(apartments.buildingId, buildingId));
      
      return NextResponse.json({ 
        success: true, 
        data: {
          building: bData[0],
          blocks: bBlocks,
          floors: bFloors,
          units: bUnits
        } 
      });
    }

    // List all buildings
    const b = await db.select({
      id: buildings.id,
      name: buildings.name,
      address: buildings.address,
    }).from(buildings);

    return NextResponse.json({ success: true, data: b });
  } catch (error) {
    console.error("Discovery API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
