# Onlyket Goodbuy Party

Static Vercel project for Boris' Goodbye Party invitation.

Files:
- `index.html` redirects to `/goodbuy`
- `goodbuy.html` invitation page
- `api/rsvp.js` sends RSVP to email via Resend API
- `vercel.json` enables `/goodbuy` route

Vercel Environment Variables:
- `RESEND_API_KEY`
- `RSVP_TO_EMAIL=borohovhannisyan@gmail.com`
- `RSVP_FROM_EMAIL=Boris Party <party@onlyket.com>`
