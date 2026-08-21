export const AI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "submitLead",
      description: "Фіксує заявку клієнта на консультацію, прорахунок або безкоштовний виїзд замірника зі зразками тканин.",
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
            description: "Місто клієнта (Київ, Дніпро, Одеса, Львів тощо)"
          },
          systemType: {
            type: "string",
            description: "Тип бажаної системи (День-Ніч, рулонні відкриті/закриті, горизонтальні, плісе, блекаут)"
          },
          requestType: {
            type: "string",
            enum: ["measurement_request", "price_calculation", "call_request", "general_consultation"],
            description: "Тип запиту: виклик замірника, прорахунок ціни, зворотній дзвінок або консультація"
          },
          details: {
            type: "string",
            description: "Додаткові деталі (розміри, кількість вікон, поверх, кімната)"
          }
        },
        required: ["phone", "requestType"]
      }
    }
  }
];
