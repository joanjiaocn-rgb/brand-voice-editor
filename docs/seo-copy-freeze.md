# VoiceDraft SEO Copy Freeze v0.1

Status: NEEDS_REVIEW. The value proposition and prohibited claims are frozen for implementation. Pricing, legal identity, and final brand/domain are provisional.

## Message hierarchy

- Working brand: VoiceDraft
- Category: AI brand voice editor
- Core promise: Turn stiff drafts into writing that sounds like you.
- Primary audience: independent consultants and small agency owners in English-speaking Western markets.
- Primary action: Start editing.
- Differentiation: a reusable personal Voice Profile, mode-aware editing, visible changes, and fact-preservation warnings.

## Prohibited claims

- Undetectable, detector-proof, or bypasses AI detectors.
- 100% human or guaranteed to sound human.
- Guaranteed engagement, reply rate, revenue, or reach.
- Unlimited usage until model economics support it.
- No retention or no provider processing unless verified against production configuration.

## Route copy

### `/`

- Title: AI Humanizer for Email and LinkedIn | VoiceDraft
- Meta: AI humanizer for emails and LinkedIn posts that makes AI-assisted writing sound like you while keeping meaning and important details intact.
- Eyebrow: AI humanizer for work
- H1: Make AI writing sound like you.
- Subhead: Humanize emails and LinkedIn posts without flattening your voice. Keep the meaning and important details, then make the final call yourself.
- Primary CTA: Start editing
- Secondary CTA: See an example
- H2: Start with a real message
- H2: Your voice is more than a tone setting
- H2: Keep the facts. Change the delivery.
- H2: One voice across the work people actually read
- H2: Questions before you rewrite

### `/ai-humanizer/`

- Title: AI Humanizer for Professional Writing | VoiceDraft
- Meta: Humanize AI writing for emails and LinkedIn posts while preserving your meaning, facts, and personal voice.
- H1: AI humanizer for professional writing
- Subhead: Make AI-assisted emails and LinkedIn posts sound clear, personal, and ready to send. Keep your meaning, facts, and point of view in your hands.
- CTA: Humanize my draft
- H2: Humanize AI writing without flattening your voice
- H2: Humanize the messages you actually send
- H2: Humanize the writing, not the facts
- H2: Common questions about AI humanizing

### `/email-rewriter/`

- Title: AI Email Humanizer and Rewriter | VoiceDraft
- Meta: Humanize AI-written client and prospect emails to sound clear, direct, and natural while keeping names, numbers, links, and commitments visible.
- H1: Rewrite emails without losing your voice
- Subhead: Polish client, prospect, and partnership emails in your own style, with important detail changes flagged for review.
- CTA: Rewrite my email
- H2: From AI draft to send-ready email
- H2: Clearer does not have to mean colder
- H2: Details worth double-checking
- H2: Email rewriting questions

### `/linkedin-post-rewriter/`

- Title: AI LinkedIn Post Humanizer and Rewriter | VoiceDraft
- Meta: Humanize AI-assisted LinkedIn posts without flattening your opinion, rhythm, or point of view.
- H1: Rewrite LinkedIn posts without losing your point of view
- Subhead: Strengthen the opening and flow while keeping the argument, experience, and voice yours.
- CTA: Rewrite my post
- H2: A stronger post, not a louder one
- H2: Keep the opinion. Improve the read.
- H2: Built for a recognizable body of work
- H2: LinkedIn rewriting questions

### `/pricing/`

- Title: VoiceDraft Pricing | Start with the Free Beta
- Meta: Try VoiceDraft during the free beta and help shape paid plans for independent professionals.
- H1: Start in the free beta
- Subhead: Test the core editor and your local Voice Profile before paid plans are introduced.
- CTA: Try the editor
- Disclosure: Paid plan price and included usage are not yet finalized.

### `/about/`

- Title: About VoiceDraft | AI Humanizer for Professional Writing
- Meta: About VoiceDraft, an AI humanizer for professional emails and LinkedIn posts.
- H1: A practical editing desk for work writing

### `/contact/`

- Title: Contact VoiceDraft | Product Feedback and Support
- Meta: Contact VoiceDraft with product feedback, privacy questions, or support requests.
- H1: Questions, feedback, or a privacy request

## Shared product copy

- Input label: Your draft
- Input placeholder: Paste an email or LinkedIn draft here...
- Mode labels: Email / LinkedIn
- Context label: Who is this for, and what should it achieve?
- Generate CTA: Rewrite in my voice
- Default generate CTA: Rewrite draft
- Empty result: Your rewrite will appear here, with important detail changes flagged for review.
- Loading: Reading the draft and matching the delivery...
- Copy success: Copied
- Retry: Try again
- Warning: Review these details before you use the rewrite.
- Local preview label: Local preview only

## FAQ copy

### Is this an AI detector bypass tool?

No. VoiceDraft is designed for professional editing: clearer delivery, a more consistent personal voice, and visible checks on important details. It does not promise to bypass detection systems.

### What does a Voice Profile remember?

It records practical preferences such as directness, sentence rhythm, warmth, contractions, and phrases you want to avoid. In this MVP, the profile stays in this browser unless you delete it.

### Will it change names, numbers, or links?

The editor compares selected details in the source and rewrite and flags missing or changed items. Automated checks can miss context, so you should still review business-critical messages.

### Does VoiceDraft store my writing?

The MVP does not intentionally persist draft or output text on the application server. Text is sent to the configured Cloudflare AI service to produce the requested output. The local Voice Profile is stored in your browser. Production provider and retention details must match the Privacy Policy before launch.

## Schema notes

- Use `SoftwareApplication` on tool pages.
- Use `FAQPage` only where the matching FAQ is visibly rendered.
- Do not use ratings, review count, or offer price until supported by real data.
- Public pages also receive generated `WebPage` and `Organization` schema with the About/Contact routes, plus OG/Twitter and date-modified metadata at build time.
- `/llms.txt` is a machine-readable summary of the product, public routes, limits, and prohibited claims.

[NEEDS_REVIEW]
