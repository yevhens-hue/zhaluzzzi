'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { BASE_SITE_URL } from '@/lib/feeds';
import {
  Rss,
  Copy,
  ExternalLink,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShoppingBag,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface FeedsTabProps {
  products: Product[];
  onImportProducts: (newProducts: Product[]) => Promise<void>;
  showNotification: (msg: string) => void;
}

export default function FeedsTab({ products, onImportProducts, showNotification }: FeedsTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedItems, setParsedItems] = useState<Partial<Product>[]>([]);
  const [importFileName, setImportFileName] = useState<string | null>(null);

  const feedsList = [
    {
      id: 'gmc-uk',
      title: 'Google Merchant Center • Українська версія (UK)',
      desc: 'Офіційний RSS 2.0 XML фід з українськими назвами, категоріями та цінами в UAH для Google Shopping.',
      url: `${BASE_SITE_URL}/api/feeds/google-merchant/uk`,
      directPath: '/api/feeds/google-merchant/uk',
      badge: '🇺🇦 UK Feed',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'gmc-ru',
      title: 'Google Merchant Center • Російська версія (RU)',
      desc: 'Офіційний RSS 2.0 XML фід з російськими назвами та категоріями для Google Shopping (російськомовні запити в Україні).',
      url: `${BASE_SITE_URL}/api/feeds/google-merchant/ru`,
      directPath: '/api/feeds/google-merchant/ru',
      badge: '🇷🇺 RU Feed',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'rozetka',
      title: 'Rozetka & Prom Marketplace • YML XML',
      desc: 'Стандартний YML фід для вивантаження каталогу товарів на маркетплейси Rozetka, Prom.ua, Hotline.',
      url: `${BASE_SITE_URL}/api/feeds/rozetka`,
      directPath: '/api/feeds/rozetka',
      badge: '🛍️ Marketplace YML',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const handleCopy = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    showNotification('✅ Посилання на фід скопійовано в буфер обміну!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Parse uploaded XML (supports Google RSS <item> and Rozetka/Prom <offer>)
  const handleXmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Check for XML parse errors
        const parserError = xmlDoc.getElementsByTagName('parsererror');
        if (parserError.length > 0) {
          showNotification('❌ Помилка синтаксису XML файлу.');
          return;
        }

        const items: Partial<Product>[] = [];

        // Try Google Merchant <item> tags
        const gItems = xmlDoc.getElementsByTagName('item');
        if (gItems.length > 0) {
          for (let i = 0; i < gItems.length; i++) {
            const el = gItems[i];
            const title = el.getElementsByTagName('g:title')[0]?.textContent || el.getElementsByTagName('title')[0]?.textContent || 'Без назви';
            const sku = el.getElementsByTagName('g:id')[0]?.textContent || `item-${i + 1}`;
            const desc = el.getElementsByTagName('g:description')[0]?.textContent || '';
            const priceStr = el.getElementsByTagName('g:price')[0]?.textContent || '349';
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 349;
            const img = el.getElementsByTagName('g:image_link')[0]?.textContent || '';

            items.push({
              id: `imp-${Date.now()}-${i}`,
              title: title.trim(),
              sku: sku.trim(),
              description: desc.trim(),
              base_price: price,
              main_image: img.trim() || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
              images: [img.trim() || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg'],
              category_slug: 'roleti',
              in_stock: true,
              rating: 5,
              reviews_count: 0,
              price_unit: 'грн',
              characteristics: {},
            });
          }
        }

        // Try YML <offer> tags
        const offers = xmlDoc.getElementsByTagName('offer');
        if (offers.length > 0) {
          for (let i = 0; i < offers.length; i++) {
            const el = offers[i];
            const title = el.getElementsByTagName('name')[0]?.textContent || 'Без назви';
            const sku = el.getAttribute('id') || `offer-${i + 1}`;
            const desc = el.getElementsByTagName('description')[0]?.textContent || '';
            const priceStr = el.getElementsByTagName('price')[0]?.textContent || '349';
            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 349;
            const img = el.getElementsByTagName('picture')[0]?.textContent || '';

            items.push({
              id: `imp-${Date.now()}-${i}`,
              title: title.trim(),
              sku: sku.trim(),
              description: desc.trim(),
              base_price: price,
              main_image: img.trim() || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
              images: [img.trim() || 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg'],
              category_slug: 'roleti',
              in_stock: true,
              rating: 5,
              reviews_count: 0,
              price_unit: 'грн',
              characteristics: {},
            });
          }
        }

        if (items.length === 0) {
          showNotification('⚠️ У файлі не знайдено тегів <item> або <offer>.');
          return;
        }

        setParsedItems(items);
        showNotification(`📋 Зчитано ${items.length} товарів з XML! Натисніть «Імпортувати в базу».`);
      } catch (err) {
        console.error('XML read error:', err);
        showNotification('❌ Помилка зчитування XML.');
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (parsedItems.length === 0) return;
    setIsImporting(true);
    try {
      const fullProducts: Product[] = parsedItems.map((item, idx) => ({
        id: item.id || `prod-import-${Date.now()}-${idx}`,
        slug: item.title
          ? item.title.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '')
          : `item-${Date.now()}-${idx}`,
        title: item.title || 'Новий товар',
        sku: item.sku || `SKU-${Date.now()}-${idx}`,
        category_slug: item.category_slug || 'roleti',
        base_price: item.base_price || 349,
        price_unit: 'грн',
        min_width: 30,
        max_width: 250,
        min_height: 40,
        max_height: 300,
        base_width: 50,
        base_height: 100,
        price_per_sqm: 650,
        main_image: item.main_image || '',
        images: item.images || [item.main_image || ''],
        in_stock: true,
        rating: 5,
        reviews_count: 0,
        description: item.description || '',
        characteristics: item.characteristics || {},
        available_colors: [],
      }));

      await onImportProducts(fullProducts);
      setParsedItems([]);
      setImportFileName(null);
      showNotification(`✅ Успішно імпортовано ${fullProducts.length} товарів у базу!`);
    } catch (err) {
      console.error(err);
      showNotification('❌ Помилка імпорту товарів.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <Rss className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Google Merchant Center & XML Data Feeds</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Автоматичні товарні фіди для реклами та маркетплейсів
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Постійні прямі URL-адреси XML-фідів. Синхронізація товарів, актуальних цін, наявності та знижок
            відбувається у реальному часі безпосередньо з вашої бази даних.
          </p>
        </div>
      </div>

      {/* ── Active Live Feeds List ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-blue-600" />
            <span>Прямі посилання для додавання в Google Merchant Center:</span>
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Товарів у фіді: <b className="text-gray-900">{products.filter((p) => p.in_stock !== false).length}</b>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {feedsList.map((feed) => (
            <div
              key={feed.id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${feed.badgeColor}`}>
                    {feed.badge}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900">{feed.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={feed.directPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-3 py-1.5 rounded-xl transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Відкрити XML</span>
                  </a>
                  <button
                    onClick={() => handleCopy(feed.id, feed.url)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                  >
                    {copiedKey === feed.id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Скопійовано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Копіювати URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500">{feed.desc}</p>

              {/* Feed URL codebox */}
              <div className="flex items-center justify-between bg-slate-900 text-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono break-all border border-slate-800">
                <span className="text-emerald-400 select-all">{feed.url}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Instructions for Google Merchant Center ─────────────────────── */}
      <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-100 space-y-4">
        <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Інструкція для налаштування Google Merchant Center (за 1 хвилину):</span>
        </h3>
        <ol className="text-xs text-blue-900/80 space-y-2 list-decimal list-inside leading-relaxed font-medium">
          <li>Увійдіть у кабінет <b>Google Merchant Center</b> ➔ розділ <b>«Товари»</b> ➔ <b>«Джерела даних»</b>.</li>
          <li>Натисніть <b>«Додати джерело даних про товари»</b> та оберіть спосіб <b>«Файл (URL-адреса)»</b>.</li>
          <li>Вставте скопійовану вище URL-адресу фіду (окремо для <b>Укр</b> та <b>Рос</b>).</li>
          <li>Встановіть частоту оновлення: <b>Щодня (Daily)</b>. Google автоматично підтягне всі актуальні ціни та фото!</li>
        </ol>
      </div>

      {/* ── XML / Table Product Importer ───────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              <span>Імпорт та оновлення товарів через XML / Таблицю</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Завантажте XML файл (Google Shopping XML або Rozetka/Prom YML) для масового додавання або оновлення асортименту.
            </p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-gray-50/50 space-y-3">
          <input
            type="file"
            id="xml-file-input"
            accept=".xml,.yml"
            onChange={handleXmlFileUpload}
            className="hidden"
          />
          <label
            htmlFor="xml-file-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileCode className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-gray-900">
              {importFileName ? `Обрано файл: ${importFileName}` : 'Натисніть, щоб обрати .XML або .YML файл'}
            </span>
            <span className="text-xs text-gray-500">
              Підтримуються стандарти Google RSS 2.0 та Prom/Rozetka YML
            </span>
          </label>
        </div>

        {/* Parsed Preview Table */}
        {parsedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Попередній перегляд знайдених товарів ({parsedItems.length}):
              </h4>
              <button
                onClick={handleConfirmImport}
                disabled={isImporting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isImporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Імпортувати всі ({parsedItems.length}) в базу</span>
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Назва</th>
                    <th className="p-3">Ціна (грн)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parsedItems.slice(0, 50).map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/80">
                      <td className="p-3 font-mono font-bold text-gray-500">{item.sku}</td>
                      <td className="p-3 font-medium text-gray-900">{item.title}</td>
                      <td className="p-3 font-bold text-emerald-600">{item.base_price} грн</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
