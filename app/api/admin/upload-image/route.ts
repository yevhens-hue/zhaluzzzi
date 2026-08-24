import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

/** POST /api/admin/upload-image
 * Accepts multipart/form-data with 'file' field
 * Returns { url: string } — public URL in Supabase Storage
 */
export async function POST(req: NextRequest) {
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json(
      { error: 'Supabase Storage not configured — set SUPABASE_SERVICE_ROLE_KEY in Vercel env vars' },
      { status: 503 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Use JPEG, PNG, WebP or AVIF.` },
        { status: 400 }
      );
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `product-${timestamp}-${random}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await client.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = client.storage
      .from('product-images')
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl, filename });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('[Admin Upload Image]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
