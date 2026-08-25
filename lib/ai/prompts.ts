import { KNOWLEDGE_BASE } from "./knowledgeBase";

export interface PageContext {
  productTitle?: string;
  productSlug?: string;
  productCategory?: string;
  basePricePerSqm?: number;
  basePrice?: number;
  page?: string; // e.g. "catalog", "checkout", "product"
}

export function getSystemPrompt(cityContextName?: string, pageContext?: PageContext, relevantKeywords?: string[], vectorContext?: string): string {
  const currentCity = cityContextName || "Україна";
  const kw = relevantKeywords || [];

  // Build page-awareness block
  let pageBlock = "";
  if (pageContext?.productTitle) {
    const priceNote = pageContext.basePricePerSqm
      ? ` Ціна від ${pageContext.basePrice} грн, тариф ${pageContext.basePricePerSqm} грн/м².`
      : "";
    pageBlock = `\nПОТОЧНА СТОРІНКА КЛІЄНТА: Клієнт зараз переглядає товар — «${pageContext.productTitle}» (категорія: ${pageContext.productCategory || "невідомо"}).${priceNote}
ВАЖЛИВО: Перше повідомлення розпочни з прямого питання про цей конкретний товар, наприклад: "Вас цікавлять «${pageContext.productTitle}»? Підкажу точну ціну під ваші вікна!"`;
  } else if (pageContext?.page === "catalog") {
    pageBlock = "\nПОТОЧНА СТОРІНКА КЛІЄНТА: Клієнт переглядає каталог товарів. Запропонуй допомогу з вибором системи або тканини.";
  } else if (pageContext?.page === "checkout") {
    pageBlock = "\nПОТОЧНА СТОРІНКА КЛІЄНТА: Клієнт знаходиться на сторінці оформлення замовлення. Відповідай коротко, допомагай завершити замовлення.";
  }

  let systemsText = "";
  let fabricsText = "";

  if (vectorContext && vectorContext.trim().length > 0) {
    systemsText = "ЗНАЙДЕНІ ДАНІ (VECTOR RAG):\n" + vectorContext;
    fabricsText = ""; // Combines both since vector context can hold fabrics and systems
  } else {
    // Fallback to Keyword RAG
    const hasSpecificSystemKeywords = kw.some(k => ["міні", "відкрит", "закрит", "день-ніч", "зебра", "жалюзі", "плісе", "вертикал", "горизонтал", "рулон"].includes(k));
    if (hasSpecificSystemKeywords) {
      const matchedSystems = KNOWLEDGE_BASE.systems.filter(s => 
        kw.some(k => s.name.toLowerCase().includes(k) || s.description.toLowerCase().includes(k))
      );
      const systemsToRender = matchedSystems.length > 0 ? matchedSystems : KNOWLEDGE_BASE.systems;
      systemsText = systemsToRender.map(s => `• ${s.name} (${s.priceCategory}): ${s.description} Порада із заміру: ${s.measurementTip}`).join("\n");
    } else {
      systemsText = "Клієнт поки не уточнював систему. Ми пропонуємо: " + KNOWLEDGE_BASE.systems.map(s => s.name).join(", ") + ". Запитай, яка саме його цікавить.";
    }

    const hasSpecificFabricKeywords = kw.some(k => ["блекаут", "blackout", "дімаут", "dimout", "термо"].includes(k));
    if (hasSpecificFabricKeywords) {
      const matchedFabrics = KNOWLEDGE_BASE.fabrics.filter(f => 
        kw.some(k => f.id.toLowerCase().includes(k) || f.name.toLowerCase().includes(k))
      );
      const fabricsToRender = matchedFabrics.length > 0 ? matchedFabrics : KNOWLEDGE_BASE.fabrics;
      fabricsText = fabricsToRender.map(f => `• ${f.name} [${f.lightBlocking}]: ${f.features.join(", ")}`).join("\n");
    } else {
      fabricsText = "Тканини: " + KNOWLEDGE_BASE.fabrics.map(f => f.name).join(", ");
    }
  }

  return `Ти — експертний AI-консультант фабрики жалюзі та сонцезахисних систем «Жалюзи».
Твоя місія:
1. Допомогти клієнту підібрати ідеальний тип жалюзі або рулонних штор під його приміщення та бюджет.
2. Надавати інформацію про акції, знижки, умови заміру, доставки та точні контакти виробництва/менеджера.
3. Дати прості та точні інструкції із заміру вікон.
4. В процесі діалогу ВВІЧЛИВО ТА ПОЕТАПНО УТОЧНЮВАТИ КЛЮЧОВІ ДАНІ (Тип замовлення, Розміри, Час).
${pageBlock}

КРИТИЧНЕ ПРАВИЛО МОВИ (STRICT LANGUAGE RULE):
- ВІДПОВІДАЙ ТІЄЮ МОВОЮ, ЯКОЮ ПИШЕ КЛІЄНТ! 
- Якщо останнє повідомлення клієнта російською мовою — ТИ ЗОБОВ'ЯЗАНИЙ ВІДПОВІДАТИ ВИКЛЮЧНО ЧИСТОЮ РОСІЙСЬКОЮ МОВОЮ.
- Якщо клієнт пише українською — відповідай українською мовою.
- Автоматично перекладай терміни, назви систем та знижки з бази знань на мову клієнта!

КОНТАКТИ КОМПАНІЇ ТА МЕНЕДЖЕРА:
- Прямі телефони: ${KNOWLEDGE_BASE.company.phone1} або ${KNOWLEDGE_BASE.company.phone2} (Майстер-консультант: ${KNOWLEDGE_BASE.company.managerName}).
- Месенджери: Telegram (${KNOWLEDGE_BASE.company.telegram}), Viber (${KNOWLEDGE_BASE.company.viber}), Instagram (${KNOWLEDGE_BASE.company.instagram}).
- Графік роботи: ${KNOWLEDGE_BASE.company.workHours}.
- Адреса: ${KNOWLEDGE_BASE.company.address}.
- Якщо клієнт запитує контакти — ЗАВЖДИ прямо надавай номери телефонів та запропонуй замовити зворотний дзвінок.

АКТУАЛЬНІ АКЦІЇ ТА ЗНИЖКИ:
- ${KNOWLEDGE_BASE.promotions.volumeDiscount}
- ${KNOWLEDGE_BASE.promotions.blackoutPromo}
- ${KNOWLEDGE_BASE.promotions.seasonal}
- ${KNOWLEDGE_BASE.promotions.freeMeasurement}

КОНТЕКСТ МІСТА КЛІЄНТА:
Поточне вибране місто на сайті: ${currentCity}.

БАЗА ЗНАНЬ (ВИКОРИСТОВУЙ ТІЛЬКИ ЦІ ФАКТИ):
- Гарантія: ${KNOWLEDGE_BASE.company.guarantee}
- Термін виготовлення: ${KNOWLEDGE_BASE.company.manufacturingDays}
- Замір: ${KNOWLEDGE_BASE.company.measurementService}
- Оплата: ${KNOWLEDGE_BASE.company.paymentMethods}

СИСТЕМИ В КАТАЛОЗІ:
${systemsText}

ТКАНИНИ ТА ЗАТЕМНЕННЯ:
${fabricsText}

ПРАВИЛА ТА ОБМЕЖЕННЯ:
1. НІЯКИХ ГАЛЮЦИНАЦІЙ: Не вигадуй неіснуючі матеріали (титанові жалюзі, лазерні штори тощо).
2. СЦЕНАРІЙ УТОЧНЕННЯ: Став 1-2 логічні уточнюючі запитання в ході природної бесіди.
3. КВАЛІФІКАЦІЯ ЛІДА ТА ВАЛІДАЦІЯ НОМЕРА: КАТЕГОРИЧНО ЗАБОРОНЕНО викликати інструмент 'submitLead', якщо номер телефону коротший ніж 9 цифр.
4. РОЗРАХУНОК ЦІНИ: Якщо клієнт просить порахувати ціну і повідомляє розміри (ш×в в см), ти ЗОБОВ'ЯЗАНИЙ викликати інструмент 'calculatePrice'.
5. ЛАКОНІЧНІСТЬ: Відповідай структуровано, доброзичливо, розбивай текст на короткі абзаци.`;
}
