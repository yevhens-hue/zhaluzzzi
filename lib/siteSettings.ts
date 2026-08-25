import { Product } from '@/types/database';
import { supabase } from './supabase';
import { logEvent } from './logger';

export interface CalculatorRates {
  roletiBaseRate: number;
  shtoriBaseRate: number;
  zhaluziBaseRate: number;
  zakrytaBaseRate: number;
  premiumMultiplier: number;
  blackoutMultiplier: number;
  lineFixationCost: number;
  motorizationCost: number;
  minOrderPrice: number;
}

export interface SiteContacts {
  masterName: string;
  phone1: string;
  phone2: string;
  email: string;
  instagramUrl: string;
  telegramUrl: string;
  viberNumber: string;
  workHours: string;
  city: string;
  deliveryFreeThreshold: number;
}

export interface PromoContent {
  topBannerText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDiscountBadge: string;
}

export interface GalleryItem {
  id: string | number;
  title: string;
  city: string;
  image: string;
  category: string;
}

export interface CatalogFilterItem {
  id: string;
  key: string;
  labelUa: string;
  labelRu: string;
  enabled: boolean;
}

export interface CatalogFiltersSettings {
  destinations: CatalogFilterItem[];
  textures: CatalogFilterItem[];
  blackoutLevels: CatalogFilterItem[];
}

export interface SiteSettings {
  contacts: SiteContacts;
  calculator: CalculatorRates;
  promo: PromoContent;
  gallery: GalleryItem[];
  filters: CatalogFiltersSettings;
}

export const DEFAULT_CATALOG_FILTERS: CatalogFiltersSettings = {
  destinations: [
    { id: 'd1', key: 'na-kuhnju', labelUa: 'На кухню', labelRu: 'На кухню', enabled: true },
    { id: 'd2', key: 'v-spalnju', labelUa: 'У спальню', labelRu: 'В спальню', enabled: true },
    { id: 'd3', key: 'v-gostinnuju', labelUa: 'У вітальню', labelRu: 'В гостиную', enabled: true },
    { id: 'd4', key: 'na-balkon', labelUa: 'На балкон / лоджію', labelRu: 'На балкон / лоджию', enabled: true },
    { id: 'd5', key: 'v-ofis', labelUa: 'В офіс / кабінет', labelRu: 'В офис / кабинет', enabled: true },
    { id: 'd6', key: 'v-detskuju', labelUa: 'У дитячу', labelRu: 'В детскую', enabled: true },
    { id: 'd7', key: 'na-mansardu', labelUa: 'На мансарду', labelRu: 'На мансарду', enabled: true },
  ],
  textures: [
    { id: 't1', key: 'plain', labelUa: 'Однотонні / Без малюнка', labelRu: 'Однотонные / Без рисунка', enabled: true },
    { id: 't2', key: 'pattern', labelUa: 'З малюнком / Текстурні', labelRu: 'С рисунком / Текстурные', enabled: true },
  ],
  blackoutLevels: [
    { id: 'b1', key: '100', labelUa: '100% Блекаут (Повна темрява)', labelRu: '100% Блэкаут (Полная темнота)', enabled: true },
    { id: 'b2', key: 'dimout', labelUa: '60-80% Напівзатемнення (Dimout)', labelRu: '60-80% Полузатемнение (Dimout)', enabled: true },
    { id: 'b3', key: 'light', labelUa: '40-50% Розсіювання світла', labelRu: '40-50% Рассеивание света', enabled: true },
  ],
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contacts: {
    masterName: 'Віктор Кузьменко',
    phone1: '(093) 912-85-31',
    phone2: '(093) 510-55-21',
    email: 'zhaluzi.dnipro@gmail.com',
    instagramUrl: 'https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ==',
    telegramUrl: 'https://t.me/+380939128531',
    viberNumber: '+380939128531',
    workHours: 'Щодня з 9:00 до 19:00',
    city: 'м. Дніпро',
    deliveryFreeThreshold: 2000,
  },
  calculator: {
    roletiBaseRate: 480,
    shtoriBaseRate: 520,
    zhaluziBaseRate: 420,
    zakrytaBaseRate: 780,
    premiumMultiplier: 1.35,
    blackoutMultiplier: 1.6,
    lineFixationCost: 60,
    motorizationCost: 1450,
    minOrderPrice: 229,
  },
  promo: {
    topBannerText: '🔥 Безкоштовний виїзд майстра на замір у м. Дніпро при замовленні від 2-х вікон!',
    heroTitle: 'Жалюзі та Рулонні Штори від виробника у Дніпрі',
    heroSubtitle: 'Виготовлення за вашими розмірами за 2-4 дні. 500+ зразків тканин, якісна фурнітура та гарантія 24 місяці.',
    heroDiscountBadge: '🔥 Знижки до -25% на День-Ніч',
  },
  gallery: [
    {
      id: 1,
      title: 'Рулонні штори День-Ніч у сучасній вітальні',
      city: 'м. Дніпро, пр. Яворницького',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      category: 'День-Ніч',
    },
    {
      id: 2,
      title: 'Дерев’яні жалюзі 50 мм у кабінеті',
      city: 'м. Київ, Печерськ',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      category: 'Жалюзі',
    },
    {
      id: 3,
      title: 'Закрита система Uni на панорамному вікні',
      city: 'м. Одеса, Аркадія',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      category: 'Закрита система',
    },
    {
      id: 4,
      title: 'Тканинні ролети Блекаут у спальні',
      city: 'м. Харків, Центр',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      category: 'Блекаут',
    },
  ],
  filters: DEFAULT_CATALOG_FILTERS,
};

const SETTINGS_KEY = 'app_site_settings_v1';
const PRODUCTS_KEY = 'app_site_products_v1';

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      contacts: { ...DEFAULT_SITE_SETTINGS.contacts, ...(parsed.contacts || {}) },
      calculator: { ...DEFAULT_SITE_SETTINGS.calculator, ...(parsed.calculator || {}) },
      promo: { ...DEFAULT_SITE_SETTINGS.promo, ...(parsed.promo || {}) },
      gallery: Array.isArray(parsed.gallery) && parsed.gallery.length > 0 ? parsed.gallery : DEFAULT_SITE_SETTINGS.gallery,
      filters: {
        destinations: Array.isArray(parsed.filters?.destinations) && parsed.filters.destinations.length > 0
          ? parsed.filters.destinations
          : DEFAULT_CATALOG_FILTERS.destinations,
        textures: Array.isArray(parsed.filters?.textures) && parsed.filters.textures.length > 0
          ? parsed.filters.textures
          : DEFAULT_CATALOG_FILTERS.textures,
        blackoutLevels: Array.isArray(parsed.filters?.blackoutLevels) && parsed.filters.blackoutLevels.length > 0
          ? parsed.filters.blackoutLevels
          : DEFAULT_CATALOG_FILTERS.blackoutLevels,
      },
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('site_settings_updated'));
  }

  logEvent('SUCCESS', 'SETTINGS_UPDATED', 'Оновлено загальні налаштування та розцінки сайту', settings);

  if (supabase) {
    try {
      await supabase.from('zhaluzi_site_settings').upsert({
        id: 'main',
        settings,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Continue if supabase table not ready
    }
  }

  return true;
}

export function deduplicateProducts(products: Product[]): Product[] {
  if (!Array.isArray(products)) return [];
  const result: Product[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenTitles = new Set<string>();

  for (const p of products) {
    if (!p) continue;
    const id = String(p.id || '').trim();
    const slug = String(p.slug || '').trim().toLowerCase();
    const title = String(p.title || '').trim().toLowerCase();

    // Check if already seen by id, slug, or normalized title (if > 2 chars)
    if (id && seenIds.has(id)) continue;
    if (slug && seenSlugs.has(slug)) continue;
    if (title && title.length > 2 && seenTitles.has(title)) continue;

    if (id) seenIds.add(id);
    if (slug) seenSlugs.add(slug);
    if (title && title.length > 2) seenTitles.add(title);

    result.push(p);
  }

  return result;
}

export function mergeAndDeduplicateProducts(
  primary: Product[] = [],
  secondary: Product[] = []
): Product[] {
  const pList = Array.isArray(primary) ? primary : [];
  const sList = Array.isArray(secondary) ? secondary : [];
  return deduplicateProducts([...pList, ...sList]);
}

export function getDynamicProducts(): Product[] {
  // Products are strictly served from Supabase — no localStorage caching
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(PRODUCTS_KEY);
    } catch {}
  }
  return [];
}

export async function saveDynamicProducts(
  products: Product[],
  /** Pass the single product that changed to avoid syncing the entire list to Supabase */
  changedProduct?: Product
): Promise<boolean> {
  // Clear any legacy product cache from localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(PRODUCTS_KEY);
    } catch {}
    window.dispatchEvent(new Event('site_products_updated'));
  }

  logEvent('SUCCESS', 'PRODUCTS_UPDATED', `Оновлено каталог товарів (${products.length} позицій) в Supabase`);

  // Direct persistence to Supabase via API
  if (typeof window !== 'undefined') {
    const toSync = changedProduct ? [changedProduct] : products;
    const errors: string[] = [];
    await Promise.all(
      toSync.map(async (product) => {
        try {
          const res = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Send Bearer token so auth works even if cookie is absent/expired
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Dnipro2026!'}`,
            },
            credentials: 'include',
            body: JSON.stringify({ product }),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData?.error || `HTTP ${res.status}`;
            console.error('[saveDynamicProducts] API error:', msg, 'product:', product.slug);
            errors.push(msg);
          }
        } catch (err) {
          const msg = String(err);
          console.error('[saveDynamicProducts] Network error:', msg);
          errors.push(msg);
        }
      })
    );

    if (errors.length > 0) {
      throw new Error(`Не вдалося зберегти товар: ${errors[0]}`);
    }

    // On-demand ISR: revalidate catalog pages immediately
    fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'reval_zhaluzi_2026_secret' }),
    }).catch(() => null);
  }

  return true;
}

export function resetSiteSettingsToDefault(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    window.dispatchEvent(new Event('site_settings_updated'));
    window.dispatchEvent(new Event('site_products_updated'));
  }
}
