import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { KNOWLEDGE_BASE } from "../lib/ai/knowledgeBase";


import fs from 'fs';

// Read .env.local if variables are missing
let envVars: Record<string, string> = {};
try {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
  });
} catch (e) {}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY || "";
const openaiKey = process.env.OPENAI_API_KEY || envVars.OPENAI_API_KEY || "";

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error("Missing required environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY).");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

async function main() {
  console.log("Starting embedding generation...");
  
  // Clear old embeddings
  await supabase.from('zhaluzi_knowledge_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Vectorize Systems
  for (const sys of KNOWLEDGE_BASE.systems) {
    const text = `Система рулонних штор: ${sys.name}. ${sys.description}. Властивості: ${sys.priceCategory}. Порада із заміру: ${sys.measurementTip}`;
    console.log(`Vectorizing system: ${sys.name}`);
    const embedding = await generateEmbedding(text);
    
    await supabase.from('zhaluzi_knowledge_embeddings').insert({
      category: "system",
      title: sys.name,
      content: text,
      embedding,
      metadata: { original: sys },
    });
  }

  // Vectorize Fabrics
  for (const fab of KNOWLEDGE_BASE.fabrics) {
    const text = `Тканина: ${fab.name}. Властивості: ${fab.features.join(', ')}. Світлопроникність: ${fab.lightBlocking}`;
    console.log(`Vectorizing fabric: ${fab.name}`);
    const embedding = await generateEmbedding(text);
    
    await supabase.from('zhaluzi_knowledge_embeddings').insert({
      category: "fabric",
      title: fab.name,
      content: text,
      embedding,
      metadata: { original: fab },
    });
  }

  console.log("Done generating embeddings!");
}

main().catch(console.error);
