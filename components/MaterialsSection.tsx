'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export function MaterialsSection() {
  const materials = [
    {
      title: 'Бавовна та льон',
      desc: 'Натуральні тканини, що створюють затишок та природну свіжість у вашому домі.',
      badge: 'Екологічно',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    {
      title: '100% Поліестер',
      desc: 'Універсальний, стійкий до вигоряння матеріал з антистатичним та пиловідштовхуючим просоченням.',
      badge: 'Популярне',
      iconBg: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Поліестер + Сатин',
      desc: 'Поєднання міцності синтетики з благородним шовковистим блиском сатинової нитки.',
      badge: 'Преміум',
      iconBg: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'ПВХ та скловолокно (Blackout)',
      desc: 'Надміцне тришарове полотно, що забезпечує 100% світлонепроникність та термозахист.',
      badge: '100% Блекаут',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="bg-gray-50/80 rounded-3xl p-6 sm:p-10 border border-gray-200/80 my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Вибір матеріалу та його особливості
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Саме від обраного полотна залежить довговічність, затемнення та стійкість до зовнішніх впливів.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {materials.map((mat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:border-blue-200 hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-3 ${mat.iconBg}`}>
                {mat.badge}
              </span>
              <h3 className="font-bold text-base text-gray-900 mb-1.5">{mat.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{mat.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
              <span>Зразки в каталозі</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
