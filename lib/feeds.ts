import { Product } from '@/types/database';

export const BASE_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://zhaluzi-rolety-dnipro.vercel.app';

// Helper to escape special XML characters
function escapeXml(unsafe: string | number | null | undefined): string {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Translate common categories to Russian for RU feed
const RU_CATEGORY_TRANSLATIONS: Record<string, string> = {
  roleti: 'Рулонные шторы',
  zhaluzi: 'Жалюзи',
  shtori: 'Шторы День-Ночь',
  'den-nich': 'Шторы День-Ночь',
  'blackout': 'Блэкаут роллеты',
  'alyuminiy': 'Алюминиевые жалюзи 25мм',
  'zakryta-sistema': 'Закрытая система Uni',
};

// Translate common Ukrainian titles/terms into Russian
function translateTitleToRu(title: string): string {
  return title
    .replace(/Рулонні штори/gi, 'Рулонные шторы')
    .replace(/Ролети/gi, 'Роллеты')
    .replace(/День-Ніч/gi, 'День-Ночь')
    .replace(/День Ніч/gi, 'День Ночь')
    .replace(/Жалюзі/gi, 'Жалюзи')
    .replace(/Алюмінієві/gi, 'Алюминиевые')
    .replace(/Блекаут/gi, 'Блэкаут')
    .replace(/Закрита система/gi, 'Закрытая система')
    .replace(/Відкрита система/gi, 'Открытая система')
    .replace(/кольори|кольори/gi, 'цветов')
    .replace(/всі розміри/gi, 'все размеры')
    .replace(/зелений/gi, 'зеленый')
    .replace(/бірюзовий/gi, 'бирюзовый')
    .replace(/чорний/gi, 'черный')
    .replace(/білий/gi, 'белый')
    .replace(/сірий/gi, 'серый')
    .replace(/бежевий/gi, 'бежевый');
}

/**
 * Generate Google Merchant Center (Google Shopping) RSS 2.0 XML Feed
 * Spec: https://support.google.com/merchants/answer/7052112
 */
export function generateGoogleMerchantXml(products: Product[], lang: 'uk' | 'ru' = 'uk'): string {
  const isRu = lang === 'ru';
  const siteTitle = isRu
    ? 'Жалюзи и Рулонные Шторы Днепр — Фабрика солнцезащитных систем'
    : 'Жалюзі та Рулонні Штори Дніпро — Фабрика сонцезахисних систем';
  const siteDesc = isRu
    ? 'Производство и установка рулонных штор, жалюзи День-Ночь, алюминиевых жалюзи и систем блэкаут в Днепре и по всей Украине'
    : 'Виробництво та встановлення рулонних штор, жалюзі День-Ніч, алюмінієвих жалюзі та систем блекаут у Дніпрі та по всій Україні';

  const itemsXml = products
    .filter((p) => p.in_stock !== false)
    .map((product) => {
      const title = isRu ? translateTitleToRu(product.title) : product.title;
      const categoryName = isRu
        ? RU_CATEGORY_TRANSLATIONS[product.category_slug] || 'Рулонные шторы и жалюзи'
        : 'Рулонні штори та жалюзі';
      
      const productUrl = `${BASE_SITE_URL}/product/${product.slug}${isRu ? '?lang=ru' : ''}`;
      
      let imageUrl = product.main_image;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${BASE_SITE_URL}${imageUrl}`;
      }

      const description = product.description || (isRu
        ? `${title} от производителя. Изготовление по индивидуальным размерам за 1-3 дня. Гарантия 12-24 месяца.`
        : `${title} від виробника. Виготовлення за індивідуальними розмірами за 1-3 дні. Гарантія 12-24 місяці.`);

      const additionalImages = (product.images || [])
        .filter((img) => img !== product.main_image)
        .slice(0, 5)
        .map((img) => `<g:additional_image_link>${escapeXml(img.startsWith('/') ? `${BASE_SITE_URL}${img}` : img)}</g:additional_image_link>`)
        .join('\n        ');

      const priceFormatted = `${Number(product.base_price || 349).toFixed(2)} UAH`;
      const oldPriceTag = product.old_price && product.old_price > product.base_price
        ? `\n        <g:sale_price>${priceFormatted}</g:sale_price>\n        <g:price>${Number(product.old_price).toFixed(2)} UAH</g:price>`
        : `\n        <g:price>${priceFormatted}</g:price>`;

      return `    <item>
        <g:id>${escapeXml(product.sku || product.id)}</g:id>
        <g:title><![CDATA[${title}]]></g:title>
        <g:description><![CDATA[${description}]]></g:description>
        <g:link>${escapeXml(productUrl)}</g:link>
        <g:image_link>${escapeXml(imageUrl)}</g:image_link>
        ${additionalImages ? `${additionalImages}\n        ` : ''}<g:availability>in_stock</g:availability>${oldPriceTag}
        <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Window Treatments &gt; Window Blinds &amp; Shades</g:google_product_category>
        <g:product_type>${escapeXml(categoryName)}</g:product_type>
        <g:brand>Жалюзі Дніпро</g:brand>
        <g:condition>new</g:condition>
        <g:identifier_exists>no</g:identifier_exists>
        <g:custom_label_0>${isRu ? 'Днепр' : 'Дніпро'}</g:custom_label_0>
        <g:custom_label_1>${product.category_slug}</g:custom_label_1>
        <g:shipping>
          <g:country>UA</g:country>
          <g:service>Нова Пошта</g:service>
          <g:price>80.00 UAH</g:price>
        </g:shipping>
      </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(BASE_SITE_URL)}</link>
    <description>${escapeXml(siteDesc)}</description>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Generate Rozetka / Prom Marketplace YML XML Feed
 */
export function generateRozetkaYmlXml(products: Product[]): string {
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const categories = [
    { id: '1', name: 'Рулонні штори' },
    { id: '2', name: 'Жалюзі День-Ніч' },
    { id: '3', name: 'Горизонтальні жалюзі' },
    { id: '4', name: 'Штори Блекаут' },
  ];

  const offersXml = products
    .filter((p) => p.in_stock !== false)
    .map((product) => {
      let imageUrl = product.main_image;
      if (imageUrl.startsWith('/')) {
        imageUrl = `${BASE_SITE_URL}${imageUrl}`;
      }
      const productUrl = `${BASE_SITE_URL}/product/${product.slug}`;
      const catId = product.category_slug === 'shtori' ? '2' : product.category_slug === 'zhaluzi' ? '3' : '1';

      return `      <offer id="${escapeXml(product.sku || product.id)}" available="true">
        <url>${escapeXml(productUrl)}</url>
        <price>${product.base_price || 349}</price>
        ${product.old_price ? `<oldprice>${product.old_price}</oldprice>` : ''}
        <currencyId>UAH</currencyId>
        <categoryId>${catId}</categoryId>
        <picture>${escapeXml(imageUrl)}</picture>
        <vendor>Жалюзі Дніпро</vendor>
        <name><![CDATA[${product.title}]]></name>
        <description><![CDATA[${product.description || product.title}]]></description>
      </offer>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${dateStr}">
  <shop>
    <name>Жалюзі Дніпро</name>
    <company>Фабрика сонцезахисних систем «Жалюзи»</company>
    <url>${BASE_SITE_URL}</url>
    <currencies>
      <currency id="UAH" rate="1"/>
    </currencies>
    <categories>
      ${categories.map((c) => `<category id="${c.id}">${c.name}</category>`).join('\n      ')}
    </categories>
    <offers>
${offersXml}
    </offers>
  </shop>
</yml_catalog>`;
}
