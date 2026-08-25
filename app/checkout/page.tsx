'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { createOrder } from '@/lib/supabase';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  User,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { t, tProdTitle, tColorName } = useLanguage();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [deliveryType, setDeliveryType] = useState('nova_poshta');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber: string } | null>(null);

  const phoneValidation = validateAndNormalizeUaPhone(phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!name || !phone || !city || !deliveryAddress) {
      setErrorMessage(t('Будь ласка, заповніть усі обов’язкові поля (Ім’я, Телефон, Місто, Адреса).', 'Пожалуйста, заполните все обязательные поля (Имя, Телефон, Город, Адрес).'));
      return;
    }

    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.error || t('Будь ласка, введіть коректний номер телефону України (10 цифр).', 'Пожалуйста, введите корректный номер телефона Украины (10 цифр).'));
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customer_name: name,
        phone: phoneValidation.normalizedPhone || phone,
        email,
        city,
        delivery_type: deliveryType,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          title: i.title,
          sku: i.sku,
          width: i.width,
          height: i.height,
          color: i.color?.name || 'Стандарт',
          controlSide: i.controlSide,
          fixationType: i.fixationType,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          totalPrice: i.totalPrice,
        })),
        total_amount: totalAmount,
        comment,
      });

      if (result.success) {
        setOrderResult(result);
        clearCart();

        // Launch confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMessage(result.error || t('Не вдалося зберегти замовлення. Спробуйте ще раз або зателефонуйте менеджеру.', 'Не удалось сохранить заказ. Попробуйте еще раз или позвоните менеджеру.'));
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(t('Виникла непередбачувана помилка при оформленні. Будь ласка, спробуйте ще раз.', 'Возникла непредвиденная ошибка при оформлении. Пожалуйста, попробуйте еще раз.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {t('Замовлення успішно оформлено!', 'Заказ успешно оформлен!')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {t('Номер замовлення', 'Номер заказа')}: {orderResult.orderNumber}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              {t("Дякуємо за покупку в нашому інтернет-магазині! Менеджер зв'яжеться з вами за номером", 'Спасибо за покупку в нашем интернет-магазине! Менеджер свяжется с вами по номеру')} <strong>{phone}</strong> {t('для підтвердження розмірів та передачі замовлення у виробництво.', 'для подтверждения размеров и передачи заказа в производство.')}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 text-left text-xs space-y-2 max-w-md mx-auto text-gray-700">
            <div className="flex justify-between">
              <span>{t('Одержувач:', 'Получатель:')}</span>
              <strong className="text-gray-900">{name}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t('Місто / Доставка:', 'Город / Доставка:')}</span>
              <strong className="text-gray-900">{city}, {deliveryAddress}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t('Спосіб оплати:', 'Способ оплаты:')}</span>
              <strong className="text-gray-900 capitalize">
                {paymentMethod === 'cash_on_delivery' ? t('Післяплата при отриманні', 'Наложенный платеж при получении') : t('Оплата карткою', 'Оплата картой')}
              </strong>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              {t('На головну сторінку', 'На главную страницу')}
            </Link>
            <Link
              href="/catalog"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
            >
              {t('Продовжити покупки', 'Продолжить покупки')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('У кошику немає товарів', 'В корзине нет товаров')}</h2>
        <p className="text-xs text-gray-500">
          {t('Оберіть жалюзі або ролети у каталозі, вкажіть розміри та перейдіть до оформлення.', 'Выберите жалюзи или роллеты в каталоге, укажите размеры и перейдите к оформлению.')}
        </p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
        >
          {t('Перейти до каталогу', 'Перейти в каталог')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{t('Оформлення замовлення', 'Оформление заказа')}</h1>
        <p className="text-xs text-gray-500 mt-1">
          {t('Заповніть контактні дані та адресу доставки. Оплата здійснюється при отриманні або онлайн.', 'Заполните контактные данные и адрес доставки. Оплата осуществляется при получении или онлайн.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>1. {t('Контактні дані одержувача', 'Контактные данные получателя')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t("Прізвище та ім'я *", 'Фамилия и имя *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('Шевченко Тарас', 'Иванов Иван')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    {t('Номер телефону *', 'Номер телефона *')}
                  </label>
                  {phone.length >= 9 && phoneValidation.isValid && (
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ {phoneValidation.operator}
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+38 (093) 123-45-67 або 0931234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:ring-1 ${
                    phone.length >= 9 && !phoneValidation.isValid
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : phoneValidation.isValid
                      ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600'
                      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('Електронна пошта (для отримання чека)', 'Электронная почта (для получения чека)')}
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* 2. Delivery details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>2. {t('Спосіб та адреса доставки', 'Способ и адрес доставки')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'nova_poshta', label: t('Нова Пошта (Відділення)', 'Новая Почта (Отделение)'), desc: t('2-4 дні', '2-4 дня') },
                { key: 'poshtomat', label: t('Поштомат Нової Пошти', 'Почтомат Новой Почты'), desc: t('Для компактних ролет', 'Для компактных роллет') },
                { key: 'courier', label: t("Кур'єр Нової Пошти", 'Курьер Новой Почты'), desc: t('До дверей', 'До дверей') },
              ].map((del) => (
                <button
                  type="button"
                  key={del.key}
                  onClick={() => setDeliveryType(del.key)}
                  className={`p-3.5 rounded-2xl text-left border transition ${
                    deliveryType === del.key
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-xs text-gray-900">{del.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{del.desc}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Місто / Населений пункт *', 'Город / Населенный пункт *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('напр. Дніпро, Київ, Львів', 'напр. Днепр, Киев, Харьков')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('№ відділення або адреса *', '№ отделения или адрес *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('Відділення №1 (вул. Головна...)', 'Отделение №1 (ул. Главная...)')}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>3. {t('Спосіб оплати', 'Способ оплаты')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: 'cash_on_delivery',
                  label: t('Післяплата (при отриманні)', 'Наложенный платеж (при получении)'),
                  desc: t('Оплата після огляду на Новій Пошті', 'Оплата после осмотра на Новой Почте'),
                },
                {
                  key: 'card',
                  label: t('Оплата онлайн (Карта / IBAN)', 'Оплата онлайн (Карта / IBAN)'),
                  desc: 'Visa, MasterCard, Приват24',
                },
                {
                  key: 'privat_parts',
                  label: t('Оплата частинами ПриватБанк', 'Оплата частями ПриватБанк'),
                  desc: t('До 24 місяців без переплат', 'До 24 месяцев без переплат'),
                },
                {
                  key: 'mono_parts',
                  label: t('Покупка частинами Monobank', 'Покупка частями Monobank'),
                  desc: t('До 3 платежів без комісії', 'До 3 платежей без комиссии'),
                },
              ].map((pay) => (
                <button
                  type="button"
                  key={pay.key}
                  onClick={() => setPaymentMethod(pay.key)}
                  className={`p-3.5 rounded-2xl text-left border transition ${
                    paymentMethod === pay.key
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-xs text-gray-900">{pay.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{pay.desc}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t("Коментар до замовлення (необов'язково)", 'Комментарий к заказу (необязательно)')}
              </label>
              <textarea
                rows={2}
                placeholder={t('Особливості монтажу, код домофону, побажання щодо часу дзвінка...', 'Особенности монтажа, код домофона, пожелания по времени звонка...')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Right Summary: Items and Submit (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-base text-gray-900">{t('Ваше замовлення', 'Ваш заказ')}</h3>
            <span className="text-xs font-semibold text-gray-500">{items.length} {t('поз.', 'поз.')}</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs border-b border-gray-50 pb-3">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={tProdTitle(item.title)}
                    fill
                    className="object-cover"
                    sizes="60px"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 line-clamp-1">{tProdTitle(item.title)}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {item.width}×{item.height} {t('см', 'см')} • {tColorName(item.color?.name || '')}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-500">{t('Кількість', 'Количество')}: {item.quantity} {t('шт', 'шт')}</span>
                    <span className="font-extrabold text-blue-900">{item.totalPrice} {t('грн', 'грн')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary calculations */}
          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>{t('Вартість товарів:', 'Стоимость товаров:')}</span>
              <strong className="text-gray-900">{totalAmount.toLocaleString('uk-UA')} {t('грн', 'грн')}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t('Доставка:', 'Доставка:')}</span>
              <span className="text-emerald-600 font-semibold">{t('за тарифами перевізника', 'по тарифам перевозчика')}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">{t('Разом до сплати:', 'Итого к оплате:')}</span>
              <span className="text-2xl font-black text-blue-950">
                {totalAmount.toLocaleString('uk-UA')} {t('грн', 'грн')}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Guarantee and Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? t('Оформлення...', 'Оформление...') : t('Підтвердити замовлення', 'Подтвердить заказ')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('Офіційна гарантія та перевірка при отриманні', 'Официальная гарантия и проверка при получении')}</span>
          </div>
        </div>
      </form>
    </div>
  );
}
