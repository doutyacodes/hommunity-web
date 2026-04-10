"use server";

import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { createSession } from "@/lib/session";

export async function loginAdmin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  try {
    const adminRows = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
    const admin = adminRows[0];

    if (!admin) {
      return { error: "Invalid credentials." };
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return { error: "Invalid credentials." };
    }

    // Secure via session cookie
    await createSession(admin.id, admin.role);

    return { success: true, role: admin.role };
  } catch (error) {
    console.error("Login err:", error);
    return { error: "Internal server error." };
  }
}

export async function changePasswordAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Session expired. Please log in again." };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  try {
    // 1. Fetch user
    const adminId = session.id as string;
    const user = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1);
    const admin = user[0];

    if (!admin) {
      return { error: "User not found." };
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return { error: "Current password is incorrect." };
    }

    // 3. Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // 4. Update
    await db.update(admins).set({
      passwordHash: newHash,
    }).where(eq(admins.id, adminId));

    return { success: "Password updated successfully." };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "An unexpected error occurred." };
  }
}
