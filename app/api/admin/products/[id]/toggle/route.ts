import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '@/lib/adminAuth';

// Lazy initialization — avoids crashing at module load if env vars are missing
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

/** PATCH /api/admin/products/[id]/toggle
 * Body: { field: 'is_popular' | 'is_new' | 'in_stock', value: boolean }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { id } = await params;
  const { field, value } = await req.json();

  const ALLOWED_FIELDS = ['is_popular', 'is_new', 'in_stock', 'is_offer_of_day'];
  if (!ALLOWED_FIELDS.includes(field)) {
    return NextResponse.json({ error: `Field "${field}" not allowed` }, { status: 400 });
  }

  try {
    const { data, error } = await client
      .from('products')
      .update({ [field]: value })
      .eq('id', id)
      .select('id, is_popular, is_new, in_stock, is_offer_of_day')
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
