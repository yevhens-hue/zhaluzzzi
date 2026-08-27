'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Camera, ShoppingBag, Send, Calculator, PhoneCall, Sparkles, X, CheckCircle, ShieldCheck, Bot } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { MobileDrawer } from './MobileDrawer';
import { validateAndNormalizeUaPhone } from '@/lib/phoneValidator';
import { createLead } from '@/lib/supabase';
import { TurnstileShield } from './TurnstileShield';
import { trackEvent } from '@/lib/analytics';

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, toggleCart } = useCart();
  const { t } = useLanguage();

  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Do not render on admin or visualizer standalone full-screen pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  const handleAiMeasureClick = () => {
    triggerHaptic();
    trackEvent('mobile_bottom_ai_measure_click');
    router.push('/zamir');
  };

  const handleCalculatorClick = () => {
    triggerHaptic();
    trackEvent('mobile_bottom_calculator_click');
    if (pathname === '/') {
      const calcElem = document.getElementById('calculator');
      if (calcElem) {
        calcElem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push('/#calculator');
  };

  const handleQuickCallClick = () => {
    triggerHaptic();
    trackEvent('mobile_bottom_quick_call_click');
    setIsConsultOpen(true);
  };

  const handleAiConsultantClick = () => {
    triggerHaptic();
    trackEvent('mobile_bottom_ai_consultant_click');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-ai-consultant'));
    }
  };

  const handleCartClick = () => {
    triggerHaptic();
    trackEvent('mobile_bottom_cart_click');
    toggleCart();
  };

  const phoneValidation = validateAndNormalizeUaPhone(phone);

  const handleSubmitConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Введіть коректний номер телефону України');
      return;
    }

    setPhoneError(null);
    setIsSubmitting(true);
    try {
      await createLead({
        name: name.trim() || 'Клієнт (Мобільний бар)',
        phone: phoneValidation.normalizedPhone || phone,
        comment: `Швидка заявка з мобільної панелі. ${comment ? `Коментар: ${comment}` : ''}`,
      });

      trackEvent('mobile_bar_lead_submitted', {
        page: pathname,
      });

      setIsSuccess(true);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([15, 50, 15]);
        } catch (_) {}
      }
      setTimeout(() => {
        setIsSuccess(false);
        setIsConsultOpen(false);
        setPhone('');
        setName('');
        setComment('');
      }, 3000);
    } catch (err) {
      console.error('Lead error:', err);
      setPhoneError('Помилка відправки. Зателефонуйте нам напряму: (093) 912-85-31');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Bottom Thumb-Zone Bar for Mobile Devices */}
      <aside aria-label="Мобільне меню швидких дій" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1">
          {/* 1. AI-Measure Shortcut */}
          <button
            onClick={handleAiMeasureClick}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-300 active:text-emerald-400 active:scale-95 transition-all relative"
            title="AI-Замір вікна по фото"
          >
            <div className="relative">
              <Camera className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-semibold mt-1 tracking-tight">AI-Замір</span>
          </button>

          {/* 2. Calculator Shortcut */}
          <button
            onClick={handleCalculatorClick}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-300 active:text-amber-400 active:scale-95 transition-all"
            title="Онлайн-калькулятор"
          >
            <Calculator className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-medium mt-1 tracking-tight">Розрахунок</span>
          </button>

          {/* 3. Main Center CTA: Quick Order / Consult */}
          <button
            onClick={handleQuickCallClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <PhoneCall className="w-4 h-4 animate-pulse text-amber-300" />
            <span>Швидкий замір</span>
          </button>

          {/* 4. AI-Consultant Direct */}
          <button
            onClick={handleAiConsultantClick}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-300 active:text-indigo-400 active:scale-95 transition-all relative"
            title="AI-Консультант онлайн"
            aria-label="AI-консультант онлайн"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            </div>
            <span className="text-[10px] font-medium mt-1 tracking-tight">AI-Чат</span>
          </button>

          {/* 5. Cart */}
          <button
            onClick={handleCartClick}
            className="flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl text-slate-300 active:text-amber-400 active:scale-95 transition-all relative"
            title="Кошик"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-1 tracking-tight">Кошик</span>
          </button>
        </div>
      </aside>

      {/* iOS Bottom Sheet Drawer for Quick Consultation & Measure Request */}
      <MobileDrawer
        open={isConsultOpen}
        onOpenChange={setIsConsultOpen}
        title="Швидкий виклик майстра на замір"
        description="Залиште телефон — майстер зв'яжеться протягом 5 хвилин для узгодження часу або безкоштовної консультації"
      >
        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Дякуємо за заявку!</h4>
            <p className="text-sm text-slate-300">
              Майстер Віктор Кузьменко зателефонує вам найближчим часом.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitConsult} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ваше ім&apos;я
              </label>
              <input
                type="text"
                placeholder="Олександр"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Номер телефону <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+380 (__) ___-__-__"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-800/80 border rounded-xl text-white placeholder-slate-500 focus:outline-none text-sm ${
                  phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-blue-500'
                }`}
              />
              {phoneError && (
                <p className="text-red-400 text-xs mt-1">{phoneError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Що саме вас цікавить? (за бажанням)
              </label>
              <input
                type="text"
                placeholder="Наприклад: 3 ролети День-Ніч у Дніпрі"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <TurnstileShield />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Відправка...</span>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <span>Викликати замірника безкоштовно</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Безкоштовний виїзд зі зразками тканин у Дніпрі</span>
            </div>
          </form>
        )}
      </MobileDrawer>
    </>
  );
}
