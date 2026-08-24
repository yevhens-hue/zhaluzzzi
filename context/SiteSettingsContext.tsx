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
  updateProducts: (newProducts: Product[]) => Promise<void>;
  resetDefaults: () => void;
  isLoading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadData = () => {
    setSettings(getSiteSettings());
    setProducts(getDynamicProducts());
    setIsLoading(false);
  };

  useEffect(() => {
    reloadData();

    // Same-tab events (dispatched by saveDynamicProducts / saveSiteSettings)
    const handleSettingsChange = () => setSettings(getSiteSettings());
    const handleProductsChange = () => setProducts(getDynamicProducts());

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

  const updateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    await saveDynamicProducts(newProducts);
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
