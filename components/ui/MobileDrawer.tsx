'use client';

import * as React from 'react';
import { Drawer } from 'vaul';

interface MobileDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function MobileDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className = '',
}: MobileDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity" />
        <Drawer.Content
          className={`bg-slate-900/95 backdrop-blur-xl border-t border-emerald-500/20 flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-h-[88vh] z-50 outline-none text-white shadow-2xl ${className}`}
        >
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-slate-600/80 my-3 cursor-grab active:cursor-grabbing hover:bg-slate-500 transition-colors" />
          <div className="p-4 sm:p-6 pt-1 flex-1 overflow-y-auto">
            {(title || description) && (
              <div className="mb-4 text-center">
                {title && <Drawer.Title className="font-bold text-lg text-white">{title}</Drawer.Title>}
                {description && (
                  <Drawer.Description className="text-xs text-slate-400 mt-1">
                    {description}
                  </Drawer.Description>
                )}
              </div>
            )}
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
