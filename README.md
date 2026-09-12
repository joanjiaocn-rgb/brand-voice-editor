# VoiceDraft MVP

VoiceDraft is an editor-first web MVP for rewriting AI-assisted emails and LinkedIn posts in a reusable personal voice. The working product name and commercial pricing are provisional.

Production site: https://brandvoice.space/

## What is implemented

- Responsive homepage and task-specific SEO pages.
- Email and LinkedIn rewriting workspace.
- Browser-local Voice Profile creation and reuse.
- Cloudflare Workers AI rewrite and voice-analysis endpoints.
- Protected-token warnings for selected numbers, dates, URLs, and email addresses.
- Dynamic sitemap, robots, and canonical links at the Worker edge.
- Privacy, terms, pricing, 404, and noindex application routes.
- GitHub Actions workflow for automatic Cloudflare deployment from `main`.

Authentication, billing, cross-device profiles, and durable usage accounting are intentionally deferred.

## Local preview

```powershell
npm.cmd run dev
```

Open `http://127.0.0.1:4173`. The local static server cannot access Workers AI, so the UI clearly returns a local preview result. Production rewriting only runs through the Cloudflare Worker.

## Checks

```powershell
npm.cmd run check
```

This builds all routes and verifies internal links, page metadata, noindex application routes, and the Worker SEO surface.

## Cloudflare deployment

The Worker uses:

- `AI` Workers AI binding.
- `ASSETS` static assets binding generated from `dist/`.

The Worker uses `https://brandvoice.space` as the canonical site origin for `canonical`, `robots.txt`, and `sitemap.xml`. The custom domain must also be attached to the Worker in Cloudflare before it serves traffic.

Manual deploy after Cloudflare authentication:

```powershell
npm.cmd run deploy
```

The local environment currently cannot install Wrangler because subprocess stdout is modified by the host. The included GitHub Actions workflow runs on Linux and deploys with `--no-bundle`.

For automatic deployment, create these GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Do not put secrets in `.env`, source files, commits, issues, or chat messages.

## Product and implementation sources

- PRD: `docs/product-prd.md`
- Project control: `project-control.md`
- SEO copy freeze: `docs/seo-copy-freeze.md`
- Design handoff: `docs/design-handoff.md`
- Backend handoff: `docs/backend-handoff.md`
- Machine-readable API contract: `contracts/api-contract.json`

## Production gates

- Confirm the final product name, domain, legal operator identity, and support contact.
- Verify the Workers AI model and latency in the target account.
- Add account-level quota protection before broad promotion.
- Visually QA desktop and mobile screenshots.
- Calibrate paid pricing before enabling checkout.
