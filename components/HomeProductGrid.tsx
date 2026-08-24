'use client';

import React, { useMemo } from 'react';
import { Product } from '@/types/database';
import { ProductCard } from './ProductCard';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { mergeAndDeduplicateProducts } from '@/lib/siteSettings';

interface HomeProductGridProps {
  initialProducts: Product[];
  filterType: 'popular' | 'new';
  limit?: number;
}

export function HomeProductGrid({
  initialProducts,
  filterType,
  limit = 8,
}: HomeProductGridProps) {
  const { products: dynamicProducts } = useSiteSettings();

  const displayProducts = useMemo(() => {
    // Dynamic products take priority, strictly deduplicated against initial SSR products
    const merged = mergeAndDeduplicateProducts(dynamicProducts, initialProducts);

    const filtered = merged.filter((p) => {
      if (filterType === 'popular') return p.is_popular;
      if (filterType === 'new') return p.is_new;
      return true;
    });

    return filtered.slice(0, limit);
  }, [dynamicProducts, initialProducts, filterType, limit]);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
