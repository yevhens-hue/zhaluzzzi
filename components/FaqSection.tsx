'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '@/lib/mockData';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function FaqSection() {
  return (
    <div className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Відповіді на часті запитання</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Питання та відповіді
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Все, що потрібно знати про вибір, замір, виготовлення та монтаж сонцезахисних систем.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 shadow-xs">
        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {FAQ_ITEMS.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="px-2">
              <AccordionTrigger className="text-sm sm:text-base font-bold text-gray-900">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
