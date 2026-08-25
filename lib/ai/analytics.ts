import { createClient } from "@supabase/supabase-js";

export interface ChatAnalyticsPayload {
  messages: Array<{ role: string; content: string }>;
  fullContent: string;
  leadSubmitted: boolean;
  cityContext?: string;
  pageContext?: { productSlug?: string; productTitle?: string; page?: string };
}

export function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Saves anonymised chat analytics to Supabase for admin dashboard.
 * Non-blocking — call without awaiting if you don't need the result.
 */
export async function saveChatAnalytics(payload: ChatAnalyticsPayload): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;

  // Extract top questions for analytics (user messages only)
  const userMessages = payload.messages
    .filter((m) => m.role === "user")
    .map((m) => m.content);

  const topQuestion = userMessages[0]?.slice(0, 200) || "";
  const messageCount = payload.messages.length;

  try {
    await supabase.from('zhaluzi_chat_analytics').insert({
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

/**
 * Saves chat history for cross-session memory
 */
export async function saveChatSession(sessionToken: string, messages: any[]): Promise<void> {
  const supabase = getServiceSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('zhaluzi_chat_sessions').upsert({
      session_token: sessionToken,
      messages: JSON.stringify(messages),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'session_token' });
    
    if (error) console.error("Error saving chat session:", error.message);
  } catch (err) {
    console.error("saveChatSession error", err);
  }
}

/**
 * Gets chat history for cross-session memory
 */
export async function getChatSession(sessionToken: string): Promise<any[] | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('zhaluzi_chat_sessions')
      .select('messages')
      .eq('session_token', sessionToken)
      .single();
      
    if (error || !data) return null;
    return typeof data.messages === 'string' ? JSON.parse(data.messages) : data.messages;
  } catch (err) {
    console.error("getChatSession error", err);
    return null;
  }
}

export async function getVectorKnowledge(embedding: number[]): Promise<string> {
  const supabase = getServiceSupabase();
  if (!supabase) return "";
  try {
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.3, // Lowered for general matches
      match_count: 5
    });
    
    if (error || !data) return "";
    return data.map((d: any) => d.content).join("\n");
  } catch (err) {
    console.error("getVectorKnowledge error", err);
    return "";
  }
}
