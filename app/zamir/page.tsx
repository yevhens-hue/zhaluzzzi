import React from 'react';
import type { Metadata } from 'next';
import { Ruler, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Як правильно заміряти вікна для ролет та жалюзі | Інструкція від виробника',
  description:
    'Покрокова інструкція із заміру вікон для встановлення рулонних штор, ролет День-Ніч та жалюзі. Замір на стулку, в отвір та для закритої системи Uni.',
  keywords: [
    'як заміряти вікно для ролет',
    'замір рулонних штор',
    'замір жалюзі інструкція',
    'розміри ролет день ніч',
  ],
  openGraph: {
    title: 'Як правильно заміряти вікна для ролет та жалюзі — Інструкція',
    description:
      'Покроковий посібник із точного вимірювання вікон для встановлення сонцезахисних систем.',
    url: `${SITE_URL}/zamir`,
  },
  alternates: {
    canonical: `${SITE_URL}/zamir`,
  },
};

export default function ZamirPage() {
  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Замір вікон', url: '/zamir' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
            <Ruler className="w-4 h-4" />
            <span>Інструкція від майстрів нашого виробництва</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Як правильно заміряти вікна для ролет та жалюзі
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
            Точний замір — запорука ідеального вигляду та бездоганної роботи ваших сонцезахисних систем. Дотримуйтесь цих простих кроків:
          </p>
        </div>

        {/* 1. Відкрита система на стулку */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <span>Замір відкритої системи (на кожну стулку вікна)</span>
          </h2>
          <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              <strong>Ширина:</strong> виміряйте ширину скла разом зі штапиками (по лінії замка штапика). Зверніть увагу: загальний габарит виробу з кронштейнами буде ширшим за тканину на 3.5–4 см (по 1.8–2 см з кожного боку).
            </p>
            <p>
              <strong>Висота:</strong> виміряйте повну висоту стулки (від верхнього краю пластикового профілю до нижнього).
            </p>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Важливо:</strong> переконайтеся, що кронштейни ролети не будуть впиратися в укіс при відкриванні вікна на провітрювання.
              </div>
            </div>
          </div>
        </div>

        {/* 2. Закрита система з коробом */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
            <span>Замір закритої системи з коробом (Uni)</span>
          </h2>
          <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              <strong>Для системи Uni-1 (плоскі направляючі):</strong> замір здійснюється по внутрішньому краю штапика (чистий розмір світлового отвору скла). Глибина штапика повинна бути не менше 14 мм.
            </p>
            <p>
              <strong>Для системи Uni-2 (П-подібні направляючі):</strong> вимірюється розмір по зовнішніх ребрах штапиків. Підходить для вікон з будь-якою глибиною та формою штапика.
            </p>
          </div>
        </div>

        {/* 3. Монтаж у проріз або на стіну */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <span>Замір на весь проріз (на стіну або стелю)</span>
          </h2>
          <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              Виміряйте ширину прорізу у трьох точках (зверху, посередині, знизу). Додайте по 5–10 см з кожного боку (разом +10–20 см до ширини), щоб закрити бічні просвіти.
            </p>
            <p>
              До висоти прорізу додайте 10–15 см для комфортного кріплення кронштейнів над вікном.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition"
          >
            <span>Перейти до вибору ролет у каталозі</span>
          </Link>
        </div>
      </div>
    </>
  );
}
