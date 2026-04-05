import { NextRequest, NextResponse } from "next/server";
import { upsertStormContact } from "@/lib/ghl";

export const dynamic = "force-dynamic";

// Rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function buildGhlNote(params: {
  name: string; email: string; company: string; phone: string;
  answers: Record<string, any>;
  score: number; revenueGapLow: number; revenueGapHigh: number;
  currentRevenue: number; potentialRevenue: number;
  weakAreas: string[];
  submittedAt: string;
}): string {
  const { name, email, company, phone, answers, score,
    revenueGapLow, revenueGapHigh, currentRevenue, potentialRevenue,
    weakAreas, submittedAt } = params;

  const fmtCurrency = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : `$${n.toLocaleString()}`;

  return [
    `🌩️ STORM REVENUE RECOVERY CALCULATOR — SUBMISSION`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Company:  ${company || "N/A"}`,
    `Phone:    ${phone || "N/A"}`,
    `Date:     ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`,
    ``,
    `STORM READINESS SCORE: ${score}/100`,
    ``,
    `REVENUE GAP: ${fmtCurrency(revenueGapLow)} – ${fmtCurrency(revenueGapHigh)} annually`,
    `Current Estimated Revenue: ${fmtCurrency(currentRevenue)}`,
    `Potential With Systems:    ${fmtCurrency(potentialRevenue)}`,
    ``,
    `ANSWERS:`,
    `  Monthly Leads:    ${answers.monthly_leads}`,
    `  Avg Ticket:       $${Number(answers.avg_ticket).toLocaleString()}`,
    `  Close Rate:       ${answers.close_rate}%`,
    `  Follow-Up Speed:  ${String(answers.follow_up_speed).replace(/_/g, ' ')}`,
    `  Automation:       ${answers.automation}`,
    `  Tracking:         ${answers.tracking}`,
    ``,
    `WEAK AREAS: ${weakAreas.join(', ') || 'None identified'}`,
    ``,
    `Source: stormcalculator.razorsharpnetworks.com`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, company, phone, answers, score, revenueGapLow, revenueGapHigh, currentRevenue, potentialRevenue, weakAreas } = body;

    if (!name || !email || !answers) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const submittedAt = new Date().toISOString();

    console.log(`[storm-calc] ${name} | ${email} | score=${score}/100 | gap=$${revenueGapLow}-$${revenueGapHigh}`);

    // GHL sync
    const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
    let ghlContactId: string | null = null;
    let ghlCreated = false;

    if (GHL_ENABLED) {
      try {
        const note = buildGhlNote({ name, email, company, phone, answers, score, revenueGapLow, revenueGapHigh, currentRevenue, potentialRevenue, weakAreas: weakAreas || [], submittedAt });

        const scoreTag = score >= 70 ? "Strong" : score >= 40 ? "Needs Work" : "Critical";

        const result = await upsertStormContact({
          fullName: name,
          email: email.trim().toLowerCase(),
          phone: phone || undefined,
          companyName: company || undefined,
          tagsToAdd: [
            "Activity - Calculator - Storm Revenue Calculator Complete",
            "Status - Lead - Storm Calculator",
            `Storm Score - ${scoreTag}`,
            "Industry - Storm Restoration",
          ],
          note,
        });

        ghlContactId = result.contactId;
        ghlCreated = result.created;
        console.log(`[storm-calc] GHL ${ghlCreated ? "created" : "updated"} contact: ${ghlContactId}`);
      } catch (ghlErr) {
        console.warn("[storm-calc] GHL sync failed:", ghlErr);
      }
    }

    // Slack notification
    const SLACK_WEBHOOK = process.env.SLACK_NOTIFICATION_WEBHOOK;
    const fmtCurrency = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : `$${n.toLocaleString()}`;

    const slackText =
      `🌩️ *New Storm Revenue Calculator Submission*\n` +
      `• *Name:* ${name}\n` +
      `• *Email:* ${email}\n` +
      `• *Company:* ${company || "N/A"}\n` +
      `• *Phone:* ${phone || "N/A"}\n` +
      `• *Score:* ${score}/100\n` +
      `• *Revenue Gap:* ${fmtCurrency(revenueGapLow)} – ${fmtCurrency(revenueGapHigh)}\n` +
      `• *Weak Areas:* ${(weakAreas || []).join(', ') || 'None'}\n` +
      `• *Time:* ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`;

    if (SLACK_WEBHOOK) {
      try {
        await fetch(SLACK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: slackText }),
          signal: AbortSignal.timeout(5000),
        });
        console.log("[storm-calc] Slack notification sent");
      } catch (slackErr) {
        console.warn("[storm-calc] Slack notification failed:", slackErr);
      }
    } else {
      console.log("[storm-calc] NOTIFY (no webhook):", slackText);
    }

    return NextResponse.json({
      ok: true,
      ghlEnabled: GHL_ENABLED,
      ghlContactId,
      ghlCreated,
    });
  } catch (err) {
    console.error("[storm-calc] Unhandled error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
