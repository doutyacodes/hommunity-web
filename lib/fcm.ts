import admin from "firebase-admin";

// Prevent multiple initialization
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  // ROBUST SANITIZATION: Handles escaped / unescaped newlines and removes potential quotes
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    privateKey = privateKey.trim();
    // Handle the case where the key might be wrapped in literal quotes
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    // Replaces the LITERAL characters '\' and 'n' with an actual newline control character
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/\r/g, '');
  }

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase environment variables are missing or invalid");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error);
  }
}

export async function sendPushNotification({
  token,
  title,
  body,
  data = {},
}: {
  token: string;
  title: string;
  body: string;
  data?: any;
}) {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: {
        ...data,
        title,
        body,
      },
      android: {
        priority: "high" as const,
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    const response = await admin.messaging().send(message);

    return { success: true, messageId: response };
  } catch (error: any) {
    console.error("❌ FCM Error:", error);
    return { success: false, error: error.message };
  }
}
