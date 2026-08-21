import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSystemPrompt } from "@/lib/ai/prompts";
import { AI_TOOLS } from "@/lib/ai/tools";
import { createLead } from "@/lib/supabase";

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
      return NextResponse.json({
        role: "assistant",
        content: "Вітаємо! Наразі AI-консультант працює у тестовому режимі. Залиште, будь ласка, ваш номер через форму зворотного зв'язку, і наш менеджер зателефонує вам протягом 5 хвилин!"
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
          leadSubmitted = true;
          try {
            leadData = JSON.parse(toolCall.function.arguments);
            // Save lead directly to database & audit log
            if (leadData && leadData.phone) {
              await createLead({
                phone: leadData.phone,
                name: leadData.name || 'AI Chat Lead',
                comment: `AI Кваліфікатор: [${leadData.requestType || 'консультація'}] Місто: ${leadData.city || cityContext || 'Україна'}. Система: ${leadData.systemType || 'Не вказано'}. ${leadData.details || ''}`,
                lead_type: 'consultation',
              });
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
