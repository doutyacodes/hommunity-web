import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Initialize Firebase Admin if it hasn't been initialized
if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.join(process.cwd(), 'hommunity-test-firebase-adminsdk-fbsvc-5c0de00973.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized successfully.");
  } catch (error) {
    console.error("Firebase admin init failed:", error);
  }
}

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Device token is required' }, { status: 400 });
    }

    // CallKit / FCM payload structure
    // Data-only payload for background wake-up and CallKit handling
    const payload = {
      token: token,
      data: {
        uuid: crypto.randomUUID(),
        callerId: "GateManager",
        callerName: "Delivery (Uninvited)",
        callerAvatar: "", 
        hasVideo: "false",
        title: title || 'New Delivery',
        body: body || 'A delivery boy is at the gate. Accept or Decline?',
        type: 'uninvited_delivery'
      },
      android: {
        priority: 'high' as const,
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
          }
        },
        headers: {
          'apns-priority': '10',
          'apns-push-type': 'background'
        }
      }
    };

    const response = await admin.messaging().send(payload);
    return NextResponse.json({ success: true, messageId: response });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
