module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const name = String(body.name || '').trim();
    const guests = String(body.guests || '').trim();
    const status = String(body.status || '').trim();
    const page = String(body.page || 'onlyket.com/goodbuy').trim();

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const RSVP_TO_EMAIL = process.env.RSVP_TO_EMAIL || 'borohovhannisyan@gmail.com';
    const RSVP_FROM_EMAIL = process.env.RSVP_FROM_EMAIL || 'Boris Party <onboarding@resend.dev>';

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email service is not configured yet' });
    }

    const subject = `New RSVP: ${name} — ${status}`;
    const submittedAt = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Yerevan' });
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
        <h2>New RSVP</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Status:</b> ${escapeHtml(status)}</p>
        <p><b>Guests:</b> ${escapeHtml(guests || '0')}</p>
        <p><b>Page:</b> ${escapeHtml(page)}</p>
        <p><b>Submitted:</b> ${escapeHtml(submittedAt)} Yerevan time</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: RSVP_FROM_EMAIL,
        to: RSVP_TO_EMAIL,
        subject,
        html
      })
    });

    const resendData = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      return res.status(500).json({ error: resendData.message || 'Email could not be sent' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
