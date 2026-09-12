# VoiceDraft Cloudflare Backend Handoff

Status: NEEDS_REVIEW. The production AI binding is present. A deprecated model caused rewrite requests to return 502; the replacement model and response-parser fallback are implemented locally and require post-deployment verification.

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

## Production verification

- `GET /api/health` returned 200 with `ai: true` on 2026-09-12.
- `POST /api/rewrite` reproduced a 502 while the Worker used deprecated model `@cf/meta/llama-3.1-8b-instruct`.
- Cloudflare marks that model deprecated as of 2026-05-30.
- The Worker now targets `@cf/meta/llama-3.3-70b-instruct-fp8-fast`; local contract tests cover fenced JSON and malformed JSON/plain-text fallback.
- `CLOUDFLARE_API_TOKEN` and account ID are not available to the local automation environment, so the replacement model still needs one live rewrite after deployment.
- Provider retention settings and final Privacy text are not confirmed.

[NEEDS_REVIEW]
