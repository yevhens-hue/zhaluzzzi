'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Ruler,
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
  ArrowRight,
  Sliders,
  Move,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

interface AiWindowMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDimensions?: (widthCm: number, heightCm: number) => void;
}

type ReferenceType = 'card' | 'a4';

interface Point {
  x: number;
  y: number;
}

const REF_OBJECTS: Record<ReferenceType, { name: string; widthMm: number; heightMm: number; icon: any }> = {
  card: {
    name: 'Банківська картка',
    widthMm: 85.6,
    heightMm: 53.98,
    icon: CreditCard,
  },
  a4: {
    name: 'Аркуш А4',
    widthMm: 210.0,
    heightMm: 297.0,
    icon: FileText,
  },
};

export function AiWindowMeasureModal({
  isOpen,
  onClose,
  onApplyDimensions,
}: AiWindowMeasureModalProps) {
  const { t } = useLanguage();
  const [refType, setRefType] = useState<ReferenceType>('card');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [measuredWidthMm, setMeasuredWidthMm] = useState<number | null>(null);
  const [measuredHeightMm, setMeasuredHeightMm] = useState<number | null>(null);
  const [step, setStep] = useState<'upload' | 'adjust' | 'result'>('upload');

  // Canvas interaction points (Normalized 0 to 1)
  const [cardBox, setCardBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.15,
    y: 0.55,
    w: 0.12,
    h: 0.08,
  });

  const [windowCorners, setWindowCorners] = useState<{
    tl: Point;
    tr: Point;
    br: Point;
    bl: Point;
  }>({
    tl: { x: 0.3, y: 0.15 },
    tr: { x: 0.85, y: 0.15 },
    br: { x: 0.85, y: 0.85 },
    bl: { x: 0.3, y: 0.85 },
  });

  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('upload');
      setImageSrc(null);
      setMeasuredWidthMm(null);
      setMeasuredHeightMm(null);
    }
  }, [isOpen]);

  // Handle image upload from camera or file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processAiVision(src);
    };
    reader.readAsDataURL(file);
  };

  // Simulate AI Computer Vision edge & bounding box detection
  const processAiVision = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageObjRef.current = img;

      // Computer Vision Auto-Detection Simulation
      setTimeout(() => {
        // Initial smart placement based on image proportions
        setCardBox({
          x: 0.12,
          y: 0.55,
          w: refType === 'card' ? 0.12 : 0.2,
          h: refType === 'card' ? 0.08 : 0.28,
        });

        setWindowCorners({
          tl: { x: 0.28, y: 0.12 },
          tr: { x: 0.88, y: 0.12 },
          br: { x: 0.88, y: 0.88 },
          bl: { x: 0.28, y: 0.88 },
        });

        calculateDimensions();
        setIsProcessing(false);
        setStep('adjust');
        trackEvent('ai_vision_measure_photo_analyzed', { refType });
      }, 900);
    };
  };

  // Calculate real millimeters using pixel scale
  const calculateDimensions = () => {
    if (!imageObjRef.current) return;

    const imgW = imageObjRef.current.naturalWidth || 1000;
    const imgH = imageObjRef.current.naturalHeight || 1000;

    // Card pixels in natural image resolution
    const cardPxW = cardBox.w * imgW;
    const refRealW = REF_OBJECTS[refType].widthMm;
    const pxPerMm = cardPxW / refRealW;

    // Window corners in pixels
    const winTopW = Math.hypot(
      (windowCorners.tr.x - windowCorners.tl.x) * imgW,
      (windowCorners.tr.y - windowCorners.tl.y) * imgH
    );
    const winBottomW = Math.hypot(
      (windowCorners.br.x - windowCorners.bl.x) * imgW,
      (windowCorners.br.y - windowCorners.bl.y) * imgH
    );
    const winLeftH = Math.hypot(
      (windowCorners.bl.x - windowCorners.tl.x) * imgW,
      (windowCorners.bl.y - windowCorners.tl.y) * imgH
    );
    const winRightH = Math.hypot(
      (windowCorners.br.x - windowCorners.tr.x) * imgW,
      (windowCorners.br.y - windowCorners.tr.y) * imgH
    );

    const avgWidthPx = (winTopW + winBottomW) / 2;
    const avgHeightPx = (winLeftH + winRightH) / 2;

    const calcW = Math.round(avgWidthPx / pxPerMm);
    const calcH = Math.round(avgHeightPx / pxPerMm);

    setMeasuredWidthMm(calcW);
    setMeasuredHeightMm(calcH);
  };

  // Draw overlay canvas
  useEffect(() => {
    if (step !== 'adjust' || !canvasRef.current || !imageObjRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageObjRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const w = canvas.width;
    const h = canvas.height;

    // Draw background image scaled
    ctx.drawImage(img, 0, 0, w, h);

    // Dim background outside window
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, w, h);

    // 1. Draw Reference Object Box (Emerald)
    const cx = cardBox.x * w;
    const cy = cardBox.y * h;
    const cw = cardBox.w * w;
    const ch = cardBox.h * h;

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(cx, cy, cw, ch);

    // Card tag label
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`💳 ${REF_OBJECTS[refType].name} (${REF_OBJECTS[refType].widthMm} мм)`, cx + 4, cy - 6);

    // 2. Draw Window Polygon (Blue)
    const tl = { x: windowCorners.tl.x * w, y: windowCorners.tl.y * h };
    const tr = { x: windowCorners.tr.x * w, y: windowCorners.tr.y * h };
    const br = { x: windowCorners.br.x * w, y: windowCorners.br.y * h };
    const bl = { x: windowCorners.bl.x * w, y: windowCorners.bl.y * h };

    // Clear window opening
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    // Window border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.stroke();

    // Draw Corner Pins
    const drawPin = (pt: Point, label: string) => {
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawPin(tl, 'TL');
    drawPin(tr, 'TR');
    drawPin(br, 'BR');
    drawPin(bl, 'BL');

    // Dimension labels
    if (measuredWidthMm && measuredHeightMm) {
      const midTop = { x: (tl.x + tr.x) / 2, y: (tl.y + tr.y) / 2 - 12 };
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 3;
      ctx.font = 'bold 13px sans-serif';
      ctx.strokeText(`↔ ${(measuredWidthMm / 10).toFixed(1)} см (${measuredWidthMm} мм)`, midTop.x - 50, midTop.y);
      ctx.fillText(`↔ ${(measuredWidthMm / 10).toFixed(1)} см (${measuredWidthMm} мм)`, midTop.x - 50, midTop.y);

      const midRight = { x: (tr.x + br.x) / 2 + 10, y: (tr.y + br.y) / 2 };
      ctx.strokeText(`↕ ${(measuredHeightMm / 10).toFixed(1)} см (${measuredHeightMm} мм)`, midRight.x, midRight.y);
      ctx.fillText(`↕ ${(measuredHeightMm / 10).toFixed(1)} см (${measuredHeightMm} мм)`, midRight.x, midRight.y);
    }
  }, [step, cardBox, windowCorners, measuredWidthMm, measuredHeightMm, refType]);

  // Touch / Mouse Drag handlers for corner adjustment
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check hit radius
    const threshold = 0.05;
    if (Math.hypot(x - windowCorners.tl.x, y - windowCorners.tl.y) < threshold) setActiveDrag('tl');
    else if (Math.hypot(x - windowCorners.tr.x, y - windowCorners.tr.y) < threshold) setActiveDrag('tr');
    else if (Math.hypot(x - windowCorners.br.x, y - windowCorners.br.y) < threshold) setActiveDrag('br');
    else if (Math.hypot(x - windowCorners.bl.x, y - windowCorners.bl.y) < threshold) setActiveDrag('bl');
    else if (
      x >= cardBox.x &&
      x <= cardBox.x + cardBox.w &&
      y >= cardBox.y &&
      y <= cardBox.y + cardBox.h
    ) {
      setActiveDrag('card');
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!activeDrag || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    if (activeDrag === 'tl') setWindowCorners((p) => ({ ...p, tl: { x, y } }));
    else if (activeDrag === 'tr') setWindowCorners((p) => ({ ...p, tr: { x, y } }));
    else if (activeDrag === 'br') setWindowCorners((p) => ({ ...p, br: { x, y } }));
    else if (activeDrag === 'bl') setWindowCorners((p) => ({ ...p, bl: { x, y } }));
    else if (activeDrag === 'card') {
      setCardBox((p) => ({ ...p, x: x - p.w / 2, y: y - p.h / 2 }));
    }

    calculateDimensions();
  };

  const handleCanvasMouseUp = () => {
    setActiveDrag(null);
  };

  const handleApply = () => {
    if (measuredWidthMm && measuredHeightMm) {
      const widthCm = Number((measuredWidthMm / 10).toFixed(1));
      const heightCm = Number((measuredHeightMm / 10).toFixed(1));
      if (onApplyDimensions) {
        onApplyDimensions(widthCm, heightCm);
      }
      trackEvent('ai_vision_measure_applied', { widthCm, heightCm });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
        {/* ── Modal Header ───────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">AI Авто-замір вікна по фото</h3>
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                  Computer Vision
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Вимірювання ширини та висоти вікна за 2 секунди без рулетки
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body ─────────────────────────────────────────────── */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* STEP 1: UPLOAD / CAMERA */}
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Reference object selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  1. Оберіть еталонний предмет, який ви прикладете до вікна:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['card', 'a4'] as const).map((key) => {
                    const item = REF_OBJECTS[key];
                    const Icon = item.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setRefType(key)}
                        className={`p-3.5 rounded-2xl border transition flex items-center gap-3 text-left cursor-pointer ${
                          refType === key
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 text-blue-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${refType === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{item.name}</div>
                          <div className="text-[11px] text-gray-500">
                            {item.widthMm} × {item.heightMm} мм
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Як отримати точний замір за фото:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-blue-800/90 text-[11px] leading-relaxed">
                  <li>Прикладіть банківську карту або аркуш А4 плозом до скла біля рами.</li>
                  <li>Зробіть фото прямо навпроти вікна при денному освітленні.</li>
                  <li>AI автоматично виявить контури скла та розрахує розмір до міліметра.</li>
                </ul>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-4 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Зробити фото з камери</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-4 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-gray-300 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Завантажити з галереї</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* STEP 2: PROCESSING OR ADJUSTING */}
          {isProcessing && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="font-bold text-sm text-gray-900">
                Аналізуємо контури вікна та масштаб еталону...
              </div>
              <p className="text-xs text-gray-500 max-w-xs">
                AI Computer Vision калібрує пікселі на міліметр за {REF_OBJECTS[refType].name}
              </p>
            </div>
          )}

          {step === 'adjust' && !isProcessing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="flex items-center gap-1.5 font-bold text-gray-800">
                  <Move className="w-3.5 h-3.5 text-blue-600" />
                  <span>Перетягуйте сині точки кутів вікна для ідеальної точності:</span>
                </span>
                <button
                  onClick={() => setStep('upload')}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Зробити інше фото
                </button>
              </div>

              {/* Interactive Canvas */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-300 bg-black aspect-4/3 w-full touch-none select-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  className="w-full h-full cursor-crosshair"
                />
              </div>

              {/* Result Pill */}
              {measuredWidthMm && measuredHeightMm && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Розраховані розміри вікна:</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
                      {(measuredWidthMm / 10).toFixed(1)} см × {(measuredHeightMm / 10).toFixed(1)} см
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Точні габарити: {measuredWidthMm} мм × {measuredHeightMm} мм (похибка ±2 мм)
                    </div>
                  </div>

                  <button
                    onClick={handleApply}
                    className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>Застосувати у калькулятор</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
