import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase';
import { generateGoogleMerchantXml } from '@/lib/feeds';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const products = await getProducts();
    const xml = generateGoogleMerchantXml(products, 'ru');

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RU Google Merchant XML feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
