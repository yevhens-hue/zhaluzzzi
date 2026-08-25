import React from 'react';
import { Product, Review } from '@/types/database';

export const SITE_URL = 'https://zhaluzi-rolety-dnipro.vercel.app';

export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/#localbusiness`,
    name: 'Жалюзі та Ролети від виробника | м. Дніпро',
    alternateName: 'Виробництво та монтаж жалюзі й ролетів у Дніпрі',
    description:
      'Виробництво, замір, доставка та монтаж жалюзі, тканинних ролетів, рулонних штор День-Ніч та систем Блекаут у м. Дніпро та по всій Україні.',
    url: SITE_URL,
    telephone: ['+380939128531', '+380935105521'],
    priceRange: '₴₴',
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Дніпро',
      addressRegion: 'Дніпропетровська область',
      addressCountry: 'UA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.4647,
      longitude: 35.0462,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/zhaluzi.rollety.dnipro',
      'https://t.me/+380939128531',
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Дніпро',
      },
      {
        '@type': 'Country',
        name: 'Україна',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Каталог сонцезахисних систем',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Тканинні Ролети',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Рулонні Штори День-Ніч',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Горизонтальні та Вертикальні Жалюзі',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Закрита система з коробом',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Жалюзі та Ролети від виробника',
    description:
      'Жалюзі, тканинні ролети, штори День-Ніч за індивідуальними розмірами у м. Дніпро.',
    inLanguage: 'uk-UA',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalog?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbsJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({
  product,
  reviews = [],
}: {
  product: Product;
  reviews?: Review[];
}) {
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const images = product.images && product.images.length > 0 ? product.images : [product.main_image];

  // Calculate average rating if reviews exist
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : undefined;

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.title,
    image: images,
    description:
      product.description ||
      `Купити ${product.title} за ціною від ${product.base_price} грн від виробника у м. Дніпро.`,
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: 'Жалюзі та Ролети Дніпро',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'UAH',
      price: product.base_price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Жалюзі та Ролети від виробника',
      },
    },
  };

  if (avgRating && reviews.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    };
    schema.review = reviews.slice(0, 5).map((rev) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: rev.author_name,
      },
      datePublished: rev.created_at?.split('T')[0] || '2026-01-01',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: rev.rating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: rev.comment,
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ItemListJsonLd({ products }: { products: Product[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        url: `${SITE_URL}/product/${product.slug}`,
        name: product.title,
        image: product.main_image.startsWith('http') ? product.main_image : `${SITE_URL}${product.main_image}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'UAH',
          price: product.base_price,
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

