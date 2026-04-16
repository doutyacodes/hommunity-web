"use server";

import { db } from "@/lib/db";
import { gates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createGateAction(prevState: any, formData: FormData) {
  const buildingId = formData.get("buildingId") as string;
  const name = formData.get("name") as string;
  const deliveryImageRequired = formData.get("deliveryImageRequired") === "on";

  if (!buildingId || !name) {
    return { error: "Missing required fields." };
  }

  try {
    await db.insert(gates).values({
      buildingId,
      name,
      deliveryImageRequired,
    });
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to create gate:", error);
    return { error: "Database operation failed." };
  }
}

export async function updateGateAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const deliveryImageRequired = formData.get("deliveryImageRequired") === "on";

  if (!id || !name) {
    return { error: "Missing identity or name." };
  }

  try {
    await db.update(gates).set({ 
      name,
      deliveryImageRequired,
    }).where(eq(gates.id, id));
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to update gate:", error);
    return { error: "Update failed." };
  }
}

export async function deleteGateAction(id: string) {
  try {
    await db.delete(gates).where(eq(gates.id, id));
    revalidatePath("/admin/gates");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete gate:", error);
    return { error: "Deletion failed." };
  }
}
