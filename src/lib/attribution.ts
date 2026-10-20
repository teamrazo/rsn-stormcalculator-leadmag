// RSN first/last-touch attribution for GHL contacts.
// Same field keys on every RSN site, so reports work across all of them.
//
// GHL custom fields (Contact, single-line text) to create once per location:
//   first_touch_source  first_touch_medium  first_touch_campaign
//   first_touch_landing_page  first_touch_form  first_touch_date
//   last_touch_source   last_touch_medium   last_touch_campaign
//   last_touch_landing_page   last_touch_form   last_touch_date
//
// Rules: a NEW contact gets first_* and last_*; an EXISTING contact gets only
// last_* (first touch is never overwritten). Every touch also writes a note,
// so nothing is lost if the fields are not set up yet.

export type Touch = { source: string; medium: string; campaign: string; landing_page: string; referrer: string; at: string };
export type Attribution = { form: string; site: string; first: Touch; last: Touch };

const KEYS = ['source', 'medium', 'campaign', 'landing_page', 'referrer', 'at'] as const;
const s = (v: unknown, n: number) => String(v ?? '').replace(/[\x00-\x1F\x7F<>]/g, ' ').trim().slice(0, n);

function touch(input: unknown, fallback: Touch): Touch {
  if (!input || typeof input !== 'object') return fallback;
  const o = input as Record<string, unknown>;
  const t = {} as Touch;
  for (const k of KEYS) t[k] = s(o[k], k === 'landing_page' ? 300 : 120);
  if (!t.source) t.source = fallback.source;
  const d = new Date(t.at);
  t.at = isNaN(d.getTime()) ? fallback.at : d.toISOString();
  return t;
}

/** Validate browser-sent attribution; fall back to what the server knows. */
export function parseAttribution(input: unknown, form: string, site: string, pageUrl?: string): Attribution {
  const now = new Date().toISOString();
  const base: Touch = { source: 'direct', medium: 'none', campaign: '', landing_page: s(pageUrl, 300), referrer: '', at: now };
  const o = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const last = touch(o.last, base);
  const first = touch(o.first, last);
  return { form: s(form, 60), site: s(o.site || site, 120), first, last };
}

/** Attribution for a contact created by the server, e.g. a lead a partner referred. */
export function serverAttribution(form: string, site: string, source: string, medium: string, campaign: string): Attribution {
  const t: Touch = { source, medium, campaign, landing_page: '', referrer: '', at: new Date().toISOString() };
  return { form, site, first: t, last: t };
}

function fields(prefix: 'first' | 'last', t: Touch, form: string) {
  return [
    { key: `${prefix}_touch_source`, field_value: t.source },
    { key: `${prefix}_touch_medium`, field_value: t.medium },
    { key: `${prefix}_touch_campaign`, field_value: t.campaign },
    { key: `${prefix}_touch_landing_page`, field_value: t.landing_page },
    { key: `${prefix}_touch_form`, field_value: form },
    { key: `${prefix}_touch_date`, field_value: t.at.slice(0, 10) },
  ];
}

/** Custom fields for a new contact (first + last) or an existing one (last only). */
export function attributionFields(a: Attribution, isNew: boolean) {
  return [...(isNew ? fields('first', a.first, a.form) : []), ...fields('last', a.last, a.form)];
}

export function attributionNote(a: Attribution, isNew: boolean): string {
  const line = (label: string, t: Touch) =>
    `${label}: ${t.source} / ${t.medium}${t.campaign ? ` / ${t.campaign}` : ''}${t.landing_page ? ` at ${t.landing_page}` : ''}${t.referrer ? ` (from ${t.referrer})` : ''} on ${t.at.slice(0, 10)}`;
  return [
    `Attribution (${a.form} on ${a.site}):`,
    isNew ? line('First touch', a.first) : 'First touch: unchanged (existing contact)',
    line('Last touch', a.last),
  ].join('\n');
}

/**
 * Write last-touch fields onto an existing contact. Only custom fields are sent,
 * so name, email and phone are never touched.
 */
export async function updateLastTouch(base: string, headers: Record<string, string>, contactId: string, a: Attribution): Promise<boolean> {
  try {
    const r = await fetch(`${base}/contacts/${contactId}`, {
      method: 'PUT',
      headers,
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({ customFields: attributionFields(a, false) }),
    });
    if (!r.ok) console.warn(JSON.stringify({ event: 'ghl_attribution_update_failed', status: r.status }));
    return r.ok;
  } catch {
    return false;
  }
}

/**
 * Create a contact with attribution fields. If the location rejects the custom
 * fields (not created yet), retry without them so the contact is never lost.
 */
export async function createWithAttribution(
  base: string,
  headers: Record<string, string>,
  payload: Record<string, unknown>,
  a: Attribution,
): Promise<{ id: string | null; existed: boolean }> {
  const post = (body: Record<string, unknown>) =>
    fetch(`${base}/contacts/`, { method: 'POST', headers, signal: AbortSignal.timeout(8000), body: JSON.stringify(body) });
  const extra = Array.isArray(payload.customFields) ? (payload.customFields as unknown[]) : [];
  let r = await post({ ...payload, customFields: [...extra, ...attributionFields(a, true)] });
  let j = (await r.json().catch(() => ({}))) as { contact?: { id?: string }; meta?: { contactId?: string } };
  if (j?.meta?.contactId) return { id: j.meta.contactId, existed: true }; // duplicate blocked (matched by phone)
  if (!r.ok && !j?.contact?.id) {
    console.warn(JSON.stringify({ event: 'ghl_create_with_attribution_failed', status: r.status }));
    r = await post(payload);
    j = (await r.json().catch(() => ({}))) as typeof j;
    if (j?.meta?.contactId) return { id: j.meta.contactId, existed: true };
  }
  return { id: j?.contact?.id ?? null, existed: false };
}
