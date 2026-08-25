import { Product, Category, Review } from '@/types/database';

export const CATEGORIES_LIST: Category[] = [
  {
    id: 'cat-roleti',
    slug: 'roleti',
    title_ua: 'Ролети на вікна',
    description_ua: 'Тканинні ролети відкритого та закритого типу від виробника в Дніпрі',
    icon: 'RollerBlind',
    image_url: 'https://manov.com.ua/image/cache/catalog/roller-blind/rb-len-7439-800x800.jpg',
  },
  {
    id: 'cat-shtori',
    slug: 'shtori',
    title_ua: 'Рулонні та римські штори',
    description_ua: 'Штори блекаут, день-ніч та плісе для спальні, вітальні, дитячої',
    icon: 'Curtains',
    image_url: 'https://manov.com.ua/image/cache/catalog/day-night/secret-208-dn-318x480.jpg',
  },
  {
    id: 'cat-zhaluzi',
    slug: 'zhaluzi',
    title_ua: 'Жалюзи',
    description_ua: 'Горизонтальні алюмінієві, вертикальні тканинні та бамбукові жалюзі',
    icon: 'Blinds',
    image_url: 'https://manov.com.ua/image/cache/catalog/%20жалюзи%20/12%20Белые%20/900-318x480.jpg',
  },
  {
    id: 'cat-zakryta-sistema',
    slug: 'zakryta-sistema',
    title_ua: 'Закрита система',
    description_ua: 'Касетні ролети з направляючими для пластикових вікон',
    icon: 'Box',
    image_url: 'https://manov.com.ua/image/cache/catalog/roller-blind/close-system/cs-rb-len-0881-318x480.jpg',
  },
];

export const MOCK_CATEGORIES = CATEGORIES_LIST;

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_REVIEWS: Review[] = [];

export const CITIES_LIST = [
  { name: 'Дніпро', slug: 'dnipro' },
  { name: 'Київ', slug: 'kyiv' },
  { name: 'Харків', slug: 'kharkiv' },
  { name: 'Одеса', slug: 'odesa' },
  { name: 'Львів', slug: 'lviv' },
  { name: 'Запоріжжя', slug: 'zaporizhzhia' },
  { name: 'Кривий Ріг', slug: 'kryvyi-rih' },
  { name: 'Кам\'янське', slug: 'kamianske' },
  { name: 'Павлоград', slug: 'pavlohrad' },
  { name: 'Нікополь', slug: 'nikopol' },
  { name: 'Полтава', slug: 'poltava' },
  { name: 'Черкаси', slug: 'cherkasy' },
  { name: 'Вінниця', slug: 'vinnytsia' },
  { name: 'Миколаїв', slug: 'mykolaiv' },
];

export const FAQ_ITEMS = [
  {
    question: 'Як правильно заміряти вікно для замовлення ролет або жалюзі?',
    answer: 'Для відкритої системи виміряйте ширину скла з урахуванням штапиків та висоту всієї рухомої стулки. Детальна покрокова інструкція є в розділі "Замір".',
  },
  {
    question: 'Скільки часу займає виготовлення замовлення?',
    answer: 'Стандартний термін виготовлення на нашому заводі в Дніпрі становить 2-4 робочих дні з моменту підтвердження замовлення.',
  },
  {
    question: 'Якими службами здійснюється доставка по Україні?',
    answer: 'Ми відправляємо вироби Новою Поштою по всій Україні (у відділення, поштомати або кур\'єром за адресою). Всі посилки надійно упаковуються в тубуси чи захисний картон.',
  },
  {
    question: 'Чи надається гарантія на вироби та механізми?',
    answer: 'Так, на всі наші сонцезахисні системи надається офіційна гарантія виробника 12 місяців (на бамбукові та дерев\'яні жалюзі — 24 місяці).',
  },
];
