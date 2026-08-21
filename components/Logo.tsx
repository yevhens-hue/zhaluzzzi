import React from 'react';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 shrink-0 group ${className}`}>
      {/* Emblem SVG matching the photo */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center p-1.5 shrink-0 group-hover:shadow-md transition">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 4 Blinds slats steps in cyan/sky blue */}
          <rect x="10" y="22" width="45" height="11" rx="5.5" fill="#38BDF8" />
          <rect x="18" y="39" width="37" height="11" rx="5.5" fill="#0EA5E9" />
          <rect x="26" y="56" width="29" height="11" rx="5.5" fill="#0284C7" />
          <rect x="34" y="73" width="21" height="11" rx="5.5" fill="#0369A1" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className="text-base sm:text-lg font-black tracking-tight text-gray-900 leading-none">
            ЖАЛЮЗІ
          </span>
          <span className="text-base sm:text-lg font-black tracking-tight text-blue-600 leading-none">
            РОЛЕТИ
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-0.5">
          від виробника • дніпро
        </span>
      </div>
    </Link>
  );
}
