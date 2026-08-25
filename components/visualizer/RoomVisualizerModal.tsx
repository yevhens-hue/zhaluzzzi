'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import RoomVisualizer, { VisualizerSystem } from './RoomVisualizer';

interface RoomVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSystem?: VisualizerSystem;
  initialColorHex?: string;
  initialFabricName?: string;
}

export default function RoomVisualizerModal({
  isOpen,
  onClose,
  initialSystem,
  initialColorHex,
  initialFabricName,
}: RoomVisualizerModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
          aria-label="Закрити візуалізатор"
        >
          <X className="w-5 h-5" />
        </button>

        <RoomVisualizer
          initialSystem={initialSystem}
          initialColorHex={initialColorHex}
          initialFabricName={initialFabricName}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
}
