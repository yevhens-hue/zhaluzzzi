import { NextRequest } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/ai/prompts";
import { AI_TOOLS, executeTool } from "@/lib/ai/tools";
import { createLead } from "@/lib/supabase";
import { validateAndNormalizeUaPhone } from "@/lib/phoneValidator";
import { saveChatAnalytics, saveChatSession, getVectorKnowledge } from "@/lib/ai/analytics";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function sseChunk(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, cityContext, pageContext } = body;

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Invalid messages array" }), { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // --- Fallback mode (no API key) ---
  if (!apiKey) {
    const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
    const isRu = /[ыэъё]|(как|какие|акци|скидк|номер|скольк|заказ)/i.test(lastMsg);

    let fallbackText = isRu
      ? "Здравствуйте! 👋 Я — AI-консультант фабрики «Жалюзи». Помогу выбрать рулонные шторы или жалюзи, рассчитать стоимость и оформить замер! Подскажите, какие примерные размеры окон вас интересуют?"
      : "Вітаємо! 👋 Я — AI-консультант фабрики «Жалюзи». Допоможу обрати рулонні штори або жалюзі, розрахувати вартість та зробити замір! Підкажіть, які приблизні розміри вікон вас цікавлять та чи потрібен виїзд замірника зі зразками?";

    if (lastMsg.includes("акц") || lastMsg.includes("скидк") || lastMsg.includes("знижк")) {
      fallbackText = isRu
        ? "🔥 **Актуальные акции и скидки:**\n\n1. 🎁 **Скидка на объем:** при заказе от 4-х изделий — дополнительная скидка **-7%** на весь заказ ИЛИ **бесплатная доставка** Новой Почтой!\n2. 🌑 **Роллеты Блэкаут:** спеццена от 549 грн/изделие.\n3. 🏷️ **Скидки до -25%** на популярные ткани.\n4. 📐 **Бесплатный выезд замерщика** при заказе!\n\nПодскажите ваши размеры окон, и я рассчитаю точную цену со скидкой!"
        : "🔥 **Актуальні акції та знижки:**\n\n1. 🎁 **Знижка на об'єм:** при замовленні від 4-х виробів — додаткова знижка **-7%** або **безкоштовна доставка** Новою Поштою!\n2. 🌑 **Ролети Блекаут:** спецціна від 549 грн/виріб.\n3. 🏷️ **Знижки до -25%** на популярні тканини.\n4. 📐 **Безкоштовний виїзд замірника** при замовленні!\n\nПідкажіть ваші розміри вікон, і я розрахую точну ціну зі знижкою!";
    } else if (lastMsg.includes("номер") || lastMsg.includes("телефон") || lastMsg.includes("контакт") || lastMsg.includes("связаться") || lastMsg.includes("зв'яз")) {
      fallbackText = isRu
        ? "📞 **Контакты фабрики и мастера:**\n\n- 📱 Телефон: **093 912 85 31** или **093 510 55 21** (Мастер-консультант Виктор)\n- 💬 Telegram: **@zhaluzi_dnipro** (+380939128531)\n- 💜 Viber: **+380939128531**\n- ⏰ График: Пн–Сб 08:00–20:00, Вс 09:00–18:00\n\nВы можете позвонить прямо сейчас или оставить свой номер, и мастер перезвонит вам!"
        : "📞 **Контакти фабрики та майстра:**\n\n- 📱 Телефон: **093 912 85 31** або **093 510 55 21** (Майстер-консультант Віктор)\n- 💬 Telegram: **@zhaluzi_dnipro** (+380939128531)\n- 💜 Viber: **+380939128531**\n- ⏰ Графік: Пн–Сб 08:00–20:00, Нд 09:00–18:00\n\nВи можете зателефонувати прямо зараз або залишити свій номер, і майстер зв'яжеться з вами!";
    } else if (lastMsg.includes("замір") || lastMsg.includes("заміряти") || lastMsg.includes("размер") || lastMsg.includes("окно") || lastMsg.includes("замер")) {
      fallbackText = isRu
        ? "📐 **Инструкция по замеру:**\n1. Ширина измеряется по стыкам штапика (+ 15-20 мм запаса ткани).\n2. Высота — габарит всей створки.\n\nПодскажите ширину и высоту ваших окон или оставьте номер телефона — мастер приедет с каталогами на бесплатный точный замер!"
        : "📐 **Інструкція із заміру:**\n1. Ширина вимірюється по зовнішніх гранях штапика (+ 15-20 мм запасу тканини).\n2. Висота — габарит усієї створки.\n\nПідкажіть, яка у вас ширина та висота вікон, або напишіть номер телефону та зручний час — наш майстер приїде з каталогами та зробить безкоштовний точний замір!";
    } else if (lastMsg.includes("ціна") || lastMsg.includes("стоимость") || lastMsg.includes("цена") || lastMsg.includes("розрах") || lastMsg.includes("посчитай") || lastMsg.includes("сколько")) {
      fallbackText = isRu
        ? "💰 **Ориентировочная стоимость штор (например 120х160 см):**\n- Blackout Termo: ~1 982 грн\n- День-Ночь Премиум: ~2 230 грн\n- Алюминиевые жалюзи 25мм: ~1 350 грн\n\nЧтобы получить точный расчет: подскажите ваши размеры (ширина х высота) или укажите контактный номер и удобное время для звонка!"
        : "💰 **Орієнтовна вартість штор (наприклад 120х160 см):**\n- Blackout Termo: ~1 982 грн\n- День-Ніч Преміум: ~2 230 грн\n- Алюмінієві жалюзі 25мм: ~1 350 грн\n\nЩоб отримати точний розрахунок: підкажіть ваші розміри (ширина х висота) або вкажіть контактний номер і зручний час для дзвінка!";
    }

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(sseChunk({ type: "delta", text: fallbackText }));
        controller.enqueue(sseChunk({ type: "done", leadSubmitted: false }));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    });
  }

  // --- OpenAI Streaming mode ---
  const openai = new OpenAI({ apiKey });

  // Sliding Window: Keep only the last 10 messages to save tokens.
  // We ensure we don't accidentally split a tool call and its tool response.
  let activeMessages = messages;
  if (activeMessages.length > 10) {
    activeMessages = activeMessages.slice(-10);
    while (activeMessages.length > 0 && activeMessages[0].role === "tool") {
      activeMessages.shift();
    }
  }

  // Extract keywords from the last 3 user messages for Keyword RAG
  const lastUserMessages = activeMessages
    .filter((m: any) => m.role === "user")
    .slice(-3)
    .map((m: any) => String(m.content).toLowerCase())
    .join(" ");
  const keywords = lastUserMessages.split(/[\s,.-]+/);

  // Attempt Vector RAG if configured
  let vectorContext = "";
  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: lastUserMessages.length > 3 ? lastUserMessages : "штори жалюзі",
      encoding_format: "float",
    });
    const embedding = embeddingResponse.data[0].embedding;
    vectorContext = await getVectorKnowledge(embedding);
  } catch (e) {
    console.warn("Vector RAG skipped or failed, falling back to keywords:", e);
  }

  const systemMessage = {
    role: "system" as const,
    content: getSystemPrompt(cityContext, pageContext, keywords, vectorContext)
  };

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = "";
      let leadSubmitted = false;
      let leadData: Record<string, unknown> | null = null;

      try {
        // First pass: streaming text response
        const streamResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [systemMessage, ...activeMessages],
          tools: AI_TOOLS,
          tool_choice: "auto",
          temperature: 0.2,
          max_tokens: 600,
          stream: true,
        });

        let toolCallName = "";
        let toolCallArgs = "";
        let toolCallId = "";

        for await (const chunk of streamResponse) {
          const delta = chunk.choices[0]?.delta;

          // Stream text delta to client
          if (delta?.content) {
            fullContent += delta.content;
            controller.enqueue(sseChunk({ type: "delta", text: delta.content }));
          }

          // Accumulate tool call data
          if (delta?.tool_calls?.[0]) {
            const tc = delta.tool_calls[0];
            if (tc.id) toolCallId = tc.id;
            if (tc.function?.name) toolCallName += tc.function.name;
            if (tc.function?.arguments) toolCallArgs += tc.function.arguments;
          }
        }

        // Handle calculatePrice tool — execute locally, get natural reply
        if (toolCallName === "calculatePrice" && toolCallArgs) {
          try {
            const calcArgs = JSON.parse(toolCallArgs) as Record<string, unknown>;
            const toolResult = executeTool("calculatePrice", calcArgs);
            const parsed = JSON.parse(toolResult) as { message?: string };

            // Get a natural language response incorporating the price result
            const followUp = await openai.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                systemMessage,
                ...activeMessages,
                {
                  role: "assistant" as const,
                  content: null,
                  tool_calls: [{ id: toolCallId || "call_calc", type: "function" as const, function: { name: "calculatePrice", arguments: toolCallArgs } }],
                },
                {
                  role: "tool" as const,
                  tool_call_id: toolCallId || "call_calc",
                  content: toolResult,
                },
              ],
              temperature: 0.2,
              max_tokens: 400,
              stream: true,
            });

            for await (const chunk of followUp) {
              const text = chunk.choices[0]?.delta?.content;
              if (text) {
                fullContent += text;
                controller.enqueue(sseChunk({ type: "delta", text }));
              }
            }

            // Annotate with price data for UI
            controller.enqueue(sseChunk({ type: "price_result", data: parsed }));
          } catch (e) {
            console.error("calculatePrice tool error:", e);
          }
        }

        // Handle tool call (submitLead)
        if (toolCallName === "submitLead" && toolCallArgs) {
          try {
            leadData = JSON.parse(toolCallArgs) as Record<string, unknown>;
            const ld = leadData;
            const phoneVal = validateAndNormalizeUaPhone((ld?.phone as string) || "");

            if (phoneVal.isValid && phoneVal.normalizedPhone) {
              leadSubmitted = true;
              const detailsList: string[] = [];
              const orderTypeNames: Record<string, string> = {
                measurement_visit: "Виїзд замірника зі зразками (під ключ)",
                custom_manufacturing: "Виготовлення за розмірами (доставка)",
                price_calculation: "Точний розрахунок вартості",
                call_consultation: "Зворотній дзвінок / консультація",
              };
              if (ld.orderType) detailsList.push(`Тип: ${orderTypeNames[ld.orderType as string] || ld.orderType}`);
              if (ld.systemType) detailsList.push(`Система: ${ld.systemType}`);
              if (ld.windowDimensions) detailsList.push(`Розміри: ${ld.windowDimensions}`);
              if (ld.preferredTime) detailsList.push(`Зручний час: ${ld.preferredTime}`);
              if (ld.city || cityContext) detailsList.push(`Місто: ${(ld.city as string) || cityContext}`);
              if (ld.details) detailsList.push(`Побажання: ${ld.details}`);

              await createLead({
                phone: phoneVal.normalizedPhone,
                name: (ld.name as string) || "AI Chat Lead",
                comment: `AI Кваліфікатор: [${detailsList.join(" | ")}]`,
                lead_type: ld.orderType === "measurement_visit" ? "measurement" : "consultation",
              });
            }
          } catch (e) {
            console.error("Failed to parse/save lead data:", e);
          }
        }

        // Save analytics and session history
        try {
          await saveChatAnalytics({
            messages,
            fullContent,
            leadSubmitted,
            cityContext,
            pageContext,
          });

          if (body.sessionToken) {
            // Include the newly generated assistant message
            const updatedMessages = [
              ...activeMessages,
              { role: "assistant", content: fullContent }
            ];
            await saveChatSession(body.sessionToken, updatedMessages);
          }
        } catch (e) {
          // Non-blocking — analytics failure must not break chat
          console.warn("Chat analytics/session save failed:", e);
        }

        // Send final "done" event
        controller.enqueue(sseChunk({
          type: "done",
          leadSubmitted,
          leadData,
        }));
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Streaming chat error:", errMsg);
        controller.enqueue(sseChunk({
          type: "error",
          message: "Вибачте, виникла тимчасова помилка. Спробуйте ще раз або зателефонуйте нам!",
        }));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  });
}
