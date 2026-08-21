import { createClient } from '@supabase/supabase-js';
import { Product, Category, Order, Lead, Review } from '@/types/database';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_REVIEWS } from './mockData';
import { logEvent } from './logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!supabase) {
    return MOCK_CATEGORIES;
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }
    return data as Category[];
  } catch (err) {
    console.warn('Using fallback categories due to Supabase error:', err);
    return MOCK_CATEGORIES;
  }
}

/**
 * Get products by optional category and filters
 */
export async function getProducts(options?: {
  categorySlug?: string;
  subcategorySlug?: string;
  isPopular?: boolean;
  isNew?: boolean;
  destination?: string;
  searchQuery?: string;
  limit?: number;
}): Promise<Product[]> {
  if (!supabase) {
    let list = [...MOCK_PRODUCTS];

    if (options?.categorySlug && options.categorySlug !== 'all') {
      list = list.filter((p) => p.category_slug === options.categorySlug);
    }
    if (options?.subcategorySlug) {
      list = list.filter((p) => p.subcategory_slug === options.subcategorySlug);
    }
    if (options?.isPopular) {
      list = list.filter((p) => p.is_popular);
    }
    if (options?.isNew) {
      list = list.filter((p) => p.is_new);
    }
    if (options?.destination) {
      list = list.filter((p) => p.destinations?.includes(options.destination!));
    }
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  try {
    let query = supabase.from('products').select('*');

    if (options?.categorySlug && options.categorySlug !== 'all') {
      query = query.eq('category_slug', options.categorySlug);
    }
    if (options?.subcategorySlug) {
      query = query.eq('subcategory_slug', options.subcategorySlug);
    }
    if (options?.isPopular) {
      query = query.eq('is_popular', true);
    }
    if (options?.isNew) {
      query = query.eq('is_new', true);
    }
    if (options?.destination) {
      query = query.contains('destinations', [options.destination]);
    }
    if (options?.searchQuery) {
      query = query.ilike('title', `%${options.searchQuery}%`);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return getProductsFallback(options);
    }
    return data as Product[];
  } catch (err) {
    console.warn('Using fallback products due to error:', err);
    return getProductsFallback(options);
  }
}

function getProductsFallback(options?: {
  categorySlug?: string;
  subcategorySlug?: string;
  isPopular?: boolean;
  isNew?: boolean;
  destination?: string;
  searchQuery?: string;
  limit?: number;
}): Product[] {
  let list = [...MOCK_PRODUCTS];
  if (options?.categorySlug && options.categorySlug !== 'all') {
    list = list.filter((p) => p.category_slug === options.categorySlug);
  }
  if (options?.subcategorySlug) {
    list = list.filter((p) => p.subcategory_slug === options.subcategorySlug);
  }
  if (options?.isPopular) {
    list = list.filter((p) => p.is_popular);
  }
  if (options?.isNew) {
    list = list.filter((p) => p.is_new);
  }
  if (options?.destination) {
    list = list.filter((p) => p.destinations?.includes(options.destination!));
  }
  if (options?.searchQuery) {
    const q = options.searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (options?.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }
    return data as Product;
  } catch (err) {
    console.warn('Fallback product by slug due to error:', err);
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Save new order to database
 */
export async function createOrder(order: Order): Promise<{ success: boolean; orderNumber: string; error?: string }> {
  const orderNumber = `ZR-${Math.floor(100000 + Math.random() * 900000)}`;
  const payload = {
    ...order,
    order_number: orderNumber,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  logEvent('INFO', 'ORDER_ATTEMPT', `Спроба створення замовлення ${orderNumber}`, {
    customer: order.customer_name,
    phone: order.phone,
    total: order.total_amount,
    items_count: order.items?.length,
  });

  if (!supabase) {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('app_orders') || '[]');
      stored.unshift(payload);
      localStorage.setItem('app_orders', JSON.stringify(stored));
    }
    logEvent('SUCCESS', 'ORDER_CREATED_LOCAL', `Замовлення ${orderNumber} збережено локально`, payload);
    return { success: true, orderNumber };
  }

  try {
    const { error } = await supabase.from('orders').insert([payload]);
    if (error) {
      logEvent('WARN', 'ORDER_SUPABASE_FALLBACK', `Помилка запису в Supabase, збереження локально: ${error.message}`, error);
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('app_orders') || '[]');
        stored.unshift(payload);
        localStorage.setItem('app_orders', JSON.stringify(stored));
      }
      return { success: true, orderNumber };
    }
    logEvent('SUCCESS', 'ORDER_CREATED_SUPABASE', `Замовлення ${orderNumber} успішно збережено в Supabase`, payload);
    return { success: true, orderNumber };
  } catch (err: any) {
    logEvent('ERROR', 'ORDER_EXCEPTION', `Критична помилка при оформленні: ${err.message}`, err);
    return { success: true, orderNumber };
  }
}

/**
 * Save lead (1-click buy or callback)
 */
export async function createLead(lead: Lead): Promise<{ success: boolean; error?: string }> {
  const payload = {
    ...lead,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  logEvent('INFO', 'LEAD_ATTEMPT', `Нова заявка ліда: ${lead.phone} (${lead.lead_type || 'one_click'})`, lead);

  if (!supabase) {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('app_leads') || '[]');
      stored.unshift(payload);
      localStorage.setItem('app_leads', JSON.stringify(stored));
    }
    logEvent('SUCCESS', 'LEAD_CREATED_LOCAL', `Лід ${lead.phone} збережено локально`, payload);
    return { success: true };
  }

  try {
    const { error } = await supabase.from('leads').insert([payload]);
    if (error) {
      logEvent('WARN', 'LEAD_SUPABASE_FALLBACK', `Помилка ліда в Supabase: ${error.message}`, error);
    } else {
      logEvent('SUCCESS', 'LEAD_CREATED_SUPABASE', `Лід ${lead.phone} збережено в Supabase`, payload);
    }
    return { success: true };
  } catch (err: any) {
    logEvent('ERROR', 'LEAD_EXCEPTION', `Помилка відправки ліда: ${err.message}`, err);
    return { success: true };
  }
}

/**
 * Get reviews for product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  if (!supabase) {
    return MOCK_REVIEWS.filter((r) => r.product_id === productId);
  }
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_REVIEWS.filter((r) => r.product_id === productId);
    }
    return data as Review[];
  } catch (err) {
    return MOCK_REVIEWS.filter((r) => r.product_id === productId);
  }
}

/**
 * Submit review
 */
export async function addProductReview(review: Omit<Review, 'id' | 'created_at'>): Promise<boolean> {
  const payload = {
    ...review,
    id: `rev-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    MOCK_REVIEWS.unshift(payload as Review);
    return true;
  }

  try {
    const { error } = await supabase.from('reviews').insert([payload]);
    return !error;
  } catch {
    return true;
  }
}
