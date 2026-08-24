import { Product } from '@/types/database';
import { MOCK_PRODUCTS } from './mockData';
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

export interface SiteSettings {
  contacts: SiteContacts;
  calculator: CalculatorRates;
  promo: PromoContent;
  gallery: GalleryItem[];
}

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
      await supabase.from('site_settings').upsert({
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

export function getDynamicProducts(): Product[] {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return MOCK_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function saveDynamicProducts(products: Product[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (storageError) {
      console.error('localStorage quota exceeded when saving products:', storageError);
      throw new Error('localStorage_quota_exceeded');
    }
    window.dispatchEvent(new Event('site_products_updated'));
  }

  logEvent('SUCCESS', 'PRODUCTS_UPDATED', `Оновлено каталог товарів (${products.length} позицій)`);

  if (supabase) {
    try {
      await supabase.from('products').upsert(products);
    } catch {
      // Continue even if Supabase is unavailable
    }
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
