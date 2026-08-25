export const AI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "submitLead",
      description: "Фіксує заявку клієнта на консультацію, точний прорахунок за розмірами або безкоштовний виїзд замірника зі зразками тканин.",
      parameters: {
        type: "object",
        properties: {
          phone: {
            type: "string",
            description: "Номер телефону клієнта (наприклад +380XXXXXXXXX або 0XXXXXXXXX)"
          },
          name: {
            type: "string",
            description: "Ім'я клієнта (якщо назвав)"
          },
          city: {
            type: "string",
            description: "Місто клієнта (Дніпро, Київ, Одеса, Львів тощо) або район"
          },
          orderType: {
            type: "string",
            enum: [
              "measurement_visit",
              "custom_manufacturing",
              "price_calculation",
              "call_consultation"
            ],
            description: "Тип замовлення: виїзд замірника зі зразками, виготовлення за розмірами, точний розрахунок або консультація"
          },
          systemType: {
            type: "string",
            description: "Тип бажаної системи (День-Ніч, рулонні відкриті/закриті Uni з направляючими, горизонтальні алюмінієві, вертикальні тканинні, плісе, римські, 100% Blackout)"
          },
          windowDimensions: {
            type: "string",
            description: "Розміри вікон/стулок (наприклад '120х160 см, 2 створки' або 'балконний блок')"
          },
          preferredTime: {
            type: "string",
            description: "Зручний час для дзвінка менеджера або візиту замірника (наприклад: 'сьогодні після 17:00', 'завтра у першій половині дня', 'вихідні')"
          },
          details: {
            type: "string",
            description: "Додаткові побажання (колір, рівень затемнення, поверх, кімната, потреба в монтажі)"
          }
        },
        required: ["phone", "orderType"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "calculatePrice",
      description: "Розраховує точну вартість рулонної штори або жалюзі за розмірами клієнта та типом системи. Виклич ЦЕЙ ІНСТРУМЕНТ, якщо клієнт повідомив ширину та висоту вікна/стулки в сантиметрах.",
      parameters: {
        type: "object",
        properties: {
          widthCm: {
            type: "number",
            description: "Ширина вікна/стулки в сантиметрах (наприклад 120)"
          },
          heightCm: {
            type: "number",
            description: "Висота вікна/стулки в сантиметрах (наприклад 160)"
          },
          systemType: {
            type: "string",
            enum: [
              "open-system",
              "closed-system",
              "day-night",
              "pleats",
              "aluminum-horizontal",
              "roman"
            ],
            description: "Тип системи для розрахунку: open-system (відкриті), closed-system (закриті Uni), day-night (День-Ніч), pleats (Плісе), aluminum-horizontal (Горизонтальні алюмінієві 25мм), roman (Римські)"
          },
          quantity: {
            type: "number",
            description: "Кількість однакових вікон/стулок (за замовчуванням 1)"
          },
          withLine: {
            type: "boolean",
            description: "Чи потрібна фіксація на лісці (+60 грн). За замовчуванням false."
          }
        },
        required: ["widthCm", "heightCm"]
      }
    }
  }
];

// Price calculation engine — mirrors ProductDetailView.tsx formula
const SYSTEM_PRICE_MAP: Record<string, { pricePerSqm: number; basePrice: number }> = {
  "open-system":        { pricePerSqm: 720,  basePrice: 349 },
  "closed-system":      { pricePerSqm: 980,  basePrice: 520 },
  "day-night":          { pricePerSqm: 1100, basePrice: 680 },
  "pleats":             { pricePerSqm: 1350, basePrice: 790 },
  "aluminum-horizontal":{ pricePerSqm: 850,  basePrice: 490 },
  "roman":              { pricePerSqm: 1250, basePrice: 750 },
};

export function executeTool(name: string, args: Record<string, unknown>): string {
  if (name === "calculatePrice") {
    const w = Number(args.widthCm) || 100;
    const h = Number(args.heightCm) || 150;
    const sys = (args.systemType as string) || "open-system";
    const qty = Number(args.quantity) || 1;
    const withLine = Boolean(args.withLine);

    const { pricePerSqm, basePrice } = SYSTEM_PRICE_MAP[sys] || SYSTEM_PRICE_MAP["open-system"];
    const area = Math.max(0.5, (w * h) / 10000);
    let unitPrice = Math.round(pricePerSqm * area);
    if (withLine) unitPrice += 60;
    unitPrice = Math.max(basePrice, unitPrice);
    const totalPrice = unitPrice * qty;

    const sysNames: Record<string, string> = {
      "open-system": "Рулонні штори відкриті (Міні)",
      "closed-system": "Рулонні штори закриті (Uni з направляючими)",
      "day-night": "Штори День-Ніч (Зебра)",
      "pleats": "Жалюзі Плісе",
      "aluminum-horizontal": "Горизонтальні алюмінієві жалюзі 25мм",
      "roman": "Римські штори",
    };
    const lineNote = withLine ? " + ліска" : "";
    const qtyNote = qty > 1 ? ` × ${qty} шт.` : "";

    return JSON.stringify({
      ok: true,
      systemName: sysNames[sys] || sys,
      widthCm: w,
      heightCm: h,
      unitPrice,
      totalPrice,
      qty,
      message: `💰 Розрахунок для ${sysNames[sys] || sys}${lineNote} (${w}×${h} см${qtyNote}):\n**${totalPrice.toLocaleString("uk-UA")} грн** (${qty > 1 ? `${unitPrice.toLocaleString("uk-UA")} грн × ${qty} шт.` : `за 1 шт.`})\n\n✅ Мінімальне замовлення — від ${basePrice.toLocaleString("uk-UA")} грн. Термін виготовлення: 1–3 робочих дні.\n\nЩоб замовити або уточнити — підкажіть ваш номер телефону та зручний час для дзвінка!`
    });
  }
  return JSON.stringify({ ok: false, error: "Unknown tool" });
}
