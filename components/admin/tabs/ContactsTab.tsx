'use client';

import React from 'react';
import { SiteContacts } from '@/lib/siteSettings';
import { Phone, Save } from 'lucide-react';

interface ContactsTabProps {
  contactsForm: SiteContacts;
  setContactsForm: React.Dispatch<React.SetStateAction<SiteContacts>>;
  onSaveContacts: (e: React.FormEvent) => Promise<void>;
}

export default function ContactsTab({
  contactsForm,
  setContactsForm,
  onSaveContacts,
}: ContactsTabProps) {
  return (
    <form onSubmit={onSaveContacts} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Phone className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Контактна інформація та майстер</h2>
          <p className="text-xs text-gray-500">
            Телефони, посилання на соцмережі, графік та умови доставки
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">Контактна особа / Майстер *</label>
          <input
            type="text"
            value={contactsForm.masterName}
            onChange={(e) => setContactsForm({ ...contactsForm, masterName: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Місто / Локація *</label>
          <input
            type="text"
            value={contactsForm.city}
            onChange={(e) => setContactsForm({ ...contactsForm, city: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Основний телефон *</label>
          <input
            type="text"
            value={contactsForm.phone1}
            onChange={(e) => setContactsForm({ ...contactsForm, phone1: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Додатковий телефон</label>
          <input
            type="text"
            value={contactsForm.phone2}
            onChange={(e) => setContactsForm({ ...contactsForm, phone2: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Email для сповіщень про нові замовлення *</label>
          <input
            type="email"
            placeholder="zhaluzi.dnipro@gmail.com"
            value={contactsForm.email || ''}
            onChange={(e) => setContactsForm({ ...contactsForm, email: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Посилання на Instagram</label>
          <input
            type="text"
            value={contactsForm.instagramUrl}
            onChange={(e) => setContactsForm({ ...contactsForm, instagramUrl: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Посилання на Telegram</label>
          <input
            type="text"
            value={contactsForm.telegramUrl}
            onChange={(e) => setContactsForm({ ...contactsForm, telegramUrl: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Номер Viber</label>
          <input
            type="text"
            value={contactsForm.viberNumber}
            onChange={(e) => setContactsForm({ ...contactsForm, viberNumber: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Графік роботи</label>
          <input
            type="text"
            value={contactsForm.workHours}
            onChange={(e) => setContactsForm({ ...contactsForm, workHours: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Сума для безкоштовної доставки (грн)</label>
          <input
            type="number"
            value={contactsForm.deliveryFreeThreshold}
            onChange={(e) => setContactsForm({ ...contactsForm, deliveryFreeThreshold: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>
      </div>

      {/* Telegram Bot Notification Settings */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🤖</span>
          <h3 className="text-sm font-bold text-gray-900">Telegram Бот для замірників та замовлень</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Отримуйте миттєві картки нових замовлень та викликів замірника у ваш Telegram-чат з кнопками швидкого дзвінка та перегляду.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Telegram Bot Token</label>
            <input
              type="password"
              placeholder="123456789:ABCdefGhIJKlmNoPQRstuvWxyz"
              value={contactsForm.telegramBotToken || ''}
              onChange={(e) => setContactsForm({ ...contactsForm, telegramBotToken: e.target.value })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Telegram Chat ID або ID групи майстрів</label>
            <input
              type="text"
              placeholder="123456789 або -100123456789"
              value={contactsForm.telegramChatId || ''}
              onChange={(e) => setContactsForm({ ...contactsForm, telegramChatId: e.target.value })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">
            Підказка: створіть бота через <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">@BotFather</a>, або напишіть <code>/id</code> боту, щоб отримати Chat ID.
          </p>
          <button
            type="button"
            onClick={async () => {
              if (!contactsForm.telegramBotToken || !contactsForm.telegramChatId) {
                alert('Будь ласка, введіть Bot Token та Chat ID перед тестом!');
                return;
              }
              try {
                const res = await fetch('/api/admin/telegram/test', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Dnipro2026!'}`,
                  },
                  credentials: 'include',
                  body: JSON.stringify({
                    botToken: contactsForm.telegramBotToken,
                    chatId: contactsForm.telegramChatId,
                  }),
                });
                const data = await res.json();
                if (res.ok && data.success) {
                  alert('✅ Тестове повідомлення успішно надіслано в Telegram!');
                } else {
                  alert(`❌ Помилка Telegram: ${data.error || 'Не вдалося надіслати'}`);
                }
              } catch (e: any) {
                alert(`❌ Помилка запиту: ${e.message}`);
              }
            }}
            className="px-3.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            🔔 Перевірити звʼязок
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти контакти</span>
        </button>
      </div>
    </form>
  );
}
