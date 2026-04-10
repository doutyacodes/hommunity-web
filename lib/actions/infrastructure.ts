"use server";

import { db } from "@/lib/db";
import { blocks, floors, apartments, apartmentResidents } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function createBlockAction(prevState: any, formData: FormData) {
  const buildingId = formData.get("buildingId") as string;
  const name = formData.get("name") as string;

  if (!buildingId || !name) {
    return { error: "Missing required fields." };
  }

  try {
    await db.insert(blocks).values({
      buildingId,
      name,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create block:", error);
    return { error: "Database operation failed." };
  }
}

export async function createFloorAction(prevState: any, formData: FormData) {
  const buildingId = formData.get("buildingId") as string;
  const floorNumber = formData.get("floorNumber") as string;
  const blockId = formData.get("blockId") as string || null;

  if (!buildingId || !floorNumber) {
    return { error: "Missing required fields." };
  }

  try {
    await db.insert(floors).values({
      buildingId,
      floorNumber,
      blockId: blockId === "none" ? null : blockId,
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create floor:", error);
    return { error: "Database operation failed." };
  }
}

export async function createApartmentAction(prevState: any, formData: FormData) {
  const buildingId = formData.get("buildingId") as string;
  const floorId = formData.get("floorId") as string;
  const unitNumberRaw = formData.get("unitNumber") as string;
  const type = formData.get("type") as string;

  if (!buildingId || !floorId || !unitNumberRaw) {
    return { error: "Missing required fields." };
  }

  // Handle both single and comma-separated multiple units
  const units = unitNumberRaw
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u !== "");

  if (units.length === 0) {
    return { error: "Please provide at least one valid unit number." };
  }

  try {
    const values = units.map((u) => ({
      buildingId,
      floorId,
      unitNumber: u,
      type,
    }));

    await db.insert(apartments).values(values);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to create apartments:", error);
    return { error: "Database operation failed. Check for duplicates." };
  }
}

// --- UPDATE & DELETE ACTIONS ---

export async function updateBlockAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!id || !name) return { error: "Missing identity or name." };

  try {
    await db.update(blocks).set({ name }).where(eq(blocks.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update block:", error);
    return { error: "Update failed." };
  }
}

export async function deleteBlockAction(id: string) {
  try {
    // Check if floors are attached
    const attachedFloors = await db.select().from(floors).where(eq(floors.blockId, id)).limit(1);
    if (attachedFloors.length > 0) {
      return { error: "Cannot delete block while floors are still attached to it." };
    }

    await db.delete(blocks).where(eq(blocks.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete block:", error);
    return { error: "Deletion failed." };
  }
}

export async function updateFloorAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const floorNumber = formData.get("floorNumber") as string;
  const blockId = formData.get("blockId") as string || null;

  if (!id || !floorNumber) return { error: "Missing level data." };

  try {
    await db.update(floors).set({ 
      floorNumber, 
      blockId: blockId === "none" ? null : blockId 
    }).where(eq(floors.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update floor:", error);
    return { error: "Update failed." };
  }
}

export async function deleteFloorAction(id: string) {
  try {
    const attachedUnits = await db.select().from(apartments).where(eq(apartments.floorId, id)).limit(1);
    if (attachedUnits.length > 0) {
      return { error: "Cannot delete floor while units exist on this level." };
    }

    await db.delete(floors).where(eq(floors.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete floor:", error);
    return { error: "Deletion failed." };
  }
}

export async function updateApartmentAction(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const unitNumber = formData.get("unitNumber") as string;
  const type = formData.get("type") as string;

  if (!id || !unitNumber) return { error: "Missing unit identity." };

  try {
    await db.update(apartments).set({ unitNumber, type }).where(eq(apartments.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to update apartment:", error);
    return { error: "Update failed." };
  }
}

export async function deleteApartmentAction(id: string) {
  try {
    const attachedResidents = await db.select().from(apartmentResidents).where(eq(apartmentResidents.apartmentId, id)).limit(1);
    if (attachedResidents.length > 0) {
       return { error: "Cannot delete unit while residents are still registered to it." };
    }

    await db.delete(apartments).where(eq(apartments.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete apartment:", error);
    return { error: "Deletion failed." };
  }
}
