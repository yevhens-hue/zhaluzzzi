'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Eye, MapPin, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface SocialProofEvent {
  id: string;
  type: 'order' | 'viewers' | 'measurement' | 'review';
  name: string;
  location: string;
  action: string;
  timeAgo: string;
  image?: string;
}

const SOCIAL_PROOF_EVENTS: SocialProofEvent[] = [
  {
    id: 'sp-1',
    type: 'order',
    name: 'Олена',
    location: 'ж/м Перемога, Дніпро',
    action: 'щойно замовила штори День-Ніч Преміум',
    timeAgo: '4 хв тому',
    image: 'https://manov.com.ua/image/cache/catalog/day-night/akvarel-vn-1208-318x480.jpg',
  },
  {
    id: 'sp-2',
    type: 'viewers',
    name: 'Зараз 3 людини',
    location: 'Дніпро та область',
    action: 'переглядають тканину «Блекаут Графіт 100%»',
    timeAgo: 'прямо зараз',
    image: 'https://manov.com.ua/image/cache/catalog/blackout/roller-blind/rb-Umbra-BO-graphity-318x480.jpg',
  },
  {
    id: 'sp-3',
    type: 'measurement',
    name: 'Олександр',
    location: 'Центр, Дніпро',
    action: 'записався на безкоштовний виїзд замірника зі зразками',
    timeAgo: '11 хв тому',
  },
  {
    id: 'sp-4',
    type: 'order',
    name: 'Тетяна',
    location: 'Лівий берег, Дніпро',
    action: 'оформила замовлення на рулонні штори Berlin',
    timeAgo: '18 хв тому',
    image: 'https://manov.com.ua/image/cache/catalog/roller-blind/roller-blind-berlin-0842-318x480.jpg',
  },
  {
    id: 'sp-5',
    type: 'review',
    name: 'Ігор В.',
    location: 'ж/м Тополя, Дніпро',
    action: 'залишив відгук: «Встановили за 2 дні, ідеальна якість!» ⭐⭐⭐⭐⭐',
    timeAgo: '25 хв тому',
  },
  {
    id: 'sp-6',
    type: 'order',
    name: 'Катерина',
    location: 'Слобожанське',
    action: 'замовила закриту касетну систему Uni-2 для кухні',
    timeAgo: '32 хв тому',
    image: 'https://manov.com.ua/image/cache/catalog/roller-blind/close-system/cs-rb-len-0881-318x480.jpg',
  },
];

export function SocialProofNotifications() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial popup delay: 6 seconds after loading
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    // Interval to cycle through notifications (visible for 6s, next after 16s)
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SOCIAL_PROOF_EVENTS.length);
        setIsVisible(true);
      }, 10000); // 10s quiet gap
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  const currentEvent = SOCIAL_PROOF_EVENTS[currentIndex];

  if (isDismissed || !currentEvent) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-[340px] pointer-events-none hidden sm:block">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-200/90 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3 relative group"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setIsDismissed(true);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition cursor-pointer"
              aria-label="Закрити сповіщення"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Event Icon or Product Thumbnail */}
            <div className="relative shrink-0">
              {currentEvent.image ? (
                <img
                  src={currentEvent.image}
                  alt={currentEvent.action}
                  className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-2xs"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  {currentEvent.type === 'viewers' ? (
                    <Eye className="w-5 h-5 text-amber-500 animate-pulse" />
                  ) : currentEvent.type === 'measurement' ? (
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-2 h-2 text-white" />
              </span>
            </div>

            {/* Content */}
            <div className="pr-4 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="font-semibold text-gray-700 truncate">{currentEvent.location}</span>
                <span>•</span>
                <span className="text-[10px] text-gray-400 shrink-0">{currentEvent.timeAgo}</span>
              </div>

              <p className="text-xs text-gray-800 leading-snug">
                <b className="font-bold text-gray-900">{currentEvent.name}</b> {currentEvent.action}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
