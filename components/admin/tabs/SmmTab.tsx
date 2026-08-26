'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types/database';
import { BASE_SITE_URL } from '@/lib/feeds';
import {
  Sparkles,
  Copy,
  CheckCircle2,
  Calendar,
  Send,
  Share2,
  Camera,
  Image as ImageIcon,
  Tag,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

interface SmmTabProps {
  products: Product[];
  showNotification: (msg: string) => void;
}

type PostTemplateType = 'product_review' | 'promo_sale' | 'measurement_tip' | 'customer_case' | 'day_night_vs_blackout';

export default function SmmTab({ products, showNotification }: SmmTabProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [templateType, setTemplateType] = useState<PostTemplateType>('product_review');
  const [copied, setCopied] = useState(false);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Generate platform-ready SMM post based on selected product and template
  const generatedPost = useMemo(() => {
    if (!selectedProduct) return '';

    const price = selectedProduct.base_price || 349;
    const oldPrice = selectedProduct.old_price ? `${selectedProduct.old_price} грн` : `${Math.round(price * 1.2)} грн`;
    const productUrl = `${BASE_SITE_URL}/product/${selectedProduct.slug}`;

    switch (templateType) {
      case 'product_review':
        return `✨ ХІТ ПРОДАЖІВ: ${selectedProduct.title} ✨

Шукаєте надійний захист від сонця та стильне доповнення до вашого інтер'єру? Ця модель — фаворит наших замовників у Дніпрі! 🪟

🔹 Чому обирають цю систему:
• Виготовлення під точний розмір вашого вікна за 1–3 дні
• Спеціальне пиловідштовхуюче просочення (не вбирає вологу та бруд)
• Надійна польська фурнітура Besta з плавним ходом
• Гарантія 12–24 місяці

💰 Ціна: від ${price} грн (замість ${oldPrice})

🚗 Безкоштовний виїзд замірника зі зразками всіх тканин по Дніпру при замовленні!

📲 Для замовлення або прорахунку розмірів — пишіть у Direct або телефонуйте:
📞 093 912 85 31 (Telegram / Viber)
🌐 Деталі та онлайн-калькулятор: ${productUrl}

#жалюзідніпро #рулонніштори #ролетидніпро #шторидніпро #сонцезахисідніпро #жалюзинавікна #інтерєр`;

      case 'promo_sale':
        return `🔥 ГАРЯЧА ПРОПОЗИЦІЯ ТИЖНЯ: ЗНИЖКА -20% НА РОЛЕТИ 🔥

Оновіть сонцезахист на вікнах з максимальною вигодою від фабрики «Жалюзи»!

🏷️ Спеціальна ціна на модель: «${selectedProduct.title}»
💥 Всього від ${price} грн (стара ціна ${oldPrice})!

🎁 ДОДАТКОВІ БОНУСИ:
1. При замовленні від 4-х виробів — додаткова знижка -7% АБО безкоштовна доставка Новою Поштою!
2. Безкоштовний виїзд майстра на замір по Дніпру зі зразками понад 500 тканин.

⏳ Акція діє до кінця тижня! Кількість тканини на складі обмежена.

📩 Напишіть розміри ваших вікон у повідомлення — розрахуємо точну вартість за 2 хвилини!
📞 093 912 85 31
🌐 Замовити на сайті: ${productUrl}

#акціядніпро #знижкидніпро #рулоннішториакція #жалюзідніпро #ролетиакція`;

      case 'measurement_tip':
        return `📐 ЛАЙФХАК ВІД МАЙСТРА: Як заміряти вікно для ролет за 1 хвилину?

Зберігайте чек-лист, щоб не помилитися у розмірах! 👇

1️⃣ Візьміть металеву рулетку (м'який швейний сантиметр дає похибку до 2 см!).
2️⃣ Для відкритої системи Міні: виміряйте ширину по стику штапиків (скло + штапики) та додайте 10-15 мм запасу тканини.
3️⃣ Висота — це габарит усієї стулки вікна від верху до низу.
4️⃣ Враховуйте розташування віконної ручки, щоб тканина вільно опускалася!

Не хочете міряти самі? Наш майстер приїде до вас з каталогами та зробить професійний замір БЕЗКОШТОВНО! 🧰

📞 Виклик майстра: 093 912 85 31
🌐 Каталог моделей: ${productUrl}

#замірвікон #якзамірятижалюзі #корисніпоради #шторидніпро #рулонніштори`;

      case 'customer_case':
        return `🌟 РЕАЛІЗОВАНИЙ ОБ'ЄКТ У ДНІПРІ 🌟

Фотозвіт зі встановлення сонцезахисної системи в ЖК на Набережній Перемоги! 🏢

Клиєнти звернулися з проблемою: сонячний бік, влітку кімната перегрівалася, а на екрані телевізора були відблиски.

✅ Що було встановлено:
• Модель: ${selectedProduct.title}
• Тканина з високим ступенем затемнення та термозахистом
• Час виготовлення: 2 робочих дні
• Монтаж: 40 хвилин без пилу та шуму

Клієнти задоволені на 100%! В кімнаті стало прохолодніше, а інтер'єр набув затишного вигляду. ✨

Хочете так само?
📞 Телефонуйте: 093 912 85 31
🌐 Розрахувати ціну: ${productUrl}

#відгукиклієнтів #дніпроштори #ролетидніпро #жалюзіфото #монтажжалюзі`;

      case 'day_night_vs_blackout':
        return `🌗 ДЕНЬ-НІЧ ЧИ 100% БЛЕКАУТ: ЩО ОБРАТИ ДЛЯ ВАШОЇ КІМНАТИ?

Часто постає питання: яка система краще підійде саме вам? Розбираємо коротко і по суті! 👇

1️⃣ ШТОРИ ДЕНЬ-НІЧ (ЗЕБРА):
• Чергування прозорих та щільних смуг.
• Дозволяє плавно регулювати рівень освітлення, не піднімаючи штору.
• Ідеально для: вітальні, кухні, кабінету, сучасних студій.

2️⃣ РОЛЕТИ БЛЕКАУТ (BLACKOUT 100%):
• Повне світлонепроникне полотно зі світловідбивним шаром.
• Створює повну темряву навіть опівдні.
• Ідеально для: спальні, дитячої, домашніх кінотеатрів.

Зразок у нашому каталозі: «${selectedProduct.title}» (від ${price} грн).

Не можете визначитися? Замовте виїзд замірника зі зразками тканин та оцініть їх при вашому освітленні! ☀️

📞 093 912 85 31
🌐 Деталі: ${productUrl}

#деньніч #блекаут #порівнянняштор #жалюзідніпро #ролети`;

      default:
        return '';
    }
  }, [selectedProduct, templateType]);

  const handleCopyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    showNotification('✅ Текст поста з хештегами та посиланнями скопійовано!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(BASE_SITE_URL)}&text=${encodeURIComponent(generatedPost)}`;
    window.open(tgUrl, '_blank');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin [animation-duration:8s]" />
          <span>SMM Content Engine & Social Media Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          Генератор контенту для Instagram, Telegram та Facebook
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
          Створюйте продаючі та експертні пости в 1 клік на основі актуальних товарів, цін та переваг вашого виробництва у Дніпрі.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Controls & Product Picker (5 cols) ─────────── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Product selector */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              1. Оберіть товар для публікації:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.base_price} грн)
                </option>
              ))}
            </select>

            {/* Selected Product Snapshot */}
            {selectedProduct && (
              <div className="flex items-center gap-3 p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                <img
                  src={selectedProduct.main_image}
                  alt={selectedProduct.title}
                  className="w-14 h-14 rounded-lg object-cover border border-purple-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{selectedProduct.title}</h4>
                  <p className="text-[11px] font-bold text-purple-700 mt-0.5">{selectedProduct.base_price} грн</p>
                  <p className="text-[10px] text-gray-500 truncate">Артикул: {selectedProduct.sku}</p>
                </div>
              </div>
            )}
          </div>

          {/* Template Format Selector */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              2. Формат та мета публікації:
            </label>

            <div className="space-y-2">
              {[
                { id: 'product_review', label: '🌟 Огляд товару (Хіт продажів)', desc: 'Опис переваг, ціна та заклик до замовлення' },
                { id: 'promo_sale', label: '🔥 Акція та знижка тижня', desc: 'Спецпропозиція з дедлайном та бонусами' },
                { id: 'measurement_tip', label: '📐 Лайфхак із заміру вікна', desc: 'Експертний навчальний пост від замірника' },
                { id: 'customer_case', label: '🏢 Кейс / Реалізований об\'єкт', desc: 'Фотозвіт зі встановлення у Дніпрі' },
                { id: 'day_night_vs_blackout', label: '🌗 Порівняння День-Ніч vs Блекаут', desc: 'Гід по вибору між двома системами' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplateType(tpl.id as PostTemplateType)}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    templateType === tpl.id
                      ? 'bg-purple-50 border-purple-300 text-purple-900 ring-2 ring-purple-400/30'
                      : 'bg-gray-50/60 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-xs font-bold">{tpl.label}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Column: Generated Post Preview & Actions (7 cols) ──── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                <Send className="w-4 h-4 text-purple-600" />
                <span>Готовий текст публікації:</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareTelegram}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>В Telegram</span>
                </button>
                <button
                  onClick={handleCopyPost}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Скопійовано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копіювати текст</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formatted Textarea Preview */}
            <textarea
              readOnly
              value={generatedPost}
              rows={16}
              className="w-full bg-slate-900 text-gray-100 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none select-all"
            />
          </div>
        </div>
      </div>

      {/* ── Weekly SMM Content Plan Schedule ──────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h3 className="text-base font-bold text-gray-900">
            Рекомендований контент-план публікацій на 7 днів:
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { day: 'Понеділок', tag: 'Огляд', title: 'Хіт продажів тижня', icon: '🌟' },
            { day: 'Вівторок', tag: 'Порада', title: 'Як правильно заміряти', icon: '📐' },
            { day: 'Середа', tag: 'Акція', title: 'Знижка -20% на Blackout', icon: '🔥' },
            { day: 'Четвер', tag: 'Reels/Відео', title: 'До/Після встановлення', icon: '🎥' },
            { day: 'П\'ятниця', tag: 'Кейс', title: 'Об\'єкт у ЖК Дніпра', icon: '🏢' },
            { day: 'Субота', tag: 'Відгук', title: 'Враження клієнта', icon: '💬' },
            { day: 'Неділя', tag: 'Опитування', title: 'День-Ніч чи Ролети?', icon: '📊' },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-1 text-center">
              <span className="text-xl block">{item.icon}</span>
              <div className="text-[11px] font-bold text-purple-700 uppercase">{item.day}</div>
              <div className="text-xs font-bold text-gray-900 leading-snug">{item.title}</div>
              <span className="inline-block text-[10px] font-medium text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full mt-1">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
