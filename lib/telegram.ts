import { logEvent } from './logger';

export interface TelegramInlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface TelegramMessageOptions {
  chatId?: string;
  botToken?: string;
  parseMode?: 'HTML' | 'MarkdownV2';
  buttons?: TelegramInlineButton[][];
}

/**
 * Gets the Telegram bot credentials from environment or fallback parameters
 */
export function getTelegramCredentials(customToken?: string, customChatId?: string): { token: string | null; chatId: string | null } {
  const token = customToken || process.env.TELEGRAM_BOT_TOKEN || null;
  const chatId = customChatId || process.env.TELEGRAM_CHAT_ID || null;
  return { token, chatId };
}

/**
 * Sends a notification message to a Telegram chat/channel via the official Telegram Bot API
 */
export async function sendTelegramMessage(
  text: string,
  options: TelegramMessageOptions = {}
): Promise<{ success: boolean; error?: string; messageId?: number }> {
  const { token, chatId } = getTelegramCredentials(options.botToken, options.chatId);

  if (!token || !chatId) {
    logEvent('INFO', 'TELEGRAM_SKIPPED', 'Telegram Bot Token або Chat ID не налаштовані, сповіщення пропущено', {
      hasToken: !!token,
      hasChatId: !!chatId,
    });
    return { success: false, error: 'Telegram credentials missing' };
  }

  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text,
      parse_mode: options.parseMode || 'HTML',
      disable_web_page_preview: true,
    };

    if (options.buttons && options.buttons.length > 0) {
      payload.reply_markup = {
        inline_keyboard: options.buttons,
      };
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.ok) {
      logEvent('SUCCESS', 'TELEGRAM_SENT', `Повідомлення успішно надіслано в Telegram [Chat: ${chatId}]`, {
        messageId: data.result?.message_id,
      });
      return { success: true, messageId: data.result?.message_id };
    } else {
      const errMsg = data.description || `HTTP ${res.status}`;
      logEvent('WARN', 'TELEGRAM_API_ERROR', `Помилка Telegram API: ${errMsg}`, { chatId, error: errMsg });
      return { success: false, error: errMsg };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logEvent('ERROR', 'TELEGRAM_EXCEPTION', `Виняток при відправці в Telegram: ${msg}`, { error: msg });
    return { success: false, error: msg };
  }
}
