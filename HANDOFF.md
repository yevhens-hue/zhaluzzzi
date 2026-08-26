# 📑 Engineering Continuity & Production Handoff Package: Жалюзі та Рулонні Штори Дніпро

**Поточна версія:** `v2.8.0` (26.08.2026)  
**Реліз:** *SEO Content Engine, SMM Generator & AI Feedback Analyst*  
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
│   ├── roleti/page.tsx              # Категорія Ролети + LSI SEO Гід + FAQ Accordion Schema
│   ├── shtori/page.tsx              # Категорія Штори День-Ніч + LSI SEO Гід
│   ├── zhaluzi/page.tsx             # Категорія Жалюзі Алюмінієві + LSI SEO Гід
│   ├── visualizer/page.tsx          # 3D Візуалізатор тканин на вікні
│   ├── admin/page.tsx               # Модульна Адмін-панель & CMS (Замовлення, Ліди, Товари, Фіди, SMM, Відгуки)
│   ├── catalog/page.tsx             # Каталог товарів з живими фільтрами та пошуком
│   ├── checkout/page.tsx            # Оформлення замовлення
│   ├── api/
│   │   ├── feeds/
│   │   │   ├── google-merchant/     # Google Shopping XML (UK & RU)
│   │   │   └── rozetka/             # Rozetka / Prom.ua YML XML
│   │   ├── chat/route.ts            # AI Консультант (Prompt Caching + Rate Limiting)
├── components/
│   ├── admin/tabs/
│   │   ├── FeedsTab.tsx             # Керування Google Merchant фідами та XML імпортом
│   │   ├── SmmTab.tsx               # Генератор постів для Instagram/Telegram + 7-денний контент-план
│   │   └── ReviewsAnalyticsTab.tsx  # AI Аналіз задоволеності клієнтів (Топ-3 переваги / скарги / FAQ)
│   ├── seo/
│   │   └── CategorySeoSection.tsx   # Багаті SEO-статті та FAQ акордеони для підняття позицій у Google
```

---

## 🚀 Ключові можливості версії `v2.8.0`

| Функціонал | Опис | Статус |
| :--- | :--- | :--- |
| **SEO Content Engine** | Багаті LSI-статті та Radix FAQ-акордеони для `/roleti`, `/shtori`, `/zhaluzi`, `/zakryta-sistema` | ✅ **Активно** |
| **SMM Post Generator** | Авто-генерація постів для Instagram/Telegram під будь-який товар з цінами та 7-денним медіапланом | ✅ **Активно** |
| **AI User Feedback Analyst** | NLP-аналізатор відгуків у `/admin`: Топ-3 сильних сторін, Топ-3 скарг та рекомендації для FAQ | ✅ **Активно** |
| **Google Merchant Feeds** | Автоматичні живі XML-фіди (UK & RU) для Google Shopping та Rozetka/Prom | ✅ **Активно** |
| **Cross-Session Memory** | Збереження параметрів вікна, кімнати та тканини між візитами з персональним привітанням | ✅ **Активно** |
| **Prompt Caching & Rate Limit** | Економія токенів LLM на 75–80%, TTFB ~400мс та захист від спаму | ✅ **Активно** |
| **Слайдер «До / Після»** | Інтерактивне перетягування: сліпуче сонце ➔ 100% захист Блекаут | ✅ **Активно** |
| **3D Візуалізатор вікон** | Центровані фони кімнат для фотореалістичної примірки тканин | ✅ **Активно** |
| **Telegram Bot сповіщення** | Миттєві сповіщення про ліди та замовлення через Webhook | ✅ **Активно** |
| **Адмін-панель v2.8.0** | 12 модулів керування: замовлення, ліди, товари, фіди, SMM, відгуки, калькулятор | ✅ **Активно** |

---

## 🔮 Рекомендований беклог наступних інтеграцій:
1. **ab-testing-planner:** Спліт-тестування CTA-кнопок (*«Замовити»* vs *«Розрахувати»*) з відстеженням конверсій.
2. **API Нової Пошти у Checkout (`np-api`):** Живий вибір міста та відділення зі списку / поштомату.
3. **Monobank Acquiring / LiqPay:** Інтернет-еквайринг для миттєвої онлайн-оплати банківськими картками.
4. **Генератор PDF-специфікацій:** Формування монтажної карти розкрою та рахунку-фактури для виробництва.
