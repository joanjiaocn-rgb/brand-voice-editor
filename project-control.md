# VoiceDraft Project Control

## Current state

- Stage: local MVP validation
- Status: NEEDS_REVIEW
- Target market: US / UK / Canada / Australia, English
- Product: editor-first AI brand voice rewriting tool
- Public release authorization: granted by owner on 2026-09-12

## Gates

| Gate | State | Evidence / unlock action |
|---|---|---|
| PRD | REVIEW | `../brand-voice-editor-prd.md`; pricing and provider economics remain open |
| SEO copy freeze | REVIEW | `docs/seo-copy-freeze.md`; price and company identity are provisional |
| Design handoff | REVIEW | `docs/design-handoff.md`; produced without Stitch/Figma account |
| Frontend | LOCAL_READY | Build, route, link, and SEO automation pass; screenshot QA blocked by host approval failure |
| Worker AI | REVIEW | Code and API contract pass syntax checks; live account/model test pending |
| Compliance | REVIEW | Privacy/Terms are MVP drafts, not legal advice |
| GitHub | PUSHED | `main` at `df8ee326c6cd7eac7d2a2aacfe257f51458700ae`; local and remote verified equal |
| Cloudflare | BLOCKED_SETUP | GitHub Action `34683583879` built successfully; Wrangler deploy step skipped because repository secrets are missing |
| Production URL | REVIEW | `https://brandvoice.space/`; attach the custom domain to the Worker and run post-DNS smoke tests |

## Local verification evidence

- `npm.cmd run check`: PASS on 2026-09-12.
- GitHub `main` commit equality: PASS at `df8ee326c6cd7eac7d2a2aacfe257f51458700ae`.
- GitHub Actions build: PASS, run `34683583879`.
- Cloudflare deploy: SKIPPED because `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are not configured as repository secrets.
- 10 HTML routes built and internal links verified.
- Core public routes returned 200; an unknown route returned 404.
- Worker, client, profile, build, and server scripts passed Node syntax checks.
- Desktop/mobile screenshot capture: BLOCKED because the environment approval service failed before Chrome could launch.
- Live Cloudflare AI response: not tested without authenticated Cloudflare access.

## Owner review decisions

- Confirm final product name and domain. `VoiceDraft` is a working name.
- Confirm subscription price after a live Workers AI cost benchmark.
- Confirm legal entity/contact details before accepting payment.
- Confirm GitHub repository destination.
- Configure Cloudflare account access and deployment secrets.

## Scope for this build

- Public, responsive editor-first pages.
- Email and LinkedIn rewrite modes.
- Local Voice Profile creation and reuse.
- Cloudflare Workers AI rewrite/analyze endpoints.
- SEO routes, privacy, terms, pricing, sitemap, robots, canonical injection.
- Automatic Cloudflare deployment workflow scaffold.

## Explicitly deferred

- Authentication and cross-device profiles.
- Billing checkout and paid entitlement.
- Browser extensions.
- Stored rewrite history.
- Team workspaces and integrations.
