'use client';

import React, { useState } from 'react';
import {
  CatalogFiltersSettings,
  CatalogFilterItem,
  DEFAULT_CATALOG_FILTERS,
} from '@/lib/siteSettings';
import {
  Filter,
  Save,
  CheckCircle2,
  EyeOff,
  Trash2,
  Plus,
  RotateCcw,
} from 'lucide-react';

interface FiltersTabProps {
  filtersForm: CatalogFiltersSettings;
  setFiltersForm: React.Dispatch<React.SetStateAction<CatalogFiltersSettings>>;
  onSaveFilters: (e?: React.FormEvent) => Promise<void>;
}

export default function FiltersTab({
  filtersForm,
  setFiltersForm,
  onSaveFilters,
}: FiltersTabProps) {
  const [newDestName, setNewDestName] = useState('');
  const [newDestKey, setNewDestKey] = useState('');
  const [newTextureName, setNewTextureName] = useState('');
  const [newTextureKey, setNewTextureKey] = useState('');
  const [newBlackoutName, setNewBlackoutName] = useState('');
  const [newBlackoutKey, setNewBlackoutKey] = useState('');

  return (
    <form onSubmit={onSaveFilters} className="space-y-6 max-w-5xl">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Filter className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Налаштування фільтрів каталогу</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Керуйте категоріями приміщень, типами тканин та рівнями затемнення, які бачать покупці на сайті
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти налаштування фільтрів</span>
        </button>
      </div>

      {/* Section 1: Destinations / Rooms */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>🏠</span>
              <span>Призначення / Кімнати</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full">
                {filtersForm.destinations.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Ці фільтри відображаються у лівому сайдбарі каталогу та у картці додавання/редагування товару
            </p>
          </div>
        </div>

        {/* List of Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtersForm.destinations.map((dest, idx) => (
            <div
              key={dest.id || dest.key}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                dest.enabled !== false
                  ? 'bg-white border-gray-200 hover:border-blue-300'
                  : 'bg-gray-50/80 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...filtersForm.destinations];
                    updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                    setFiltersForm({ ...filtersForm, destinations: updated });
                  }}
                  className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                    dest.enabled !== false
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  title={dest.enabled !== false ? 'Фільтр активний (натисніть щоб вимкнути)' : 'Фільтр вимкнено'}
                >
                  {dest.enabled !== false ? <CheckCircle2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={dest.labelUa}
                    onChange={(e) => {
                      const updated = [...filtersForm.destinations];
                      updated[idx] = { ...updated[idx], labelUa: e.target.value };
                      setFiltersForm({ ...filtersForm, destinations: updated });
                    }}
                    placeholder="Назва кімнати (UA)"
                    className="w-full text-xs font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-hidden py-0.5"
                  />
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-gray-400">Ключ: {dest.key}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        dest.enabled !== false ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 bg-gray-200'
                      }`}
                    >
                      {dest.enabled !== false ? 'Увімкнено на сайті' : 'Приховано'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Видалити фільтр "${dest.labelUa}"?`)) {
                    const updated = filtersForm.destinations.filter((_, i) => i !== idx);
                    setFiltersForm({ ...filtersForm, destinations: updated });
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 cursor-pointer"
                title="Видалити фільтр"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Destination Form */}
        <div className="pt-4 border-t border-gray-100 bg-gray-50/70 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Додати нове приміщення / кімнату</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newDestName}
                onChange={(e) => {
                  setNewDestName(e.target.value);
                  if (!newDestKey || newDestKey === newDestName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                    const translit = e.target.value
                      .toLowerCase()
                      .replace(/[а-яієїґ]/g, (ch) => ({
                        а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
                        ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
                        м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
                        ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya',
                      }[ch] || ch))
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setNewDestKey(translit || '');
                  }
                }}
                placeholder="Наприклад: У ванну кімнату / На терасу"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newDestKey}
                onChange={(e) => setNewDestKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Системний ключ (u-vannu)"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-700 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => {
                  if (!newDestName.trim()) {
                    alert('Введіть назву кімнати!');
                    return;
                  }
                  const key = newDestKey.trim() || `dest-${Date.now()}`;
                  if (filtersForm.destinations.some((d) => d.key === key)) {
                    alert('Кімната з таким системним ключем вже існує!');
                    return;
                  }
                  const newItem: CatalogFilterItem = {
                    id: `d-${Date.now()}`,
                    key,
                    labelUa: newDestName.trim(),
                    labelRu: newDestName.trim(),
                    enabled: true,
                  };
                  setFiltersForm({
                    ...filtersForm,
                    destinations: [...filtersForm.destinations, newItem],
                  });
                  setNewDestName('');
                  setNewDestKey('');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Додати</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Textures */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>🎨</span>
              <span>Фактури тканин та полотен</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full">
                {filtersForm.textures.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Варіанти фактур для швидкого сортування в каталозі
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtersForm.textures.map((tex, idx) => (
            <div
              key={tex.id || tex.key}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                tex.enabled !== false
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-50/80 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...filtersForm.textures];
                    updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                    setFiltersForm({ ...filtersForm, textures: updated });
                  }}
                  className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                    tex.enabled !== false
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {tex.enabled !== false ? <CheckCircle2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={tex.labelUa}
                    onChange={(e) => {
                      const updated = [...filtersForm.textures];
                      updated[idx] = { ...updated[idx], labelUa: e.target.value };
                      setFiltersForm({ ...filtersForm, textures: updated });
                    }}
                    className="w-full text-xs font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-hidden py-0.5"
                  />
                  <span className="text-[10px] font-mono text-gray-400">Ключ: {tex.key}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Видалити фактуру "${tex.labelUa}"?`)) {
                    const updated = filtersForm.textures.filter((_, i) => i !== idx);
                    setFiltersForm({ ...filtersForm, textures: updated });
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Texture */}
        <div className="pt-4 border-t border-gray-100 bg-gray-50/70 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Додати новий варіант фактури</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newTextureName}
                onChange={(e) => {
                  setNewTextureName(e.target.value);
                  if (!newTextureKey) {
                    setNewTextureKey(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="Наприклад: Перфоровані / Жакард"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newTextureKey}
                onChange={(e) => setNewTextureKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Системний ключ (jacquard)"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-700 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => {
                  if (!newTextureName.trim()) return;
                  const key = newTextureKey.trim() || `tex-${Date.now()}`;
                  const newItem: CatalogFilterItem = {
                    id: `t-${Date.now()}`,
                    key,
                    labelUa: newTextureName.trim(),
                    labelRu: newTextureName.trim(),
                    enabled: true,
                  };
                  setFiltersForm({
                    ...filtersForm,
                    textures: [...filtersForm.textures, newItem],
                  });
                  setNewTextureName('');
                  setNewTextureKey('');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Додати</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Blackout Levels */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>🌙</span>
              <span>Рівні світлозахисту (Blackout)</span>
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full">
                {filtersForm.blackoutLevels.length}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Градація затемнення для фільтрації в каталозі
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtersForm.blackoutLevels.map((b, idx) => (
            <div
              key={b.id || b.key}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                b.enabled !== false
                  ? 'bg-white border-gray-200'
                  : 'bg-gray-50/80 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...filtersForm.blackoutLevels];
                    updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
                    setFiltersForm({ ...filtersForm, blackoutLevels: updated });
                  }}
                  className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                    b.enabled !== false
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {b.enabled !== false ? <CheckCircle2 className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={b.labelUa}
                    onChange={(e) => {
                      const updated = [...filtersForm.blackoutLevels];
                      updated[idx] = { ...updated[idx], labelUa: e.target.value };
                      setFiltersForm({ ...filtersForm, blackoutLevels: updated });
                    }}
                    className="w-full text-xs font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-600 focus:outline-hidden py-0.5"
                  />
                  <span className="text-[10px] font-mono text-gray-400">Ключ: {b.key}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Видалити рівень "${b.labelUa}"?`)) {
                    const updated = filtersForm.blackoutLevels.filter((_, i) => i !== idx);
                    setFiltersForm({ ...filtersForm, blackoutLevels: updated });
                  }
                }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Blackout */}
        <div className="pt-4 border-t border-gray-100 bg-gray-50/70 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Додати новий рівень затемнення</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newBlackoutName}
                onChange={(e) => {
                  setNewBlackoutName(e.target.value);
                  if (!newBlackoutKey) {
                    setNewBlackoutKey(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }
                }}
                placeholder="Наприклад: 90% Повне затемнення"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={newBlackoutKey}
                onChange={(e) => setNewBlackoutKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="Системний ключ (90-blackout)"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono font-medium text-gray-700 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => {
                  if (!newBlackoutName.trim()) return;
                  const key = newBlackoutKey.trim() || `bo-${Date.now()}`;
                  const newItem: CatalogFilterItem = {
                    id: `b-${Date.now()}`,
                    key,
                    labelUa: newBlackoutName.trim(),
                    labelRu: newBlackoutName.trim(),
                    enabled: true,
                  };
                  setFiltersForm({
                    ...filtersForm,
                    blackoutLevels: [...filtersForm.blackoutLevels, newItem],
                  });
                  setNewBlackoutName('');
                  setNewBlackoutKey('');
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Додати</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => {
            if (confirm('Скинути всі налаштування фільтрів до стандартних за замовчуванням?')) {
              setFiltersForm(DEFAULT_CATALOG_FILTERS);
            }
          }}
          className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Скинути фільтри до стандартних</span>
        </button>

        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Зберегти налаштування фільтрів</span>
        </button>
      </div>
    </form>
  );
}
