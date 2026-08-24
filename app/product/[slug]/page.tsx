import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getProductReviews } from '@/lib/supabase';
import { ProductDetailView } from '@/components/ProductDetailView';
import { ProductJsonLd, BreadcrumbsJsonLd, SITE_URL } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_NAMES: Record<string, string> = {
  roleti: 'Ролети',
  shtori: 'Штори',
  zhaluzi: 'Жалюзі',
  'zakryta-sistema': 'Закрита система',
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Товар не знайдено | Жалюзі та Ролети від виробника',
    };
  }

  const categoryName = CATEGORY_NAMES[product.category_slug] || 'Каталог';
  const pageUrl = `${SITE_URL}/product/${product.slug}`;
  const images = product.images && product.images.length > 0 ? product.images : [product.main_image];

  return {
    title: `${product.title} — купити за ціною від ${product.base_price} грн у Дніпрі`,
    description: `Купити ${product.title} (категорія: ${categoryName}) від виробника у м. Дніпро за ціною від ${product.base_price} грн. Індивідуальний замір, швидке виготовлення, доставка по Україні.`,
    keywords: [
      product.title.toLowerCase(),
      `купити ${product.title.toLowerCase()}`,
      `ціна ${product.title.toLowerCase()}`,
      categoryName.toLowerCase(),
      'жалюзі дніпро',
      'ролети від виробника',
    ],
    openGraph: {
      title: `${product.title} — ціна від ${product.base_price} грн | Жалюзі та Ролети від виробника`,
      description:
        product.description?.slice(0, 180) ||
        `Купити ${product.title} за ціною від ${product.base_price} грн від виробника у м. Дніпро.`,
      url: pageUrl,
      type: 'website',
      images: images.map((img) => ({
        url: img.startsWith('http') ? img : `${SITE_URL}${img}`,
        width: 800,
        height: 600,
        alt: product.title,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} — ціна від ${product.base_price} грн`,
      description: `Купити ${product.title} від виробника у Дніпрі. Індивідуальні розміри.`,
      images: images,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [reviews, relatedProducts] = await Promise.all([
    getProductReviews(product.id),
    getProducts({ categorySlug: product.category_slug, limit: 4 }),
  ]);

  const categoryName = CATEGORY_NAMES[product.category_slug] || 'Каталог';
  const breadcrumbItems = [
    { name: 'Головна', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: categoryName, url: `/${product.category_slug}` },
    { name: product.title, url: `/product/${product.slug}` },
  ];

  return (
    <>
      <ProductJsonLd product={product} reviews={reviews} />
      <BreadcrumbsJsonLd items={breadcrumbItems} />
      <ProductDetailView
        product={product}
        reviews={reviews}
        relatedProducts={relatedProducts.filter((p) => p.id !== product.id)}
      />
    </>
  );
}
