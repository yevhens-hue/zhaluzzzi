import React from 'react';
import type { Metadata } from 'next';
import { Truck, PackageCheck, Clock, MapPin } from 'lucide-react';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Доставка по Україні (Нова Пошта) | Жалюзі та Ролети від виробника',
  description:
    'Швидка доставка сонцезахисних систем службою Нова Пошта (відділення, поштомати, кур\'єр) по всій Україні. Надійне тубусне пакування виробів.',
  keywords: [
    'доставка жалюзі україна',
    'доставка ролет нова пошта',
    'рулонні штори доставка дніпро',
  ],
  openGraph: {
    title: 'Доставка замовлень по Україні — Нова Пошта',
    description:
      'Надійно пакуємо кожен виріб у міцні тубуси та коробки. Термін виготовлення 2-4 дні.',
    url: `${SITE_URL}/dostavka`,
  },
  alternates: {
    canonical: `${SITE_URL}/dostavka`,
  },
};

export default function DeliveryPage() {
  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Доставка', url: '/dostavka' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black">Доставка замовлень по Україні</h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            Ми надійно пакуємо кожен виріб у міцні тубуси та коробки з ребрами жорсткості, щоб ваше замовлення доїхало в ідеальному стані.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <Truck className="w-8 h-8 text-blue-600" />
            <h2 className="font-bold text-base text-gray-900">Нова Пошта (Відділення)</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Доставка у будь-яке вантажне або стандартне відділення Нової Пошти (залежно від довжини карниза понад 120 см).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <PackageCheck className="w-8 h-8 text-emerald-600" />
            <h2 className="font-bold text-base text-gray-900">Поштомати</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Для компактних ролет та жалюзі завширшки до 58 см можлива зручна доставка у найближчий поштомат поруч із вашим будинком.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
            <MapPin className="w-8 h-8 text-amber-600" />
            <h2 className="font-bold text-base text-gray-900">Кур'єрська доставка</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Адресна доставка кур'єром Нової Пошти прямо до дверей квартири чи офісу у зручний для вас час.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-3xl p-6 sm:p-8 border border-blue-100 space-y-3 text-xs sm:text-sm text-blue-950">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Терміни виготовлення та відправки</span>
          </h3>
          <p className="leading-relaxed">
            Термін виробництва становить <strong>від 2 до 4 робочих днів</strong>. Після відправки ви отримаєте SMS-повідомлення та сповіщення у додатку з номером ТТН для відстеження посилки.
          </p>
        </div>
      </div>
    </>
  );
}
