'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalAmount, totalCount } = useCart();
  const { t, tProdTitle, tColorName } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900 text-lg">{t('Кошик покупок', 'Корзина покупок')}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition"
              aria-label={t('Закрити', 'Закрыть')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-1">{t('Ваш кошик порожній', 'Ваша корзина пуста')}</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  {t('Оберіть потрібний товар у каталозі, вкажіть розміри та додайте його у кошик.', 'Выберите нужный товар в каталоге, укажите размеры и добавьте его в корзину.')}
                </p>
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                >
                  {t('Перейти до каталогу', 'Перейти в каталог')}
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-100 rounded-2xl p-3.5 flex gap-3.5 bg-white shadow-xs hover:border-blue-100 transition"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 relative shrink-0">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={tProdTitle(item.title)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2">
                          {tProdTitle(item.title)}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 p-1 transition"
                          title={t('Видалити', 'Удалить')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Specs */}
                      <div className="mt-1 space-y-0.5 text-[11px] text-gray-500">
                        <p>
                          {t('Розмір', 'Размер')}: <strong className="text-gray-800">{item.width} {t('см', 'см')} × {item.height} {t('см', 'см')}</strong>
                        </p>
                        <p className="flex items-center gap-1">
                          {t('Колір', 'Цвет')}:
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.color?.hex || '#999' }}
                          />
                          <span className="text-gray-700">{tColorName(item.color?.name || '')}</span>
                        </p>
                        <p>
                          {t('Управління', 'Управление')}: {item.controlSide === 'left' ? t('Ліве', 'Левое') : t('Праве', 'Правое')} • {item.fixationType === 'with_line' ? t('На лісці', 'С леской') : t('Без ліски', 'Без лески')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-l-lg transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-r-lg transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-extrabold text-blue-900">
                          {item.totalPrice.toLocaleString('uk-UA')} {t('грн', 'грн')}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-gray-400">
                            {item.unitPrice} {t('грн / шт', 'грн / шт')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 space-y-3">
              {/* Delivery badges */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> {t('Відправка 2-4 дні', 'Отправка 2-4 дня')}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t('Гарантія 12 міс.', 'Гарантия 12 мес.')}
                </span>
              </div>

              {/* Total sum */}
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-gray-600 font-medium">{t('Разом до сплати:', 'Итого к оплате:')}</span>
                <span className="text-xl font-extrabold text-gray-900">
                  {totalAmount.toLocaleString('uk-UA')} {t('грн', 'грн')}
                </span>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-98"
              >
                <span>{t('Оформити замовлення', 'Оформить заказ')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Continue shopping */}
              <button
                onClick={closeCart}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-medium py-1"
              >
                {t('Продовжити покупки', 'Продолжить покупки')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
