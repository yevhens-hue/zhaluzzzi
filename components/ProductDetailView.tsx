'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductColor, Review } from '@/types/database';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { OneClickModal } from './OneClickModal';
import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Send,
  Sparkles,
  Phone,
} from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailView({
  product: initialProduct,
  reviews: initialReviews,
  relatedProducts,
}: ProductDetailViewProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, tProdTitle, tColorName, tCharKey, tCharVal } = useLanguage();
  const { products: dynamicProducts, settings } = useSiteSettings();

  const product = useMemo(() => {
    const found = dynamicProducts?.find(
      (p) => p.id === initialProduct.id || p.slug === initialProduct.slug || p.sku === initialProduct.sku
    );
    return found || initialProduct;
  }, [dynamicProducts, initialProduct]);

  // Track product view — fire-and-forget, non-blocking
  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id }),
    }).catch(() => null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Deduplicate available colors
  const uniqueColors = useMemo(() => {
    if (!product.available_colors) return [];
    const seen = new Set();
    return product.available_colors.filter((col) => {
      const key = `${col.name.trim()}_${col.code || col.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [product.available_colors]);

  // Gallery images (filtering out invalid/test base64 uploads to guarantee clean product photos)
  const allImages = useMemo(() => {
    const rawList = product.images && product.images.length > 0
      ? product.images
      : [product.main_image];

    const valid = rawList.filter(
      (img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))
    );
    return valid.length > 0
      ? valid
      : [product.main_image || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg'];
  }, [product]);

  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    uniqueColors[0] || {
      id: 'default',
      name: product.color_name || 'Стандарт',
      code: product.sku,
      hex: product.color_hex || '#888',
    }
  );

  // Configurator state
  const [width, setWidth] = useState<number>(product.base_width || 60);
  const [height, setHeight] = useState<number>(product.base_height || 140);
  const [controlSide, setControlSide] = useState<'left' | 'right'>('right');
  const [fixationType, setFixationType] = useState<'with_line' | 'without_line'>('with_line');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'main' | 'specs' | 'desc' | 'reviews'>('main');

  // Modals & review
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Price Calculation formula based on area
  const unitPrice = useMemo(() => {
    const area = Math.max(0.5, (width * height) / 10000);
    let baseCalculated = Math.round(product.price_per_sqm * area);
    if (fixationType === 'with_line') {
      baseCalculated += 60;
    }
    return Math.max(product.base_price, baseCalculated);
  }, [width, height, fixationType, product]);

  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      sku: product.sku,
      image: activeImage,
      width,
      height,
      color: selectedColor,
      controlSide,
      fixationType,
      unitPrice,
      quantity,
    });
  };

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    // Use API route with service_role to bypass RLS restrictions
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: product.id,
        author_name: reviewName,
        city: reviewCity || null,
        rating: reviewRating,
        comment: reviewComment,
      }),
    }).catch(() => null);

    const newReviewObj: Review = {
      id: Date.now().toString(),
      product_id: product.id,
      author_name: reviewName,
      city: reviewCity,
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString(),
    };

    setReviewsList((prev) => [newReviewObj, ...prev]);
    setReviewSubmitted(true);
    setIsSubmittingReview(false);
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600">{t('Головна', 'Главная')}</Link>
        <span>/</span>
        <Link href={`/${product.category_slug}`} className="hover:text-blue-600 capitalize">
          {product.category_slug}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-1">{tProdTitle(product.title)}</span>
      </nav>

      {/* Main Product Layout (Gallery + Configurator) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/5 w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
              {product.is_popular && (
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {t('Популярний', 'Популярный')}
                </span>
              )}
              {product.is_offer_of_day && (
                <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {t('Пропозиція дня', 'Предложение дня')}
                </span>
              )}
            </div>

            <Image
              src={activeImage}
              alt={tProdTitle(product.title)}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activeImage === img ? 'border-blue-600 scale-95' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${tProdTitle(product.title)} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee / Delivery info pills */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center gap-2.5 text-xs text-gray-700">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold text-gray-900">{t('Доставка Нова Пошта', 'Доставка Новая Почта')}</div>
                <div className="text-[11px] text-gray-500">{t('2-4 дні по Україні', '2-4 дня по Украине')}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center gap-2.5 text-xs text-gray-700">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-gray-900">{t('Гарантія 12 міс.', 'Гарантия 12 мес.')}</div>
                <div className="text-[11px] text-gray-500">{t('Офіційна від заводу', 'Официальная от завода')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Configurator & Purchase Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
          {/* Header info */}
          <div>
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {tProdTitle(product.title)}
              </h1>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full border transition ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-gray-50'
                }`}
                title={t('Додати в обране', 'Добавить в избранное')}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                {t('В наявності', 'В наличии')}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{t('Артикул', 'Артикул')}: <strong className="text-gray-700">{selectedColor.code || product.sku}</strong></span>
              <span className="text-gray-400">|</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-gray-800">{product.rating}</span>
                <span className="text-gray-400">({reviewsList.length} {t('відгуків', 'отзывов')})</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 1. Dimension Inputs (Width x Height) */}
          <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                1. {t('Вкажіть ваші розміри (см)', 'Укажите ваши размеры (см)')}
              </label>
              <a href="/zamir" target="_blank" className="text-[11px] font-bold text-blue-600 hover:underline">
                📐 {t('Інструкція заміру', 'Инструкция замера')}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Width */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Ширина', 'Ширина')} ({t('від', 'от')} {product.min_width} {t('до', 'до')} {product.max_width} {t('см', 'см')}):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={product.min_width || 20}
                    max={product.max_width || 240}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                    {t('см', 'см')}
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Висота', 'Высота')} ({t('від', 'от')} {product.min_height} {t('до', 'до')} {product.max_height} {t('см', 'см')}):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={product.min_height || 30}
                    max={product.max_height || 260}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-hidden focus:border-blue-600"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                    {t('см', 'см')}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-500">
              * {t('Заводське виготовлення здійснюється точно за вашими розмірами з точністю до міліметра.', 'Заводское изготовление осуществляется точно по вашим размерам с точностью до миллиметра.')}
            </div>
          </div>

          {/* 2. Color / Fabric Selector */}
          {uniqueColors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700 flex items-center gap-1">
                  <span>2. {t('Оберіть колір тканини:', 'Выберите цвет ткани:')}</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </label>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {tColorName(selectedColor.name)} ({selectedColor.code})
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {uniqueColors.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/90 shadow-xs ring-2 ring-blue-600/30 scale-102 font-bold'
                          : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50 bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs inline-block shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-xs text-gray-800">{tColorName(color.name)}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Options (Control side, fixation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('Сторона управління:', 'Сторона управления:')}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setControlSide('left')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    controlSide === 'left'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('Ліва', 'Левая')}
                </button>
                <button
                  onClick={() => setControlSide('right')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    controlSide === 'right'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('Права', 'Правая')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t('Система фіксації:', 'Система фиксации:')}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFixationType('with_line')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    fixationType === 'with_line'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('На лісці (+60 грн)', 'С леской (+60 грн)')}
                </button>
                <button
                  onClick={() => setFixationType('without_line')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition ${
                    fixationType === 'without_line'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t('Без ліски', 'Без лески')}
                </button>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* 4. Price and Action Buttons */}
          <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 font-medium">{t('Розрахункова ціна за розмір:', 'Расчетная цена за размер:')}</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-950">
                  {totalPrice.toLocaleString('uk-UA')} {t('грн', 'грн')}
                </div>
              </div>

              {/* Quantity input */}
              <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3.5 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t('Додати у кошик', 'Добавить в корзину')}</span>
              </button>

              <button
                onClick={() => setIsOneClickOpen(true)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95"
              >
                {t('Купити в 1 клік', 'Купить в 1 клик')}
              </button>
            </div>

            {/* Viber Quick Order */}
            {(() => {
              const rawPhone = settings?.contacts?.viberNumber || settings?.contacts?.phone1 || '+380939128531';
              const viberPhone = rawPhone.replace(/[^0-9+]/g, '');
              const msg = encodeURIComponent(
                `Привіт! Хочу замовити:\n📦 ${product.title}\n💰 ${totalPrice.toLocaleString('uk-UA')} грн\n📐 ${width}×${height} см`
              );
              // viber:// deep link — works on mobile (opens Viber app)
              // On desktop falls back gracefully to nothing, so we show a tel: link instead
              const viberUrl = `viber://chat?number=${encodeURIComponent(viberPhone)}&text=${msg}`;
              return (
                <a
                  href={viberUrl}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#7360F2] hover:bg-[#5a4bd1] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition active:scale-95"
                >
                  <Phone className="w-5 h-5" />
                  {t('Замовити у Viber', 'Заказать в Viber')}
                </a>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Tabs: Specs, Description, Reviews */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex border-b border-gray-200 gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('main')}
            className={`pb-3 transition relative ${
              activeTab === 'main'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('Характеристики', 'Характеристики')}
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition relative ${
              activeTab === 'desc'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('Опис моделі', 'Описание модели')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition relative ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('Відгуки', 'Отзывы')} ({reviewsList.length})
          </button>
        </div>

        {/* Tab 1: Characteristics */}
        {activeTab === 'main' && (
          <div className="py-6 max-w-2xl">
            <table className="w-full text-xs sm:text-sm">
              <tbody className="divide-y divide-gray-100">
                {product.characteristics &&
                  Object.entries(product.characteristics).map(([key, value]) => (
                    <tr key={key} className="py-2.5 flex justify-between">
                      <td className="text-gray-500 font-medium">{tCharKey(key)}</td>
                      <td className="text-gray-900 font-bold text-right">{tCharVal(value || '')}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Description */}
        {activeTab === 'desc' && (
          <div className="py-6 text-xs sm:text-sm text-gray-700 leading-relaxed space-y-4 max-w-3xl whitespace-pre-line">
            {tProdTitle(product.description)}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-8 max-w-3xl">
            {/* Review form */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 space-y-3">
              <h3 className="font-bold text-sm text-gray-900">{t('Залишити відгук про товар', 'Оставить отзыв о товаре')}</h3>

              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
                  ✓ {t('Дякуємо! Ваш відгук опубліковано.', 'Спасибо! Ваш отзыв опубликован.')}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">{t("Ваше ім'я *", 'Ваше имя *')}</label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">{t('Місто', 'Город')}</label>
                      <input
                        type="text"
                        value={reviewCity}
                        onChange={(e) => setReviewCity(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Оцінка', 'Оценка')}</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => setReviewRating(st)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              st <= reviewRating ? 'fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('Ваш відгук *', 'Ваш отзыв *')}</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={t('Поділіться вашими враженнями про якість, монтаж та роботу виробу...', 'Поделитесь вашими впечатлениями о качестве, монтаже и работе изделия...')}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('Надіслати відгук', 'Отправить отзыв')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-2xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xs sm:text-sm text-gray-900">
                      {rev.author_name} {rev.city && <span className="text-gray-400 font-normal">({rev.city})</span>}
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {t('Схожі моделі та рекомендації', 'Похожие модели и рекомендации')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((item) => (
              <a key={item.id} href={`/product/${item.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-xs hover:shadow-md transition">
                  <div className="relative aspect-4/5 w-full bg-gray-50 rounded-xl overflow-hidden mb-2">
                    <Image
                      src={item.main_image}
                      alt={tProdTitle(item.title)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{tProdTitle(item.title)}</h4>
                  <div className="text-xs font-extrabold text-blue-900 mt-1">{item.base_price} {t('грн', 'грн')}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 1-Click Modal */}
      <OneClickModal
        product={product}
        selectedColor={selectedColor}
        width={width}
        height={height}
        calculatedPrice={totalPrice}
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
      />
    </div>
  );
}
