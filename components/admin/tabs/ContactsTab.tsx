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
