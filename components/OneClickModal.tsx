'use client';

import React, { useState } from 'react';
import { X, Phone, CheckCircle, Sparkles } from 'lucide-react';
import { createLead } from '@/lib/supabase';
import { Product, ProductColor } from '@/types/database';

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
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;

    setIsSubmitting(true);
    try {
      await createLead({
        phone,
        name,
        product_id: product.id,
        product_title: product.title,
        product_sku: product.sku,
        dimensions: `${width} см × ${height} см`,
        selected_color: selectedColor?.name || product.color_name,
        calculated_price: calculatedPrice,
        lead_type: 'one_click',
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Дякуємо за замовлення!</h3>
            <p className="text-xs text-gray-600">
              Наш менеджер зв'яжеться з вами за номером <strong>{phone}</strong> протягом 15 хвилин для уточнення деталей та оформлення доставки.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              Зрозуміло
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-gray-900">Швидке замовлення в 1 клік</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Залиште ваш номер телефону, і наш спеціаліст безкоштовно проконсультує вас, підтвердить розміри та оформить замовлення.
            </p>

            {/* Product summary pill */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-4 space-y-1 text-xs">
              <div className="font-bold text-gray-900 line-clamp-1">{product.title}</div>
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>Розмір: <strong>{width} см × {height} см</strong></span>
                <span>Колір: <strong>{selectedColor?.name || 'Стандарт'}</strong></span>
              </div>
              <div className="pt-1 text-right font-extrabold text-blue-900 text-sm">
                Сума: {calculatedPrice.toLocaleString('uk-UA')} грн
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ваше ім'я (необов'язково)
                </label>
                <input
                  type="text"
                  placeholder="Олександр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Номер телефону *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+38 (099) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-sm shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Відправка...' : 'Підтвердити замовлення'}
              </button>

              <div className="text-[10px] text-gray-400 text-center">
                🔒 Натискаючи кнопку, ви погоджуєтеся на обробку персональних даних.
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
