import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import { sendTelegramMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const { botToken, chatId } = await req.json();

    const text = `🔔 <b>Тестове сповіщення від магазину «Жалюзі & Рулонні Штори Дніпро»</b>
━━━━━━━━━━━━━━━━━━
✅ Підключення до Telegram успішно налаштовано!
🚀 Тепер ви та ваші майстри миттєво отримуватимете всі нові замовлення та заявки на замір.
🕐 Час перевірки: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`;

    const result = await sendTelegramMessage(text, {
      botToken,
      chatId,
      buttons: [
        [{ text: '🌐 Перейти на сайт', url: 'https://zhaluzi-rolety-dnipro.vercel.app' }],
        [{ text: '⚙️ Відкрити Адмінку', url: 'https://zhaluzi-rolety-dnipro.vercel.app/admin' }],
      ],
    });

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ error: result.error || 'Помилка відправки Telegram' }, { status: 400 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
