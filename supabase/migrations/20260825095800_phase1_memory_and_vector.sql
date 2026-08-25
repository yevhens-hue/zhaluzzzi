-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for Chat Session Memory
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT NOT NULL UNIQUE,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by session_token
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions(session_token);

-- Table for Knowledge Embeddings (Systems & Fabrics)
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- 'system', 'fabric', 'promotion', 'general'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Assuming OpenAI text-embedding-3-small
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for pgvector semantic search (IVFFlat or HNSW, here HNSW is better for high-dim)
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON knowledge_embeddings USING hnsw (embedding vector_cosine_ops);

-- RLS Policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow anon to read/write their own chat sessions using session_token (passed via service role or RPC)
-- For simplicity, since the API route handles this using a service key, we just allow service role.
CREATE POLICY "Allow service role full access on chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow service role full access on knowledge_embeddings" ON knowledge_embeddings FOR ALL USING (true);

-- RPC for pgvector similarity search
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  category text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.category,
    knowledge_embeddings.title,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
