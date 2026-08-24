import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const LOGIN_PATH = '/admin';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin and sub-paths, but allow the login page itself and API routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow admin API routes to pass through (they do their own auth)
  if (pathname.startsWith('/api/admin')) return NextResponse.next();

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;

  if (!cookie) {
    // Not logged in — allow /admin page to render (it has its own login form)
    return NextResponse.next();
  }

  // Validate token expiry
  try {
    const payload = JSON.parse(Buffer.from(cookie, 'base64').toString());
    if (payload.exp && Date.now() > payload.exp) {
      // Expired — clear cookie and continue (admin page will show login form)
      const res = NextResponse.next();
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  } catch {
    // Invalid token — clear it
    const res = NextResponse.next();
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
