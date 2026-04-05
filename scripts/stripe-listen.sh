#!/usr/bin/env bash
# Forward Stripe webhooks to local Next.js (uses STRIPE_SECRET_KEY from .env.local)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -f "$ROOT/.env.local" ]]; then
  echo "Missing .env.local (add STRIPE_SECRET_KEY)." >&2
  exit 1
fi
set -a
# shellcheck disable=SC1090
source "$ROOT/.env.local"
set +a
if [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "STRIPE_SECRET_KEY not set in .env.local" >&2
  exit 1
fi
exec stripe listen --forward-to localhost:3000/api/webhooks/stripe --api-key "$STRIPE_SECRET_KEY"
