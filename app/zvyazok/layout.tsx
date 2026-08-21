import type { Metadata } from 'next';
import { SITE_URL } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Контакти та консультація майстра у м. Дніпро | Жалюзі та Ролети',
  description:
    'Контакти виробника сонцезахисних систем у Дніпрі. Замовлення заміру, консультація та прорахунок вартості: (093) 912-85-31. Telegram, Viber, Instagram.',
  keywords: [
    'контакти жалюзі дніпро',
    'замір ролет дніпро',
    'віктор кузьменко контакти',
    'консультація ролети дніпро',
  ],
  openGraph: {
    title: 'Контакти та консультація — Жалюзі та Ролети від виробника (Дніпро)',
    description:
      'Замовлення заміру, прорахунок вартості та консультація майстра у м. Дніпро. Телефони: (093) 912-85-31, (093) 510-55-21.',
    url: `${SITE_URL}/zvyazok`,
  },
  alternates: {
    canonical: `${SITE_URL}/zvyazok`,
  },
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
