import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    const expectedSecret = process.env.REVALIDATE_SECRET || 'reval_zhaluzi_2026_secret';
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }
    revalidatePath('/');
    revalidatePath('/roleti');
    revalidatePath('/shtori');
    revalidatePath('/zhaluzi');
    revalidatePath('/zakryta-sistema');
    revalidatePath('/catalog');
    revalidatePath('/aktsii');
    revalidatePath('/product', 'layout');
    revalidatePath('/sitemap.xml');
    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
