'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MegaMenuProps {
  activeMenu: string;
  onClose: () => void;
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-6 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="max-w-7xl mx-auto">
        {/* РОЛЕТИ MENU */}
        {activeMenu === 'roleti' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>Каталог Ролет на вікна</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Понад 500 варіантів</span>
              </h3>
              <Link
                href="/roleti"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Дивитися всі ролети</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/roleti?sub=tkanunni_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Тканинні ролети
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=tkanunni_roleti&texture=with_pattern" onClick={onClose} className="hover:text-blue-600">З малюнком</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&texture=plain" onClick={onClose} className="hover:text-blue-600">Без малюнка</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">На балкон</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=den-nich" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  День-Ніч (Зебра)
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=den-nich&texture=with_pattern" onClick={onClose} className="hover:text-blue-600">З малюнком</Link></li>
                  <li><Link href="/roleti?sub=den-nich&texture=plain" onClick={onClose} className="hover:text-blue-600">Однотонні</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">В офіс</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=blekaut_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Блекаут (100% захист)
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">У дитячу</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=na-mansardu" onClick={onClose} className="hover:text-blue-600">На мансарду</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&texture=plain" onClick={onClose} className="hover:text-blue-600">Без малюнка</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=dzhutovi_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Джутові ролети
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">На балкон</Link></li>
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">В спальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=bambukovi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Бамбукові ролети
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=bambukovi&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/roleti?sub=bambukovi&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">В спальню</Link></li>
                  <li><Link href="/roleti?sub=bambukovi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ШТОРИ MENU */}
        {activeMenu === 'shtori' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>Каталог Штор</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Європейські тканини</span>
              </h3>
              <Link
                href="/shtori"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Всі штори</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/shtori?sub=rulonni" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Рулонні штори
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=rulonni&texture=plain" onClick={onClose} className="hover:text-blue-600">Однотонні</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">У дитячу</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=rimski" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Римські штори
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=rimski&mount=wall" onClick={onClose} className="hover:text-blue-600">До стіни</Link></li>
                  <li><Link href="/shtori?sub=rimski&mount=ceiling" onClick={onClose} className="hover:text-blue-600">До стелі</Link></li>
                  <li><Link href="/shtori?sub=rimski&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=shtori_den-nich" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Штори День-Ніч
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=shtori_den-nich&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/shtori?sub=shtori_den-nich&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=blekhaut" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Штори Блекаут
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=blekhaut&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/shtori?sub=blekhaut&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">В офіс</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=plise" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Штори Плісе (Duo)
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=plise&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/shtori?sub=plise&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ЖАЛЮЗІ MENU */}
        {activeMenu === 'zhaluzi' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>Каталог Жалюзі</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">Надійні механізми</span>
              </h3>
              <Link
                href="/zhaluzi"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Всі жалюзі</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/zhaluzi?sub=gorizontalnie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Горизонтальні
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">На балкон</Link></li>
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">В офіс</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=vertikalnie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Вертикальні (127/89 мм)
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">В офіс</Link></li>
                  <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=alyuminievie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Алюмінієві
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi&color=white" onClick={onClose} className="hover:text-blue-600">Білі Classic</Link></li>
                  <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi&color=silver" onClick={onClose} className="hover:text-blue-600">Сріблясті металік</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=bambukovi_zhalyuzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Бамбукові 25 / 50 мм
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=bambukovi_zhalyuzi&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/zhaluzi?sub=bambukovi_zhalyuzi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=derevyani" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Дерев'яні 25 / 50 мм
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=derevyani&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">У спальню</Link></li>
                  <li><Link href="/zhaluzi?sub=derevyani&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ЗАКРИТА СИСТЕМА MENU */}
        {activeMenu === 'zakryta-sistema' && (
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>Ролети закритого типу з коробом та направляючими</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Преміум фіксація</span>
              </h3>
              <Link
                href="/zakryta-sistema"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Всі закриті системи</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Рулонні касетні
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">На кухню</Link></li>
                  <li><Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">В спальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Тканинні Uni
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">На балкон</Link></li>
                  <li><Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">У дитячу</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  День-Ніч у коробі
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">У вітальню</Link></li>
                  <li><Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">В спальню</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  Блекаут із коробом
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">В спальню (повна темрява)</Link></li>
                  <li><Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema&dest=na-mansardu" onClick={onClose} className="hover:text-blue-600">На мансарду</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
