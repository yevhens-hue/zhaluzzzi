'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Check, MapPin } from 'lucide-react';
import { useCity } from '@/context/CityContext';
import { CITIES_LIST } from '@/lib/mockData';

export function CityModal() {
  const { isModalOpen, closeModal, setCity, currentCity } = useCity();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  const filteredCities = CITIES_LIST.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Оберіть ваше місто</h3>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Не знайшли свого міста у списку? Не хвилюйтеся — ми виготовляємо та швидко доставляємо замовлення Новою Поштою по всій території України!
        </p>

        {/* Search input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Введіть назву міста..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Cities List */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-1.5 max-h-72">
          {filteredCities.map((city) => {
            const isSelected = currentCity === city.name;
            return (
              <button
                key={city.slug}
                onClick={() => setCity(city.name)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <span>{city.name}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500">
              Місто не знайдено. Ми відправляємо замовлення у будь-який населений пункт України!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setCity('Всі міста')}
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Для всіх міст України
          </button>
        </div>
      </div>
    </div>
  );
}
