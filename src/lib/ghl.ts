const BASE_URL = "https://services.leadconnectorhq.com";

function getEnv(name: string) {
  return process.env[name] || "";
}

function splitName(fullName: string) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function ghlFetch(path: string, init: RequestInit = {}) {
  const token = getEnv("GHL_PRIVATE_TOKEN");
  const version = getEnv("GHL_VERSION") || "2021-07-28";
  if (!token) throw new Error("Missing GHL_PRIVATE_TOKEN");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(10000),
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { }
  return { ok: res.ok, status: res.status, json, text };
}

export async function findContactByEmail(email: string) {
  const locationId = getEnv("GHL_LOCATION_ID");
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");
  const q = encodeURIComponent(email);
  const { ok, status, json, text } = await ghlFetch(
    `/contacts/?locationId=${locationId}&query=${q}&limit=1`,
    { method: "GET" }
  );
  if (!ok) throw new Error(`Contact lookup failed (${status}): ${text}`);
  return json?.contacts?.[0] || null;
}

export async function createContact(input: {
  fullName: string; email: string; phone?: string; companyName?: string;
}) {
  const locationId = getEnv("GHL_LOCATION_ID");
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID");
  const { firstName, lastName } = splitName(input.fullName);
  const { ok, status, json, text } = await ghlFetch(`/contacts/`, {
    method: "POST",
    body: JSON.stringify({
      locationId, firstName, lastName,
      email: input.email,
      phone: input.phone || undefined,
      companyName: input.companyName || undefined,
    }),
  });
  if (!ok) throw new Error(`Contact create failed (${status}): ${text}`);
  return json?.contact;
}

export async function updateContact(contactId: string, patch: Record<string, any>) {
  const { ok, status, json, text } = await ghlFetch(`/contacts/${contactId}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  if (!ok) throw new Error(`Contact update failed (${status}): ${text}`);
  return json?.contact;
}

export async function addContactNote(contactId: string, note: string) {
  const { ok, status, text } = await ghlFetch(`/contacts/${contactId}/notes`, {
    method: "POST",
    body: JSON.stringify({ body: note }),
  });
  if (!ok) console.warn(`Note add failed (${status}): ${text}`);
  return ok;
}

// Storm Revenue Calculator custom field IDs (GHL)
const STORM_CUSTOM_FIELDS: Record<string, string> = {
  storm_readiness_score:   "8sJuR7t5tDOkLEa43zIw",
  storm_revenue_gap_low:   "syeBzMChU6L5afVH18ih",
  storm_revenue_gap_high:  "mIdXwaUXcIMWNYAuy92k",
  storm_current_revenue:   "9VK2BjPHcNFAPSwBDjsg",
  storm_potential_revenue:  "6UWC1anZVGiLbsozlqx7",
  storm_score_tier:        "V1bbX8sw5yE7UQHnTPAa",
  storm_monthly_leads:     "nGUaSianHe4hfiAYuviy",
  storm_avg_ticket:        "L8jmOB8Wgl4EfWMlCIlh",
  storm_close_rate:        "Vc8w0DDN3SvHdj41bavj",
  storm_follow_up_speed:   "s2fR29F9PL5AjKo94tyd",
  storm_automation_level:  "E4FVC5YoywvR1aVllNTt",
  storm_tracking_method:   "6xT3YlbiXS2fNGywYRhz",
  storm_calculator_date:   "9yBZMOl4q59pYeKtEyy6",
};

export interface StormCalculatorData {
  score: number;
  revenueGapLow: number;
  revenueGapHigh: number;
  currentRevenue: number;
  potentialRevenue: number;
  scoreTier: string;
  monthlyLeads: number;
  avgTicket: number;
  closeRate: number;
  followUpSpeed: string;
  automationLevel: string;
  trackingMethod: string;
}

function buildCustomFieldValues(data: StormCalculatorData): { id: string; field_value: string | number }[] {
  return [
    { id: STORM_CUSTOM_FIELDS.storm_readiness_score, field_value: data.score },
    { id: STORM_CUSTOM_FIELDS.storm_revenue_gap_low, field_value: data.revenueGapLow },
    { id: STORM_CUSTOM_FIELDS.storm_revenue_gap_high, field_value: data.revenueGapHigh },
    { id: STORM_CUSTOM_FIELDS.storm_current_revenue, field_value: data.currentRevenue },
    { id: STORM_CUSTOM_FIELDS.storm_potential_revenue, field_value: data.potentialRevenue },
    { id: STORM_CUSTOM_FIELDS.storm_score_tier, field_value: data.scoreTier },
    { id: STORM_CUSTOM_FIELDS.storm_monthly_leads, field_value: data.monthlyLeads },
    { id: STORM_CUSTOM_FIELDS.storm_avg_ticket, field_value: data.avgTicket },
    { id: STORM_CUSTOM_FIELDS.storm_close_rate, field_value: data.closeRate },
    { id: STORM_CUSTOM_FIELDS.storm_follow_up_speed, field_value: data.followUpSpeed.replace(/_/g, ' ') },
    { id: STORM_CUSTOM_FIELDS.storm_automation_level, field_value: data.automationLevel },
    { id: STORM_CUSTOM_FIELDS.storm_tracking_method, field_value: data.trackingMethod },
    { id: STORM_CUSTOM_FIELDS.storm_calculator_date, field_value: new Date().toISOString().split('T')[0] },
  ];
}

export async function upsertStormContact(input: {
  fullName: string; email: string; phone?: string; companyName?: string;
  tagsToAdd: string[]; note: string;
  calculatorData?: StormCalculatorData;
}) {
  const existing = await findContactByEmail(input.email);

  const customFieldPayload = input.calculatorData
    ? { customFields: buildCustomFieldValues(input.calculatorData) }
    : {};

  if (!existing) {
    const created = await createContact(input);
    await updateContact(created.id, {
      tags: Array.from(new Set([...(created.tags || []), ...input.tagsToAdd])),
      companyName: input.companyName || undefined,
      ...customFieldPayload,
    });
    await addContactNote(created.id, input.note);
    return { contactId: created.id, created: true };
  }
  const mergedTags = Array.from(new Set([...(existing.tags || []), ...input.tagsToAdd]));
  await updateContact(existing.id, {
    email: input.email,
    tags: mergedTags,
    ...(input.companyName ? { companyName: input.companyName } : {}),
    ...customFieldPayload,
  });
  await addContactNote(existing.id, input.note);
  return { contactId: existing.id, created: false };
}
