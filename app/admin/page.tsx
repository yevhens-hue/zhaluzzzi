'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getLocalLogs, clearLocalLogs, LogEntry } from '@/lib/logger';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Product, Order, Lead } from '@/types/database';
import {
  GalleryItem,
  deduplicateProducts,
  CatalogFiltersSettings,
  DEFAULT_CATALOG_FILTERS,
} from '@/lib/siteSettings';

import { AdminTab } from '@/components/admin/types';
import AdminLogin, { SESSION_AUTH_KEY } from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import OrdersTab from '@/components/admin/tabs/OrdersTab';
import LeadsTab from '@/components/admin/tabs/LeadsTab';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import FiltersTab from '@/components/admin/tabs/FiltersTab';
import CalculatorTab from '@/components/admin/tabs/CalculatorTab';
import GalleryTab from '@/components/admin/tabs/GalleryTab';
import ContactsTab from '@/components/admin/tabs/ContactsTab';
import PromoTab from '@/components/admin/tabs/PromoTab';
import LogsTab from '@/components/admin/tabs/LogsTab';
import DatabaseTab from '@/components/admin/tabs/DatabaseTab';
import FeedsTab from '@/components/admin/tabs/FeedsTab';
import SmmTab from '@/components/admin/tabs/SmmTab';
import ReviewsAnalyticsTab from '@/components/admin/tabs/ReviewsAnalyticsTab';
import AnalyticsDashboardTab from '@/components/admin/tabs/AnalyticsDashboardTab';
import {
  compressBase64Image,
  generateSlugFromTitle,
} from '@/components/admin/modals/ProductEditModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const { settings, products, updateSettings, updateProducts, resetDefaults } = useSiteSettings();

  // Active subtab
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states for Settings
  const [calcForm, setCalcForm] = useState(settings.calculator);
  const [contactsForm, setContactsForm] = useState(settings.contacts);
  const [promoForm, setPromoForm] = useState(settings.promo);
  const [galleryForm, setGalleryForm] = useState<GalleryItem[]>(settings.gallery || []);
  const [filtersForm, setFiltersForm] = useState<CatalogFiltersSettings>(settings.filters || DEFAULT_CATALOG_FILTERS);

  // Product editing modal / inline state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Search
  const [productSearch, setProductSearch] = useState('');

  // Image upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // CSV import
  const [csvPreview, setCsvPreview] = useState<Record<string, string>[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Analytics (product_id -> { views, orders })
  const [analytics, setAnalytics] = useState<Record<string, { views: number; orders: number }>>({});

  // All products for display (strictly deduplicated DB products)
  const allAdminProducts = useMemo(() => {
    return deduplicateProducts(products);
  }, [products]);

  // Filtered products (search)
  const filteredAdminProducts = useMemo(() => {
    if (!productSearch.trim()) return allAdminProducts;
    const q = productSearch.toLowerCase();
    return allAdminProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category_slug?.toLowerCase().includes(q)
    );
  }, [allAdminProducts, productSearch]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSessionAuth =
        sessionStorage.getItem(SESSION_AUTH_KEY) === 'true' ||
        localStorage.getItem(SESSION_AUTH_KEY) === 'true';
      setIsAuthenticated(isSessionAuth);
      setIsAuthChecking(false);
      if (isSessionAuth) {
        loadData();
      }
    }
  }, []);

  useEffect(() => {
    setCalcForm(settings.calculator);
    setContactsForm(settings.contacts);
    setPromoForm(settings.promo);
    setGalleryForm(settings.gallery || []);
    setFiltersForm(settings.filters || DEFAULT_CATALOG_FILTERS);
  }, [settings]);

  const loadData = async () => {
    setIsLoading(true);
    const localLogs = getLocalLogs();
    setLogs(localLogs);

    if (!supabase) {
      if (typeof window !== 'undefined') {
        let storedOrders = [];
        let storedLeads = [];
        try {
          storedOrders = JSON.parse(localStorage.getItem('app_orders') || '[]');
        } catch {}
        try {
          storedLeads = JSON.parse(localStorage.getItem('app_leads') || '[]');
        } catch {}
        setOrders(Array.isArray(storedOrders) ? storedOrders : []);
        setLeads(Array.isArray(storedLeads) ? storedLeads : []);
      }
      setIsLoading(false);
      return;
    }

    try {
      const [{ data: ordersData }, { data: leadsData }, { data: dbLogs }] = await Promise.all([
        supabase.from('zhaluzi_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('zhaluzi_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('zhaluzi_audit_logs').select('*').order('created_at', { ascending: false }).limit(50),
      ]);

      setOrders(ordersData || []);
      setLeads(leadsData || []);
      if (dbLogs && dbLogs.length > 0) {
        setLogs(dbLogs);
      }
    } catch (e) {
      console.error('Data load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
    fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => null);
  };

  // Save Calculator Rates
  const handleSaveCalculator = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      calculator: calcForm,
    });
    showNotification('Розцінки та формулу калькулятора успішно оновлено!');
  };

  // Save Contacts & Info
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      contacts: contactsForm,
    });
    showNotification('Контактні дані та графік успішно збережено!');
  };

  // Save Promo & Banners
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      promo: promoForm,
    });
    showNotification('Тексти банерів та заголовки сайту успішно оновлено!');
  };

  // Save Gallery Works
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      gallery: galleryForm,
    });
    showNotification('Фотогалерею реалізованих проєктів успішно оновлено!');
  };

  // Save Filter Settings
  const handleSaveFilters = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await updateSettings({
      ...settings,
      filters: filtersForm,
    });
    showNotification('✅ Налаштування фільтрів каталогу успішно збережено!');
  };

  // Save / Update a Product
  const handleSaveProduct = async (productToSave: Product) => {
    if (!productToSave.title?.trim()) {
      showNotification('❌ Помилка: заповніть назву товару!');
      return;
    }
    if (!productToSave.base_price || productToSave.base_price <= 0) {
      showNotification('❌ Помилка: вкажіть коректну ціну товару!');
      return;
    }
    if (!productToSave.main_image?.trim()) {
      showNotification('❌ Помилка: додайте головне фото товару!');
      return;
    }

    setIsSaving(true);
    showNotification('⏳ Зберігаємо товар...');

    try {
      let compressedMainImage = productToSave.main_image;
      if (productToSave.main_image.startsWith('data:image')) {
        compressedMainImage = await compressBase64Image(productToSave.main_image);
      }

      const compressedGallery = await Promise.all(
        (productToSave.images || []).map((img) =>
          img.startsWith('data:image') ? compressBase64Image(img) : Promise.resolve(img)
        )
      );

      const slug = isAddingNewProduct
        ? generateSlugFromTitle(productToSave.title, productToSave.id)
        : (productToSave.slug && productToSave.slug.trim().length > 0
            ? productToSave.slug.trim()
            : generateSlugFromTitle(productToSave.title, productToSave.id));

      const rawChars: Record<string, string> = Object.fromEntries(
        Object.entries(productToSave.characteristics || {}).filter(([, v]) => v != null)
      ) as Record<string, string>;

      const migratedChars: Record<string, string> = { ...rawChars };
      if (!migratedChars.fabric && migratedChars.material) {
        migratedChars.fabric = migratedChars.material;
      }
      if (!migratedChars.manufacturer && migratedChars.country) {
        migratedChars.manufacturer = migratedChars.country;
      }

      const ALIAS_KEYS = ['material', 'type', 'country'];
      ALIAS_KEYS.forEach((alias) => {
        if (migratedChars[alias] && (alias === 'material' ? migratedChars.fabric : migratedChars.manufacturer)) {
          delete migratedChars[alias];
        }
      });

      const cleanChars = Object.fromEntries(
        Object.entries(migratedChars).filter(([, v]) => v && String(v).trim() !== '')
      );

      const cleanedProduct: Product = {
        ...productToSave,
        slug,
        main_image: compressedMainImage,
        images: compressedGallery.length > 0 ? compressedGallery : [compressedMainImage],
        characteristics: cleanChars,
      };

      const existsInDynamic = products.some(
        (p) =>
          p.id === cleanedProduct.id ||
          p.slug === cleanedProduct.slug ||
          p.title?.trim().toLowerCase() === cleanedProduct.title?.trim().toLowerCase()
      );

      let updated: Product[];
      if (existsInDynamic) {
        updated = products.map((p) =>
          p.id === cleanedProduct.id ||
          p.slug === cleanedProduct.slug ||
          p.title?.trim().toLowerCase() === cleanedProduct.title?.trim().toLowerCase()
            ? cleanedProduct
            : p
        );
      } else {
        updated = [cleanedProduct, ...products];
      }

      const dedupedUpdated = deduplicateProducts(updated);
      await updateProducts(dedupedUpdated, cleanedProduct);
      setEditingProduct(null);
      setIsAddingNewProduct(false);
      showNotification(`✅ Товар "${cleanedProduct.title}" збережено!`);
    } catch (err) {
      console.error('handleSaveProduct error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      showNotification(`❌ ${errMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Видалити цей товар з каталогу?')) return;
    const updated = products.filter((p) => p.id !== productId);
    await updateProducts(updated);
    fetch(`/api/admin/products?id=${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Dnipro2026!'}`,
      },
      credentials: 'include',
    }).catch(() => null);
    showNotification('Товар видалено з каталогу.');
  };

  // Quick toggle: is_popular / is_new / in_stock
  const handleToggleFlag = async (productId: string, field: 'is_popular' | 'is_new' | 'in_stock', value: boolean) => {
    const updated = products.map((p) => (p.id === productId ? { ...p, [field]: value } : p));
    const toggled = updated.find((p) => p.id === productId);
    await updateProducts(updated, toggled);

    fetch(`/api/admin/products/${productId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Dnipro2026!'}`,
      },
      credentials: 'include',
      body: JSON.stringify({ field, value }),
    }).catch(() => null);
    showNotification(`✅ ${field === 'is_popular' ? '⭐ Популярне' : field === 'is_new' ? '🆕 Новинка' : '✅ В наявності'}: ${value ? 'увімкнено' : 'вимкнено'}`);
  };

  // Upload image to Supabase Storage
  const handleUploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', file);
      setUploadProgress(40);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
      setUploadProgress(90);
      if (!res.ok) {
        const { error } = await res.json();
        showNotification(`❌ Помилка завантаження: ${error}`);
        return null;
      }
      const { url } = await res.json();
      setUploadProgress(100);
      showNotification('✅ Фото завантажено в хмару!');
      return url as string;
    } catch (err) {
      showNotification('❌ Помилка завантаження фото.');
      console.error(err);
      return null;
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const headers = 'title,sku,category_slug,base_price,old_price,main_image,description,is_popular,is_new';
    const example = 'Ролет Льон 7439,L-7439,roleti,349,450,https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg,Тканинний ролет преміум якості,true,false';
    const blob = new Blob([headers + '\n' + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse and preview CSV
  const handleCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      if (lines.length < 2) {
        showNotification('❌ CSV порожній або неправильний формат');
        return;
      }
      const headers = lines[0].split(',').map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',');
        return Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').trim()]));
      });
      setCsvPreview(rows);
      showNotification(`📋 CSV зчитано: ${rows.length} рядків. Перевірте і натисніть "Імпортувати".`);
    };
    reader.readAsText(file, 'utf-8');
  };

  // Import CSV rows as products
  const handleCSVImport = async () => {
    if (csvPreview.length === 0) return;
    setIsImporting(true);
    try {
      const newProducts: Product[] = csvPreview.map((row) => {
        const id = `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const title = row.title || 'Новий товар';
        const slug = generateSlugFromTitle(title, id);
        return {
          id,
          slug,
          title,
          sku: row.sku || id,
          category_slug: row.category_slug || 'roleti',
          base_price: parseFloat(row.base_price) || 349,
          old_price: row.old_price ? parseFloat(row.old_price) : undefined,
          main_image: row.main_image || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
          images: [row.main_image || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg'],
          description: row.description || '',
          is_popular: row.is_popular === 'true',
          is_new: row.is_new === 'true',
          in_stock: true,
          rating: 5,
          reviews_count: 0,
          price_unit: 'грн',
          characteristics: {},
        } as Product;
      });
      await updateProducts([...newProducts, ...products]);
      setCsvPreview([]);
      showNotification(`✅ Імпортовано ${newProducts.length} товарів!`);
    } catch (err) {
      console.error(err);
      showNotification('❌ Помилка імпорту');
    } finally {
      setIsImporting(false);
    }
  };

  // Import products from XML
  const handleImportXmlProducts = async (newProducts: Product[]) => {
    try {
      const merged = [...newProducts, ...products];
      const deduped = deduplicateProducts(merged);
      await updateProducts(deduped);
    } catch (err) {
      console.error('handleImportXmlProducts error:', err);
      throw err;
    }
  };

  // Load analytics from Supabase
  const handleLoadAnalytics = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/product_analytics?select=product_id,views,orders`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          },
        }
      );
      if (!res.ok) return;
      const data: { product_id: string; views: number; orders: number }[] = await res.json();
      const map: Record<string, { views: number; orders: number }> = {};
      data.forEach((row) => {
        map[row.product_id] = { views: row.views, orders: row.orders };
      });
      setAnalytics(map);
    } catch {
      // Supabase unavailable
    }
  };

  const handleClearLogs = () => {
    if (confirm('Очистити всі системні логи?')) {
      clearLocalLogs();
      setLogs([]);
      showNotification('Журнал подій очищено.');
    }
  };

  if (isAuthChecking) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Перевірка безпеки доступу...</p>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => {
          setIsAuthenticated(true);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header with Navigation Tabs and Alerts */}
      <AdminHeader
        isSupabaseConfigured={isSupabaseConfigured}
        isLoading={isLoading}
        saveSuccessMsg={saveSuccessMsg}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={loadData}
        onLogout={handleLogout}
        ordersCount={orders.length}
        leadsCount={leads.length}
        productsCount={products.length}
        activeFiltersCount={filtersForm.destinations.filter((d) => d.enabled !== false).length}
        galleryCount={galleryForm.length}
        logsCount={logs.length}
      />

      {/* Tabs */}
      {activeTab === 'orders' && <OrdersTab orders={orders} />}

      {activeTab === 'leads' && <LeadsTab leads={leads} />}

      {activeTab === 'products' && (
        <ProductsTab
          products={products}
          allAdminProducts={allAdminProducts}
          filteredAdminProducts={filteredAdminProducts}
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          isAddingNewProduct={isAddingNewProduct}
          setIsAddingNewProduct={setIsAddingNewProduct}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleFlag={handleToggleFlag}
          isSaving={isSaving}
          filtersForm={filtersForm}
          handleUploadImage={handleUploadImage}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          showNotification={showNotification}
          csvPreview={csvPreview}
          setCsvPreview={setCsvPreview}
          handleCSVFile={handleCSVFile}
          handleCSVImport={handleCSVImport}
          isImporting={isImporting}
          downloadCSVTemplate={downloadCSVTemplate}
          handleLoadAnalytics={handleLoadAnalytics}
          analytics={analytics}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboardTab
          orders={orders}
          leads={leads}
          products={products}
          analytics={analytics}
          showNotification={showNotification}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'feeds' && (
        <FeedsTab
          products={products}
          onImportProducts={handleImportXmlProducts}
          showNotification={showNotification}
        />
      )}

      {activeTab === 'smm' && (
        <SmmTab
          products={products}
          showNotification={showNotification}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsAnalyticsTab
          showNotification={showNotification}
        />
      )}

      {activeTab === 'filters' && (
        <FiltersTab
          filtersForm={filtersForm}
          setFiltersForm={setFiltersForm}
          onSaveFilters={handleSaveFilters}
        />
      )}

      {activeTab === 'calculator' && (
        <CalculatorTab
          calcForm={calcForm}
          setCalcForm={setCalcForm}
          onSaveCalculator={handleSaveCalculator}
          resetDefaults={resetDefaults}
        />
      )}

      {activeTab === 'gallery' && (
        <GalleryTab
          galleryForm={galleryForm}
          setGalleryForm={setGalleryForm}
          onSaveGallery={handleSaveGallery}
        />
      )}

      {activeTab === 'contacts' && (
        <ContactsTab
          contactsForm={contactsForm}
          setContactsForm={setContactsForm}
          onSaveContacts={handleSaveContacts}
        />
      )}

      {activeTab === 'promo' && (
        <PromoTab
          promoForm={promoForm}
          setPromoForm={setPromoForm}
          onSavePromo={handleSavePromo}
        />
      )}

      {activeTab === 'logs' && (
        <LogsTab logs={logs} onClearLogs={handleClearLogs} />
      )}

      {activeTab === 'db' && <DatabaseTab />}
    </div>
  );
}
