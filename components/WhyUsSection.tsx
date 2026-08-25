'use client';

import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Sliders,
  SunMedium,
  CheckCircle2,
  Factory,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function WhyUsSection() {
  const { t } = useLanguage();

  return (
    <section className="space-y-12">
      {/* 1. Benefits grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-gray-900">
            {t('Переваги нашої продукції', 'Преимущества нашей продукции')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {t("Практичні, довговічні та стильні конструкції, що підходять для будь-якого інтер'єру.", 'Практичные, долговечные и стильные конструкции, подходящие для любого интерьера.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Зручність у користуванні', 'Удобство в использовании')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Штори можна фіксувати на будь-якій бажаній висоті: наприклад, закрити сонце, але залишити комфортне світло для квітів на підвіконні.', 'Шторы можно фиксировать на любой желаемой высоте: например, закрыть солнце, но оставить комфортный свет для цветов на подоконнике.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Простота догляду', 'Простота ухода')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Спеціальне антистатичне та пиловідштовхувальне просочення запобігає забрудненню. Достатньо лише сухого чищення пилососом або вологою серветкою.', 'Специальная антистатическая и пылеотталкивающая пропитка предотвращает загрязнение. Достаточно лишь сухой чистки пылесосом или влажной салфеткой.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <SunMedium className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Захист від вигоряння', 'Защита от выгорания')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Ефективно захищають ваші меблі, шпалери та підлогове покриття від руйнівного впливу ультрафіолетових променів.', 'Эффективно защищают вашу мебель, обои и напольное покрытие от разрушительного воздействия ультрафиолетовых лучей.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Європейська фурнітура', 'Европейская фурнитура')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Використовуємо надійні механізми Besta (Польща), які гарантують плавний та безшумний хід полотна протягом багатьох років.', 'Используем надежные механизмы Besta (Польша), гарантирующие плавный и бесшумный ход полотна на протяжении многих лет.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Гарантія якості', 'Гарантия качества')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Офіційна гарантія на всі механізми та полотна 12 місяців. Ми впевнені у кожній деталі нашого виробництва.', 'Официальная гарантия на все механизмы и полотна 12 месяцев. Мы уверены в каждой детали нашего производства.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/60 luxury-card-shadow transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">{t('Ціна від виробника', 'Цена от производителя')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t('Ви купуєте напряму без посередницьких націнок та переплат, отримуючи преміальну якість за чесною ціною.', 'Вы покупаете напрямую без посреднических наценок и переплат, получая премиальное качество по честной цене.')}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Banner "Чому обирають нас" */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-amber-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('Надійність, перевірена часом', 'Надежность, проверенная временем')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            {t('Чому обирають сонцезахисні системи нашого виробництва?', 'Почему выбирают солнцезащитные системы нашего производства?')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {t('Замовляючи ролети, жалюзі чи штори у нас, ви отримуєте вироби ідеальної якості без переплат, з гарантією та індивідуальним підходом.', 'Заказывая роллеты, жалюзи или шторы у нас, вы получаете изделия идеального качества без переплат, с гарантией и индивидуальным подходом.')}
          </p>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">10+</div>
              <div className="text-[11px] text-gray-300 font-medium">{t('років досвіду', 'лет опыта')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">50K+</div>
              <div className="text-[11px] text-gray-300 font-medium">{t('задоволених вікон', 'довольных окон')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">2-4</div>
              <div className="text-[11px] text-gray-300 font-medium">{t('дні виготовлення', 'дня изготовления')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Steps process (1-2-3-4) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t('Як замовити ролети за 4 простих кроки', 'Как заказать роллеты за 4 простых шага')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {t('Зручний процес від першої консультації до готового виробу на вашому вікні.', 'Удобный процесс от первой консультации до готового изделия на вашем окне.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="font-bold text-sm text-gray-900">{t('Замір або консультація', 'Замер или консультация')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('Залиште заявку або самостійно заміряйте вікна за нашою простою інструкцією.', 'Оставьте заявку или самостоятельно замерьте окна по нашей простой инструкции.')}
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="font-bold text-sm text-gray-900">{t('Вибір тканини та системи', 'Выбор ткани и системы')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('Оберіть тип системи, категорію тканини, ступінь затемнення та сторону управління.', 'Выберите тип системы, категорию ткани, степень затемнения и сторону управления.')}
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="font-bold text-sm text-gray-900">{t('Швидке виготовлення', 'Быстрое изготовление')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('Виготовляємо виріб на лазерному розкрійному обладнанні за 2-4 робочих дні.', 'Изготавливаем изделие на лазерном раскройном оборудовании за 2-4 рабочих дня.')}
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <h4 className="font-bold text-sm text-gray-900">{t('Доставка та монтаж', 'Доставка и монтаж')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              {t('Отримайте готовий виріб на Новій Пошті або замовте професійний монтаж у Дніпрі.', 'Получите готовое изделие на Новой Почте или закажите профессиональный монтаж в Днепре.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
