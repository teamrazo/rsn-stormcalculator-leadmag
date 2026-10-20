// RSN canonical drawer submission (Support + Recommend).
// Mirrors portal.gitlever.ai api/support-ticket + api/feature-recommendation:
//   1. validate input (all fields required, valid email, E.164 phone)
//   2. create GHL contact with RSN v3.0 tags + notify tag
//   3. write a contact note with the message and page URL
//   4. trigger the Support_Recommend_Drawer workflow explicitly
//   5. post a Slack notification (fails open)
// GHL and Slack steps never block the response. No secrets or PII are logged.

import { NextResponse } from 'next/server';
import { enforceMaxBody, enforceOriginAllowlist, enforceRateLimit, isValidEmail } from '@/lib/api-helpers';
import { NOTIFY_TAGS, sendSlackNotification, triggerGHLWorkflow } from '@/lib/notifications';

const PROPERTY_SLUG = 'storm-calculator';
const GHL_BASE = 'https://services.leadconnectorhq.com';

export type DrawerKind = 'support' | 'recommend';

const CONFIG: Record<DrawerKind, {
  route: string;
  messageKey: 'message' | 'recommendation';
  source: string;
  tags: string[];
  customFieldKey: string;
  noteTitle: string;
  slackTitle: string;
}> = {
  support: {
    route: 'support-ticket',
    messageKey: 'message',
    source: 'Storm Calculator Support Tab',
    tags: [`report - site - ${PROPERTY_SLUG}`, 'action - support - request', NOTIFY_TAGS.supportRequest],
    customFieldKey: 'support_message',
    noteTitle: 'Support Request via Storm Calculator',
    slackTitle: 'Support Request: Storm Calculator',
  },
  recommend: {
    route: 'feature-recommendation',
    messageKey: 'recommendation',
    source: 'Storm Calculator Recommend Tab',
    tags: [`report - site - ${PROPERTY_SLUG}`, 'action - recommendation - request', NOTIFY_TAGS.featureRequest],
    customFieldKey: 'feature_recommendation',
    noteTitle: 'Feature Recommendation via Storm Calculator',
    slackTitle: 'Feature Recommendation: Storm Calculator',
  },
};

function normalizePhone(input: unknown): string | null {
  const digits = String(input || '').replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.charAt(0) === '1') return '+' + digits;
  return null;
}

function env(name: string): string {
  return (process.env[name] || '').trim().replace(/\r?\n/g, '');
}

export async function handleDrawerSubmit(request: Request, kind: DrawerKind): Promise<NextResponse> {
  const cfg = CONFIG[kind];

  const blocked =
    enforceOriginAllowlist(request) ||
    enforceMaxBody(request, 16 * 1024) ||
    (await enforceRateLimit(request, { route: cfg.route, perMinute: 5 }));
  if (blocked) return blocked;

  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === 'object') body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const name = String(body.name || '').trim().slice(0, 200);
  const email = String(body.email || '').trim().slice(0, 250);
  const message = String(body[cfg.messageKey] || '').trim();
  const pageUrl = String(body.auditUrl || body.pageUrl || '').trim().slice(0, 500);

  if (!name || !email || !body.phone || !message) {
    return NextResponse.json({ ok: false, error: 'All fields required' }, { status: 400 });
  }
  if (!isValidEmail(email)) return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  const phone = normalizePhone(body.phone);
  if (!phone) return NextResponse.json({ ok: false, error: 'Invalid phone' }, { status: 400 });
  if (message.length > 5000) return NextResponse.json({ ok: false, error: 'Message too long' }, { status: 400 });

  const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const slack = () =>
    sendSlackNotification({
      title: cfg.slackTitle,
      fields: [
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
        ['Page', pageUrl || 'unknown'],
        [kind === 'support' ? 'Message' : 'Recommendation', message],
        ['Submitted', submittedAt],
      ],
    }).catch(() => 0);

  const ghlToken = env('GHL_PRIVATE_TOKEN');
  const locationId = env('GHL_LOCATION_ID');
  const version = env('GHL_VERSION') || '2021-07-28';

  if (!ghlToken || !locationId) {
    await slack();
    return NextResponse.json({ ok: true, mode: 'no-ghl' });
  }

  let contactId: string | null = null;
  try {
    const parts = name.split(/\s+/);
    const contactRes = await fetch(`${GHL_BASE}/contacts/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ghlToken}`, Version: version, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId,
        firstName: parts[0] || 'Anonymous',
        lastName: parts.slice(1).join(' '),
        email,
        phone,
        source: cfg.source,
        tags: cfg.tags,
        customFields: [{ key: cfg.customFieldKey, field_value: message }],
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await contactRes.json().catch(() => ({}))) as { contact?: { id?: string } };
    contactId = data?.contact?.id || null;

    if (!contactRes.ok) {
      console.warn(JSON.stringify({ event: 'ghl_contact_failed', route: cfg.route, status: contactRes.status }));
    }

    if (contactId) {
      const note = [cfg.noteTitle, `Page: ${pageUrl || 'unknown'}`, '', message, '', `Submitted: ${submittedAt}`].join('\n');
      await Promise.allSettled([
        fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${ghlToken}`, Version: version, 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: note }),
          signal: AbortSignal.timeout(5000),
        }),
        triggerGHLWorkflow(contactId, ghlToken, version),
      ]);
    }
  } catch (err) {
    console.warn(JSON.stringify({ event: 'ghl_error', route: cfg.route, error: err instanceof Error ? err.message : 'unknown' }));
  }

  // Slack always fires, matching the portal, so a GHL outage never hides a request.
  await slack();

  return NextResponse.json({ ok: true, contactId });
}
