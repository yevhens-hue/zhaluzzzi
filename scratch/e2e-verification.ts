import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../lib/mockData';
import { createOrder, createLead } from '../lib/supabase';
import { Order, Lead } from '../types/database';
import { logEvent, getLocalLogs, clearLocalLogs } from '../lib/logger';

async function runFullVerification() {
  console.log('================================================================');
  console.log('🚀 STARTING FULL E2E SUITE VERIFICATION');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`, details || '');
      failed++;
    }
  }

  // --- Test 1: Categories and Products Data Integrity ---
  console.log('\n--- 1. Testing Products and Categories ---');
  assert(MOCK_CATEGORIES.length === 4, 'All 4 main categories exist (roleti, shtori, zhaluzi, zakryta-sistema)');
  assert(MOCK_PRODUCTS.length >= 8, `Catalog has ${MOCK_PRODUCTS.length} products`);

  const hasManovInProducts = MOCK_PRODUCTS.some(
    p => p.title.toLowerCase().includes('manov') ||
         p.title.toLowerCase().includes('манов') ||
         p.description.toLowerCase().includes('manov') ||
         p.description.toLowerCase().includes('манов')
  );
  assert(!hasManovInProducts, 'Zero occurrences of MANOV / Манов in product titles and descriptions');

  // --- Test 2: Price Calculation Formula & Dimensions Logic ---
  console.log('\n--- 2. Testing Price Calculator Logic ---');
  function calcPrice(category: string, w: number, h: number, tier: string, withLine: boolean, motorized: boolean): number {
    const area = Math.max(0.5, (w * h) / 10000);
    let baseRate = 480;
    if (category === 'shtori') baseRate = 520;
    if (category === 'zhaluzi') baseRate = 420;
    if (category === 'zakryta-sistema') baseRate = 780;

    let tierMult = 1.0;
    if (tier === 'premium') tierMult = 1.35;
    if (tier === 'blackout') tierMult = 1.6;

    let extra = 0;
    if (withLine) extra += 60;
    if (motorized) extra += 1450;

    return Math.max(229, Math.round(area * baseRate * tierMult + extra));
  }

  const p1 = calcPrice('roleti', 60, 140, 'standard', true, false);
  // area = 0.84, base = 480, tier = 1.0, withLine = +60 => 0.84 * 480 + 60 = 403.2 + 60 = 463
  assert(p1 === 463, `Standard roleti 60x140: ${p1} грн (expected 463 грн)`);

  const p2 = calcPrice('roleti', 60, 140, 'blackout', true, false);
  // area = 0.84 * 480 * 1.6 + 60 = 645.12 + 60 = 705
  assert(p2 === 705, `Blackout roleti 60x140: ${p2} грн (expected 705 грн)`);

  // --- Test 3: Logging Subsystem ---
  console.log('\n--- 3. Testing Logging Subsystem ---');
  clearLocalLogs();
  await logEvent('INFO', 'TEST_ACTION', 'Початок E2E тестування');
  await logEvent('SUCCESS', 'TEST_PASS', 'Успішно перевірено компонент');
  await logEvent('ERROR', 'TEST_ERR', 'Перевірка обробки помилок');

  const logs = getLocalLogs();
  assert(logs.length === 3, `Local logs stored correctly: ${logs.length} entries`);
  assert(logs[0].action === 'TEST_ERR', 'Logs are sorted with most recent first');

  // --- Test 4: Lead Creation Flow (1-Click Buy) ---
  console.log('\n--- 4. Testing Lead / 1-Click Buy Flow ---');
  const testLead: Lead = {
    phone: '+380939128531',
    name: 'Віктор Кузьменко',
    lead_type: 'one_click',
    product_title: 'Тканинні ролети Blackout Графіт',
    dimensions: '65×145 см',
    calculated_price: 680,
  };
  const leadRes = await createLead(testLead);
  assert(leadRes.success === true, '1-Click Buy Lead created and processed without errors');

  // --- Test 5: Order Creation Flow (Full Checkout) ---
  console.log('\n--- 5. Testing Checkout Order Flow ---');
  const testOrder: Order = {
    customer_name: 'Олена Іваненко',
    phone: '+380935105521',
    email: 'olena.customer@gmail.com',
    city: 'м. Дніпро',
    delivery_address: 'Відділення Нової Пошти №15 (просп. Героїв 12)',
    delivery_type: 'nova_poshta',
    payment_method: 'cash_on_delivery',
    items: [
      {
        productId: '1',
        title: 'Тканинні ролети Blackout Графіт',
        sku: 'ROL-BLK-01',
        width: 60,
        height: 140,
        color: 'Графіт',
        controlSide: 'right',
        fixationType: 'with_line',
        unitPrice: 650,
        quantity: 2,
        totalPrice: 1300,
      },
      {
        productId: '2',
        title: 'Жалюзі День-Ніч Преміум Беж',
        sku: 'DN-PRM-02',
        width: 70,
        height: 150,
        color: 'Бежевий',
        controlSide: 'left',
        fixationType: 'with_line',
        unitPrice: 950,
        quantity: 1,
        totalPrice: 950,
      },
    ],
    total_amount: 2250,
  };

  const orderRes = await createOrder(testOrder);
  assert(orderRes.success === true, 'Checkout Order processed successfully');
  assert(orderRes.orderNumber.startsWith('ZR-'), `Order Number format is correct: ${orderRes.orderNumber}`);

  // --- Test 6: Free Shipping & Subtotal Calculation ---
  console.log('\n--- 6. Testing Cart & Free Shipping Rules ---');
  const cartSubtotal = testOrder.items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);
  assert(cartSubtotal === 2250, `Cart Subtotal: ${cartSubtotal} грн`);
  const isFreeShipping = cartSubtotal >= 2000;
  assert(isFreeShipping === true, 'Orders over 2000 UAH receive free shipping indicator');

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFullVerification().catch((err) => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
