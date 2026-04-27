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

// Storm Revenue Calculator custom field IDs (GHL) - Workflow Spec Aligned
const STORM_CUSTOM_FIELDS: Record<string, string> = {
  storms_last_12_months: "bPGSGQSEJQdygXJpcWXc",
  avg_jobs_closed_per_storm: "DEVCqKsgaA7PczfEfiiS",
  avg_job_ticket: "XmQfC0pM3vVe8nNyoARe",
  unclosed_leads_per_storm: "jC5rvq1zKdlOdg4Je1fd",
  follow_up_speed: "EMjSM5eavXCVaLOdFY8b",
  biggest_bottleneck: "t8yAyyTyHXK1vhjQIqka",
  revenue_captured: "PaizVlylGet2HLavdovy",
  revenue_missed: "Vj7tMhUo6YiY7tENixnB",
  speed_penalty: "iMwN0r4bwNKJdw5V0Wa1",
  annual_recovery_opportunity: "cxRKgdeXMlcylM4PZZ25",
  storm_readiness_score: "8sJuR7t5tDOkLEa43zIw",
  booking_link: "TJwoTb43hQJRwxTXugu9",
  storm_calculator_date: "9yBZMOl4q59pYeKtEyy6",
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
  // Additional fields for workflow spec alignment
  stormsLast12Months?: number;
  avgJobsClosedPerStorm?: number;
  unclosedLeadsPerStorm?: number;
  biggestBottleneck?: string;
  speedPenalty?: number;
  bookingLink?: string;
}

function buildCustomFieldValues(data: StormCalculatorData): { id: string; field_value: string | number }[] {
  // Calculate derived values for workflow spec fields
  const stormsLast12Months = data.stormsLast12Months || 3; // Default estimate
  const avgJobsClosedPerStorm = Math.round((data.monthlyLeads * (data.closeRate / 100)) / stormsLast12Months) || 10;
  const unclosedLeadsPerStorm = Math.round((data.monthlyLeads * (1 - data.closeRate / 100)) / stormsLast12Months) || 5;
  const speedPenalty = data.speedPenalty || Math.round(data.revenueGapLow * 0.3); // Speed accounts for ~30% of gap
  
  // Determine biggest bottleneck based on score components
  let biggestBottleneck = data.biggestBottleneck;
  if (!biggestBottleneck) {
    if (data.followUpSpeed.includes('24') || data.followUpSpeed.includes('hours')) {
      biggestBottleneck = 'Slow lead response';
    } else if (data.automationLevel.includes('Manual') || data.automationLevel.includes('None')) {
      biggestBottleneck = 'No automation';
    } else if (data.closeRate < 30) {
      biggestBottleneck = 'Poor close rate';
    } else {
      biggestBottleneck = 'Lead tracking';
    }
  }

  return [
    { id: STORM_CUSTOM_FIELDS.storms_last_12_months, field_value: stormsLast12Months },
    { id: STORM_CUSTOM_FIELDS.avg_jobs_closed_per_storm, field_value: avgJobsClosedPerStorm },
    { id: STORM_CUSTOM_FIELDS.avg_job_ticket, field_value: data.avgTicket },
    { id: STORM_CUSTOM_FIELDS.unclosed_leads_per_storm, field_value: unclosedLeadsPerStorm },
    { id: STORM_CUSTOM_FIELDS.follow_up_speed, field_value: data.followUpSpeed.replace(/_/g, ' ') },
    { id: STORM_CUSTOM_FIELDS.biggest_bottleneck, field_value: biggestBottleneck },
    { id: STORM_CUSTOM_FIELDS.revenue_captured, field_value: data.currentRevenue },
    { id: STORM_CUSTOM_FIELDS.revenue_missed, field_value: data.revenueGapLow },
    { id: STORM_CUSTOM_FIELDS.speed_penalty, field_value: speedPenalty },
    { id: STORM_CUSTOM_FIELDS.annual_recovery_opportunity, field_value: data.revenueGapHigh },
    { id: STORM_CUSTOM_FIELDS.storm_readiness_score, field_value: data.score },
    { id: STORM_CUSTOM_FIELDS.booking_link, field_value: data.bookingLink || 'https://calendar.razorsharpnetworks.com/storm-audit' },
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
