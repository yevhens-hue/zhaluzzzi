'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

interface CatalogViewProps {
  initialProducts: Product[];
  categoryTitle?: string;
  categorySlug?: string;
}

export function CatalogView({
  initialProducts,
  categoryTitle = 'Каталог товарів',
  categorySlug,
}: CatalogViewProps) {
  const searchParams = useSearchParams();
  const { wishlistIds } = useWishlist();

  // URL query params
  const urlSearch = searchParams.get('search') || '';
  const urlSubcategory = searchParams.get('sub') || '';
  const urlDest = searchParams.get('dest') || '';
  const urlPopular = searchParams.get('popular') === 'true';
  const urlNew = searchParams.get('new') === 'true';
  const urlWishlist = searchParams.get('wishlist') === 'true';

  // State
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(urlSubcategory);
  const [selectedDestination, setSelectedDestination] = useState<string>(urlDest);
  const [selectedTexture, setSelectedTexture] = useState<string>('all');
  const [selectedBlackout, setSelectedBlackout] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Destinations options
  const destinations = [
    { key: 'all', label: 'Всі приміщення' },
    { key: 'na-kuhnju', label: 'На кухню' },
    { key: 'v-spalnju', label: 'У спальню' },
    { key: 'v-gostinnuju', label: 'У вітальню' },
    { key: 'na-balkon', label: 'На балкон' },
    { key: 'v-ofis', label: 'В офіс' },
    { key: 'v-detskuju', label: 'У дитячу' },
    { key: 'na-mansardu', label: 'На мансарду' },
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Wishlist view
    if (urlWishlist) {
      list = list.filter((p) => wishlistIds.includes(p.id));
    }

    // Category filter
    if (categorySlug && categorySlug !== 'all') {
      list = list.filter((p) => p.category_slug === categorySlug);
    }

    // Subcategory
    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategory_slug === selectedSubcategory);
    }

    // Destination / Room
    if (selectedDestination && selectedDestination !== 'all') {
      list = list.filter((p) => p.destinations?.includes(selectedDestination));
    }

    // Texture
    if (selectedTexture === 'plain') {
      list = list.filter((p) => p.texture?.includes('Без малюнка') || p.texture?.includes('Однотонний') || p.texture?.includes('Гладкий'));
    } else if (selectedTexture === 'pattern') {
      list = list.filter((p) => p.texture?.includes('малюнком') || p.texture?.includes('День-Ніч') || p.texture?.includes('Дерев'));
    }

    // Blackout
    if (selectedBlackout === '100') {
      list = list.filter((p) => p.blackout_percent === 100);
    } else if (selectedBlackout === 'dimout') {
      list = list.filter((p) => (p.blackout_percent || 0) >= 60 && (p.blackout_percent || 0) < 100);
    } else if (selectedBlackout === 'light') {
      list = list.filter((p) => (p.blackout_percent || 0) < 60);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Popular / New
    if (urlPopular) {
      list = list.filter((p) => p.is_popular);
    }
    if (urlNew) {
      list = list.filter((p) => p.is_new);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'price_asc') return a.base_price - b.base_price;
      if (sortBy === 'price_desc') return b.base_price - a.base_price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
    });

    return list;
  }, [
    initialProducts,
    categorySlug,
    selectedSubcategory,
    selectedDestination,
    selectedTexture,
    selectedBlackout,
    searchQuery,
    sortBy,
    urlPopular,
    urlNew,
    urlWishlist,
    wishlistIds,
  ]);

  const clearFilters = () => {
    setSelectedSubcategory('');
    setSelectedDestination('all');
    setSelectedTexture('all');
    setSelectedBlackout('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {urlWishlist ? 'Мої закладки (Обрані товари)' : categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Знайдено {filteredProducts.length} моделей за вашими параметрами
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex-1 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-gray-700"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Фільтри</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-xs font-semibold cursor-pointer"
            >
              <option value="popular">За популярністю</option>
              <option value="price_asc">Від дешевих до дорогих</option>
              <option value="price_desc">Від дорогих до дешевих</option>
              <option value="rating">За рейтингом</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters (4 cols on lg, drawer on mobile) */}
        <aside
          className={`lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-5 space-y-6 shadow-2xs ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Фільтри каталогу</span>
            </h3>
            <button
              onClick={clearFilters}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              Скинути
            </button>
          </div>

          {/* Quick Search */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Пошук за назвою або артикулом</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Наприклад: Len, 7439..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:outline-hidden focus:border-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Destination / Room */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Призначення / Кімната</label>
            <div className="space-y-1">
              {destinations.map((dest) => (
                <button
                  key={dest.key}
                  onClick={() => setSelectedDestination(dest.key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedDestination === dest.key
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {dest.label}
                </button>
              ))}
            </div>
          </div>

          {/* Texture */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Фактура полотна</label>
            <div className="space-y-1">
              {[
                { key: 'all', label: 'Всі варіанти' },
                { key: 'plain', label: 'Однотонні / Без малюнка' },
                { key: 'pattern', label: 'З малюнком / Текстурні' },
              ].map((tex) => (
                <button
                  key={tex.key}
                  onClick={() => setSelectedTexture(tex.key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedTexture === tex.key
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blackout level */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Рівень затемнення</label>
            <div className="space-y-1">
              {[
                { key: 'all', label: 'Всі рівні' },
                { key: '100', label: '100% Блекаут (Повна темрява)' },
                { key: 'dimout', label: '60-80% Напівзатемнення' },
                { key: 'light', label: '40-50% Розсіювання світла' },
              ].map((b) => (
                <button
                  key={b.key}
                  onClick={() => setSelectedBlackout(b.key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedBlackout === b.key
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid (9 cols on lg) */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-2xs space-y-3">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">За обраними фільтрами нічого не знайдено</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Спробуйте змінити або скинути параметри фільтрації, щоб побачити більше товарів.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
