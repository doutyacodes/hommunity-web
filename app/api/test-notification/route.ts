import { NextResponse } from 'next/server';
import { sendPushNotification } from '@/lib/fcm';

export async function POST(req: Request) {
  try {
    const { token, title, body } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Device token is required' }, { status: 400 });
    }

    const result = await sendPushNotification({
      token: token,
      title: title || 'New Delivery',
      body: body || 'A delivery boy is at the gate. Accept or Decline?',
      data: {
        uuid: crypto.randomUUID(),
        callerId: "GateManager",
        callerName: "Delivery (Uninvited)",
        callerAvatar: "", 
        hasVideo: "false",
        type: 'uninvited_delivery'
      }
    });

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in test notification API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
