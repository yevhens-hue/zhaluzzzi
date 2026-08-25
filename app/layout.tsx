import { AiConsultantWidget } from "@/components/ai/AiConsultantWidget";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CityProvider } from '@/context/CityContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';
import { ToastProvider } from '@/context/ToastContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { CityModal } from '@/components/CityModal';
import { TelegramWidget } from '@/components/TelegramWidget';

import { LocalBusinessJsonLd, WebSiteJsonLd, SITE_URL } from '@/components/seo/JsonLd';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ЖАЛЮЗІ РОЛЕТИ ВІД ВИРОБНИКА | м. Дніпро | Ролети, Штори, Жалюзі',
    template: '%s | Жалюзі та Ролети від виробника',
  },
  description:
    '⭐️ Жалюзі та ролети від виробника у м. Дніпро та по всій Україні ⭐️ Віктор Кузьменко: (093) 912-85-31, (093) 510-55-21 ✔️ Адекватні ціни ⚡ 100% Гарантія якості ✿ Доставка та монтаж',
  keywords: [
    'жалюзі дніпро',
    'ролети дніпро',
    'рулонні штори від виробника',
    'день-ніч дніпро',
    'купити ролети україна',
    'тканинні ролети дніпро',
    'вертикальні жалюзі',
    'горизонтальні жалюзі',
    'закрита система ролети',
    'віктор кузьменко',
  ],
  authors: [{ name: 'Віктор Кузьменко' }],
  creator: 'Жалюзі та Ролети Дніпро',
  publisher: 'Жалюзі та Ролети від виробника',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ЖАЛЮЗІ РОЛЕТИ ВІД ВИРОБНИКА — м. Дніпро',
    description:
      'Жалюзі, тканинні ролети, штори День-Ніч та Блекаут за вашими індивідуальними розмірами у м. Дніпро та по Україні. Консультація: (093) 912-85-31.',
    url: SITE_URL,
    siteName: 'Жалюзі та Ролети від виробника (м. Дніпро)',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Жалюзі та Ролети від виробника м. Дніпро',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ЖАЛЮЗІ РОЛЕТИ ВІД ВИРОБНИКА — м. Дніпро',
    description:
      'Жалюзі, тканинні ролети, штори День-Ніч за індивідуальними розмірами від виробника у м. Дніпро.',
    images: [`${SITE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

import { ViewTransitions } from 'next-view-transitions';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html lang="uk" className={inter.className}>
        <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://kapkqziyceefxluxlvqc.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://kapkqziyceefxluxlvqc.supabase.co" />
        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <ToastProvider>
            <SiteSettingsProvider>
              <CartProvider>
                <CityProvider>
                  <WishlistProvider>
                    <Header />
                    <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
                      {children}
                    </main>
                    <Footer />
                    <CartDrawer />
                    <CityModal />
                    <TelegramWidget />
                    <AiConsultantWidget />
                    <Toaster richColors position="top-right" closeButton />
                  </WishlistProvider>
                </CityProvider>
              </CartProvider>
            </SiteSettingsProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
      </html>
    </ViewTransitions>
  );
}
