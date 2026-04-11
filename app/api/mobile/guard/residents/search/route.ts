import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, apartments } from "@/lib/db/schema";
import { eq, and, like } from "drizzle-orm";
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
    const query = searchParams.get("q") || "";

    if (query.length < 1) {
       return NextResponse.json({ success: true, data: [] });
    }

    // Search by unit number or resident name
    const rawData = await db.select({
      apartmentId: apartments.id,
      unitNumber: apartments.unitNumber,
      residentId: residents.id,
      name: residents.name,
      phone: residents.phone,
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
    .where(and(
      eq(apartments.buildingId, buildingId),
      eq(apartmentResidents.status, "APPROVED"),
      like(apartments.unitNumber, `%${query}%`)
    ))
    .limit(20);

    return NextResponse.json({ success: true, data: rawData });
  } catch (error) {
    console.error("Guard Residents Search API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
