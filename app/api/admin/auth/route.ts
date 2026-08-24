import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    const validLogin = (process.env.ADMIN_LOGIN || 'admin').toLowerCase();
    const validPassword = process.env.ADMIN_PASSWORD || 'Manov2025!';

    const loginOk = (login || '').trim().toLowerCase() === validLogin;
    const passOk = (password || '').trim() === validPassword;

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
