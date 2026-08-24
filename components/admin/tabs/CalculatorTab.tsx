'use client';

import React from 'react';
import { CalculatorRates } from '@/lib/siteSettings';
import { Calculator, Save, RotateCcw } from 'lucide-react';

interface CalculatorTabProps {
  calcForm: CalculatorRates;
  setCalcForm: React.Dispatch<React.SetStateAction<CalculatorRates>>;
  onSaveCalculator: (e: React.FormEvent) => Promise<void>;
  resetDefaults: () => void;
}

export default function CalculatorTab({
  calcForm,
  setCalcForm,
  onSaveCalculator,
  resetDefaults,
}: CalculatorTabProps) {
  return (
    <form onSubmit={onSaveCalculator} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <Calculator className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">Тарифи та формули онлайн-калькулятора</h2>
          <p className="text-xs text-gray-500">
            Зміна базових ставок за квадратний метр, коефіцієнтів тканини та додаткових опцій
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-extrabold text-sm text-gray-900">1. Базова ставка за 1 м² за категоріями</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Тканинні ролети (грн/м²)</label>
            <input
              type="number"
              value={calcForm.roletiBaseRate}
              onChange={(e) => setCalcForm({ ...calcForm, roletiBaseRate: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Штори День-Ніч (грн/м²)</label>
            <input
              type="number"
              value={calcForm.shtoriBaseRate}
              onChange={(e) => setCalcForm({ ...calcForm, shtoriBaseRate: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Жалюзі (грн/м²)</label>
            <input
              type="number"
              value={calcForm.zhaluziBaseRate}
              onChange={(e) => setCalcForm({ ...calcForm, zhaluziBaseRate: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Закрита система (грн/м²)</label>
            <input
              type="number"
              value={calcForm.zakrytaBaseRate}
              onChange={(e) => setCalcForm({ ...calcForm, zakrytaBaseRate: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="font-extrabold text-sm text-gray-900">2. Коефіцієнти типу тканини та додаткові опції</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Коефіцієнт тканини Преміум</label>
            <input
              type="number"
              step="0.05"
              value={calcForm.premiumMultiplier}
              onChange={(e) => setCalcForm({ ...calcForm, premiumMultiplier: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Коефіцієнт тканини Блекаут</label>
            <input
              type="number"
              step="0.05"
              value={calcForm.blackoutMultiplier}
              onChange={(e) => setCalcForm({ ...calcForm, blackoutMultiplier: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Доплата за ліску (грн)</label>
            <input
              type="number"
              value={calcForm.lineFixationCost}
              onChange={(e) => setCalcForm({ ...calcForm, lineFixationCost: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Доплата за електропривод (грн)</label>
            <input
              type="number"
              value={calcForm.motorizationCost}
              onChange={(e) => setCalcForm({ ...calcForm, motorizationCost: Number(e.target.value) })}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={resetDefaults}
          className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Скинути до стандартних</span>
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти розцінки</span>
        </button>
      </div>
    </form>
  );
}
