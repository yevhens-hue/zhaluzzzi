import { createClient } from "@supabase/supabase-js";

export interface ChatAnalyticsPayload {
  messages: Array<{ role: string; content: string }>;
  fullContent: string;
  leadSubmitted: boolean;
  cityContext?: string;
  pageContext?: { productSlug?: string; productTitle?: string; page?: string };
}

/**
 * Saves anonymised chat analytics to Supabase for admin dashboard.
 * Non-blocking — call without awaiting if you don't need the result.
 */
export async function saveChatAnalytics(payload: ChatAnalyticsPayload): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Extract top questions for analytics (user messages only)
  const userMessages = payload.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const topQuestion = userMessages[0]?.slice(0, 200) || "";
  const messageCount = payload.messages.length;

  try {
    await supabase.from("chat_analytics").insert({
      top_question: topQuestion,
      message_count: messageCount,
      lead_submitted: payload.leadSubmitted,
      city_context: payload.cityContext || null,
      page_slug: payload.pageContext?.productSlug || payload.pageContext?.page || null,
      page_title: payload.pageContext?.productTitle || null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Table might not exist yet — non-fatal, ignore
  }
}
