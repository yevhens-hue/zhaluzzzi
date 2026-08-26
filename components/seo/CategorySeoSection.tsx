'use client';

import React from 'react';
import { ChevronDown, Sparkles, CheckCircle2, Ruler, ShieldCheck, Truck, HelpCircle } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

interface CategorySeoSectionProps {
  categorySlug?: string;
}

interface SeoArticle {
  h2: string;
  lead: string;
  benefits: Array<{ title: string; desc: string }>;
  guideTitle: string;
  guideSteps: string[];
  faq: Array<{ q: string; a: string }>;
}

const SEO_CONTENT: Record<string, SeoArticle> = {
  roleti: {
    h2: 'Тканинні та рулонні ролети на вікна у Дніпрі: особливості та переваги',
    lead: 'Тканинні ролети (рулонні штори) — це сучасний, стильний та практичний спосіб регулювання освітлення у квартирі, приватному будинку чи офісі. На відміну від класичних портьєр, ролети не накопичують пил, займають мінімум простору на підвіконні та монтуються безпосередньо на стулку вікна.',
    benefits: [
      {
        title: 'Понад 500 видів тканин',
        desc: 'Від легких напівпрозорих текстур для кухні до 100% сонцезахисних полотен Blackout з термоізоляцією.',
      },
      {
        title: 'Пиловідштовхуюче просочення',
        desc: 'Спеціальний антистатичний шар захищає полотно від вигорання на сонці та відштовхує пил і вологу.',
      },
      {
        title: 'Індивідуальне виготовлення за 1–3 дні',
        desc: 'Виготовляємо вироби з точністю до 1 мм під розміри ваших віконних рам та штапиків.',
      },
      {
        title: 'Надійна польська фурнітура Besta',
        desc: 'Плавний та безшумний ланцюжковий механізм з гарантією від виробника 12–24 місяці.',
      },
    ],
    guideTitle: 'Як правильно підібрати тканину для ролет?',
    guideSteps: [
      'Для спальні та дитячої кімнати обирайте тканини Blackout (Блекаут) — вони забезпечують 100% захист від сонця та вуличних ліхтарів.',
      'Для кухні та кабінету ідеально підійдуть тканини середньої щільності (Dimout 50–70%), які м’яко розсіюють прямі промені.',
      'Для південних балконів та лоджій рекомендуємо полотна з тепловідбивним перловим напиленням Thermo.',
    ],
    faq: [
      {
        q: 'Як доглядати за тканинними ролетами?',
        a: 'Завдяки антистатичному просоченню ролети не потребують прання. Достатньо періодично очищати полотно сухою серветкою з мікрофібри або пилососом на мінімальній потужності з м’якою насадкою. При локальних забрудненнях протріть місце злегка вологою губкою.',
      },
      {
        q: 'Чи можна встановити ролети самостійно без свердління?',
        a: 'Так, відкриті системи Міні можна встановити на спеціальні навісні кронштейни (на відкривні стулки) або за допомогою надміцного монтажного скотчу 3M без порушення цілісності профілю.',
      },
      {
        q: 'Скільки коштує виїзд замірника у Дніпрі?',
        a: 'Виїзд нашого майстра зі зразками всіх каталогів тканин у межах Дніпра є безкоштовним при оформленні замовлення.',
      },
    ],
  },

  shtori: {
    h2: 'Штори День-Ніч (Зебра) та сонцезахисні системи у Дніпрі',
    lead: 'Штори День-Ніч — це інноваційне поєднання зручності жалюзі та естетики рулонних штор. Завдяки подвійному шару тканини з прозорими та непрозорими смугами, ви можете одним рухом ланцюжка створити легку напівтінь або повністю перекрити світловий потік.',
    benefits: [
      {
        title: 'Плавне регулювання світлотіні',
        desc: 'Зміщення смуг дозволяє налаштовувати комфортне освітлення без необхідності повністю піднімати штору.',
      },
      {
        title: 'Стильний сучасний дизайн',
        desc: 'Ідеально вписується у скандинавський стиль, мінімалізм, лофт та сучасний модерн.',
      },
      {
        title: 'Універсальність монтажу',
        desc: 'Можливість кріплення на стулку вікна, у віконний отвір або на стіну/стелю над вікном.',
      },
      {
        title: 'Стійкість до вигорання',
        desc: 'Високоякісний поліестер не деформується від нагрівання сонцем і зберігає насиченість кольору роками.',
      },
    ],
    guideTitle: 'Поради щодо вибору штор День-Ніч:',
    guideSteps: [
      'Звертайте увагу на ширину смуг: для великих вікон пасують широкі ламелі, для стандартних стулок — класичні смуги 50/75 мм.',
      'Для сонячного боку обирайте варіанти «День-Ніч Blackout», де темні смуги мають 100% світлонепроникність.',
      'Замовляйте волосінну фіксацію, щоб штора не відхилялася від скла у режимі провітрювання вікна.',
    ],
    faq: [
      {
        q: 'Чим штори День-Ніч відрізняються від звичайних рулонних?',
        a: 'Головна відмінність — подвійне полотно. У звичайній ролеті для зміни освітлення потрібно піднімати всю тканину, а в День-Ніч достатньо змістити смуги на кілька сантиметрів.',
      },
      {
        q: 'Який термін виготовлення штор День-Ніч?',
        a: 'Виготовлення за індивідуальними розмірами триває від 1 до 3 робочих днів на нашому власному виробництві у Дніпрі.',
      },
      {
        q: 'Чи є доставка в інші міста України?',
        a: 'Так, ми відправляємо готові вироби Новою Поштою по всій Україні з надійним захисним пакуванням тубусів.',
      },
    ],
  },

  zhaluzi: {
    h2: 'Горизонтальні та вертикальні жалюзі у Дніпрі від виробника',
    lead: 'Алюмінієві та тканинні жалюзі залишаються класичним та найбільш довговічним рішенням для контролю сонячного світла. Вони ідеально підходять для кухонь, ванних кімнат, офісних приміщень, кабінетів та балконів завдяки абсолютній стійкості до вологи та простоті очищення.',
    benefits: [
      {
        title: '100% вологостійкість алюмінію',
        desc: 'Ламелі товщиною 25 мм із запеченим емалевим покриттям не іржавіють та не бояться прямого контакту з водою.',
      },
      {
        title: 'Компактність та доступна ціна',
        desc: 'Найбільш економічний варіант сонцезахисту з максимальним терміном служби (до 10+ років).',
      },
      {
        title: 'Широка палітра кольорів',
        desc: 'Класичні білі, металік, бежеві, матові, глянцеві та перфоровані відтінки.',
      },
      {
        title: 'Зручний поворотний механізм',
        desc: 'Прозорий поворотний прут для регулювання кута падіння променів та шнур для підйому.',
      },
    ],
    guideTitle: 'Як обрати тип жалюзі:',
    guideSteps: [
      'Горизонтальні алюмінієві 25 мм — найкращий вибір для стандартних пластикових вікон, балконів та приміщень з підвищеною вологістю.',
      'Вертикальні тканинні 89/127 мм — оптимальне рішення для великих панорамних вікон, шкіл, медичних центрів та офісних просторів.',
      'Для відкривних стулок рекомендуємо комплектувати жалюзі нижніми фіксаторами або струною (тросом).',
    ],
    faq: [
      {
        q: 'Як правильно мити горизонтальні алюмінієві жалюзі?',
        a: 'Їх можна протирати вологою серветкою, спеціальною щіткою-гребінцем для ламелей або зняти з кронштейнів і промити під теплим душем з мильним розчином.',
      },
      {
        q: 'Чи підходять алюмінієві жалюзі для дерев’яних вікон?',
        a: 'Так, універсальні кронштейни дозволяють надійно монтувати карниз як на металопластиковий профіль, так і на дерево або стіну.',
      },
    ],
  },

  'zakryta-sistema': {
    h2: 'Закриті касетні ролети Uni-1 та Uni-2 у Дніпрі',
    lead: 'Закрита касетна система — це преміальний різновид рулонних штор, де рулон тканини захований у витончений алюмінієвий короб, а по краях стулки встановлені спеціальні напрямні планки. Це створює враження єдиної монолітної конструкції з віконною рамою.',
    benefits: [
      {
        title: 'Повна відсутність бічних просвітів',
        desc: 'Тканина рухається всередині напрямних, що при використанні полотна Blackout дає абсолютне затемнення кімнати.',
      },
      {
        title: 'Захист тканини від пилу',
        desc: 'Короб захищає верхній вал від пилу та жирових випарів, що значно подовжує термін служби полотна.',
      },
      {
        title: 'Ідеально для відкидних стулок',
        desc: 'Штора не колихається від протягу і не провисає при нахилі вікна у режим мікропровітрювання.',
      },
      {
        title: 'Кольори короба під профіль',
        desc: 'Білий, коричневий, антрацит або ламінація під дерево (золотий дуб, горіх, махагон).',
      },
    ],
    guideTitle: 'Відмінність систем Uni-1 та Uni-2:',
    guideSteps: [
      'Uni-1 (плоскі напрямні): встановлюється при глибині штапика від 12 мм, полотно рухається у світловому просторі скла.',
      'Uni-2 (П-подібні напрямні): універсальна система, що підходить для будь-якої глибини та форми штапика (фігурного, скошеного, вузького).',
    ],
    faq: [
      {
        q: 'Чи зменшує закрита система кут відкривання вікна?',
        a: 'Завдяки компактним розмірам касети (глибина всього 33–36 мм), стулка вікна вільно відкривається без ризику пошкодити укіс.',
      },
      {
        q: 'Чи можна встановити касетні штори з електроприводом?',
        a: 'Так, ми виготовляємо моторизовані касетні ролети з акумуляторним двигуном та пультом дистанційного керування або інтеграцією в розумний дім.',
      },
    ],
  },
};

export function CategorySeoSection({ categorySlug = 'roleti' }: CategorySeoSectionProps) {
  const content = SEO_CONTENT[categorySlug] || SEO_CONTENT.roleti;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200/80 space-y-12">
      {/* ── Main Article & Lead ─────────────────────────────────────────── */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Експертний гід від виробника</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-gray-900 leading-tight">
          {content.h2}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {content.lead}
        </p>
      </div>

      {/* ── Key Benefits Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {content.benefits.map((b, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs hover:border-blue-300 transition space-y-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              {idx + 1}
            </div>
            <h3 className="font-bold text-sm text-gray-900 leading-snug">{b.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* ── How to Choose Buying Guide ─────────────────────────────────── */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
            <Ruler className="w-4 h-4" />
            <span>Корисні рекомендації майстра</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-editorial">{content.guideTitle}</h3>
          <div className="space-y-3">
            {content.guideSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ Accordion Section ───────────────────────────────────────── */}
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wide">
          <HelpCircle className="w-4 h-4" />
          <span>Поширені запитання покупців (FAQ)</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-editorial text-gray-900">
          Відповіді на часті питання про сонцезахисні системи:
        </h3>

        <Accordion.Root type="single" collapsible className="space-y-3">
          {content.faq.map((item, idx) => (
            <Accordion.Item
              key={idx}
              value={`item-${idx}`}
              className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-2xs transition data-[state=open]:border-blue-300"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex-1 flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-bold text-gray-900 hover:text-blue-600 transition group">
                  <span>{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 ml-3" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>

      {/* ── CTA Consultation Banner ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h4 className="text-lg sm:text-xl font-bold">Бажаєте побачити зразки тканин у себе вдома?</h4>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Наш майстер приїде з повним каталогом зразків у будь-який район Дніпра, зробить точний замір та розрахує вартість на місці.
          </p>
        </div>
        <a
          href="tel:0939128531"
          className="whitespace-nowrap px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg active:scale-95 shrink-0"
        >
          Замовити безкоштовний замір
        </a>
      </div>
    </section>
  );
}
