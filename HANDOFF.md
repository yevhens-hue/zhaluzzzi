# 📑 Engineering Continuity & System Handoff Package

**Project Name**: Жалюзі та Ролети від виробника (м. Дніпро)  
**Production Domain**: [https://zhaluzi-rolety-dnipro.vercel.app](https://zhaluzi-rolety-dnipro.vercel.app)  
**Admin CMS URL**: [https://zhaluzi-rolety-dnipro.vercel.app/admin](https://zhaluzi-rolety-dnipro.vercel.app/admin)  
**Last Updated**: 2026-08-22 01:18 (UTC+2)  
**Status**: 🟢 **PROD LIVE & 100% VERIFIED**

---

## 1. 🚀 Executive Summary & Production Status

This repository contains a full-stack, responsive e-commerce web platform for custom window blinds and roller shutters (**Жалюзі, Тканинні Ролети, Штори День-Ніч, Закрита система Uni**) based in **Dnipro, Ukraine**.

The platform is deployed to Vercel with real-time Supabase Postgres cloud database integration, local fallback persistence, live calculator rate engine, session-guarded full CMS admin panel, audit logger subsystem, an automated GPT-4o AI Consultant with continuous eval testing, and complete Schema.org / XML Sitemap SEO infrastructure.

---

## 2. 🔐 Key Credentials & Environment Configuration

| Resource | Value / Access Details | Description |
|---|---|---|
| **Live Storefront** | [https://zhaluzi-rolety-dnipro.vercel.app](https://zhaluzi-rolety-dnipro.vercel.app) | Production customer storefront |
| **Admin CMS Panel** | [https://zhaluzi-rolety-dnipro.vercel.app/admin](https://zhaluzi-rolety-dnipro.vercel.app/admin) | Protected by session authentication |
| **Admin Login** | `admin` | Administrator username |
| **Admin Password** | `Dnipro2026!` | Administrator password |
| **Vercel Project** | `yevhens-hues-projects/zhaluzi-rolety-dnipro` | Vercel scope & project |
| **Supabase Project** | `pnerikwvvtehclswgstb` | Project ID (EU Central / Frankfurt) |
| **Supabase URL** | `https://pnerikwvvtehclswgstb.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **XML Sitemap** | [https://zhaluzi-rolety-dnipro.vercel.app/sitemap.xml](https://zhaluzi-rolety-dnipro.vercel.app/sitemap.xml) | Dynamic crawler map |
| **Robots Directives** | [https://zhaluzi-rolety-dnipro.vercel.app/robots.txt](https://zhaluzi-rolety-dnipro.vercel.app/robots.txt) | Indexing rules |

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
        CityCtx[CityContext]
        AiWidget[AiConsultantWidget / MessageBubble]
        Calc[BlindCalculator with 3D Preview]
        Catalog[CatalogView & Filters]
        FloatingStack[TelegramWidget + AI Stack]
    end
    
    subgraph DataLayer [Storage & Logger & AI Engine]
        Logger[lib/logger.ts]
        SupabaseClient[lib/supabase.ts]
        AiEngine[lib/ai/ - Prompts, KnowledgeBase, Tools]
        LocalStorageFallback[Client Storage Fallback]
    end
    
    subgraph CloudBackend [Supabase Postgres Cloud & OpenAI]
        DB_Orders[(orders)]
        DB_Leads[(leads)]
        DB_Products[(products)]
        DB_Settings[(site_settings)]
        DB_Logs[(audit_logs)]
        OpenAI_API[OpenAI GPT-4o-mini]
    end
    
    Vercel --> Frontend
    Frontend --> DataLayer
    DataLayer --> CloudBackend
    AiWidget -->|POST /api/chat| OpenAI_API
```

---

## 4. 🌟 Key Features Delivered & Verified

| Feature / Component | File Locations | Details |
|---|---|---|
| **🤖 AI Consultant & Lead Qualifier** | [`app/api/chat/route.ts`](file:///Users/yevhen/Жалюзи/app/api/chat/route.ts), [`lib/ai/`](file:///Users/yevhen/Жалюзи/lib/ai/), [`components/ai/`](file:///Users/yevhen/Жалюзи/components/ai/) | GPT-4o-mini powered consultant, multilingual (UK/RU), strict domain grounding, automated `submitLead` saving directly to Supabase & audit logs. |
| **🧪 Continuous Eval Suite** | [`eval/test_zhaluzi_agent.py`](file:///Users/yevhen/Жалюзи/eval/test_zhaluzi_agent.py), [`eval/eval_dataset_zhaluzi.json`](file:///Users/yevhen/Жалюзи/eval/eval_dataset_zhaluzi.json) | 12 automated test cases covering measurement guides, fabric choices, lead capturing, anti-hallucination traps (100% Pass Rate). |
| **🔍 SEO & Schema.org Microdata** | [`components/seo/JsonLd.tsx`](file:///Users/yevhen/Жалюзи/components/seo/JsonLd.tsx), [`app/sitemap.ts`](file:///Users/yevhen/Жалюзи/app/sitemap.ts), [`app/robots.ts`](file:///Users/yevhen/Жалюзи/app/robots.ts) | JSON-LD schemas (`LocalBusiness`, `Product`, `Breadcrumbs`, `WebSite`), canonical alternates, dynamic sitemap and robots.txt. |
| **🪟 Interactive Window Calculator** | [`components/BlindCalculator.tsx`](file:///Users/yevhen/Жалюзи/components/BlindCalculator.tsx) | Live window schematic preview with fabric textures, guides, chain position, React 19 `useTransition` 60fps sliders, and 1-click size presets. |
| **🛍 Product Cards & Micro-Animations** | [`components/ProductCard.tsx`](file:///Users/yevhen/Жалюзи/components/ProductCard.tsx), [`app/globals.css`](file:///Users/yevhen/Жалюзи/app/globals.css) | Hover zoom, discount badges, color swatches, instant cart checkmark feedback, smooth scrollbars and glassmorphism. |
| **📱 Non-Overlapping Floating Stack** | [`components/TelegramWidget.tsx`](file:///Users/yevhen/Жалюзи/components/TelegramWidget.tsx), [`components/ai/AiConsultantWidget.tsx`](file:///Users/yevhen/Жалюзи/components/ai/AiConsultantWidget.tsx) | Perfect vertical spacing: Phone, Instagram, Telegram, and AI Assistant aligned along right edge with zero overlap. |

---

## 5. 🧪 Testing & Validation Runbook

1. **Production Build Check:**
   ```bash
   cd /Users/yevhen/Жалюзи
   npm run build
   ```
2. **AI Agent Automated Eval Tests:**
   ```bash
   cd /Users/yevhen/Жалюзи
   python3 -m pytest eval/test_zhaluzi_agent.py -v
   ```
   *Expectation: 12 passed in ~28s.*
3. **Deploy to Vercel:**
   ```bash
   cd /Users/yevhen/Жалюзи
   npx vercel --prod --yes
   ```
