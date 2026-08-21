'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Сонцезахисні системи для квартири та будинку',
    subtitle: 'Власне виробництво в Україні за вашими індивідуальними розмірами. Відправка за 2-4 дні.',
    highlight: 'Знижки до -25% на популярні колекції',
    badge: '100% Гарантія якості',
    image: 'https://manov.com.ua/image/cache/catalog/banners/nslider-1920x600.jpg',
    ctaText: 'Обрати ролети',
    ctaLink: '/roleti',
    accentColor: 'from-blue-900/90 via-blue-950/70 to-transparent',
  },
  {
    id: 2,
    title: 'Ролети День-Ніч: ідеальний контроль світла',
    subtitle: 'Понад 200 кольорів та фактур з європейських тканин. Легкий монтаж за 10 хвилин.',
    highlight: 'Оплата частинами ПриватБанк та Monobank',
    badge: 'Хіт продажів 2026',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Дивитися каталог',
    ctaLink: '/roleti?sub=den-nich',
    accentColor: 'from-slate-900/90 via-slate-950/70 to-transparent',
  },
  {
    id: 3,
    title: 'Дерев’яні та бамбукові жалюзі преміум класу',
    subtitle: 'Екологічні природні матеріали з канадської липи та бамбука. Вишуканість для вашого інтер’єру.',
    highlight: 'Безкоштовна консультація менеджера',
    badge: 'Преміум серія',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Каталог жалюзі',
    ctaLink: '/zhaluzi',
    accentColor: 'from-amber-950/90 via-slate-950/70 to-transparent',
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-gray-900 mb-8 border border-gray-100">
      {/* Banner image background */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover transition-all duration-700 scale-100"
          priority
          unoptimized
        />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-3xl z-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 text-xs font-bold w-fit mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-200 mt-3 sm:mt-4 leading-relaxed line-clamp-3">
            {slide.subtitle}
          </p>

          <div className="mt-2 text-xs font-bold text-amber-400">
            ⭐ {slide.highlight}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
            <Link
              href={slide.ctaLink}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/zamir"
              className="px-5 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white rounded-xl text-xs sm:text-sm font-semibold transition border border-white/20"
            >
              Як правильно заміряти?
            </Link>
          </div>
        </div>

        {/* Slider Navigation Arrows */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition"
            aria-label="Попередній слайд"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition"
            aria-label="Наступний слайд"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots indicators */}
        <div className="absolute bottom-6 left-6 sm:left-16 z-20 flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/50'
              }`}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mini Feature Highlights bar below slider */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-50 border-t border-gray-200 text-gray-700 py-3.5 px-4 text-xs font-medium gap-3">
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <Award className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Понад 10 років на ринку</span>
        </div>
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <Truck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Швидка доставка по Україні</span>
        </div>
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Гарантія 12 місяців</span>
        </div>
        <div className="flex items-center gap-2.5 justify-center sm:justify-start">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
          <span>Європейська фурнітура Besta</span>
        </div>
      </div>
    </div>
  );
}
