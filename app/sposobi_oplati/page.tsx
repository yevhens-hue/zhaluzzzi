import React from 'react';
import type { Metadata } from 'next';
import { CreditCard, Banknote } from 'lucide-react';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Способи оплати та розстрочка | Жалюзі та Ролети від виробника',
  description:
    'Зручні варіанти оплати: онлайн карткою, післяплата при отриманні на Новій Пошті, безвідсоткова оплата частинами ПриватБанк та Monobank.',
  keywords: [
    'оплата жалюзі',
    'купити ролети в розстрочку',
    'оплата частинами ролети приватбанк',
    'монобанк покупка частинами жалюзі',
  ],
  openGraph: {
    title: 'Способи оплати та розстрочка — Жалюзі та Ролети Дніпро',
    description:
      'Оплата карткою, післяплата при отриманні або оплата частинами від ПриватБанку та Monobank.',
    url: `${SITE_URL}/sposobi_oplati`,
  },
  alternates: {
    canonical: `${SITE_URL}/sposobi_oplati`,
  },
};

export default function PaymentPage() {
  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Оплата', url: '/sposobi_oplati' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black">Способи оплати та розстрочка</h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            Ми пропонуємо максимально зручні та безпечні способи розрахунку без прихованих комісій.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Banknote className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Післяплата (при отриманні)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ви оплачуєте замовлення безпосередньо у відділенні або кур'єру Нової Пошти після повної перевірки комплектації, розмірів та якості виробу.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Оплата онлайн (Visa / MasterCard / IBAN)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Миттєва та безпечна оплата карткою будь-якого українського банку або за офіційними реквізитами ФОП з наданням фіскального чека.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#6B9F29] flex items-center justify-center font-black text-sm">
              ПП
            </div>
            <h2 className="font-bold text-lg text-gray-900">Оплата частинами ПриватБанк</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Розбивайте суму замовлення на термін від 2 до 24 місяців без переплат та зайвих документів безпосередньо через додаток Приват24.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E74C3C] flex items-center justify-center font-black text-sm">
              МБ
            </div>
            <h2 className="font-bold text-lg text-gray-900">Покупка частинами Monobank</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Безвідсоткова розстрочка до 3 платежів без комісій. Оформлюється в один клік у додатку Monobank.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
