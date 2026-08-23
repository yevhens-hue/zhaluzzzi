import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("/Users/yevhen/Жалюзи/.env")
load_dotenv("/Users/yevhen/Cursor/Тестовое/oracle-agentic-ai/.env")

SYSTEM_PROMPT = """Ти — експертний AI-консультант фабрики жалюзі та сонцезахисних систем «Жалюзи».
Твоя місія:
1. Допомогти клієнту підібрати ідеальний тип жалюзі або рулонних штор під його приміщення та бюджет.
2. Дати прості та точні інструкції із заміру вікон.
3. Ввічливо та ненав'язливо запропонувати безкоштовний виїзд замірника зі зразками тканин або розрахунок вартості за номером телефону.

КРИТИЧНО ВАЖЛИВЕ ПРАВИЛО МОВИ (LANGUAGE RULE):
- Якщо клієнт звертається РОСІЙСЬКОЮ мовою — ОБОВ'ЯЗКОВО відповідай ЧИСТОЮ РОСІЙСЬКОЮ МОВОЮ (Русский язык).
- Якщо клієнт звертається УКРАЇНСЬКОЮ мовою — відповідай УКРАЇНСЬКОЮ МОВОЮ (Українська мова).

ІНШІ ПРАВИЛА:
1. НІЯКИХ ГАЛЮЦИНАЦІЙ: Не вигадуй неіснуючі матеріали (титанові жалюзі, супутникове управління тощо).
2. КВАЛІФІКАЦІЯ ЛІДА ТА ВАЛІДАЦІЯ НОМЕРА: Викликай інструмент 'submitLead' ТІЛЬКИ якщо клієнт надав ДІЙСНИЙ повний номер телефону (не менше 9 цифр, напр. 0931234567, +380...). КАТЕГОРИЧНО ЗАБОРОНЕНО викликати 'submitLead' для коротких або недійсних номерів (напр. "12345", "093"). Якщо номер короткий — ПОПРОСИ уточнити повний 10-значний номер.
3. ЛАКОНІЧНІСТЬ: Відповідай чітко, структуровано і доброзичливо.
"""

AI_TOOLS = [
  {
    "type": "function",
    "function": {
      "name": "submitLead",
      "description": "Фіксує заявку клієнта на консультацію, прорахунок або безкоштовний виїзд замірника зі зразками тканин.",
      "parameters": {
        "type": "object",
        "properties": {
          "phone": { "type": "string", "description": "Номер телефону" },
          "name": { "type": "string", "description": "Ім'я клієнта" },
          "city": { "type": "string", "description": "Місто" },
          "requestType": { "type": "string", "enum": ["measurement_request", "price_calculation", "call_request", "general_consultation"] }
        },
        "required": ["phone", "requestType"]
      }
    }
  }
]

class ZhaluziAgentRunner:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key)

    def process_message(self, user_input: str, retrieved_context: str = "") -> dict:
        messages = [
            {"role": "system", "content": f"{SYSTEM_PROMPT}\n\nКОНТЕКСТ З КАТАЛОГУ:\n{retrieved_context}"},
            {"role": "user", "content": user_input}
        ]

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=AI_TOOLS,
            tool_choice="auto",
            temperature=0.1,
            max_tokens=500
        )

        choice = response.choices[0]
        msg = choice.message
        tool_called = False
        extracted_lead = {}

        if msg.tool_calls:
            for tc in msg.tool_calls:
                if tc.function.name == "submitLead":
                    tool_called = True
                    try:
                        extracted_lead = json.loads(tc.function.arguments)
                    except Exception:
                        pass

        return {
            "content": msg.content or "Дякуємо! Заявку зафіксовано.",
            "tool_called": tool_called,
            "extracted_lead": extracted_lead
        }
