# 📑 Engineering Continuity & System Handoff Package

**Project Name**: Жалюзі та Ролети від виробника (м. Дніпро)  
**Production Domain**: [https://zhaluzi-rolety-dnipro.vercel.app](https://zhaluzi-rolety-dnipro.vercel.app)  
**Admin CMS URL**: [https://zhaluzi-rolety-dnipro.vercel.app/admin](https://zhaluzi-rolety-dnipro.vercel.app/admin)  
**Last Updated**: 2026-08-16  

---

## 1. 🚀 Executive Summary & Production Status

This repository contains a full-stack, responsive e-commerce web platform for custom window blinds and roller shutters (**Жалюзі, Тканинні Ролети, Штори День-Ніч, Закрита система**) based in **Dnipro, Ukraine**.

All legacy branding references (MANOV) have been sanitized. The platform is deployed to Vercel with real-time Supabase cloud database integration, local fallback persistence, live calculator rate engine, session-guarded full CMS admin panel, and an audit logger subsystem.

---

## 2. 🔐 Key Credentials & Environment Configuration

| Resource | Value / Access Details | Description |
|---|---|---|
| **Admin CMS Panel** | `https://zhaluzi-rolety-dnipro.vercel.app/admin` | Protected by session authentication |
| **Admin Login** | `admin` | Administrator username |
| **Admin Password** | `Dnipro2026!` | Administrator password |
| **Production Vercel URL** | `https://zhaluzi-rolety-dnipro.vercel.app` | Live customer storefront |
| **Vercel Project** | `yevhens-hues-projects/zhaluzi-rolety-dnipro` | Vercel scope & project |
| **Supabase Project** | `pnerikwvvtehclswgstb` | Project ID (EU Central / Frankfurt) |
| **Supabase URL** | `https://pnerikwvvtehclswgstb.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **Supabase Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

### Business Contacts & Persona
- **Контактна особа**: Віктор Кузьменко
- **Телефони**: `(093) 912-85-31`, `(093) 510-55-21`
- **Локація**: м. Дніпро (Замір по місту + відправка Новою Поштою по всій Україні)
- **Instagram**: [https://www.instagram.com/zhaluzi.rollety.dnipro](https://www.instagram.com/zhaluzi.rollety.dnipro)
- **Telegram**: [https://t.me/+380939128531](https://t.me/+380939128531)
- **Viber**: `+380939128531`

---

## 3. 🗺️ System Map & Component Topology

```mermaid
graph TD
    Client[Browser / Customer] -->|HTTPS| Vercel[Vercel Edge Next.js 16 App]
    Admin[Site Owner / Admin] -->|Login Gate| AdminCMS[/admin Dashboard]
    
    subgraph Frontend [Next.js Client Architecture]
        SiteCtx[SiteSettingsContext]
        CartCtx[CartContext]
        Calc[BlindCalculator]
        Catalog[Catalog & Filters]
        Checkout[Checkout Page]
    end
    
    subgraph DataLayer [Storage & Logger]
        Logger[lib/logger.ts]
        SupabaseClient[lib/supabase.ts]
        LocalStorageFallback[Client Storage Fallback]
    end
    
    subgraph CloudBackend [Supabase Postgres Cloud]
        DB_Orders[(orders)]
        DB_Leads[(leads)]
        DB_Products[(products)]
        DB_Settings[(site_settings)]
        DB_Logs[(audit_logs)]
    end
    
    Vercel --> Frontend
    Frontend --> DataLayer
    DataLayer --> CloudBackend
```

### Key Modules in Repository:
- **`lib/siteSettings.ts` & `context/SiteSettingsContext.tsx`**: Dynamic CMS engine allowing real-time changes to products, prices, calculator rate formulas, contacts, and promo banners directly from `/admin`.
- **`lib/supabase.ts`**: Database interface handling order generation (`ZR-XXXXXX`), lead capturing, product querying, and automatic failover to local storage.
- **`lib/logger.ts`**: Structured audit log engine tracking `ORDER_ATTEMPT`, `LEAD_ATTEMPT`, `SETTINGS_UPDATED`, and API errors.
- **`components/BlindCalculator.tsx`**: Dimension-based live pricing calculator with reactive rates.
- **`app/admin/page.tsx`**: 8-tab CMS management panel for Orders, Leads, Products, Calculator Rates, Contacts, Promo texts, Audit Logs, and Supabase config.
- **`app/globals.css`**: Strict high-contrast guard preventing OS Dark Mode from rendering light text on white input fields.

---

## 4. ✅ Verified vs Unverified Status Matrix

| Component / Flow | Status | Verification Evidence |
|---|:---:|---|
| **E2E Order Checkout (`/checkout`)** | ✅ VERIFIED | Order `ZR-XXXXXX` created with items, total price, customer info, Nova Poshta branch delivery, and logged to audit trail. |
| **1-Click Fast Buy Modal** | ✅ VERIFIED | Phone captured, lead assigned `pending` status and saved to `leads` table/local buffer. |
| **Interactive Calculator Math** | ✅ VERIFIED | Verified: $(Width \times Height / 10000) \times BaseRate \times Multiplier + ExtraCost$. |
| **Admin Authentication Guard** | ✅ VERIFIED | Session-based lock via `sessionStorage`. Unauthorized users blocked with clean login form. |
| **Catalog & Product Editor** | ✅ VERIFIED | Products dynamically updated from CMS; add/edit/delete product functionality operational. |
| **Contacts & Calculator CMS** | ✅ VERIFIED | Rates and contacts edited in `/admin` reflect instantly across Header, Footer, and Calculator. |
| **Input Contrast & Dark Mode** | ✅ VERIFIED | High-contrast `#111827` text color on `#ffffff` fields enforced across Safari, Chrome, and iOS. |
| **Sanitization of MANOV** | ✅ VERIFIED | Grep search confirmed 0 user-facing occurrences of previous supplier branding. |

---

## 5. 🛠️ Runtime Diagnostics & Failure Recovery Runbook

### Scenario A: Supabase Connection Interruption
- **Symptom**: Network error connecting to `https://pnerikwvvtehclswgstb.supabase.co`.
- **Automatic Behavior**: `lib/supabase.ts` catches the exception, buffers orders and leads into `localStorage` (`app_orders`, `app_leads`), and logs a `WARN` event.
- **Recovery**: Orders can be viewed and managed immediately inside `/admin` under the Orders and Leads tabs.

### Scenario B: Resetting Site Settings to Defaults
- If invalid pricing coefficients are entered in `/admin`:
  1. Open `/admin` -> Tab **«Тарифи калькулятора»**.
  2. Click **«Скинути до стандартних»** (Reset to Defaults).
  3. All rates reset to `DEFAULT_SITE_SETTINGS` in `lib/siteSettings.ts`.

---

## 6. 🚀 Build & Deployment Commands

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build production bundle
npm run build

# Deploy directly to Vercel Production
npx vercel deploy --prod --yes
```
