'use client';

import React from 'react';
import { PromoContent } from '@/lib/siteSettings';
import { Megaphone, Save } from 'lucide-react';

interface PromoTabProps {
  promoForm: PromoContent;
  setPromoForm: React.Dispatch<React.SetStateAction<PromoContent>>;
  onSavePromo: (e: React.FormEvent) => Promise<void>;
}

export default function PromoTab({
  promoForm,
  setPromoForm,
  onSavePromo,
}: PromoTabProps) {
  return (
    <form onSubmit={onSavePromo} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Megaphone className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Банери та рекламні тексти</h2>
          <p className="text-xs text-gray-500">
            Керуйте текстом рекламної плашки у шапці та головними заголовками
          </p>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Рекламна плашка у самій шапці сайту (Top Banner)
          </label>
          <input
            type="text"
            value={promoForm.topBannerText}
            onChange={(e) => setPromoForm({ ...promoForm, topBannerText: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
          <p className="text-[11px] text-gray-400 mt-1">Залиште порожнім, якщо бажаєте приховати плашку.</p>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Головний заголовок сторінки (Hero Title)
          </label>
          <input
            type="text"
            value={promoForm.heroTitle}
            onChange={(e) => setPromoForm({ ...promoForm, heroTitle: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Підзаголовок / УТП (Hero Subtitle)
          </label>
          <textarea
            rows={2}
            value={promoForm.heroSubtitle}
            onChange={(e) => setPromoForm({ ...promoForm, heroSubtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            Бейдж акції / знижки (наприклад: "🔥 Знижки до -25% на День-Ніч")
          </label>
          <input
            type="text"
            value={promoForm.heroDiscountBadge}
            onChange={(e) => setPromoForm({ ...promoForm, heroDiscountBadge: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти тексти</span>
        </button>
      </div>
    </form>
  );
}
