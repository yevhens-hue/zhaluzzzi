import { Product, Order, Lead } from '@/types/database';
import { LogEntry } from '@/lib/logger';
import {
  CalculatorRates,
  SiteContacts,
  PromoContent,
  GalleryItem,
  CatalogFiltersSettings,
} from '@/lib/siteSettings';

export type AdminTab =
  | 'orders'
  | 'leads'
  | 'analytics'
  | 'products'
  | 'feeds'
  | 'smm'
  | 'reviews'
  | 'filters'
  | 'calculator'
  | 'gallery'
  | 'contacts'
  | 'promo'
  | 'logs'
  | 'db';

export interface AdminAnalytics {
  views: number;
  orders: number;
}
