"use server";

import { db } from "@/lib/db";
import { apartmentResidents, residents, apartments, buildings, userPushTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendPushNotification } from "@/lib/fcm";

export async function updateResidentStatusAction(id: string, status: "APPROVED" | "REJECTED") {
  try {
    // 1. Fetch the resident link and user info
    const [linkInfo] = await db.select({
      residentId: apartmentResidents.residentId,
      apartmentId: apartmentResidents.apartmentId,
      unitNumber: apartments.unitNumber,
      buildingName: buildings.name,
      residentName: residents.name,
    })
    .from(apartmentResidents)
    .innerJoin(apartments, eq(apartmentResidents.apartmentId, apartments.id))
    .innerJoin(buildings, eq(apartments.buildingId, buildings.id))
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
    .where(eq(apartmentResidents.id, id))
    .limit(1);

    // 2. Update status
    await db.update(apartmentResidents).set({ status }).where(eq(apartmentResidents.id, id));
    
    // 3. Send Push Notification
    if (linkInfo) {
      // Fetch user tokens
      const tokens = await db.select().from(userPushTokens).where(and(
        eq(userPushTokens.userId, linkInfo.residentId),
        eq(userPushTokens.userType, 'RESIDENT')
      ));

      const title = status === "APPROVED" ? "Registration Approved! 🎉" : "Registration Update";
      const body = status === "APPROVED" 
        ? `Welcome! Your registration for ${linkInfo.buildingName} - Unit ${linkInfo.unitNumber} has been approved.`
        : `Your registration for ${linkInfo.buildingName} - Unit ${linkInfo.unitNumber} was not approved.`;

      for (const token of tokens) {
        if (token.pushToken) {
          await sendPushNotification({
            token: token.pushToken,
            title: title,
            body: body,
            data: {
              type: "approval_update",
              status: status,
              buildingName: linkInfo.buildingName,
              unitNumber: linkInfo.unitNumber
            }
          });
        }
      }
    }

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
