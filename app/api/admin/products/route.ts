import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@/types/database';
import { verifyAdminSession } from '@/lib/adminAuth';
import { MOCK_PRODUCTS } from '@/lib/mockData';

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

function revalidateAllProductRoutes(slug?: string) {
  try {
    revalidatePath('/');
    revalidatePath('/catalog');
    revalidatePath('/roleti');
    revalidatePath('/shtori');
    revalidatePath('/zhaluzi');
    revalidatePath('/zakryta-sistema');
    revalidatePath('/aktsii');
    revalidatePath('/sitemap.xml');
    if (slug) {
      revalidatePath(`/product/${slug}`);
    }
  } catch (err) {
    console.warn('[Admin Products] Revalidation warning:', err);
  }
}

/** GET /api/admin/products — fetch all products from Supabase DB */
export async function GET() {
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }

  try {
    const { data, error } = await client
      .from('zhaluzi_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If DB is empty, fall back to mock data so catalog always shows products
    const products = data && data.length > 0 ? data : MOCK_PRODUCTS;
    return NextResponse.json({ products });
  } catch (err) {
    console.error('[Admin Products GET]', err);
    return NextResponse.json({ products: MOCK_PRODUCTS });
  }
}

/** POST /api/admin/products — upsert one product */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

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
      .from('zhaluzi_products')
      .upsert(product, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;

    // Revalidate paths so new product is instantly visible across all cached routes
    revalidateAllProductRoutes(product.slug);

    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message =
      (err as any)?.message ||
      (err as any)?.details ||
      (err instanceof Error ? err.message : 'Unknown error');
    console.error('[Admin Products POST]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/admin/products?slug=xxx OR ?id=xxx */
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

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
      ? client.from('zhaluzi_products').delete().eq('slug', slug)
      : client.from('zhaluzi_products').delete().eq('id', id!);

    const { error } = await query;
    if (error) throw error;

    revalidateAllProductRoutes(slug || undefined);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Admin Products DELETE]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
