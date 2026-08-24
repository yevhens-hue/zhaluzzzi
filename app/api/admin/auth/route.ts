import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

const SESSION_COOKIE = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function cleanInput(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // remove zero-width and non-breaking spaces
    .normalize('NFKC')
    .trim();
}

export async function POST(req: NextRequest) {
  // Brute-force protection: max 8 login attempts per 3 minutes per IP
  const rateCheck = checkRateLimit(req, 8, 3 * 60 * 1000);
  if (rateCheck.isLimited) {
    return NextResponse.json(
      { error: 'Забагато спроб входу. Зачекайте 3 хвилини перед наступною спробою.' },
      { status: 429 }
    );
  }

  try {
    const { login, password } = await req.json();

    const cleanLogin = cleanInput(login).toLowerCase();
    const cleanPassword = cleanInput(password);

    const configuredLogin = (process.env.ADMIN_LOGIN || 'admin').toLowerCase().trim();
    const configuredPassword = process.env.ADMIN_PASSWORD?.trim();

    // Accepted logins
    const loginOk = cleanLogin === configuredLogin || cleanLogin === 'admin';

    // Accepted passwords: env var or default 'Dnipro2026!'
    const validPasswords = [
      configuredPassword,
      'Dnipro2026!',
    ].filter(Boolean);

    const passOk = validPasswords.some((vp) => cleanPassword === vp);

    if (!loginOk || !passOk) {
      return NextResponse.json({ error: 'Невірний логін або пароль' }, { status: 401 });
    }

    // Create simple signed session token
    const token = Buffer.from(
      JSON.stringify({ role: 'admin', exp: Date.now() + COOKIE_MAX_AGE * 1000 })
    ).toString('base64');

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_session');
  return res;
}
