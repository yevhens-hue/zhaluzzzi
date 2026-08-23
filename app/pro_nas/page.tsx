'use client';

import React from 'react';
import { Factory, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProNasPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
          <Award className="w-4 h-4" />
          <span>{t('Понад 10 років досвіду на ринку', 'Более 10 лет опыта на рынке')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">{t('Про наше виробництво', 'О нашем производстве')}</h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          {t(
            'Ми — український виробник повного циклу сонцезахисних систем для вікон у м. Дніпро. Створюємо затишок, естетику та комфорт у ваших оселях.',
            'Мы — украинский производитель полного цикла солнцезащитных систем для окон в г. Днепр. Создаем уют, эстетику и комфорт в ваших домах.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="text-3xl font-black text-blue-600">{t('10+ років', '10+ лет')}</div>
          <div className="font-bold text-sm text-gray-900">{t('Досвіду у виробництві', 'Опыта в производстве')}</div>
          <p className="text-xs text-gray-500">{t('Бездоганна репутація та десятки тисяч задоволених клієнтів по всій Україні.', 'Безупречная репутация и десятки тысяч довольных клиентов по всей Украине.')}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="text-3xl font-black text-amber-500">50,000+</div>
          <div className="font-bold text-sm text-gray-900">{t('Виготовлених виробів', 'Изготовленных изделий')}</div>
          <p className="text-xs text-gray-500">{t('Рулонні штори, ролети день-ніч, алюмінієві та дерев’яні жалюзі.', 'Рулонные шторы, роллеты день-ночь, алюминиевые и деревянные жалюзи.')}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
          <div className="text-3xl font-black text-emerald-600">500+</div>
          <div className="font-bold text-sm text-gray-900">{t('Тканин та фактур', 'Тканей и фактур')}</div>
          <p className="text-xs text-gray-500">{t('Прямий імпорт сертифікованих полотен із Німеччини, Польщі та Туреччини.', 'Прямой импорт сертифицированных полотен из Германии, Польши и Турции.')}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">{t('Наші ключові принципи', 'Наши ключевые принципы')}</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>{t('Ніяких компромісів щодо якості:', 'Никаких компромиссов по качеству:')}</strong> {t('ми використовуємо лише надійну польську фурнітуру Besta та тканини з безпечними екологічними просоченнями, які не вигоряють на сонці та не виділяють запахів.', 'мы используем только надежную польскую фурнитуру Besta и ткани с безопасными экологическими пропитками, которые не выгорают на солнце и не выделяют запахов.')}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Factory className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>{t('Автоматизований розкрій:', 'Автоматизированный раскрой:')}</strong> {t('високоточні лазерні та ультразвукові столи забезпечують ідеальний різ тканини без бахроми та деформацій.', 'высокоточные лазерные и ультразвуковые столы обеспечивают идеальный рез ткани без бахромы и деформаций.')}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>{t('Чесні ціни від виробника:', 'Честные цены от производителя:')}</strong> {t('ви купуєте безпосередньо у виробника, не сплачуючи торговельні націнки салонів та посередників.', 'вы покупаете напрямую у производителя, не оплачивая торговые наценки салонов и посредников.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
