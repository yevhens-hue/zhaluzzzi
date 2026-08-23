import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/supabase';
import { BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';
import { AktsiiClient } from '@/components/AktsiiClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Акції та знижки на ролети та жалюзі | Жалюзі та Ролети від виробника (Дніпро)',
  description:
    'Актуальні акції, знижки до -25% та спеціальні ціни від виробника сонцезахисних систем у м. Дніпро. Знижки на об\'єм та ролети Блекаут.',
  keywords: [
    'акції жалюзі дніпро',
    'знижки на ролети',
    'рулонні штори розпродаж',
    'купити жалюзі дешево дніпро',
  ],
  openGraph: {
    title: 'Акції та знижки на ролети та жалюзі від виробника',
    description:
      'Сезонні знижки до -25% на популярні рулонні штори та ролети день-ніч у м. Дніпро.',
    url: `${SITE_URL}/aktsii`,
  },
  alternates: {
    canonical: `${SITE_URL}/aktsii`,
  },
};

export default async function AktsiiPage() {
  const saleProducts = await getProducts({ isPopular: true, limit: 6 });

  const breadcrumbs = [
    { name: 'Головна', url: '/' },
    { name: 'Акції', url: '/aktsii' },
  ];

  return (
    <>
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <AktsiiClient saleProducts={saleProducts} />
    </>
  );
}
