'use client';

import React from 'react';
import { Truck, PackageCheck, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function DeliveryPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black">
          {t('Доставка замовлень по Україні', 'Доставка заказов по Украине')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl">
          {t(
            'Ми надійно пакуємо кожен виріб у міцні тубуси та коробки з ребрами жорсткості, щоб ваше замовлення доїхало в ідеальному стані.',
            'Мы надежно упаковываем каждое изделие в прочные тубусы и коробки с ребрами жесткости, чтобы ваш заказ доехал в идеальном состоянии.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <Truck className="w-8 h-8 text-blue-600" />
          <h2 className="font-bold text-base text-gray-900">
            {t('Нова Пошта (Відділення)', 'Новая Почта (Отделение)')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Доставка у будь-яке вантажне або стандартне відділення Нової Пошти (залежно від довжини карниза понад 120 см).',
              'Доставка в любое грузовое или стандартное отделение Новой Почты (в зависимости от длины карниза свыше 120 см).'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <PackageCheck className="w-8 h-8 text-emerald-600" />
          <h2 className="font-bold text-base text-gray-900">
            {t('Поштомати', 'Почтоматы')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Для компактних ролет та жалюзі завширшки до 58 см можлива зручна доставка у найближчий поштомат поруч із вашим будинком.',
              'Для компактных роллет и жалюзи шириной до 58 см возможна удобная доставка в ближайший почтомат рядом с вашим домом.'
            )}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <MapPin className="w-8 h-8 text-amber-600" />
          <h2 className="font-bold text-base text-gray-900">
            {t('Кур\'єрська доставка', 'Курьерская доставка')}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t(
              'Адресна доставка кур\'єром Нової Пошти прямо до дверей квартири чи офісу у зручний для вас час.',
              'Адресная доставка курьером Новой Почты прямо до дверей квартиры или офиса в удобное для вас время.'
            )}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-3xl p-6 sm:p-8 border border-blue-100 space-y-3 text-xs sm:text-sm text-blue-950">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{t('Терміни виготовлення та відправки', 'Сроки изготовления и отправки')}</span>
        </h3>
        <p className="leading-relaxed">
          {t('Термін виробництва становить', 'Срок производства составляет')} <strong>{t('від 2 до 4 робочих днів', 'от 2 до 4 рабочих дней')}</strong>. {t('Після відправки ви отримаєте SMS-повідомлення та сповіщення у додатку з номером ТТН для відстеження посилки.', 'После отправки вы получите SMS-сообщение и уведомление в приложении с номером ТТН для отслеживания посылки.')}
        </p>
      </div>
    </div>
  );
}
