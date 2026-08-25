import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendTelegramMessage } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    if (!update || !update.message) {
      return NextResponse.json({ ok: true });
    }

    const message = update.message;
    const chatId = String(message.chat?.id);
    const text = (message.text || '').trim();

    if (!chatId || !text) {
      return NextResponse.json({ ok: true });
    }

    // Command router
    if (text === '/start' || text === '/help') {
      const welcomeText = `👋 <b>Вітаю в системі сповіщень «Жалюзі & Рулонні Штори Дніпро»!</b>

Я бот для сповіщень про нові замовлення та виклики замірників.

📋 <b>Доступні команди:</b>
/stats — Статистика замовлень та лідів
/orders — Останні 5 замовлень
/leads — Останні 5 заявок на замір
/id — Дізнатися ID цього чату

<i>Для підключення вкажіть ваш Chat ID (<code>${chatId}</code>) в налаштуваннях адмін-панелі.</i>`;

      await sendTelegramMessage(welcomeText, {
        chatId,
        buttons: [
          [{ text: '🌐 Відкрити сайт', url: 'https://zhaluzi-rolety-dnipro.vercel.app' }],
          [{ text: '⚙️ Адмін-панель', url: 'https://zhaluzi-rolety-dnipro.vercel.app/admin' }],
        ],
      });
    } else if (text === '/id') {
      await sendTelegramMessage(`🆔 <b>Ваш Telegram Chat ID:</b> <code>${chatId}</code>\n\nСкопіюйте його та вставте в Адмін-панелі сайту.`, {
        chatId,
      });
    } else if (text === '/stats') {
      let ordersCount = 0;
      let leadsCount = 0;

      if (supabase) {
        const { count: oCount } = await supabase.from('zhaluzi_orders').select('*', { count: 'exact', head: true });
        const { count: lCount } = await supabase.from('zhaluzi_leads').select('*', { count: 'exact', head: true });
        ordersCount = oCount || 0;
        leadsCount = lCount || 0;
      }

      const statsText = `📊 <b>Статистика магазину Жалюзі Дніпро:</b>
━━━━━━━━━━━━━━━━━━
🛒 Всього замовлень: <b>${ordersCount}</b>
🔔 Всього заявок на замір: <b>${leadsCount}</b>
🕐 Серверний час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`;

      await sendTelegramMessage(statsText, { chatId });
    } else if (text === '/orders') {
      let ordersText = '🛒 <b>Останні замовлення:</b>\n\n';
      if (supabase) {
        const { data: orders } = await supabase
          .from('zhaluzi_orders')
          .select('id, customer_name, total_amount, phone, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (orders && orders.length > 0) {
          orders.forEach((o, idx) => {
            ordersText += `${idx + 1}. <b>${o.customer_name}</b> — <b>${o.total_amount} грн</b> (${o.phone})\n`;
          });
        } else {
          ordersText += 'Замовлень поки немає.';
        }
      } else {
        ordersText += 'База даних не підключена.';
      }

      await sendTelegramMessage(ordersText, { chatId });
    } else if (text === '/leads') {
      let leadsText = '🔔 <b>Останні заявки / виклики замірника:</b>\n\n';
      if (supabase) {
        const { data: leads } = await supabase
          .from('zhaluzi_leads')
          .select('id, name, phone, product_title, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (leads && leads.length > 0) {
          leads.forEach((l, idx) => {
            leadsText += `${idx + 1}. <b>${l.name || 'Клієнт'}</b>: ${l.phone} (${l.product_title || 'Замір'})\n`;
          });
        } else {
          leadsText += 'Заявок поки немає.';
        }
      } else {
        leadsText += 'База даних не підключена.';
      }

      await sendTelegramMessage(leadsText, { chatId });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error('[Telegram Webhook Error]', err);
    return NextResponse.json({ ok: true });
  }
}
