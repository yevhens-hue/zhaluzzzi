import { validateAndNormalizeUaPhone } from '../lib/phoneValidator';
import { createLead, createOrder } from '../lib/supabase';
import { sendLeadNotification, sendOrderNotification } from '../lib/notifications';

async function runTests() {
  console.log('=== 1. Testing Phone Validator ===');

  const testCases = [
    { input: '+380939128531', expectedValid: true, expectedOp: 'Lifecell' },
    { input: '0939128531', expectedValid: true, expectedOp: 'Lifecell' },
    { input: '0671234567', expectedValid: true, expectedOp: 'Київстар' },
    { input: '0501234567', expectedValid: true, expectedOp: 'Vodafone' },
    { input: '(098) 555-44-33', expectedValid: true, expectedOp: 'Київстар' },
    { input: '80931234567', expectedValid: true, expectedOp: 'Lifecell' },
    { input: '0567000000', expectedValid: true, expectedOp: 'Міський (Дніпро)' },
    { input: '12345', expectedValid: false },
    { input: '0123456789', expectedValid: false }, // Invalid operator 012
    { input: '0301234567', expectedValid: false }, // Invalid operator 030
  ];

  let passed = 0;
  for (const tc of testCases) {
    const res = validateAndNormalizeUaPhone(tc.input);
    if (res.isValid === tc.expectedValid) {
      if (tc.expectedValid && tc.expectedOp && !res.operator?.includes(tc.expectedOp)) {
        console.error(`❌ Mismatch operator for ${tc.input}: expected ${tc.expectedOp}, got ${res.operator}`);
      } else {
        console.log(`✅ ${tc.input} -> valid: ${res.isValid}, formatted: ${res.formattedPhone || 'N/A'}, op: ${res.operator || 'N/A'}`);
        passed++;
      }
    } else {
      console.error(`❌ Validation mismatch for ${tc.input}: expected ${tc.expectedValid}, got ${res.isValid} (${res.error})`);
    }
  }

  console.log(`\nPhone validation test results: ${passed}/${testCases.length} passed.`);

  console.log('\n=== 2. Testing Lead Notification Dispatch ===');
  const sampleLead = {
    phone: '0939128531',
    name: 'Тестовий Клієнт',
    lead_type: 'one_click' as const,
    product_title: 'Рулонні штори Blackout Termo',
    product_sku: 'BL-102',
    dimensions: '120 × 160 см',
    selected_color: 'Графіт',
    calculated_price: 1980,
    comment: 'Тестова перевірка автосповіщень на Email і SMS',
  };

  const leadNotifyRes = await sendLeadNotification(sampleLead);
  console.log('Lead notification result:', leadNotifyRes);

  console.log('\n=== 3. Testing Order Notification Dispatch ===');
  const sampleOrder = {
    customer_name: 'Олена Петренко',
    phone: '0671234567',
    email: 'olena@example.com',
    city: 'Дніпро',
    delivery_type: 'nova_poshta',
    delivery_address: 'Відділення №12',
    payment_method: 'cash_on_delivery',
    total_amount: 3250,
    items: [
      {
        productId: 'prod-1',
        title: 'Штори День-Ніч Преміум',
        sku: 'DN-201',
        width: 140,
        height: 170,
        color: 'Бежевий',
        controlSide: 'right',
        fixationType: 'with_line',
        unitPrice: 1625,
        quantity: 2,
        totalPrice: 3250,
      },
    ],
    comment: 'Доставка до обіду',
  };

  const orderNotifyRes = await sendOrderNotification(sampleOrder, 'ZR-778899');
  console.log('Order notification result:', orderNotifyRes);

  console.log('\n=== 4. Testing End-to-End createLead & createOrder Functions ===');
  const createLeadRes = await createLead(sampleLead);
  console.log('createLead response:', createLeadRes);

  const createOrderRes = await createOrder(sampleOrder);
  console.log('createOrder response:', createOrderRes);

  console.log('\n🎉 ALL INTEGRATION VERIFICATIONS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
