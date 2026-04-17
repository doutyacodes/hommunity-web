"use server";

import { sendPushNotification } from "@/lib/fcm";

export async function sendManualNotificationAction(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const payloadStr = formData.get("payload") as string;

    if (!token || !title || !body) {
      return { error: "Missing required fields (Token, Title, or Body)" };
    }

    let data = {};
    if (payloadStr) {
      try {
        data = JSON.parse(payloadStr);
      } catch (e) {
        return { error: "Invalid JSON in payload field" };
      }
    }

    const result = await sendPushNotification({
      token,
      title,
      body,
      data,
    });

    if (result.success) {
      return { success: true, messageId: result.messageId };
    } else {
      return { error: result.error || "Failed to send notification" };
    }
  } catch (error: any) {
    console.error("Manual Notification Action Error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}
