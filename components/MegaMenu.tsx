'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MegaMenuProps {
  activeMenu: string;
  onClose: () => void;
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const { t } = useLanguage();

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
                <span>{t('Каталог Ролет на вікна', 'Каталог Роллет на окна')}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {t('Понад 500 варіантів', 'Более 500 вариантов')}
                </span>
              </h3>
              <Link
                href="/roleti"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>{t('Дивитися всі ролети', 'Смотреть все роллеты')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/roleti?sub=tkanunni_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Тканинні ролети', 'Тканевые роллеты')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=tkanunni_roleti&texture=with_pattern" onClick={onClose} className="hover:text-blue-600">{t('З малюнком', 'С рисунком')}</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&texture=plain" onClick={onClose} className="hover:text-blue-600">{t('Без малюнка', 'Без рисунка')}</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">{t('На балкон', 'На балкон')}</Link></li>
                  <li><Link href="/roleti?sub=tkanunni_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=den-nich" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('День-Ніч (Зебра)', 'День-Ночь (Зебра)')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=den-nich&texture=with_pattern" onClick={onClose} className="hover:text-blue-600">{t('З малюнком', 'С рисунком')}</Link></li>
                  <li><Link href="/roleti?sub=den-nich&texture=plain" onClick={onClose} className="hover:text-blue-600">{t('Однотонні', 'Однотонные')}</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/roleti?sub=den-nich&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">{t('В офіс', 'В офис')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=blekaut_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Блекаут (100% захист)', 'Блэкаут (100% защита)')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">{t('У дитячу', 'В детскую')}</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&dest=na-mansardu" onClick={onClose} className="hover:text-blue-600">{t('На мансарду', 'На мансарду')}</Link></li>
                  <li><Link href="/roleti?sub=blekaut_roleti&texture=plain" onClick={onClose} className="hover:text-blue-600">{t('Без малюнка', 'Без рисунка')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=dzhutovi_roleti" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Джутові ролети', 'Джутовые роллеты')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">{t('На балкон', 'На балкон')}</Link></li>
                  <li><Link href="/roleti?sub=dzhutovi_roleti&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('В спальню', 'В спальню')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/roleti?sub=bambukovi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Бамбукові ролети', 'Бамбуковые роллеты')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/roleti?sub=bambukovi&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/roleti?sub=bambukovi&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('В спальню', 'В спальню')}</Link></li>
                  <li><Link href="/roleti?sub=bambukovi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
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
                <span>{t('Каталог Штор', 'Каталог Штор')}</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  {t('Європейські тканини', 'Европейские ткани')}
                </span>
              </h3>
              <Link
                href="/shtori"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>{t('Всі штори', 'Все шторы')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/shtori?sub=rulonni" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Рулонні штори', 'Рулонные шторы')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=rulonni&texture=plain" onClick={onClose} className="hover:text-blue-600">{t('Однотонні', 'Однотонные')}</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/shtori?sub=rulonni&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">{t('У дитячу', 'В детскую')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=rimski" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Римські штори', 'Римские шторы')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=rimski&mount=wall" onClick={onClose} className="hover:text-blue-600">{t('До стіни', 'К стене')}</Link></li>
                  <li><Link href="/shtori?sub=rimski&mount=ceiling" onClick={onClose} className="hover:text-blue-600">{t('До стелі', 'К потолку')}</Link></li>
                  <li><Link href="/shtori?sub=rimski&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=shtori_den-nich" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Штори День-Ніч', 'Шторы День-Ночь')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=shtori_den-nich&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/shtori?sub=shtori_den-nich&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=blekhaut" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Штори Блекаут', 'Шторы Блэкаут')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=blekhaut&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/shtori?sub=blekhaut&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">{t('В офіс', 'В офис')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/shtori?sub=plise" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Штори Плісе (Duo)', 'Шторы Плиссе (Duo)')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/shtori?sub=plise&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/shtori?sub=plise&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
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
                <span>{t('Каталог Жалюзі', 'Каталог Жалюзи')}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                  {t('Надійні механізми', 'Надежные механизмы')}
                </span>
              </h3>
              <Link
                href="/zhaluzi"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>{t('Всі жалюзі', 'Все жалюзи')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
              <div>
                <Link href="/zhaluzi?sub=gorizontalnie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Горизонтальні', 'Горизонтальные')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">{t('На балкон', 'На балкон')}</Link></li>
                  <li><Link href="/zhaluzi?sub=gorizontalnie_zhaluzi&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">{t('В офіс', 'В офис')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=vertikalnie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Вертикальні (127/89 мм)', 'Вертикальные (127/89 мм)')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi&dest=v-ofis" onClick={onClose} className="hover:text-blue-600">{t('В офіс', 'В офис')}</Link></li>
                  <li><Link href="/zhaluzi?sub=vertikalnie_zhaluzi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=alyuminievie_zhaluzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Алюмінієві', 'Алюминиевые')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi&color=white" onClick={onClose} className="hover:text-blue-600">{t('Білі Classic', 'Белые Classic')}</Link></li>
                  <li><Link href="/zhaluzi?sub=alyuminievie_zhaluzi&color=silver" onClick={onClose} className="hover:text-blue-600">{t('Сріблясті металік', 'Серебристые металлик')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=bambukovi_zhalyuzi" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Бамбукові 25 / 50 мм', 'Бамбуковые 25 / 50 мм')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=bambukovi_zhalyuzi&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/zhaluzi?sub=bambukovi_zhalyuzi&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zhaluzi?sub=derevyani" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t("Дерев'яні 25 / 50 мм", 'Деревянные 25 / 50 мм')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zhaluzi?sub=derevyani&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('У спальню', 'В спальню')}</Link></li>
                  <li><Link href="/zhaluzi?sub=derevyani&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
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
                <span>{t('Ролети закритого типу з коробом та направляючими', 'Роллеты закрытого типа с коробом и направляющими')}</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                  {t('Преміум фіксація', 'Премиум фиксация')}
                </span>
              </h3>
              <Link
                href="/zakryta-sistema"
                onClick={onClose}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>{t('Всі закриті системи', 'Все закрытые системы')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Рулонні касетні', 'Рулонные кассетные')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema&dest=na-kuhnju" onClick={onClose} className="hover:text-blue-600">{t('На кухню', 'На кухню')}</Link></li>
                  <li><Link href="/zakryta-sistema?sub=rulonni_zakritaya_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('В спальню', 'В спальню')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Тканинні Uni', 'Тканевые Uni')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema&dest=na-balkon" onClick={onClose} className="hover:text-blue-600">{t('На балкон', 'На балкон')}</Link></li>
                  <li><Link href="/zakryta-sistema?sub=tkanina_zakritaya_sistema&dest=v-detskuju" onClick={onClose} className="hover:text-blue-600">{t('У дитячу', 'В детскую')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('День-Ніч у коробі', 'День-Ночь в коробе')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema&dest=v-gostinnuju" onClick={onClose} className="hover:text-blue-600">{t('У вітальню', 'В гостиную')}</Link></li>
                  <li><Link href="/zakryta-sistema?sub=den_nich_zakritaya_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('В спальню', 'В спальню')}</Link></li>
                </ul>
              </div>

              <div>
                <Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema" onClick={onClose} className="font-bold text-gray-900 hover:text-blue-600 block mb-2 text-base">
                  {t('Блекаут із коробом', 'Блэкаут с коробом')}
                </Link>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li><Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema&dest=v-spalnju" onClick={onClose} className="hover:text-blue-600">{t('В спальню (повна темрява)', 'В спальню (полная темнота)')}</Link></li>
                  <li><Link href="/zakryta-sistema?sub=blekaut_zakrita_sistema&dest=na-mansardu" onClick={onClose} className="hover:text-blue-600">{t('На мансарду', 'На мансарду')}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
