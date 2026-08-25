'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Sun, Moon, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="my-14 sm:my-20">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Інтерактивне порівняння</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Відчуйте різницю: До та Після 100% Блекауту
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Потягніть повзунок по центру, щоб побачити, як наші рулонні штори захищають кімнату від пекучого сонця, спеки та відблисків.
        </p>
      </div>

      {/* Main Interactive Slider Container */}
      <div
        ref={containerRef}
        onPointerMove={(e) => {
          if (isDragging || e.buttons === 1) handleMove(e.clientX);
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-16/9 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200/80 select-none cursor-ew-resize bg-slate-900 group"
      >
        {/* Layer 1: AFTER (Full width background - Blackout) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/compare/blackout_after.jpg"
            alt="Після встановлення блекаут штор: затишок та темрява"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          {/* Label Right: After */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg pointer-events-none">
            <Moon className="w-4 h-4 text-indigo-300" />
            <span>З ролетами Блекаут (100% темряви)</span>
          </div>
        </div>

        {/* Layer 2: BEFORE (Clipped layer - Sun glare) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="relative w-full h-full min-w-[320px] max-w-5xl" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
            <Image
              src="/images/compare/sun_before.jpg"
              alt="До встановлення штор: сліпуче сонце та спека"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
            />
          </div>
          {/* Label Left: Before */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-amber-500/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg pointer-events-none">
            <Sun className="w-4 h-4 text-white" />
            <span>Без штор (Спека та бліки)</span>
          </div>
        </div>

        {/* Draggable Divider Line & Knob */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Knob Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-blue-600 shadow-2xl border-2 border-blue-600 flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 transition-transform">
            <div className="flex items-center gap-0.5 font-black text-xs">
              <span>◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA below slider */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <Link href="/roleti">
          <Button variant="glow" size="lg" className="rounded-2xl shadow-xl">
            <span>Каталог штор Блекаут</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>

        <Link href="/zamir">
          <Button variant="outline" size="lg" className="rounded-2xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1" />
            <span>Викликати майстра на замір (Дніпро)</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
