import { sanitizeForLog } from "@/lib/api-helpers";

export const NOTIFY_TAGS = {
  newLead: "notify:new-lead",
  newCustomer: "notify:new-customer",
  supportRequest: "notify:support-request",
  featureRequest: "notify:feature-request",
  auditSubmitted: "notify:audit-submitted",
};

export interface SlackPayload {
  title: string;
  fields: [string, string | number | boolean | null | undefined][];
  footer?: string;
}

export async function sendSlackNotification(payload: SlackPayload): Promise<number> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  if (!webhookUrl) return 0;
  const lines: string[] = [`*${sanitizeForLog(payload.title, 200)}*`, ""];
  for (const [label, raw] of payload.fields) {
    if (raw === null || raw === undefined || raw === "" || raw === false) continue;
    lines.push(`*${sanitizeForLog(label, 80)}:* ${sanitizeForLog(String(raw), 500)}`);
  }
  if (payload.footer) { lines.push(""); lines.push(sanitizeForLog(payload.footer, 500)); }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
      signal: AbortSignal.timeout(3000),
    });
    return res.status;
  } catch { return 0; }
}

// ─── GHL workflow trigger ─────────────────────────────────────────────────
//
// Support + Recommend drawers both feed the shared GHL workflow
// "2.0->Support_Recommend_Drawer->Notification" via a "Contact Tag
// Applied" trigger. Tag-trigger automations are fragile (one GHL UI
// misconfiguration silently breaks them), so — matching the proven
// portal.gitlever.ai pattern — we also call the workflow-trigger API
// explicitly right after contact creation instead of relying on the tag
// alone. Fails open: never throws, never blocks the form response.
export const SUPPORT_RECOMMEND_WORKFLOW_ID = '4040ddd5-47ea-4fa3-b0ba-a6dd2b4c4bd5';

export async function triggerGHLWorkflow(
  contactId: string,
  ghlToken: string,
  version: string,
  workflowId: string = SUPPORT_RECOMMEND_WORKFLOW_ID
): Promise<void> {
  try {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const eventStartTime =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      `T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}+00:00`;
    const res = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${workflowId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ghlToken}`,
          Version: version,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventStartTime }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) {
      console.warn(JSON.stringify({ event: 'ghl_workflow_trigger_failed', status: res.status, workflowId }));
    }
  } catch (err) {
    console.warn(JSON.stringify({ event: 'ghl_workflow_trigger_error', error: err instanceof Error ? err.message : String(err), workflowId }));
  }
}
