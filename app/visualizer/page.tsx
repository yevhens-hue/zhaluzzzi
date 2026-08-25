import React from 'react';
import { Metadata } from 'next';
import RoomVisualizer from '@/components/visualizer/RoomVisualizer';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Sparkles, ShieldCheck, Truck, Ruler } from 'lucide-react';

export const metadata: Metadata = {
  title: '3D Візуалізатор жалюзі та рулонних штор | Примірка на вікно онлайн у Дніпрі',
  description: 'Приміряйте рулонні штори, День-Ніч, блекаут та жалюзі на фото вашої кімнати онлайн. Підбір кольору, фактури тканини та регулювання освітлення від виробника у Дніпрі.',
  keywords: [
    'візуалізатор жалюзі',
    'примірка рулонних штор онлайн',
    'день ніч візуалізатор',
    'жалюзі дніпро',
    'підбір штор на вікно',
  ],
};

export default function VisualizerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Page Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Інтерактивна примірка</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Приміряйте жалюзі та штори на своєму вікні онлайн
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Оберіть тип системи, змінюйте фактури тканин, перевіряйте захист від сонця у режимах «День» та «Вечір» або завантажте власне фото кімнати.
          </p>
        </div>

        {/* The Interactive Visualizer */}
        <div className="w-full">
          <RoomVisualizer />
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Безкоштовний замір у Дніпрі</h3>
              <p className="text-xs text-slate-400">
                Майстер приїде з реальними зразками всіх тканин, каталогами та лазерним далекоміром.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Гарантія 24 місяці</h3>
              <p className="text-xs text-slate-400">
                Використовуємо лише оригінальні польські механізми Besta та тканини європейського виробництва.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base mb-1">Швидке виготовлення</h3>
              <p className="text-xs text-slate-400">
                Власне виробництво у Дніпрі — термін виготовлення від 2 до 4 робочих днів.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
