import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawTtn = body.ttn || body.documentNumber || '';
    const phone = (body.phone || '').replace(/[^0-9]/g, '');
    const cleanTtn = rawTtn.replace(/[^0-9]/g, '');

    if (!cleanTtn || cleanTtn.length !== 14) {
      return NextResponse.json(
        {
          success: false,
          error: 'Номер ТТН Нової Пошти має складатися рівно з 14 цифр (наприклад, 20450123456789).',
        },
        { status: 400 }
      );
    }

    // Query official Nova Poshta public JSON API
    const npResponse = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: '',
        modelName: 'TrackingDocument',
        calledMethod: 'getStatusDocuments',
        methodProperties: {
          Documents: [
            {
              DocumentNumber: cleanTtn,
              Phone: phone,
            },
          ],
        },
      }),
      cache: 'no-store',
    });

    if (!npResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Помилка зв'язку з сервером Нової Пошти (${npResponse.status}).`,
        },
        { status: 502 }
      );
    }

    const npData = await npResponse.json();

    // Check if Nova Poshta returned "Document number is not correct" or invalid TTN
    if (!npData.success || !npData.data || !npData.data[0]) {
      const isInvalidDoc = npData.errors?.some((e: string) => e.includes('Document number') || e.includes('not correct')) ||
                           npData.warnings?.some((w: string) => w.includes('Invalid DocumentNumber'));

      const msg = isInvalidDoc
        ? `Номер ТТН № ${cleanTtn} введено невірно або такого відправлення немає в базі Нової Пошти.`
        : (npData.errors?.[0] || 'Номер ТТН не знайдено в системі Нової Пошти.');

      return NextResponse.json({
        success: true,
        found: false,
        error: msg,
        data: {
          number: cleanTtn,
          status: 'Накладну не знайдено',
        },
      });
    }

    const doc = npData.data[0];
    const isNotFound = doc.StatusCode === '3' || doc.Status === 'Номер не знайдено' || doc.Status === 'Номер не знайдено!';

    return NextResponse.json({
      success: true,
      found: !isNotFound,
      data: {
        number: cleanTtn,
        statusCode: doc.StatusCode || '',
        status: doc.Status || 'Номер не знайдено',
        citySender: doc.CitySender || doc.SettlementSenderDescription || '',
        cityRecipient: doc.CityRecipient || doc.SettlementRecipientDescription || '',
        warehouseRecipient: doc.WarehouseRecipient || doc.WarehouseRecipientAddress || '',
        scheduledDeliveryDate: doc.ScheduledDeliveryDate || '',
        actualDeliveryDate: doc.ActualDeliveryDate || doc.RecipientDateTime || '',
        documentCost: doc.DocumentCost ? `${doc.DocumentCost} грн` : '',
        documentWeight: doc.DocumentWeight ? `${doc.DocumentWeight} кг` : '',
        dateCreated: doc.DateCreated || '',
        payerType: doc.PayerType || '',
        paymentStatus: doc.PaymentStatus || '',
      },
    });
  } catch (err: unknown) {
    console.error('Nova Poshta tracking error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Сталася помилка при зверненні до сервера Нової Пошти.',
      },
      { status: 500 }
    );
  }
}
