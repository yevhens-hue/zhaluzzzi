'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type ChatSession = {
  id: string;
  session_token: string;
  messages: any[];
  created_at: string;
  updated_at: string;
};

export default function AnalyticsDashboard() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('zhaluzi_chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50);
      
      if (!error && data) {
        setSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Аналітика Чатів</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Список сесій */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-[600px] flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">Останні сесії</h2>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {loading ? (
              <p className="p-4 text-gray-500">Завантаження...</p>
            ) : sessions.length === 0 ? (
              <p className="p-4 text-gray-500">Сесій не знайдено</p>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedSession?.id === session.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-transparent hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {session.session_token.substring(0, 8)}...
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {new Date(session.updated_at).toLocaleString('uk-UA')}
                    </p>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      {session.messages.length} msg
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Деталі сесії */}
        <div className="col-span-1 md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm h-[600px] flex flex-col">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="font-semibold text-gray-700">
              {selectedSession ? `Деталі: ${selectedSession.session_token}` : 'Оберіть сесію для перегляду'}
            </h2>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4 bg-slate-50">
            {selectedSession ? (
              selectedSession.messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Тут з'явиться історія повідомлень
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
