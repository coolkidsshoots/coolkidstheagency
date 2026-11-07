// Receives the enquiry form and emails it to the agency.
// Needs ONE of these set in Vercel (Settings > Environment Variables):
//   RESEND_API_KEY   (Resend, sends from your own domain)
//   WEB3FORMS_KEY    (Web3Forms, quickest to set up)
// Optional: ENQUIRY_TO (defaults to contact@coolkidstheagency.com), ENQUIRY_FROM (Resend only)

export const runtime = "nodejs";

const clean = (v, max) => String(v ?? "").replace(/\r/g, "").trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\n+/g, " ");

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }

  // spam trap: bots fill the hidden field, people don't. Pretend it worked.
  if (clean(b.company, 50)) return Response.json({ ok: true });

  const name = oneLine(b.name, 120);
  const email = oneLine(b.email, 200);
  const phone = oneLine(b.phone, 40);
  const service = oneLine(b.service, 40);
  const timeline = oneLine(b.timeline, 200);
  const details = clean(b.details, 4000);

  if (!name || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const to = process.env.ENQUIRY_TO || "contact@coolkidstheagency.com";
  const subject = `New enquiry from ${name}${service ? " (" + service + ")" : ""}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "not given"}`,
    `Needs: ${service || "not chosen"}`,
    `When: ${timeline || "not given"}`,
    "",
    "The project:",
    details,
  ].join("\n");

  try {
    if (process.env.RESEND_API_KEY) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM || "Cool Kids Enquiries <enquiries@coolkidstheagency.com>",
          to: [to],
          reply_to: email,
          subject,
          text,
        }),
      });
      if (!r.ok) throw new Error("resend " + r.status);
      return Response.json({ ok: true });
    }

    if (process.env.WEB3FORMS_KEY) {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          subject,
          from_name: "Cool Kids The Agency website",
          name,
          email,
          message: text,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false) throw new Error("web3forms");
      return Response.json({ ok: true });
    }
  } catch {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  // no email service set up yet: say so, so the form shows the direct-email fallback instead of pretending it worked
  return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
}
