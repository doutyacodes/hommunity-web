"use server";

import { db } from "@/lib/db";
import { apartmentResidents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateResidentStatusAction(id: string, status: "APPROVED" | "REJECTED") {
  try {
    await db.update(apartmentResidents).set({ status }).where(eq(apartmentResidents.id, id));
    revalidatePath("/admin/residents");
    return { success: true };
  } catch (error) {
    console.error("Failed to update resident status:", error);
    return { error: "Update failed." };
  }
}

export async function deleteResidentLinkAction(id: string) {
  try {
    await db.delete(apartmentResidents).where(eq(apartmentResidents.id, id));
    revalidatePath("/admin/residents");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete resident link:", error);
    return { error: "Deletion failed." };
  }
}
