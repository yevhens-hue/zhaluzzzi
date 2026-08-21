import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { CatalogView } from '@/components/CatalogView';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Рулонні Штори (День-Ніч, Блекаут, Римські) — купити у м. Дніпро',
  description:
    'Штори рулонні, римські, день-ніч та блекаут за індивідуальними розмірами у м. Дніпро. Безкоштовний виїзд майстра на замір з каталогами зразків.',
  keywords: [
    'рулонні штори дніпро',
    'штори день ніч',
    'блекаут штори',
    'римські штори дніпро',
    'штори від виробника',
  ],
  openGraph: {
    title: 'Рулонні Штори День-Ніч та Блекаут — Дніпро',
    description:
      'Виробництво рулонних штор під індивідуальний розмір у Дніпрі. Гарантія якості, широкий асортимент тканин.',
    url: `${SITE_URL}/shtori`,
  },
  alternates: {
    canonical: `${SITE_URL}/shtori`,
  },
};

export default async function ShtoriPage() {
  const products = await getProducts({ categorySlug: 'shtori' });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: 'Штори', url: '/shtori' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Завантаження...</div>}>
        <CatalogView
          initialProducts={products}
          categorySlug="shtori"
          categoryTitle="Штори (рулонні, римські, блекаут, плісе)"
        />
      </Suspense>
    </>
  );
}
