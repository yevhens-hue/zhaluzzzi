import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { CatalogView } from '@/components/CatalogView';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Тканинні Ролети на вікна — купити у м. Дніпро від виробника',
  description:
    'Купити тканинні та рулонні ролети на вікна за вашими індивідуальними розмірами у м. Дніпро. Понад 500 видів тканин, європейська фурнітура, швидке виготовлення.',
  keywords: [
    'ролети дніпро',
    'тканинні ролети',
    'рулонні ролети',
    'ролети на вікна дніпро',
    'купити ролети від виробника',
  ],
  openGraph: {
    title: 'Тканинні Ролети на вікна — купити від виробника у м. Дніпро',
    description:
      'Тканинні та рулонні ролети будь-яких розмірів. Власне виробництво у Дніпрі, доставка по Україні.',
    url: `${SITE_URL}/roleti`,
  },
  alternates: {
    canonical: `${SITE_URL}/roleti`,
  },
};

export default async function RoletiPage() {
  const products = await getProducts({ categorySlug: 'roleti' });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: 'Ролети', url: '/roleti' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <Suspense fallback={<div className="py-12 text-center text-sm text-gray-500">Завантаження...</div>}>
        <CatalogView
          initialProducts={products}
          categorySlug="roleti"
          categoryTitle="Ролети на вікна (тканинні, день-ніч, блекаут)"
        />
      </Suspense>
    </>
  );
}
