import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env.local manually
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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function verify() {
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  console.log('🔍 Перевірка оновлених таблиць zhaluzi_* у Supabase...');
  console.log(`📡 URL: ${supabaseUrl}\n`);

  const tables = [
    'zhaluzi_products',
    'zhaluzi_categories',
    'zhaluzi_orders',
    'zhaluzi_leads',
    'zhaluzi_reviews',
    'zhaluzi_site_settings',
    'zhaluzi_audit_logs',
    'zhaluzi_product_analytics',
    'zhaluzi_chat_sessions',
    'zhaluzi_knowledge_embeddings',
    'zhaluzi_webhook_events'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ ${table}: ${error.message}`);
    } else {
      console.log(`✅ ${table}: існує та доступна`);
    }
  }

  // Check RPC
  try {
    const dummyVector = new Array(1536).fill(0);
    const { error } = await supabase.rpc('match_knowledge', {
      query_embedding: dummyVector,
      match_threshold: 0.1,
      match_count: 1,
    });
    if (error) {
      console.log(`❌ RPC match_knowledge: ${error.message}`);
    } else {
      console.log(`✅ RPC match_knowledge: працює коректно з zhaluzi_knowledge_embeddings`);
    }
  } catch (err: any) {
    console.log(`❌ RPC match_knowledge Exception: ${err.message}`);
  }
}

verify();
