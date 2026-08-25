'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { Flame } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';

export function AktsiiClient({ saleProducts }: { saleProducts: Product[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-10 py-4">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold">
          <Flame className="w-4 h-4 fill-white" />
          <span>{t('Гарячі пропозиції місяця', 'Горячие предложения месяца')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('Акції та спеціальні ціни від виробника', 'Акции и специальные цены от производителя')}
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
          {t(
            'Оновлюйте інтер\'єр вашого дому чи офісу за вигідними цінами! Знижки до -25% на популярні рулонні штори, ролети день-ніч та блекаут.',
            'Обновляйте интерьер вашего дома или офиса по выгодным ценам! Скидки до -25% на популярные рулонные шторы, роллеты день-ночь и блэкаут.'
          )}
        </p>
      </div>

      {/* Promo cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              {t('Знижка на об\'єм', 'Скидка на объем')}
            </span>
            <h3 className="text-xl font-bold">{t('При замовленні від 4-х виробів', 'При заказе от 4-х изделий')}</h3>
            <p className="text-xs text-gray-200 leading-relaxed">
              {t(
                'Отримайте додаткову знижку -7% на все замовлення або безкоштовну доставку у відділення Нової Пошти!',
                'Получите дополнительную скидку -7% на весь заказ или бесплатную доставку в отделение Новой Почты!'
              )}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-300">{t('Діє до кінця місяця', 'Действует до конца месяца')}</span>
            <Link
              href="/catalog"
              className="px-4 py-2 bg-white text-blue-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition"
            >
              {t('Обрати вироби', 'Выбрать изделия')}
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              {t('Спецпропозиція', 'Спецпредложение')}
            </span>
            <h3 className="text-xl font-bold">{t('Ролети Блекаут для спальні', 'Роллеты Блэкаут для спальни')}</h3>
            <p className="text-xs text-gray-200 leading-relaxed">
              {t(
                '100% захист від ранкового сонця та спеки за спеціальною ціною від 549 грн/виріб.',
                '100% защита от утреннего солнца и жары по специальной цене от 549 грн/изделие.'
              )}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-300">{t('Гарантія 12 місяців', 'Гарантия 12 месяцев')}</span>
            <Link
              href="/shtori"
              className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition"
            >
              {t('Дивитися моделі', 'Смотреть модели')}
            </Link>
          </div>
        </div>
      </div>

      {/* Sale Products Grid */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          {t('Товари за акційними цінами', 'Товары по акционным ценам')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
