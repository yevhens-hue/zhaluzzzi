import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/supabase';
import { SITE_URL } from '@/components/seo/JsonLd';

// Revalidate sitemap every hour so new Supabase products appear without full rebuild
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static routes with SEO priorities
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/catalog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/roleti`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE_URL}/shtori`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE_URL}/zhaluzi`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE_URL}/zakryta-sistema`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.90 },
    { url: `${SITE_URL}/aktsii`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/zamir`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${SITE_URL}/montaj`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${SITE_URL}/pro_nas`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${SITE_URL}/dostavka`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${SITE_URL}/sposobi_oplati`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${SITE_URL}/zvyazok`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.75 },
  ];

  // Dynamic product routes from Supabase
  try {
    const products = await getProducts();

    const productRoutes: MetadataRoute.Sitemap = products
      .filter((p) => p.slug || p.title) // skip products without slug or title
      .map((product) => {
        const slug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        // Build images string[] for Google Image sitemap
        const images: string[] = [];
        if (product.main_image?.startsWith('http')) images.push(product.main_image);
        (product.images || []).forEach((img) => {
          if (img?.startsWith('http') && img !== product.main_image) images.push(img);
        });

        return {
          url: `${SITE_URL}/product/${slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: product.is_popular ? 0.90 : product.is_new ? 0.88 : 0.82,
          ...(images.length > 0 && { images }),
        };
      });

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error('Sitemap: error fetching products from Supabase:', error);
    return staticRoutes;
  }
}
