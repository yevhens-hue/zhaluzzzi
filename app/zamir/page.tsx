'use client';

import React, { useState } from 'react';
import { Ruler, AlertCircle, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useLanguage } from '@/context/LanguageContext';
import { AiWindowMeasureModal } from '@/components/AiWindowMeasureModal';
import { useRouter } from 'next/navigation';

export default function ZamirPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleApplyDimensions = (widthCm: number, heightCm: number) => {
    router.push(`/#calculator?width=${widthCm}&height=${heightCm}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
          <Ruler className="w-4 h-4" />
          <span>{t('Інструкція від майстрів нашого виробництва', 'Инструкция от мастеров нашего производства')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('Як правильно заміряти вікна для ролет та жалюзі', 'Как правильно замерить окна для роллет и жалюзи')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          {t(
            'Точний замір — запорука ідеального вигляду та бездоганної роботи ваших сонцезахисних систем. Використовуйте AI-замір по фото або дотримуйтесь простих кроків нижче:',
            'Точный замер — залог идеального вида и безупречной работы ваших солнцезащитных систем. Используйте AI-замер по фото или следуйте простым шагам ниже:'
          )}
        </p>

        {/* AI Measure Launch Banner */}
        <div className="pt-2">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>📷 Запустити AI Авто-замір по фото (без рулетки)</span>
            <Sparkles className="w-4 h-4 text-amber-900 animate-pulse" />
          </button>
        </div>
      </div>

      <AiWindowMeasureModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyDimensions={handleApplyDimensions}
      />

      {/* 1. Відкрита система на стулку */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
          <span>{t('Замір відкритої системи (на кожну стулку вікна)', 'Замер открытой системы (на каждую створку окна)')}</span>
        </h2>
        <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>
            <strong>{t('Ширина:', 'Ширина:')}</strong> {t('виміряйте ширину скла разом зі штапиками (по лінії замка штапика). Зверніть увагу: загальний габарит виробу з кронштейнами буде ширшим за тканину на 3.5–4 см (по 1.8–2 см з кожного боку).', 'измерьте ширину стекла вместе со штапиками (по линии замка штапика). Обратите внимание: общий габарит изделия с кронштейнами будет шире ткани на 3.5–4 см (по 1.8–2 см с каждой стороны).')}
          </p>
          <p>
            <strong>{t('Висота:', 'Высота:')}</strong> {t('виміряйте повну висоту стулки (від верхнього краю пластикового профілю до нижнього).', 'измерьте полную высоту створки (от верхнего края пластикового профиля до нижнего).')}
          </p>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>{t('Важливо:', 'Важно:')}</strong> {t('переконайтеся, що кронштейни ролети не будуть впиратися в укіс при відкриванні вікна на провітрювання.', 'убедитесь, что кронштейны роллеты не будут упираться в откос при открывании окна на проветривание.')}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Закрита система з коробом */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
          <span>{t('Замір закритої системи з коробом (Uni)', 'Замер закрытой системы с коробом (Uni)')}</span>
        </h2>
        <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>
            <strong>{t('Для системи Uni-1 (плоскі направляючі):', 'Для системы Uni-1 (плоские направляющие):')}</strong> {t('замір здійснюється по внутрішньому краю штапика (чистий розмір світлового отвору скла). Глибина штапика повинна бути не менше 14 мм.', 'замер осуществляется по внутреннему краю штапика (чистый размер светового проема стекла). Глубина штапика должна быть не менее 14 мм.')}
          </p>
          <p>
            <strong>{t('Для системи Uni-2 (П-подібні направляючі):', 'Для системы Uni-2 (П-образные направляющие):')}</strong> {t('вимірюється розмір по зовнішніх ребрах штапиків. Підходить для вікон з будь-якою глибиною та формою штапика.', 'измеряется размер по внешним ребрам штапиков. Подходит для окон с любой глубиной и формой штапика.')}
          </p>
        </div>
      </div>

      {/* 3. Монтаж у проріз або на стіну */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
          <span>{t('Замір на весь проріз (на стіну або стелю)', 'Замер на весь проем (на стену или потолок)')}</span>
        </h2>
        <div className="text-xs sm:text-sm text-gray-700 space-y-3 leading-relaxed">
          <p>
            {t(
              'Виміряйте ширину прорізу у трьох точках (зверху, посередині, знизу). Додайте по 5–10 см з кожного боку (разом +10–20 см до ширини), щоб закрити бічні просвіти.',
              'Измерьте ширину проема в трех точках (сверху, посередине, снизу). Добавьте по 5–10 см с каждой стороны (итого +10–20 см к ширине), чтобы закрыть боковые просветы.'
            )}
          </p>
          <p>
            {t(
              'До висоти прорізу додайте 10–15 см для комфортного кріплення кронштейнів над вікном.',
              'К высоте проема добавьте 10–15 см для комфортного крепления кронштейнов над окном.'
            )}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-6">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition"
        >
          <span>{t('Перейти до вибору ролет у каталозі', 'Перейти к выбору роллет в каталоге')}</span>
        </Link>
      </div>
    </div>
  );
}
