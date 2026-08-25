'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'next-view-transitions';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, Award, Star, Zap, CheckCircle2, Calculator } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const SLIDES = [
    {
      id: 1,
      tag: t('Власне виробництво у Дніпрі', 'Собственное производство в Днепре'),
      title: t('Жалюзі та Рулонні Штори від Виробника', 'Жалюзи и Рулонные Шторы от Производителя'),
      subtitle: t('Індивідуальний розкрій за вашими розмірами з точністю до 1 мм. Понад 450 зразків європейських тканин та надійні механізми Besta.', 'Индивидуальный раскрой по вашим размерам с точностью до 1 мм. Более 450 образцов европейских тканей и надежные механизмы Besta.'),
      highlight: t('Виїзд замірника зі зразками сьогодні', 'Выезд замерщика с образцами сегодня'),
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80',
      ctaText: t('Розрахувати вартість онлайн', 'Рассчитать стоимость онлайн'),
      ctaLink: '#calculator',
      secondaryText: t('3D Примірка на вікні', '3D Примерка на окне'),
      secondaryLink: '/visualizer',
      accentColor: 'from-slate-950/95 via-slate-900/80 to-slate-950/40',
    },
    {
      id: 2,
      tag: t('Хіт продажів 2026', 'Хит продаж 2026'),
      title: t('Штори День-Ніч: Керуйте світлом в 1 дотик', 'Шторы День-Ночь: Управляйте светом в 1 касание'),
      subtitle: t('Зручне чергування прозорих та затемнюючих смуг. Захист від поглядів сусідів та м\'яке розсіяне світло вдень.', 'Удобное чередование прозрачных и затемняющих полос. Защита от взглядов соседей и мягкий рассеянный свет днем.'),
      highlight: t('Знижка -20% на кожне 2-ге вікно', 'Скидка -20% на каждое 2-е окно'),
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
      ctaText: t('Каталог День-Ніч', 'Каталог День-Ночь'),
      ctaLink: '/catalog?search=День-Ніч',
      secondaryText: t('Замовити безкоштовний замір', 'Заказать бесплатный замер'),
      secondaryLink: '/zamir',
      accentColor: 'from-blue-950/95 via-slate-900/80 to-blue-950/40',
    },
    {
      id: 3,
      tag: t('Практичність та надійність', 'Практичность и надежность'),
      title: t('Горизонтальні та Вертикальні Жалюзі', 'Горизонтальные и Вертикальные Жалюзи'),
      subtitle: t('Надійні алюмінієві жалюзі 25 мм для дому та офісу, а також практичні вертикальні тканинні жалюзі 89 мм і 127 мм від виробника.', 'Надежные алюминиевые жалюзи 25 мм для дома и офиса, а также практичные вертикальные тканевые жалюзи 89 мм и 127 мм от производителя.'),
      highlight: t('Вигідна ціна від 420 грн/м² • Швидкий монтаж', 'Выгодная цена от 420 грн/м² • Быстрый монтаж'),
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80',
      ctaText: t('Каталог жалюзі', 'Каталог жалюзи'),
      ctaLink: '/zhaluzi',
      secondaryText: t('Консультація майстра', 'Консультация мастера'),
      secondaryLink: '/zvyazok',
      accentColor: 'from-slate-950/95 via-slate-900/80 to-slate-950/40',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative w-full my-4 sm:my-6 space-y-4">
      {/* Main Slider Frame */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-slate-950">
        {/* Slides Container */}
        <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full">
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
                <div className="absolute inset-0 bg-black/30" />

                {/* Content Overlay */}
                <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center text-white space-y-4 sm:space-y-6">
                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider w-fit text-amber-300 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{slide.tag}</span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif-editorial font-bold leading-tight max-w-3xl tracking-tight text-white drop-shadow-xl">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-base text-gray-200 max-w-2xl leading-relaxed drop-shadow-sm font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Highlight bar */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
                    <Zap className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{slide.highlight}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link href={slide.ctaLink} onClick={(e) => handleLinkClick(e, slide.ctaLink)}>
                      <Button variant="glow" size="xl" className="rounded-2xl shadow-2xl">
                        {slide.ctaLink === '#calculator' && <Calculator className="w-5 h-5 mr-1" />}
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-5 h-5 ml-1" />
                      </Button>
                    </Link>

                    <Link href={slide.secondaryLink} onClick={(e) => handleLinkClick(e, slide.secondaryLink)}>
                      <Button variant="outline" size="xl" className="rounded-2xl bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-md">
                        <span>{slide.secondaryText}</span>
                      </Button>
                    </Link>
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label={t('Наступний слайд', 'Следующий слайд')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`${t('Слайд', 'Слайд')} ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Bottom Trust Badges Bar */}
        <div className="relative z-20 bg-slate-900/95 backdrop-blur-md border-t border-white/10 py-3.5 px-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-white text-center text-xs font-semibold">
          <div className="flex items-center justify-center gap-2 text-gray-200">
            <Truck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{t('Доставка Новою Поштою', 'Доставка Новой Почтой')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('Гарантія 24 місяці', 'Гарантия 24 месяца')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-200">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('Власне виробництво у Дніпрі', 'Собственное производство в Днепре')}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-200">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{t('Безкоштовний замір', 'Бесплатный замер')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs font-bold text-gray-500 shrink-0 hidden sm:inline">Швидкий перехід:</span>
        <Link
          href="/shtori"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <span>☀️ Рулонні штори</span>
        </Link>
        <Link
          href="/catalog?search=День-Ніч"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <span>🌗 Штори День-Ніч</span>
        </Link>
        <Link
          href="/catalog?search=Блекаут"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <span>🌙 100% Блекаут</span>
        </Link>
        <Link
          href="/zhaluzi"
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-800 hover:border-blue-500 hover:text-blue-600 hover:shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <span>🏢 Жалюзі</span>
        </Link>
        <a
          href="#calculator"
          onClick={(e) => handleLinkClick(e, '#calculator')}
          className="px-4 py-2 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-blue-600" />
          <span>🧮 Онлайн-калькулятор</span>
        </a>
        <Link
          href="/visualizer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold hover:shadow-md transition shrink-0 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>🎨 3D Онлайн-примірка</span>
        </Link>
      </div>
    </div>
  );
}
