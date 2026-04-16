import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    await db.update(residents)
      .set(updateData)
      .where(eq(residents.id, session.userId as string));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
