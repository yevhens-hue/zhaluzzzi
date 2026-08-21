import type { Metadata } from 'next';
import { SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Оформлення замовлення | Жалюзі та Ролети від виробника',
  description:
    'Швидке оформлення замовлення на виготовлення сонцезахисних систем за індивідуальними розмірами. Доставка Новою Поштою або самовивіз.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${SITE_URL}/checkout`,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
