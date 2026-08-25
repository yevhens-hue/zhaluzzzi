import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_REVIEWS } from './seed_data';

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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function seed() {
  console.log('🌱 Запуск сідування бази даних (відновлення тестових товарів)...');

  // 1. Seed Categories
  if (MOCK_CATEGORIES && MOCK_CATEGORIES.length > 0) {
    console.log(`Завантажуємо ${MOCK_CATEGORIES.length} категорій...`);
    const { error } = await supabase.from('zhaluzi_categories').upsert(MOCK_CATEGORIES);
    if (error) console.error('❌ Помилка категорій:', error.message);
    else console.log('✅ Категорії успішно завантажено!');
  }

  // 2. Seed Products
  if (MOCK_PRODUCTS && MOCK_PRODUCTS.length > 0) {
    console.log(`Завантажуємо ${MOCK_PRODUCTS.length} товарів...`);
    
    // We might need to ensure products have valid categories or clean up their structure if it doesn't match the DB completely,
    // but upsert should handle standard JSON matching.
    const { error } = await supabase.from('zhaluzi_products').upsert(MOCK_PRODUCTS);
    
    if (error) console.error('❌ Помилка товарів:', error.message);
    else console.log('✅ Товари успішно завантажено!');
  }

  // 3. Seed Reviews
  if (MOCK_REVIEWS && MOCK_REVIEWS.length > 0) {
    console.log(`Завантажуємо ${MOCK_REVIEWS.length} відгуків...`);
    // Ensure all reviews have proper structure for DB
    const reviewsToInsert = MOCK_REVIEWS.map(r => ({
      ...r,
      // Just in case it has extra properties
    }));
    const { error } = await supabase.from('zhaluzi_reviews').upsert(reviewsToInsert);
    if (error) console.error('❌ Помилка відгуків:', error.message);
    else console.log('✅ Відгуки успішно завантажено!');
  }

  console.log('✅ Сідування бази даних завершено!');
}

seed();
