'use client';

import React from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('Способи оплати та розстрочка', 'Способы оплаты и рассрочка')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          {t('Ми пропонуємо максимально зручні та безпечні способи розрахунку без прихованих комісій.', 'Мы предлагаем максимально удобные и безопасные способы расчета без скрытых комиссий.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg text-gray-900">
            {t('Післяплата (при отриманні)', 'Наложенный платеж (при получении)')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Ви оплачуєте замовлення безпосередньо у відділенні або кур\'єру Нової Пошти після повної перевірки комплектації, розмірів та якості виробу.',
              'Вы оплачиваете заказ непосредственно в отделении или курьеру Новой Почты после полной проверки комплектации, размеров и качества изделия.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg text-gray-900">
            {t('Оплата онлайн (Visa / MasterCard / IBAN)', 'Оплата онлайн (Visa / MasterCard / IBAN)')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Миттєва та безпечна оплата карткою будь-якого українського банку або за офіційними реквізитами ФОП з наданням фіскального чека.',
              'Мгновенная и безопасная оплата картой любого украинского банка или по официальным реквизитам ФОП с предоставлением фискального чека.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#6B9F29] flex items-center justify-center font-black text-sm">
            ПП
          </div>
          <h2 className="font-bold text-lg text-gray-900">
            {t('Оплата частинами ПриватБанк', 'Оплата частями ПриватБанк')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Розбивайте суму замовлення на термін від 2 до 24 місяців без переплат та зайвих документів безпосередньо через додаток Приват24.',
              'Разбивайте сумму заказа на срок от 2 до 24 месяцев без переплат и лишних документов непосредственно через приложение Приват24.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E74C3C] flex items-center justify-center font-black text-sm">
            МБ
          </div>
          <h2 className="font-bold text-lg text-gray-900">
            {t('Покупка частинами Monobank', 'Покупка частями Monobank')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Безвідсоткова розстрочка до 3 платежів без комісій. Оформлюється в один клік у додатку Monobank.',
              'Беспроцентная рассрочка до 3 платежей без комиссий. Оформляется в один клик в приложении Monobank.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
