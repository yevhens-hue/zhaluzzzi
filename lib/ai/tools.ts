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
              "measurement_visit", // Виїзд замірника зі зразками (під ключ)
              "custom_manufacturing", // Виготовлення за розмірами клієнта (доставка)
              "price_calculation", // Точний розрахунок вартості
              "call_consultation" // Зворотній дзвінок / консультація
            ],
            description: "Тип замовлення: виїзд замірника зі зразками, виготовлення за розмірами, точний розрахунок або консультація"
          },
          systemType: {
            type: "string",
            description: "Тип бажаної системи (День-Ніч, рулонні відкриті/закриті Uni з направляючими, горизонтальні алюмінієві/дерев'яні, плісе, римські, 100% Blackout)"
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
  }
];

