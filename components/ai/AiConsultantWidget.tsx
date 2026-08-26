'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCity } from '@/context/CityContext';
import { MessageBubble, MessageItem } from './MessageBubble';
import { MessageSquare, X, Send, Bot, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

// ─── FAQ In-memory cache (avoid repeated API calls for common questions) ────
const FAQ_CACHE = new Map<string, { answer: string; ts: number }>();
const FAQ_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const FAQ_PATTERNS: Array<{ re: RegExp; answer: string }> = [
  {
    re: /як.{0,10}заміряти|як.{0,10}міряти|замір.{0,10}вікн|инструкц.{0,10}замір|как.{0,10}замерить|как.{0,10}померить/i,
    answer: '📐 **Як заміряти вікно:**\n1. Використовуйте металеву рулетку (не швейний сантиметр).\n2. Виміряйте ширину по стиках штапика з рамою з обох боків (скло + штапик).\n3. Висота — від верху до низу всієї стулки.\n4. Додайте 10-20 мм запасу до ширини для відкритих систем.\n\nПідкажіть ваші розміри — порахую точну вартість!',
  },
  {
    re: /гарантія|гарантия/i,
    answer: '✅ **Гарантія:** 12–24 місяці на механізми та фурнітуру. Виробничий шлюб замінюємо безкоштовно протягом усього гарантійного строку.',
  },
  {
    re: /доставк|відправк|нова пошт|нп|доставка|отправка/i,
    answer: '🚚 **Доставка:** Нова Пошта по всій Україні (1-2 дні). Відправляємо за 1-3 робочих дні після виготовлення. Оплата при отриманні (накладений платіж) або онлайн карткою.',
  },
  {
    re: /какие.{0,10}акции|какие.{0,10}скидки|акции|скидки|есть.{0,10}акции|есть.{0,10}скидки/i,
    answer: '🔥 **Актуальные акции и спецпредложения:**\n\n1. 🎁 **Скидка на объем:** при заказе от 4-х изделий — дополнительная скидка **-7%** на весь заказ ИЛИ **бесплатная доставка** Новой Почтой!\n2. 🌑 **Роллеты Блэкаут (100% защита от солнца):** спеццена от 549 грн/изделие.\n3. 🏷️ **Сезонные скидки до -25%** на популярные ткани в каталоге.\n4. 📐 **Бесплатный выезд замерщика** с образцами при заказе (Днепр, Киев, Харьков, Одесса, Львов, Запорожье).\n\nПодскажите примерные размеры окон, и я рассчитаю стоимость с учетом скидки!',
  },
  {
    re: /які.{0,10}акції|які.{0,10}знижки|акції|знижки|акція|знижка/i,
    answer: '🔥 **Актуальні акції та спецпропозиції:**\n\n1. 🎁 **Знижка на об\'єм:** при замовленні від 4-х виробів — додаткова знижка **-7%** на все замовлення АБО **безкоштовна доставка** Новою Поштою!\n2. 🌑 **Ролети Блекаут (100% захист від сонця):** спецціна від 549 грн/виріб.\n3. 🏷️ **Сезонні знижки до -25%** на популярні тканини в каталозі.\n4. 📐 **Безкоштовний виїзд замірника** зі зразками при замовленні (Дніпро, Київ, Харків, Одеса, Львів, Запоріжжя).\n\nПідкажіть ваші розміри вікон, і я розрахую вартість зі знижкою!',
  },
  {
    re: /номер.{0,10}менеджер|телефон.{0,10}менеджер|номер.{0,10}телефон|контакт|связаться|позвонить/i,
    answer: '📞 **Контакты фабрики и менеджера:**\n\n- 📱 Телефон: **093 912 85 31** или **093 510 55 21** (Мастер-консультант Виктор)\n- 💬 Telegram: **@zhaluzi_dnipro** (+380939128531)\n- 💜 Viber: **+380939128531**\n- ⏰ График: Пн–Сб 08:00–20:00, Вс 09:00–18:00\n\nВы можете позвонить прямо сейчас или оставить свой номер телефона, и мастер перезвонит вам в удобное время!',
  },
  {
    re: /номер.{0,10}менеджер|телефон.{0,10}менеджер|номер.{0,10}телефон|контакт|зв'язатися|зателефонувати/i,
    answer: '📞 **Контакти фабрики та менеджера:**\n\n- 📱 Телефон: **093 912 85 31** або **093 510 55 21** (Майстер-консультант Віктор)\n- 💬 Telegram: **@zhaluzi_dnipro** (+380939128531)\n- 💜 Viber: **+380939128531**\n- ⏰ Графік: Пн–Сб 08:00–20:00, Нд 09:00–18:00\n\nВи можете зателефонувати прямо зараз або залишити номер телефону, і майстер зв\'яжеться з вами у зручний час!',
  },
];

function getCachedFaq(text: string): string | null {
  const key = text.trim().toLowerCase();
  for (const { re, answer } of FAQ_PATTERNS) {
    if (re.test(key)) {
      const cached = FAQ_CACHE.get(answer);
      if (cached && Date.now() - cached.ts < FAQ_TTL_MS) return cached.answer;
      FAQ_CACHE.set(answer, { answer, ts: Date.now() });
      return answer;
    }
  }
  return null;
}

// ─── Lead qualification progress steps ───────────────────────────────────────
const LEAD_STEPS = ['Тип системи', 'Розміри', 'Місто', 'Телефон'];

// Detect completed lead-qualification steps from conversation history
function detectLeadProgress(messages: MessageItem[]): number {
  const fullText = messages.map((m) => m.content).join(' ').toLowerCase();
  let steps = 0;
  if (fullText.match(/день.ніч|блекаут|рулонн|жалюзі|закрит|відкрит|плісе|римськ/)) steps++;
  if (fullText.match(/\d{2,3}\s*[хx×]\s*\d{2,3}|ширин|висот|розмір/)) steps++;
  if (fullText.match(/дніпр|київ|харків|одес|львів|запоріж|місто|район/)) steps++;
  if (fullText.match(/\b0\d{9}\b|\+?380\d{9}|телефон|номер|задзвон/)) steps++;
  return steps;
}

// ─── Quick prompts ────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  '📐 Як правильно заміряти вікно?',
  '☀️ Яка тканина краще від спеки?',
  '🌗 Чим відрізняється День-Ніч?',
  '🚗 Як викликати замірника зі зразками?',
];

// ─── Fabric quick-pick chips (for visual selection) ───────────────────────────
const FABRIC_CHIPS = [
  { label: 'Блекаут 100%', emoji: '🌑', prompt: 'Хочу тканину Blackout 100% затемнення' },
  { label: 'День-Ніч', emoji: '🌗', prompt: 'Розкажіть про штори День-Ніч' },
  { label: 'Льон/Натуральна', emoji: '🌿', prompt: 'Цікавить льняна тканина для ролет' },
  { label: 'Прозора', emoji: '☁️', prompt: 'Хочу прозору тканину, яка пропускає світло' },
];

// ─── Page context detection ───────────────────────────────────────────────────
function usePageContext() {
  const pathname = usePathname();

  if (pathname?.startsWith('/product/')) {
    return { page: 'product', productSlug: pathname.split('/product/')[1] };
  }
  if (pathname === '/catalog') return { page: 'catalog' };
  if (pathname === '/checkout') return { page: 'checkout' };
  return { page: 'home' };
}

// ─── Customer Cross-Session Memory ──────────────────────────────────────────
export interface CustomerMemory {
  system?: string;
  dimensions?: string;
  room?: string;
  fabric?: string;
  lastUpdated: number;
}

function extractCustomerMemory(text: string, currentMemory: CustomerMemory | null): CustomerMemory {
  const mem: CustomerMemory = currentMemory ? { ...currentMemory } : { lastUpdated: Date.now() };
  const lower = text.toLowerCase();

  // Extract dimensions (e.g. 140x180, 1400х1800, 60 * 120)
  const dimMatch = text.match(/(\d{2,4})\s*[xх×*]\s*(\d{2,4})/i);
  if (dimMatch) {
    mem.dimensions = `${dimMatch[1]}×${dimMatch[2]}`;
  }

  // Extract system type
  if (lower.includes('день-ніч') || lower.includes('день ніч') || lower.includes('день-ночь') || lower.includes('зебра')) {
    mem.system = 'День-Ніч';
  } else if (lower.includes('блекаут') || lower.includes('блэкаут') || lower.includes('blackout')) {
    mem.system = 'Блекаут 100%';
  } else if (lower.includes('плісе') || lower.includes('плиссе')) {
    mem.system = 'Штори Плісе';
  } else if (lower.includes('римськ') || lower.includes('римск')) {
    mem.system = 'Римські штори';
  } else if (lower.includes('алюміні') || lower.includes('алюмини') || lower.includes('горизонтал')) {
    mem.system = 'Алюмінієві жалюзі';
  } else if (lower.includes('рулонн') || lower.includes('ролет')) {
    if (!mem.system) mem.system = 'Рулонні штори';
  }

  // Extract room context
  if (lower.includes('кухн')) {
    mem.room = 'кухню';
  } else if (lower.includes('спальн')) {
    mem.room = 'спальню';
  } else if (lower.includes('вітальн') || lower.includes('гостин')) {
    mem.room = 'вітальню';
  } else if (lower.includes('дитяч') || lower.includes('детск')) {
    mem.room = 'дитячу';
  } else if (lower.includes('балкон') || lower.includes('лоджі') || lower.includes('лоджи')) {
    mem.room = 'балкон/лоджію';
  } else if (lower.includes('офіс') || lower.includes('кабінет')) {
    mem.room = 'офіс';
  }

  mem.lastUpdated = Date.now();
  return mem;
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export const AiConsultantWidget: React.FC = () => {
  const { currentCity } = useCity();
  const pageCtx = usePageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [streamingContent, setStreamingContent] = useState(''); // live streaming buffer
  const [showFabrics, setShowFabrics] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const [customerMemory, setCustomerMemory] = useState<CustomerMemory | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sessionToken, setSessionToken] = useState<string>('');

  // ── Build welcome message with Cross-Session Memory ──────────────────────
  const buildWelcomeMessage = useCallback(
    (slug?: string, memory?: CustomerMemory | null): string => {
      const welcomeCityText =
        currentCity && currentCity !== 'Місто' ? `у місті ${currentCity}` : 'по всій Україні';

      // Cross-Session Memory Return Greeting
      if (memory && (memory.system || memory.dimensions || memory.room)) {
        const parts: string[] = [];
        if (memory.system) parts.push(memory.system);
        if (memory.dimensions) parts.push(`для вікна ${memory.dimensions} см`);
        if (memory.room) parts.push(`на ${memory.room}`);
        return `З поверненням! 👋 Бачу, ви раніше цікавилися: **${parts.join(' ')}**. Продовжимо підбір тканин чи зробимо точний розрахунок вартості?`;
      }

      if (slug) {
        return `Вітаю! 👋 Бачу, що вас цікавить цей товар. Хочете, я розрахую точну вартість під ваші вікна ${welcomeCityText}?`;
      }
      return `Вітаю! 👋 Я AI-консультант фабрики «Жалюзи». Допоможу обрати рулонні штори або жалюзі ${welcomeCityText}, підкажу як зробити точний замір або оформити безкоштовний виїзд майстра зі зразками! Чим можу допомогти?`;
    },
    [currentCity]
  );

  // ── Load / init chat history & memory ─────────────────────────────────────
  useEffect(() => {
    async function initChat() {
      // 1. Get or create session token
      let token = localStorage.getItem('zhaluzi_session_token_v1');
      if (!token) {
        token = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem('zhaluzi_session_token_v1', token);
      }
      setSessionToken(token);

      // 2. Load Customer Memory (Cross-Session)
      let loadedMemory: CustomerMemory | null = null;
      try {
        const rawMem = localStorage.getItem('zhaluzi_customer_memory_v1');
        if (rawMem) {
          loadedMemory = JSON.parse(rawMem) as CustomerMemory;
          setCustomerMemory(loadedMemory);
        }
      } catch { /* ignore */ }

      // 3. Try local storage chat history
      try {
        const saved = localStorage.getItem('zhaluzi_ai_chat_history_v1');
        if (saved) {
          const parsed = JSON.parse(saved) as MessageItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }

      // 4. Try Supabase history
      try {
        const res = await fetch(`/api/chat/history?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
            return;
          }
        }
      } catch {
        // ignore
      }

      // 5. Fallback to Welcome message (personalized with memory if available)
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: buildWelcomeMessage(pageCtx.productSlug, loadedMemory),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }

    initChat();
  }, [buildWelcomeMessage, pageCtx.productSlug]);

  // ── Persist chat history & memory ─────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('zhaluzi_ai_chat_history_v1', JSON.stringify(messages));
      } catch { /* ignore */ }
    }
  }, [messages]);

  // ── Behavioral trigger: auto-open after 45 sec on product page ───────────
  useEffect(() => {
    if (pageCtx.page === 'product' && !autoTriggered && !isOpen) {
      triggerTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        setAutoTriggered(true);
        setHasUnread(true);
      }, 45000);
    }
    return () => {
      if (triggerTimerRef.current) clearTimeout(triggerTimerRef.current);
    };
  }, [pageCtx.page, autoTriggered, isOpen]);

  // ── Clear unread badge on open ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  // ── Listen for Cart → AI prefill event (Cart → Chat bridge) ───────────
  useEffect(() => {
    const handler = (e: Event) => {
      const { prompt } = (e as CustomEvent<{ prompt: string }>).detail;
      if (prompt) {
        setIsOpen(true);
        setInputValue(prompt);
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    };
    window.addEventListener('ai-chat-prefill', handler);
    return () => window.removeEventListener('ai-chat-prefill', handler);
  }, []);

  // ── Clear history ─────────────────────────────────────────────────────────

  const handleClearHistory = () => {
    try { localStorage.removeItem('zhaluzi_ai_chat_history_v1'); } catch { /* ignore */ }
    setMessages([
      {
        id: 'welcome-reset-' + Date.now(),
        role: 'assistant',
        content: buildWelcomeMessage(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // ── Send message with SSE streaming + FAQ cache ───────────────────────
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setStreamingContent('');
    setShowFabrics(false);

    // ── Update Customer Memory from user text ─────────────────────────
    const updatedMem = extractCustomerMemory(text, customerMemory);
    setCustomerMemory(updatedMem);
    try {
      localStorage.setItem('zhaluzi_customer_memory_v1', JSON.stringify(updatedMem));
    } catch { /* ignore */ }

    // ── Check FAQ cache first ───────────────────────────────────────────
    const faqHit = getCachedFaq(text);
    if (faqHit) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: faqHit,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsLoading(false);
      }, 120); // short delay for UX realism
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          cityContext: currentCity && currentCity !== 'Місто' ? currentCity : 'Україна',
          pageContext: pageCtx,
          sessionToken,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const dec = new TextDecoder();
      let accumulated = '';
      let leadSubmitted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = dec.decode(value, { stream: true });
        const lines = raw.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === 'delta') {
              accumulated += event.text;
              setStreamingContent(accumulated);
            } else if (event.type === 'done') {
              leadSubmitted = event.leadSubmitted ?? false;
            } else if (event.type === 'price_result') {
              // Price was already streamed as text — nothing extra needed
            }
          } catch { /* ignore malformed lines */ }
        }
      }

      // Commit streamed message into history
      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: accumulated || "Дякуємо! Вашу заявку зафіксовано. Наш менеджер зв'яжеться з вами найближчим часом.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeadSubmitted: leadSubmitted,
      };

      // Extract additional memory from assistant's response/calculation
      const finalMem = extractCustomerMemory(accumulated, updatedMem);
      setCustomerMemory(finalMem);
      try {
        localStorage.setItem('zhaluzi_customer_memory_v1', JSON.stringify(finalMem));
      } catch { /* ignore */ }

      setMessages((prev) => [...prev, assistantMsg]);
      setStreamingContent('');
      if (!isOpen) setHasUnread(true);

      // Show fabric chips if context is about fabric selection
      if (accumulated.toLowerCase().match(/тканин|блекаут|день.ніч|прозор|льон/)) {
        setShowFabrics(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Вибачте, виникла тимчасова помилка з'єднання. Ви можете зателефонувати нам або залишити номер у формі зворотного зв'язку!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setStreamingContent('');
    } finally {
      setIsLoading(false);
    }
  };

  const leadProgress = detectLeadProgress(messages);
  const showLeadBar = messages.length >= 3 && leadProgress < 4;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {/* ── Chat Window ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-chat-title"
          className="mb-3 w-[92vw] sm:w-[390px] h-[560px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg backdrop-blur-sm border border-white/30">
                  <Bot className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 id="ai-chat-title" className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>AI-Консультант</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" aria-hidden="true" /> Онлайн
                  </span>
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  {currentCity && currentCity !== 'Місто' ? `• ${currentCity}` : '• Україна'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-full hover:bg-white/20 transition text-white/80 hover:text-white"
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

          {/* ── Lead Qualification Progress Bar ────────────────────────── */}
          {showLeadBar && (
            <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Прогрес заявки</span>
                <span className="text-[10px] font-bold text-blue-700">{leadProgress}/{LEAD_STEPS.length}</span>
              </div>
              <div className="flex gap-1">
                {LEAD_STEPS.map((step, i) => (
                  <div key={step} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        i < leadProgress ? 'bg-blue-500' : 'bg-blue-100'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-semibold leading-tight text-center ${
                        i < leadProgress ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    >
                      {i < leadProgress ? <CheckCircle2 className="w-2.5 h-2.5 inline text-blue-500" /> : step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Messages Body ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onQuickAction={handleSendMessage} />
            ))}

            {/* Streaming bubble */}
            {streamingContent && (
              <MessageBubble
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingContent,
                  timestamp: '',
                }}
                onQuickAction={handleSendMessage}
                isStreaming
              />
            )}

            {/* Typing indicator (before first chunk arrives) */}
            {isLoading && !streamingContent && (
              <div className="flex items-start space-x-2">
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 rounded-bl-none shadow-xs flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Fabric Quick Picker ───────────────────────────────────────── */}
          {showFabrics && (
            <div className="px-3 py-2 bg-amber-50 border-t border-amber-100">
              <p className="text-[10px] font-bold text-amber-700 mb-1.5 uppercase tracking-wide">🎨 Оберіть тканину:</p>
              <div className="flex flex-wrap gap-1.5">
                {FABRIC_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      setShowFabrics(false);
                      handleSendMessage(chip.prompt);
                    }}
                    className="text-xs bg-white border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full font-semibold hover:bg-amber-100 transition active:scale-95"
                  >
                    {chip.emoji} {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Quick Prompts ─────────────────────────────────────────────── */}
          {messages.length <= 2 && !showFabrics && (
            <div className="p-2.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {customerMemory && (customerMemory.system || customerMemory.dimensions) && (
                <button
                  onClick={() =>
                    handleSendMessage(
                      `Розрахуйте, будь ласка, вартість ${customerMemory.system || 'штор'}${customerMemory.dimensions ? ` ${customerMemory.dimensions}` : ''}${customerMemory.room ? ` на ${customerMemory.room}` : ''}`
                    )
                  }
                  className="whitespace-nowrap text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold transition-colors border border-indigo-200 active:scale-95 flex items-center gap-1 shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>
                    Продовжити: {customerMemory.system || 'Штори'} {customerMemory.dimensions || ''}
                  </span>
                </button>
              )}
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

          {/* ── Input Box ─────────────────────────────────────────────────── */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Запитайте про замір, штори чи ціну..."
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 font-medium"
                disabled={isLoading}
                aria-label="Введіть повідомлення AI-консультанту"
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

      {/* ── Teaser pill (desktop only) ─────────────────────────────────────── */}
      {!isOpen && (
        <div
          className="mb-2 hidden sm:flex items-center gap-2 bg-slate-900/90 text-white backdrop-blur-md border border-indigo-500/40 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-medium cursor-pointer hover:bg-slate-900 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
          <span>✨ <b>AI-Консультант</b> • Замір за 10 сек</span>
        </div>
      )}

      {/* ── Toggle Button ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-13 px-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group relative border border-white/20"
        aria-label={isOpen ? 'Закрити AI-консультант' : 'Відкрити онлайн AI-консультант'}
        aria-expanded={isOpen}
        aria-controls="ai-chat-title"
      >
        <span className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full opacity-40 group-hover:opacity-80 blur-md transition duration-500 pointer-events-none animate-pulse" />

        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full z-20" aria-label="Нове повідомлення" />
        )}

        {isOpen ? (
          <X className="w-5 h-5 z-10" />
        ) : (
          <>
            <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin [animation-duration:6s]" />
            </div>
            <span className="z-10 font-bold text-xs tracking-wide flex items-center gap-1.5">
              <span>AI Eксперт</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </span>
          </>
        )}
      </button>
    </div>
  );
};
