'use client';

import React, { useState, useRef, useMemo } from 'react';
import { 
  Eye, 
  Sun, 
  Moon, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  Check, 
  PhoneCall, 
  ShoppingCart,
  Sliders,
  Layers,
  Palette,
  Camera,
  Maximize2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { OneClickModal } from '@/components/OneClickModal';
import { ArBlindModal } from './ArBlindModal';

export type VisualizerSystem = 'day-night' | 'roller' | 'wood-blinds' | 'blackout';
export type RoomType = 'living' | 'kitchen' | 'bedroom' | 'office' | 'custom';

interface FabricOption {
  id: string;
  name: string;
  category: string;
  hex: string;
  texturePattern?: string;
  translucency: number; // 0 = fully opaque, 1 = sheer
  basePrice: number;
}

const FABRIC_COLLECTIONS: Record<VisualizerSystem, FabricOption[]> = {
  'day-night': [
    { id: 'dn-secret-black', name: 'Secret Чорний DN-208', category: 'День-Ніч', hex: '#2B2C30', translucency: 0.3, basePrice: 529 },
    { id: 'dn-akvarel-turquoise', name: 'Акварель Бірюзовий DN-1208', category: 'День-Ніч', hex: '#3B7A87', translucency: 0.4, basePrice: 529 },
    { id: 'dn-secret-white', name: 'Secret Білий DN-201', category: 'День-Ніч', hex: '#F8F9FA', translucency: 0.5, basePrice: 489 },
    { id: 'dn-cocoa', name: 'Secret Какао DN-205', category: 'День-Ніч', hex: '#8C6F5A', translucency: 0.35, basePrice: 529 },
    { id: 'dn-graphite', name: 'Akvarel Графіт DN-1215', category: 'День-Ніч', hex: '#4A4E57', translucency: 0.3, basePrice: 549 },
  ],
  'roller': [
    { id: 'len-brown', name: 'Len Коричневий L-7439', category: 'Льон', hex: '#6A4E38', translucency: 0.4, basePrice: 349 },
    { id: 'len-beige', name: 'Len Бежевий L-7430', category: 'Льон', hex: '#D7BA9D', translucency: 0.45, basePrice: 349 },
    { id: 'berlin-green', name: 'Berlin Зелений B-0842', category: 'Берлін', hex: '#4A6B53', translucency: 0.35, basePrice: 265 },
    { id: 'berlin-mocca', name: 'Berlin Мокко B-0850', category: 'Берлін', hex: '#785A46', translucency: 0.3, basePrice: 265 },
    { id: 'len-oliva', name: 'Len Олива L-7438', category: 'Льон', hex: '#7A845A', translucency: 0.4, basePrice: 349 },
    { id: 'sand-cream', name: 'Крем Сатин S-101', category: 'Сатин', hex: '#EBE5D8', translucency: 0.5, basePrice: 299 },
  ],
  'wood-blinds': [
    { id: 'alum-silver', name: 'Алюміній 25мм Срібний Металік', category: 'Алюмінієві жалюзі', hex: '#A8B0B8', translucency: 0.05, basePrice: 420 },
    { id: 'alum-white', name: 'Алюміній 25мм Білий Класичний', category: 'Алюмінієві жалюзі', hex: '#F9FAFB', translucency: 0.05, basePrice: 420 },
    { id: 'alum-graphite', name: 'Алюміній 25мм Графіт Антрацит', category: 'Алюмінієві жалюзі', hex: '#374151', translucency: 0.05, basePrice: 450 },
    { id: 'alum-gold', name: 'Алюміній 25мм Шампань Металік', category: 'Алюмінієві жалюзі', hex: '#C5A880', translucency: 0.05, basePrice: 450 },
    { id: 'alum-beige', name: 'Алюміній 25мм Бежевий Перламутр', category: 'Алюмінієві жалюзі', hex: '#E2D5C3', translucency: 0.05, basePrice: 420 },
  ],
  'blackout': [
    { id: 'bo-umbra-graphite', name: 'Umbra Blackout Графіт BO-90', category: '100% Блекаут', hex: '#212529', translucency: 0.0, basePrice: 580 },
    { id: 'bo-midnight-blue', name: 'Midnight Blackout Глибокий Синій', category: '100% Блекаут', hex: '#162238', translucency: 0.0, basePrice: 580 },
    { id: 'bo-cream-white', name: 'Termo Blackout Молочний', category: '100% Блекаут', hex: '#F4F1EA', translucency: 0.0, basePrice: 580 },
    { id: 'bo-espresso', name: 'Termo Blackout Еспресо', category: '100% Блекаут', hex: '#3B2F2F', translucency: 0.0, basePrice: 580 },
  ],
};

const ROOM_BACKGROUNDS: Record<RoomType, { name: string; url: string; windowCoords: { top: string; left: string; width: string; height: string } }> = {
  living: {
    name: 'Вітальня',
    url: '/images/visualizer/living.jpg',
    windowCoords: { top: '15.5%', left: '28.5%', width: '43%', height: '46.5%' },
  },
  kitchen: {
    name: 'Кухня',
    url: '/images/visualizer/kitchen.jpg',
    windowCoords: { top: '17.5%', left: '34.5%', width: '31%', height: '40.5%' },
  },
  bedroom: {
    name: 'Спальня',
    url: '/images/visualizer/bedroom.jpg',
    windowCoords: { top: '14.5%', left: '37%', width: '26%', height: '39%' },
  },
  office: {
    name: 'Кабінет',
    url: '/images/visualizer/office.jpg',
    windowCoords: { top: '10.5%', left: '30.5%', width: '39%', height: '56.5%' },
  },
  custom: {
    name: 'Моє фото',
    url: '',
    windowCoords: { top: '15%', left: '25%', width: '50%', height: '65%' },
  },
};

interface RoomVisualizerProps {
  initialSystem?: VisualizerSystem;
  initialColorHex?: string;
  initialFabricName?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export default function RoomVisualizer({
  initialSystem = 'day-night',
  initialColorHex,
  initialFabricName,
  onClose,
  isModal = false,
}: RoomVisualizerProps) {
  const { addItem } = useCart();

  const [system, setSystem] = useState<VisualizerSystem>(initialSystem);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('living');
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);

  // Fabric selection
  const availableFabrics = FABRIC_COLLECTIONS[system];
  const [selectedFabric, setSelectedFabric] = useState<FabricOption>(() => {
    if (initialColorHex) {
      const match = availableFabrics.find(f => f.hex.toLowerCase() === initialColorHex.toLowerCase());
      if (match) return match;
    }
    return availableFabrics[0];
  });

  // Visualizer interactive sliders
  const [openPercent, setOpenPercent] = useState<number>(75); // 0 = fully open (up), 100 = fully closed (down)
  const [dayNightShift, setDayNightShift] = useState<number>(60); // 0 = open view, 100 = full blackout overlap
  const [slatAngle, setSlatAngle] = useState<number>(30); // -90 to +90 degrees for venetian
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // Custom photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);
  const [isArModalOpen, setIsArModalOpen] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Handle custom image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setCustomRoomUrl(result);
        setSelectedRoom('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  // Active room image
  const activeRoomBg = selectedRoom === 'custom' && customRoomUrl
    ? customRoomUrl
    : ROOM_BACKGROUNDS[selectedRoom].url;

  const windowPos = ROOM_BACKGROUNDS[selectedRoom].windowCoords;

  // Add to cart handler
  const handleAddToCart = () => {
    const colorObj = {
      id: selectedFabric.id,
      name: selectedFabric.name,
      code: selectedFabric.id,
      hex: selectedFabric.hex,
      inStock: true,
    };

    addItem({
      productId: selectedFabric.id,
      slug: selectedFabric.id,
      title: `${selectedFabric.category} «${selectedFabric.name}» (Примірка)`,
      sku: selectedFabric.id,
      image: activeRoomBg,
      width: 60,
      height: 140,
      color: colorObj,
      controlSide: 'right',
      fixationType: 'with_line',
      mountingType: 'on_sash',
      unitPrice: selectedFabric.basePrice,
      quantity: 1,
    });
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3500);
  };

  return (
    <div className={`w-full bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 ${isModal ? 'max-h-[92vh] flex flex-col' : ''}`}>
      {/* Visualizer Top Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
              <span>3D Візуалізатор тканин на вікні</span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                Live Preview
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Приміряйте рулонні штори, день-ніч та жалюзі на фото вашої кімнати в реальному часі
            </p>
          </div>
        </div>

        {/* Action buttons: Day/Night Ambience Toggle & AR Camera Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsArModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 border border-white/20 transition-all active:scale-95 cursor-pointer relative overflow-hidden group"
          >
            <span className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-indigo-500 opacity-40 group-hover:opacity-80 blur-xs transition animate-pulse" />
            <Camera className="w-4 h-4 text-amber-300 relative z-10 animate-bounce" />
            <span className="relative z-10">📱 Жива камера / AR</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setIsNightMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !isNightMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>День ☀️</span>
            </button>
            <button
              onClick={() => setIsNightMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isNightMode ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Вечір 🌙</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Canvas Viewer, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
        {/* VIEWPORT CANVAS (7 COLS) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Room View Container */}
          <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group">
            {/* Background Room Photo */}
            <img
              src={activeRoomBg || ROOM_BACKGROUNDS.living.url}
              alt="Room Preview"
              className={`w-full h-full object-cover transition-all duration-700 ${
                isNightMode ? 'brightness-50 saturate-75' : 'brightness-100'
              }`}
            />

            {/* Simulated Window Frame & Blinds Overlay */}
            <div
              className="absolute transition-all duration-300 rounded-sm overflow-hidden"
              style={{
                top: windowPos.top,
                left: windowPos.left,
                width: windowPos.width,
                height: windowPos.height,
                boxShadow: isNightMode
                  ? 'inset 0 0 20px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.05)'
                  : 'inset 0 0 15px rgba(0,0,0,0.3)',
              }}
            >
              {/* Window Glass Reflection & Sky (Visible behind open blinds) */}
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isNightMode ? 'bg-slate-950/80' : 'bg-sky-200/30 backdrop-blur-[0.5px]'
                }`}
              />

              {/* BLINDS RENDERING LAYER */}
              <div 
                className="absolute top-0 left-0 right-0 overflow-hidden transition-all duration-300 ease-out origin-top"
                style={{
                  height: `${openPercent}%`,
                }}
              >
                {/* 1. ДЕНЬ-НІЧ (ZEBRA) RENDERING */}
                {system === 'day-night' && (
                  <div className="w-full h-full relative">
                    {/* Background striped pattern layer */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: selectedFabric.hex,
                        backgroundImage: `repeating-linear-gradient(
                          to bottom,
                          ${selectedFabric.hex} 0px,
                          ${selectedFabric.hex} 30px,
                          rgba(255,255,255,${0.15 + (1 - dayNightShift / 100) * 0.7}) 30px,
                          rgba(255,255,255,${0.15 + (1 - dayNightShift / 100) * 0.7}) 50px
                        )`,
                        opacity: isNightMode ? 0.95 : 0.88,
                        boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.3)',
                      }}
                    />
                    {/* Texture Grain */}
                    <div 
                      className="absolute inset-0 opacity-20 mix-blend-overlay"
                      style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '4px 4px',
                      }}
                    />
                  </div>
                )}

                {/* 2. РУЛОННІ ШТОРИ (ROLLER) RENDERING */}
                {system === 'roller' && (
                  <div
                    className="w-full h-full relative"
                    style={{
                      backgroundColor: selectedFabric.hex,
                      opacity: isNightMode ? 0.95 : 1 - selectedFabric.translucency * 0.5,
                      boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    {/* Fabric Texture Lines */}
                    <div
                      className="absolute inset-0 opacity-25 mix-blend-overlay"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.4) 6px)',
                      }}
                    />
                  </div>
                )}

                {/* 3. ГОРИЗОНТАЛЬНІ АЛЮМІНІЄВІ ЖАЛЮЗІ (ALUMINUM/VENETIAN) RENDERING */}
                {system === 'wood-blinds' && (
                  <div className="w-full h-full flex flex-col justify-between">
                    {Array.from({ length: 16 }).map((_, idx) => {
                      const tiltScale = Math.cos((slatAngle * Math.PI) / 180);
                      return (
                        <div
                          key={idx}
                          className="w-full transition-transform duration-150 origin-center"
                          style={{
                            height: '5.8%',
                            backgroundColor: selectedFabric.hex,
                            transform: `scaleY(${Math.max(0.15, Math.abs(tiltScale))})`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
                            borderRadius: '1px',
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                {/* 4. 100% БЛЕКАУТ RENDERING */}
                {system === 'blackout' && (
                  <div
                    className="w-full h-full relative"
                    style={{
                      backgroundColor: selectedFabric.hex,
                      boxShadow: 'inset 0 0 25px rgba(0,0,0,0.6), 0 5px 15px rgba(0,0,0,0.5)',
                    }}
                  >
                    {/* Matte finish */}
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                )}

                {/* Bottom Weight Bar (Нижня планка Besta) */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-slate-200 via-white to-slate-400 border-t border-slate-500 shadow-md flex items-center justify-center"
                >
                  <div className="w-10 h-0.5 bg-slate-400 rounded-full" />
                </div>
              </div>

              {/* Side Guides / Window Sill Shadow */}
              <div className="absolute inset-0 border-2 border-white/40 pointer-events-none rounded-sm shadow-inner" />
            </div>

            {/* Room Switcher Floating Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Інтер'єр:</span>
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(['living', 'kitchen', 'bedroom', 'office'] as RoomType[]).map((rKey) => (
                  <button
                    key={rKey}
                    onClick={() => setSelectedRoom(rKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedRoom === rKey
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ROOM_BACKGROUNDS[rKey].name}
                  </button>
                ))}

                {/* Upload own room */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
                    selectedRoom === 'custom'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                  }`}
                  title="Завантажити власне фото вікна"
                >
                  <Upload className="w-3 h-3" />
                  <span>Своє фото</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Quick Info Bar below Canvas */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: selectedFabric.hex }} />
              <span className="font-bold text-white">{selectedFabric.name}</span>
              <span className="text-slate-500">|</span>
              <span className="text-blue-400 font-bold">{selectedFabric.basePrice} грн/м²</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOpenPercent(75);
                  setDayNightShift(60);
                  setSlatAngle(30);
                  setIsNightMode(false);
                }}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Скинути налаштування</span>
              </button>
            </div>
          </div>
        </div>

        {/* CONTROLS PANEL (5 COLS) */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[600px] lg:max-h-none">
          <div className="space-y-5">
            {/* 1. SELECT BLINDS SYSTEM */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>1. Оберіть тип системи:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'day-night', name: 'День-Ніч', desc: 'Смуги Zebra' },
                  { id: 'roller', name: 'Рулонні штори', desc: 'Класика' },
                  { id: 'wood-blinds', name: 'Жалюзі 25мм', desc: 'Алюміній' },
                  { id: 'blackout', name: '100% Блекаут', desc: 'Темрява' },
                ].map((sys) => (
                  <button
                    key={sys.id}
                    onClick={() => {
                      const newSys = sys.id as VisualizerSystem;
                      setSystem(newSys);
                      setSelectedFabric(FABRIC_COLLECTIONS[newSys][0]);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                      system === sys.id
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{sys.name}</span>
                      {system === sys.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{sys.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. SELECT FABRIC / COLOR SWATCH */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span>2. Тканина та відтінок:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {availableFabrics.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFabric.id === fabric.id
                        ? 'bg-blue-500/15 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg border border-white/20 shadow-xs shrink-0"
                      style={{ backgroundColor: fabric.hex }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-200">{fabric.name}</p>
                      <p className="text-[10px] text-slate-500">{fabric.basePrice} грн</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. INTERACTIVE POSITION SLIDERS */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
              {/* Height Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Висота опускання:</span>
                  <span className="text-blue-400 font-bold">{openPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={openPercent}
                  onChange={(e) => setOpenPercent(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* System-specific slider */}
              {system === 'day-night' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Перекриття смуг (День / Ніч):</span>
                    <span className="text-cyan-400 font-bold">{dayNightShift}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dayNightShift}
                    onChange={(e) => setDayNightShift(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>☀️ День (світло)</span>
                    <span>🌙 Ніч (приватність)</span>
                  </div>
                </div>
              )}

              {system === 'wood-blinds' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Кут нахилу ламелей:</span>
                    <span className="text-amber-400 font-bold">{slatAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={slatAngle}
                    onChange={(e) => setSlatAngle(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Закрито вгору</span>
                    <span>Відкрито (0°)</span>
                    <span>Закрито вниз</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (ORDER & CALL MEASURER) */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            {addedToCartToast && (
              <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 p-2.5 rounded-xl text-xs text-center font-bold animate-fade-in">
                ✅ Додано в кошик! Перейдіть до оформлення замовлення.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setIsOneClickOpen(true)}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Замір з цим зразком</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                <span>В кошик ({selectedFabric.basePrice} грн)</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-500">
              ⚡ Безкоштовний виїзд майстра із каталогом зразків у Дніпрі при замовленні від 2-х вікон.
            </p>
          </div>
        </div>
      </div>

      {/* One-Click Measurement Modal */}
      {isOneClickOpen && (
        <OneClickModal
          isOpen={isOneClickOpen}
          onClose={() => setIsOneClickOpen(false)}
          product={{
            id: selectedFabric.id,
            title: `${selectedFabric.category} «${selectedFabric.name}» (Візуалізатор)`,
            sku: selectedFabric.id,
            category_slug: 'roleti',
            base_price: selectedFabric.basePrice,
            price_unit: 'грн',
            min_width: 20,
            max_width: 240,
            min_height: 30,
            max_height: 300,
            base_width: 60,
            base_height: 140,
            price_per_sqm: selectedFabric.basePrice,
            main_image: activeRoomBg,
            images: [activeRoomBg],
            in_stock: true,
            slug: selectedFabric.id,
            available_colors: [],
            rating: 5,
            reviews_count: 1,
            description: 'Конфігурація з 3D Візуалізатора тканин на вікні',
            characteristics: {},
          }}
          calculatedPrice={selectedFabric.basePrice}
          width={60}
          height={140}
          selectedColor={{
            id: selectedFabric.id,
            name: selectedFabric.name,
            code: selectedFabric.id,
            hex: selectedFabric.hex,
            inStock: true,
          }}
        />
      )}

      {/* AR Live Camera Modal */}
      <ArBlindModal
        isOpen={isArModalOpen}
        onClose={() => setIsArModalOpen(false)}
        initialColorHex={selectedFabric.hex}
        initialFabricName={selectedFabric.name}
        initialSystem={
          system === 'wood-blinds' 
            ? 'blinds' 
            : system === 'blackout' 
              ? 'blackout' 
              : system === 'day-night' 
                ? 'day-night' 
                : 'roller'
        }
      />
    </div>
  );
}
