"use server";

import { db } from "@/lib/db";
import { guards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function createGuardAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const buildingId = formData.get("buildingId") as string;

  if (!name || !phone || !password || !buildingId) {
    return { error: "Missing required fields (Name, Phone, Password)." };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await db.insert(guards).values({
      name,
      phone,
      email: email || null,
      passwordHash,
      buildingId,
    });
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create guard:", error);
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes("unique")) {
      return { error: "A guard with this phone number already exists." };
    }
    return { error: "Database operation failed." };
  }
}

export async function updateGuardAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!id || !name || !phone) {
    return { error: "Missing identity or required fields." };
  }

  try {
    const updateData: any = { name, phone, email: email || null };
    
    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await db.update(guards).set(updateData).where(eq(guards.id, id));
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update guard:", error);
    if (error.code === 'ER_DUP_ENTRY' || error.message?.includes("unique")) {
      return { error: "This phone number is already taken by another guard." };
    }
    return { error: "Update failed." };
  }
}

export async function deleteGuardAction(id: string) {
  try {
    // Note: We might want to check shifts here, but for now we allow direct removal
    await db.delete(guards).where(eq(guards.id, id));
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete guard:", error);
    return { error: "Deletion failed." };
  }
}
