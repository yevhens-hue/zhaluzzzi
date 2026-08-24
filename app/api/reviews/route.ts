import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rateLimit';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  // Rate limit: max 5 reviews per 2 minutes per IP
  const rateCheck = checkRateLimit(req, 5, 2 * 60 * 1000);
  if (rateCheck.isLimited) {
    return NextResponse.json(
      { error: 'Забагато спроб залишити відгук. Будь ласка, зачекайте кілька хвилин.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { product_id, author_name, city, rating, comment } = body;

    if (!product_id || !author_name || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) {
      return NextResponse.json({ ok: true, note: 'no-db fallback' });
    }

    const cleanAuthor = String(author_name).replace(/<[^>]*>?/gm, '').trim().slice(0, 80);
    const cleanCity = city ? String(city).replace(/<[^>]*>?/gm, '').trim().slice(0, 50) : null;
    const cleanComment = String(comment).replace(/<[^>]*>?/gm, '').trim().slice(0, 1000);

    const payload = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      product_id,
      author_name: cleanAuthor,
      city: cleanCity,
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      comment: cleanComment,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('reviews').insert([payload]);
    if (error) {
      console.error('Review insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, review: payload });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
