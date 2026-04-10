"use server";

import { db } from "@/lib/db";
import { admins, buildingAdmins } from "@/lib/db/schema";
import { getSession } from "@/lib/session";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function provisionAdminAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "SUPERADMIN") {
    return { error: "Unauthorized. Super Admin access required." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const buildingId = formData.get("buildingId") as string;

  if (!name || !email || !password || !buildingId) {
    return { error: "All required fields must be filled out." };
  }

  try {
    // Check if email exists
    const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    if (existing.length > 0) {
      return { error: "An administrator with this email already exists." };
    }

    const hash = await bcrypt.hash(password, 10);
    const newAdminId = randomUUID();

    // 1. Insert into Admins
    await db.insert(admins).values({
      id: newAdminId,
      name,
      email,
      passwordHash: hash,
      role: "ADMIN",
      permissions: ["MANAGE_RESIDENTS", "MANAGE_GATES", "MANAGE_INFRASTRUCTURE"],
    });

    // 2. Link to Building
    await db.insert(buildingAdmins).values({
      id: randomUUID(),
      adminId: newAdminId,
      buildingId: buildingId,
    });

    return { success: true };
  } catch (err) {
    console.error("Provisioning error:", err);
    return { error: "Database rejected the provisioning attempt." };
  }
}
