#!/usr/bin/env bash
# POST sample cart + address to /api/shipping/quote (requires: npm run dev on PORT)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-3000}"
BASE_URL="${BASE_URL:-http://localhost:${PORT}}"

echo "POST ${BASE_URL}/api/shipping/quote"
RESP="$(curl -sS -w '\n%{http_code}' -X POST "${BASE_URL}/api/shipping/quote" \
  -H 'Content-Type: application/json' \
  -d @"${ROOT}/scripts/shipping-quote.sample.json")"
BODY="$(echo "$RESP" | sed '$d')"
CODE="$(echo "$RESP" | tail -n1)"
echo "HTTP $CODE"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
