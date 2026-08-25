"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface PriceCounterProps {
  value: number;
  currency?: string;
  className?: string;
}

export function PriceCounter({
  value,
  currency = "грн",
  className = "font-black text-2xl text-gray-900",
}: PriceCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 150,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString("uk-UA");
      }
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <span className={className}>
      <span ref={ref}>{value.toLocaleString("uk-UA")}</span>
      {currency && <span className="ml-1 text-sm font-semibold text-gray-500">{currency}</span>}
    </span>
  );
}
