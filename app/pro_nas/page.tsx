import React from 'react';
import type { Metadata } from 'next';
import { Factory, Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Про наше виробництво — Жалюзі та Ролети у м. Дніпро',
  description:
    'Власне виробництво сонцезахисних систем у Дніпрі: понад 10 років досвіду, 50 000+ виготовлених виробів, прямі поставки тканин із Польщі та Німеччини.',
  keywords: [
    'виробництво жалюзі дніпро',
    'виробник ролет україна',
    'фабрика жалюзі дніпро',
    'віктор кузьменко виробник',
  ],
  openGraph: {
    title: 'Про наше виробництво — Жалюзі та Ролети (Дніпро)',
    description:
      'Український виробник повного циклу сонцезахисних систем для вікон у м. Дніпро.',
    url: `${SITE_URL}/pro_nas`,
  },
  alternates: {
    canonical: `${SITE_URL}/pro_nas`,
  },
};

export default function ProNasPage() {
  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Про нас', url: '/pro_nas' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Понад 10 років досвіду на ринку</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">Про наше виробництво</h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            Ми — український виробник повного циклу сонцезахисних систем для вікон у м. Дніпро. Створюємо затишок, естетику та комфорт у ваших оселях.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <div className="text-3xl font-black text-blue-600">10+ років</div>
            <div className="font-bold text-sm text-gray-900">Досвіду у виробництві</div>
            <p className="text-xs text-gray-500">Бездоганна репутація та десятки тисяч задоволених клієнтів по всій Україні.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <div className="text-3xl font-black text-amber-500">50,000+</div>
            <div className="font-bold text-sm text-gray-900">Виготовлених виробів</div>
            <p className="text-xs text-gray-500">Рулонні штори, ролети день-ніч, алюмінієві та дерев’яні жалюзі.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-2">
            <div className="text-3xl font-black text-emerald-600">500+</div>
            <div className="font-bold text-sm text-gray-900">Тканин та фактур</div>
            <p className="text-xs text-gray-500">Прямий імпорт сертифікованих полотен із Німеччини, Польщі та Туреччини.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="text-xl font-bold text-gray-900">Наші ключові принципи</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ніяких компромісів щодо якості:</strong> ми використовуємо лише надійну польську фурнітуру Besta та тканини з безпечними екологічними просоченнями, які не вигоряють на сонці та не виділяють запахів.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Factory className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Автоматизований розкрій:</strong> високоточні лазерні та ультразвукові столи забезпечують ідеальний різ тканини без бахроми та деформацій.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Чесні ціни від виробника:</strong> ви купуєте безпосередньо у виробника, не сплачуючи торговельні націнки салонів та посередників.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
