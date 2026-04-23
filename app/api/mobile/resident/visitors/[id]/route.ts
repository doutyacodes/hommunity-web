import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitors, apartmentResidents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: visitorId } = await params;
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    // 1. Fetch Visitor
    const [visitor] = await db.select().from(visitors).where(eq(visitors.id, visitorId)).limit(1);
    if (!visitor) return NextResponse.json({ error: "Visitor not found" }, { status: 404 });

    // 2. Verify resident belongs to the same apartment
    const [access] = await db.select()
      .from(apartmentResidents)
      .where(and(
        eq(apartmentResidents.residentId, residentId),
        eq(apartmentResidents.apartmentId, visitor.apartmentId)
      ))
      .limit(1);

    if (!access) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: true, data: visitor });

  } catch (error) {
    console.error("Visitor Detail API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
