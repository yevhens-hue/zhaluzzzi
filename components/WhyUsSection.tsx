import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  Sliders,
  SunMedium,
  CheckCircle2,
  PhoneCall,
  Ruler,
  Factory,
  Truck,
} from 'lucide-react';

export function WhyUsSection() {
  return (
    <section className="space-y-12">
      {/* 1. Benefits grid */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Переваги нашої продукції
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Практичні, довговічні та стильні конструкції, що підходять для будь-якого інтер'єру.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Зручність у користуванні</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Штори можна фіксувати на будь-якій бажаній висоті: наприклад, закрити сонце, але залишити комфортне світло для квітів на підвіконні.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Простота догляду</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Спеціальне антистатичне та пиловідштовхувальне просочення запобігає забрудненню. Достатньо лише сухого чищення пилососом або вологою серветкою.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <SunMedium className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Захист від вигоряння</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ефективно захищають ваші меблі, шпалери та підлогове покриття від руйнівного впливу ультрафіолетових променів.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Європейська фурнітура</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Використовуємо надійні механізми Besta (Польща), які гарантують плавний та безшумний хід полотна протягом багатьох років.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Гарантія якості</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Офіційна гарантія на всі механізми та полотна 12 місяців. Ми впевнені у кожній деталі нашого виробництва.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-2">Ціна від виробника</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ви купуєте напряму без посередницьких націнок та переплат, отримуючи преміальну якість за чесною ціною.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Banner "Чому обирають нас" */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-amber-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Надійність, перевірена часом</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            Чому обирають сонцезахисні системи нашого виробництва?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Замовляючи ролети, жалюзі чи штори у нас, ви отримуєте вироби ідеальної якості без переплат, з гарантією та індивідуальним підходом.
          </p>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">10+</div>
              <div className="text-[11px] text-gray-300 font-medium">років досвіду</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">50K+</div>
              <div className="text-[11px] text-gray-300 font-medium">задоволених вікон</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">2-4</div>
              <div className="text-[11px] text-gray-300 font-medium">дні виготовлення</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Steps process (1-2-3-4) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Як замовити ролети за 4 простих кроки
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Зручний процес від першої консультації до готового виробу на вашому вікні.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="font-bold text-sm text-gray-900">Замір або консультація</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Залиште заявку або самостійно заміряйте вікна за нашою простою інструкцією.
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="font-bold text-sm text-gray-900">Вибір тканини та системи</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Оберіть тип системи, категорію тканини, ступінь затемнення та сторону управління.
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="font-bold text-sm text-gray-900">Швидке виготовлення</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Виготовляємо виріб на лазерному розкрійному обладнанні за 2-4 робочих дні.
            </p>
          </div>

          <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <h4 className="font-bold text-sm text-gray-900">Доставка та монтаж</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Отримайте готовий виріб на Новій Пошті або замовте професійний монтаж у Дніпрі.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
