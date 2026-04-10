"use server";

import { db } from "@/lib/db";
import { buildings, buildingAdmins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { randomUUID } from "crypto";

export async function createBuildingAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "SUPERADMIN") {
    return { error: "Unauthorized. Super Admin access required." };
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const description = formData.get("description") as string;
  const latitude = formData.get("latitude") as string;
  const longitude = formData.get("longitude") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !address) {
    return { error: "Name and Address are required." };
  }

  const newBuildingId = randomUUID();

  try {
    const buildingValues = {
      id: newBuildingId,
      name,
      address,
      status: "ACTIVE" as const,
      latitude: latitude || null,
      longitude: longitude || null,
      imageUrl: imageUrl || null,
      metadata: { description },
    };

    await db.insert(buildings).values(buildingValues);
    revalidatePath("/superadmin/buildings");
    return { success: true };
  } catch (error) {
    console.error("error creating building", error);
    return { error: "Failed to save building to database." };
  }
}

export async function updateBuildingAction(id: string, data: { name: string; address: string; latitude: string; longitude: string }) {
  try {
    await db.update(buildings).set({
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
    }).where(eq(buildings.id, id));
    
    revalidatePath("/buildings");
    revalidatePath(`/superadmin/buildings/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating building:", error);
    return { success: false, error: "Failed to update building details." };
  }
}

export async function toggleBuildingStatusAction(id: string, currentStatus: "ACTIVE" | "DISABLED") {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    await db.update(buildings).set({
      status: newStatus,
    }).where(eq(buildings.id, id));
    
    revalidatePath("/buildings");
    revalidatePath(`/superadmin/buildings/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error toggling building status:", error);
    return { success: false, error: "Failed to update building status." };
  }
}
