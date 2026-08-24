import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Star, ShieldCheck, Flame } from 'lucide-react';
import { HeroBanner } from '@/components/HeroBanner';
import { BlindCalculator } from '@/components/BlindCalculator';
import { WhyUsSection } from '@/components/WhyUsSection';
import { MaterialsSection } from '@/components/MaterialsSection';
import { PortfolioGallery } from '@/components/PortfolioGallery';
import { FaqSection } from '@/components/FaqSection';
import { ProductCard } from '@/components/ProductCard';
import { getProducts, getCategories } from '@/lib/supabase';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [popularProducts, newProducts, categories] = await Promise.all([
    getProducts({ isPopular: true, limit: 8 }),
    getProducts({ isNew: true, limit: 4 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner Slider */}
      <HeroBanner />

      {/* 2. Quick Category Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>Категорії каталогу</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Оберіть категорію для швидкого переходу</p>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Весь каталог</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group bg-gradient-to-br from-gray-50 to-blue-50/40 rounded-2xl p-4 border border-gray-200/70 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-3 bg-white">
                <Image
                  src={cat.image_url || '/placeholder.png'}
                  alt={cat.title_ua}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-blue-600 transition flex items-center justify-between">
                  <span>{cat.title_ua}</span>
                  <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                  {cat.description_ua}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Top Sales / Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              Хіти замовлень
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Топ продажів
            </h2>
          </div>
          <Link
            href="/catalog?popular=true"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Дивитися всі хіти</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 4. Interactive Blind Size & Price Calculator */}
      <BlindCalculator />

      {/* 5. New Arrivals / Premium Collection */}
      {newProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Свіжі надходження
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Новинки каталогу
              </h2>
            </div>
            <Link
              href="/catalog?new=true"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Всі новинки</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* 6. Why Us & Benefits Section */}
      <WhyUsSection />

      {/* 7. Materials & Fabric Guide */}
      <MaterialsSection />

      {/* 8. Portfolio Gallery */}
      <PortfolioGallery />

      {/* 9. FAQ Accordion */}
      <FaqSection />

      {/* 9. SEO Text Article */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          Ролети на вікна: особливості, види та переваги від виробника
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <p>
            Ролети на вікна (тканинні ролети, рулонні штори або світлозахисні жалюзі) — це сучасний, функціональний та естетичний спосіб захисту вашої оселі від палючого сонця, зайвого світла та сторонніх поглядів.
          </p>
          <p>
            У нашому інтернет-магазині ви можете купити ролети для вікон на вигідних умовах виробника з можливістю швидкої доставки у будь-який регіон України: Дніпро, Київ, Львів, Одесу, Харків, Запоріжжя та інші міста.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">Різноманіття світлопроникності</h4>
            <p className="text-xs text-gray-600">
              Від напівпрозорих тканин (альтернатива тюлю) до 100% світлонепроникних штор Блекаут, що створюють повну темряву навіть удень.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">Індивідуальний підхід</h4>
            <p className="text-xs text-gray-600">
              Виготовлення міліметр у міліметр за вашими розмірами. Гарантія 12 місяців на всі механізми та сертифіковані європейські тканини.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
