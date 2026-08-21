import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, Flame } from 'lucide-react';
import { getProducts } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Акції та знижки на ролети та жалюзі | Жалюзі та Ролети від виробника (Дніпро)',
  description:
    'Актуальні акції, знижки до -25% та спеціальні ціни від виробника сонцезахисних систем у м. Дніпро. Знижки на об\'єм та ролети Блекаут.',
  keywords: [
    'акції жалюзі дніпро',
    'знижки на ролети',
    'рулонні штори розпродаж',
    'купити жалюзі дешево дніпро',
  ],
  openGraph: {
    title: 'Акції та знижки на ролети та жалюзі від виробника',
    description:
      'Сезонні знижки до -25% на популярні рулонні штори та ролети день-ніч у м. Дніпро.',
    url: `${SITE_URL}/aktsii`,
  },
  alternates: {
    canonical: `${SITE_URL}/aktsii`,
  },
};

export default async function AktsiiPage() {
  const saleProducts = await getProducts({ isPopular: true, limit: 6 });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Акції', url: '/aktsii' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="space-y-10 py-4">
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold">
            <Flame className="w-4 h-4 fill-white" />
            <span>Гарячі пропозиції місяця</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Акції та спеціальні ціни від виробника
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            Оновлюйте інтер'єр вашого дому чи офісу за вигідними цінами! Знижки до -25% на популярні рулонні штори, ролети день-ніч та блекаут.
          </p>
        </div>

        {/* Promo cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                Знижка на об'єм
              </span>
              <h3 className="text-xl font-bold">При замовленні від 4-х виробів</h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                Отримайте додаткову знижку -7% на все замовлення або безкоштовну доставку у відділення Нової Пошти!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-300">Діє до кінця місяця</span>
              <Link
                href="/catalog"
                className="px-4 py-2 bg-white text-blue-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition"
              >
                Обрати вироби
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                Спецпропозиція
              </span>
              <h3 className="text-xl font-bold">Ролети Блекаут для спальні</h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                100% захист від ранкового сонця та спеки за спеціальною ціною від 549 грн/виріб.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-300">Гарантія 12 місяців</span>
              <Link
                href="/shtori"
                className="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition"
              >
                Дивитися моделі
              </Link>
            </div>
          </div>
        </div>

        {/* Sale Products Grid */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Товари за акційними цінами
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
