'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Check, Zap } from 'lucide-react';
import { Product } from '@/types/database';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { OneClickModal } from './OneClickModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Installment calculations (PrivatBank 2 mo, Monobank 3 mo)
  const privat2mo = Math.round(product.base_price / 2);
  const mono3mo = Math.round(product.base_price / 3);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      sku: product.sku,
      image: product.main_image,
      width: product.base_width || 50,
      height: product.base_height || 150,
      color: product.available_colors?.[0] || {
        id: 'default',
        name: product.color_name || 'Стандарт',
        code: product.sku,
        hex: product.color_hex || '#888',
      },
      controlSide: 'right',
      fixationType: 'with_line',
      unitPrice: product.base_price,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const discountPercent = product.old_price
    ? Math.round(((product.old_price - product.base_price) / product.old_price) * 100)
    : null;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-gray-100/90 shadow-xs hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden relative transform hover:-translate-y-1">
        {/* Badges / Stickers top left */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
          {product.is_popular && (
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-white" />
              Популярний
            </span>
          )}
          {product.is_offer_of_day && (
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              Пропозиція дня
            </span>
          )}
          {product.is_new && (
            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
              Новинка
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Action icons top right (Wishlist) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 shadow-md scale-110'
              : 'bg-white/80 text-gray-400 hover:text-rose-500 hover:bg-white hover:scale-110'
          }`}
          title="В обране"
          aria-label="В обране"
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Image link */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-4/5 w-full bg-gray-50 overflow-hidden">
          <Image
            src={product.main_image || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
          />

          {/* Installment Stickers (Privat / Mono) */}
          <div className="absolute bottom-2 left-2 flex gap-1 z-10 pointer-events-none">
            <div
              className="bg-[#6B9F29] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs"
              title={`Оплата частинами (ПриватБанк) від ${privat2mo} грн/міс`}
            >
              ПП {privat2mo}₴
            </div>
            <div
              className="bg-[#E74C3C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs"
              title={`Покупка частинами (МоноБанк) від ${mono3mo} грн/міс`}
            >
              МБ {mono3mo}₴
            </div>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category tag */}
            <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
              {product.category_slug === 'roleti'
                ? 'Ролети на вікна'
                : product.category_slug === 'shtori'
                ? 'Рулонні штори'
                : product.category_slug === 'zhaluzi'
                ? 'Жалюзі'
                : 'Закрита система'}
            </div>

            {/* Title */}
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition leading-snug">
                {product.title}
              </h3>
            </Link>

            {/* Rating and reviews count */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-gray-500 font-medium">
                ({product.reviews_count || 12})
              </span>
            </div>

            {/* Available colors preview */}
            {product.available_colors && product.available_colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5">
                {product.available_colors.slice(0, 5).map((col) => (
                  <span
                    key={col.id}
                    title={col.name}
                    className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-2xs inline-block transition-transform hover:scale-125"
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
                {product.available_colors.length > 5 && (
                  <span className="text-[10px] text-gray-400 font-bold">
                    +{product.available_colors.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price and Action Buttons */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
            <div>
              <div className="text-[10px] text-gray-400 font-medium">від</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-black text-gray-950">
                  {product.base_price.toLocaleString('uk-UA')} грн
                </span>
                {product.old_price && (
                  <span className="text-xs text-gray-400 line-through">
                    {product.old_price} грн
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setIsOneClickOpen(true)}
                className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 rounded-lg text-xs font-semibold transition"
                title="Швидке замовлення в 1 клік"
              >
                1 клік
              </button>
              <button
                onClick={handleQuickAdd}
                className={`p-2 rounded-lg transition-all duration-300 shadow-xs active:scale-90 flex items-center justify-center ${
                  isAdded
                    ? 'bg-emerald-600 text-white scale-105'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={isAdded ? 'Додано!' : 'Додати в кошик'}
                aria-label="Додати в кошик"
              >
                {isAdded ? (
                  <Check className="w-4 h-4 animate-bounce" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Order Modal */}
      <OneClickModal
        product={product}
        width={product.base_width || 50}
        height={product.base_height || 150}
        calculatedPrice={product.base_price}
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
      />
    </>
  );
}
