import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { product_id } = await req.json();
    if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ ok: true, note: 'no-db' });

    // UPSERT: insert new row or increment views
    const { error } = await supabase.rpc('increment_product_views', { p_id: product_id });

    if (error) {
      // Fallback: manual upsert if RPC doesn't exist yet
      await supabase.from('product_analytics').upsert(
        { product_id, views: 1, orders: 0 },
        { onConflict: 'product_id', ignoreDuplicates: false }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: true, note: String(err) });
  }
}
