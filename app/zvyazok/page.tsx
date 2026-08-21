'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, User, MessageSquare, CheckCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { createLead } from '@/lib/supabase';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function ContactsPage() {
  const { settings } = useSiteSettings();
  const contacts = settings.contacts;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createLead({
        name,
        phone,
        lead_type: 'consultation',
        comment: message,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-gray-50/80 rounded-3xl p-6 sm:p-8 border border-gray-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
          <MessageSquare className="w-4 h-4" />
          <span>Зв'язатися з нами</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Контакти та консультація</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl">
          Замовляйте жалюзі та ролети з доставкою та встановленням у м. Дніпро та по всій Україні. Безкоштовна консультація, прорахунок вартості та підбір зразків.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <h2 className="font-extrabold text-lg text-gray-900">Наші контакти</h2>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Контактна особа:</div>
                <div className="text-gray-800 font-semibold text-sm">{contacts.masterName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Телефони для замовлень:</div>
                <a href={`tel:${contacts.phone1.replace(/[^0-9]/g, '')}`} className="block text-blue-600 font-bold text-sm hover:underline">
                  {contacts.phone1}
                </a>
                {contacts.phone2 && (
                  <a href={`tel:${contacts.phone2.replace(/[^0-9]/g, '')}`} className="block text-blue-600 font-bold text-sm hover:underline">
                    {contacts.phone2}
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <InstagramIcon className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Instagram:</div>
                <a
                  href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 font-semibold hover:underline"
                >
                  Instagram сторінка
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Локація:</div>
                <p className="text-gray-600 font-medium">{contacts.city} (Виїзд на замір по місту + відправка по Україні)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">Графік роботи:</div>
                <p className="text-gray-600">{contacts.workHours}</p>
              </div>
            </div>
          </div>

          {/* Quick Chat Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={contacts.telegramUrl || 'https://t.me/+380939128531'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 bg-[#2CA5E0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
            <a
              href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <a
              href={`viber://chat?number=${encodeURIComponent(contacts.viberNumber || '+380939128531')}`}
              className="flex-1 py-2.5 px-3 bg-[#7F4DA0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs hover:opacity-90 transition"
            >
              <span>Viber</span>
            </a>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="font-extrabold text-lg text-gray-900">Замовити замір або безкоштовну консультацію</h2>
          <p className="text-xs text-gray-500">
            Залиште ваші контакти, і Віктор зв'яжеться з вами протягом 15 хвилин для консультації чи домовленості про замір.
          </p>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">Заявку успішно прийнято!</h3>
              <p className="text-xs text-emerald-700">
                Дякуємо за звернення. Віктор незабаром зателефонує вам.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ваше ім'я *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Олена"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Номер телефону *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+38 (093) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ваше запитання або побажання щодо вікон
                </label>
                <textarea
                  rows={4}
                  placeholder="Вкажіть приблизні розміри вікон або які моделі (рулонні штори, день-ніч, жалюзі) вас цікавлять..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Відправка...' : 'Замовити консультацію'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
