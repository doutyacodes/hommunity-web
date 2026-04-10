"use server";

import { db } from "@/lib/db";
import { globalRules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getGlobalRules() {
  try {
    const rules = await db.select().from(globalRules);
    return { success: true, data: rules };
  } catch (error) {
    console.error("Error fetching global rules:", error);
    return { success: false, error: "Failed to fetch global rules" };
  }
}

export async function createGlobalRule(data: { title: string; description: string }) {
  try {
    await db.insert(globalRules).values({
      title: data.title,
      description: data.description,
      status: "ACTIVE",
    });
    revalidatePath("/superadmin/rules");
    revalidatePath("/superadmin");
    return { success: true };
  } catch (error) {
    console.error("Error creating global rule:", error);
    return { success: false, error: "Failed to create rule" };
  }
}

export async function updateGlobalRule(id: string, data: { title: string; description: string }) {
  try {
    await db.update(globalRules).set({
      title: data.title,
      description: data.description,
    }).where(eq(globalRules.id, id));
    revalidatePath("/superadmin/rules");
    return { success: true };
  } catch (error) {
    console.error("Error updating global rule:", error);
    return { success: false, error: "Failed to update rule" };
  }
}

export async function toggleRuleStatus(id: string, currentStatus: "ACTIVE" | "DISABLED") {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await db.update(globalRules).set({
      status: newStatus,
    }).where(eq(globalRules.id, id));
    revalidatePath("/superadmin/rules");
    return { success: true };
  } catch (error) {
    console.error("Error toggling global rule status:", error);
    return { success: false, error: "Failed to toggle status" };
  }
}

export async function deleteGlobalRule(id: string) {
  try {
    await db.delete(globalRules).where(eq(globalRules.id, id));
    revalidatePath("/superadmin/rules");
    revalidatePath("/superadmin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting global rule:", error);
    return { success: false, error: "Failed to delete rule" };
  }
}
