-- Migration: Add chat_analytics table for AI Consultant conversation tracking
-- Created: 2026-08-25

CREATE TABLE IF NOT EXISTS public.chat_analytics (
  id          bigserial PRIMARY KEY,
  top_question  text,
  message_count int  DEFAULT 1,
  lead_submitted boolean DEFAULT false,
  city_context  text,
  page_slug     text,
  page_title    text,
  created_at    timestamptz DEFAULT now()
);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_chat_analytics_created_at ON public.chat_analytics (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_lead ON public.chat_analytics (lead_submitted);

-- Enable RLS: only service_role can read/write (no public exposure)
ALTER TABLE public.chat_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.chat_analytics
  FOR ALL
  USING (auth.role() = 'service_role');
