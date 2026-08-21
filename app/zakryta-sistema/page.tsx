import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { CatalogView } from '@/components/CatalogView';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Закрита система ролет (Uni) з коробом та направляючими — м. Дніпро',
  description:
    'Купити тканинні ролети закритого типу Uni з алюмінієвим коробом та П-подібними або плоскими направляючими у м. Дніпро. Повне затемнення та захист тканини.',
  keywords: [
    'закрита система ролет',
    'ролети uni дніпро',
    'тканинні ролети в коробі',
    'ролети з направляючими',
    'купити ролети закритого типу',
  ],
  openGraph: {
    title: 'Закрита система ролет з коробом та направляючими — Дніпро',
    description:
      'Касетні ролети закритого типу Uni за індивідуальними розмірами. Ідеальне прилягання до вікна.',
    url: `${SITE_URL}/zakryta-sistema`,
  },
  alternates: {
    canonical: `${SITE_URL}/zakryta-sistema`,
  },
};

export default async function ZakrytaSistemaPage() {
  const products = await getProducts({ categorySlug: 'zakryta-sistema' });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: 'Закрита система', url: '/zakryta-sistema' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Завантаження...</div>}>
        <CatalogView
          initialProducts={products}
          categorySlug="zakryta-sistema"
          categoryTitle="Закрита система ролет (Uni з коробом та направляючими)"
        />
      </Suspense>
    </>
  );
}
