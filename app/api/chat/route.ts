import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/ai/prompts";
import { AI_TOOLS } from "@/lib/ai/tools";
import { createLead } from "@/lib/supabase";

import { validateAndNormalizeUaPhone } from "@/lib/phoneValidator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, cityContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
      let fallbackText = "Вітаємо! Я — AI-консультант фабрики «Жалюзи». Допоможу обрати рулонні штори або жалюзі, розрахувати вартість та зробити замір! Підкажіть, які приблизні розміри вікон вас цікавлять та чи потрібен виїзд замірника зі зразками?";
      if (lastMsg.includes("замір") || lastMsg.includes("заміряти") || lastMsg.includes("размер") || lastMsg.includes("окно")) {
        fallbackText = "📐 **Інструкція із заміру:**\n1. Ширина вимірюється по зовнішніх гранях штапика (+ 15-20 мм запасу тканини).\n2. Висота — габарит усієї створки.\n\nПідкажіть, яка у вас ширина та висота вікон, або напишіть номер телефону та зручний час — наш майстер приїде з каталогами та зробить безкоштовний точний замір!";
      } else if (lastMsg.includes("ціна") || lastMsg.includes("стоимость") || lastMsg.includes("цена") || lastMsg.includes("розрах") || lastMsg.includes("посчитай")) {
        fallbackText = "💰 **Орієнтовна вартість штор (наприклад 120х160 см):**\n- Blackout Termo: ~1 982 грн\n- День-Ніч Преміум: ~2 230 грн\n- Алюмінієві жалюзі 25мм: ~1 350 грн\n\nЩоб отримати точний розрахунок: підкажіть ваші розміри (ширина х висота) або вкажіть контактний номер і зручний час для дзвінка!";
      } else if (lastMsg.includes("час") || lastMsg.includes("время") || lastMsg.includes("майстер") || lastMsg.includes("мастер") || lastMsg.includes("виїзд") || lastMsg.includes("выезд")) {
        fallbackText = "🚗 **Виїзд замірника зі зразками:**\nМайстер привозить понад 500 зразків тканин, робить професійний замір та точний розрахунок на місці.\n\nВкажіть ваш номер телефону та зручний час (наприклад, завтра вранці або після 18:00), щоб ми забронювали візит!";
      }
      return NextResponse.json({
        role: "assistant",
        content: fallbackText
      });
    }

    const openai = new OpenAI({ apiKey });

    const systemMessage = {
      role: "system" as const,
      content: getSystemPrompt(cityContext)
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      tools: AI_TOOLS,
      tool_choice: "auto",
      temperature: 0.2,
      max_tokens: 600,
    });

    const choice = response.choices[0];
    const message = choice.message;

    // Check if AI triggered the lead submission tool
    let leadSubmitted = false;
    let leadData: any = null;

    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        if ('function' in toolCall && toolCall.function?.name === "submitLead") {
          try {
            leadData = JSON.parse(toolCall.function.arguments);
            const phoneVal = validateAndNormalizeUaPhone(leadData?.phone || '');

            // Save lead directly to database & audit log if phone is valid
            if (phoneVal.isValid && phoneVal.normalizedPhone) {
              leadSubmitted = true;
              const detailsList: string[] = [];
              if (leadData.orderType) {
                const orderTypeNames: Record<string, string> = {
                  measurement_visit: 'Виїзд замірника зі зразками (під ключ)',
                  custom_manufacturing: 'Виготовлення за розмірами (доставка)',
                  price_calculation: 'Точний розрахунок вартості',
                  call_consultation: 'Зворотній дзвінок / консультація',
                };
                detailsList.push(`Тип: ${orderTypeNames[leadData.orderType] || leadData.orderType}`);
              }
              if (leadData.systemType) detailsList.push(`Система: ${leadData.systemType}`);
              if (leadData.windowDimensions) detailsList.push(`Розміри: ${leadData.windowDimensions}`);
              if (leadData.preferredTime) detailsList.push(`Зручний час: ${leadData.preferredTime}`);
              if (leadData.city || cityContext) detailsList.push(`Місто: ${leadData.city || cityContext}`);
              if (leadData.details) detailsList.push(`Побажання: ${leadData.details}`);

              await createLead({
                phone: phoneVal.normalizedPhone,
                name: leadData.name || 'AI Chat Lead',
                comment: `AI Кваліфікатор: [${detailsList.join(' | ')}]`,
                lead_type: leadData.orderType === 'measurement_visit' ? 'measurement' : 'consultation',
              });
            } else {
              leadSubmitted = false;
            }
          } catch (e) {
            console.error("Failed to parse/save lead data:", e);
          }
        }
      }
    }

    return NextResponse.json({
      role: "assistant",
      content: message.content || "Дякуємо! Вашу заявку зафіксовано. Наш менеджер зв'яжеться з вами найближчим часом.",
      leadSubmitted,
      leadData,
    });

  } catch (error: any) {
    console.error("Error in AI Chat API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
