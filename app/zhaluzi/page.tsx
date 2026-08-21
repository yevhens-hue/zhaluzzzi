import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { CatalogView } from '@/components/CatalogView';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Жалюзі на вікна (горизонтальні, вертикальні, дерев’яні) — м. Дніпро',
  description:
    'Виготовлення та продаж жалюзі у м. Дніпро: алюмінієві горизонтальні, тканинні вертикальні, натуральне дерево та бамбук. Доступні ціни від виробника.',
  keywords: [
    'жалюзі дніпро',
    'горизонтальні жалюзі',
    'вертикальні жалюзі дніпро',
    'дерев’яні жалюзі',
    'купити жалюзі на вікна',
  ],
  openGraph: {
    title: 'Жалюзі на вікна від виробника у м. Дніпро',
    description:
      'Горизонтальні та вертикальні жалюзі за індивідуальними розмірами. Виїзд на замір по Дніпру, доставка по Україні.',
    url: `${SITE_URL}/zhaluzi`,
  },
  alternates: {
    canonical: `${SITE_URL}/zhaluzi`,
  },
};

export default async function ZhaluziPage() {
  const products = await getProducts({ categorySlug: 'zhaluzi' });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: 'Жалюзі', url: '/zhaluzi' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Завантаження...</div>}>
        <CatalogView
          initialProducts={products}
          categorySlug="zhaluzi"
          categoryTitle="Жалюзі (горизонтальні, вертикальні, дерев’яні, бамбукові)"
        />
      </Suspense>
    </>
  );
}
