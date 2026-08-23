import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotification, sendLeadNotification } from '@/lib/notifications';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data, orderNumber } = body;

    if (!data) {
      return NextResponse.json({ error: 'Missing data payload' }, { status: 400 });
    }

    // Validate phone number if present
    const phone = data.phone;
    if (phone) {
      const phoneVal = validateAndNormalizeUaPhone(phone);
      if (!phoneVal.isValid) {
        return NextResponse.json(
          { error: phoneVal.error || 'Некоректний номер телефону' },
          { status: 400 }
        );
      }
      data.phone = phoneVal.normalizedPhone;
    }

    if (type === 'order') {
      const result = await sendOrderNotification(data, orderNumber || `ZN-${Date.now().toString().slice(-4)}`);
      return NextResponse.json({ success: true, result });
    } else if (type === 'lead') {
      const result = await sendLeadNotification(data);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 });
  } catch (error: any) {
    console.error('Notification API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
