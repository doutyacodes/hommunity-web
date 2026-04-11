import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    const dues = await db.select()
      .from(payments)
      .where(eq(payments.residentId, residentId))
      .orderBy(desc(payments.dueDate));

    return NextResponse.json({
      success: true,
      data: dues
    });

  } catch (error) {
    console.error("Payments API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
