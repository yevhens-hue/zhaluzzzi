'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { APP_VERSION, APP_BUILD_DATE } from '@/lib/version';

interface AdminLoginProps {
  onSuccess: () => void;
}

const cleanInput = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '') // strip zero-width and non-breaking spaces
    .normalize('NFKC')
    .trim();
};

export const SESSION_AUTH_KEY = 'app_admin_session_v2';

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    const login = cleanInput(loginInput).toLowerCase();
    const password = cleanInput(passwordInput);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (res.ok) {
        setAuthError('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
        }
        onSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || 'Невірний логін або пароль адміністратора.');
      }
    } catch {
      setAuthError('Помилка підключення. Перевірте зʼєднання та спробуйте ще раз.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Вхід в адмін-панель</h1>
          <p className="text-xs text-gray-500">
            Введіть логін та пароль адміністратора для доступу до керування сайтом
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-login-input" className="block text-xs font-bold text-gray-700 mb-1">
              Логін адміністратора
            </label>
            <input
              id="admin-login-input"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="admin"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="admin-password-input" className="block text-xs font-bold text-gray-700 mb-1">
              Пароль
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Введіть пароль"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                onKeyUp={(e) => setCapsLockActive(e.getModifierState('CapsLock'))}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white placeholder:text-gray-400 font-medium focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {capsLockActive && (
              <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                <span>⚠️</span> Увімкнено Caps Lock (пароль чутливий до регістру)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Перевірка входу...</span>
              </>
            ) : (
              <span>Увійти в адмін-панель</span>
            )}
          </button>
        </form>

        <div className="text-[11px] text-gray-400 text-center space-y-1">
          <div>🔒 Доступ суворо обмежений для власника сайту.</div>
          <div className="font-mono text-[10px] text-gray-400">Система керування v{APP_VERSION} ({APP_BUILD_DATE})</div>
        </div>
      </div>
    </div>
  );
}
