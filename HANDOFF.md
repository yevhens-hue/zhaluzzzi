# 📑 Engineering Continuity & Production Handoff Package: Жалюзі та Рулонні Штори Дніпро

**Поточна версія:** `v2.5.0` (25.08.2026)  
**Реліз:** *Shadcn Design System & Seamless View Transitions*  
**Production URL:** [https://zhaluzi-rolety-dnipro.vercel.app](https://zhaluzi-rolety-dnipro.vercel.app)  
**GitHub Repository:** [https://github.com/yevhens-hue/zhaluzzzi](https://github.com/yevhens-hue/zhaluzzzi)  
**Admin Panel:** [https://zhaluzi-rolety-dnipro.vercel.app/admin](https://zhaluzi-rolety-dnipro.vercel.app/admin)  
**Admin Credentials:**  
- **Login:** `admin`  
- **Password:** `Dnipro2026!`  
**Language Lock:** 100% Ukrainian (`uk`) across all 21 routes.

---

## 🏛️ Структура та Карта компонентів

```
├── app/
│   ├── page.tsx                     # Головна сторінка (Hero, Категорії, Каталог, Галерея робіт, AI Консультант)
│   ├── visualizer/page.tsx          # 3D Візуалізатор тканин на вікні (SEO, окрема сторінка)
│   ├── admin/page.tsx               # Модульна Адмін-панель & CMS (Замовлення, Ліди, Товари, Калькулятор, Контакти)
│   ├── catalog/page.tsx             # Каталог товарів з живими фільтрами та пошуком
│   ├── product/[slug]/page.tsx      # Картка товару + Конфігуратор розмірів + Кнопка 3D Примірки
│   ├── checkout/page.tsx            # Оформлення замовлення з валідацією UA телефонів та операторів
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/route.ts        # Авторизація адміна (Dnipro2026! + Rate Limit)
│   │   │   ├── products/route.ts    # CRUD товарів у базі Supabase (upsert за ID)
│   │   │   └── telegram/test/route.ts # Тестова відправка повідомлення в Telegram
│   │   ├── webhooks/
│   │   │   └── telegram/route.ts    # Telegram Bot Webhook (/start, /stats, /orders, /leads, /id)
│   │   ├── notify/route.ts          # Диспетчер сповіщень: Email (HTML), SMS (TurboSMS) та Telegram
│   │   ├── tracking/route.ts        # Нова Пошта Live TTN Tracking API
│   │   ├── chat/route.ts            # AI Консультант (SSE streaming, tool calling розрахунку ціни)
│   │   └── revalidate/route.ts      # Миттєва ревалідація кешу Next.js після змін
├── components/
│   ├── Header.tsx                   # Хедер з кнопкою 3D Примірки, ТТН та телефонами
│   ├── Footer.tsx                   # Футер з бейджем версії v2.4.0
│   ├── ProductDetailView.tsx        # Картка товару з модалкою 3D візуалізатора
│   ├── visualizer/
│   │   ├── RoomVisualizer.tsx       # 3D/Canvas Візуалізатор (День-Ніч, Рулонні, Жалюзі, Блекаут)
│   │   └── RoomVisualizerModal.tsx  # Модальне вікно примірки на вікні
│   ├── admin/                       # Модульні вкладки адмін-панелі
│   │   ├── AdminHeader.tsx          # Шапка адмінки з бейджем версії v2.4.0
│   │   ├── AdminLogin.tsx           # Екран входу з індикатором CapsLock
│   │   └── tabs/                    # OrdersTab, LeadsTab, ProductsTab, ContactsTab (Telegram), etc.
│   └── ai/
│       └── AiConsultantWidget.tsx   # AI Консультант з калькулятором вартості та рекомендаціями
├── lib/
│   ├── version.ts                   # Конфіг версії (v2.4.0) та назви релізу
│   ├── telegram.ts                  # Клієнт Telegram Bot API (форматування, інлайн-кнопки)
│   ├── notifications.ts             # Відправка Email, SMS та Telegram сповіщень
│   ├── phoneValidator.ts            # Валідатор українських номерів та операторів (+380...)
│   ├── siteSettings.ts              # Конфіг налаштувань сайту (SiteContacts, PromoContent)
│   └── supabase.ts                  # Supabase клієнт та прямі запити до БД
└── .github/
    ├── dependabot.yml               # Щотижневе авто-оновлення npm залежностей
    └── workflows/
        ├── e2e.yml                  # Playwright E2E тести
        ├── lighthouse.yml           # Lighthouse CI (Speed & SEO аудит)
        ├── security-scan.yml        # Gitleaks сканування секретів
        └── supabase-migrations.yml  # Валідація SQL міграцій
```

---

## 🚀 Ключові можливості версії `v2.4.0`

| Функціонал | Опис | Статус |
| :--- | :--- | :--- |
| **3D Візуалізатор тканин** | Інтерактивна примірка рулонних штор, День-Ніч, жалюзі та блекауту на 4 центрованих кімнатах або на власному фото вікна клієнта | ✅ Live & Опубліковано |
| **Telegram Bot сповіщення** | Миттєві картки нових замовлень та лідів з кнопками швидкого дзвінка, перегляду в адмінці та командами `/stats`, `/orders`, `/leads` | ✅ Live & Опубліковано |
| **Надійність Адмін-панелі** | Збереження та редагування карток товарів безпосередньо у Supabase за первинним ключем `id` без конфліктів посилань | ✅ Live & Опубліковано |
| **Автоматичний Fallback** | Каталог завжди стабільно відображає товари навіть за тимчасової недоступності БД | ✅ Live & Опубліковано |
| **Семантичне версіонування** | Відображення актуальної версії `v2.4.0` в адмінці, на екрані входу та у футері сайту | ✅ Live & Опубліковано |
| **GitHub CI/CD & Автотести** | Синхронізація з репозиторієм, автодеплой на Vercel, тести Playwright, аудит швидкості Lighthouse, Dependabot | ✅ Live & Опубліковано |

---

## 🗺️ План подальшого розвитку (Roadmap інтеграцій)

Наступні рекомендовані відкриті модулі та проекти для інтеграції:
1. **📦 Вибір відділень Нової Пошти у чекауті (`np-api`):** автокомпліт міст та випадаючий список відділень/поштоматів на сторінці `/checkout` + генерація ТТН з адмінки в 1 клік.
2. **💳 Онлайн-оплата та «Покупка частинами» (Monobank / LiqPay):** прийом оплат Apple Pay / Google Pay та розстрочка без переплат.
3. **📄 PDF-специфікації та виробничі наряди (`@react-pdf/renderer`):** автоматичне формування комерційних пропозицій для клієнта та нарядів на розкрій для цеху.
4. **🌐 Експорт фіідів на Rozetka / Prom.ua / Google Shopping (`xmlbuilder2`):** автоматична вивантаження товарів у Google Merchant Center та маркетплейси.
5. **🗺️ Інтерактивна карта районів Дніпра (`leaflet`):** вибір району заміру з графіком виїзду майстра.
6. **📢 Live Social Proof сповіщення (`framer-motion`):** ненав'язливі плашки про нещодавні замовлення для підвищення конверсії.
7. **🛡️ Непомітний захист від спаму (`@marsidev/react-turnstile`):** Cloudflare Turnstile на формах без капчі.

---

## 🛠️ Інструкція для розробника (Runbook)

### 1. Локальна збірка та перевірка типів
```bash
npm run build
```

### 2. Запуск локального сервера розробки
```bash
npm run dev
```

### 3. Запуск Playwright E2E тестів
```bash
npx playwright test
```

### 4. Відправка змін у GitHub та автоматичний деплой на Vercel
```bash
git add .
git commit -m "your commit message"
git push origin main
```

---

*Handoff package сформовано, оновлено та зафіксовано 25 серпня 2026 року.*
