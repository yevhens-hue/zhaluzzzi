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
  // Maps internal characteristic keys → Ukrainian labels for display on product pages
  const CHAR_KEY_MAP: Record<string, string> = {
    // Standard product characteristics
    fabric:       'Тканина / Матеріал',
    material:     'Матеріал',
    texture:      'Текстура',
    color:        'Основний колір',
    blackout:     'Світлоізоляція',
    system:       'Система керування',
    manufacturer: 'Виробник',
    country:      'Країна виробника',
    care:         'Догляд та чищення',
    warranty:     'Гарантія',
    type:         'Тип виробу',
    width:        'Ширина',
    height:       'Висота',
    width_range:  'Діапазон ширини',
    height_range: 'Діапазон висоти',
    weight:       'Вага (кг/м²)',
    fire_class:   'Клас горючості',
    eco:          'Екологічність',
    light:        'Пропускання світла',
    noise:        'Шумопоглинання',
    installation: 'Спосіб монтажу',
    drive:        'Привід',
    collection:   'Колекція',
    code:         'Код тканини',
    thickness:    'Товщина',
  };

  const tCharKey = (key: string): string => CHAR_KEY_MAP[key] ?? key;
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
