'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function HeroBanner() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      id: 1,
      title: t('Сонцезахисні системи для квартири та будинку', 'Солнцезащитные системы для квартиры и дома'),
      subtitle: t('Власне виробництво в Україні за вашими індивідуальними розмірами. Відправка за 2-4 дні.', 'Собственное производство в Украине по вашим индивидуальным размерам. Отправка за 2-4 дня.'),
      highlight: t('Знижки до -25% на популярні колекції', 'Скидки до -25% на популярные коллекции'),
      badge: t('100% Гарантія якості', '100% Гарантия качества'),
      image: 'https://manov.com.ua/image/cache/catalog/banners/nslider-1920x600.jpg',
      ctaText: t('Обрати ролети', 'Выбрать роллеты'),
      ctaLink: '/roleti',
      accentColor: 'from-blue-900/90 via-blue-950/70 to-transparent',
    },
    {
      id: 2,
      title: t('Ролети День-Ніч: ідеальний контроль світла', 'Роллеты День-Ночь: идеальный контроль света'),
      subtitle: t('Понад 200 кольорів та фактур з європейських тканин. Легкий монтаж за 10 хвилин.', 'Более 200 цветов и фактур из европейских тканей. Легкий монтаж за 10 минут.'),
      highlight: t('Оплата частинами ПриватБанк та Monobank', 'Оплата частями ПриватБанк и Monobank'),
      badge: t('Хіт продажів 2026', 'Хит продаж 2026'),
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
      ctaText: t('Дивитися каталог', 'Смотреть каталог'),
      ctaLink: '/roleti?sub=den-nich',
      accentColor: 'from-slate-900/90 via-slate-950/70 to-transparent',
    },
    {
      id: 3,
      title: t('Дерев’яні та бамбукові жалюзі преміум класу', 'Деревянные и бамбуковые жалюзи премиум класса'),
      subtitle: t('Екологічні природні матеріали з канадської липи та бамбука. Вишуканість для вашого інтер’єру.', 'Экологичные природные материалы из канадской липы и бамбука. Изысканность для вашего интерьера.'),
      highlight: t('Безкоштовна консультація менеджера', 'Бесплатная консультация менеджера'),
      badge: t('Преміум серія', 'Премиум серия'),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      ctaText: t('Каталог жалюзі', 'Каталог жалюзи'),
      ctaLink: '/zhaluzi',
      accentColor: 'from-amber-950/90 via-slate-950/70 to-transparent',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl my-4 sm:my-6 border border-gray-100 bg-slate-950">
      {/* Slides Container */}
      <div className="relative h-[420px] sm:h-[480px] lg:h-[520px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
                sizes="100vw"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor}`} />
              <div className="absolute inset-0 bg-black/20" />

              {/* Content Overlay */}
              <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center text-white space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold w-fit text-amber-300 shadow-sm animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.badge}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight max-w-2xl tracking-tight text-white drop-shadow-md">
                  {slide.title}
                </h2>

                <p className="text-xs sm:text-base text-gray-200 max-w-xl leading-relaxed drop-shadow-xs">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-xs font-bold text-amber-300 bg-black/40 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/10">
                    🔥 {slide.highlight}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label={t('Попередній слайд', 'Предыдущий слайд')}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition border border-white/20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label={t('Наступний слайд', 'Следующий слайд')}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition border border-white/20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`${t('Слайд', 'Слайд')} ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Bottom Trust Badges */}
      <div className="relative z-20 bg-slate-900/90 backdrop-blur-md border-t border-white/10 py-3 px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white text-center text-[11px] font-semibold">
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <Truck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{t('Доставка Новою Поштою', 'Доставка Новой Почтой')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t('Гарантія 12 місяців', 'Гарантия 12 месяцев')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <Award className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t('10+ років виробництва', '10+ лет производства')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{t('Замір та консультація', 'Замер и консультация')}</span>
        </div>
      </div>
    </div>
  );
}
