import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase';
import { generateGoogleMerchantXml } from '@/lib/feeds';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get('lang') === 'ru' ? 'ru' : 'uk';
    const products = await getProducts();
    const xml = generateGoogleMerchantXml(products, lang);

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating Google Merchant XML feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
