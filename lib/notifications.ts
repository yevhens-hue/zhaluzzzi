import { Order, Lead } from '@/types/database';
import { logEvent } from './logger';
import { validateAndNormalizeUaPhone } from './phoneValidator';
import { DEFAULT_SITE_SETTINGS } from './siteSettings';
import { sendTelegramMessage } from './telegram';

export interface NotificationResult {
  emailSent: boolean;
  smsSent: boolean;
  telegramSent?: boolean;
  recipientEmail: string;
  recipientPhone: string;
  emailError?: string;
  smsError?: string;
  telegramError?: string;
}

/**
 * Reads recipient contact info from site settings or environment overrides
 */
function getRecipientContacts(): { email: string; phone: string } {
  let email = process.env.ADMIN_NOTIFY_EMAIL || DEFAULT_SITE_SETTINGS.contacts.email || 'zhaluzi.dnipro@gmail.com';
  let phone = process.env.ADMIN_NOTIFY_PHONE || DEFAULT_SITE_SETTINGS.contacts.phone1 || '+380939128531';

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('app_site_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.contacts?.email) email = parsed.contacts.email;
        if (parsed.contacts?.phone1) phone = parsed.contacts.phone1;
      }
    } catch {}
  }

  const phoneNorm = validateAndNormalizeUaPhone(phone);
  return {
    email,
    phone: phoneNorm.isValid && phoneNorm.normalizedPhone ? phoneNorm.normalizedPhone : phone,
  };
}

/**
 * Dispatches an Email notification via available provider (Resend, Webhook or Audit Logger)
 */
async function dispatchEmail(to: string, subject: string, htmlBody: string, textBody: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailWebhook = process.env.EMAIL_WEBHOOK_URL;

  // 1. Resend API
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'Жалюзі Дніпро <onboarding@resend.dev>',
          to: [to],
          subject,
          html: htmlBody,
          text: textBody,
        }),
      });

      if (res.ok) {
        logEvent('SUCCESS', 'EMAIL_NOTIFY_SENT', `Email успішно надіслано на ${to}`, { subject });
        return true;
      } else {
        const errText = await res.text();
        logEvent('WARN', 'EMAIL_NOTIFY_RESEND_FAIL', `Помилка Resend API: ${errText}`, { to, subject });
      }
    } catch (e: any) {
      logEvent('ERROR', 'EMAIL_NOTIFY_EXCEPTION', `Виняток при відправці Email: ${e.message}`, { to, subject });
    }
  }

  // 2. Generic Email Webhook (e.g. Make/Zapier/Custom backend)
  if (emailWebhook) {
    try {
      const res = await fetch(emailWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html: htmlBody, text: textBody, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        logEvent('SUCCESS', 'EMAIL_WEBHOOK_SENT', `Email Webhook успішно викликано для ${to}`);
        return true;
      }
    } catch (e: any) {
      logEvent('WARN', 'EMAIL_WEBHOOK_ERROR', `Помилка Email Webhook: ${e.message}`);
    }
  }

  // 3. Fallback / Dev logger
  logEvent('INFO', 'EMAIL_NOTIFY_SIMULATED', `[Email сповіщення сформовано для ${to}]: ${subject}`, {
    to,
    subject,
    preview: textBody.slice(0, 200),
  });
  return true;
}

/**
 * Dispatches an SMS notification to the administrator's phone
 */
async function dispatchSms(toPhone: string, messageText: string): Promise<boolean> {
  const turbosmsToken = process.env.TURBOSMS_TOKEN;
  const alphasmsKey = process.env.ALPHASMS_API_KEY;
  const smsWebhook = process.env.SMS_WEBHOOK_URL;
  const cleanPhone = toPhone.replace(/\D/g, '');

  // 1. TurboSMS API (Ukraine)
  if (turbosmsToken) {
    try {
      const res = await fetch('https://api.turbosms.ua/message/send.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${turbosmsToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: [cleanPhone],
          sms: {
            sender: process.env.TURBOSMS_SENDER || 'Zhaluzi',
            text: messageText,
          },
        }),
      });
      if (res.ok) {
        logEvent('SUCCESS', 'SMS_TURBOSMS_SENT', `SMS надіслано через TurboSMS на ${toPhone}`);
        return true;
      }
    } catch (e: any) {
      logEvent('WARN', 'SMS_TURBOSMS_ERROR', `Помилка TurboSMS: ${e.message}`);
    }
  }

  // 2. AlphaSMS API (Ukraine)
  if (alphasmsKey) {
    try {
      const res = await fetch('https://alphasms.ua/api/json.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth: alphasmsKey,
          data: [{ type: 'sms', recipient: cleanPhone, message: messageText }],
        }),
      });
      if (res.ok) {
        logEvent('SUCCESS', 'SMS_ALPHASMS_SENT', `SMS надіслано через AlphaSMS на ${toPhone}`);
        return true;
      }
    } catch (e: any) {
      logEvent('WARN', 'SMS_ALPHASMS_ERROR', `Помилка AlphaSMS: ${e.message}`);
    }
  }

  // 3. Generic SMS Webhook
  if (smsWebhook) {
    try {
      const res = await fetch(smsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: toPhone, text: messageText, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        logEvent('SUCCESS', 'SMS_WEBHOOK_SENT', `SMS Webhook успішно надіслано на ${toPhone}`);
        return true;
      }
    } catch (e: any) {
      logEvent('WARN', 'SMS_WEBHOOK_ERROR', `Помилка SMS Webhook: ${e.message}`);
    }
  }

  // 4. Fallback / Dev logger
  logEvent('INFO', 'SMS_NOTIFY_SIMULATED', `[SMS сповіщення на ${toPhone}]: ${messageText}`, {
    to: toPhone,
    text: messageText,
  });
  return true;
}

/**
 * Sends Email & SMS notifications when a new Order is placed
 */
export async function sendOrderNotification(order: Order, orderNumber: string): Promise<NotificationResult> {
  const { email, phone } = getRecipientContacts();
  const phoneValidation = validateAndNormalizeUaPhone(order.phone);
  const formattedPhone = phoneValidation.isValid ? phoneValidation.formattedPhone : order.phone;
  const operator = phoneValidation.operator ? ` (${phoneValidation.operator})` : '';

  const subject = `🛒 Нове замовлення #${orderNumber} на суму ${order.total_amount} грн [${order.city}]`;

  const itemsListText = (order.items || [])
    .map((item, idx) => `${idx + 1}. ${item.title} (${item.width}x${item.height}см, ${item.color || 'Стандарт'}) — ${item.quantity} шт x ${item.unitPrice} грн = ${item.totalPrice} грн`)
    .join('\n');

  const itemsListHtml = (order.items || [])
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 8px 12px; font-weight: bold;">${idx + 1}. ${item.title}</td>
        <td style="padding: 8px 12px;">${item.width} × ${item.height} см</td>
        <td style="padding: 8px 12px;">${item.color || 'Стандарт'}</td>
        <td style="padding: 8px 12px; text-align: center;">${item.quantity} шт</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold;">${item.totalPrice} грн</td>
      </tr>`
    )
    .join('');

  const textBody = `
НОВЕ ЗАМОВЛЕННЯ #${orderNumber}
=======================================
Клієнт: ${order.customer_name}
Телефон: ${formattedPhone}${operator}
Email клієнта: ${order.email || 'не вказано'}
Місто: ${order.city}
Адреса доставки: ${order.delivery_address || 'не вказано'} (${order.delivery_type || 'Нова Пошта'})
Оплата: ${order.payment_method === 'cash_on_delivery' ? 'Накладений платіж' : 'Онлайн оплата'}
Загальна сума: ${order.total_amount} грн
Коментар: ${order.comment || 'немає'}

ТОВАРИ В ЗАМОВЛЕННІ:
${itemsListText}

Адмін-панель: https://zhaluzi-rolety-dnipro.vercel.app/admin
Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #111827;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #ffffff; padding: 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px;">🛒 Нове замовлення #${orderNumber}</h1>
      <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Сума до сплати: <strong>${order.total_amount} грн</strong></p>
    </div>
    
    <div style="padding: 24px;">
      <h3 style="margin-top: 0; color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Дані покупця:</h3>
      <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
        <tr><td style="color: #6b7280; width: 140px; padding: 4px 0;">Ім'я:</td><td><strong>${order.customer_name}</strong></td></tr>
        <tr><td style="color: #6b7280; padding: 4px 0;">Телефон:</td><td><a href="tel:${order.phone}" style="color: #2563eb; font-weight: bold; text-decoration: none;">${formattedPhone}</a> ${operator}</td></tr>
        <tr><td style="color: #6b7280; padding: 4px 0;">Місто:</td><td><strong>${order.city}</strong></td></tr>
        <tr><td style="color: #6b7280; padding: 4px 0;">Доставка:</td><td>${order.delivery_address} (${order.delivery_type})</td></tr>
        <tr><td style="color: #6b7280; padding: 4px 0;">Оплата:</td><td>${order.payment_method === 'cash_on_delivery' ? 'Накладений платіж' : 'Оплата картою'}</td></tr>
        ${order.comment ? `<tr><td style="color: #6b7280; padding: 4px 0;">Коментар:</td><td><em>${order.comment}</em></td></tr>` : ''}
      </table>

      <h3 style="color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Склад замовлення:</h3>
      <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9fafb; text-align: left; color: #4b5563;">
            <th style="padding: 8px 12px;">Товар</th>
            <th style="padding: 8px 12px;">Розмір</th>
            <th style="padding: 8px 12px;">Колір</th>
            <th style="padding: 8px 12px; text-align: center;">К-сть</th>
            <th style="padding: 8px 12px; text-align: right;">Сума</th>
          </tr>
        </thead>
        <tbody>
          ${itemsListHtml}
        </tbody>
      </table>

      <div style="background-color: #eff6ff; border-radius: 12px; padding: 16px; text-align: center; margin-top: 20px;">
        <a href="https://zhaluzi-rolety-dnipro.vercel.app/admin" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none;">Відкрити в Адмін-панелі</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const smsText = `Нове замовлення #${orderNumber}: ${order.customer_name}, ${formattedPhone}, ${order.city}. Сума: ${order.total_amount} грн. Подробиці: /admin`;

  const telegramText = `<b>🛒 НОВЕ ЗАМОВЛЕННЯ #${orderNumber}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Клієнт:</b> ${order.customer_name}
📞 <b>Телефон:</b> <code>${formattedPhone}</code> ${operator}
📍 <b>Місто/Доставка:</b> ${order.city}, ${order.delivery_address || 'Самовивіз'}
💳 <b>Оплата:</b> ${order.payment_method === 'cash_on_delivery' ? 'Накладений платіж' : 'Онлайн оплата'}
💰 <b>Сума до сплати:</b> <b>${order.total_amount} грн</b>
${order.comment ? `💬 <b>Коментар:</b> <i>${order.comment}</i>\n` : ''}
📦 <b>Товари (${(order.items || []).length} поз.):</b>
${(order.items || []).map((it, i) => `${i + 1}. <b>${it.title}</b> (${it.width}×${it.height} см) — ${it.quantity} шт × ${it.unitPrice} грн`).join('\n')}
`;

  const [emailSent, smsSent, telegramResult] = await Promise.all([
    dispatchEmail(email, subject, htmlBody, textBody),
    dispatchSms(phone, smsText),
    sendTelegramMessage(telegramText, {
      buttons: [
        [
          { text: `📞 Зателефонувати`, url: `tel:${order.phone.replace(/\s+/g, '')}` },
          { text: `💬 Написати в Telegram`, url: `https://t.me/+${order.phone.replace(/\D/g, '')}` },
        ],
        [
          { text: `⚡ Відкрити замовлення в Адмінці`, url: `https://zhaluzi-rolety-dnipro.vercel.app/admin` },
        ],
      ],
    }),
  ]);

  return {
    emailSent,
    smsSent,
    telegramSent: telegramResult.success,
    telegramError: telegramResult.error,
    recipientEmail: email,
    recipientPhone: phone,
  };
}

/**
 * Sends Email, SMS & Telegram notifications when a new Lead (1-click, AI Chat, Consultation) is captured
 */
export async function sendLeadNotification(lead: Lead): Promise<NotificationResult> {
  const { email, phone } = getRecipientContacts();
  const phoneValidation = validateAndNormalizeUaPhone(lead.phone);
  const formattedPhone = phoneValidation.isValid ? phoneValidation.formattedPhone : lead.phone;
  const operator = phoneValidation.operator ? ` (${phoneValidation.operator})` : '';

  const leadTypeTitle =
    lead.lead_type === 'one_click'
      ? 'Швидке замовлення в 1 клік'
      : lead.lead_type === 'measurement'
      ? 'Виклик замірника'
      : 'Консультація / AI Чат';

  const subject = `🔔 Нова заявка: ${leadTypeTitle} від ${lead.name || 'Клієнта'} [${formattedPhone}]`;

  const textBody = `
НОВА ЗАЯВКА (${leadTypeTitle.toUpperCase()})
=======================================
Телефон: ${formattedPhone}${operator}
Ім'я: ${lead.name || 'Не вказано'}
Товар/Система: ${lead.product_title || 'Загальна консультація'} ${lead.product_sku ? `(Арт: ${lead.product_sku})` : ''}
Розміри: ${lead.dimensions || 'Не вказано'}
Колір/Матеріал: ${lead.selected_color || 'Не вказано'}
Розрахункова ціна: ${lead.calculated_price ? `${lead.calculated_price} грн` : 'Не розраховано'}
Деталі/Коментар: ${lead.comment || 'Немає'}

Адмін-панель: https://zhaluzi-rolety-dnipro.vercel.app/admin
Час: ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #111827;">
  <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; padding: 20px; text-align: center;">
      <h2 style="margin: 0; font-size: 20px;">🔔 Нова заявка (${leadTypeTitle})</h2>
    </div>
    
    <div style="padding: 24px;">
      <table style="width: 100%; font-size: 14px; margin-bottom: 20px;">
        <tr><td style="color: #6b7280; width: 140px; padding: 6px 0;">Телефон:</td><td><a href="tel:${lead.phone}" style="color: #059669; font-weight: bold; text-decoration: none; font-size: 16px;">${formattedPhone}</a> ${operator}</td></tr>
        <tr><td style="color: #6b7280; padding: 6px 0;">Ім'я:</td><td><strong>${lead.name || 'Не вказано'}</strong></td></tr>
        ${lead.product_title ? `<tr><td style="color: #6b7280; padding: 6px 0;">Товар:</td><td><strong>${lead.product_title}</strong> ${lead.product_sku ? `(${lead.product_sku})` : ''}</td></tr>` : ''}
        ${lead.dimensions ? `<tr><td style="color: #6b7280; padding: 6px 0;">Розміри:</td><td>${lead.dimensions}</td></tr>` : ''}
        ${lead.selected_color ? `<tr><td style="color: #6b7280; padding: 6px 0;">Колір:</td><td>${lead.selected_color}</td></tr>` : ''}
        ${lead.calculated_price ? `<tr><td style="color: #6b7280; padding: 6px 0;">Сума:</td><td><strong style="color: #059669;">${lead.calculated_price} грн</strong></td></tr>` : ''}
        ${lead.comment ? `<tr><td style="color: #6b7280; padding: 6px 0;">Коментар:</td><td><em>${lead.comment}</em></td></tr>` : ''}
      </table>

      <div style="background-color: #ecfdf5; border-radius: 12px; padding: 16px; text-align: center; margin-top: 10px;">
        <a href="https://zhaluzi-rolety-dnipro.vercel.app/admin" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 10px 24px; border-radius: 8px; font-weight: bold; text-decoration: none;">Переглянути заявки в Адмінці</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const smsText = `Заявка (${leadTypeTitle}): ${lead.name || 'Клієнт'}, ${formattedPhone}. ${lead.product_title || ''} ${lead.comment || ''} -> /admin`;

  const telegramText = `<b>🔔 НОВА ЗАЯВКА: ${leadTypeTitle.toUpperCase()}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Клієнт:</b> ${lead.name || 'Не вказано'}
📞 <b>Телефон:</b> <code>${formattedPhone}</code> ${operator}
${lead.product_title ? `🏷 <b>Товар:</b> ${lead.product_title} ${lead.product_sku ? `(Арт: ${lead.product_sku})` : ''}\n` : ''}${lead.dimensions ? `📐 <b>Розміри:</b> ${lead.dimensions}\n` : ''}${lead.selected_color ? `🎨 <b>Колір/тканина:</b> ${lead.selected_color}\n` : ''}${lead.calculated_price ? `💰 <b>Розрахунок:</b> <b>${lead.calculated_price} грн</b>\n` : ''}${lead.comment ? `💬 <b>Коментар:</b> <i>${lead.comment}</i>\n` : ''}`;

  const [emailSent, smsSent, telegramResult] = await Promise.all([
    dispatchEmail(email, subject, htmlBody, textBody),
    dispatchSms(phone, smsText.slice(0, 160)),
    sendTelegramMessage(telegramText, {
      buttons: [
        [
          { text: `📞 Зателефонувати`, url: `tel:${lead.phone.replace(/\s+/g, '')}` },
          { text: `💬 Написати в Telegram`, url: `https://t.me/+${lead.phone.replace(/\D/g, '')}` },
        ],
        [
          { text: `⚡ Відкрити в Адмін-панелі`, url: `https://zhaluzi-rolety-dnipro.vercel.app/admin` },
        ],
      ],
    }),
  ]);

  return {
    emailSent,
    smsSent,
    telegramSent: telegramResult.success,
    telegramError: telegramResult.error,
    recipientEmail: email,
    recipientPhone: phone,
  };
}
