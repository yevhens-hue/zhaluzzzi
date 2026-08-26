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
    const body = await req.json();
    const { event, url, properties } = body;

    if (!event) {
      return NextResponse.json({ error: 'event is required' }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (supabase) {
      // Log event into telemetry table if present
      await supabase.from('zhaluzi_event_telemetry').insert([
        {
          event_name: event,
          path: url || '/',
          properties: properties || {},
          created_at: new Date().toISOString(),
        },
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: true, note: String(err) });
  }
}
