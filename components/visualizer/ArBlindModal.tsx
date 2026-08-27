'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  X, 
  Sparkles, 
  Download, 
  ShoppingCart, 
  Smartphone,
  Share2,
  Send
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

export type ArSystemType = 'day-night' | 'roller' | 'blackout' | 'blinds';

interface FabricPreset {
  id: string;
  name: string;
  category: string;
  hex: string;
  translucency: number;
  pricePerSqm: number;
}

const AR_FABRICS: Record<ArSystemType, FabricPreset[]> = {
  'day-night': [
    { id: 'dn-white', name: 'Secret Білий DN-201', category: 'День-Ніч', hex: '#F8F9FA', translucency: 0.45, pricePerSqm: 890 },
    { id: 'dn-black', name: 'Secret Чорний DN-208', category: 'День-Ніч', hex: '#26272B', translucency: 0.25, pricePerSqm: 940 },
    { id: 'dn-cocoa', name: 'Secret Какао DN-205', category: 'День-Ніч', hex: '#8C6F5A', translucency: 0.35, pricePerSqm: 890 },
    { id: 'dn-turquoise', name: 'Акварель Бірюза DN-1208', category: 'День-Ніч', hex: '#3B7A87', translucency: 0.4, pricePerSqm: 920 },
    { id: 'dn-graphite', name: 'Akvarel Графіт DN-1215', category: 'День-Ніч', hex: '#4A4E57', translucency: 0.3, pricePerSqm: 940 },
  ],
  'roller': [
    { id: 'len-beige', name: 'Len Бежевий L-7430', category: 'Льон', hex: '#D7BA9D', translucency: 0.4, pricePerSqm: 620 },
    { id: 'len-brown', name: 'Len Коричневий L-7439', category: 'Льон', hex: '#6A4E38', translucency: 0.35, pricePerSqm: 620 },
    { id: 'berlin-green', name: 'Berlin Зелений B-0842', category: 'Берлін', hex: '#4A6B53', translucency: 0.3, pricePerSqm: 540 },
    { id: 'satin-cream', name: 'Сатин Крем S-101', category: 'Сатин', hex: '#EBE5D8', translucency: 0.45, pricePerSqm: 580 },
    { id: 'len-oliva', name: 'Len Олива L-7438', category: 'Льон', hex: '#7A845A', translucency: 0.4, pricePerSqm: 620 },
  ],
  'blackout': [
    { id: 'bo-graphite', name: 'Umbra Blackout Графіт', category: '100% Блекаут', hex: '#1E2024', translucency: 0.0, pricePerSqm: 980 },
    { id: 'bo-navy', name: 'Midnight Blackout Синій', category: '100% Блекаут', hex: '#141D2B', translucency: 0.0, pricePerSqm: 980 },
    { id: 'bo-cream', name: 'Termo Blackout Молочний', category: '100% Блекаут', hex: '#F0EDE6', translucency: 0.0, pricePerSqm: 980 },
    { id: 'bo-espresso', name: 'Termo Blackout Еспресо', category: '100% Блекаут', hex: '#3B2F2F', translucency: 0.0, pricePerSqm: 980 },
  ],
  'blinds': [
    { id: 'alum-silver', name: 'Срібний Металік 25мм', category: 'Алюміній', hex: '#B8C0C8', translucency: 0.05, pricePerSqm: 720 },
    { id: 'alum-white', name: 'Білий Класичний 25мм', category: 'Алюміній', hex: '#FAFAFA', translucency: 0.05, pricePerSqm: 680 },
    { id: 'alum-anthracite', name: 'Графіт Антрацит 25мм', category: 'Алюміній', hex: '#33383F', translucency: 0.05, pricePerSqm: 750 },
    { id: 'alum-gold', name: 'Шампань Металік 25мм', category: 'Алюміній', hex: '#CDB289', translucency: 0.05, pricePerSqm: 750 },
  ],
};

interface ArBlindModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSystem?: ArSystemType;
  initialColorHex?: string;
  initialFabricName?: string;
  initialWidth?: number;
  initialHeight?: number;
}

export function ArBlindModal({
  isOpen,
  onClose,
  initialSystem = 'day-night',
  initialColorHex,
  initialFabricName,
  initialWidth = 65,
  initialHeight = 140,
}: ArBlindModalProps) {
  const { addItem, openCart } = useCart();

  // AR Settings & State
  const [system, setSystem] = useState<ArSystemType>(initialSystem);
  const [selectedFabric, setSelectedFabric] = useState<FabricPreset>(() => {
    const list = AR_FABRICS[initialSystem] || AR_FABRICS['day-night'];
    if (initialColorHex) {
      const match = list.find((f) => f.hex.toLowerCase() === initialColorHex.toLowerCase());
      if (match) return match;
    }
    return list[0];
  });

  const [width, setWidth] = useState<number>(initialWidth);
  const [height, setHeight] = useState<number>(initialHeight);
  const [openPercent, setOpenPercent] = useState<number>(75); // 0 = closed, 100 = fully rolled up
  const [isDayNightShifted, setIsDayNightShifted] = useState<boolean>(false);
  const [lighting, setLighting] = useState<'day' | 'evening' | 'night'>('day');

  // Interactive Position & Scale on Screen
  const [blindPosition, setBlindPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [blindScale, setBlindScale] = useState<number>(1);
  const [isDraggingChain, setIsDraggingChain] = useState<boolean>(false);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [initialOpenOnDrag, setInitialOpenOnDrag] = useState<number>(75);

  // Camera stream state
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Native AR detection
  const [isAppleArSupported, setIsAppleArSupported] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Check Apple QuickLook support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsAppleArSupported(isIOS);
    }
  }, []);

  // Update fabrics when system changes
  const handleSystemChange = (newSystem: ArSystemType) => {
    setSystem(newSystem);
    const list = AR_FABRICS[newSystem];
    setSelectedFabric(list[0]);
  };

  // Start Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraError('Камера не підтримується цим браузером. Використовується симуляція.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCamera(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Доступ до камери не надано або вона використовується іншою програмою.');
      setHasCamera(false);
    }
  }, []);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setHasCamera(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  // Calculate dynamic price
  const area = Math.max(0.4, (width * height) / 10000);
  const calculatedPrice = Math.round(selectedFabric.pricePerSqm * area + 60);

  // Chain Dragging Logic
  const handleChainTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingChain(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setInitialOpenOnDrag(openPercent);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(15); } catch {}
    }
  };

  const handleChainMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingChain) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    // Drag down = pull blind down (lower openPercent), drag up = pull blind up
    const newPercent = Math.min(100, Math.max(5, initialOpenOnDrag - Math.round(deltaY / 2.5)));
    setOpenPercent(newPercent);
  };

  const handleChainEnd = () => {
    setIsDraggingChain(false);
  };

  // Snapshot Capture with Realistic 3D Blind Rendering
  const handleCaptureSnapshot = async () => {
    if (!containerRef.current) return;
    setIsCapturing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cWidth = containerRef.current.clientWidth;
      const cHeight = containerRef.current.clientHeight;
      canvas.width = cWidth * 2;
      canvas.height = cHeight * 2;
      ctx.scale(2, 2);

      // 1. Draw background from live camera or ambient room
      if (videoRef.current && hasCamera) {
        ctx.drawImage(videoRef.current, 0, 0, cWidth, cHeight);
      } else {
        const grad = ctx.createLinearGradient(0, 0, cWidth, cHeight);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cWidth, cHeight);
      }

      // 2. Calculate blind dimensions and center on snapshot
      const blindW = Math.min(360, Math.max(200, width * 3.8)) * blindScale;
      const blindX = (cWidth - blindW) / 2 + blindPosition.x;
      const blindY = (cHeight - 340) / 2 + blindPosition.y;
      const fabricH = Math.max(30, (height * 2.8) * (openPercent / 100)) * blindScale;

      // 3. Draw Top Cassette
      const cassetteH = 28;
      const cassGrad = ctx.createLinearGradient(blindX, blindY, blindX, blindY + cassetteH);
      cassGrad.addColorStop(0, '#f1f5f9');
      cassGrad.addColorStop(0.5, '#cbd5e1');
      cassGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = cassGrad;
      ctx.beginPath();
      ctx.roundRect(blindX, blindY, blindW, cassetteH, [8, 8, 0, 0]);
      ctx.fill();

      // Top Cassette glare & brand text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(blindX + 2, blindY + 2, blindW - 4, 3);
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UNI-BEST SYSTEM', blindX + blindW / 2, blindY + 18);

      // 4. Draw Fabric Body
      const fabricY = blindY + cassetteH;
      ctx.fillStyle = selectedFabric.hex;
      ctx.fillRect(blindX, fabricY, blindW, fabricH);

      // System patterns
      if (system === 'day-night') {
        const stripeH = 14;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let y = fabricY; y < fabricY + fabricH; y += stripeH * 2) {
          ctx.fillRect(blindX, y, blindW, Math.min(stripeH, fabricY + fabricH - y));
        }
      } else if (system === 'blinds') {
        const slatH = 16;
        for (let y = fabricY; y < fabricY + fabricH; y += slatH) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.fillRect(blindX, y, blindW, 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(blindX, y + 2, blindW, 2);
        }
      }

      // Vertical shadow gradient on sides
      const sideShadow = ctx.createLinearGradient(blindX, fabricY, blindX + blindW, fabricY);
      sideShadow.addColorStop(0, 'rgba(0,0,0,0.2)');
      sideShadow.addColorStop(0.1, 'rgba(0,0,0,0)');
      sideShadow.addColorStop(0.9, 'rgba(0,0,0,0)');
      sideShadow.addColorStop(1, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = sideShadow;
      ctx.fillRect(blindX, fabricY, blindW, fabricH);

      // 5. Draw Bottom Weight Bar
      const bottomBarH = 14;
      const btmY = fabricY + fabricH;
      const btmGrad = ctx.createLinearGradient(blindX, btmY, blindX, btmY + bottomBarH);
      btmGrad.addColorStop(0, '#e2e8f0');
      btmGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = btmGrad;
      ctx.beginPath();
      ctx.roundRect(blindX, btmY, blindW, bottomBarH, [0, 0, 6, 6]);
      ctx.fill();

      // 6. Draw Control Chain on Right
      const chainX = blindX + blindW + 8;
      for (let cy = blindY + 10; cy < btmY + 20; cy += 10) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(chainX, cy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Draw Watermark & Specs Badge at Bottom
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(16, cHeight - 74, cWidth - 32, 58, 16);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`📐 Примірка: ${selectedFabric.name} (${width}×${height} см)`, 30, cHeight - 46);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`💰 Вартість: ${calculatedPrice} грн • zhaluzi-dnipro.dp.ua • (093) 912-85-31`, 30, cHeight - 26);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);
      toast.success('📸 Фото примірки збережено!');
    } catch (err) {
      console.error(err);
      toast.error('Не вдалося створити знімок');
    } finally {
      setIsCapturing(false);
    }
  };

  // Native Share / Save Action
  const handleShareSnapshot = async () => {
    if (!capturedImage) return;

    try {
      // Check Web Share API with files
      if (navigator.share) {
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        const file = new File([blob], `zhaluzi-ar-${width}x${height}.jpg`, { type: 'image/jpeg' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Примірка ролети ${selectedFabric.name}`,
            text: `Приміряв ролету ${selectedFabric.name} (${width}×${height} см) за ${calculatedPrice} грн у Жалюзі Дніпро!`,
            files: [file],
          });
          return;
        }
      }

      // Fallback: Trigger download
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `zhaluzi-ar-${width}x${height}.jpg`;
      link.click();
      toast.success('Фото завантажено у галерею/завантаження!');
    } catch (err) {
      console.warn('Share error:', err);
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `zhaluzi-ar-${width}x${height}.jpg`;
      link.click();
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: `ar-${selectedFabric.id}`,
      slug: system === 'day-night' ? 'rolety_den_nich_akvarel_biryuzovyj_13_koloriv_vsi_rozmiry' : 'rulonni_shtory_berlin_zelenyj_23_kolory',
      title: `${selectedFabric.category} ${selectedFabric.name}`,
      sku: `AR-${selectedFabric.id.toUpperCase()}`,
      image: '/images/visualizer/living.jpg',
      width,
      height,
      color: {
        id: selectedFabric.id,
        name: selectedFabric.name,
        code: selectedFabric.id.toUpperCase(),
        hex: selectedFabric.hex,
        image: '/images/visualizer/living.jpg',
      },
      controlSide: 'right',
      fixationType: 'with_line',
      unitPrice: calculatedPrice,
      quantity: 1,
    });

    toast.success('Товар додано до кошика з AR-примірки! 🛍️', {
      description: `${selectedFabric.name} (${width}×${height} см) — ${calculatedPrice} грн`,
      action: {
        label: 'В кошик',
        onClick: () => {
          onClose();
          openCart();
        },
      },
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col font-sans select-none overflow-hidden touch-none"
      onMouseMove={handleChainMove}
      onMouseUp={handleChainEnd}
      onTouchMove={handleChainMove}
      onTouchEnd={handleChainEnd}
    >
      {/* ── Top Floating Header ────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-30 p-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-blue-400/40">
            <Camera className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-white tracking-tight">AR-Примірка на вікні</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded-full font-bold">
                1:1 Scale
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {selectedFabric.name} • <span className="text-amber-400 font-bold">{calculatedPrice} грн</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Apple AR QuickLook button */}
          {isAppleArSupported && (
            <a
              rel="ar"
              href="/models/roller_blind.usdz"
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md"
              title="Відкрити Apple ARKit Quick Look"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-300" />
              <span>Apple AR</span>
            </a>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
            aria-label="Закрити AR-примірку"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── AR Viewport Area (Camera Feed + 3D Blind Overlay) ─────────── */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-slate-950"
      >
        {/* Video feed from camera */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hasCamera ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback ambient room background when camera is disabled / simulated */}
        {!hasCamera && (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-full max-w-md h-72 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-xs">
              <Camera className="w-10 h-10 text-slate-400 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-white mb-1">
                {cameraError || 'Камера підключається...'}
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mb-3">
                Наведіть камеру смартфона на віконний отвір для примірки в реальному масштабі
              </p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
              >
                Увімкнути камеру
              </button>
            </div>
          </div>
        )}

        {/* Ambient Room Lighting Shader (Simulates Blackout room darkening) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            backgroundColor: lighting === 'night' 
              ? 'rgba(5, 10, 25, 0.65)' 
              : lighting === 'evening' 
                ? 'rgba(30, 20, 15, 0.4)' 
                : 'transparent',
            opacity: system === 'blackout' ? 1 - (openPercent / 100) * 0.4 : 1
          }}
        />

        {/* ── Realistic Interactive 3D Blind Overlay ───────────────────── */}
        <div
          className="relative z-20 flex flex-col items-center cursor-move transition-transform duration-75"
          style={{
            width: `${Math.min(360, Math.max(200, width * 3.8))}px`,
            transform: `translate(${blindPosition.x}px, ${blindPosition.y}px) scale(${blindScale})`,
          }}
        >
          {/* Cassette / Top Roll Bar */}
          <div className="w-full h-8 bg-gradient-to-b from-gray-100 via-white to-gray-300 rounded-t-xl shadow-2xl border border-gray-400/50 flex items-center justify-between px-3 relative z-30">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-gray-300" />
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 opacity-60">
              Uni-Best System
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 border border-gray-300" />
            
            {/* Top Metallic Glare */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/80 rounded-t-xl" />
          </div>

          {/* Main Fabric Curtain Container */}
          <div 
            className="w-full relative overflow-hidden transition-all duration-150 shadow-2xl border-x border-black/10"
            style={{
              height: `${Math.max(30, (height * 2.8) * (openPercent / 100))}px`,
              maxHeight: '480px',
              backgroundColor: selectedFabric.hex,
            }}
          >
            {/* 1. Day-Night System: Double Slotted Pattern */}
            {system === 'day-night' && (
              <div 
                className="absolute inset-0 w-full h-full opacity-90 transition-transform duration-200"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    transparent 0px,
                    transparent 14px,
                    rgba(255, 255, 255, 0.7) 14px,
                    rgba(255, 255, 255, 0.7) 28px
                  )`,
                  backgroundSize: '100% 28px',
                  backgroundPosition: isDayNightShifted ? '0 14px' : '0 0',
                }}
              />
            )}

            {/* 2. Blackout System: Velvet Weave / Matte Texture */}
            {system === 'blackout' && (
              <div className="absolute inset-0 bg-radial from-white/10 to-black/30 pointer-events-none" />
            )}

            {/* 3. Roller System: Subtle Fabric Weave */}
            {system === 'roller' && (
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                  backgroundSize: '4px 4px',
                }}
              />
            )}

            {/* 4. Aluminum Blinds: Horizontal Slats */}
            {system === 'blinds' && (
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    rgba(0,0,0,0.15) 0px,
                    rgba(0,0,0,0.15) 2px,
                    transparent 2px,
                    transparent 16px,
                    rgba(255,255,255,0.2) 16px,
                    rgba(255,255,255,0.2) 18px
                  )`,
                }}
              />
            )}

            {/* Fabric Vertical Fold Shadows */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Bottom Weight Bar (Нижня планка) */}
          <div 
            className="w-full h-4 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-400 rounded-b-md shadow-lg border-t border-gray-400 flex items-center justify-center relative z-20"
          >
            <div className="w-12 h-1 bg-gray-400/40 rounded-full" />
          </div>

          {/* ── Interactive Draggable Control Chain (Ланцюжок управління) ── */}
          <div 
            className="absolute -right-6 top-6 flex flex-col items-center cursor-ns-resize group z-40 touch-none"
            onMouseDown={handleChainTouchStart}
            onTouchStart={handleChainTouchStart}
            title="Потягніть за ланцюжок щоб підняти або опустити ролету"
          >
            {/* Chain Beads */}
            <div className="w-3 flex flex-col items-center gap-1.5 py-1 px-0.5 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/20 shadow-lg group-hover:scale-110 group-active:scale-125 transition-transform">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 shadow-xs animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600" />
            </div>

            {/* Tooltip hint */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap opacity-80 group-hover:opacity-100 pointer-events-none border border-white/10">
              ↕️ Тягніть ланцюжок ({openPercent}%)
            </div>
          </div>
        </div>

        {/* Live Size & Price Floating Badge */}
        <div className="absolute top-16 left-3 z-30 bg-slate-900/80 backdrop-blur-md border border-white/15 px-3 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Розміри вікна</div>
            <div className="text-xs font-bold text-amber-300">{width} × {height} см</div>
          </div>
          <div className="h-6 w-px bg-white/20" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Вартість</div>
            <div className="text-xs font-extrabold text-emerald-400">{calculatedPrice} грн</div>
          </div>
        </div>

        {/* Snapshot preview modal overlay */}
        {capturedImage && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <div className="relative max-w-sm w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl space-y-0">
              <div className="relative aspect-4/3 bg-black">
                <img src={capturedImage} alt="Знімок примірки" className="w-full h-full object-contain" />
                <button
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>📸 Фото примірки збережено</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedFabric.name} • {width}×{height} см • <b className="text-amber-400">{calculatedPrice} грн</b>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareSnapshot}
                    className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Поділитися / Зберегти</span>
                  </button>

                  <a
                    href={capturedImage}
                    download={`zhaluzi-ar-${width}x${height}.jpg`}
                    className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-white/10 transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Завантажити файл</span>
                  </a>
                </div>

                {/* Direct Send to Master */}
                <a
                  href={`https://t.me/+380939128531?text=${encodeURIComponent(
                    `Привіт! Я зробив AR-примірку ролети:\n📦 ${selectedFabric.name}\n📐 Розмір: ${width}×${height} см\n💰 Ціна: ${calculatedPrice} грн`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#2CA5E0] hover:bg-[#2392c7] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Відправити майстру у Telegram</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Controls Toolbar ────────────────────────────────────── */}
      <footer className="relative z-30 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
        {/* System & Mode Tabs */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1">
          {(
            [
              { id: 'day-night', label: '🌓 День-Ніч' },
              { id: 'blackout', label: '🌑 Блекаут 100%' },
              { id: 'roller', label: '🪟 Рулонні' },
              { id: 'blinds', label: '📐 Жалюзі' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => handleSystemChange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                system === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Fabric Color Swatches */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {AR_FABRICS[system].map((fabric) => (
            <button
              key={fabric.id}
              onClick={() => setSelectedFabric(fabric)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition active:scale-95 whitespace-nowrap ${
                selectedFabric.id === fabric.id
                  ? 'bg-white/20 text-white border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800'
              }`}
            >
              <span 
                className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                style={{ backgroundColor: fabric.hex }}
              />
              <span>{fabric.name}</span>
            </button>
          ))}
        </div>

        {/* Width / Height / Lighting Quick Steppers */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Width Control */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold">Ширина:</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setWidth((w) => Math.max(30, w - 5))}
                className="w-5 h-5 rounded-md bg-white/10 text-white font-bold text-xs flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <span className="text-xs font-bold text-white">{width}</span>
              <button 
                onClick={() => setWidth((w) => Math.min(220, w + 5))}
                className="w-5 h-5 rounded-md bg-white/10 text-white font-bold text-xs flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Height Control */}
          <div className="bg-slate-900/80 border border-white/10 rounded-xl p-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold">Висота:</span>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setHeight((h) => Math.max(50, h - 10))}
                className="w-5 h-5 rounded-md bg-white/10 text-white font-bold text-xs flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <span className="text-xs font-bold text-white">{height}</span>
              <button 
                onClick={() => setHeight((h) => Math.min(260, h + 10))}
                className="w-5 h-5 rounded-md bg-white/10 text-white font-bold text-xs flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Day/Night Shift or Lighting Toggle */}
          <button
            onClick={() => {
              if (system === 'day-night') {
                setIsDayNightShifted(!isDayNightShifted);
              } else {
                setLighting((l) => (l === 'day' ? 'evening' : l === 'evening' ? 'night' : 'day'));
              }
            }}
            className="bg-slate-900/80 border border-white/10 hover:bg-slate-800 rounded-xl p-2 flex items-center justify-center gap-1 text-xs font-bold text-amber-300 active:scale-95 transition"
          >
            {system === 'day-night' ? (
              <span>🔄 Зсув смуг</span>
            ) : (
              <span>{lighting === 'day' ? '☀️ День' : lighting === 'evening' ? '🌆 Вечір' : '🌙 Ніч'}</span>
            )}
          </button>
        </div>

        {/* Action Buttons: Snapshot & Add to Cart */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="py-3 px-3 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-white/15 transition active:scale-95 shadow-md"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Сфотографувати</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="py-3 px-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Замовити ({calculatedPrice} грн)</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
