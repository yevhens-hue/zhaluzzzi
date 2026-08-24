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

    // Try loading products from Supabase API (cross-device sync)
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (res.ok) {
        const { products: serverProducts } = await res.json();
        if (Array.isArray(serverProducts)) {
          // Merge: server is source of truth
          // Exclude localStorage products that already exist in server by slug OR id
          const serverSlugs = new Set(serverProducts.map((p: Product) => p.slug));
          const serverIds = new Set(serverProducts.map((p: Product) => p.id));
          const localOnly = getDynamicProducts().filter(
            (p) => !serverSlugs.has(p.slug) && !serverIds.has(p.id)
          );
          // Also deduplicate server products themselves (by id, keep first occurrence)
          const seen = new Set<string>();
          const dedupedServer = serverProducts.filter((p: Product) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
          });
          setProducts([...dedupedServer, ...localOnly]);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Supabase unavailable — fall through to localStorage
    }

    // Fallback: localStorage — also deduplicate
    const localProducts = getDynamicProducts();
    const seenLocal = new Set<string>();
    const dedupedLocal = localProducts.filter((p) => {
      if (seenLocal.has(p.id)) return false;
      seenLocal.add(p.id);
      return true;
    });
    setProducts(dedupedLocal);
    setIsLoading(false);
  };

  useEffect(() => {
    reloadData();

    // Same-tab events (dispatched by saveDynamicProducts / saveSiteSettings)
    const handleSettingsChange = () => setSettings(getSiteSettings());
    // Re-fetch from Supabase API instead of localStorage to keep merged view accurate
    const handleProductsChange = () => reloadData();

    window.addEventListener('site_settings_updated', handleSettingsChange);
    window.addEventListener('site_products_updated', handleProductsChange);

    // Cross-tab sync: browser fires 'storage' when another tab writes to localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_site_products_v1') setProducts(getDynamicProducts());
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
