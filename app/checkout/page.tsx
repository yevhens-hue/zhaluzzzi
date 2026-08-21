'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/supabase';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  FileText,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();

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
  const [orderResult, setOrderResult] = useState<{ success: boolean; orderNumber: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!name || !phone || !city || !deliveryAddress) {
      alert('Будь ласка, заповніть усі обов’язкові поля.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        customer_name: name,
        phone,
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

      setOrderResult(result);
      clearCart();

      // Launch confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Checkout error:', err);
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
              Замовлення успішно оформлено!
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Номер замовлення: {orderResult.orderNumber}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Дякуємо за покупку в нашому інтернет-магазині! Менеджер зв'яжеться з вами за номером <strong>{phone}</strong> для підтвердження розмірів та передачі замовлення у виробництво.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 text-left text-xs space-y-2 max-w-md mx-auto text-gray-700">
            <div className="flex justify-between">
              <span>Одержувач:</span>
              <strong className="text-gray-900">{name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Місто / Доставка:</span>
              <strong className="text-gray-900">{city}, {deliveryAddress}</strong>
            </div>
            <div className="flex justify-between">
              <span>Спосіб оплати:</span>
              <strong className="text-gray-900 capitalize">
                {paymentMethod === 'cash_on_delivery' ? 'Післяплата при отриманні' : 'Оплата карткою'}
              </strong>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              На головну сторінку
            </Link>
            <Link
              href="/catalog"
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
            >
              Продовжити покупки
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
        <h2 className="text-xl font-bold text-gray-900">У кошику немає товарів</h2>
        <p className="text-xs text-gray-500">
          Оберіть жалюзі або ролети у каталозі, вкажіть розміри та перейдіть до оформлення.
        </p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Оформлення замовлення</h1>
        <p className="text-xs text-gray-500 mt-1">
          Заповніть контактні дані та адресу доставки. Оплата здійснюється при отриманні або онлайн.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>1. Контактні дані одержувача</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Прізвище та ім'я *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Шевченко Тарас"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Номер телефону *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+38 (099) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Електронна пошта (для отримання чека)
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
              <span>2. Спосіб та адреса доставки</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'nova_poshta', label: 'Нова Пошта (Відділення)', desc: '2-4 дні' },
                { key: 'poshtomat', label: 'Поштомат Нової Пошти', desc: 'Для компактних ролет' },
                { key: 'courier', label: "Кур'єр Нової Пошти", desc: 'До дверей' },
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
                  Місто / Населений пункт *
                </label>
                <input
                  type="text"
                  required
                  placeholder="напр. Дніпро, Київ, Львів"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  № відділення або адреса *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Відділення №1 (вул. Головна...)"
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
              <span>3. Спосіб оплати</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: 'cash_on_delivery',
                  label: 'Післяплата (при отриманні)',
                  desc: 'Оплата після огляду на Новій Пошті',
                },
                {
                  key: 'card',
                  label: 'Оплата онлайн (Карта / IBAN)',
                  desc: 'Visa, MasterCard, Приват24',
                },
                {
                  key: 'privat_parts',
                  label: 'Оплата частинами ПриватБанк',
                  desc: 'До 24 місяців без переплат',
                },
                {
                  key: 'mono_parts',
                  label: 'Покупка частинами Monobank',
                  desc: 'До 3 платежів без комісії',
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
                Коментар до замовлення (необов'язково)
              </label>
              <textarea
                rows={2}
                placeholder="Особливості монтажу, код домофону, побажання щодо часу дзвінка..."
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
            <h3 className="font-bold text-base text-gray-900">Ваше замовлення</h3>
            <span className="text-xs font-semibold text-gray-500">{items.length} поз.</span>
          </div>

          {/* Items Preview */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs border-b border-gray-50 pb-3">
                <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-100 relative shrink-0">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 line-clamp-1">{item.title}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {item.width}×{item.height} см • {item.color?.name}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-500">Кількість: {item.quantity} шт</span>
                    <span className="font-extrabold text-blue-900">{item.totalPrice} грн</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary calculations */}
          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Вартість товарів:</span>
              <strong className="text-gray-900">{totalAmount.toLocaleString('uk-UA')} грн</strong>
            </div>
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span className="text-emerald-600 font-semibold">за тарифами перевізника</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">Разом до сплати:</span>
              <span className="text-2xl font-black text-blue-950">
                {totalAmount.toLocaleString('uk-UA')} грн
              </span>
            </div>
          </div>

          {/* Guarantee and Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Оформлення...' : 'Підтвердити замовлення'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Офіційна гарантія та перевірка при отриманні</span>
          </div>
        </div>
      </form>
    </div>
  );
}
