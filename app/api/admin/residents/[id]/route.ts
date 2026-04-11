import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, apartments, vehicles, pets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: residentLinkId } = await params; // This is the ID from apartment_residents table

    // 1. Get the target link info
    const [targetLink] = await db.select()
      .from(apartmentResidents)
      .where(eq(apartmentResidents.id, residentLinkId))
      .limit(1);

    if (!targetLink) {
      return NextResponse.json({ error: "Resident link not found" }, { status: 404 });
    }

    const residentId = targetLink.residentId;
    const apartmentId = targetLink.apartmentId;

    // 2. Fetch Resident Basic Info
    const [resident] = await db.select()
      .from(residents)
      .where(eq(residents.id, residentId))
      .limit(1);

    // 3. Fetch all household members in this apartment
    const household = await db.select({
      id: apartmentResidents.id,
      name: residents.name,
      phone: residents.phone,
      type: apartmentResidents.type,
      status: apartmentResidents.status,
    })
    .from(apartmentResidents)
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
    .where(eq(apartmentResidents.apartmentId, apartmentId));

    // 4. Fetch Assets
    const residentVehicles = await db.select()
      .from(vehicles)
      .where(eq(vehicles.residentId, residentId));

    const residentPets = await db.select()
      .from(pets)
      .where(eq(pets.residentId, residentId));

    // 5. Fetch other linked apartments for this resident
    const otherApartments = await db.select({
      id: apartments.id,
      unitNumber: apartments.unitNumber,
      status: apartmentResidents.status,
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .where(and(
      eq(apartmentResidents.residentId, residentId),
      eq(apartmentResidents.isPrimary, false) // or just all
    ));

    return NextResponse.json({
      success: true,
      data: {
        resident,
        apartmentId,
        household,
        vehicles: residentVehicles,
        pets: residentPets,
        otherApartments
      }
    });

  } catch (error) {
    console.error("Admin Resident Details API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
