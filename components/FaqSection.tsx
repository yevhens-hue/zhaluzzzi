'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function FaqSection() {
  const { t } = useLanguage();

  return (
    <div className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>{t('Відповіді на часті запитання', 'Ответы на частые вопросы')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-gray-900">
          {t('Питання та відповіді', 'Вопросы и ответы')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t('Все, що потрібно знати про вибір, замір, виготовлення та монтаж сонцезахисних систем.', 'Все, что нужно знать о выборе, замере, изготовлении и монтаже солнцезащитных систем.')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/60 p-4 sm:p-6 luxury-card-shadow">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="px-2 border-b border-gray-100 last:border-0">
              <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900 hover:text-blue-600 transition">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

