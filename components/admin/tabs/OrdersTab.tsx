'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { Order } from '@/types/database';

interface OrdersTabProps {
  orders: Order[];
}

export default function OrdersTab({ orders }: OrdersTabProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-2">
        <Package className="w-12 h-12 text-gray-300 mx-auto" />
        <h3 className="font-bold text-gray-800">Замовлень поки що немає</h3>
        <p className="text-xs text-gray-500">
          Нові замовлення з кошика з'являтимуться тут автоматично.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {orders.map((ord: Order, idx: number) => (
          <div
            key={ord.id || ord.order_number || idx}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-blue-900">{ord.order_number || `№${idx + 1}`}</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {ord.status || 'Нове'}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(ord.created_at || Date.now()).toLocaleString('uk-UA')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-gray-400 font-semibold mb-0.5">Клієнт:</div>
                <div className="font-bold text-gray-900">{ord.customer_name}</div>
                <div className="text-blue-600 font-bold">{ord.phone}</div>
                {ord.email && <div className="text-gray-500">{ord.email}</div>}
              </div>

              <div>
                <div className="text-gray-400 font-semibold mb-0.5">Доставка та адреса:</div>
                <div className="font-bold text-gray-900">{ord.city}</div>
                <div className="text-gray-600">{ord.delivery_address}</div>
                <div className="text-gray-500 text-[11px] capitalize">{ord.delivery_type}</div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-gray-400 font-semibold mb-0.5">Сума до сплати:</div>
                <div className="text-xl font-black text-blue-950">
                  {ord.total_amount?.toLocaleString('uk-UA')} грн
                </div>
                <div className="text-gray-500 text-[11px] capitalize">
                  {ord.payment_method === 'cash_on_delivery' ? 'Післяплата' : ord.payment_method}
                </div>
              </div>
            </div>

            {ord.items && ord.items.length > 0 && (
              <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-600 space-y-1">
                <div className="font-semibold text-gray-700">Позиції замовлення:</div>
                {ord.items.map((it: any, itemIdx: number) => (
                  <div key={itemIdx} className="flex justify-between">
                    <span>
                      • {it.title} ({it.width}×{it.height} см, {it.color}) × {it.quantity} шт
                    </span>
                    <span className="font-bold text-gray-800">{it.totalPrice || it.total_price || (it.unitPrice * it.quantity)} грн</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
