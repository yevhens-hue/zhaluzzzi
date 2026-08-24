-- ==========================================================
-- MIGRATION: Admin Products RLS + Storage + Analytics
-- ==========================================================

-- 1. Products: allow INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "Admin Insert Products" ON products;
CREATE POLICY "Admin Insert Products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin Update Products" ON products;
CREATE POLICY "Admin Update Products" ON products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admin Delete Products" ON products;
CREATE POLICY "Admin Delete Products" ON products FOR DELETE USING (true);

-- 2. Supabase Storage: create public bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 'product-images', true, 5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
CREATE POLICY "Admin Upload Product Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;
CREATE POLICY "Admin Delete Product Images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

-- 3. Product Analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
  product_id TEXT PRIMARY KEY,
  product_slug TEXT NOT NULL,
  views BIGINT DEFAULT 0,
  orders BIGINT DEFAULT 0,
  cart_adds BIGINT DEFAULT 0,
  wishlist_adds BIGINT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Analytics" ON product_analytics;
CREATE POLICY "Public Read Analytics" ON product_analytics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Upsert Analytics" ON product_analytics;
CREATE POLICY "Public Upsert Analytics" ON product_analytics FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Analytics" ON product_analytics;
CREATE POLICY "Public Update Analytics" ON product_analytics FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_analytics_views ON product_analytics(views DESC);
