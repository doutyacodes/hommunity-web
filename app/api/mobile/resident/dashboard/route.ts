import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { residents, apartmentResidents, apartments, buildings, visitors, communityNotices, rules } from "@/lib/db/schema";
import { eq, desc, and, or } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session || session.role !== "RESIDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const residentId = session.userId as string;

    // 1. Fetch Apartment/Building Info
    const [aptRes] = await db.select({
      unit: apartments.unitNumber,
      buildingId: buildings.id,
      buildingName: buildings.name,
      type: apartmentResidents.type,
      status: apartmentResidents.status
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(buildings, eq(apartments.buildingId, buildings.id))
    .where(eq(apartmentResidents.residentId, residentId))
    .limit(1);

    if (!aptRes) {
       return NextResponse.json({ error: "No apartment found" }, { status: 404 });
    }

    // 2. Fetch Recent Visitors (Today's active or recent entries)
    const [aptLink] = await db.select().from(apartmentResidents).where(eq(apartmentResidents.residentId, residentId)).limit(1);
    const apartmentId = aptLink?.apartmentId;

    if (!apartmentId) return NextResponse.json({ error: "No apartment linkage found" }, { status: 404 });

    const actualRecentVisitors = await db.select()
      .from(visitors)
      .where(and(
        eq(visitors.apartmentId, apartmentId),
        or(
          eq(visitors.isPrivate, false),
          eq(visitors.invitedByResidentId, residentId)
        )
      ))
      .orderBy(desc(visitors.updatedAt))
      .limit(5);

    const activeCount = await db.select()
      .from(visitors)
      .where(and(
        eq(visitors.apartmentId, apartmentId),
        or(
          eq(visitors.isPrivate, false),
          eq(visitors.invitedByResidentId, residentId)
        ),
        or(eq(visitors.status, 'INSIDE'), eq(visitors.status, 'AT_GATE'))
      ));

    // 3. Fetch Recent Activity (Mixed feed of notices and visitor status changes)
    const notices = await db.select()
      .from(communityNotices)
      .where(eq(communityNotices.buildingId, aptRes.buildingId))
      .orderBy(desc(communityNotices.createdAt))
      .limit(3);

    const activityLog = [
        ...actualRecentVisitors.map((v: any) => ({
            id: v.id,
            type: 'VISITOR',
            title: `${v.name} is ${v.status.toLowerCase().replace('_', ' ')}`,
            sub: v.visitorCategory,
            time: v.updatedAt,
            color: v.status === 'INSIDE' ? 'GREEN' : 'BLUE'
        })),
        ...notices.map((n: any) => ({
            id: n.id,
            type: 'NOTICE',
            title: n.title,
            sub: 'Community Announcement',
            time: n.createdAt,
            color: 'PURPLE'
        }))
    ].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        apartment: aptRes,
        summary: {
            activeVisitors: activeCount.length,
            totalToday: actualRecentVisitors.length
        },
        visitors: actualRecentVisitors,
        activity: activityLog
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
