import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apartmentResidents, residents } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const apartmentId = searchParams.get("apartmentId");

    if (!apartmentId) {
      return NextResponse.json({ error: "Apartment context required" }, { status: 400 });
    }

    // Fetch all residents of this apartment except the current one
    const members = await db.select({
      id: apartmentResidents.id,
      residentId: residents.id,
      name: residents.name,
      phone: residents.phone,
      type: apartmentResidents.type,
      status: apartmentResidents.status
    })
    .from(apartmentResidents)
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
    .where(and(
      eq(apartmentResidents.apartmentId, apartmentId),
      ne(apartmentResidents.residentId, session.userId as string)
    ));

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("Fetch Family Members Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST is handled by family/invite now, but we'll keep a stub or redirect if needed.
// Actually, I'll just remove the old POST here to avoid confusion.

export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json(); // apartment_residents ID

    // Check if user has permission to delete (e.g. they are the OWNER or they are deleting themselves?)
    // For now, allow deletion if they are in the same apartment.
    
    const [targetLink] = await db.select()
      .from(apartmentResidents)
      .where(eq(apartmentResidents.id, id))
      .limit(1);

    if (!targetLink) {
      return NextResponse.json({ error: "Member link not found" }, { status: 404 });
    }

    // Security: Ensure the requester is in the same apartment
    const [requesterLink] = await db.select()
      .from(apartmentResidents)
      .where(and(
        eq(apartmentResidents.residentId, session.userId as string),
        eq(apartmentResidents.apartmentId, targetLink.apartmentId)
      ))
      .limit(1);

    if (!requesterLink) {
      return NextResponse.json({ error: "Unauthorized access to this apartment" }, { status: 403 });
    }

    await db.delete(apartmentResidents).where(eq(apartmentResidents.id, id));

    return NextResponse.json({ success: true, message: "Member removed from apartment" });
  } catch (error) {
    console.error("Delete Family Member Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
