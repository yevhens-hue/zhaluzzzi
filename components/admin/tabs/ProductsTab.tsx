'use client';

import React from 'react';
import { Product } from '@/types/database';
import { CatalogFiltersSettings } from '@/lib/siteSettings';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ProductEditModal from '../modals/ProductEditModal';
import CsvImportModal from '../modals/CsvImportModal';

interface ProductsTabProps {
  products: Product[];
  allAdminProducts: Product[];
  filteredAdminProducts: Product[];
  productSearch: string;
  setProductSearch: (search: string) => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  isAddingNewProduct: boolean;
  setIsAddingNewProduct: (isAdding: boolean) => void;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onToggleFlag: (productId: string, field: 'is_popular' | 'is_new' | 'in_stock', value: boolean) => Promise<void>;
  isSaving: boolean;
  filtersForm: CatalogFiltersSettings;
  handleUploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
  uploadProgress: number;
  showNotification: (msg: string) => void;
  csvPreview: Record<string, string>[];
  setCsvPreview: (preview: Record<string, string>[]) => void;
  handleCSVFile: (file: File) => void;
  handleCSVImport: () => Promise<void>;
  isImporting: boolean;
  downloadCSVTemplate: () => void;
  handleLoadAnalytics: () => Promise<void>;
  analytics: Record<string, { views: number; orders: number }>;
}

export default function ProductsTab({
  products,
  allAdminProducts,
  filteredAdminProducts,
  productSearch,
  setProductSearch,
  editingProduct,
  setEditingProduct,
  isAddingNewProduct,
  setIsAddingNewProduct,
  onSaveProduct,
  onDeleteProduct,
  onToggleFlag,
  isSaving,
  filtersForm,
  handleUploadImage,
  isUploading,
  uploadProgress,
  showNotification,
  csvPreview,
  setCsvPreview,
  handleCSVFile,
  handleCSVImport,
  isImporting,
  downloadCSVTemplate,
  handleLoadAnalytics,
  analytics,
}: ProductsTabProps) {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Каталог товарів та розцінки</h2>
            <p className="text-xs text-gray-500">
              {filteredAdminProducts.length} з {allAdminProducts.length} товарів
              {products.length > 0 && <span className="text-blue-600 font-bold"> · {products.length} ваших</span>}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLoadAnalytics()}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-purple-200 cursor-pointer"
              title="Завантажити аналітику переглядів"
            >
              📊 Аналітика
            </button>
            <button
              onClick={downloadCSVTemplate}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-gray-200 cursor-pointer"
            >
              ⬇️ Шаблон CSV
            </button>
            <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-200 cursor-pointer">
              📥 Імпорт CSV
              <input
                type="file"
                accept=".csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleCSVFile(f);
                  e.target.value = '';
                }}
              />
            </label>
            <button
              onClick={() => {
                const id = `product-${Date.now()}`;
                setEditingProduct({
                  id,
                  slug: id,
                  title: '',
                  sku: '',
                  category_slug: 'roleti',
                  base_price: 349,
                  old_price: 450,
                  price_unit: 'грн',
                  min_width: 20,
                  max_width: 240,
                  min_height: 30,
                  max_height: 300,
                  base_width: 50,
                  base_height: 150,
                  price_per_sqm: 450,
                  available_colors: [],
                  main_image: 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
                  images: [],
                  is_popular: false,
                  is_new: true,
                  in_stock: true,
                  rating: 5.0,
                  reviews_count: 1,
                  description: 'Виготовлення за індивідуальними розмірами замовника.',
                  blackout_percent: 70,
                  texture: 'Однотонний / Без малюнка',
                  destinations: ['na-kuhnju', 'v-spalnju', 'v-gostinnuju', 'na-balkon', 'v-ofis'],
                  characteristics: {
                    fabric: 'Поліестер 100%',
                    blackout: '70%',
                    system: 'Стандарт',
                    manufacturer: '',
                    country: '',
                    care: 'Суха чистка',
                    warranty: '24 місяці',
                  },
                } as Product);
                setIsAddingNewProduct(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Додати товар</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Пошук по назві, SKU або категорії..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition"
          />
          {productSearch && (
            <button
              onClick={() => setProductSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* CSV Preview Modal */}
      {csvPreview.length > 0 && (
        <CsvImportModal
          csvPreview={csvPreview}
          onCancel={() => setCsvPreview([])}
          onImport={handleCSVImport}
          isImporting={isImporting}
        />
      )}

      {/* Product Edit / Add Modal */}
      {editingProduct && (
        <ProductEditModal
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          isAddingNewProduct={isAddingNewProduct}
          onCancel={() => {
            setEditingProduct(null);
            setIsAddingNewProduct(false);
          }}
          onSave={onSaveProduct}
          isSaving={isSaving}
          filtersForm={filtersForm}
          handleUploadImage={handleUploadImage}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          showNotification={showNotification}
        />
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAdminProducts.map((p) => {
          const isCustom = products.some((d) => d.id === p.id);
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-4 border shadow-xs flex flex-col justify-between space-y-3 ${
                isCustom ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={p.main_image}
                    alt={p.title}
                    className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {p.category_slug}
                      </span>
                      {isCustom && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✏️ Ваш товар
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-xs mt-1 line-clamp-1">{p.title}</h4>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-black text-sm text-gray-900">{p.base_price} грн</span>
                      {p.old_price && (
                        <span className="text-[11px] text-gray-400 line-through">{p.old_price} грн</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 line-clamp-2">{p.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <span className={`text-[11px] font-bold ${p.in_stock ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {p.in_stock ? '● В наявності' : '○ Під замовлення'}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setIsAddingNewProduct(false);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Редагувати"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Видалити"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Toggles */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onToggleFlag(p.id, 'is_popular', !p.is_popular)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    p.is_popular
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-amber-50 hover:text-amber-600'
                  }`}
                  title="Переключити: Популярний товар"
                >
                  ⭐ {p.is_popular ? 'Популярне' : 'Не популярне'}
                </button>
                <button
                  onClick={() => onToggleFlag(p.id, 'is_new', !p.is_new)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    p.is_new
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                  title="Переключити: Новинка"
                >
                  🆕 {p.is_new ? 'Новинка' : 'Не новинка'}
                </button>
                <button
                  onClick={() => onToggleFlag(p.id, 'in_stock', !p.in_stock)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    p.in_stock
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}
                  title="Переключити: В наявності"
                >
                  {p.in_stock ? '✅ В наявності' : '❌ Немає'}
                </button>
              </div>

              {/* Analytics (shown if loaded) */}
              {analytics[p.id] && (
                <div className="flex gap-3 pt-1 text-[11px] text-gray-500">
                  <span>👁 {analytics[p.id].views} переглядів</span>
                  <span>🛒 {analytics[p.id].orders} замовлень</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
