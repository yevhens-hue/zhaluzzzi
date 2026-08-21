'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Send, ShieldCheck, User } from 'lucide-react';
import { Logo } from './Logo';
import { InstagramIcon } from './InstagramIcon';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export function Footer() {
  const { settings } = useSiteSettings();
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
              Виробництво та монтаж жалюзі і тканинних ролет під замовлення у м. Дніпро та з доставкою по всій Україні. Індивідуальні розміри, європейські тканини та надійні механізми.
            </p>

            <div className="space-y-2.5 text-gray-300 pt-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-bold text-white">Контактна особа: {contacts.masterName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{contacts.city} (Доставка та відправка по всій Україні)</span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
              <a
                href={contacts.telegramUrl || 'https://t.me/+380939128531'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2CA5E0] hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <Send className="w-3 h-3" />
                <span>Telegram</span>
              </a>
              <a
                href={`viber://chat?number=${encodeURIComponent(contacts.viberNumber || '+380939128531')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7F4DA0] hover:opacity-90 text-white rounded-lg font-bold text-[11px]"
              >
                <span>Viber</span>
              </a>
            </div>
          </div>

          {/* Catalog: Ролети & Штори */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Ролети & Штори
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/roleti?sub=tkanunni_roleti" className="hover:text-white">Тканинні ролети</Link></li>
              <li><Link href="/roleti?sub=den-nich" className="hover:text-white">Ролети День-Ніч</Link></li>
              <li><Link href="/roleti?sub=blekaut_roleti" className="hover:text-white">Ролети Блекаут</Link></li>
              <li><Link href="/roleti?sub=dzhutovi_roleti" className="hover:text-white">Джутові ролети</Link></li>
              <li><Link href="/roleti?sub=bambukovi" className="hover:text-white">Бамбукові ролети</Link></li>
              <li><Link href="/shtori?sub=rimski" className="hover:text-white">Римські штори</Link></li>
              <li><Link href="/shtori?sub=plise" className="hover:text-white">Штори Плісе Duo</Link></li>
            </ul>
          </div>

          {/* Catalog: Жалюзі & Закрита система */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Жалюзі & Системи
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi" className="hover:text-white">Горизонтальні жалюзі</Link></li>
              <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi" className="hover:text-white">Вертикальні жалюзі</Link></li>
              <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi" className="hover:text-white">Алюмінієві жалюзі</Link></li>
              <li><Link href="/zhaluzi?sub=bambukovi_zhalyuzi" className="hover:text-white">Бамбукові жалюзі</Link></li>
              <li><Link href="/zhaluzi?sub=derevyani" className="hover:text-white">Дерев'яні жалюзі</Link></li>
              <li><Link href="/zakryta-sistema" className="hover:text-white">Закрита система з коробом</Link></li>
            </ul>
          </div>

          {/* Customer Info */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Покупцям
            </h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/aktsii" className="hover:text-white">Акції та знижки</Link></li>
              <li><Link href="/zamir" className="hover:text-white">Інструкція з заміру</Link></li>
              <li><Link href="/montaj" className="hover:text-white">Інструкція з монтажу</Link></li>
              <li><Link href="/sposobi_oplati" className="hover:text-white">Оплата та розстрочка</Link></li>
              <li><Link href="/dostavka" className="hover:text-white">Доставка Новою Поштою</Link></li>
              <li><Link href="/pro_nas" className="hover:text-white">Про компанію</Link></li>
              <li><Link href="/zvyazok" className="hover:text-white">Контакти</Link></li>
              <li><Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold">Адмін-панель</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div>
            © 2014–2026 Жалюзі та Ролети від виробника • м. Дніпро. Всі права захищено.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Гарантія якості
            </span>
            <span>Приват24 • Monobank • Visa • MasterCard • NovaPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
