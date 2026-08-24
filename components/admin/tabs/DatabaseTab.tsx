'use client';

import React from 'react';
import { ShieldCheck, Database, ExternalLink } from 'lucide-react';

export default function DatabaseTab() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kapkqziyceefxluxlvqc.supabase.co';
  const projectId = supabaseUrl.replace('https://', '').split('.')[0] || 'kapkqziyceefxluxlvqc';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Адміністратор сайту</h2>
            <p className="text-xs text-gray-500">Доступ до панелі керування /admin</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-500">URL адмінки:</span>
            <span className="font-mono font-bold text-blue-600">/admin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Логін:</span>
            <span className="font-mono font-bold text-gray-900">admin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Пароль:</span>
            <span className="font-mono font-bold text-gray-900">Dnipro2026!</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Хмарна база Supabase</h2>
            <p className="text-xs text-gray-500">PostgreSQL база даних (Single Source of Truth)</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs text-gray-700">
          <div>
            <span className="text-gray-500 block mb-0.5">Project ID:</span>
            <span className="font-mono font-bold text-gray-900">{projectId}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-0.5">Supabase URL:</span>
            <span className="font-mono text-[11px] text-blue-600 break-all">
              {supabaseUrl}
            </span>
          </div>
          <a
            href={`https://supabase.com/dashboard/project/${projectId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
          >
            <span>Відкрити кабінет Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
