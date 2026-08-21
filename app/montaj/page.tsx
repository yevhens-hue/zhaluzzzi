import React from 'react';
import type { Metadata } from 'next';
import { Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Інструкція з монтажу ролет та жалюзі своїми руками | Виробник м. Дніпро',
  description:
    'Простий та легкий монтаж сонцезахисних систем за 10-15 хвилин своїми руками. Покрокові рекомендації щодо кріплення відкритої та закритої системи.',
  keywords: [
    'монтаж ролет інструкція',
    'як встановити тканинні ролети',
    'монтаж жалюзі своїми руками',
    'встановлення рулонних штор',
  ],
  openGraph: {
    title: 'Інструкція зі встановлення ролет та жалюзі',
    description:
      'Усі вироби постачаються зібраними та готовими до монтажу. Покрокова інструкція.',
    url: `${SITE_URL}/montaj`,
  },
  alternates: {
    canonical: `${SITE_URL}/montaj`,
  },
};

export default function MontajPage() {
  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Монтаж', url: '/montaj' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
            <Wrench className="w-4 h-4" />
            <span>Легкий монтаж за 10-15 хвилин</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Інструкція зі встановлення ролет та жалюзі
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            Усі вироби нашого виробництва постачаються повністю зібраними та готовими до встановлення. Вам знадобиться лише викрутка або шуруповерт.
          </p>
        </div>

        {/* Step by Step */}
        <div className="grid gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <span>Розпаковка та перевірка комплектації</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Акуратно відкрийте пакування. У комплекті ви знайдете: полотно на валу з механізмом Besta, пару кронштейнів, саморізи, напрямну волосінь (ліску), фіксатори нижньої планки та обмежувачі ланцюжка.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <span>Закріплення верхніх кронштейнів</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Прикладіть ролету до верхньої частини віконної стулки, вирівняйте за рівнем і закріпіть бічні кронштейни за допомогою комплектних саморізів (або на спеціальний двосторонній скотч/кліпси для стулок, що відкриваються).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <span>Фіксація напрямної ліски</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Протягніть волосінь через бічні отвори в нижній обтяжувальній планці та зафіксуйте нижні куточки на нижньому профілі стулки з помірним натягом. Це запобігає відвисанню тканини при режимі провітрювання.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <span>Регулювання ходу та готовність</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Перевірте легкість обертання ланцюжка. Встановіть обмежувач верхнього та нижнього положення полотна. Ваша система готова до тривалої експлуатації!
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition"
          >
            <span>Перейти до каталогу виробів</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
