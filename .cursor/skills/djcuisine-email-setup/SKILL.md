---
name: djcuisine-email-setup
description: >-
  Configures Resend transactional email for the DJ Cuisine Next.js app —
  env vars, domain verification, and smoke testing. Used when adding or fixing
  email, Resend API keys, ORDER_EMAIL_FROM, ADMIN_EMAIL, order confirmation
  mail, shipping notifications, or troubleshooting “RESEND_API_KEY not set”.
---

# DJ Cuisine — Resend Email Setup

## When this applies

- First-time transactional email setup (dev or production).
- Moving from `onboarding@resend.dev` to a verified domain.
- Debugging failed sends or missing admin/customer copies.

## Prerequisites checklist

1. Resend account: [https://resend.com](https://resend.com)
2. API key from [API Keys](https://resend.com/api-keys)
3. `resend` package present (`npm install resend` if missing)

## Environment variables (`.env.local` / deployment)

| Variable | Required | Notes |
|---------|----------|--------|
| `RESEND_API_KEY` | Yes for real sends | `re_…`; never commit |
| `ORDER_EMAIL_FROM` | Yes | Format: `"DJ Cuisine <email@domain.com>"`; must match a **verified** sender in production |
| `ADMIN_EMAIL` | Recommended | Admin alerts (shipping, order notifications depend on flow) |
| `ADMIN_ORDER_EMAIL` | Optional | If set, used as admin recipient for **Stripe Checkout Session** order emails (`lib/email/orderEmails.ts`); falls back to `ADMIN_EMAIL` |
| `ORDER_CONFIRMATION_EMAIL_TO_CUSTOMER` | Optional | Set to `false` to skip customer copy on Checkout Session order emails |

**Development sender (no domain DNS):**

```env
ORDER_EMAIL_FROM="DJ Cuisine <onboarding@resend.dev>"
```

**Production:** verify domain at [Resend Domains](https://resend.com/domains), add DNS records, then set `ORDER_EMAIL_FROM` to an address on that domain.

## After editing env

Restart the Next.js dev server so `process.env` reloads.

## Smoke test: `POST /api/test-email`

With `npm run dev` and vars set:

```bash
curl -X POST "${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/test-email" \
  -H "Content-Type: application/json" \
  -d '{"orderNumber":"ORD-TEST-001","customerEmail":"YOUR_INBOX@gmail.com","orderTotal":48000}'
```

Expect JSON indicating customer and admin sends succeeded (see `app/api/test-email/route.ts`).

Resend sandbox addresses when using test domain behavior (documented in [RESEND_SETUP_GUIDE.md](../../../RESEND_SETUP_GUIDE.md)): e.g. `delivered@resend.dev`.

## Integration touchpoints (read before changing behavior)

- Core send helper: `lib/email/resend.ts` — requires `RESEND_API_KEY`, uses `ORDER_EMAIL_FROM`, `{ data, error }` handling, optional `idempotencyKey`.
- Shipping template: `lib/email/templates/shippingNotification.ts`.
- Checkout Session confirmations: `lib/email/orderEmails.ts` (`ADMIN_ORDER_EMAIL` || `ADMIN_EMAIL`, customer gated by `ORDER_CONFIRMATION_EMAIL_TO_CUSTOMER`).
- PaymentIntent confirmations: `lib/stripe/handlePaymentIntentSucceeded.ts` — uses functions from `lib/email/resend.ts`.

## Troubleshooting shortcuts

| Symptom | Likely fix |
|---------|------------|
| `[Email] RESEND_API_KEY … not set` | Add key; restart server |
| `[Email] ORDER_EMAIL_FROM … not set` | Set `ORDER_EMAIL_FROM` |
| `[Email] ADMIN_ORDER_EMAIL not set` (Checkout path) | Set `ADMIN_ORDER_EMAIL` or `ADMIN_EMAIL` |
| Domain / verification errors | Use `onboarding@resend.dev` for dev; verify prod domain |

## Detailed docs

- [RESEND_SETUP_GUIDE.md](../../../RESEND_SETUP_GUIDE.md) — full narrative, checklist, troubleshooting.
- [EMAIL_TESTING_GUIDE.md](../../../EMAIL_TESTING_GUIDE.md) — phased testing (templates, build, API).
- [.env.example](../../../.env.example) — commented stubs.
