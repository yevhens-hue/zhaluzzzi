import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { CatalogView } from '@/components/CatalogView';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Каталог жалюзі та тканинних ролетів від виробника — м. Дніпро',
  description:
    'Великий каталог жалюзі, тканинних ролетів, рулонних штор День-Ніч та систем Блекаут у м. Дніпро. Ціни від виробника, понад 1000 зразків тканин, доставка по всій Україні.',
  keywords: [
    'каталог жалюзі дніпро',
    'каталог ролет',
    'рулонні штори каталог ціни',
    'жалюзі від виробника україна',
  ],
  openGraph: {
    title: 'Повний каталог жалюзі та ролетів — Дніпро',
    description:
      'Обирайте жалюзі та ролети від виробника. Індивідуальний замір, якісна європейська фурнітура.',
    url: `${SITE_URL}/catalog`,
  },
  alternates: {
    canonical: `${SITE_URL}/catalog`,
  },
};

export default async function CatalogPage() {
  const products = await getProducts();

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Завантаження каталогу...</div>}>
        <CatalogView
          initialProducts={products}
          categoryTitle="Повний каталог сонцезахисних систем"
        />
      </Suspense>
    </>
  );
}
