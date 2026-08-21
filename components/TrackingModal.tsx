'use client';

import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, AlertCircle, Clock, Package, X } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrackingModal({ isOpen, onClose }: TrackingModalProps) {
  const [ttn, setTtn] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    citySender: string;
    cityRecipient: string;
    cargoDescription: string;
    estimatedDeliveryDate: string;
  } | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ttn.trim() || ttn.length < 5) {
      setError('Введіть коректний номер ТТН (не менше 5 символів)');
      return;
    }

    setError('');
    setLoading(true);

    // Simulate Nova Poshta API response
    setTimeout(() => {
      setLoading(false);
      setResult({
        status: 'Відправлення прямує до одержувача',
        citySender: 'Дніпро',
        cityRecipient: 'Київ (або ваше місто)',
        cargoDescription: 'Сонцезахисна система (Ролети / Жалюзі)',
        estimatedDeliveryDate: 'Завтра до 15:00',
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-gray-900">Відстеження Нова Пошта</h3>
            <p className="text-xs text-gray-500">Введіть номер експрес-накладної (ТТН)</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Номер ТТН (наприклад, 2045...)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Введіть 14 цифр ТТН"
                value={ttn}
                onChange={(e) => setTtn(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:outline-hidden focus:border-red-600"
              />
              <Package className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Перевірити статус</span>
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700 animate-slide-up">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{result.status}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 space-y-1">
              <p><strong>Маршрут:</strong> {result.citySender} → {result.cityRecipient}</p>
              <p><strong>Вантаж:</strong> {result.cargoDescription}</p>
              <p><strong>Орієнтовна доставка:</strong> {result.estimatedDeliveryDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
