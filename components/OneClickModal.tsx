'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { createLead } from '@/lib/supabase';
import { Product, ProductColor } from '@/types/database';
import { useLanguage } from '@/context/LanguageContext';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';

interface OneClickModalProps {
  product: Product;
  selectedColor?: ProductColor;
  width: number;
  height: number;
  calculatedPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export function OneClickModal({
  product,
  selectedColor,
  width,
  height,
  calculatedPrice,
  isOpen,
  onClose,
}: OneClickModalProps) {
  const { t, tProdTitle, tColorName } = useLanguage();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const phoneValidation = validateAndNormalizeUaPhone(phone);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Введіть коректний номер телефону України');
      return;
    }

    setPhoneError(null);
    setIsSubmitting(true);
    try {
      const res = await createLead({
        phone: phoneValidation.normalizedPhone || phone,
        name,
        product_id: product.id,
        product_title: product.title,
        product_sku: product.sku,
        dimensions: `${width} см × ${height} см`,
        selected_color: selectedColor?.name || product.color_name,
        calculated_price: calculatedPrice,
        lead_type: 'one_click',
      });
      if (res.success) {
        setIsSuccess(true);
      } else {
        setPhoneError(res.error || 'Помилка збереження заявки');
      }
    } catch (err: any) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="oneclick-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          aria-label="Закрити модальне вікно"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 id="oneclick-modal-title" className="text-xl font-bold text-gray-900">{t('Дякуємо за замовлення!', 'Спасибо за заказ!')}</h3>
            <p className="text-xs text-gray-600">
              {t('Наш менеджер зв\'яжеться з вами за номером', 'Наш менеджер свяжется с вами по номеру')}{' '}
              <strong>{phoneValidation.formattedPhone || phone}</strong>{' '}
              {t('протягом 15 хвилин для уточнення деталей та оформлення доставки.', 'в течение 15 минут для уточнения деталей и оформления доставки.')}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              {t('Зрозуміло', 'Понятно')}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 id="oneclick-modal-title" className="text-lg font-bold text-gray-900">{t('Швидке замовлення в 1 клік', 'Быстрый заказ в 1 клик')}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {t(
                'Залиште ваш номер телефону, і наш спеціаліст безкоштовно проконсультує вас, підтвердить розміри та оформить замовлення.',
                'Оставьте ваш номер телефона, и наш специалист бесплатно проконсультирует вас, подтвердит размеры и оформит заказ.'
              )}
            </p>

            {/* Product summary pill */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-4 space-y-1 text-xs">
              <div className="font-bold text-gray-900 line-clamp-1">{tProdTitle(product.title)}</div>
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>{t('Розмір:', 'Размер:')} <strong>{width} {t('см', 'см')} × {height} {t('см', 'см')}</strong></span>
                <span>{t('Колір:', 'Цвет:')} <strong>{selectedColor ? tColorName(selectedColor.name) : t('Стандарт', 'Стандарт')}</strong></span>
              </div>
              <div className="pt-1 text-right font-extrabold text-blue-900 text-sm">
                {t('Сума:', 'Сумма:')} {calculatedPrice.toLocaleString('uk-UA')} {t('грн', 'грн')}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Ваше ім\'я (необов\'язково)', 'Ваше имя (необязательно)')}
                </label>
                <input
                  type="text"
                  placeholder={t('Олександр', 'Александр')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
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
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+38 (093) 123-45-67 або 0931234567"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    className={`w-full pl-9 pr-3.5 py-2 border rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:ring-1 ${
                      phoneError
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : phoneValidation.isValid
                        ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-600'
                        : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">{phoneError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? t('Відправка...', 'Отправка...') : t('Підтвердити замовлення', 'Подтвердить заказ')}
              </button>

              <div className="text-[10px] text-gray-400 text-center">
                🔒 {t('Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних.', 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.')}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
