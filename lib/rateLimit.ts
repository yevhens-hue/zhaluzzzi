import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if the request exceeds rate limits.
 * @param req NextRequest
 * @param limit Max number of requests allowed in window
 * @param windowMs Window duration in milliseconds (default: 60s)
 * @returns { isLimited: boolean, remaining: number }
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { isLimited: boolean; remaining: number } {
  // Extract client IP from standard proxy headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

  const routeKey = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();
  const record = rateLimitStore.get(routeKey);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(routeKey, { count: 1, resetTime: now + windowMs });
    return { isLimited: false, remaining: limit - 1 };
  }

  record.count += 1;
  if (record.count > limit) {
    return { isLimited: true, remaining: 0 };
  }

  return { isLimited: false, remaining: limit - record.count };
}
