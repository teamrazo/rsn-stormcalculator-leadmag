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

export async function upsertStormContact(input: {
  fullName: string; email: string; phone?: string; companyName?: string;
  tagsToAdd: string[]; note: string;
}) {
  const existing = await findContactByEmail(input.email);
  if (!existing) {
    const created = await createContact(input);
    await updateContact(created.id, {
      tags: Array.from(new Set([...(created.tags || []), ...input.tagsToAdd])),
      companyName: input.companyName || undefined,
    });
    await addContactNote(created.id, input.note);
    return { contactId: created.id, created: true };
  }
  const mergedTags = Array.from(new Set([...(existing.tags || []), ...input.tagsToAdd]));
  await updateContact(existing.id, {
    email: input.email,
    tags: mergedTags,
    ...(input.companyName ? { companyName: input.companyName } : {}),
  });
  await addContactNote(existing.id, input.note);
  return { contactId: existing.id, created: false };
}
