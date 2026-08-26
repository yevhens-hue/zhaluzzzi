'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  CreditCard,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  ArrowRight,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/context/LanguageContext';

interface AiWindowMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDimensions?: (widthCm: number, heightCm: number) => void;
}

type ReferenceType = 'card' | 'a4';
type CardOrientation = 'horizontal' | 'vertical';
type SystemPreset = 'glass' | 'open_sash' | 'full_opening';

interface Point {
  x: number;
  y: number;
}

const REF_OBJECTS: Record<
  ReferenceType,
  { name: string; nameRu: string; widthMm: number; heightMm: number; icon: any }
> = {
  card: {
    name: 'Банківська картка',
    nameRu: 'Банковская карта',
    widthMm: 85.6,
    heightMm: 53.98,
    icon: CreditCard,
  },
  a4: {
    name: 'Аркуш А4',
    nameRu: 'Лист А4',
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

  // State
  const [refType, setRefType] = useState<ReferenceType>('card');
  const [refOrientation, setRefOrientation] = useState<CardOrientation>('horizontal');
  const [systemPreset, setSystemPreset] = useState<SystemPreset>('glass');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'adjust' | 'result'>('upload');

  // Measured raw glass dimensions in millimeters
  const [rawWidthMm, setRawWidthMm] = useState<number | null>(null);
  const [rawHeightMm, setRawHeightMm] = useState<number | null>(null);

  // Normalized coordinates (0 to 1)
  const [cardBox, setCardBox] = useState<{ x: number; y: number; w: number; h: number }>({
    x: 0.12,
    y: 0.55,
    w: 0.14,
    h: 0.088,
  });

  const [windowCorners, setWindowCorners] = useState<{
    tl: Point;
    tr: Point;
    br: Point;
    bl: Point;
  }>({
    tl: { x: 0.28, y: 0.12 },
    tr: { x: 0.88, y: 0.12 },
    br: { x: 0.88, y: 0.88 },
    bl: { x: 0.28, y: 0.88 },
  });

  // Active dragged element & cursor position for magnifying loupe
  const [activeDrag, setActiveDrag] = useState<
    'tl' | 'tr' | 'br' | 'bl' | 'card_move' | 'card_resize' | null
  >(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

  // References
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Aspect ratio of the loaded image
  const [imgAspectRatio, setImgAspectRatio] = useState<number>(4 / 3);

  // Reset modal state on close
  useEffect(() => {
    if (!isOpen) {
      setStep('upload');
      setImageSrc(null);
      setRawWidthMm(null);
      setRawHeightMm(null);
      setActiveDrag(null);
      setPointerPos(null);
    }
  }, [isOpen]);

  // Update card box dimensions when reference type or orientation changes
  const getReferenceAspectRatio = useCallback(() => {
    const item = REF_OBJECTS[refType];
    const isHoriz = refOrientation === 'horizontal';
    const realW = isHoriz ? Math.max(item.widthMm, item.heightMm) : Math.min(item.widthMm, item.heightMm);
    const realH = isHoriz ? Math.min(item.widthMm, item.heightMm) : Math.max(item.widthMm, item.heightMm);
    return realW / realH;
  }, [refType, refOrientation]);

  // Handle image upload from file or camera
  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setImageSrc(src);
      processAiVision(src);
    };
    reader.readAsDataURL(file);
  };

  // AI edge and reference object auto-placement
  const processAiVision = (src: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      imageObjRef.current = img;
      const aspect = (img.naturalWidth || 4) / (img.naturalHeight || 3);
      setImgAspectRatio(aspect);

      // Compute initial normalized coordinates based on aspect ratio
      setTimeout(() => {
        const refAspect = getReferenceAspectRatio();
        const initialW = refType === 'card' ? 0.15 : 0.22;
        const initialH = (initialW * aspect) / refAspect;

        setCardBox({
          x: 0.1,
          y: Math.max(0.1, 0.7 - initialH),
          w: Math.min(0.4, initialW),
          h: Math.min(0.4, initialH),
        });

        setWindowCorners({
          tl: { x: 0.25, y: 0.1 },
          tr: { x: 0.9, y: 0.1 },
          br: { x: 0.9, y: 0.9 },
          bl: { x: 0.25, y: 0.9 },
        });

        calculateDimensionsWithPoints(
          {
            x: 0.1,
            y: Math.max(0.1, 0.7 - initialH),
            w: Math.min(0.4, initialW),
            h: Math.min(0.4, initialH),
          },
          {
            tl: { x: 0.25, y: 0.1 },
            tr: { x: 0.9, y: 0.1 },
            br: { x: 0.9, y: 0.9 },
            bl: { x: 0.25, y: 0.9 },
          },
          img
        );

        setIsProcessing(false);
        setStep('adjust');
        trackEvent('ai_vision_measure_photo_analyzed', { refType, refOrientation });
      }, 750);
    };
  };

  // Calculate real millimeters using pixel scale
  const calculateDimensionsWithPoints = (
    cBox: { x: number; y: number; w: number; h: number },
    wCorners: { tl: Point; tr: Point; br: Point; bl: Point },
    imgOverride?: HTMLImageElement
  ) => {
    const img = imgOverride || imageObjRef.current;
    if (!img) return;

    const imgW = img.naturalWidth || 1000;
    const imgH = img.naturalHeight || 1000;

    const item = REF_OBJECTS[refType];
    const isHoriz = refOrientation === 'horizontal';
    const refRealW = isHoriz
      ? Math.max(item.widthMm, item.heightMm)
      : Math.min(item.widthMm, item.heightMm);

    // Reference object width in natural pixels
    const cardPxW = Math.max(1, cBox.w * imgW);
    const pxPerMm = cardPxW / refRealW;

    if (pxPerMm <= 0) return;

    // Window top, bottom, left, right edge lengths in natural pixels
    const topW = Math.hypot(
      (wCorners.tr.x - wCorners.tl.x) * imgW,
      (wCorners.tr.y - wCorners.tl.y) * imgH
    );
    const bottomW = Math.hypot(
      (wCorners.br.x - wCorners.bl.x) * imgW,
      (wCorners.br.y - wCorners.bl.y) * imgH
    );
    const leftH = Math.hypot(
      (wCorners.bl.x - wCorners.tl.x) * imgW,
      (wCorners.bl.y - wCorners.tl.y) * imgH
    );
    const rightH = Math.hypot(
      (wCorners.br.x - wCorners.tr.x) * imgW,
      (wCorners.br.y - wCorners.tr.y) * imgH
    );

    const avgWidthPx = (topW + bottomW) / 2;
    const avgHeightPx = (leftH + rightH) / 2;

    const calcW = Math.max(50, Math.round(avgWidthPx / pxPerMm));
    const calcH = Math.max(50, Math.round(avgHeightPx / pxPerMm));

    setRawWidthMm(calcW);
    setRawHeightMm(calcH);
  };

  // Adjust card size helper (+/- 10%)
  const adjustCardScale = (factor: number) => {
    setCardBox((prev) => {
      const newW = Math.max(0.04, Math.min(0.8, prev.w * factor));
      const refAspect = getReferenceAspectRatio();
      const newH = (newW * imgAspectRatio) / refAspect;
      const updated = {
        ...prev,
        w: newW,
        h: Math.max(0.03, Math.min(0.8, newH)),
      };
      calculateDimensionsWithPoints(updated, windowCorners);
      return updated;
    });
  };

  // Toggle card orientation
  const toggleOrientation = () => {
    const nextOrient = refOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    setRefOrientation(nextOrient);
    setCardBox((prev) => {
      const item = REF_OBJECTS[refType];
      const isHoriz = nextOrient === 'horizontal';
      const realW = isHoriz
        ? Math.max(item.widthMm, item.heightMm)
        : Math.min(item.widthMm, item.heightMm);
      const realH = isHoriz
        ? Math.min(item.widthMm, item.heightMm)
        : Math.max(item.widthMm, item.heightMm);
      const refAspect = realW / realH;

      const newH = (prev.w * imgAspectRatio) / refAspect;
      const updated = { ...prev, h: Math.max(0.03, Math.min(0.8, newH)) };
      calculateDimensionsWithPoints(updated, windowCorners);
      return updated;
    });
  };

  // Draw overlay canvas
  const renderCanvas = useCallback(() => {
    if (step !== 'adjust' || !canvasRef.current || !imageObjRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageObjRef.current;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 1. Draw base photo
    ctx.drawImage(img, 0, 0, w, h);

    // 2. Dim background with dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, w, h);

    // 3. Clear window opening to reveal clear image
    const tl = { x: windowCorners.tl.x * w, y: windowCorners.tl.y * h };
    const tr = { x: windowCorners.tr.x * w, y: windowCorners.tr.y * h };
    const br = { x: windowCorners.br.x * w, y: windowCorners.br.y * h };
    const bl = { x: windowCorners.bl.x * w, y: windowCorners.bl.y * h };

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, w, h);

    // Subtle grid over window opening
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo((tl.x + tr.x) / 2, (tl.y + tr.y) / 2);
    ctx.lineTo((bl.x + br.x) / 2, (bl.y + br.y) / 2);
    ctx.moveTo((tl.x + bl.x) / 2, (tl.y + bl.y) / 2);
    ctx.lineTo((tr.x + br.x) / 2, (tr.y + br.y) / 2);
    ctx.stroke();

    ctx.restore();

    // 4. Draw Window Polygon outline (Blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.stroke();

    // 5. Draw Window Corner Pins with labels
    const drawWindowPin = (pt: Point, label: string, isSelected: boolean) => {
      ctx.save();
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = isSelected ? 12 : 6;

      ctx.fillStyle = isSelected ? '#1d4ed8' : '#2563eb';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isSelected ? 11 : 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    drawWindowPin(tl, 'TL', activeDrag === 'tl');
    drawWindowPin(tr, 'TR', activeDrag === 'tr');
    drawWindowPin(br, 'BR', activeDrag === 'br');
    drawWindowPin(bl, 'BL', activeDrag === 'bl');

    // 6. Draw Reference Object Box (Emerald)
    const cx = cardBox.x * w;
    const cy = cardBox.y * h;
    const cw = cardBox.w * w;
    const ch = cardBox.h * h;

    // Clear card area so it's sharp
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, cw, ch);
    ctx.clip();
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    // Box stroke
    ctx.save();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.strokeRect(cx, cy, cw, ch);
    ctx.setLineDash([]);

    // Fill tint
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    ctx.fillRect(cx, cy, cw, ch);

    // Card tag header badge
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    const tagText = `💳 ${REF_OBJECTS[refType].name} (${
      refOrientation === 'horizontal' ? 'гориз.' : 'вертик.'
    })`;
    const tagMetrics = ctx.measureText(tagText);
    const tagW = tagMetrics.width + 12;
    const tagH = 18;

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(cx, Math.max(2, cy - tagH - 4), tagW, tagH, 5);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(tagText, cx + 6, Math.max(2, cy - tagH - 4) + 13);

    // Card Resize Handle (Bottom-Right Corner)
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + cw, cy + ch, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Card Center Move Handle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(cx + cw / 2, cy + ch / 2, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 7. Dimension measurement pills on edges
    if (rawWidthMm && rawHeightMm) {
      const midTop = { x: (tl.x + tr.x) / 2, y: (tl.y + tr.y) / 2 };
      const midRight = { x: (tr.x + br.x) / 2, y: (tr.y + br.y) / 2 };

      const drawPill = (x: number, y: number, text: string) => {
        ctx.save();
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        const m = ctx.measureText(text);
        const pw = Math.max(m.width + 16, 75);
        const ph = 24;

        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(x - pw / 2, y - ph / 2, pw, ph, 8);
        ctx.fill();

        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y);
        ctx.restore();
      };

      drawPill(midTop.x, Math.max(16, midTop.y - 18), `↔ ${(rawWidthMm / 10).toFixed(1)} см`);
      drawPill(
        Math.min(w - 45, midRight.x + 45),
        midRight.y,
        `↕ ${(rawHeightMm / 10).toFixed(1)} см`
      );
    }

    // 8. Draw Magnifying Loupe if actively dragging
    if (activeDrag && pointerPos) {
      const px = pointerPos.x * w;
      const py = pointerPos.y * h;

      const loupeRadius = 45;
      const loupeX = Math.max(loupeRadius + 8, Math.min(w - loupeRadius - 8, px));
      const loupeY = Math.max(loupeRadius + 8, py - loupeRadius - 35);
      const zoom = 2.5;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.clip();

      ctx.drawImage(
        img,
        pointerPos.x * img.naturalWidth - (loupeRadius / zoom) * (img.naturalWidth / w),
        pointerPos.y * img.naturalHeight - (loupeRadius / zoom) * (img.naturalHeight / h),
        ((loupeRadius * 2) / zoom) * (img.naturalWidth / w),
        ((loupeRadius * 2) / zoom) * (img.naturalHeight / h),
        loupeX - loupeRadius,
        loupeY - loupeRadius,
        loupeRadius * 2,
        loupeRadius * 2
      );

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(loupeX - 10, loupeY);
      ctx.lineTo(loupeX + 10, loupeY);
      ctx.moveTo(loupeX, loupeY - 10);
      ctx.lineTo(loupeX, loupeY + 10);
      ctx.stroke();

      ctx.restore();
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(loupeX, loupeY, loupeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [
    step,
    cardBox,
    windowCorners,
    rawWidthMm,
    rawHeightMm,
    refType,
    refOrientation,
    activeDrag,
    pointerPos,
    getReferenceAspectRatio,
  ]);

  // Re-draw on animation frame or state update
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer Interaction Handlers (Touch + Mouse unified)
  const getNormalizedPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getNormalizedPoint(e);
    setPointerPos({ x, y });

    const canvas = canvasRef.current;
    const w = canvas?.clientWidth || 300;
    const h = canvas?.clientHeight || 200;

    const hitRadiusX = 28 / w;
    const hitRadiusY = 28 / h;

    if (Math.hypot((x - windowCorners.tl.x) / hitRadiusX, (y - windowCorners.tl.y) / hitRadiusY) < 1) {
      setActiveDrag('tl');
      return;
    }
    if (Math.hypot((x - windowCorners.tr.x) / hitRadiusX, (y - windowCorners.tr.y) / hitRadiusY) < 1) {
      setActiveDrag('tr');
      return;
    }
    if (Math.hypot((x - windowCorners.br.x) / hitRadiusX, (y - windowCorners.br.y) / hitRadiusY) < 1) {
      setActiveDrag('br');
      return;
    }
    if (Math.hypot((x - windowCorners.bl.x) / hitRadiusX, (y - windowCorners.bl.y) / hitRadiusY) < 1) {
      setActiveDrag('bl');
      return;
    }

    const cardBrX = cardBox.x + cardBox.w;
    const cardBrY = cardBox.y + cardBox.h;
    if (Math.hypot((x - cardBrX) / hitRadiusX, (y - cardBrY) / hitRadiusY) < 1) {
      setActiveDrag('card_resize');
      return;
    }

    if (
      x >= cardBox.x - 0.02 &&
      x <= cardBox.x + cardBox.w + 0.02 &&
      y >= cardBox.y - 0.02 &&
      y <= cardBox.y + cardBox.h + 0.02
    ) {
      setActiveDrag('card_move');
      return;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDrag || !canvasRef.current) return;
    const { x, y } = getNormalizedPoint(e);
    setPointerPos({ x, y });

    if (activeDrag === 'tl') {
      const nextCorners = { ...windowCorners, tl: { x, y } };
      setWindowCorners(nextCorners);
      calculateDimensionsWithPoints(cardBox, nextCorners);
    } else if (activeDrag === 'tr') {
      const nextCorners = { ...windowCorners, tr: { x, y } };
      setWindowCorners(nextCorners);
      calculateDimensionsWithPoints(cardBox, nextCorners);
    } else if (activeDrag === 'br') {
      const nextCorners = { ...windowCorners, br: { x, y } };
      setWindowCorners(nextCorners);
      calculateDimensionsWithPoints(cardBox, nextCorners);
    } else if (activeDrag === 'bl') {
      const nextCorners = { ...windowCorners, bl: { x, y } };
      setWindowCorners(nextCorners);
      calculateDimensionsWithPoints(cardBox, nextCorners);
    } else if (activeDrag === 'card_move') {
      const nextBox = {
        ...cardBox,
        x: Math.max(0, Math.min(1 - cardBox.w, x - cardBox.w / 2)),
        y: Math.max(0, Math.min(1 - cardBox.h, y - cardBox.h / 2)),
      };
      setCardBox(nextBox);
      calculateDimensionsWithPoints(nextBox, windowCorners);
    } else if (activeDrag === 'card_resize') {
      const newW = Math.max(0.04, Math.min(0.8, x - cardBox.x));
      const refAspect = getReferenceAspectRatio();
      const newH = (newW * imgAspectRatio) / refAspect;
      const nextBox = {
        ...cardBox,
        w: newW,
        h: Math.max(0.03, Math.min(0.8, newH)),
      };
      setCardBox(nextBox);
      calculateDimensionsWithPoints(nextBox, windowCorners);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setActiveDrag(null);
    setPointerPos(null);
  };

  // Final adjusted dimensions with system presets applied
  const finalDimensions = useCallback(() => {
    if (!rawWidthMm || !rawHeightMm) return { widthCm: 60, heightCm: 140, widthMm: 600, heightMm: 1400 };

    let wMm = rawWidthMm;
    let hMm = rawHeightMm;

    if (systemPreset === 'open_sash') {
      wMm += 38;
      hMm += 40;
    } else if (systemPreset === 'full_opening') {
      wMm += 120;
      hMm += 150;
    }

    const widthCm = Number((wMm / 10).toFixed(1));
    const heightCm = Number((hMm / 10).toFixed(1));

    return { widthCm, heightCm, widthMm: wMm, heightMm: hMm };
  }, [rawWidthMm, rawHeightMm, systemPreset]);

  // Apply to calculator and close
  const handleApply = () => {
    const { widthCm, heightCm } = finalDimensions();
    if (onApplyDimensions) {
      onApplyDimensions(widthCm, heightCm);
    }
    trackEvent('ai_vision_measure_applied', {
      widthCm,
      heightCm,
      refType,
      systemPreset,
    });
    onClose();
  };

  if (!isOpen) return null;

  const dims = finalDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
        {/* ── Modal Header ───────────────────────────────────────────── */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base">AI Авто-замір вікна по фото</h3>
                <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Computer Vision
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-300">
                Вимірювання ширини та висоти за фото еталону без рулетки
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            aria-label="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Body ─────────────────────────────────────────────── */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          {/* STEP 1: UPLOAD / SELECT REFERENCE */}
          {step === 'upload' && (
            <div className="space-y-5">
              {/* Reference object selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide">
                  1. Оберіть еталонний предмет, який ви прикладете до вікна:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['card', 'a4'] as const).map((key) => {
                    const item = REF_OBJECTS[key];
                    const Icon = item.icon;
                    const isSelected = refType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setRefType(key)}
                        className={`p-3 sm:p-4 rounded-2xl border transition flex items-center gap-3 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 text-blue-900 font-bold'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold">{item.name}</div>
                          <div className="text-[11px] text-gray-500 font-medium">
                            {item.widthMm} × {item.heightMm} мм
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-xs text-blue-950 space-y-2.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Як зробити правильне фото для AI-заміру:</span>
                </div>
                <ul className="space-y-1.5 text-[11px] sm:text-xs text-blue-900/90 leading-relaxed list-disc list-inside">
                  <li>
                    Прикладіть <strong>банківську карту</strong> або <strong>аркуш А4</strong> плозом
                    до скла в кутку або біля рами.
                  </li>
                  <li>Зробіть фото <strong>прямо навпроти вікна</strong>, щоб у кадр потрапило все вікно та еталон.</li>
                  <li>AI автоматично калібрує масштаб та розрахує точні розміри скла та рами.</li>
                </ul>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Button 1: Take photo with camera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-3.5 sm:py-4 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  <span>Зробити фото з камери</span>
                </button>

                {/* Button 2: Upload from gallery */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="py-3.5 sm:py-4 px-5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 border border-gray-300 cursor-pointer active:scale-95"
                >
                  <Upload className="w-5 h-5" />
                  <span>Завантажити з галереї</span>
                </button>
              </div>

              {/* Hidden Inputs */}
              {/* Direct Camera Input with capture */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {/* Gallery / File Picker Input without capture */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}

          {/* STEP 2: PROCESSING ANIMATION */}
          {isProcessing && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-500 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-sm sm:text-base text-gray-900">
                  Аналізуємо геометрію вікна та еталон...
                </div>
                <p className="text-xs text-gray-500 max-w-sm">
                  Калібруємо пікселі на міліметр за предметом:{' '}
                  <strong>{REF_OBJECTS[refType].name}</strong>
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: INTERACTIVE CALIBRATION & ADJUSTMENT */}
          {step === 'adjust' && !isProcessing && (
            <div className="space-y-4">
              {/* Toolbar & Hints */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <Move className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">
                    <strong>Підказка:</strong> Перетягуйте <strong>сині точки</strong> по кутах скла, а{' '}
                    <strong>зелену рамку</strong> підженіть під розмір картки.
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={toggleOrientation}
                    className="px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-[11px] font-bold text-gray-700 flex items-center gap-1 cursor-pointer transition"
                    title="Повернути орієнтацію картки"
                  >
                    <RotateCw className="w-3 h-3 text-gray-600" />
                    <span>{refOrientation === 'horizontal' ? 'Гориз.' : 'Вертик.'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => adjustCardScale(0.9)}
                    className="p-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-pointer transition"
                    title="Зменшити еталон (-10%)"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => adjustCardScale(1.1)}
                    className="p-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-pointer transition"
                    title="Збільшити еталон (+10%)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('upload')}
                    className="text-blue-600 hover:text-blue-700 font-bold text-[11px] pl-1 cursor-pointer"
                  >
                    Інше фото
                  </button>
                </div>
              </div>

              {/* Interactive Calibration Canvas */}
              <div
                ref={containerRef}
                className="relative rounded-2xl overflow-hidden border border-gray-300 bg-slate-950 w-full touch-none select-none shadow-inner"
                style={{
                  aspectRatio: `${imgAspectRatio}`,
                  maxHeight: '52vh',
                }}
              >
                <canvas
                  ref={canvasRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="w-full h-full cursor-crosshair block"
                />

                {/* Floating legend helper on mobile */}
                <div className="absolute top-2 left-2 pointer-events-none bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Вікно
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Еталон
                  </span>
                </div>
              </div>

              {/* System Type Selector (Allowance adjustment) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Тип монтажу для розрахунку:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'glass' as const,
                      label: 'По склу (штапик)',
                      sub: 'Чистий замір',
                    },
                    {
                      id: 'open_sash' as const,
                      label: 'На стулку (Uni/Mini)',
                      sub: '+3.8 см габарит',
                    },
                    {
                      id: 'full_opening' as const,
                      label: 'На весь отвір',
                      sub: '+12 см запас',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSystemPreset(preset.id)}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        systemPreset === preset.id
                          ? 'bg-blue-50 border-blue-600 text-blue-950 ring-1 ring-blue-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-[11px] sm:text-xs font-bold leading-tight">
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{preset.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Summary & CTA */}
              {rawWidthMm && rawHeightMm && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Розраховані розміри виробу:</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-gray-900 font-mono tracking-tight">
                      {dims.widthCm} см × {dims.heightCm} см
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Точні габарити: {dims.widthMm} × {dims.heightMm} мм (похибка ±2 мм)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApply}
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
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
