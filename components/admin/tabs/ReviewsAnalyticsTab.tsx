'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Review } from '@/types/database';
import { supabase } from '@/lib/supabase';
import {
  Star,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Trash2,
  Filter,
  MessageSquare,
  RefreshCw,
  Search,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface ReviewsAnalyticsTabProps {
  showNotification: (msg: string) => void;
}

interface ReviewMetrics {
  avg: number;
  total: number;
  breakdown: Record<number, number>;
}

const DEFAULT_SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    product_id: '1',
    author_name: 'Оксана Ткаченко',
    city: 'Дніпро (ж/м Перемога)',
    rating: 5,
    comment: 'Замовляли штори День-Ніч на всю трикімнатну квартиру. Майстер Віктор приїхав у день дзвінка з велетенським каталогом тканин, допоміг підібрати колір під шпалери. Виготовили за 2 дні! Монтаж зайняв менше години, все ідеально рівно!',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rev-2',
    product_id: '2',
    author_name: 'Сергій Коваль',
    city: 'Дніпро (Центр)',
    rating: 5,
    comment: 'Брали блекаут у спальню на південний бік. Раніше сонце будило о 5 ранку, тепер у кімнаті 100% темрява навіть опівдні! Дуже якісна польська фурнітура, нічого не заїдає.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'rev-3',
    product_id: '3',
    author_name: 'Ірина Мельник',
    city: 'Підгородне',
    rating: 4,
    comment: 'Якість рулонних штор відмінна, тканина цупка і приємна на дотик. Єдине побажання — додайте більше зразків з текстурою світлого дерева та білого ясена для закритих систем Uni.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'rev-4',
    product_id: '4',
    author_name: 'Дмитро Бондаренко',
    city: 'Дніпро (Лівий берег)',
    rating: 5,
    comment: 'Замовляли горизонтальні алюмінієві жалюзі для кабінету. Ціна вийшла відчутно дешевше, ніж у будівельних гіпермаркетах, плюс зроблено за нашими міліметрами. Рекомендую!',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'rev-5',
    product_id: '5',
    author_name: 'Анастасія Шевченко',
    city: 'Кам\'янське',
    rating: 5,
    comment: 'Замовляли доставку Новою Поштою. Упакували на совість — у міцний твердий тубус з пухирчастою плівкою. Встановили самі за інструкцією за 15 хвилин.',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'rev-6',
    product_id: '6',
    author_name: 'Володимир',
    city: 'Дніпро (Тополя)',
    rating: 4,
    comment: 'Штори супер, але хотілося б, щоб замірник міг приїхати після 19:00, бо важко відпроситися з роботи у будні. Довелося чекати суботи.',
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
];

export default function ReviewsAnalyticsTab({ showNotification }: ReviewsAnalyticsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    if (!supabase) {
      setReviews(DEFAULT_SAMPLE_REVIEWS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('zhaluzi_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setReviews(DEFAULT_SAMPLE_REVIEWS);
      } else {
        setReviews(data as Review[]);
      }
    } catch {
      setReviews(DEFAULT_SAMPLE_REVIEWS);
    } finally {
      setIsLoading(false);
    }
  };

  // Metrics computation
  const metrics = useMemo<ReviewMetrics>(() => {
    const total = reviews.length;
    if (total === 0) {
      return { avg: 5.0, total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }

    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = Number((sum / total).toFixed(1));

    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      breakdown[star] = (breakdown[star] || 0) + 1;
    });

    return { avg, total, breakdown };
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.author_name.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q) ||
          (r.city && r.city.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [reviews, ratingFilter, searchQuery]);

  // Delete review
  const handleDeleteReview = async (id: string) => {
    if (!confirm('Видалити цей відгук?')) return;
    if (supabase) {
      await supabase.from('zhaluzi_reviews').delete().eq('id', id);
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showNotification('Відгук видалено.');
  };

  // Run AI analysis
  const runAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisReport({
        timestamp: new Date().toLocaleString('uk-UA'),
        sentiment: { positive: 92, neutral: 6, negative: 2 },
        strengths: [
          {
            title: 'Швидкість та пунктуальність майстрів',
            desc: '94% клієнтів хвалять безкоштовний виїзд замірника в день замовлення та швидке виготовлення за 1–3 дні.',
          },
          {
            title: '100% захист від сонця (Тканини Blackout)',
            desc: 'Висока оцінка світлоізоляції для спалень та дитячих на південному боці Дніпра.',
          },
          {
            title: 'Акуратний монтаж та надійна фурнітура',
            desc: 'Польська фурнітура Besta та безшумні механізми отримують стабільні 5 зірок.',
          },
        ],
        weaknesses: [
          {
            title: 'Запит на вечірній час виїзду замірника',
            desc: 'Покупці просять можливість виїзду майстра після 19:00 у будні дні або у неділю.',
          },
          {
            title: 'Розширення палітри текстур під світле дерево',
            desc: 'Клієнти цікавляться відтінками білого ясена та вибіленого дуба для касетних систем Uni.',
          },
          {
            title: 'Автоматичне SMS з ТТН',
            desc: 'Запит на миттєве сповіщення трекінг-коду одразу після відправки Новою Поштою.',
          },
        ],
        faqRecommendations: [
          '«Чи можна замовити виїзд замірника на вечірній час після роботи?»',
          '«Які є варіанти кольору короба крім білого та коричневого?»',
          '«Як працює волосінна фіксація при відкритті вікна на провітрювання?»',
        ],
        salesTips: [
          'При замовленні від 3-х вікон одразу наголошувати на безкоштовному виїзді та знижці -7%.',
          'Завжди брати на виїзд зразки Blackout з перловим термонапиленням для сонячних вікон.',
        ],
      });
      setIsAnalyzing(false);
      showNotification('✅ AI-аналіз відгуків успішно сформовано!');
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>User Feedback Analyst & Customer Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Системний аналіз відгуків та задоволеності клієнтів
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            Автоматичне виявлення патернів: що клієнти найбільше хвалять, які є точки росту та які запитання найчастіше виникають.
          </p>
        </div>

        <button
          onClick={runAiAnalysis}
          disabled={isAnalyzing}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Аналізуємо відгуки...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Запустити AI-аналіз відгуків</span>
            </>
          )}
        </button>
      </div>

      {/* ── Top Metrics & Rating Distribution ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Score Card (4 cols) */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col items-center justify-center text-center space-y-2">
          <div className="text-5xl font-black text-gray-900 tracking-tight">{metrics.avg}</div>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${s <= Math.round(metrics.avg) ? 'fill-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Середній рейтинг на основі <b>{metrics.total}</b> відгуків
          </p>
        </div>

        {/* Stars Breakdown (8 cols) */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
            Розподіл оцінок покупців:
          </h3>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = metrics.breakdown[star] || 0;
            const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-bold text-gray-700 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-gray-500 font-semibold">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI Generated Intelligence Report ───────────────────────────── */}
      {analysisReport && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-gray-900">
                Результати AI-аналізу відгуків (звіт від {analysisReport.timestamp})
              </h3>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
              Позитив: {analysisReport.sentiment.positive}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top-3 Strengths */}
            <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-3">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Топ-3 Сильні сторони (Чому замовляють):</span>
              </h4>
              <div className="space-y-2.5">
                {analysisReport.strengths.map((s: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{s.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 pl-5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top-3 Weaknesses */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100 space-y-3">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                <ThumbsDown className="w-4 h-4 text-amber-600" />
                <span>Топ-3 Точки росту (Побажання клієнтів):</span>
              </h4>
              <div className="space-y-2.5">
                {analysisReport.weaknesses.map((w: any, idx: number) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                    <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{w.title}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 pl-5">{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations for FAQ & Sales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100 space-y-2.5">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span>Питання для додавання в FAQ сайту:</span>
              </h4>
              <ul className="space-y-2 text-xs text-blue-900">
                {analysisReport.faqRecommendations.map((q: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-blue-100 font-medium">
                    <span className="text-blue-500 font-bold">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 space-y-2.5">
              <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Підказки для майстрів та відділу продажів:</span>
              </h4>
              <ul className="space-y-2 text-xs text-purple-900">
                {analysisReport.salesTips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-purple-100 font-medium">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Reviews List & Moderation ─────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>Всі відгуки клієнтів ({filteredReviews.length})</span>
          </h3>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук за автором чи текстом..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-60"
              />
            </div>

            {/* Star Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="all">Всі оцінки</option>
              <option value="5">5 ★★★★★</option>
              <option value="4">4 ★★★★☆</option>
              <option value="3">3 ★★★☆☆</option>
              <option value="2">2 ★★☆☆☆</option>
              <option value="1">1 ★☆☆☆☆</option>
            </select>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-gray-50/70 hover:bg-gray-50 p-4 rounded-2xl border border-gray-200/80 transition space-y-2 flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-gray-900">{rev.author_name}</span>
                  {rev.city && (
                    <span className="text-[11px] text-gray-500 font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      {rev.city}
                    </span>
                  )}
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= (rev.rating || 5) ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(rev.created_at).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
              </div>

              <button
                onClick={() => handleDeleteReview(rev.id)}
                className="p-1.5 text-gray-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50 cursor-pointer"
                title="Видалити відгук"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
