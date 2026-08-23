'use client';

import React from 'react';
import { Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function MontajPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-amber-300 text-xs font-bold">
          <Wrench className="w-4 h-4" />
          <span>{t('Легкий монтаж за 10-15 хвилин', 'Легкий монтаж за 10-15 минут')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('Інструкція зі встановлення ролет та жалюзі', 'Инструкция по установке роллет и жалюзи')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          {t(
            'Усі вироби нашого виробництва постачаються повністю зібраними та готовими до встановлення. Вам знадобиться лише викрутка або шуруповерт.',
            'Все изделия нашего производства поставляются полностью собранными и готовыми к установке. Вам понадобится только отвертка или шуруповерт.'
          )}
        </p>
      </div>

      {/* Step by Step */}
      <div className="grid gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
            <span>{t('Розпаковка та перевірка комплектації', 'Распаковка и проверка комплектации')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'Акуратно відкрийте пакування. У комплекті ви знайдете: полотно на валу з механізмом Besta, пару кронштейнів, саморізи, напрямну волосінь (ліску), фіксатори нижньої планки та обмежувачі ланцюжка.',
              'Аккуратно откройте упаковку. В комплекте вы найдете: полотно на валу с механизмом Besta, пару кронштейнов, саморезы, направляющую леску, фиксаторы нижней планки и ограничители цепи.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
            <span>{t('Закріплення верхніх кронштейнів', 'Закрепление верхних кронштейнов')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'Прикладіть ролету до верхньої частини віконної стулки, вирівняйте за рівнем і закріпіть бічні кронштейни за допомогою комплектних саморізів (або на спеціальний двосторонній скотч/кліпси для стулок, що відкриваються).',
              'Приложите роллету к верхней части оконной створки, выровняйте по уровню и закрепите боковые кронштейны с помощью комплектных саморезов (или на специальный двухсторонний скотч/клипсы для открывающихся створок).'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
            <span>{t('Фіксація напрямної ліски', 'Фиксация направляющей лески')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'Протягніть волосінь через бічні отвори в нижній обтяжувальній планці та зафіксуйте нижні куточки на нижньому профілі стулки з помірним натягом. Це запобігає відвисанню тканини при режимі провітрювання.',
              'Протяните леску через боковые отверстия в нижней утяжелительной планке и зафиксируйте нижние уголки на нижнем профиле створки с умеренным натяжением. Это предотвращает обвисание ткани при режиме проветривания.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
            <span>{t('Регулювання ходу та готовність', 'Регулировка хода и готовность')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {t(
              'Перевірте легкість обертання ланцюжка. Встановіть обмежувач верхнього та нижнього положення полотна. Ваша система готова до тривалої експлуатації!',
              'Проверьте легкость вращения цепи. Установите ограничитель верхнего и нижнего положения полотна. Ваша система готова к длительной эксплуатации!'
            )}
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition"
        >
          <span>{t('Перейти до каталогу виробів', 'Перейти к каталогу изделий')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
