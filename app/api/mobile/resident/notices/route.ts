import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { communityNotices, rules } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { decrypt } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const session = await decrypt(authHeader?.split(" ")[1]);
    
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const buildingId = session.buildingId as string;
    if (!buildingId) return NextResponse.json({ error: "No building linked to user" }, { status: 403 });

    // 1. Fetch community notices
    const notices = await db.select()
      .from(communityNotices)
      .where(eq(communityNotices.buildingId, buildingId))
      .orderBy(desc(communityNotices.createdAt))
      .limit(10);

    // 2. Fetch approved rules
    const buildingRules = await db.select()
      .from(rules)
      .where(and(eq(rules.buildingId, buildingId), eq(rules.isApproved, true)))
      .orderBy(desc(rules.createdAt))
      .limit(10);

    // 3. Merge and standardize
    const combined = [
      ...notices.map((n: any) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        type: n.type || 'NOTICE',
        createdAt: n.createdAt,
        createdBy: 'Property Admin'
      })),
      ...buildingRules.map((r: any) => ({
        id: r.id,
        title: r.title,
        content: r.description,
        type: 'RULE',
        createdAt: r.createdAt,
        createdBy: 'Standard Operating Procedure'
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: combined });
  } catch (error) {
    console.error("Notices API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
