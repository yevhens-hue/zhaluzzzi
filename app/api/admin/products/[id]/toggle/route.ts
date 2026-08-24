import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/** PATCH /api/admin/products/[id]/toggle
 * Body: { field: 'is_popular' | 'is_new' | 'in_stock', value: boolean }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { field, value } = await req.json();

  const ALLOWED_FIELDS = ['is_popular', 'is_new', 'in_stock', 'is_offer_of_day'];
  if (!ALLOWED_FIELDS.includes(field)) {
    return NextResponse.json({ error: `Field "${field}" not allowed` }, { status: 400 });
  }

  try {
    const { data, error } = await adminSupabase
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
