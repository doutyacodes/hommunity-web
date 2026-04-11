import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guards, residents, apartmentResidents, apartments } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { phone, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Role-based lookup
    if (role === "GUARD") {
      const [guard] = await db.select().from(guards).where(eq(guards.phone, phone)).limit(1);
      if (!guard) {
        return NextResponse.json({ error: "No guard account found with this phone number" }, { status: 404 });
      }
      // Mock OTP sending
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully (Debug: 123456)",
        userType: "GUARD" 
      });
    } else {
      // Resident check
      const [resident] = await db.select().from(residents).where(eq(residents.phone, phone)).limit(1);
      if (!resident) {
        return NextResponse.json({ error: "No resident account found with this phone number" }, { status: 404 });
      }
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully (Debug: 123456)",
        userType: "RESIDENT" 
      });
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
