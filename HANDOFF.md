# 📑 Engineering Continuity & Production Handoff Package: Жалюзі та Рулонні Штори Дніпро

**Поточна версія:** `v2.6.1` (25.08.2026)  
**Реліз:** *Studio Header Redesign & Product Snapshot*  
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
│   ├── page.tsx                     # Головна сторінка (Hero, Слайдер До/Після, Категорії, Топ, Калькулятор, Матеріали, Галерея, FAQ)
│   ├── visualizer/page.tsx          # 3D Візуалізатор тканин на вікні (День-Ніч, Рулонні, Алюміній 25мм, Блекаут)
│   ├── admin/page.tsx               # Модульна Адмін-панель & CMS (Замовлення, Ліди, Товари, Калькулятор, Контакти)
│   ├── catalog/page.tsx             # Каталог товарів з живими фільтрами та пошуком
│   ├── product/[slug]/page.tsx      # Картка товару + Конфігуратор розмірів + View Transitions morphing
│   ├── checkout/page.tsx            # Оформлення замовлення з валідацією UA телефонів та вибором Нової Пошти
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/route.ts        # Авторизація адміна (Dnipro2026! + Rate Limit)
│   │   │   ├── products/route.ts    # CRUD товарів у базі Supabase
│   │   │   └── telegram/test/route.ts # Тестова відправка повідомлення в Telegram
│   │   ├── webhooks/
│   │   │   └── telegram/route.ts    # Telegram Bot Webhook (/start, /stats, /orders, /leads, /id)
│   │   ├── notify/route.ts          # Диспетчер сповіщень: Email (HTML), SMS (TurboSMS) та Telegram
│   │   ├── tracking/route.ts        # Нова Пошта Live TTN Tracking API
│   │   ├── chat/route.ts            # AI Консультант (SSE streaming, tool calling розрахунку ціни)
│   │   └── revalidate/route.ts      # Миттєва ревалідація кешу Next.js після змін
├── components/
│   ├── Header.tsx                   # Glassmorphic Sticky Header з кнопкою 3D Примірки, ТТН та кошиком
│   ├── HeroBanner.tsx               # Головний банер зі швидкими фільтрами та релевантними CTA
│   ├── BeforeAfterSlider.tsx        # Інтерактивний сенсорний слайдер До/Після (Сонце ☀️ ➔ 100% Блекаут 🌙)
│   ├── BlindCalculator.tsx          # Інтерактивний калькулятор розмірів з ціною онлайн (#calculator)
│   ├── MaterialsSection.tsx         # Інтерактивні картки матеріалів з прямим переходом у фільтри каталогу
│   ├── ui/                          # Shadcn UI + Radix UI дизайн-система
│   │   ├── button.tsx               # Токени кнопок (default, glow, outline, ghost, discount)
│   │   ├── badge.tsx                # Стилі бейджів статусу та акцій
│   │   ├── accordion.tsx            # Плавний акордеон для FAQ (Radix Accordion)
│   │   ├── dialog.tsx               # Модальні вікна з backdrop-blur
│   │   ├── price-counter.tsx        # Плавний числовий лічильник зміни ціни
│   │   └── tabs.tsx                 # Вкладки на базі Radix Tabs
│   ├── visualizer/
│   │   └── RoomVisualizer.tsx       # 3D/Canvas Візуалізатор з симетричними кімнатами (вітальня, кухня, спальня, офіс)
│   └── ProductCard.tsx              # Картка товару з View Transition morphing та швидким замовленням
├── lib/
│   ├── version.ts                   # Конфіг версії (v2.6.0) та назви релізу
│   ├── telegram.ts                  # Клієнт Telegram Bot API (форматування, інлайн-кнопки)
│   ├── notifications.ts             # Відправка Email, SMS та Telegram сповіщень
│   ├── phoneValidator.ts            # Валідатор українських номерів та операторів (+380...)
│   └── supabase.ts                  # Supabase клієнт та прямі запити до БД
```

---

## 🚀 Ключові можливості версії `v2.6.0`

| Функціонал | Опис | Статус |
| :--- | :--- | :--- |
| **Слайдер «До / Після»** | Інтерактивне перетягування: сліпуче сонце ➔ 100% захист Блекаут | ✅ **Активно** |
| **Shadcn UI + Radix UI** | Єдиний монолітний дизайн-код для всіх 21 сторінок | ✅ **Активно** |
| **View Transitions API** | Безшовний морфінг зображень при переході з каталогу в товар | ✅ **Активно** |
| **Релевантна навігація** | Кнопки банера ведуть точно до цілей: `#calculator`, `/catalog?search=...` | ✅ **Активно** |
| **Інтерактивні картки тканин** | Клік по картках у гіді матеріалів миттєво відкриває зразки в каталозі | ✅ **Активно** |
| **Чистий асортимент** | Вилучено неактуальні дерев'яні/бамбукові системи; акцент на алюміній 25мм та тканини 89/127мм | ✅ **Активно** |
| **3D Візуалізатор вікон** | Центровані фони кімнат для фотореалістичної примірки тканин | ✅ **Активно** |
| **Telegram Bot сповіщення** | Миттєві сповіщення про ліди та замовлення через Webhook | ✅ **Активно** |
| **Live ТТН Трекінг** | Відстеження статусів Нової Пошти наживо у шапці сайту | ✅ **Активно** |
| **Адмін-панель v2.6.0** | Керування товарами, лідами, цінами калькулятора та контактами | ✅ **Активно** |

---

## 🔮 Рекомендований беклог наступних інтеграцій:
1. **API Нової Пошти у Checkout (`np-api`):** Живий вибір міста та відділення зі списку / поштомату.
2. **Monobank Acquiring / LiqPay:** Інтернет-еквайринг для миттєвої онлайн-оплати банківськими картками та Apple Pay / Google Pay.
3. **Генератор PDF-специфікацій:** Формування монтажної карти розкрою та рахунку-фактури для клієнта і виробництва.
4. **Google Shopping / Rozetka XML Feed:** Автоматична генерація каталогу товарів для рекламних кампаній.
