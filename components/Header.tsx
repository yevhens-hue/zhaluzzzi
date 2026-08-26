'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { Phone, Clock, Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, Send, Sparkles, Camera } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { MegaMenu } from './MegaMenu';
import { Logo } from './Logo';
import { InstagramIcon } from './InstagramIcon';
import { TrackingModal } from './TrackingModal';
import { useLanguage } from '@/context/LanguageContext';

export function Header() {
  const router = useRouter();
  const { totalCount, totalAmount, toggleCart } = useCart();
  const { currentCity, openModal } = useCity();
  const { wishlistCount } = useWishlist();
  const { settings } = useSiteSettings();
  const { lang, setLang, t } = useLanguage();
  const contacts = settings.contacts;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = (menuKey: string) => {
    setActiveMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/80 sticky top-0 z-40 shadow-xs transition-all">
      {/* Top Banner if configured */}
      {settings.promo?.topBannerText && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-amber-300 text-[11px] font-bold py-2 px-4 text-center tracking-wide border-b border-amber-500/20">
          ✨ {settings.promo.topBannerText}
        </div>
      )}

      {/* Top Dark Utility Bar (Studio Contacts & Direct Lines) */}
      <div className="bg-slate-950 text-gray-300 text-xs hidden md:block border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          {/* Left: Studio info / navigation links */}
          <nav className="flex items-center space-x-6 font-medium text-gray-300">
            <Link href="/" className="hover:text-amber-400 transition">{t('Головна студія', 'Главная студия')}</Link>
            <Link href="/aktsii" className="hover:text-amber-400 transition">{t('Акції та знижки', 'Акции и скидки')}</Link>
            <Link href="/zamir" className="hover:text-amber-400 transition">{t('Виїзд замірника', 'Выезд замерщика')}</Link>
            <Link href="/pro_nas" className="hover:text-amber-400 transition">{t('Власне виробництво', 'Собственное производство')}</Link>
            <Link href="/zvyazok" className="hover:text-amber-400 transition">{t('Контакти майстра', 'Контакты мастера')}</Link>
          </nav>

          {/* Right: Socials, Phones, Work hours, TTN */}
          <div className="flex items-center space-x-5">
            {/* Instagram */}
            <a
              href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram студії"
              className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@zhaluzi_dnipro</span>
            </a>

            {/* Telegram / Viber */}
            <div className="flex items-center space-x-2">
              <a
                href={contacts.telegramUrl || 'https://t.me/+380939128531'}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                className="w-5 h-5 rounded-full bg-[#2CA5E0] text-white flex items-center justify-center hover:scale-110 transition"
              >
                <Send className="w-3 h-3" />
              </a>
              <a
                href={`viber://chat?number=${encodeURIComponent(contacts.viberNumber || '+380939128531')}`}
                title="Viber"
                className="w-5 h-5 rounded-full bg-[#7F4DA0] text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition"
              >
                V
              </a>
            </div>

            {/* Phones */}
            <div className="flex items-center space-x-1 text-white font-bold">
              <Phone className="w-3.5 h-3.5 text-amber-400 mr-0.5" />
              <a href={`tel:${contacts.phone1.replace(/[^0-9]/g, '')}`} className="hover:text-amber-400">{contacts.phone1}</a>
              {contacts.phone2 && (
                <>
                  <span className="text-gray-500">/</span>
                  <a href={`tel:${contacts.phone2.replace(/[^0-9]/g, '')}`} className="hover:text-amber-400">{contacts.phone2}</a>
                </>
              )}
            </div>

            {/* Working hours */}
            <div className="flex items-center space-x-1 text-gray-400">
              <Clock className="w-3.5 h-3.5 text-amber-400 mr-0.5" />
              <span>{contacts.workHours || 'Пн-Нд 9:00 - 19:00'}</span>
            </div>

            {/* Nova Poshta Tracking */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              aria-label="Відстеження Нова Пошта"
              className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>📦 ТТН</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-800 hover:text-blue-600 cursor-pointer"
          aria-label="Меню"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo & City Selector */}
        <div className="flex items-center gap-4">
          <Logo />
          <button
            onClick={openModal}
            aria-label="Вибрати місто"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100/80 border border-gray-200/80 px-3 py-1.5 rounded-full hover:bg-gray-200 transition cursor-pointer shadow-2xs"
          >
            <span>📍</span>
            <span>{currentCity === 'Місто' ? 'Дніпро' : currentCity}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
        </div>

        {/* Center Pill Navigation Categories */}
        <nav aria-label="Категорії" className="hidden lg:flex items-center gap-1 bg-gray-100/90 p-1.5 rounded-2xl border border-gray-200/60 shadow-2xs">
          <button
            onClick={() => toggleMenu('roleti')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
              activeMenu === 'roleti' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span>Ролети</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === 'roleti' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('shtori')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
              activeMenu === 'shtori' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span>Штори</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === 'shtori' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('den-nich')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
              activeMenu === 'den-nich' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span>День-Ніч</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === 'den-nich' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('zhaluzi')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
              activeMenu === 'zhaluzi' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span>Жалюзі</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === 'zhaluzi' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('zakryta')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 cursor-pointer ${
              activeMenu === 'zakryta' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-700 hover:bg-white hover:text-slate-900'
            }`}
          >
            <span>Закрита система</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMenu === 'zakryta' ? 'rotate-180' : ''}`} />
          </button>

          <Link
            href="/visualizer"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs shadow-sm hover:opacity-95 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Візуалізатор</span>
          </Link>

          <Link
            href="/zamir"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs shadow-sm hover:opacity-95 transition flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI-Замір</span>
          </Link>
        </nav>

        {/* Right Actions: Search, Wishlist, Cart */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <form onSubmit={handleSearch} className="relative hidden xl:block w-48">
            <input
              type="search"
              placeholder="Пошук моделі..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-900 placeholder:text-gray-400 font-medium focus:outline-hidden focus:bg-white focus:border-slate-900 transition"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          <Link
            href="/catalog?wishlist=true"
            aria-label="Закладки"
            className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full relative transition"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            aria-label="Адмін-панель"
            className="p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-100 rounded-full transition"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={toggleCart}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-950 text-white px-4 py-2 rounded-full font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            aria-label="Кошик"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">
              {totalAmount > 0 ? `${totalAmount.toLocaleString('uk-UA')} грн` : 'Кошик'}
            </span>
          </button>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {activeMenu && (
        <MegaMenu
          activeMenu={activeMenu}
          onClose={() => setActiveMenu(null)}
        />
      )}

      {/* Mobile drawer menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4 shadow-lg">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Пошук у каталозі..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Instagram link */}
          <a
            href="https://www.instagram.com/zhaluzi.rollety.dnipro?igsh=MWR0cXVmdzExem02ZQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Наш Instagram: @zhaluzi.rollety.dnipro</span>
          </a>

          {/* City selector */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal();
            }}
            className="w-full flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-sm text-gray-700 font-medium"
          >
            <span>📍 Ваше місто: <strong className="text-blue-600">{currentCity === 'Місто' ? 'Дніпро' : currentCity}</strong></span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Catalog links */}
          <div className="space-y-1 font-semibold text-gray-800">
            <Link
              href="/roleti"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900"
            >
              Ролети на вікна
            </Link>
            <Link
              href="/shtori"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900"
            >
              Рулонні та римські штори
            </Link>
            <Link
              href="/zhaluzi"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900"
            >
              Жалюзі (горизонтальні алюмінієві та вертикальні)
            </Link>
            <Link
              href="/zakryta-sistema"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 hover:bg-blue-50 rounded-lg text-blue-900"
            >
              Закрита система з направляючими
            </Link>
          </div>

          <hr className="border-gray-200" />

          {/* Info links */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <Link 
              href="/visualizer" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="col-span-2 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🎨 3D Примірка на вікні</span>
            </Link>
            <Link href="/zamir" onClick={() => setIsMobileMenuOpen(false)}>Виклик замірника</Link>
            <Link href="/zamir" onClick={() => setIsMobileMenuOpen(false)}>Замір вікон</Link>
            <Link href="/montaj" onClick={() => setIsMobileMenuOpen(false)}>Інструкція монтажу</Link>
            <Link href="/sposobi_oplati" onClick={() => setIsMobileMenuOpen(false)}>Оплата / Розстрочка</Link>
            <Link href="/dostavka" onClick={() => setIsMobileMenuOpen(false)}>Доставка по Україні</Link>
            <Link href="/pro_nas" onClick={() => setIsMobileMenuOpen(false)}>Про виробництво</Link>
            <Link href="/zvyazok" onClick={() => setIsMobileMenuOpen(false)}>Контакти</Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>Адмін-панель</Link>
          </div>

          {/* Phone call buttons & TTN Tracking */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsTrackingOpen(true);
              }}
              className="w-full text-center py-2.5 bg-red-50 text-red-600 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-red-200"
            >
              <span>📦 Відстежити ТТН (Нова Пошта)</span>
            </button>
            <div className="flex gap-2">
              <a
                href="tel:0939128531"
                className="flex-1 text-center py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs"
              >
                📞 (093) 912-85-31
              </a>
              <a
                href="tel:0935105521"
                className="flex-1 text-center py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs"
              >
                📞 (093) 510-55-21
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      <TrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
    </header>
  );
}
