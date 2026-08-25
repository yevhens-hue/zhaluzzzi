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
    <section className="space-y-12 my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-gray-900">
          {t('Чому обирають сонцезахисні системи нашого виробництва?', 'Почему выбирают солнцезащитные системы нашего производства?')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          {t('Замовляючи ролети, жалюзі чи штори у нас, ви отримуєте вироби ідеальної якості без переплат, з гарантією та індивідуальним підходом.', 'Заказывая роллеты, жалюзи или шторы у нас, вы получаете изделия идеального качества без переплат, с гарантией и индивидуальным подходом.')}
        </p>
      </div>

      {/* Unified Grid with Stats Banner integrated */}
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

      {/* Stats Summary Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg text-white">{t('Надійність, перевірена часом', 'Надежность, проверенная временем')}</h4>
            <p className="text-xs text-gray-300">{t('Виготовлення міліметр у міліметр за вашими розмірами.', 'Изготовление миллиметр в миллиметр по вашим размерам.')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 md:border-l border-white/15 md:pl-8 pt-4 md:pt-0 w-full md:w-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">10+</div>
            <div className="text-[11px] text-gray-300 font-medium">{t('років досвіду', 'лет опыта')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">50K+</div>
            <div className="text-[11px] text-gray-300 font-medium">{t('вікон', 'окон')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">2-4</div>
            <div className="text-[11px] text-gray-300 font-medium">{t('дні', 'дня')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
