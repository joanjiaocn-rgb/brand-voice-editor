# VoiceDraft Cloudflare Backend Handoff

Status: BLOCKED_SETUP for production. The Worker and machine-readable API contract are implemented, but Cloudflare credentials and live binding tests are unavailable.

## Architecture

- Cloudflare Worker handles AI endpoints, sitemap, robots, and dynamic canonical tags.
- Static assets are served through the Worker Assets binding from `dist/`.
- Cloudflare Workers AI is bound as `AI`.
- No D1, R2, KV, authentication, subscriptions, or server-side writing history exists in this MVP slice.
- The browser stores one derived Voice Profile in local storage.

## Data flow

1. Browser validates input length.
2. Worker validates the request again and applies a short-window, isolate-local rate limit.
3. Raw writing is sent to the configured Workers AI model.
4. Worker parses structured output and compares protected tokens.
5. Response is returned with `Cache-Control: no-store`.
6. Application code does not intentionally persist the draft, output, or source samples.

## Contracts

- Machine-readable API: `contracts/api-contract.json`
- Worker implementation: `src/worker.js`
- Frontend consumer: `src/main.js` and `src/voice.js`

## Security notes

- No secret is committed.
- Raw writing is omitted from application logs and analytics events.
- Error logs contain request ID and error message only.
- The in-memory rate limit is best effort and is not a global quota mechanism.
- Production needs an account-level quota, Cloudflare edge rate limiting, or persistent usage ledger before broad promotion.

## Live test blockers

- `CLOUDFLARE_API_TOKEN` or an authenticated Wrangler session is missing.
- Target account ID is missing.
- The selected Workers AI model has not been verified in the target account.
- Provider retention settings and final Privacy text are not confirmed.

[BLOCKED_SETUP]
