'use client';

import React, { createContext, useContext, useState } from 'react';

export type Lang = 'uk';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (ukText: string, ruText?: string) => string;
  tProdTitle: (title: string) => string;
  tColorName: (color: string) => string;
  tCharKey: (key: string) => string;
  tCharVal: (val: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang] = useState<Lang>('uk');

  const setLang = () => {
    // Single language (Ukrainian) active
  };

  const t = (ukText: string) => ukText;
  const tProdTitle = (title: string) => title;
  const tColorName = (color: string) => color;
  const tCharKey = (key: string) => key;
  const tCharVal = (val: string) => val;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tProdTitle, tColorName, tCharKey, tCharVal }}>
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
