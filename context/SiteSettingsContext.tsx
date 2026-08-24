'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  getSiteSettings,
  saveSiteSettings,
  getDynamicProducts,
  saveDynamicProducts,
  resetSiteSettingsToDefault,
  deduplicateProducts,
  mergeAndDeduplicateProducts,
} from '@/lib/siteSettings';
import { Product } from '@/types/database';

interface SiteSettingsContextType {
  settings: SiteSettings;
  products: Product[];
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  updateProducts: (newProducts: Product[], changedProduct?: Product) => Promise<void>;
  resetDefaults: () => void;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadData = async () => {
    setSettings(getSiteSettings());

    // Clean up any legacy localStorage product caches in user browsers
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('app_site_products_v1');
      } catch {}
    }

    // Load products directly from Supabase API (Single Source of Truth)
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (res.ok) {
        const { products: serverProducts } = await res.json();
        if (Array.isArray(serverProducts)) {
          setProducts(deduplicateProducts(serverProducts));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch products from Supabase API:', err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    reloadData();

    // Same-tab events (dispatched on changes)
    const handleSettingsChange = () => setSettings(getSiteSettings());
    const handleProductsChange = () => reloadData();

    window.addEventListener('site_settings_updated', handleSettingsChange);
    window.addEventListener('site_products_updated', handleProductsChange);

    // Cross-tab sync: settings updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_site_settings_v1') setSettings(getSiteSettings());
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('site_settings_updated', handleSettingsChange);
      window.removeEventListener('site_products_updated', handleProductsChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await saveSiteSettings(newSettings);
  };

  const updateProducts = async (newProducts: Product[], changedProduct?: Product) => {
    setProducts(newProducts);
    await saveDynamicProducts(newProducts, changedProduct);
  };

  const resetDefaults = () => {
    resetSiteSettingsToDefault();
    reloadData();
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        products,
        updateSettings,
        updateProducts,
        resetDefaults,
        isLoading,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
