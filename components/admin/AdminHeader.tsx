'use client';

import React from 'react';
import {
  ShieldCheck,
  RefreshCw,
  LogOut,
  Package,
  Users,
  Sliders,
  Filter,
  Calculator,
  Image as ImageIcon,
  Phone,
  Megaphone,
  Activity,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { AdminTab } from './types';
import { APP_VERSION } from '@/lib/version';

interface AdminHeaderProps {
  isSupabaseConfigured: boolean;
  isLoading: boolean;
  saveSuccessMsg: string | null;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onRefresh: () => void;
  onLogout: () => void;
  ordersCount: number;
  leadsCount: number;
  productsCount: number;
  activeFiltersCount: number;
  galleryCount: number;
  logsCount: number;
}

export default function AdminHeader({
  isSupabaseConfigured,
  isLoading,
  saveSuccessMsg,
  activeTab,
  setActiveTab,
  onRefresh,
  onLogout,
  ordersCount,
  leadsCount,
  productsCount,
  activeFiltersCount,
  galleryCount,
  logsCount,
}: AdminHeaderProps) {
  return (
    <>
      {/* Top Banner with Alert Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Панель керування сайтом & CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Управління цінами, товарами та замовленнями</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{isSupabaseConfigured ? 'Supabase Live' : 'Local Storage Sync'}</span>
          </div>

          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <span>v{APP_VERSION}</span>
          </div>

          <button
            onClick={onRefresh}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer"
            title="Оновити дані"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-xl transition cursor-pointer"
            title="Вийти з адмін-панелі"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs sm:text-sm font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Замовлення ({ordersCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'leads'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ліди в 1 клік ({leadsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Товари та розцінки ({productsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('filters')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'filters'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Фільтри каталогу ({activeFiltersCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'calculator'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Тарифи калькулятора</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'gallery'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Фотогалерея робіт ({galleryCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'contacts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Контакти & Майстер</span>
        </button>

        <button
          onClick={() => setActiveTab('promo')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'promo'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Банери та тексти</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'logs'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Журнал подій ({logsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`pb-3 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'db'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>База Supabase</span>
        </button>
      </div>
    </>
  );
}
