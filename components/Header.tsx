'use client';

import React, { useState } from 'react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { Phone, Clock, Search, Heart, User, ShoppingBag, Menu, X, ChevronDown, Send, Sparkles } from 'lucide-react';
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
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs transition-colors">
      {/* Top Banner if configured */}
      {settings.promo?.topBannerText && (
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide">
          {settings.promo.topBannerText}
        </div>
      )}

      {/* Top Bar (Info, Contacts, Instagram, Working hours) */}
      <div className="bg-[#f8f9fa] border-b border-gray-200/70 text-xs text-gray-600 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          {/* Main info links */}
          <nav className="flex items-center space-x-6 font-medium text-gray-700">
            <Link href="/" className="hover:text-blue-600 transition">{t('Головна', 'Главная')}</Link>
            <Link href="/aktsii" className="hover:text-blue-600 transition">{t('Акції', 'Акции')}</Link>
            <Link href="/zamir" className="hover:text-blue-600 transition">{t('Замір', 'Замер')}</Link>
            <Link href="/pro_nas" className="hover:text-blue-600 transition">{t('Про нас', 'О нас')}</Link>
            <Link href="/zvyazok" className="hover:text-blue-600 transition">{t('Контакти', 'Контакты')}</Link>
          </nav>

          {/* Right side: Instagram, phones, work hours */}
          <div className="flex items-center space-x-5">
            {/* Instagram link */}
            <a
              href={contacts.instagramUrl || 'https://www.instagram.com/zhaluzi.rollety.dnipro'}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              aria-label="Instagram профіль Жалюзі та Ролети Дніпро"
              className="flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-semibold transition"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>

            {/* Telegram / Viber */}
            <div className="flex items-center space-x-2">
              <a
                href={contacts.telegramUrl || 'https://t.me/+380939128531'}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                aria-label="Написати майстру у Telegram"
                className="text-[#2CA5E0] hover:opacity-80 transition"
              >
                <div className="w-5 h-5 rounded-full bg-[#2CA5E0] text-white flex items-center justify-center">
                  <Send className="w-3 h-3" />
                </div>
              </a>
              <a
                href={`viber://chat?number=${encodeURIComponent(contacts.viberNumber || '+380939128531')}`}
                title="Viber"
                aria-label="Написати майстру у Viber"
                className="w-5 h-5 rounded-full bg-[#7F4DA0] text-white flex items-center justify-center text-[10px] font-bold"
              >
                V
              </a>
            </div>

            {/* Phones: Master */}
            <div className="flex items-center space-x-1 text-gray-800 font-bold">
              <Phone className="w-3.5 h-3.5 text-blue-600 mr-0.5" />
              <a href={`tel:${contacts.phone1.replace(/[^0-9]/g, '')}`} aria-label={`Зателефонувати ${contacts.phone1}`} className="hover:text-blue-600">{contacts.phone1}</a>
              {contacts.phone2 && (
                <>
                  <span className="text-gray-300">/</span>
                  <a href={`tel:${contacts.phone2.replace(/[^0-9]/g, '')}`} aria-label={`Зателефонувати ${contacts.phone2}`} className="hover:text-blue-600">{contacts.phone2}</a>
                </>
              )}
            </div>

            {/* Working hours */}
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-3.5 h-3.5 text-amber-500 mr-0.5" />
              <span>{contacts.workHours || '9:00 - 19:00'}</span>
            </div>

            {/* Nova Poshta Tracking Button */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              aria-label="Відстеження посилки за номером ТТН Нова Пошта"
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <span>📦 ТТН</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-blue-600 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label={isMobileMenuOpen ? "Закрити меню сайту" : "Відкрити навігаційне меню"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Custom Brand Logo */}
        <Logo />

        {/* Desktop Navigation Category Tabs */}
        <nav aria-label="Головні категорії товарів" className="hidden lg:flex items-center space-x-2 text-sm font-semibold">
          <button
            onClick={() => toggleMenu('roleti')}
            aria-expanded={activeMenu === 'roleti'}
            aria-haspopup="true"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeMenu === 'roleti'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`}
          >
            <span>{t('Ролети', 'Роллеты')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'roleti' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('shtori')}
            aria-expanded={activeMenu === 'shtori'}
            aria-haspopup="true"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeMenu === 'shtori'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`}
          >
            <span>{t('Рулонні штори', 'Рулонные шторы')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'shtori' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('den-nich')}
            aria-expanded={activeMenu === 'den-nich'}
            aria-haspopup="true"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeMenu === 'den-nich'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`}
          >
            <span>{t('День-Ніч', 'День-Ночь')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'den-nich' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('zhaluzi')}
            aria-expanded={activeMenu === 'zhaluzi'}
            aria-haspopup="true"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeMenu === 'zhaluzi'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`}
          >
            <span>{t('Жалюзі', 'Жалюзи')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'zhaluzi' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleMenu('zakryta')}
            aria-expanded={activeMenu === 'zakryta'}
            aria-haspopup="true"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeMenu === 'zakryta'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
            }`}
          >
            <span>{t('Закрита система', 'Закрытая система')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${activeMenu === 'zakryta' ? 'rotate-180' : ''}`} />
          </button>

          {/* 3D Visualizer Nav Item */}
          <Link
            href="/visualizer"
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-xs hover:shadow-md transition flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>3D Примірка</span>
          </Link>
        </nav>

        {/* City Selector */}
        <button
          onClick={openModal}
          aria-label="Вибрати місто для доставки або виклику замірника"
          className="hidden xl:flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <span className="text-gray-400">📍</span>
          <span>{currentCity === 'Місто' ? 'Дніпро' : currentCity}</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} role="search" className="flex-1 max-w-xs relative hidden md:block">
          <input
            type="search"
            name="q"
            aria-label="Пошук у каталозі жалюзі та ролет"
            placeholder="Пошук у каталозі..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full text-xs text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>

        {/* Action icons (Wishlist, Admin/Cabinet, Cart) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Wishlist */}
          <Link
            href="/catalog?wishlist=true"
            aria-label={`Обрані товари (${wishlistCount})`}
            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full relative transition focus-visible:ring-2 focus-visible:ring-red-500"
            title="Закладки"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Admin / Cabinet */}
          <Link
            href="/admin"
            aria-label="Кабінет адміністратора та керування магазином"
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Кабінет / Замовлення"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3.5 py-2 rounded-full font-medium text-xs shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label={`Кошик покупок, ${totalCount} товарів на суму ${totalAmount} грн`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-semibold">
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
