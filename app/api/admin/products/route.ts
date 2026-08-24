import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import type { Product } from '@/types/database';

// Lazy initialization — avoids crashing at module load if SUPABASE_SERVICE_ROLE_KEY is missing
let _adminClient: SupabaseClient | null = null;
function getAdminClient(): SupabaseClient | null {
  if (_adminClient) return _adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    _adminClient = createClient(url, key);
    return _adminClient;
  } catch {
    return null;
  }
}

/** GET /api/admin/products — fetch all products (DB + mocks fallback) */
export async function GET() {
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }

  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Merge: DB products first, then mocks not already in DB
    const dbSlugs = new Set((data || []).map((p: Product) => p.slug));
    const mocksOnly = MOCK_PRODUCTS.filter((m) => !dbSlugs.has(m.slug));
    return NextResponse.json({ products: [...(data || []), ...mocksOnly] });
  } catch (err) {
    console.error('[Admin Products GET]', err);
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}

/** POST /api/admin/products — upsert one product */
export async function POST(req: NextRequest) {
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'Supabase not configured — set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const product: Product = body.product;

    if (!product?.id || !product?.title || !product?.slug) {
      return NextResponse.json({ error: 'Missing required fields: id, title, slug' }, { status: 400 });
    }

    const { data, error } = await client
      .from('products')
      .upsert(product, { onConflict: 'slug' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Admin Products POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/admin/products?slug=xxx OR ?id=xxx */
export async function DELETE(req: NextRequest) {
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const id = searchParams.get('id');

  if (!slug && !id) {
    return NextResponse.json({ error: 'Missing slug or id param' }, { status: 400 });
  }

  try {
    const query = slug
      ? client.from('products').delete().eq('slug', slug)
      : client.from('products').delete().eq('id', id!);

    const { error } = await query;
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Admin Products DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
