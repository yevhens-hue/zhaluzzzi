'use client';

import React from 'react';
import { Users } from 'lucide-react';
import { Lead } from '@/types/database';

interface LeadsTabProps {
  leads: Lead[];
}

export default function LeadsTab({ leads }: LeadsTabProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
        <Users className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="font-bold text-gray-800">Заявок в 1 клік поки що немає</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {leads.map((lead: Lead, idx: number) => (
          <div
            key={lead.id || idx}
            className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
          >
            <div>
              <div className="font-bold text-base text-blue-600">{lead.phone}</div>
              <div className="text-gray-900 font-semibold mt-0.5">
                {lead.name ? `Клієнт: ${lead.name}` : 'Швидка покупка в 1 клік'}
              </div>
              {lead.product_title && (
                <div className="text-gray-600 text-[11px]">
                  Товар: <strong>{lead.product_title}</strong> {lead.dimensions && `(${lead.dimensions})`}
                </div>
              )}
              {lead.comment && (
                <div className="text-gray-500 text-[11px] italic mt-1">
                  Повідомлення: "{lead.comment}"
                </div>
              )}
            </div>

            <div className="text-left sm:text-right space-y-1">
              {lead.calculated_price && (
                <div className="font-black text-gray-900 text-sm">
                  {lead.calculated_price} грн
                </div>
              )}
              <div className="text-[10px] text-gray-400">
                {new Date(lead.created_at || Date.now()).toLocaleString('uk-UA')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
