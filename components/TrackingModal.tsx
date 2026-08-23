'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Search, ExternalLink, Package, X, AlertCircle, CheckCircle2, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingData {
  number: string;
  statusCode: string;
  status: string;
  citySender: string;
  cityRecipient: string;
  warehouseRecipient: string;
  scheduledDeliveryDate: string;
  actualDeliveryDate: string;
  documentCost: string;
  documentWeight: string;
  dateCreated: string;
}

export function TrackingModal({ isOpen, onClose }: TrackingModalProps) {
  const [ttn, setTtn] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ found: boolean; data: TrackingData } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTtn = ttn.replace(/[^0-9]/g, '');

    if (!cleanTtn) {
      setError('Будь ласка, введіть номер ТТН Нової Пошти.');
      setResult(null);
      return;
    }

    if (cleanTtn.length !== 14) {
      setError(`Номер ТТН Нової Пошти має складатися рівно з 14 цифр. Ви ввели ${cleanTtn.length} цифр.`);
      setResult(null);
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttn: cleanTtn, phone }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Не вдалося отримати дані від Нової Пошти.');
        return;
      }

      setResult({
        found: json.found,
        data: json.data,
      });
    } catch (err) {
      console.error(err);
      setError('Помилка з\'єднання. Перевірте інтернет та спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-lg text-gray-900">Відстеження Нова Пошта</h3>
            <p className="text-xs text-gray-500">Перевірка онлайн-статусу у реальному часі</p>
          </div>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Номер ТТН (14 цифр) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="20450000000000"
                value={ttn}
                onChange={(e) => {
                  setTtn(e.target.value);
                  setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-red-600"
              />
              <Package className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Номер телефону одержувача (необов'язково)
            </label>
            <input
              type="tel"
              placeholder="+380..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-red-600"
            />
          </div>

          {error && (
            <div className="flex items-start gap-1.5 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Отримання даних від Нової Пошти...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Запитати актуальний статус</span>
              </>
            )}
          </button>
        </form>

        {/* REAL LIVE RESULTS FROM NOVA POSHTA API */}
        {result && (
          <div className="mt-5 space-y-3 animate-slide-up">
            {!result.found ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-sm">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Номер не знайдено у базі Нової Пошти</span>
                </div>
                <p className="leading-relaxed">
                  Посилку за номером <strong className="font-mono">{result.data.number}</strong> ще не зареєстровано у системі або номер введено з помилкою.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://novaposhta.ua/tracking/?cargo_number=${result.data.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:underline"
                  >
                    <span>Перевірити на офіційному сайті NovaPoshta.ua</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs text-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{result.data.status}</span>
                  </div>
                  <span className="font-mono text-xs text-gray-500 font-bold">{result.data.number}</span>
                </div>

                <div className="space-y-2 pt-1">
                  {(result.data.citySender || result.data.cityRecipient) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Маршрут:</strong>{' '}
                        <span>{result.data.citySender || 'Дніпро'}</span> → <span>{result.data.cityRecipient || 'Одержувач'}</span>
                      </div>
                    </div>
                  )}

                  {result.data.warehouseRecipient && (
                    <div className="flex items-start gap-2">
                      <Truck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Відділення:</strong>{' '}
                        <span>{result.data.warehouseRecipient}</span>
                      </div>
                    </div>
                  )}

                  {result.data.scheduledDeliveryDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Планова доставка:</strong>{' '}
                        <span>{result.data.scheduledDeliveryDate}</span>
                      </div>
                    </div>
                  )}

                  {result.data.documentCost && (
                    <div className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900">Вартість доставки:</strong>{' '}
                        <span>{result.data.documentCost}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 text-center">
                  <a
                    href={`https://novaposhta.ua/tracking/?cargo_number=${result.data.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <span>Офіційна сторінка Нова Пошта ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
