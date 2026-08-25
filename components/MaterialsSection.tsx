'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function MaterialsSection() {
  const { t } = useLanguage();

  const materials = [
    {
      title: t('Бавовна та льон', 'Хлопок и лен'),
      desc: t('Натуральні тканини, що створюють затишок та природну свіжість у вашому домі.', 'Натуральные ткани, создающие уют и естественную свежесть в вашем доме.'),
      badge: t('Екологічно', 'Экологично'),
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
      link: '/catalog?search=Льон',
    },
    {
      title: t('100% Поліестер', '100% Полиэстер'),
      desc: t('Універсальний, стійкий до вигоряння матеріал з антистатичним та пиловідштовхуючим просоченням.', 'Универсальный, устойчивый к выгоранию материал с антистатической и пылеотталкивающей пропиткой.'),
      badge: t('Популярне', 'Популярное'),
      iconBg: 'bg-blue-100 text-blue-800 border-blue-200',
      link: '/catalog?category=roleti',
    },
    {
      title: t('Поліестер + Сатин', 'Полиэстер + Сатин'),
      desc: t('Поєднання міцності синтетики з благородним шовковистим блиском сатинової нитки.', 'Сочетание прочности синтетики с благородным шелковистым блеском сатиновой нити.'),
      badge: t('Преміум', 'Премиум'),
      iconBg: 'bg-purple-100 text-purple-800 border-purple-200',
      link: '/catalog?search=Сатин',
    },
    {
      title: t('ПВХ та скловолокно (Blackout)', 'ПВХ и стекловолокно (Blackout)'),
      desc: t('Надміцне тришарове полотно, що забезпечує 100% світлонепроникність та термозахист.', 'Сверхпрочное трехслойное полотно, обеспечивающее 100% светонепроницаемость и термозащиту.'),
      badge: t('100% Блекаут', '100% Блэкаут'),
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      link: '/catalog?search=Блекаут',
    },
  ];

  return (
    <div className="bg-gray-50/80 rounded-3xl p-6 sm:p-10 border border-gray-200/80 my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold mb-3 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('Європейські сертифіковані тканини', 'Европейские сертифицированные ткани')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-gray-900">
          {t('Вибір матеріалу та його особливості', 'Выбор материала и его особенности')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          {t('Саме від обраного полотна залежить довговічність, затемнення та стійкість до зовнішніх впливів.', 'Именно от выбранного полотна зависит долговечность, затемнение и устойчивость к внешним воздействиям.')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {materials.map((mat, idx) => (
          <Link
            key={idx}
            href={mat.link}
            className="group bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-3 border ${mat.iconBg}`}>
                {mat.badge}
              </span>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition mb-1.5 flex items-center justify-between">
                <span>{mat.title}</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{mat.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5 transition">
              <span>{t('Зразки в каталозі', 'Образцы в каталоге')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
