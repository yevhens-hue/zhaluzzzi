'use client';

import React, { useState, useMemo, useTransition, useCallback } from 'react';
import { Calculator, Check, ArrowRight, ShieldCheck, Sparkles, Sliders, CheckCircle2, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { OneClickModal } from './OneClickModal';
import { Product } from '@/types/database';

import { useLanguage } from '@/context/LanguageContext';

export function BlindCalculator() {
  const { addItem } = useCart();
  const { settings, products } = useSiteSettings();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<'roleti' | 'shtori' | 'zhaluzi' | 'zakryta-sistema'>('roleti');
  const [width, setWidth] = useState<number>(60);
  const [height, setHeight] = useState<number>(140);
  const [fabricTier, setFabricTier] = useState<'standard' | 'premium' | 'blackout'>('standard');
  const [controlSide, setControlSide] = useState<'left' | 'right'>('right');
  const [fixationType, setFixationType] = useState<'with_line' | 'without_line'>('with_line');
  const [isMotorized, setIsMotorized] = useState(false);
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const [, startTransition] = useTransition();

  // Quick size presets
  const sizePresets = [
    { label: t('Стулка', 'Створка'), w: 50, h: 130 },
    { label: t('Стандарт', 'Стандарт'), w: 60, h: 140 },
    { label: t('Широке', 'Широкое'), w: 75, h: 150 },
    { label: t('Двостулкове', 'Двустворчатое'), w: 120, h: 140 },
    { label: t('Балконні двері', 'Балконная дверь'), w: 65, h: 200 },
  ];

  const handleWidthChange = useCallback((newW: number) => {
    startTransition(() => {
      setWidth(newW);
    });
  }, []);

  const handleHeightChange = useCallback((newH: number) => {
    startTransition(() => {
      setHeight(newH);
    });
  }, []);

  // Find demo product for this category
  const targetProduct: Product = useMemo(() => {
    const found = products.find((p) => p.category_slug === selectedCategory) || products[0];
    if (found) return found;
    return {
      id: 'calc-default-product',
      title: 'Тканинні ролети за розрахунком',
      slug: 'roleti-calc',
      sku: 'ZR-CALC',
      category_slug: selectedCategory,
      subcategory_slug: 'classic',
      main_image: '/images/products/roleti-mini.jpg',
      images: ['/images/products/roleti-mini.jpg'],
      base_price: 480,
      price_per_sqm: 480,
      price_unit: 'грн/м²',
      min_width: 20,
      max_width: 240,
      min_height: 30,
      max_height: 260,
      base_width: 60,
      base_height: 140,
      in_stock: true,
      rating: 5.0,
      reviews_count: 24,
      is_popular: true,
      description: 'Розрахунковий виріб за індивідуальними габаритами.',
      characteristics: {
        warranty: '12 місяців',
        manufacturer: 'Польща / Україна',
      },
      available_colors: [
        { id: 'c-calc', name: 'Обраний колір', code: 'CALC', hex: '#6A4E38' }
      ],
      created_at: new Date().toISOString(),
    };
  }, [products, selectedCategory]);

  // Price Calculation Logic
  const calculatedPrice = useMemo(() => {
    // Area in square meters (minimum chargeable area is 0.5 m²)
    const area = Math.max(0.5, (width * height) / 10000);
    const calc = settings.calculator;

    let baseRatePerSqm = calc.roletiBaseRate || 480;
    if (selectedCategory === 'shtori') baseRatePerSqm = calc.shtoriBaseRate || 520;
    if (selectedCategory === 'zhaluzi') baseRatePerSqm = calc.zhaluziBaseRate || 420;
    if (selectedCategory === 'zakryta-sistema') baseRatePerSqm = calc.zakrytaBaseRate || 780;

    // Fabric tier multiplier
    let tierMultiplier = 1.0;
    if (fabricTier === 'premium') tierMultiplier = calc.premiumMultiplier || 1.35;
    if (fabricTier === 'blackout') tierMultiplier = calc.blackoutMultiplier || 1.6;

    // Options additions
    let extraCost = 0;
    if (fixationType === 'with_line') extraCost += calc.lineFixationCost || 60;
    if (isMotorized) extraCost += calc.motorizationCost || 1450; // battery smart motor

    const total = Math.round(area * baseRatePerSqm * tierMultiplier + extraCost);
    return Math.max(calc.minOrderPrice || 229, total);
  }, [settings.calculator, selectedCategory, width, height, fabricTier, fixationType, isMotorized]);

  const handleAddToCart = () => {
    addItem({
      productId: targetProduct.id,
      slug: targetProduct.slug,
      title: `${targetProduct.title} (Розмір ${width}×${height} см)`,
      sku: targetProduct.sku,
      image: targetProduct.main_image,
      width,
      height,
      color: targetProduct.available_colors?.[0] || {
        id: 'c-calc',
        name: 'Обраний за розрахунком',
        code: 'CALC',
        hex: '#6A4E38',
      },
      controlSide,
      fixationType,
      unitPrice: calculatedPrice,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Color / Texture gradient depending on category and tier
  const fabricColorStyle = useMemo(() => {
    if (selectedCategory === 'zhaluzi') {
      return 'bg-gradient-to-b from-amber-100 via-amber-200 to-amber-100 border-amber-300';
    }
    if (selectedCategory === 'zakryta-sistema') {
      return 'bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-slate-300';
    }
    if (fabricTier === 'blackout') {
      return 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-slate-700';
    }
    if (fabricTier === 'premium') {
      return 'bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-amber-600';
    }
    return 'bg-gradient-to-b from-blue-100 via-blue-50 to-blue-100 border-blue-200';
  }, [selectedCategory, fabricTier]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12 border border-blue-900/50">
      {/* Background ambient luminous shapes */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30 backdrop-blur-md">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Інтерактивний 3D-онлайн калькулятор</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Розрахуйте точну вартість під ваші розміри
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Вкажіть габарити вікна в сантиметрах, оберіть категорію тканини та отримайте миттєву ціну виготовлення від майстра.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Controls Column (7 cols) */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-6 shadow-xl">
            {/* 1. Category Switcher */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-blue-200 mb-2.5">
                1. Оберіть тип виробу
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'roleti', label: 'Ролети' },
                  { key: 'shtori', label: 'Штори День-Ніч' },
                  { key: 'zhaluzi', label: 'Жалюзі' },
                  { key: 'zakryta-sistema', label: 'Закрита Uni' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedCategory(tab.key as any)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 ${
                      selectedCategory === tab.key
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border border-blue-300'
                        : 'bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white border border-white/5'
                    }`}
                  >
                    {selectedCategory === tab.key && <Check className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Size Presets */}
            <div>
              <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                Популярні типові розміри:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sizePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setWidth(preset.w);
                      setHeight(preset.h);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                      width === preset.w && height === preset.h
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-xs'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {preset.label} ({preset.w}×{preset.h})
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Dimensions Sliders & Direct Inputs */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-blue-200 mb-2.5">
                2. Вкажіть точні розміри (см)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Width */}
                <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-300 font-medium">Ширина:</span>
                    <span className="text-xl font-black text-amber-400">{width} см</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={240}
                    step={1}
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>20 см</span>
                    <span>240 см</span>
                  </div>
                </div>

                {/* Height */}
                <div className="bg-black/30 rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-300 font-medium">Висота:</span>
                    <span className="text-xl font-black text-amber-400">{height} см</span>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={260}
                    step={1}
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                    <span>30 см</span>
                    <span>260 см</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Fabric / Density Tier */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-blue-200 mb-2.5">
                3. Категорія тканини / Рівень затемнення
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'standard', title: 'Стандарт', desc: 'Затемнення 40-50%' },
                  { key: 'premium', title: 'Преміум', desc: 'Фактурна 60-70%' },
                  { key: 'blackout', title: 'Блекаут', desc: '100% захист від сонця' },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    onClick={() => setFabricTier(tier.key as any)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-200 ${
                      fabricTier === tier.key
                        ? 'bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-amber-400 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{tier.title}</span>
                      {fabricTier === tier.key && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                    <div className="text-[10px] text-gray-300 mt-0.5">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Options & Mechanism */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Control side */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                  Сторона ланцюжка:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setControlSide('left')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      controlSide === 'left'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    Ліва
                  </button>
                  <button
                    onClick={() => setControlSide('right')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      controlSide === 'right'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    Права
                  </button>
                </div>
              </div>

              {/* Fixation line */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 mb-1.5">
                  Фіксація стулки:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFixationType('with_line')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      fixationType === 'with_line'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    На лісці (+60 грн)
                  </button>
                  <button
                    onClick={() => setFixationType('without_line')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition ${
                      fixationType === 'without_line'
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xs'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    Вільний вис
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & Visual Live Window Preview (5 cols) */}
          <div className="lg:col-span-5 bg-white text-gray-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Візуалізація та розрахунок
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                  Ціна від виробника
                </span>
              </div>

              {/* Live Visual Window Schematic */}
              <div className="my-4 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[170px]">
                <div className="absolute top-2 left-2 text-[10px] font-mono text-gray-400">
                  Схема: {width} × {height} см
                </div>
                
                {/* Window Profile Box */}
                <div className="w-36 h-32 border-4 border-slate-700 bg-slate-800/80 rounded-lg relative flex flex-col items-center justify-start p-1 shadow-inner">
                  {/* Top Roller Cassette */}
                  <div className="w-full h-3.5 bg-gradient-to-r from-gray-300 via-white to-gray-400 rounded-sm shadow-md mb-1 relative flex items-center justify-between px-1">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                  </div>

                  {/* Fabric Sheet */}
                  <div
                    className={`w-[90%] h-20 rounded-b-xs transition-all duration-500 border ${fabricColorStyle} relative shadow-sm`}
                  >
                    {/* Day-Night Stripes or Venetian Slats */}
                    {selectedCategory === 'shtori' && (
                      <div className="w-full h-full flex flex-col justify-between opacity-35 py-1">
                        <div className="h-1 bg-black/40 w-full" />
                        <div className="h-1 bg-black/40 w-full" />
                        <div className="h-1 bg-black/40 w-full" />
                        <div className="h-1 bg-black/40 w-full" />
                      </div>
                    )}
                    {selectedCategory === 'zhaluzi' && (
                      <div className="w-full h-full flex flex-col justify-evenly opacity-40">
                        <div className="h-0.5 bg-amber-900 w-full" />
                        <div className="h-0.5 bg-amber-900 w-full" />
                        <div className="h-0.5 bg-amber-900 w-full" />
                        <div className="h-0.5 bg-amber-900 w-full" />
                        <div className="h-0.5 bg-amber-900 w-full" />
                      </div>
                    )}

                    {/* Bottom weight bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-400 border-t border-gray-500" />
                  </div>

                  {/* Side Guide Lines (if with_line) */}
                  {fixationType === 'with_line' && (
                    <>
                      <div className="absolute top-4 left-1.5 bottom-1 w-[1px] bg-cyan-400/70" />
                      <div className="absolute top-4 right-1.5 bottom-1 w-[1px] bg-cyan-400/70" />
                    </>
                  )}

                  {/* Side Chain */}
                  <div
                    className={`absolute top-4 ${
                      controlSide === 'left' ? 'left-0.5' : 'right-0.5'
                    } w-1 h-14 border-r-2 border-dotted border-amber-300 opacity-80`}
                  />
                </div>

                <div className="text-[10px] text-gray-400 mt-2 font-medium">
                  {fabricTier === 'blackout' ? '🌙 100% Блекаут затемнення' : fabricTier === 'premium' ? '✨ Преміальна фактура' : '☀️ М\'яке розсіювання світла'}
                </div>
              </div>

              {/* Parameters Breakdown */}
              <div className="py-2 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Тип виробу:</span>
                  <strong className="text-gray-900">
                    {selectedCategory === 'roleti'
                      ? 'Тканинні ролети'
                      : selectedCategory === 'shtori'
                      ? 'Штори День-Ніч'
                      : selectedCategory === 'zhaluzi'
                      ? 'Жалюзі'
                      : 'Закрита система Uni'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Розміри / Площа:</span>
                  <strong className="text-gray-900">
                    {width} × {height} см ({((width * height) / 10000).toFixed(2)} м²)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Тканина:</span>
                  <strong className="text-gray-900 capitalize">{fabricTier}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Управління / Фіксація:</span>
                  <strong className="text-gray-900">
                    {controlSide === 'left' ? 'Ліве' : 'Праве'} / {fixationType === 'with_line' ? 'На лісці' : 'Вільний вис'}
                  </strong>
                </div>
              </div>

              {/* Benefits list */}
              <div className="bg-blue-50/70 rounded-2xl p-3 space-y-1 text-[11px] text-blue-900 mt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Офіційна гарантія виробника 12 місяців</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Польська фурнітура Besta в комплекті</span>
                </div>
              </div>
            </div>

            {/* Price Box and CTA Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-gray-500 font-bold">Вартість за розміром:</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-950">
                  {calculatedPrice.toLocaleString('uk-UA')} грн
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-bounce" />
                      <span>Додано в кошик!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>В кошик</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsOneClickOpen(true)}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>Купити в 1 клік</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* One click buy modal */}
      <OneClickModal
        product={targetProduct}
        width={width}
        height={height}
        calculatedPrice={calculatedPrice}
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
      />
    </div>
  );
}
