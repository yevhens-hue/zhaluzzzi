import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import type { Product } from '@/types/database';

// Use service role key to bypass RLS for admin write operations
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

/** GET /api/admin/products — fetch all products (admin + base) */
export async function GET() {
  if (!isConfigured) {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }

  try {
    const { data, error } = await adminSupabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Merge: DB products override mocks by slug, then append remaining mocks
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
  if (!isConfigured) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const product: Product = body.product;

    if (!product?.id || !product?.title || !product?.slug) {
      return NextResponse.json({ error: 'Missing required fields: id, title, slug' }, { status: 400 });
    }

    const { data, error } = await adminSupabase
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

/** DELETE /api/admin/products?slug=xxx */
export async function DELETE(req: NextRequest) {
  if (!isConfigured) {
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
      ? adminSupabase.from('products').delete().eq('slug', slug)
      : adminSupabase.from('products').delete().eq('id', id!);

    const { error } = await query;
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Admin Products DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
