'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getLocalLogs, clearLocalLogs, LogEntry } from '@/lib/logger';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Product } from '@/types/database';
import {
  Package,
  Users,
  Database,
  RefreshCw,
  Activity,
  Trash2,
  Lock,
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Save,
  CheckCircle2,
  Calculator,
  Phone,
  Megaphone,
  Sparkles,
  RotateCcw,
  Sliders,
  Upload,
  Image as ImageIcon,
  X,
} from 'lucide-react';

import { getSiteSettings, GalleryItem, deduplicateProducts, mergeAndDeduplicateProducts } from '@/lib/siteSettings';
import { MOCK_PRODUCTS } from '@/lib/mockData';

const ADMIN_LOGIN = 'admin';
const SESSION_AUTH_KEY = 'app_admin_session_v2';

const cleanInput = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // strip zero-width and non-breaking spaces
    .normalize('NFKC')
    .trim();
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { settings, products, updateSettings, updateProducts, resetDefaults } = useSiteSettings();

  // Active subtab
  const [activeTab, setActiveTab] = useState<'orders' | 'leads' | 'products' | 'calculator' | 'gallery' | 'contacts' | 'promo' | 'logs' | 'db'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form states for Settings
  const [calcForm, setCalcForm] = useState(settings.calculator);
  const [contactsForm, setContactsForm] = useState(settings.contacts);
  const [promoForm, setPromoForm] = useState(settings.promo);
  const [galleryForm, setGalleryForm] = useState<GalleryItem[]>(settings.gallery || []);

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

  // All products for display (mock base + admin overrides, strictly deduplicated)
  const allAdminProducts = React.useMemo(() => {
    return mergeAndDeduplicateProducts(products, MOCK_PRODUCTS);
  }, [products]);

  // Filtered products (search)
  const filteredAdminProducts = React.useMemo(() => {
    if (!productSearch.trim()) return allAdminProducts;
    const q = productSearch.toLowerCase();
    return allAdminProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category_slug?.toLowerCase().includes(q)
    );
  }, [allAdminProducts, productSearch]);

  // Logs filters
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'>('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

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
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const login = cleanInput(loginInput).toLowerCase();
    const password = cleanInput(passwordInput);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setAuthError('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        }
        loadData();
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || 'Невірний логін або пароль адміністратора.');
      }
    } catch {
      setAuthError('Помилка підключення. Перевірте зʼєднання та спробуйте ще раз.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginInput('');
    setPasswordInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    }
    // Clear server-side httpOnly cookie
    fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => null);
  };


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
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50),
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

  // Compress a base64 image to JPEG max 800px wide at 0.75 quality
  const compressBase64Image = (base64: string, maxWidth = 800, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64.startsWith('data:image')) {
        resolve(base64);
        return;
      }
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(base64); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(base64);
      img.src = base64;
    });
  };

  const generateSlugFromTitle = (title: string, id: string): string => {
    if (!title) return `product_${id}`;
    const translitMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
      'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
      'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya'
    };

    const clean = title.toLowerCase().split('').map((ch) => translitMap[ch] || ch).join('');
    const slugified = clean.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return slugified.length > 3 ? `${slugified}_${id.slice(-4)}` : `product_${id}`;
  };

  // Save / Update a Product
  const handleSaveProduct = async (productToSave: Product) => {
    // Validation
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
      // Compress base64 images to avoid localStorage overflow
      let compressedMainImage = productToSave.main_image;
      if (productToSave.main_image.startsWith('data:image')) {
        compressedMainImage = await compressBase64Image(productToSave.main_image);
      }

      const compressedGallery = await Promise.all(
        (productToSave.images || []).map((img) =>
          img.startsWith('data:image') ? compressBase64Image(img) : Promise.resolve(img)
        )
      );

      const slug = generateSlugFromTitle(productToSave.title, productToSave.id);

      // Clean characteristics: remove empty values and old alias keys that duplicate standard keys
      const rawChars: Record<string, string> = Object.fromEntries(
        Object.entries(productToSave.characteristics || {}).filter(([, v]) => v != null)
      ) as Record<string, string>;
      // Migrate legacy alias keys → canonical keys (only if canonical doesn't already exist)
      const migratedChars: Record<string, string> = { ...rawChars };
      if (!migratedChars.fabric && migratedChars.material) { migratedChars.fabric = migratedChars.material; }
      if (!migratedChars.manufacturer && migratedChars.country) { migratedChars.manufacturer = migratedChars.country; }
      // Remove purely redundant alias keys that are now covered by canonical keys
      const ALIAS_KEYS = ['material', 'type', 'country'];
      ALIAS_KEYS.forEach((alias) => {
        if (migratedChars[alias] && (alias === 'material' ? migratedChars.fabric : migratedChars.manufacturer)) {
          delete migratedChars[alias];
        }
      });
      // Remove empty-value entries
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


      // Only save non-mock products + overrides to localStorage
      const isMock = MOCK_PRODUCTS.some((m) => m.id === cleanedProduct.id);
      const existsInDynamic = products.some(
        (p) => p.id === cleanedProduct.id || p.slug === cleanedProduct.slug || (p.title?.trim().toLowerCase() === cleanedProduct.title?.trim().toLowerCase())
      );

      let updated: Product[];
      if (existsInDynamic) {
        updated = products.map((p) =>
          p.id === cleanedProduct.id || p.slug === cleanedProduct.slug || (p.title?.trim().toLowerCase() === cleanedProduct.title?.trim().toLowerCase())
            ? cleanedProduct
            : p
        );
      } else {
        // New product or first edit of a mock product — add to dynamic list
        updated = [cleanedProduct, ...products];
      }

      const dedupedUpdated = deduplicateProducts(updated);
      await updateProducts(dedupedUpdated, cleanedProduct);
      setEditingProduct(null);
      setIsAddingNewProduct(false);
      const label = isMock ? '(оновлено з базового каталогу)' : '';
      showNotification(`✅ Товар "${cleanedProduct.title}" збережено! ${label}`);
    } catch (err) {
      console.error('handleSaveProduct error:', err);
      showNotification('❌ Помилка збереження! Спробуйте вказати URL-посилання на фото замість завантаження файлу.');
    } finally {
      setIsSaving(false);
    }
  };


  // Delete a Product
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Видалити цей товар з каталогу?')) return;
    const updated = products.filter((p) => p.id !== productId);
    await updateProducts(updated);
    // Also delete from Supabase
    fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' }).catch(() => null);
    showNotification('Товар видалено з каталогу.');
  };

  // Quick toggle: is_popular / is_new / in_stock
  const handleToggleFlag = async (productId: string, field: 'is_popular' | 'is_new' | 'in_stock', value: boolean) => {
    // Optimistic UI update
    const updated = products.map((p) =>
      p.id === productId ? { ...p, [field]: value } : p
    );
    // Also update mock overrides in admin view
    const targetInMocks = MOCK_PRODUCTS.find((m) => m.id === productId);
    const toggledProduct = products.find((p) => p.id === productId) || (targetInMocks && { ...targetInMocks, [field]: value });
    if (targetInMocks && !products.find((p) => p.id === productId)) {
      const override = { ...targetInMocks, [field]: value } as typeof targetInMocks;
      await updateProducts([override, ...products], override);
    } else {
      const toggled = updated.find((p) => p.id === productId);
      await updateProducts(updated, toggled);
    }
    // Sync to Supabase
    fetch(`/api/admin/products/${productId}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
      setTimeout(() => { setIsUploading(false); setUploadProgress(0); }, 1000);
    }
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const headers = 'title,sku,category_slug,base_price,old_price,main_image,description,is_popular,is_new';
    const example = 'Ролет Льон 7439,L-7439,roleti,349,450,https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg,Тканинний ролет преміум якості,true,false';
    const blob = new Blob([headers + '\n' + example], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'products_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // Parse and preview CSV
  const handleCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(Boolean);
      if (lines.length < 2) { showNotification('❌ CSV порожній або неправильний формат'); return; }
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
          id, slug, title,
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

  // Load analytics from Supabase
  const handleLoadAnalytics = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/product_analytics?select=product_id,views,orders`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
      });
      if (!res.ok) return;
      const data: { product_id: string; views: number; orders: number }[] = await res.json();
      const map: Record<string, { views: number; orders: number }> = {};
      data.forEach((row) => { map[row.product_id] = { views: row.views, orders: row.orders }; });
      setAnalytics(map);
    } catch { /* Supabase unavailable */ }
  };



  // Clear Logs
  const handleClearLogs = () => {
    if (confirm('Очистити журнал логів?')) {
      clearLocalLogs();
      setLogs([]);
      showNotification('Журнал логів очищено.');
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return (
        log.action?.toLowerCase().includes(q) ||
        log.message?.toLowerCase().includes(q) ||
        JSON.stringify(log.details || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

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
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Вхід в адмін-панель</h1>
            <p className="text-xs text-gray-500">
              Введіть логін та пароль адміністратора для доступу до керування сайтом
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Логін адміністратора
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="admin"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Введіть пароль"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                  onKeyUp={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {capsLockActive && (
                <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                  <span>⚠️</span> Увімкнено Caps Lock (пароль чутливий до регістру)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Перевірка входу...</span>
                </>
              ) : (
                <span>Увійти в адмін-панель</span>
              )}
            </button>
          </form>

          <div className="text-[11px] text-gray-400 text-center">
            🔒 Доступ суворо обмежений для власника сайту.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Top Banner with Alert Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Панель керування сайтом & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Управління цінами, товарами та замовленнями</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Sync'}</span>
          </div>

          <button
            onClick={loadData}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
            title="Оновити дані"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-xl transition"
            title="Вийти з адмін-панелі"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs sm:text-sm font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Замовлення ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'leads'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ліди в 1 клік ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Товари та розцінки ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'calculator'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Тарифи калькулятора</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'gallery'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Фотогалерея робіт ({galleryForm.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'contacts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Контакти & Майстер</span>
        </button>

        <button
          onClick={() => setActiveTab('promo')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'promo'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Банери та тексти</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'logs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Журнал подій ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 ${
            activeTab === 'db'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>База Supabase</span>
        </button>
      </div>

      {/* ----------------- 1. ORDERS TAB ----------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800">Замовлень поки що немає</h3>
              <p className="text-xs text-gray-500">
                Нові замовлення з кошика з'являтимуться тут автоматично.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((ord: any) => (
                <div
                  key={ord.id || ord.order_number}
                  className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-blue-900">{ord.order_number}</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {ord.status || 'Нове'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(ord.created_at || Date.now()).toLocaleString('uk-UA')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-gray-400 font-semibold mb-0.5">Клієнт:</div>
                      <div className="font-bold text-gray-900">{ord.customer_name}</div>
                      <div className="text-blue-600 font-bold">{ord.phone}</div>
                      {ord.email && <div className="text-gray-500">{ord.email}</div>}
                    </div>

                    <div>
                      <div className="text-gray-400 font-semibold mb-0.5">Доставка та адреса:</div>
                      <div className="font-bold text-gray-900">{ord.city}</div>
                      <div className="text-gray-600">{ord.delivery_address}</div>
                      <div className="text-gray-500 text-[11px] capitalize">{ord.delivery_type}</div>
                    </div>

                    <div className="text-left md:text-right">
                      <div className="text-gray-400 font-semibold mb-0.5">Сума до сплати:</div>
                      <div className="text-xl font-black text-blue-950">
                        {ord.total_amount?.toLocaleString('uk-UA')} грн
                      </div>
                      <div className="text-gray-500 text-[11px] capitalize">
                        {ord.payment_method === 'cash_on_delivery' ? 'Післяплата' : ord.payment_method}
                      </div>
                    </div>
                  </div>

                  {ord.items && (
                    <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-600 space-y-1">
                      <div className="font-semibold text-gray-700">Позиції замовлення:</div>
                      {ord.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            • {it.title} ({it.width}×{it.height} см, {it.color}) × {it.quantity} шт
                          </span>
                          <span className="font-bold text-gray-800">{it.totalPrice || it.total_price} грн</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- 2. LEADS TAB ----------------- */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {leads.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
              <Users className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800">Заявок в 1 клік поки що немає</h3>
            </div>
          ) : (
            <div className="grid gap-3">
              {leads.map((lead: any, idx: number) => (
                <div
                  key={lead.id || idx}
                  className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-base text-blue-600">{lead.phone}</div>
                    <div className="text-gray-900 font-semibold mt-0.5">
                      {lead.name ? `Клієнт: ${lead.name}` : 'Швидка покупка в 1 клік'}
                    </div>
                    {lead.product_title && (
                      <div className="text-gray-600 text-[11px]">
                        Товар: <strong>{lead.product_title}</strong> {lead.dimensions && `(${lead.dimensions})`}
                      </div>
                    )}
                    {lead.comment && (
                      <div className="text-gray-500 text-[11px] italic mt-1">
                        Повідомлення: "{lead.comment}"
                      </div>
                    )}
                  </div>

                  <div className="text-left sm:text-right space-y-1">
                    {lead.calculated_price && (
                      <div className="font-black text-gray-900 text-sm">
                        {lead.calculated_price} грн
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400">
                      {new Date(lead.created_at || Date.now()).toLocaleString('uk-UA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ----------------- 3. PRODUCTS & PRICING CMS ----------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Каталог товарів та розцінки</h2>
                <p className="text-xs text-gray-500">
                  {filteredAdminProducts.length} з {allAdminProducts.length} товарів
                  {products.length > 0 && <span className="text-blue-600 font-bold"> · {products.length} ваших</span>}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleLoadAnalytics()}
                  className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-purple-200"
                  title="Завантажити аналітику переглядів"
                >
                  📊 Аналітика
                </button>
                <button
                  onClick={downloadCSVTemplate}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-gray-200"
                >
                  ⬇️ Шаблон CSV
                </button>
                <label className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-emerald-200 cursor-pointer">
                  📥 Імпорт CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCSVFile(f); e.target.value = ''; }}
                  />
                </label>
                <button
                  onClick={() => {
                    const id = `product-${Date.now()}`;
                    setEditingProduct({
                      id,
                      slug: id,
                      title: '',
                      sku: '',
                      category_slug: 'roleti',
                      base_price: 349,
                      old_price: 450,
                      price_unit: 'грн',
                      min_width: 20, max_width: 240,
                      min_height: 30, max_height: 300,
                      base_width: 50, base_height: 150,
                      price_per_sqm: 450,
                      available_colors: [],
                      main_image: 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
                      images: [],
                      is_popular: false,
                      is_new: true,
                      in_stock: true,
                      rating: 5.0,
                      reviews_count: 1,
                      description: 'Виготовлення за індивідуальними розмірами замовника.',
                      blackout_percent: 70,
                      texture: 'Однотонний / Без малюнка',
                      destinations: ['na-kuhnju', 'v-spalnju', 'v-gostinnuju', 'na-balkon', 'v-ofis'],
                      characteristics: {
                        fabric: 'Поліестер 100%',
                        blackout: '70%',
                        system: 'Стандарт',
                        manufacturer: '',
                        country: '',
                        care: 'Суха чистка',
                        warranty: '24 місяці',
                      },
                    } as Product);
                    setIsAddingNewProduct(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Додати товар</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Пошук по назві, SKU або категорії..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:border-blue-400 outline-none transition"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* CSV Preview */}
          {csvPreview.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-900 text-sm">📋 Попередній перегляд CSV ({csvPreview.length} рядків)</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCsvPreview([])}
                    className="text-xs text-amber-600 hover:text-amber-900 font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    onClick={handleCSVImport}
                    disabled={isImporting}
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg font-bold text-xs"
                  >
                    {isImporting ? '⏳ Імпортуємо...' : `✅ Імпортувати ${csvPreview.length} товарів`}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-amber-200">
                <table className="text-[11px] w-full">
                  <thead className="bg-amber-100">
                    <tr>{Object.keys(csvPreview[0]).map((h) => <th key={h} className="px-3 py-1.5 text-left font-bold text-amber-800">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {csvPreview.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-amber-100 bg-white">
                        {Object.values(row).map((v, j) => <td key={j} className="px-3 py-1.5 text-gray-700 max-w-[120px] truncate">{v}</td>)}
                      </tr>
                    ))}
                    {csvPreview.length > 5 && (
                      <tr className="border-t border-amber-100 bg-amber-50">
                        <td colSpan={Object.keys(csvPreview[0]).length} className="px-3 py-1.5 text-amber-600 font-bold text-center">
                          + ще {csvPreview.length - 5} рядків...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* Product Edit / Add Modal */}
          {editingProduct && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-500 shadow-xl space-y-6">
              <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-900">
                    {isAddingNewProduct ? '✨ Додавання нового товару' : `✏️ Редагування: ${editingProduct.title}`}
                  </h3>
                  {isAddingNewProduct && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      💡 Після збереження товар з'явиться на сайті миттєво — відкрийте вкладку /catalog або сторінку категорії без перезавантаження.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingNewProduct(false);
                  }}
                  className="text-xs text-gray-400 hover:text-gray-700 shrink-0 ml-4"
                >
                  Скасувати
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">Назва товару *</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                    placeholder="Рулонні штори Блекаут Антрацит"
                  />
                  {editingProduct.title?.trim() && (
                    <div className="mt-1 text-[11px] text-gray-400 font-mono">
                      🔗 URL: /product/{generateSlugFromTitle(editingProduct.title, editingProduct.id)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Артикул / SKU *</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="L-7439"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Категорія *</label>
                  <select
                    value={editingProduct.category_slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_slug: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                  >
                    <option value="roleti">🏠 Тканинні ролети (roleti)</option>
                    <option value="shtori">🌟 Штори День-Ніч (shtori)</option>
                    <option value="zhaluzi">💠 Жалюзі (zhaluzi)</option>
                    <option value="zakryta-sistema">🔒 Закрита система (zakryta-sistema)</option>
                  </select>
                  <div className="mt-1 text-[11px] text-blue-600 font-semibold">
                    📌 Товар з'явиться на:{' '}
                    <a href="/catalog" target="_blank" className="underline">/catalog</a>{' та '}
                    <a href={`/${editingProduct.category_slug}`} target="_blank" className="underline">
                      /{editingProduct.category_slug}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Базова ціна (грн) *</label>
                  <input
                    type="number"
                    value={editingProduct.base_price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Стара ціна (зі знижкою) (грн)</label>
                  <input
                    type="number"
                    value={editingProduct.old_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, old_price: Number(e.target.value) || undefined })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ціна за 1 м² (грн)</label>
                  <input
                    type="number"
                    value={editingProduct.price_per_sqm}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price_per_sqm: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                  />
                </div>

                {/* Catalog Filters Section */}
                <div className="sm:col-span-3 bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>🎯 Параметри для фільтрів каталогу (Кімнати, Фактура, Затемнення)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    {/* 1. Blackout % */}
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">🌙 Рівень затемнення *</label>
                      <select
                        value={editingProduct.blackout_percent || 70}
                        onChange={(e) => setEditingProduct({ ...editingProduct, blackout_percent: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                      >
                        <option value={100}>100% Блекаут (Повна темрява)</option>
                        <option value={70}>60-80% Напівзатемнення</option>
                        <option value={45}>40-50% Розсіювання світла</option>
                      </select>
                    </div>

                    {/* 2. Texture */}
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">🎨 Фактура полотна *</label>
                      <select
                        value={editingProduct.texture || 'Однотонний / Без малюнка'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, texture: e.target.value })}
                        className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                      >
                        <option value="Однотонний / Без малюнка">Однотонні / Без малюнка</option>
                        <option value="З малюнком / Текстурний">З малюнком / Текстурні</option>
                        <option value="День-Ніч (Смугастий)">День-Ніч (Смугастий)</option>
                        <option value="Дерев'яний / Бамбуковий">Дерев'яний / Бамбуковий</option>
                      </select>
                    </div>

                    {/* 3. Room Destinations Multi-select */}
                    <div className="sm:col-span-3">
                      <label className="block font-bold text-gray-800 mb-1.5">
                        🏠 Призначення / Кімната (Оберіть приміщення, для яких підходить товар):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'na-kuhnju', label: '🍳 На кухню' },
                          { key: 'v-spalnju', label: '🛏️ У спальню' },
                          { key: 'v-gostinnuju', label: '🛋️ У вітальню' },
                          { key: 'na-balkon', label: '🌅 На балкон' },
                          { key: 'v-ofis', label: '💼 В офіс' },
                          { key: 'v-detskuju', label: '🧸 У дитячу' },
                          { key: 'na-mansardu', label: '🏠 На мансарду' },
                        ].map((room) => {
                          const currentDests = editingProduct.destinations || ['na-kuhnju', 'v-spalnju', 'v-gostinnuju', 'na-balkon', 'v-ofis'];
                          const isChecked = currentDests.includes(room.key);
                          return (
                            <button
                              key={room.key}
                              type="button"
                              onClick={() => {
                                const next = isChecked
                                  ? currentDests.filter((d) => d !== room.key)
                                  : [...currentDests, room.key];
                                setEditingProduct({ ...editingProduct, destinations: next });
                              }}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span>{room.label}</span>
                              {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Product Image Upload & Preview */}
                <div className="sm:col-span-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                  <label className="block font-extrabold text-xs text-gray-800 uppercase tracking-wider">
                    🖼️ Головне фото товару *
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Preview Box */}
                    {editingProduct.main_image ? (
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-gray-300 shrink-0 bg-white shadow-xs">
                        <img
                          src={editingProduct.main_image}
                          alt="Прев'ю товару"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 bg-white">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}

                    {/* Controls: Upload file + URL input */}
                    <div className="flex-1 space-y-2 w-full">
                      <div>
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
                          <Upload className="w-4 h-4" />
                          <span>📁 Завантажити фото з комп'ютера</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Limit to 10MB
                                if (file.size > 10 * 1024 * 1024) {
                                  showNotification('❌ Файл надто великий! Максимум 5 МБ.');
                                  return;
                                }
                                // Try CDN upload first (Supabase Storage)
                                const cdnUrl = await handleUploadImage(file);
                                if (cdnUrl) {
                                  setEditingProduct((prev) => prev ? { ...prev, main_image: cdnUrl } : prev);
                                } else {
                                  // Fallback: base64 (offline/local)
                                  const reader = new FileReader();
                                  reader.onload = async (ev) => {
                                    if (ev.target?.result) {
                                      const compressed = await compressBase64Image(ev.target.result as string);
                                      setEditingProduct((prev) => prev ? { ...prev, main_image: compressed } : prev);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }
                            }}
                          />
                        </label>

                        {/* Upload progress */}
                        {isUploading && (
                          <div className="mt-2">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span>☁️ Завантаження в хмару...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <span className="text-[11px] text-gray-500 block mt-1">
                          Файл завантажується в хмару Supabase Storage та зберігається як URL.
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                          Або введіть/вставте URL-посилання:
                        </label>
                        <input
                          type="text"
                          value={editingProduct.main_image}
                          onChange={(e) => setEditingProduct({ ...editingProduct, main_image: e.target.value })}
                          placeholder="https://manov.com.ua/..."
                          className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Images Uploader */}
                <div className="sm:col-span-3 bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-extrabold text-xs text-gray-800 uppercase tracking-wider">
                      📸 Додаткові фото галереї (опціонально)
                    </label>

                    <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer transition">
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Додати фото галереї</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          for (const file of files) {
                            if (file.size > 10 * 1024 * 1024) {
                              showNotification('❌ Файл надто великий! Максимум 10 МБ.');
                              continue;
                            }
                            const reader = new FileReader();
                            await new Promise<void>((res) => {
                              reader.onload = async (ev) => {
                                if (ev.target?.result) {
                                  const compressed = await compressBase64Image(ev.target.result as string);
                                  setEditingProduct((prev) => {
                                    if (!prev) return prev;
                                    return { ...prev, images: [...(prev.images || []), compressed] };
                                  });
                                }
                                res();
                              };
                              reader.readAsDataURL(file);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>

                  {editingProduct.images && editingProduct.images.length > 0 ? (
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {editingProduct.images.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300 shrink-0 group">
                          <img src={imgUrl} alt={`Галерея ${imgIdx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.images || []).filter((_, idx) => idx !== imgIdx);
                              setEditingProduct({ ...editingProduct, images: updated });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition shadow-xs"
                            title="Видалити фото"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-gray-400 italic">
                      Додаткових фото галереї поки що не додано.
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Статус наявності</label>
                  <select
                    value={editingProduct.in_stock ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, in_stock: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                  >
                    <option value="true">В наявності (виготовлення 2-4 дні)</option>
                    <option value="false">Під замовлення</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-bold text-gray-700 mb-1">Опис товару</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white font-medium"
                    placeholder="Детальний опис товару, переваги, особливості..."
                  />
                </div>
              </div>

                {/* ===== CHARACTERISTICS EDITOR ===== */}
                <div className="sm:col-span-3 bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                      <span>📋 Характеристики товару</span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-medium">Відображаються на вкладці «Характеристики» сторінки товару</span>
                  </div>

                  {/* Quick-add standard fields */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'fabric', label: 'Тканина' },
                      { key: 'texture', label: 'Текстура' },
                      { key: 'color', label: 'Колір' },
                      { key: 'blackout', label: 'Затемнення' },
                      { key: 'system', label: 'Система' },
                      { key: 'manufacturer', label: 'Виробник' },
                      { key: 'country', label: 'Країна' },
                      { key: 'care', label: 'Догляд' },
                      { key: 'warranty', label: 'Гарантія' },
                      { key: 'width_range', label: 'Ширина' },
                      { key: 'height_range', label: 'Висота' },
                      { key: 'drive', label: 'Привід' },
                      { key: 'installation', label: 'Монтаж' },
                      { key: 'collection', label: 'Колекція' },
                    ].map(({ key, label }) => {
                      const alreadyHas = key in (editingProduct.characteristics || {});
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={alreadyHas}
                          onClick={() => setEditingProduct({
                            ...editingProduct,
                            characteristics: { ...(editingProduct.characteristics || {}), [key]: '' },
                          })}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition ${
                            alreadyHas
                              ? 'bg-amber-200 border-amber-300 text-amber-700 cursor-default'
                              : 'bg-white border-gray-300 text-gray-600 hover:bg-amber-100 hover:border-amber-400 cursor-pointer'
                          }`}
                        >
                          {alreadyHas ? '✓ ' : '+ '}{label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Existing characteristics — editable rows */}
                  <div className="space-y-2">
                    {Object.entries(editingProduct.characteristics || {}).map(([charKey, charVal]) => {
                      const KNOWN_LABELS: Record<string, string> = {
                        fabric: 'Тканина / Матеріал', material: 'Матеріал', texture: 'Текстура',
                        color: 'Основний колір', blackout: 'Світлоізоляція', system: 'Система керування',
                        manufacturer: 'Виробник', country: 'Країна виробника', care: 'Догляд та чищення',
                        warranty: 'Гарантія', type: 'Тип виробу', width_range: 'Діапазон ширини',
                        height_range: 'Діапазон висоти', weight: 'Вага (кг/м²)', fire_class: 'Клас горючості',
                        eco: 'Екологічність', light: 'Пропускання світла', noise: 'Шумопоглинання',
                        installation: 'Спосіб монтажу', drive: 'Привід', collection: 'Колекція',
                        code: 'Код тканини', thickness: 'Товщина',
                      };
                      const isKnown = charKey in KNOWN_LABELS;
                      return (
                        <div key={charKey} className="flex items-center gap-2">
                          {/* Key */}
                          {isKnown ? (
                            <div className="w-44 shrink-0 px-3 py-2 bg-amber-100 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900 truncate">
                              {KNOWN_LABELS[charKey]}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={charKey}
                              placeholder="Ключ"
                              className="w-44 shrink-0 px-3 py-2 border border-gray-300 rounded-xl text-[11px] font-mono text-gray-700 bg-white"
                              onChange={(e) => {
                                const newKey = e.target.value.replace(/\s+/g, '_').toLowerCase();
                                const chars = { ...(editingProduct.characteristics || {}) };
                                const entries = Object.entries(chars);
                                const idx = entries.findIndex(([k]) => k === charKey);
                                entries.splice(idx, 1, [newKey, charVal]);
                                setEditingProduct({ ...editingProduct, characteristics: Object.fromEntries(entries) });
                              }}
                            />
                          )}
                          {/* Value */}
                          <input
                            type="text"
                            value={charVal}
                            placeholder="Значення..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white font-medium"
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              characteristics: { ...(editingProduct.characteristics || {}), [charKey]: e.target.value },
                            })}
                          />
                          {/* Delete row */}
                          <button
                            type="button"
                            title="Видалити характеристику"
                            onClick={() => {
                              const chars = { ...(editingProduct.characteristics || {}) };
                              delete chars[charKey];
                              setEditingProduct({ ...editingProduct, characteristics: chars });
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {Object.keys(editingProduct.characteristics || {}).length === 0 && (
                      <div className="text-[11px] text-gray-400 italic py-2">
                        Характеристики не задані. Натисніть «+ Поле» вище або додайте власне:
                      </div>
                    )}

                    {/* Add custom row */}
                    <button
                      type="button"
                      onClick={() => setEditingProduct({
                        ...editingProduct,
                        characteristics: {
                          ...(editingProduct.characteristics || {}),
                          [`custom_${Date.now()}`]: '',
                        },
                      })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dashed border-gray-300 rounded-xl text-[11px] font-bold text-gray-500 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Додати власну характеристику
                    </button>
                  </div>

                  {/* Live preview */}
                  {Object.keys(editingProduct.characteristics || {}).length > 0 && (
                    <details className="text-[11px]">
                      <summary className="cursor-pointer text-amber-700 font-bold hover:underline">
                        👁 Переглянути як виглядатиме на сайті
                      </summary>
                      <table className="mt-2 w-full max-w-sm text-xs border-collapse">
                        <tbody>
                          {Object.entries(editingProduct.characteristics || {}).map(([k, v]) => {
                            const LABELS: Record<string, string> = {
                              fabric:'Тканина / Матеріал', material:'Матеріал', texture:'Текстура',
                              color:'Основний колір', blackout:'Світлоізоляція', system:'Система керування',
                              manufacturer:'Виробник', country:'Країна виробника', care:'Догляд та чищення',
                              warranty:'Гарантія', type:'Тип виробу', width_range:'Діапазон ширини',
                              height_range:'Діапазон висоти', drive:'Привід', installation:'Спосіб монтажу',
                              collection:'Колекція', code:'Код тканини',
                            };
                            return v ? (
                              <tr key={k} className="border-b border-gray-100">
                                <td className="py-1.5 pr-4 text-gray-500">{LABELS[k] ?? k}</td>
                                <td className="py-1.5 font-bold text-gray-900">{v}</td>
                              </tr>
                            ) : null;
                          })}
                        </tbody>
                      </table>
                    </details>
                  )}
                </div>


              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddingNewProduct(false);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition"
                >
                  Скасувати
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveProduct(editingProduct)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span>Зберігаємо...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isAddingNewProduct ? 'Створити картку товару' : 'Зберегти зміни'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdminProducts.map((p) => {
              const isCustom = products.some((d) => d.id === p.id);
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl p-4 border shadow-xs flex flex-col justify-between space-y-3 ${
                    isCustom ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.main_image}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {p.category_slug}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              ✏️ Ваш товар
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 text-xs mt-1 line-clamp-1">{p.title}</h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-black text-sm text-gray-900">{p.base_price} грн</span>
                          {p.old_price && (
                            <span className="text-[11px] text-gray-400 line-through">{p.old_price} грн</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 line-clamp-2">{p.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <span className={`text-[11px] font-bold ${p.in_stock ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {p.in_stock ? '● В наявності' : '○ Під замовлення'}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsAddingNewProduct(false);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Редагувати"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Видалити"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Toggles */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleToggleFlag(p.id, 'is_popular', !p.is_popular)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        p.is_popular
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                      title="Переключити: Популярний товар"
                    >
                      ⭐ {p.is_popular ? 'Популярне' : 'Не популярне'}
                    </button>
                    <button
                      onClick={() => handleToggleFlag(p.id, 'is_new', !p.is_new)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        p.is_new
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                      title="Переключити: Новинка"
                    >
                      🆕 {p.is_new ? 'Новинка' : 'Не новинка'}
                    </button>
                    <button
                      onClick={() => handleToggleFlag(p.id, 'in_stock', !p.in_stock)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        p.in_stock
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}
                      title="Переключити: В наявності"
                    >
                      {p.in_stock ? '✅ В наявності' : '❌ Немає'}
                    </button>
                  </div>

                  {/* Analytics (shown if loaded) */}
                  {analytics[p.id] && (
                    <div className="flex gap-3 pt-1 text-[11px] text-gray-500">
                      <span>👁 {analytics[p.id].views} переглядів</span>
                      <span>🛒 {analytics[p.id].orders} замовлень</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------- 4. CALCULATOR RATES CMS ----------------- */}
      {activeTab === 'calculator' && (
        <form onSubmit={handleSaveCalculator} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Calculator className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Тарифи та формули онлайн-калькулятора</h2>
              <p className="text-xs text-gray-500">
                Зміна базових ставок за квадратний метр, коефіцієнтів тканини та додаткових опцій
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-gray-900">1. Базова ставка за 1 м² за категоріями</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Тканинні ролети (грн/м²)</label>
                <input
                  type="number"
                  value={calcForm.roletiBaseRate}
                  onChange={(e) => setCalcForm({ ...calcForm, roletiBaseRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Штори День-Ніч (грн/м²)</label>
                <input
                  type="number"
                  value={calcForm.shtoriBaseRate}
                  onChange={(e) => setCalcForm({ ...calcForm, shtoriBaseRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Жалюзі (грн/м²)</label>
                <input
                  type="number"
                  value={calcForm.zhaluziBaseRate}
                  onChange={(e) => setCalcForm({ ...calcForm, zhaluziBaseRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Закрита система (грн/м²)</label>
                <input
                  type="number"
                  value={calcForm.zakrytaBaseRate}
                  onChange={(e) => setCalcForm({ ...calcForm, zakrytaBaseRate: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-extrabold text-sm text-gray-900">2. Коефіцієнти типу тканини та додаткові опції</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Коефіцієнт тканини Преміум</label>
                <input
                  type="number"
                  step="0.05"
                  value={calcForm.premiumMultiplier}
                  onChange={(e) => setCalcForm({ ...calcForm, premiumMultiplier: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Коефіцієнт тканини Блекаут</label>
                <input
                  type="number"
                  step="0.05"
                  value={calcForm.blackoutMultiplier}
                  onChange={(e) => setCalcForm({ ...calcForm, blackoutMultiplier: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Доплата за ліску (грн)</label>
                <input
                  type="number"
                  value={calcForm.lineFixationCost}
                  onChange={(e) => setCalcForm({ ...calcForm, lineFixationCost: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Доплата за електропривод (грн)</label>
                <input
                  type="number"
                  value={calcForm.motorizationCost}
                  onChange={(e) => setCalcForm({ ...calcForm, motorizationCost: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={resetDefaults}
              className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Скинути до стандартних</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти розцінки</span>
            </button>
          </div>
        </form>
      )}

      {/* ----------------- GALLERY CMS TAB ----------------- */}
      {activeTab === 'gallery' && (
        <form onSubmit={handleSaveGallery} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                📸 Управління фотогалереєю реалізованих проєктів
              </h2>
              <p className="text-xs text-gray-500">
                Змінюйте фотографії, заголовки, міста та категорії робіт майстра на головній сторінці сайту
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const newItem: GalleryItem = {
                    id: Date.now(),
                    title: 'Нова виконана робота (монтаж ролет / штори)',
                    city: 'м. Дніпро',
                    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
                    category: 'День-Ніч',
                  };
                  setGalleryForm([...galleryForm, newItem]);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Додати роботу</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Зберегти галерею</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryForm.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4 relative group"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    Картка #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Видалити цю роботу з галереї?')) {
                        setGalleryForm(galleryForm.filter((_, i) => i !== idx));
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Видалити роботу"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {/* Image Preview & File Upload */}
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50 shadow-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>📁 Завантажити фото з ПК</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  const updated = [...galleryForm];
                                  updated[idx].image = ev.target.result as string;
                                  setGalleryForm(updated);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-0.5">
                        Або URL посилання:
                      </label>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const updated = [...galleryForm];
                          updated[idx].image = e.target.value;
                          setGalleryForm(updated);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 mb-1">Заголовок / Назва роботи *</label>
                    <input
                      type="text"
                      required
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...galleryForm];
                        updated[idx].title = e.target.value;
                        setGalleryForm(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Локація / Місто *</label>
                    <input
                      type="text"
                      required
                      value={item.city}
                      onChange={(e) => {
                        const updated = [...galleryForm];
                        updated[idx].city = e.target.value;
                        setGalleryForm(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Категорія (Тег) *</label>
                    <input
                      type="text"
                      required
                      value={item.category}
                      onChange={(e) => {
                        const updated = [...galleryForm];
                        updated[idx].category = e.target.value;
                        setGalleryForm(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти зміни в галереї</span>
            </button>
          </div>
        </form>
      )}

      {/* ----------------- 5. CONTACTS CMS ----------------- */}
      {activeTab === 'contacts' && (
        <form onSubmit={handleSaveContacts} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Phone className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Контактна інформація та майстер</h2>
              <p className="text-xs text-gray-500">
                Телефони, посилання на соцмережі, графік та умови доставки
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Контактна особа / Майстер *</label>
              <input
                type="text"
                value={contactsForm.masterName}
                onChange={(e) => setContactsForm({ ...contactsForm, masterName: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Місто / Локація *</label>
              <input
                type="text"
                value={contactsForm.city}
                onChange={(e) => setContactsForm({ ...contactsForm, city: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Основний телефон *</label>
              <input
                type="text"
                value={contactsForm.phone1}
                onChange={(e) => setContactsForm({ ...contactsForm, phone1: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Додатковий телефон</label>
              <input
                type="text"
                value={contactsForm.phone2}
                onChange={(e) => setContactsForm({ ...contactsForm, phone2: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Email для сповіщень про нові замовлення *</label>
              <input
                type="email"
                placeholder="zhaluzi.dnipro@gmail.com"
                value={contactsForm.email || ''}
                onChange={(e) => setContactsForm({ ...contactsForm, email: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Посилання на Instagram</label>
              <input
                type="text"
                value={contactsForm.instagramUrl}
                onChange={(e) => setContactsForm({ ...contactsForm, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Посилання на Telegram</label>
              <input
                type="text"
                value={contactsForm.telegramUrl}
                onChange={(e) => setContactsForm({ ...contactsForm, telegramUrl: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-mono text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Номер Viber</label>
              <input
                type="text"
                value={contactsForm.viberNumber}
                onChange={(e) => setContactsForm({ ...contactsForm, viberNumber: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Графік роботи</label>
              <input
                type="text"
                value={contactsForm.workHours}
                onChange={(e) => setContactsForm({ ...contactsForm, workHours: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Сума для безкоштовної доставки (грн)</label>
              <input
                type="number"
                value={contactsForm.deliveryFreeThreshold}
                onChange={(e) => setContactsForm({ ...contactsForm, deliveryFreeThreshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти контакти</span>
            </button>
          </div>
        </form>
      )}

      {/* ----------------- 6. PROMO & BANNERS CMS ----------------- */}
      {activeTab === 'promo' && (
        <form onSubmit={handleSavePromo} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6 max-w-4xl">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Megaphone className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Банери та рекламні тексти</h2>
              <p className="text-xs text-gray-500">
                Керуйте текстом рекламної плашки у шапці та головними заголовками
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Рекламна плашка у самій шапці сайту (Top Banner)
              </label>
              <input
                type="text"
                value={promoForm.topBannerText}
                onChange={(e) => setPromoForm({ ...promoForm, topBannerText: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
              <p className="text-[11px] text-gray-400 mt-1">Залиште порожнім, якщо бажаєте приховати плашку.</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Головний заголовок сторінки (Hero Title)
              </label>
              <input
                type="text"
                value={promoForm.heroTitle}
                onChange={(e) => setPromoForm({ ...promoForm, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Підзаголовок / УТП (Hero Subtitle)
              </label>
              <textarea
                rows={2}
                value={promoForm.heroSubtitle}
                onChange={(e) => setPromoForm({ ...promoForm, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Бейдж акції / знижки (наприклад: "🔥 Знижки до -25% на День-Ніч")
              </label>
              <input
                type="text"
                value={promoForm.heroDiscountBadge}
                onChange={(e) => setPromoForm({ ...promoForm, heroDiscountBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти тексти</span>
            </button>
          </div>
        </form>
      )}

      {/* ----------------- 7. LOGS TAB ----------------- */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Рівень:</span>
              {(['ALL', 'SUCCESS', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    logFilter === lvl
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Пошук по логах..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 flex-1 sm:w-64"
              />
              <button
                onClick={handleClearLogs}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                title="Очистити журнал"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
              <Activity className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800">Логів не знайдено</h3>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, idx) => {
                const isExpanded = expandedLogId === (log.id || String(idx));
                const badgeColor =
                  log.level === 'SUCCESS'
                    ? 'bg-emerald-100 text-emerald-800'
                    : log.level === 'ERROR'
                    ? 'bg-red-100 text-red-800'
                    : log.level === 'WARN'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800';

                return (
                  <div
                    key={log.id || idx}
                    className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-2xs hover:shadow-xs transition text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${badgeColor}`}>
                          {log.level}
                        </span>
                        <span className="font-mono font-bold text-gray-800">{log.action}</span>
                        <span className="text-gray-600">{log.message}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('uk-UA')}
                        </span>
                        {log.details && (
                          <button
                            onClick={() =>
                              setExpandedLogId(isExpanded ? null : log.id || String(idx))
                            }
                            className="text-gray-400 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && log.details && (
                      <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[10px] overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------- 8. DATABASE & CREDENTIALS TAB ----------------- */}
      {activeTab === 'db' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Адміністратор сайту</h2>
                <p className="text-xs text-gray-500">Доступ до панелі керування /admin</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">URL адмінки:</span>
                <span className="font-mono font-bold text-blue-600">/admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Логін:</span>
                <span className="font-mono font-bold text-gray-900">admin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Пароль:</span>
                <span className="font-mono font-bold text-gray-900">Dnipro2026!</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-emerald-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900">Хмарна база Supabase</h2>
                <p className="text-xs text-gray-500">PostgreSQL база даних</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-700">
              <div>
                <span className="text-gray-500 block mb-0.5">Project ID:</span>
                <span className="font-mono font-bold text-gray-900">pnerikwvvtehclswgstb</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Supabase URL:</span>
                <span className="font-mono text-[11px] text-blue-600 break-all">
                  https://pnerikwvvtehclswgstb.supabase.co
                </span>
              </div>
              <a
                href="https://supabase.com/dashboard/project/pnerikwvvtehclswgstb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
              >
                <span>Відкрити кабінет Supabase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
