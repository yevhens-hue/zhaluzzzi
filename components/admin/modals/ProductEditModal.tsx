'use client';

import React from 'react';
import { Product } from '@/types/database';
import { CatalogFiltersSettings, DEFAULT_CATALOG_FILTERS } from '@/lib/siteSettings';
import {
  Save,
  Upload,
  Image as ImageIcon,
  X,
  Sliders,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface ProductEditModalProps {
  editingProduct: Product;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  isAddingNewProduct: boolean;
  onCancel: () => void;
  onSave: (product: Product) => Promise<void>;
  isSaving: boolean;
  filtersForm: CatalogFiltersSettings;
  handleUploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
  uploadProgress: number;
  showNotification: (msg: string) => void;
}

export const compressBase64Image = (base64: string, maxWidth = 800, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64.startsWith('data:image')) {
      resolve(base64);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
};

export const generateSlugFromTitle = (title: string, id: string): string => {
  if (!title) return `product_${id}`;
  const translitMap: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye',
    ж: 'zh', з: 'z', и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l',
    м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ь: '', ю: 'yu', я: 'ya',
  };

  const clean = title.toLowerCase().split('').map((ch) => translitMap[ch] || ch).join('');
  const slugified = clean.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return slugified.length > 3 ? `${slugified}_${id.slice(-4)}` : `product_${id}`;
};

export default function ProductEditModal({
  editingProduct,
  setEditingProduct,
  isAddingNewProduct,
  onCancel,
  onSave,
  isSaving,
  filtersForm,
  handleUploadImage,
  isUploading,
  uploadProgress,
  showNotification,
}: ProductEditModalProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500 shadow-xl space-y-6">
      <div className="flex justify-between items-start pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-extrabold text-lg text-gray-900">
            {isAddingNewProduct ? '✨ Додавання нового товару' : `✏️ Редагування: ${editingProduct.title}`}
          </h3>
          {isAddingNewProduct && (
            <p className="text-[11px] text-gray-500 mt-1">
              💡 Після збереження товар з'явиться на сайті миттєво — відкрийте вкладку /catalog або сторінку категорії без перезавантаження.
            </p>
          )}
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-700 shrink-0 ml-4 cursor-pointer"
        >
          Скасувати
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-bold text-gray-700 mb-1">Назва товару *</label>
          <input
            type="text"
            value={editingProduct.title}
            onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
            placeholder="Рулонні штори Блекаут Антрацит"
          />
          {editingProduct.title?.trim() && (
            <div className="mt-1 text-[11px] text-gray-400 font-mono">
              🔗 URL: /product/{generateSlugFromTitle(editingProduct.title, editingProduct.id)}
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Артикул / SKU *</label>
          <input
            type="text"
            value={editingProduct.sku}
            onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
            placeholder="L-7439"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white font-mono"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Категорія *</label>
          <select
            value={editingProduct.category_slug}
            onChange={(e) => setEditingProduct({ ...editingProduct, category_slug: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          >
            <option value="roleti">🏠 Тканинні ролети (roleti)</option>
            <option value="shtori">🌟 Штори День-Ніч (shtori)</option>
            <option value="zhaluzi">💠 Жалюзі (zhaluzi)</option>
            <option value="zakryta-sistema">🔒 Закрита система (zakryta-sistema)</option>
          </select>
          <div className="mt-1 text-[11px] text-blue-600 font-semibold">
            📌 Товар з'явиться на:{' '}
            <a href="/catalog" target="_blank" className="underline">/catalog</a>{' та '}
            <a href={`/${editingProduct.category_slug}`} target="_blank" className="underline">
              /{editingProduct.category_slug}
            </a>
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Базова ціна (грн) *</label>
          <input
            type="number"
            value={editingProduct.base_price}
            onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Стара ціна (зі знижкою) (грн)</label>
          <input
            type="number"
            value={editingProduct.old_price || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, old_price: Number(e.target.value) || undefined })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Ціна за 1 м² (грн)</label>
          <input
            type="number"
            value={editingProduct.price_per_sqm}
            onChange={(e) => setEditingProduct({ ...editingProduct, price_per_sqm: Number(e.target.value) })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          />
        </div>

        {/* Catalog Filters Section */}
        <div className="sm:col-span-3 bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>🎯 Параметри для фільтрів каталогу (Кімнати, Фактура, Затемнення)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Blackout % */}
            <div>
              <label className="block font-bold text-gray-800 mb-1">🌙 Рівень затемнення *</label>
              <select
                value={editingProduct.blackout_percent || 70}
                onChange={(e) => setEditingProduct({ ...editingProduct, blackout_percent: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
              >
                <option value={100}>100% Блекаут (Повна темрява)</option>
                <option value={70}>60-80% Напівзатемнення</option>
                <option value={45}>40-50% Розсіювання світла</option>
              </select>
            </div>

            {/* 2. Texture */}
            <div>
              <label className="block font-bold text-gray-800 mb-1">🎨 Фактура полотна *</label>
              <select
                value={editingProduct.texture || 'Однотонний / Без малюнка'}
                onChange={(e) => setEditingProduct({ ...editingProduct, texture: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
              >
                <option value="Однотонний / Без малюнка">Однотонні / Без малюнка</option>
                <option value="З малюнком / Текстурний">З малюнком / Текстурні</option>
                <option value="День-Ніч (Смугастий)">День-Ніч (Смугастий)</option>
                <option value="Алюмінієвий / Металік">Алюмінієвий / Металік</option>
              </select>
            </div>

            {/* 3. Room Destinations Multi-select */}
            <div className="sm:col-span-3">
              <label className="block font-bold text-gray-800 mb-1.5">
                🏠 Призначення / Кімната (Оберіть приміщення, для яких підходить товар):
              </label>
              <div className="flex flex-wrap gap-2">
                {(filtersForm.destinations || DEFAULT_CATALOG_FILTERS.destinations)
                  .filter((d) => d.enabled !== false)
                  .map((room) => {
                    const currentDests = editingProduct.destinations || ['na-kuhnju', 'v-spalnju', 'v-gostinnuju', 'na-balkon', 'v-ofis'];
                    const isChecked = currentDests.includes(room.key);
                    return (
                      <button
                        key={room.key}
                        type="button"
                        onClick={() => {
                          const next = isChecked
                            ? currentDests.filter((d) => d !== room.key)
                            : [...currentDests, room.key];
                          setEditingProduct({ ...editingProduct, destinations: next });
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{room.labelUa}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Product Image Upload & Preview */}
        <div className="sm:col-span-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
          <label className="block font-extrabold text-xs text-gray-800 uppercase tracking-wider">
            🖼️ Головне фото товару *
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Preview Box */}
            {editingProduct.main_image ? (
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-300 shrink-0 bg-white shadow-xs">
                <img
                  src={editingProduct.main_image}
                  alt="Прев'ю товару"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 bg-white">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}

            {/* Controls: Upload file + URL input */}
            <div className="flex-1 space-y-2 w-full">
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
                  <Upload className="w-4 h-4" />
                  <span>📁 Завантажити фото з комп'ютера</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          showNotification('❌ Файл надто великий! Максимум 10 МБ.');
                          return;
                        }
                        const cdnUrl = await handleUploadImage(file);
                        if (cdnUrl) {
                          setEditingProduct((prev) => (prev ? { ...prev, main_image: cdnUrl } : prev));
                        } else {
                          const reader = new FileReader();
                          reader.onload = async (ev) => {
                            if (ev.target?.result) {
                              const compressed = await compressBase64Image(ev.target.result as string);
                              setEditingProduct((prev) => (prev ? { ...prev, main_image: compressed } : prev));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                </label>

                {/* Upload progress */}
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>☁️ Завантаження в хмару...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <span className="text-[11px] text-gray-500 block mt-1">
                  Файл завантажується в хмару Supabase Storage та зберігається як URL.
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                  Або введіть/вставте URL-посилання:
                </label>
                <input
                  type="text"
                  value={editingProduct.main_image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, main_image: e.target.value })}
                  placeholder="https://manov.com.ua/..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Gallery Images Uploader */}
        <div className="sm:col-span-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block font-extrabold text-xs text-gray-800 uppercase tracking-wider">
              📸 Додаткові фото галереї (опціонально)
            </label>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer transition">
              <Plus className="w-3.5 h-3.5" />
              <span>+ Додати фото галереї</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    if (file.size > 10 * 1024 * 1024) {
                      showNotification('❌ Файл надто великий! Максимум 10 МБ.');
                      continue;
                    }
                    const reader = new FileReader();
                    await new Promise<void>((res) => {
                      reader.onload = async (ev) => {
                        if (ev.target?.result) {
                          const compressed = await compressBase64Image(ev.target.result as string);
                          setEditingProduct((prev) => {
                            if (!prev) return prev;
                            return { ...prev, images: [...(prev.images || []), compressed] };
                          });
                        }
                        res();
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
              />
            </label>
          </div>

          {editingProduct.images && editingProduct.images.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {editingProduct.images.map((imgUrl, imgIdx) => (
                <div key={imgIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300 shrink-0 group">
                  <img src={imgUrl} alt={`Галерея ${imgIdx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (editingProduct.images || []).filter((_, idx) => idx !== imgIdx);
                      setEditingProduct({ ...editingProduct, images: updated });
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition shadow-xs cursor-pointer"
                    title="Видалити фото"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 italic">
              Додаткових фото галереї поки що не додано.
            </div>
          )}
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">Статус наявності</label>
          <select
            value={editingProduct.in_stock ? 'true' : 'false'}
            onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.value === 'true' })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
          >
            <option value="true">В наявності (виготовлення 2-4 дні)</option>
            <option value="false">Під замовлення</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block font-bold text-gray-700 mb-1">Опис товару</label>
          <textarea
            rows={3}
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white font-medium"
            placeholder="Детальний опис товару, переваги, особливості..."
          />
        </div>
      </div>

      {/* ===== CHARACTERISTICS EDITOR ===== */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
            <span>📋 Характеристики товару</span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium">Відображаються на вкладці «Характеристики» сторінки товару</span>
        </div>

        {/* Quick-add standard fields */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { key: 'fabric', label: 'Тканина' },
            { key: 'texture', label: 'Текстура' },
            { key: 'color', label: 'Колір' },
            { key: 'blackout', label: 'Затемнення' },
            { key: 'system', label: 'Система' },
            { key: 'manufacturer', label: 'Виробник' },
            { key: 'country', label: 'Країна' },
            { key: 'care', label: 'Догляд' },
            { key: 'warranty', label: 'Гарантія' },
            { key: 'width_range', label: 'Ширина' },
            { key: 'height_range', label: 'Висота' },
            { key: 'drive', label: 'Привід' },
            { key: 'installation', label: 'Монтаж' },
            { key: 'collection', label: 'Колекція' },
          ].map(({ key, label }) => {
            const alreadyHas = key in (editingProduct.characteristics || {});
            return (
              <button
                key={key}
                type="button"
                disabled={alreadyHas}
                onClick={() => setEditingProduct({
                  ...editingProduct,
                  characteristics: { ...(editingProduct.characteristics || {}), [key]: '' },
                })}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition ${
                  alreadyHas
                    ? 'bg-amber-200 border-amber-300 text-amber-700 cursor-default'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-amber-100 hover:border-amber-400 cursor-pointer'
                }`}
              >
                {alreadyHas ? '✓ ' : '+ '}{label}
              </button>
            );
          })}
        </div>

        {/* Existing characteristics — editable rows */}
        <div className="space-y-2">
          {Object.entries(editingProduct.characteristics || {}).map(([charKey, charVal]) => {
            const KNOWN_LABELS: Record<string, string> = {
              fabric: 'Тканина / Матеріал', material: 'Матеріал', texture: 'Текстура',
              color: 'Основний колір', blackout: 'Світлоізоляція', system: 'Система керування',
              manufacturer: 'Виробник', country: 'Країна виробника', care: 'Догляд та чищення',
              warranty: 'Гарантія', type: 'Тип виробу', width_range: 'Діапазон ширини',
              height_range: 'Діапазон висоти', weight: 'Вага (кг/м²)', fire_class: 'Клас горючості',
              eco: 'Екологічність', light: 'Пропускання світла', noise: 'Шумопоглинання',
              installation: 'Спосіб монтажу', drive: 'Привід', collection: 'Колекція',
              code: 'Код тканини', thickness: 'Товщина',
            };
            const isKnown = charKey in KNOWN_LABELS;
            return (
              <div key={charKey} className="flex items-center gap-2">
                {/* Key */}
                {isKnown ? (
                  <div className="w-44 shrink-0 px-3 py-2 bg-amber-100 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900 truncate">
                    {KNOWN_LABELS[charKey]}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={charKey}
                    placeholder="Ключ"
                    className="w-44 shrink-0 px-3 py-2 border border-gray-300 rounded-xl text-[11px] font-mono text-gray-700 bg-white"
                    onChange={(e) => {
                      const newKey = e.target.value.replace(/\s+/g, '_').toLowerCase();
                      const chars = { ...(editingProduct.characteristics || {}) };
                      const entries = Object.entries(chars);
                      const idx = entries.findIndex(([k]) => k === charKey);
                      entries.splice(idx, 1, [newKey, charVal]);
                      setEditingProduct({ ...editingProduct, characteristics: Object.fromEntries(entries) });
                    }}
                  />
                )}
                {/* Value */}
                <input
                  type="text"
                  value={charVal}
                  placeholder="Значення..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white font-medium"
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    characteristics: { ...(editingProduct.characteristics || {}), [charKey]: e.target.value },
                  })}
                />
                {/* Delete row */}
                <button
                  type="button"
                  title="Видалити характеристику"
                  onClick={() => {
                    const chars = { ...(editingProduct.characteristics || {}) };
                    delete chars[charKey];
                    setEditingProduct({ ...editingProduct, characteristics: chars });
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {Object.keys(editingProduct.characteristics || {}).length === 0 && (
            <div className="text-[11px] text-gray-400 italic py-2">
              Характеристики не задані. Натисніть «+ Поле» вище або додайте власне:
            </div>
          )}

          {/* Add custom row */}
          <button
            type="button"
            onClick={() => setEditingProduct({
              ...editingProduct,
              characteristics: {
                ...(editingProduct.characteristics || {}),
                [`custom_${Date.now()}`]: '',
              },
            })}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-gray-300 rounded-xl text-[11px] font-bold text-gray-500 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Додати власну характеристику
          </button>
        </div>

        {/* Live preview */}
        {Object.keys(editingProduct.characteristics || {}).length > 0 && (
          <details className="text-[11px]">
            <summary className="cursor-pointer text-amber-700 font-bold hover:underline">
              👁 Переглянути як виглядатиме на сайті
            </summary>
            <table className="mt-2 w-full max-w-sm text-xs border-collapse">
              <tbody>
                {Object.entries(editingProduct.characteristics || {}).map(([k, v]) => {
                  const LABELS: Record<string, string> = {
                    fabric: 'Тканина / Матеріал', material: 'Матеріал', texture: 'Текстура',
                    color: 'Основний колір', blackout: 'Світлоізоляція', system: 'Система керування',
                    manufacturer: 'Виробник', country: 'Країна виробника', care: 'Догляд та чищення',
                    warranty: 'Гарантія', type: 'Тип виробу', width_range: 'Діапазон ширини',
                    height_range: 'Діапазон висоти', drive: 'Привід', installation: 'Спосіб монтажу',
                    collection: 'Колекція', code: 'Код тканини',
                  };
                  return v ? (
                    <tr key={k} className="border-b border-gray-100">
                      <td className="py-1.5 pr-4 text-gray-500">{LABELS[k] ?? k}</td>
                      <td className="py-1.5 font-bold text-gray-900">{v}</td>
                    </tr>
                  ) : null;
                })}
              </tbody>
            </table>
          </details>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Скасувати
        </button>

        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave(editingProduct)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span>Зберігаємо...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isAddingNewProduct ? 'Створити картку товару' : 'Зберегти зміни'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
