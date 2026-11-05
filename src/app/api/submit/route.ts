import { NextRequest, NextResponse } from "next/server";
import { upsertStormContact, type StormCalculatorData } from "@/lib/ghl";
import { parseAttribution } from "@/lib/attribution";
import { calculateResults, type Answers } from "@/lib/calculator";

export const dynamic = "force-dynamic";

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

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asAnswers(raw: unknown): Answers | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  const monthly = Number(a.monthly_leads);
  const ticket = Number(a.avg_ticket);
  const close = Number(a.close_rate);
  const speed = typeof a.follow_up_speed === "string" ? a.follow_up_speed : "";
  const automation = typeof a.automation === "string" ? a.automation : "";
  const tracking = typeof a.tracking === "string" ? a.tracking : "";
  if (!Number.isFinite(monthly) || monthly < 0) return null;
  if (!Number.isFinite(ticket) || ticket < 0) return null;
  if (!Number.isFinite(close) || close < 0 || close > 100) return null;
  if (!speed || !automation || !tracking) return null;
  return {
    monthly_leads: monthly,
    avg_ticket: ticket,
    close_rate: close,
    follow_up_speed: speed,
    automation,
    tracking,
  };
}

function buildGhlNote(params: {
  name: string; email: string; company: string; phone: string;
  answers: Answers;
  score: number; revenueGapLow: number; revenueGapHigh: number;
  currentRevenue: number; potentialRevenue: number;
  weakAreas: string[];
  submittedAt: string;
}): string {
  const { name, email, company, phone, answers, score,
    revenueGapLow, revenueGapHigh, currentRevenue, potentialRevenue,
    weakAreas, submittedAt } = params;

  const fmtCurrency = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${n.toLocaleString()}`;

  return [
    "STORM REVENUE RECOVERY CALCULATOR - SUBMISSION",
    "Name:     " + name,
    "Email:    " + email,
    "Company:  " + (company || "N/A"),
    "Phone:    " + (phone || "N/A"),
    "Date:     " + new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    "",
    "STORM READINESS SCORE: " + score + "/100",
    "",
    "REVENUE GAP: " + fmtCurrency(revenueGapLow) + " to " + fmtCurrency(revenueGapHigh) + " annually",
    "Current Estimated Revenue: " + fmtCurrency(currentRevenue),
    "Potential With Systems:    " + fmtCurrency(potentialRevenue),
    "",
    "ANSWERS:",
    "  Monthly Leads:    " + answers.monthly_leads,
    "  Avg Ticket:       $" + Number(answers.avg_ticket).toLocaleString(),
    "  Close Rate:       " + answers.close_rate + "%",
    "  Follow-Up Speed:  " + String(answers.follow_up_speed).replace(/_/g, " "),
    "  Automation:       " + answers.automation,
    "  Tracking:         " + answers.tracking,
    "",
    "WEAK AREAS: " + (weakAreas.join(", ") || "None identified"),
    "",
    "Source: stormcalculator.razorsharpnetworks.com",
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many submissions." }, { status: 429 });
    }

    const body = await req.json();
    const name = asText(body?.name);
    const email = asText(body?.email);
    const company = asText(body?.company);
    const phone = asText(body?.phone);
    const answers = asAnswers(body?.answers);

    if (!name || !email || !answers) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const result = calculateResults(answers);
    const score = result.score;
    const revenueGapLow = result.revenueGapLow;
    const revenueGapHigh = result.revenueGapHigh;
    const currentRevenue = result.currentAnnualRevenue;
    const potentialRevenue = result.potentialAnnualRevenue;
    const weakAreas = result.weakAreas.map((w) => w.label);

    const submittedAt = new Date().toISOString();
    console.log(`[storm-calc] score=${score}/100 | gap=$${revenueGapLow}-$${revenueGapHigh}`);

    const GHL_ENABLED = Boolean(process.env.GHL_PRIVATE_TOKEN && process.env.GHL_LOCATION_ID);
    let ghlContactId: string | null = null;
    let ghlCreated = false;
    let ghlFailed = false;

    if (GHL_ENABLED) {
      try {
        const note = buildGhlNote({
          name, email, company, phone, answers, score,
          revenueGapLow, revenueGapHigh, currentRevenue, potentialRevenue,
          weakAreas, submittedAt,
        });

        const calculatorData: StormCalculatorData = {
          score,
          revenueGapLow,
          revenueGapHigh,
          currentRevenue,
          potentialRevenue,
          scoreTier: score >= 70 ? "Strong" : score >= 40 ? "Needs Work" : "Critical",
          monthlyLeads: answers.monthly_leads,
          avgTicket: answers.avg_ticket,
          closeRate: answers.close_rate,
          followUpSpeed: answers.follow_up_speed,
          automationLevel: answers.automation,
          trackingMethod: answers.tracking,
        };

        const saved = await upsertStormContact({
          fullName: name,
          email: email.toLowerCase(),
          phone: phone || undefined,
          companyName: company || undefined,
          tagsToAdd: [
            "Activity - Calculator - Storm Revenue Calculator Complete",
            "Status - Lead - Storm Calculator",
            `Storm Score - ${score >= 70 ? "Strong" : score >= 40 ? "Needs Work" : "Critical"}`,
            "Industry - Storm Restoration",
          ],
          note,
          calculatorData,
          attribution: parseAttribution(body?.attribution, "storm calculator", "stormcalculator.razorsharpnetworks.com"),
        });

        ghlContactId = saved.contactId;
        ghlCreated = saved.created;
        console.log(`[storm-calc] GHL ${ghlCreated ? "created" : "updated"} contact`);
      } catch (ghlErr) {
        ghlFailed = true;
        console.warn("[storm-calc] GHL sync failed:", ghlErr);
      }
    }

    const SLACK_WEBHOOK = process.env.SLACK_NOTIFICATION_WEBHOOK;
    const fmtCurrency = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${n.toLocaleString()}`;
    const ghlLine = ghlFailed
      ? "Save failed"
      : ghlContactId
        ? `${ghlCreated ? "Created" : "Updated"} contact`
        : "Not synced";
    const ghlContactUrl = ghlContactId
      ? `\n- *GHL Contact:* <https://app.leadconnectorhq.com/contacts/${ghlContactId}|View in GHL>`
      : "";

    const slackText =
      `*New Storm Revenue Calculator Submission*\n` +
      `- *Name:* ${name}\n` +
      `- *Email:* ${email}\n` +
      `- *Company:* ${company || "N/A"}\n` +
      `- *Phone:* ${phone || "N/A"}\n` +
      `- *Score:* ${score}/100\n` +
      `- *Revenue Gap:* ${fmtCurrency(revenueGapLow)} to ${fmtCurrency(revenueGapHigh)}\n` +
      `- *Weak Areas:* ${weakAreas.join(", ") || "None"}\n` +
      `- *GHL:* ${ghlLine}${ghlContactUrl}\n` +
      `- *Time:* ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })}`;

    if (SLACK_WEBHOOK) {
      try {
        await fetch(SLACK_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: slackText }),
          signal: AbortSignal.timeout(5000),
        });
      } catch (slackErr) {
        console.warn("[storm-calc] Slack notification failed:", slackErr);
      }
    }

    if (ghlFailed) {
      return NextResponse.json({ error: "We could not save your results. Try again." }, { status: 502 });
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
