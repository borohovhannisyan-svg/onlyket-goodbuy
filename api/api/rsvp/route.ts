import { NextResponse } from "next/server";

export const runtime = "edge";

type RSVPStatus = "coming" | "not_coming";

type RSVPBody = {
  status?: RSVPStatus;
  name?: string;
  guests?: number;
  company?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  let body: RSVPBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const status = body.status;
  const guests = Number(body.guests);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (status !== "coming" && status !== "not_coming") {
    return NextResponse.json({ error: "RSVP status is required." }, { status: 400 });
  }

  if (!Number.isInteger(guests) || guests < 0 || guests > 99) {
    return NextResponse.json({ error: "Invalid guest count." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RSVP_TO_EMAIL || "borohovhannisyan@gmail.com";
  const fromEmail = process.env.RSVP_FROM_EMAIL || "Boris Party <party@onlyket.com>";

  if (!apiKey) {
    return NextResponse.json({ error: "Email service is not configured yet." }, { status: 500 });
  }

  const readableStatus = status === "coming" ? "Coming" : "Can't make it";
  const submittedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Yerevan"
  }).format(new Date());

  const safeName = escapeHtml(name);
  const safeStatus = escapeHtml(readableStatus);

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 16px;color:#a60063">New RSVP · Boris' Goodbye Party</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Status:</strong> ${safeStatus}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Submitted:</strong> ${submittedAt} Yerevan time</p>
    </div>
  `;

  const text = [
    "New RSVP · Boris' Goodbye Party",
    `Name: ${name}`,
    `Status: ${readableStatus}`,
    `Guests: ${guests}`,
    `Submitted: ${submittedAt} Yerevan time`
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `RSVP: ${readableStatus} · ${name}`,
      html,
      text
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Resend error:", errorText);
    return NextResponse.json({ error: "Could not send email. Check email settings." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
