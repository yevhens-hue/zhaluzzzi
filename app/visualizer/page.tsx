import React from 'react';
import { Metadata } from 'next';
import RoomVisualizer from '@/components/visualizer/RoomVisualizer';
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
    <div className="space-y-10 py-2 sm:py-4">
      {/* Page Hero */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Інтерактивна примірка</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Приміряйте жалюзі та штори на своєму вікні онлайн
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Оберіть тип системи, змінюйте фактури тканин, перевіряйте захист від сонця у режимах «День» та «Вечір» або завантажте власне фото кімнати.
        </p>
      </div>

      {/* The Interactive Visualizer */}
      <div className="w-full">
        <RoomVisualizer />
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Безкоштовний замір у Дніпрі</h3>
            <p className="text-xs text-gray-500">
              Майстер приїде з реальними зразками всіх тканин, каталогами та лазерним далекоміром.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Гарантія 24 місяці</h3>
            <p className="text-xs text-gray-500">
              Використовуємо лише оригінальні польські механізми Besta та тканини європейського виробництва.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Швидке виготовлення</h3>
            <p className="text-xs text-gray-500">
              Власне виробництво у Дніпрі — термін виготовлення від 2 до 4 робочих днів.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
