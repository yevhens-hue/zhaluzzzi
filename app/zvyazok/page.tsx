'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send, User, MessageSquare, CheckCircle } from 'lucide-react';
import { InstagramIcon } from '@/components/InstagramIcon';
import { createLead } from '@/lib/supabase';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useLanguage } from '@/context/LanguageContext';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';

export default function ContactsPage() {
  const { settings } = useSiteSettings();
  const contacts = settings.contacts;
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const phoneValidation = validateAndNormalizeUaPhone(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Введіть коректний номер телефону України');
      return;
    }

    setPhoneError(null);
    setIsSubmitting(true);

    try {
      const res = await createLead({
        name,
        phone: phoneValidation.normalizedPhone || phone,
        lead_type: 'consultation',
        comment: message,
      });
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setPhoneError(res.error || 'Помилка збереження заявки');
      }
    } catch (err) {
      console.error(err);
      setIsSubmitted(true);
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
          <span>{t('Зв\'язатися з нами', 'Связаться с нами')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900">{t('Контакти та консультація', 'Контакты и консультация')}</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl">
          {t(
            'Замовляйте жалюзі та ролети з доставкою та встановленням у м. Дніпро та по всій Україні. Безкоштовна консультація, прорахунок вартості та підбір зразків.',
            'Заказывайте жалюзи и роллеты с доставкой и установкой в г. Днепр и по всей Украине. Бесплатная консультация, просчет стоимости и подбор образцов.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          <h2 className="font-extrabold text-lg text-gray-900">{t('Наші контакти', 'Наши контакты')}</h2>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">{t('Контактна особа:', 'Контактное лицо:')}</div>
                <div className="text-gray-800 font-semibold text-sm">{contacts.masterName}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">{t('Телефони для замовлень:', 'Телефоны для заказов:')}</div>
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
                  {t('Instagram сторінка', 'Instagram страница')}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">{t('Локація:', 'Локация:')}</div>
                <p className="text-gray-600 font-medium">{contacts.city} ({t('Виїзд на замір по місту + відправка по Україні', 'Выезд на замер по городу + отправка по Украине')})</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-gray-900">{t('Графік роботи:', 'График работы:')}</div>
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
          <h2 className="font-extrabold text-lg text-gray-900">{t('Замовити замір або безкоштовну консультацію', 'Заказать замер или бесплатную консультацию')}</h2>
          <p className="text-xs text-gray-500">
            {t('Залиште ваші контакти, і Віктор зв\'яжеться з вами протягом 15 хвилин для консультації чи домовленості про замір.', 'Оставьте ваши контакты, и Виктор свяжется с вами в течение 15 минут для консультации или договоренности о замере.')}
          </p>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">{t('Заявку успішно прийнято!', 'Заявка успешно принята!')}</h3>
              <p className="text-xs text-emerald-700">
                {t('Дякуємо за звернення. Віктор незабаром зателефонує вам.', 'Спасибо за обращение. Виктор скоро перезвонит вам.')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Ваше ім\'я *', 'Ваше имя *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('Олена', 'Елена')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    {t('Номер телефону *', 'Номер телефона *')}
                  </label>
                  {phone.length >= 9 && phoneValidation.isValid && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ {phoneValidation.operator}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+38 (093) 123-45-67 або 0931234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:ring-1 ${
                    phoneError
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : phoneValidation.isValid
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
                {phoneError && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{phoneError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Ваше запитання або побажання щодо вікон', 'Ваш вопрос или пожелания по окнам')}
                </label>
                <textarea
                  rows={4}
                  placeholder={t(
                    'Вкажіть приблизні розміри вікон або які моделі (рулонні штори, день-ніч, жалюзі) вас цікавлять...',
                    'Укажите примерные размеры окон или какие модели (рулонные шторы, день-ночь, жалюзи) вас интересуют...'
                  )}
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
                {isSubmitting ? t('Відправка...', 'Отправка...') : t('Замовити консультацію', 'Заказать консультацию')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
