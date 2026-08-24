-- Run this in Supabase SQL editor to create the atomic increment function
CREATE OR REPLACE FUNCTION increment_product_views(p_id TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO product_analytics (product_id, views, orders)
  VALUES (p_id, 1, 0)
  ON CONFLICT (product_id)
  DO UPDATE SET views = product_analytics.views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
