-- Create tables for Products, Categories, and Reviews with zhaluzi_ prefix

CREATE TABLE IF NOT EXISTS zhaluzi_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_ua TEXT NOT NULL,
  description_ua TEXT,
  icon TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS zhaluzi_products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sku TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  subcategory_slug TEXT,
  base_price NUMERIC NOT NULL,
  old_price NUMERIC,
  price_unit TEXT,
  min_width NUMERIC,
  max_width NUMERIC,
  min_height NUMERIC,
  max_height NUMERIC,
  base_width NUMERIC,
  base_height NUMERIC,
  price_per_sqm NUMERIC,
  fabric TEXT,
  texture TEXT,
  blackout_percent NUMERIC,
  color_name TEXT,
  color_hex TEXT,
  available_colors JSONB,
  main_image TEXT NOT NULL,
  images JSONB,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_offer_of_day BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  destinations JSONB,
  description TEXT,
  characteristics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS zhaluzi_reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  city TEXT,
  rating NUMERIC,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE zhaluzi_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhaluzi_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhaluzi_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on categories" ON zhaluzi_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON zhaluzi_products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reviews" ON zhaluzi_reviews FOR SELECT USING (true);

-- Allow service role full access (for our admin API and seed scripts)
CREATE POLICY "Allow service role all on categories" ON zhaluzi_categories FOR ALL USING (true);
CREATE POLICY "Allow service role all on products" ON zhaluzi_products FOR ALL USING (true);
CREATE POLICY "Allow service role all on reviews" ON zhaluzi_reviews FOR ALL USING (true);
