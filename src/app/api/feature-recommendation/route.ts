import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, phone, recommendation, auditUrl } = await request.json();

  const ghlToken = process.env.GHL_PRIVATE_TOKEN?.trim().replace(/\n/g, '') || '';
  const locationId = process.env.GHL_LOCATION_ID?.trim().replace(/\n/g, '') || '';
  const version = process.env.GHL_VERSION?.trim().replace(/\n/g, '') || '2021-07-28';

  console.log('GHL Feature Recommendation — locationId:', locationId, 'token prefix:', ghlToken.slice(0, 12));

  if (!ghlToken || !locationId) {
    return NextResponse.json({ ok: true, mode: 'no-ghl' });
  }

  try {
    // 1. Create/update contact
    const contactPayload: Record<string, unknown> = {
      locationId,
      firstName: (name || '').split(' ')[0] || 'Anonymous',
      lastName: (name || '').split(' ').slice(1).join(' ') || '',
      email: email || undefined,
      phone: phone || undefined,
      source: 'Storm Calculator Recommend Tab',
      tags: ['report - site - storm-calculator', 'action - recommendation - request'],
    };
    // Remove undefined fields
    Object.keys(contactPayload).forEach(k => contactPayload[k] === undefined && delete contactPayload[k]);

    console.log('Creating GHL contact with payload:', JSON.stringify(contactPayload));
    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlToken}`,
        'Version': version,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    console.log('GHL Contact API response status:', contactRes.status);
    const responseText = await contactRes.text();
    console.log('GHL Contact API response body:', responseText.slice(0, 500));

    if (contactRes.status !== 200 && contactRes.status !== 201) {
      console.error('GHL contact creation failed:', contactRes.status, responseText.slice(0, 500));
      return NextResponse.json({ ok: false, error: 'Contact creation failed', status: contactRes.status });
    }

    const contactData = JSON.parse(responseText) as Record<string, unknown>;
    const contactId = (contactData?.contact as Record<string, unknown>)?.id;

    // 2. Add note with recommendation
    if (contactId && recommendation) {
      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ghlToken}`,
          'Version': version,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: contactId,
          body: `Feature Recommendation via Storm Calculator\nAudit URL: ${auditUrl || 'unknown'}\n\n${recommendation}`,
        }),
      });
    }

    return NextResponse.json({ ok: true, contactId });
  } catch (error) {
    console.error('Feature recommendation GHL error:', error);
    return NextResponse.json({ ok: false, mode: 'ghl-error', error: error instanceof Error ? error.message : 'unknown' });
  }
}
