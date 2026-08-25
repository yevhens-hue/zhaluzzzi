'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { Phone, MapPin, Clock, Send, ShieldCheck, User } from 'lucide-react';
import { Logo } from './Logo';
import { InstagramIcon } from './InstagramIcon';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useLanguage } from '@/context/LanguageContext';
import { APP_VERSION } from '@/lib/version';

export function Footer() {
  const { settings } = useSiteSettings();
  const { t } = useLanguage();
  const contacts = settings.contacts;

  return (
    <footer className="bg-slate-950 text-gray-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800 text-xs">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white rounded-2xl p-2">
              <Logo />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              {t(
                'Виробництво та монтаж жалюзі і тканинних ролет під замовлення у м. Дніпро та з доставкою по всій Україні. Індивідуальні розміри, європейські тканини та надійні механізми.',
                'Производство и монтаж жалюзи и тканевых роллет под заказ в г. Днепр и с доставкой по всей Украине. Индивидуальные размеры, европейские ткани и надежные механизмы.'
              )}
            </p>

            <div className="space-y-2.5 text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-white">{t('Контактна особа:', 'Контактное лицо:')} {contacts.masterName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{contacts.city} ({t('Доставка та відправка по всій Україні', 'Доставка и отправка по всей Украине')})</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${contacts.phone1.replace(/[^0-9]/g, '')}`} className="font-bold text-white hover:text-blue-400">{contacts.phone1}</a>
                {contacts.phone2 && (
                  <>
                    <span className="text-gray-600">/</span>
                    <a href={`tel:${contacts.phone2.replace(/[^0-9]/g, '')}`} className="font-bold text-white hover:text-blue-400">{contacts.phone2}</a>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{contacts.workHours}</span>
              </div>
            </div>

            {/* Messengers & Instagram */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram профіль Жалюзі та Ролети Дніпро"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href={contacts.telegramUrl || 'https://t.me/+380939128531'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Написати у Telegram майстру"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2CA5E0] hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </a>
              <a
                href={`viber://chat?number=${encodeURIComponent(contacts.viberNumber || '+380939128531')}`}
                aria-label="Написати у Viber майстру"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F4DA0] hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <span>Viber</span>
              </a>
            </div>
          </div>

          {/* Catalog: Ролети & Штори */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              {t('Ролети & Штори', 'Роллеты & Шторы')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/roleti?sub=tkanunni_roleti" className="hover:text-white">{t('Тканинні ролети', 'Тканевые роллеты')}</Link></li>
              <li><Link href="/roleti?sub=den-nich" className="hover:text-white">{t('Ролети День-Ніч', 'Роллеты День-Ночь')}</Link></li>
              <li><Link href="/roleti?sub=blekaut_roleti" className="hover:text-white">{t('Ролети Блекаут', 'Роллеты Блэкаут')}</Link></li>
              <li><Link href="/roleti?sub=dzhutovi_roleti" className="hover:text-white">{t('Джутові ролети', 'Джутовые роллеты')}</Link></li>
              <li><Link href="/shtori?sub=rimski" className="hover:text-white">{t('Римські штори', 'Римские шторы')}</Link></li>
              <li><Link href="/shtori?sub=plise" className="hover:text-white">{t('Штори Плісе Duo', 'Шторы Плиссе Duo')}</Link></li>
            </ul>
          </div>

          {/* Catalog: Жалюзі & Закрита система */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              {t('Жалюзі & Системи', 'Жалюзи & Системы')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi" className="hover:text-white">{t('Горизонтальні жалюзі 25 мм', 'Горизонтальные жалюзи 25 мм')}</Link></li>
              <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi" className="hover:text-white">{t('Вертикальні жалюзі 89/127 мм', 'Вертикальные жалюзи 89/127 мм')}</Link></li>
              <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi" className="hover:text-white">{t('Алюмінієві жалюзі', 'Алюминиевые жалюзи')}</Link></li>
              <li><Link href="/zhaluzi?sub=venus" className="hover:text-white">{t('Жалюзі Venus на стулку', 'Жалюзи Venus на створку')}</Link></li>
              <li><Link href="/zakryta-sistema" className="hover:text-white">{t('Закрита система з коробом', 'Закрытая система с коробом')}</Link></li>
            </ul>
          </div>

          {/* Customer Info */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              {t('Покупцям', 'Покупателям')}
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/aktsii" className="hover:text-white">{t('Акції та знижки', 'Акции и скидки')}</Link></li>
              <li><Link href="/zamir" className="hover:text-white">{t('Інструкція з заміру', 'Инструкция по замеру')}</Link></li>
              <li><Link href="/montaj" className="hover:text-white">{t('Інструкція з монтажу', 'Инструкция по монтажу')}</Link></li>
              <li><Link href="/sposobi_oplati" className="hover:text-white">{t('Оплата та розстрочка', 'Оплата и рассрочка')}</Link></li>
              <li><Link href="/dostavka" className="hover:text-white">{t('Доставка Новою Поштою', 'Доставка Новой Почтой')}</Link></li>
              <li><Link href="/pro_nas" className="hover:text-white">{t('Про компанію', 'О компании')}</Link></li>
              <li><Link href="/zvyazok" className="hover:text-white">{t('Контакти', 'Контакты')}</Link></li>
              <li><Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold">{t('Адмін-панель', 'Админ-панель')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-2">
            <span>© 2014–2026 {t('Жалюзі та Ролети від виробника • м. Дніпро.', 'Жалюзи и Роллеты от производителя • г. Днепр.')}</span>
            <span className="text-[10px] font-mono text-gray-600 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">v{APP_VERSION}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% {t('Гарантія якості', 'Гарантия качества')}
            </span>
            <span>Приват24 • Monobank • Visa • MasterCard • NovaPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
