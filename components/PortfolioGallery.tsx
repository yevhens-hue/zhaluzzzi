'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, X, ZoomIn } from 'lucide-react';

const portfolioItems = [
  {
    id: 1,
    title: 'Рулонні штори День-Ніч у сучасній вітальні',
    city: 'м. Дніпро, пр. Яворницького',
    image: 'https://images.unsplash.com/photo-1618221639244-c1a8502c0eb9?auto=format&fit=crop&w=800&q=80',
    category: 'День-Ніч',
  },
  {
    id: 2,
    title: 'Дерев’яні жалюзі 50 мм у кабінеті',
    city: 'м. Київ, Печерськ',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    category: 'Жалюзі',
  },
  {
    id: 3,
    title: 'Закрита система Uni на панорамному вікні',
    city: 'м. Одеса, Аркадія',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    category: 'Закрита система',
  },
  {
    id: 4,
    title: 'Тканинні ролети Блекаут у спальні',
    city: 'м. Харків, Центр',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    category: 'Блекаут',
  },
];

export function PortfolioGallery() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Наші реалізовані проєкти</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Фотогалерея робіт у будинках та квартирах
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Приклади професійного монтажу сонцезахисних систем нашим майстром Віктором Кузьменком.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item.image)}
            className="group relative bg-gray-100 rounded-3xl overflow-hidden aspect-4/5 shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mb-1">
                {item.category}
              </span>
              <h3 className="text-white font-bold text-sm sm:text-base leading-snug">
                {item.title}
              </h3>
              <p className="text-gray-300 text-xs mt-1">{item.city}</p>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={activeImage}
              alt="Галерея"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
