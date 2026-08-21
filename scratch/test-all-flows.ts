import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnerikwvvtehclswgstb.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuZXJpa3d2dnRlaGNsc3dnc3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNDUzNzgsImV4cCI6MjEwMDYyMTM3OH0.pjB8UgzqVFR6FmALTUW5sdCt4QfypysilJeIO5N5AK8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabase() {
  console.log('--- 1. Testing Supabase Connection ---');
  console.log('URL:', SUPABASE_URL);

  // Test Orders table
  const testOrderNum = `ZR-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
  console.log('\n--- 2. Testing Order Creation Flow ---');
  const { data: orderData, error: orderErr } = await supabase.from('orders').insert([
    {
      order_number: testOrderNum,
      customer_name: 'Тестовий Клієнт',
      phone: '+380939128531',
      city: 'м. Дніпро',
      delivery_address: 'Відділення №1, просп. Дмитра Яворницького, 50',
      delivery_type: 'nova_poshta',
      payment_method: 'cash_on_delivery',
      items: [
        {
          id: '1',
          title: 'Рулонні штори Blackout Графіт',
          width: 60,
          height: 140,
          color: 'Графіт',
          unitPrice: 650,
          quantity: 2,
          totalPrice: 1300,
        },
      ],
      total_amount: 1300,
      status: 'new',
    },
  ]).select();

  if (orderErr) {
    console.error('Order creation error:', orderErr.message);
  } else {
    console.log('✓ Order created successfully in Supabase:', orderData);
  }

  // Test Lead Creation Flow
  console.log('\n--- 3. Testing Lead / 1-Click Buy Flow ---');
  const { data: leadData, error: leadErr } = await supabase.from('leads').insert([
    {
      phone: '+380935105521',
      name: 'Віктор Замовник',
      lead_type: 'one_click',
      product_title: 'Жалюзі День-Ніч Преміум',
      dimensions: '75×150 см',
      calculated_price: 1150,
      status: 'pending',
    },
  ]).select();

  if (leadErr) {
    console.error('Lead creation error:', leadErr.message);
  } else {
    console.log('✓ Lead created successfully in Supabase:', leadData);
  }

  // Test Audit Logs Flow
  console.log('\n--- 4. Testing Audit Logs Flow ---');
  const { data: logData, error: logErr } = await supabase.from('audit_logs').insert([
    {
      level: 'SUCCESS',
      action: 'SYSTEM_FLOW_TEST',
      message: 'Повний тест системи та сценаріїв замовлення завершено успішно',
      details: { test_run_at: new Date().toISOString(), status: 'PASSED' },
    },
  ]).select();

  if (logErr) {
    console.error('Log creation error (or table not created yet):', logErr.message);
  } else {
    console.log('✓ Audit log created successfully in Supabase:', logData);
  }

  // Read back orders and leads
  console.log('\n--- 5. Testing Orders & Leads Fetch for Admin Dashboard ---');
  const { data: fetchOrders, error: fetchOrdErr } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('Fetched recent orders count:', fetchOrders?.length || 0);
  if (fetchOrders && fetchOrders.length > 0) {
    console.log('Latest order sample:', fetchOrders[0].order_number, fetchOrders[0].customer_name);
  }

  const { data: fetchLeads, error: fetchLeadErr } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('Fetched recent leads count:', fetchLeads?.length || 0);
  if (fetchLeads && fetchLeads.length > 0) {
    console.log('Latest lead sample:', fetchLeads[0].phone, fetchLeads[0].lead_type);
  }
}

testDatabase().catch(console.error);
