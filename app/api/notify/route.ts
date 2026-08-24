import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotification, sendLeadNotification } from '@/lib/notifications';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';
import { checkRateLimit } from '@/lib/rateLimit';
import { logEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // 1. Rate limiting (max 15 notification requests per minute per IP)
  const rateCheck = checkRateLimit(req, 15, 60 * 1000);
  if (rateCheck.isLimited) {
    await logEvent('WARN', 'RATE_LIMIT_HIT', 'Перевищено ліміт запитів на відправку сповіщень', { requestId });
    return NextResponse.json(
      { error: 'Забагато запитів. Будь ласка, зачекайте хвилину перед повторною відправкою.' },
      { status: 429, headers: { 'x-request-id': requestId } }
    );
  }

  try {
    const body = await req.json();
    const { type, data, orderNumber } = body;

    if (!data) {
      return NextResponse.json(
        { error: 'Missing data payload' },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    // Validate phone number if present
    const phone = data.phone;
    if (phone) {
      const phoneVal = validateAndNormalizeUaPhone(phone);
      if (!phoneVal.isValid) {
        return NextResponse.json(
          { error: phoneVal.error || 'Некоректний номер телефону' },
          { status: 400, headers: { 'x-request-id': requestId } }
        );
      }
      data.phone = phoneVal.normalizedPhone;
    }

    // Sanitize string inputs (strip html tags, truncate excessive length)
    if (typeof data.name === 'string') {
      data.name = data.name.replace(/<[^>]*>?/gm, '').trim().slice(0, 100);
    }
    if (typeof data.comment === 'string') {
      data.comment = data.comment.replace(/<[^>]*>?/gm, '').trim().slice(0, 500);
    }

    if (type === 'order') {
      const num = orderNumber || `ZN-${Date.now().toString().slice(-4)}`;
      const result = await sendOrderNotification(data, num);
      await logEvent('INFO', 'ORDER_NOTIFICATION_SENT', `Сповіщення про замовлення ${num} надіслано`, {
        orderNumber: num,
        customerName: data.name,
        maskedPhone: data.phone ? `${data.phone.slice(0, 6)}***${data.phone.slice(-2)}` : undefined,
        requestId,
      });
      return NextResponse.json({ success: true, result }, { headers: { 'x-request-id': requestId } });
    } else if (type === 'lead') {
      const result = await sendLeadNotification(data);
      await logEvent('INFO', 'LEAD_NOTIFICATION_SENT', `Сповіщення про лід надіслано`, {
        leadName: data.name,
        maskedPhone: data.phone ? `${data.phone.slice(0, 6)}***${data.phone.slice(-2)}` : undefined,
        product: data.productTitle,
        requestId,
      });
      return NextResponse.json({ success: true, result }, { headers: { 'x-request-id': requestId } });
    }

    return NextResponse.json(
      { error: 'Invalid notification type' },
      { status: 400, headers: { 'x-request-id': requestId } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[Notification API Error]', { requestId, error: msg });
    await logEvent('ERROR', 'NOTIFICATION_API_ERROR', 'Помилка в Notification API', { error: msg, requestId });
    return NextResponse.json(
      { error: 'Не вдалося надіслати сповіщення. Спробуйте пізніше.' },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
