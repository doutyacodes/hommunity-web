import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { db } from '@/lib/db';
import { residents, apartmentResidents, notifications, guards, userPushTokens } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
      console.log("Firebase Admin Initialized via Environment Variables.");
    } else {
      console.warn("Firebase Admin environment variables missing. Notifications may not work.");
    }
  } catch (error) {
    console.error("Firebase admin utility init failed:", error);
  }
}

export type NotificationType = 'uninvited_delivery' | 'guest_arrival' | 'sos_alert' | 'notice' | 'approval_update';

interface BasePayload {
  title: string;
  body: string;
  type: NotificationType;
  actionType?: string;
  referenceId?: string;
  payloadData?: any;
}

export async function sendNotificationToApartment(apartmentId: string, payload: BasePayload) {
  try {
    // 1. Find all residents linked to this apartment
    const linkedResidents = await db.select({
      id: residents.id,
    })
    .from(apartmentResidents)
    .innerJoin(residents, eq(apartmentResidents.residentId, residents.id))
    .where(eq(apartmentResidents.apartmentId, apartmentId));

    // 2. Fetch ALL tokens for all these residents (Multi-device support)
    const residentIds = linkedResidents.map((r: any) => r.id);
    const tokens = residentIds.length > 0 
      ? (await db.select({ t: userPushTokens.pushToken })
          .from(userPushTokens)
          .where(and(
            inArray(userPushTokens.userId, residentIds),
            eq(userPushTokens.userType, 'RESIDENT')
          )))
          .map((r: any) => r.t)
      : [];

    console.log(`[NOTIFY] Apartment ${apartmentId}: Found ${linkedResidents.length} residents, ${tokens.length} total tokens across all devices.`);

    // 2. Save to Notification History
    for (const res of linkedResidents) {
      await db.insert(notifications).values({
        userId: res.id,
        userType: 'RESIDENT',
        title: payload.title,
        body: payload.body,
        type: payload.type,
        actionType: payload.actionType,
        referenceId: payload.referenceId,
        payload: payload.payloadData,
      });
    }

    if (tokens.length === 0) {
      console.warn(`[NOTIFY] No tokens found for apartment ${apartmentId}. Notification skipped.`);
      return;
    }

    console.log(`[NOTIFY] Dispatching to ${tokens.length} devices...`);
    return _sendMulticast(tokens, payload);
  } catch (error) {
    console.error("Error sending apartment notification:", error);
  }
}

export async function sendNotificationToUser(userId: string, userType: 'RESIDENT' | 'GUARD', payload: BasePayload) {
  try {
    // Fetch ALL active tokens for this user
    const userTokens = await db.select({ t: userPushTokens.pushToken })
      .from(userPushTokens)
      .where(and(
        eq(userPushTokens.userId, userId),
        eq(userPushTokens.userType, userType)
      ));
    
    const tokens = userTokens.map((r: any) => r.t);

    // Save to History
    await db.insert(notifications).values({
      userId,
      userType,
      title: payload.title,
      body: payload.body,
      type: payload.type,
      actionType: payload.actionType,
      referenceId: payload.referenceId,
      payload: payload.payloadData,
    });

    if (tokens.length === 0) return;

    return _sendMulticast(tokens, payload);
  } catch (error) {
    console.error("Error sending individual notification:", error);
  }
}

async function _sendMulticast(tokens: string[], payload: BasePayload) {
  const isCall = payload.actionType === 'INTERCOM_CALL';
  
  const message: admin.messaging.MulticastMessage = {
    tokens,
    data: {
      uuid: crypto.randomUUID(),
      title: payload.title,
      body: payload.body,
      type: payload.type,
      actionType: payload.actionType || '',
      referenceId: payload.referenceId || '',
      ...(payload.payloadData ? { payload: JSON.stringify(payload.payloadData) } : {})
    },
    android: {
      priority: 'high',
      ttl: isCall ? 0 : 3600 * 1000, // Calls should expire immediately if not delivered
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          alert: {
            title: payload.title,
            body: payload.body,
          },
          sound: isCall ? 'ringtone.aiff' : 'default',
        }
      },
      headers: {
        'apns-priority': '10', // High priority for calls
        'apns-push-type': 'alert',
      }
    }
  };

  return admin.messaging().sendEachForMulticast(message);
}
