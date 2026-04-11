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

    const { linkId, response } = await req.json(); // linkId is the ID in apartmentResidents

    if (!linkId || !response) {
      return NextResponse.json({ error: "Link ID and Response (ACCEPT/DENY) are required" }, { status: 400 });
    }

    const residentId = session.userId as string;

    const [link] = await db.select()
      .from(apartmentResidents)
      .where(and(
        eq(apartmentResidents.id, linkId),
        eq(apartmentResidents.residentId, residentId)
      ))
      .limit(1);

    if (!link) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (response === "ACCEPT") {
      await db.update(apartmentResidents)
        .set({ status: "APPROVED" })
        .where(eq(apartmentResidents.id, linkId));
        
      return NextResponse.json({ success: true, message: "Invitation accepted" });
    } else {
      await db.delete(apartmentResidents)
        .where(eq(apartmentResidents.id, linkId));
        
      return NextResponse.json({ success: true, message: "Invitation declined" });
    }

  } catch (error) {
    console.error("Respond to Invitation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
