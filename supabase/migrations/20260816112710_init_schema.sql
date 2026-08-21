-- ==========================================================
-- SUPABASE SCHEMA FOR MANOV CLONE (Сонцезахисні системи)
-- ==========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_ua TEXT NOT NULL,
  title_ru TEXT,
  description_ua TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  sku TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  subcategory_slug TEXT,
  base_price NUMERIC NOT NULL,
  old_price NUMERIC,
  price_unit TEXT DEFAULT 'грн',
  min_width INT DEFAULT 20,
  max_width INT DEFAULT 240,
  min_height INT DEFAULT 30,
  max_height INT DEFAULT 300,
  base_width INT DEFAULT 50,
  base_height INT DEFAULT 150,
  price_per_sqm NUMERIC DEFAULT 450,
  fabric TEXT,
  texture TEXT,
  blackout_percent INT DEFAULT 50,
  color_name TEXT,
  color_hex TEXT,
  available_colors JSONB DEFAULT '[]'::jsonb,
  main_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_offer_of_day BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  destinations TEXT[] DEFAULT '{}',
  description TEXT,
  characteristics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Leads Table (One-click Buy / Callback Request)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  name TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT,
  product_sku TEXT,
  dimensions TEXT,
  selected_color TEXT,
  calculated_price NUMERIC,
  lead_type TEXT DEFAULT 'one_click',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  city TEXT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON categories;
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON orders;
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Leads" ON leads;
CREATE POLICY "Public Insert Leads" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Leads" ON leads;
CREATE POLICY "Public Read Leads" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Reviews" ON reviews;
CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(is_popular);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
