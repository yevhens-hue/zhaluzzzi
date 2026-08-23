# 📑 Engineering Continuity & Production Handoff Package: Жалюзі та Рулонні Штори Дніпро

**Project Target:** Production E-Commerce Web Application & CMS  
**Production URL:** [https://zhaluzi-rolety-dnipro.vercel.app](https://zhaluzi-rolety-dnipro.vercel.app)  
**Admin Panel:** [https://zhaluzi-rolety-dnipro.vercel.app/admin](https://zhaluzi-rolety-dnipro.vercel.app/admin)  
**Admin Credentials:**  
- **Login:** `admin`  
- **Password:** `Dnipro2026!`  
**Language Lock:** 100% Ukrainian (`uk`) across all 21 routes.

---

## 🏛️ System Map & Component Topology

```
├── app/
│   ├── page.tsx                     # Homepage (Hero, Categories, Catalog preview, Works Gallery, AI Consultant)
│   ├── admin/page.tsx               # Full Admin Panel & CMS (Orders, Leads, Products, Calculator, Gallery, Contacts with Email/SMS, Logs)
│   ├── catalog/page.tsx             # Full Catalog page with Live Filters & Search
│   ├── product/[slug]/page.tsx      # Dynamic Product Detail Page with Configurator
│   ├── checkout/page.tsx            # Full Checkout flow with live UA phone validation & operator badge
│   ├── api/
│   │   ├── tracking/route.ts        # Nova Poshta Live TTN Tracking API
│   │   ├── notify/route.ts          # Server-side Email (HTML) & SMS notification dispatcher
│   │   └── chat/route.ts            # AI Consultant OpenAI GPT-4o-mini + Tool Calling + Lead Qualification
├── components/
│   ├── Header.tsx                   # Header with Navigation, Contacts, Mobile Drawer & TTN Tracking modal
│   ├── ProductDetailView.tsx        # Product detail view with size calculator, color options, cart integration
│   ├── ProductCard.tsx              # Reusable product card with useSiteSettings dynamic sync
│   ├── CatalogView.tsx              # Catalog page with filter drawer, room tags, texture, blackout & search
│   ├── PortfolioGallery.tsx         # Works gallery connected to useSiteSettings.gallery CMS
│   ├── TrackingModal.tsx            # Nova Poshta 14-digit TTN tracking popup modal
│   ├── OneClickModal.tsx            # 1-Click order popup with real-time UA phone validation & operator badge
│   └── ai/
│       └── AiConsultantWidget.tsx   # Floating AI assistant with city context, quick prompts & lead capture
├── lib/
│   ├── phoneValidator.ts            # Ukrainian Phone Validator (Kyivstar, Vodafone, Lifecell, Intertelecom, Landline)
│   ├── notifications.ts             # Email (HTML) & SMS notification dispatcher (Resend, TurboSMS, AlphaSMS, Webhooks)
│   ├── siteSettings.ts              # SiteSettings interfaces (contacts.email, phone1, phone2), defaults & sync
│   ├── supabase.ts                  # Supabase client, createOrder & createLead with automated notification triggers
│   ├── mockData.ts                  # Baseline fallback product catalog & categories
│   ├── logger.ts                    # Application event audit logger
│   └── ai/
│       ├── prompts.ts               # System prompt with order qualification (type, sizes, preferred time)
│       ├── tools.ts                 # Function calling schema (submitLead with orderType, dimensions, time)
│       └── knowledgeBase.ts         # Technical knowledge base for window treatment systems
└── context/
    ├── SiteSettingsContext.tsx      # Global React Context broadcasting settings & dynamic products
    ├── CartContext.tsx              # Shopping cart state manager
    ├── CityContext.tsx              # City & geolocation selector
    └── LanguageContext.tsx          # Language provider (locked to Ukrainian)
```

---

## 🚀 Key Features Implemented & Verified

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Ukrainian Phone Validation** | Validates digit count (10/12), normalizes to E.164 (`+380...`), detects mobile operators (Kyivstar, Vodafone, Lifecell, etc.) with real-time badge in UI | ✅ Live & Verified |
| **Email & SMS Auto-Dispatch** | Instant rich HTML email with product table + concise SMS to site contacts upon order or lead creation | ✅ Live & Verified |
| **AI Consultant with Qualification** | GPT-4o-mini consultant that clarifies order type (visit/custom sizes), dimensions, and preferred contact time | ✅ Live & Verified |
| **Nova Poshta TTN Tracking** | Live 14-digit TTN tracking popup connected to official Nova Poshta API | ✅ Live & Verified |
| **Admin Panel CMS** | Full control over orders, leads, products, calculator rates, gallery, and notification contacts (email & phones) | ✅ Live & Verified |
| **Dynamic Context Sync** | Real-time synchronization between Admin changes and client views via `SiteSettingsContext` | ✅ Live & Verified |

---

## 🛠️ Diagnostics & Maintenance Runbook

### 1. Local Verification
To build and test the project locally:
```bash
npm run build
```

### 2. Integration Tests
To run phone validation & notification tests:
```bash
npx tsx scratch/test-phone-notifications.ts
```

### 3. Vercel Production Deployment
To deploy all changes directly to production:
```bash
npx vercel --prod --yes
```

---

*Handoff package generated and updated on 2026-08-23.*
