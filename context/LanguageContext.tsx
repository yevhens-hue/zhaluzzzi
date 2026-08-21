'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'uk' | 'ru';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (ukText: string, ruText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionary translations or dynamic picker
const translations: Record<string, Record<Lang, string>> = {
  catalog: { uk: 'Каталог товарів', ru: 'Каталог товаров' },
  cart: { uk: 'Кошик', ru: 'Корзина' },
  popular: { uk: 'Хіти замовлень', ru: 'Хиты заказов' },
  newArrivals: { uk: 'Свіжі надходження', ru: 'Свежие поступления' },
  calculator: { uk: 'Інтерактивний 3D-онлайн калькулятор', ru: 'Интерактивный 3D-онлайн калькулятор' },
  delivery: { uk: 'Доставка та оплата', ru: 'Доставка и оплата' },
  contacts: { uk: 'Контакти', ru: 'Контакты' },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('uk');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('app_lang') as Lang;
      if (saved && (saved === 'uk' || saved === 'ru')) {
        setLangState(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('app_lang', newLang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (ukText: string, ruText: string) => {
    return lang === 'ru' ? ruText : ukText;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
