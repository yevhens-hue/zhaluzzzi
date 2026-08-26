'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Smartphone,
  Monitor,
  MapPin,
  Calculator,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';

interface AnalyticsDashboardTabProps {
  showNotification?: (msg: string) => void;
}

export default function AnalyticsDashboardTab({ showNotification }: AnalyticsDashboardTabProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Plausible / Umami Privacy-First Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Власна аналітика магазину без Google Analytics
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            100% без cookies, не передає персональні дані третім особам, не сповільнює сайт та не блокується AdBlock.
          </p>
        </div>

        {/* Time range picker */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-md border border-white/10 shrink-0">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                timeRange === range ? 'bg-white text-blue-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              {range === '7d' ? '7 днів' : range === '30d' ? '30 днів' : '3 місяці'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Key Metrics Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Унікальні сесії', value: '3,840', change: '+18.4%', icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Розрахунків у калькуляторі', value: '1,420', change: '+24.1%', icon: Calculator, color: 'text-purple-600 bg-purple-50' },
          { label: 'Конверсія у заявку', value: '6.8%', change: '+1.2%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Середній чек замовлення', value: '2,850 ₴', change: '+5.7%', icon: Layers, color: 'text-amber-600 bg-amber-50' },
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">{m.label}</span>
                <div className={`p-2 rounded-xl ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-gray-900">{m.value}</div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span>{m.change}</span>
                <span className="text-gray-400 font-normal">до минулого періоду</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Calculator Drop-off Funnel ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              <span>Воронка взаємодії з калькулятором (Calculator Funnel)</span>
            </h3>
            <p className="text-xs text-gray-500">
              Показує, на якому етапі користувачі найчастіше завершують або покидають прорахунок.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Загальна конверсія: 18.5%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1. Вибір системи', count: '1,420', pct: '100%', drop: null, color: 'bg-purple-600' },
            { step: '2. Введення розмірів', count: '965', pct: '68.0%', drop: '-32.0%', color: 'bg-purple-500' },
            { step: '3. Вибір тканини', count: '624', pct: '44.0%', drop: '-24.0%', color: 'bg-indigo-500' },
            { step: '4. Оформлено заявку', count: '263', pct: '18.5%', drop: '-25.5%', color: 'bg-emerald-500' },
          ].map((f, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3 relative">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>{f.step}</span>
                {f.drop && <span className="text-[10px] text-rose-500 font-semibold">{f.drop}</span>}
              </div>
              <div className="text-xl font-black text-gray-900">{f.count}</div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className={`h-full ${f.color} rounded-full`} style={{ width: f.pct }} />
              </div>
              <div className="text-[11px] font-mono text-gray-500 text-right">{f.pct} від старту</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2 Columns: Top Fabrics & Dnipro Districts ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Clicked Fabrics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Топ-5 популярних тканин та систем за переглядами:</span>
          </h3>

          <div className="space-y-3">
            {[
              { name: 'Штори День-Ніч «Акварель»', clicks: 840, pct: 100, tag: 'День-Ніч' },
              { name: 'Рулонні штори «Berlin» (Зелений)', clicks: 620, pct: 74, tag: 'Рулонні' },
              { name: 'Blackout «Umbra 100%» (Графіт)', clicks: 510, pct: 60, tag: 'Блекаут' },
              { name: 'Алюмінієві горизонтальні 25 мм', clicks: 390, pct: 46, tag: 'Жалюзі' },
              { name: 'Касетні ролети «Uni-2 Льон»', clicks: 340, pct: 40, tag: 'Закрита' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-gray-400 font-mono w-4">{idx + 1}.</span>
                    <span>{item.name}</span>
                  </span>
                  <span className="font-mono font-bold text-gray-600">{item.clicks} переглядів</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Districts & Devices (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Districts */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Географія попиту по Дніпру:</span>
            </h3>

            <div className="space-y-2.5">
              {[
                { name: 'ж/м Перемога (1-6)', pct: 28 },
                { name: 'Центр / Нагірний', pct: 24 },
                { name: 'Лівий берег (Калинова / Слобожанський)', pct: 21 },
                { name: 'ж/м Тополя / 12 Квартал', pct: 15 },
                { name: 'ж/м Парус / Покровський', pct: 12 },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-700 font-medium">{d.name}</span>
                  <span className="font-bold text-gray-900 font-mono">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Пристрої відвідувачів:</span>
            </h3>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex-1 bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-center space-y-1">
                <Smartphone className="w-5 h-5 text-emerald-600 mx-auto" />
                <div className="text-lg font-black text-emerald-950">78%</div>
                <div className="text-[10px] font-bold text-emerald-700">Смартфони (Мобільні)</div>
              </div>

              <div className="flex-1 bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center space-y-1">
                <Monitor className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="text-lg font-black text-blue-950">22%</div>
                <div className="text-[10px] font-bold text-blue-700">Десктоп / Ноутбуки</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
