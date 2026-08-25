'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Search } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { mergeAndDeduplicateProducts } from '@/lib/siteSettings';

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
  const { lang, t, tProdTitle } = useLanguage();
  const { products: dynamicProducts, settings } = useSiteSettings();

  const allProducts = useMemo(() => {
    // Dynamic products override SSR initialProducts, strictly deduplicated by id, slug, and title
    return mergeAndDeduplicateProducts(dynamicProducts, initialProducts);
  }, [dynamicProducts, initialProducts]);

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

  // Dynamic filter options from CMS settings
  const destinationOptions = useMemo(() => {
    const list = (settings.filters?.destinations || []).filter((d) => d.enabled !== false);
    return [
      { key: 'all', label: t('Всі приміщення', 'Все помещения') },
      ...list.map((d) => ({
        key: d.key,
        label: d.labelUa,
      })),
    ];
  }, [settings.filters?.destinations, t]);

  const textureOptions = useMemo(() => {
    const list = (settings.filters?.textures || []).filter((tex) => tex.enabled !== false);
    return [
      { key: 'all', label: t('Всі варіанти', 'Все варианты') },
      ...list.map((tex) => ({
        key: tex.key,
        label: tex.labelUa,
      })),
    ];
  }, [settings.filters?.textures, t]);

  const blackoutOptions = useMemo(() => {
    const list = (settings.filters?.blackoutLevels || []).filter((b) => b.enabled !== false);
    return [
      { key: 'all', label: t('Всі рівні', 'Все уровни') },
      ...list.map((b) => ({
        key: b.key,
        label: b.labelUa,
      })),
    ];
  }, [settings.filters?.blackoutLevels, t]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

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
      list = list.filter((p) => p.texture?.includes('малюнком') || p.texture?.includes('День-Ніч') || p.texture?.includes('Текстурний'));
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
    allProducts,
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

  const displayTitle = urlWishlist
    ? t('Мої закладки (Обрані товари)', 'Мои закладки (Избранные товары)')
    : tProdTitle(categoryTitle);

  return (
    <div className="space-y-6">
      {/* Header and Breadcrumbs */}
      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {displayTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {t('Знайдено', 'Найдено')} {filteredProducts.length} {t('моделей за вашими параметрами', 'моделей по вашим параметрам')}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            aria-expanded={isMobileFilterOpen}
            aria-controls="catalog-sidebar-filters"
            className="lg:hidden flex-1 py-2 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-gray-700"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            <span>{t('Фільтри', 'Фильтры')}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <label htmlFor="sort-select" className="sr-only">{t('Сортування товарів', 'Сортировка товаров')}</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-hidden text-xs font-semibold cursor-pointer"
            >
              <option value="popular">{t('За популярністю', 'По популярности')}</option>
              <option value="price_asc">{t('Від дешевих до дорогих', 'Сначала дешевые')}</option>
              <option value="price_desc">{t('Від дорогих до дешевих', 'Сначала дорогие')}</option>
              <option value="rating">{t('За рейтингом', 'По рейтингу')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Filters (4 cols on lg, drawer on mobile) */}
        <aside
          id="catalog-sidebar-filters"
          aria-label={t('Фільтри каталогу', 'Фильтры каталога')}
          className={`lg:col-span-3 bg-white rounded-2xl border border-gray-200/80 p-5 space-y-6 shadow-2xs ${
            isMobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>{t('Фільтри каталогу', 'Фильтры каталога')}</span>
            </h3>
            <button
              onClick={clearFilters}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
            >
              {t('Скинути', 'Сбросить')}
            </button>
          </div>

          {/* Quick Search */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">{t('Пошук за назвою або артикулом', 'Поиск по названию или артикулу')}</label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('Наприклад: Len, 7439...', 'Например: Len, 7439...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs focus:outline-hidden focus:border-blue-600"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Destination / Room */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t('Призначення / Кімната', 'Назначение / Комната')}</label>
            <div className="space-y-1">
              {destinationOptions.map((dest) => (
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
            <label className="block text-xs font-bold text-gray-700 mb-2">{t('Фактура полотна', 'Фактура полотна')}</label>
            <div className="space-y-1">
              {textureOptions.map((tex) => (
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
            <label className="block text-xs font-bold text-gray-700 mb-2">{t('Рівень затемнення', 'Уровень затемнения')}</label>
            <div className="space-y-1">
              {blackoutOptions.map((b) => (
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
              <h3 className="font-bold text-lg text-gray-900">{t('За обраними фільтрами нічого не знайдено', 'По выбранным фильтрам ничего не найдено')}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {t('Спробуйте змінити або скинути параметри фільтрації, щоб побачити більше товарів.', 'Попробуйте изменить или сбросить параметры фильтрации, чтобы увидеть больше товаров.')}
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
              >
                {t('Скинути фільтри', 'Сбросить фильтры')}
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
