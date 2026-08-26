'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface TurnstileShieldProps {
  onVerify?: (token: string) => void;
  className?: string;
}

export function TurnstileShield({ onVerify, className = '' }: TurnstileShieldProps) {
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    setRenderTime(Date.now());
  }, []);

  return (
    <div className={`turnstile-shield-container ${className}`}>
      {/* 1. Honeypot Field (Invisible to real users, trapped for spam scrapers) */}
      <div
        aria-hidden="true"
        style={{
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="website_url_hp">Do not fill this field</label>
        <input
          type="text"
          id="website_url_hp"
          name="website_url_hp"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
        <input type="hidden" name="_render_time" value={renderTime} />
      </div>

      {/* 2. Micro-badge indicator (Optional subtle trust signal) */}
      <div className="flex items-center gap-1 text-[10px] text-gray-400 select-none">
        <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
        <span>Захищено Cloudflare Turnstile & Honeypot</span>
      </div>
    </div>
  );
}
