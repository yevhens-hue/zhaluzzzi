'use client';

import React from 'react';
import { Send, PhoneCall } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export function TelegramWidget() {
  const { settings } = useSiteSettings();
  const contacts = settings.contacts;

  return (
    <div className="fixed bottom-[80px] right-5 z-40 flex flex-col gap-2.5 items-end">
      {/* Phone call */}
      <a
        href={`tel:${contacts.phone1.replace(/[^0-9]/g, '')}`}
        className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
        title={`Зателефонувати: ${contacts.phone1}`}
        aria-label={`Зателефонувати: ${contacts.phone1}`}
      >
        <PhoneCall className="w-5 h-5 animate-bounce" />
        <span className="absolute right-14 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {contacts.phone1} ({contacts.masterName})
        </span>
      </a>

      {/* Instagram direct */}
      <a
        href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 hover:opacity-95 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
        title="Instagram"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-5 h-5" />
        <span className="absolute right-14 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Instagram
        </span>
      </a>

      {/* Telegram */}
      <a
        href={contacts.telegramUrl || 'https://t.me/+380939128531'}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#2CA5E0] hover:bg-[#2392c7] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group relative"
        title="Telegram Чат"
        aria-label="Telegram Чат"
      >
        <Send className="w-5 h-5" />
        <span className="absolute right-14 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Чат у Telegram
        </span>
      </a>
    </div>
  );
}
