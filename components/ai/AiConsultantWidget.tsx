'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCity } from '@/context/CityContext';
import { MessageBubble, MessageItem } from './MessageBubble';
import { MessageSquare, X, Send, Bot, Sparkles, RotateCcw } from 'lucide-react';

const QUICK_PROMPTS = [
  '📐 Як правильно заміряти вікно?',
  '☀️ Яка тканина краще від спеки?',
  '🌗 Чим відрізняється День-Ніч?',
  '🚗 Як викликати замірника зі зразками?',
];

export const AiConsultantWidget: React.FC = () => {
  const { currentCity } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load chat history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('zhaluzi_ai_chat_history_v1');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to parse chat history from localStorage:', err);
    }

    const welcomeCityText =
      currentCity && currentCity !== 'Місто'
        ? `у місті ${currentCity}`
        : 'по всій Україні';

    setMessages([
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Вітаю! 👋 Я AI-консультант фабрики «Жалюзи». Допоможу обрати рулонні штори або жалюзі ${welcomeCityText}, підкажу як зробити точний замір або оформити безкоштовний виїзд майстра зі зразками! Чим можу допомогти?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  }, [currentCity]);

  // 2. Persist chat history to localStorage whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('zhaluzi_ai_chat_history_v1', JSON.stringify(messages));
      } catch (err) {
        console.warn('Failed to save chat history to localStorage:', err);
      }
    }
  }, [messages]);

  // 3. Clear chat history handler
  const handleClearHistory = () => {
    try {
      localStorage.removeItem('zhaluzi_ai_chat_history_v1');
    } catch (e) {}
    const welcomeCityText =
      currentCity && currentCity !== 'Місто'
        ? `у місті ${currentCity}`
        : 'по всій Україні';
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'assistant',
        content: `Історію чату очищено. 👋 Чим можу допомогти ${welcomeCityText}?`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          cityContext:
            currentCity && currentCity !== 'Місто' ? currentCity : 'Україна',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isLeadSubmitted: data.leadSubmitted,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "Вибачте, виникла тимчасова помилка з'єднання. Ви можете зателефонувати нам або залишити номер у формі зворотного зв'язку!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[390px] h-[530px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm border border-white/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>AI-Консультант</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> Oracle Certified
                  </span>
                </h3>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                  Онлайн {currentCity && currentCity !== 'Місто' ? `• ${currentCity}` : '• Україна'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
                title="Очистити історію чату"
                aria-label="Очистити історію чату"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
                aria-label="Закрити чат"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onQuickAction={handleSendMessage}
              />
            ))}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 rounded-bl-none shadow-xs flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="p-2.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold transition-colors border border-blue-100 active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Запитайте про замір, штори чи ціну..."
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-md active:scale-95 flex items-center justify-center"
                aria-label="Надіслати повідомлення"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating AI Agent Teaser Pill */}
      {!isOpen && (
        <div className="mb-2 hidden sm:flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md border border-indigo-500/40 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-medium animate-bounce duration-1000 cursor-pointer hover:bg-slate-900 transition-all"
             onClick={() => setIsOpen(true)}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>✨ <b>AI-Консультант</b> • Замір за 10 сек</span>
        </div>
      )}

      {/* Floating Holographic AI Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-13 px-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group relative border border-white/20"
        title="AI-Консультант (онлайн)"
        aria-label="Відкрити онлайн AI-консультант"
      >
        <span className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full opacity-40 group-hover:opacity-80 blur-md transition duration-500 pointer-events-none animate-pulse"></span>

        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full z-20"></span>
        )}

        {isOpen ? (
          <X className="w-5 h-5 z-10" />
        ) : (
          <>
            <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin [animation-duration:6s]" />
            </div>
            <span className="z-10 font-bold text-xs tracking-wide flex items-center gap-1.5">
              <span>AI Эксперт</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
};
