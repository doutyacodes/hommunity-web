import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { civicComplaints, apartmentResidents, apartments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const residentId = session.userId as string;
    const [aptRes] = await db.select().from(apartmentResidents).where(eq(apartmentResidents.residentId, residentId)).limit(1);

    if (!aptRes) {
      return NextResponse.json({ error: "No apartment linked" }, { status: 403 });
    }

    // Get buildingId from apartment
    const [apt] = await db.select().from(apartments).where(eq(apartments.id, aptRes.apartmentId)).limit(1);

    await db.insert(civicComplaints).values({
      buildingId: apt.buildingId,
      residentId,
      title,
      description,
      status: "OPEN",
    });

    return NextResponse.json({
      success: true,
      message: "Complaint registered successfully"
    });

  } catch (error) {
    console.error("Complaints API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
