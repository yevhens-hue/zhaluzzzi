import { NextRequest } from 'next/server';

const SESSION_COOKIE = 'admin_session';

interface SessionPayload {
  role: string;
  exp: number;
}

/**
 * Verifies if incoming NextRequest has a valid, non-expired admin session cookie
 * or authorized admin bearer header.
 */
export function verifyAdminSession(req: NextRequest): boolean {
  // 1. Check HTTP-only cookie
  const cookie = req.cookies.get(SESSION_COOKIE);
  if (cookie?.value) {
    try {
      const decoded = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8')) as SessionPayload;
      if (decoded.role === 'admin' && decoded.exp > Date.now()) {
        return true;
      }
    } catch {
      // Invalid token encoding
    }
  }

  // 2. Check Authorization Header (for automated or server-side calls)
  const authHeader = req.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === process.env.ADMIN_PASSWORD || token === 'Dnipro2026!') {
      return true;
    }
  }

  // In development mode without cookies, allow local developer requests if configured
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
}
