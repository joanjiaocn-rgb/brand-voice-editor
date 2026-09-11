# Brand Voice Editor PRD

## 0. Document Control

- Product codename: Brand Voice Editor
- Version: v1.0
- Date: 2026-09-11
- Status: NEEDS_REVIEW
- Stage: 02-product
- Target market: United States, United Kingdom, Canada, Australia
- Product language: English
- Product type: SEO acquisition tools + subscription web application
- Primary platform: Responsive web

## 1. Executive Summary

Brand Voice Editor turns rough or AI-generated emails and LinkedIn posts into clear, natural writing that sounds like the user. It learns a reusable voice profile from the user's previous writing, preserves facts and intent, explains meaningful changes, and removes the need to recreate a long prompt in a general-purpose AI chat for every draft.

The MVP must validate one commercial hypothesis:

> English-speaking independent consultants and small agency owners will pay for a faster, repeatable way to make AI-assisted business writing sound consistently like them.

The product is not an AI-detector bypass tool, an ESL tutor, or a general document editor. `AI humanizer` is an acquisition term, not the product promise.

## 2. Inputs, Evidence, and Assumptions

### 2.1 Confirmed inputs

- The intended customers are in Western English-speaking markets with established online payment habits.
- The initial opportunity was discovered through `ai humanizer` and related rewriting terms.
- The chosen differentiation is persistent personal voice, not generic rewriting quality.
- Email and LinkedIn belong to the same target user's client acquisition and personal-brand workflow.

### 2.2 Available evidence

- Earlier keyword screening showed active demand and growing small competitors around `ai humanizer`.
- General-purpose AI tools can already perform one-off rewrites, so a prompt-only wrapper is not a sufficient product advantage.
- The viable product advantage must come from saved context, repeatable voice, workflow speed, trust, and distribution.

### 2.3 Missing evidence

- [待确认] Current US SERP Top 10 for `AI brand voice generator`, `email rewriter`, and `LinkedIn post rewriter`.
- [待确认] Search volume, keyword difficulty, and CPC for the proposed page matrix.
- [待确认] Direct interviews or usability tests with the primary ICP.
- [待确认] Model cost per successful rewrite and sustainable free quota.
- [待确认] Competitor pricing and feature comparison for personal voice products.

Because competitor and pricing evidence is incomplete, this PRD is ready for owner review but not yet a final launch commitment.

## 3. Problem Definition

### 3.1 User problem

Professionals use ChatGPT or another AI assistant to create emails and LinkedIn content, but the result often:

- sounds generic or overly polished;
- contains familiar AI phrases and unnecessary framing;
- does not match the user's usual rhythm, directness, or vocabulary;
- requires repeated prompt engineering and manual cleanup;
- risks changing names, numbers, commitments, or the user's actual opinion.

### 3.2 Existing alternatives

| Alternative | Strength | Gap the MVP targets |
|---|---|---|
| ChatGPT or Claude | Flexible and already familiar | Repeated prompting, inconsistent voice, context switching |
| Grammarly or Wordtune | Embedded writing assistance | Primarily correction and generic tone controls |
| Saved custom prompts | Cheap and controllable | Setup burden and fragile consistency |
| Human editor | High-quality judgment | Slow and expensive for everyday writing |
| Manual rewriting | Full control | Time-consuming and difficult to repeat |

### 3.3 Product opportunity

The product must win on the complete repeat workflow rather than raw model capability:

1. remember how the user writes;
2. require no prompt construction;
3. preserve meaning and sensitive facts;
4. produce a usable result quickly;
5. improve from explicit user feedback over time.

## 4. Target Users

### 4.1 Segment evaluation

| Segment | Pain frequency | Ability to pay | Reachability | MVP decision |
|---|---:|---:|---:|---|
| Independent consultants and small agency owners | High | Medium-high | High through LinkedIn and communities | Primary ICP |
| Early-stage founders | Medium-high | Medium-high | Medium | Secondary ICP |
| Freelance marketers and creators | Medium-high | Medium | High | Secondary ICP |
| Students and detector-bypass users | Medium | Low | High through SEO | Excluded |
| General ESL learners | Medium | Low-medium | Medium | Excluded |
| Enterprise marketing teams | High | High | Low without sales/compliance | Future only |

### 4.2 Primary ICP

An English-speaking independent consultant or owner of a 1-10 person agency who:

- publishes on LinkedIn at least several times per month;
- writes client, prospect, or partnership emails every week;
- already uses a general AI assistant for first drafts;
- considers personal credibility and recognizable voice commercially important;
- is willing to pay for saved time and consistent output.

### 4.3 Jobs to be done

- When I have an AI-generated draft, help me make it sound like something I would actually send.
- When I write to a client or prospect, help me be clear and confident without sounding cold or artificial.
- When I publish on LinkedIn, preserve my opinion and personality while improving structure and readability.
- When I return later, remember my voice so I do not have to explain it again.

## 5. Positioning and Product Boundaries

### 5.1 Positioning statement

For independent consultants and small agency owners who use AI to draft business writing, Brand Voice Editor is a personal writing assistant that rewrites emails and LinkedIn posts in their recognizable voice while preserving facts and intent. Unlike a generic AI chat, it remembers the user's style and provides a purpose-built, repeatable workflow.

### 5.2 Core promise

`Make AI writing sound like you.`

### 5.3 Supporting promise

`Turn stiff emails and LinkedIn drafts into clear, natural writing in your personal voice.`

### 5.4 Competitive minimum

The MVP is not competitive unless it can demonstrate all of the following:

- a first-time user can obtain a useful rewrite without writing a prompt;
- a returning user can apply a saved voice profile in one action;
- names, numbers, dates, URLs, quotations, and commitments are not silently changed;
- the output is visibly less generic than the input;
- the workflow is faster than opening a general AI chat and restating context;
- users can understand and control important changes.

### 5.5 Explicit non-goals

- AI detection scoring or claims of being `undetectable`;
- bypassing school, publisher, or platform policies;
- grammar lessons or ESL curricula;
- long-form articles, academic papers, resumes, or fiction;
- browser extensions in the first release;
- Gmail, Outlook, or LinkedIn account access;
- automatic sending, scheduling, or posting;
- team workspaces, approval flows, or brand governance;
- multilingual rewriting;
- plagiarism checking;
- custom model training or fine-tuning.

## 6. MVP Scope and Priority

### 6.1 P0 capabilities

| ID | Capability | User value |
|---|---|---|
| P0-01 | Anonymous first rewrite | Experience value before signup |
| P0-02 | Email and LinkedIn modes | Fit output to two core workflows |
| P0-03 | Account creation and authentication | Save profile and enforce quota |
| P0-04 | Voice Profile creation | Establish persistent differentiation |
| P0-05 | Personalized rewrite | Apply the user's voice without prompting |
| P0-06 | Fact-preservation checks | Build trust in business communication |
| P0-07 | Before/after comparison | Make value and risk visible |
| P0-08 | Quick adjustments | Refine output without prompt writing |
| P0-09 | Copy and feedback controls | Complete the task and collect signals |
| P0-10 | Configurable usage limits and paywall | Validate willingness to pay |
| P0-11 | Subscription checkout and entitlement | Accept real payment |
| P0-12 | Data export/deletion controls | Meet baseline privacy expectations |

### 6.2 P1 after validation

- Browser extension for in-context use.
- Multiple named voice profiles.
- Rewrite history and searchable drafts.
- User-managed words and phrases to prefer or avoid.
- Additional modes such as comment replies and proposals.
- Import from public LinkedIn posts with explicit user action.

### 6.3 P2 future exploration

- Team voice guidelines and approval workflows.
- CRM and email-platform integrations.
- Organization-level analytics.
- API access.

## 7. User Experience Requirements

### 7.1 Journey A: Anonymous value test

1. User lands on `/`, `/ai-humanizer`, `/email-rewriter`, or `/linkedin-post-rewriter`.
2. User sees a usable editor in the first viewport.
3. User pastes a draft and selects Email or LinkedIn when the route has not preselected it.
4. User clicks `Rewrite`.
5. The system returns one primary rewrite plus change tags.
6. User compares the result, copies it, or applies a quick adjustment.
7. After demonstrated value, the product offers account creation to save a personal voice.

Acceptance criteria:

- The user does not need an account for the first configured free attempt.
- The input cannot be lost if signup is requested after generation.
- Validation errors explain length and input requirements in plain English.
- Raw user text is never sent to analytics.

### 7.2 Journey B: Create a Voice Profile

1. Authenticated user opens `/app/voice`.
2. User pastes at least one representative writing sample; the interface recommends three.
3. The system explains what will be extracted and how the sample is stored.
4. The system creates a structured profile.
5. User reviews and can edit the profile before saving.

The profile contains:

- formality;
- directness;
- sentence-length tendency;
- paragraph and rhythm pattern;
- vocabulary level;
- use of contractions;
- humor and warmth;
- preferred openings and closings;
- phrases or habits to avoid;
- freeform user instruction.

Acceptance criteria:

- One sample is sufficient to proceed, but the UI labels profile confidence as limited.
- The extracted profile is presented in understandable language, not model jargon.
- The user can edit or delete the profile and source samples.
- Samples are private and are not used for model training unless a future explicit opt-in is introduced.

### 7.3 Journey C: Personalized rewrite

1. User opens `/app`.
2. User selects Email or LinkedIn.
3. User pastes a draft and optionally supplies audience/context.
4. The active Voice Profile is shown.
5. User clicks `Rewrite in my voice`.
6. The system returns one recommended version.
7. User reviews highlighted changes and any meaning-risk warning.
8. User copies the output or applies a quick adjustment.

Quick adjustments:

- `Shorter`
- `More direct`
- `More conversational`

Acceptance criteria:

- Quick adjustments preserve the current draft and allow undo.
- The system never presents factual preservation as guaranteed when a risk is detected.
- Copying the output produces clean plain text with intentional line breaks.
- Repeated clicks cannot accidentally consume multiple credits while a request is pending.

### 7.4 Journey D: Upgrade

1. User reaches the configured free limit.
2. The product explains the plan limit and paid benefit.
3. User opens `/pricing` or starts checkout.
4. Payment provider completes checkout.
5. Entitlement is updated and the user returns to the draft.

Acceptance criteria:

- Pricing and free quota are configuration values, not hard-coded into UI logic.
- Cancelled or failed checkout returns the user safely without losing the draft.
- Payment webhook processing is idempotent.

## 8. Functional Requirements

### FR-01 Draft input

- Accept plain text from 20 to 5,000 characters in MVP.
- Preserve intentional paragraph breaks.
- Reject empty, unsupported, or excessively long input before model invocation.
- Display current character count and clear validation state.

### FR-02 Content modes

Email mode accepts optional recipient relationship and communication goal. It should preserve greetings, sign-offs, quoted material, and required calls to action.

LinkedIn mode accepts optional target audience and post goal. It should preserve the user's argument while improving the opening, flow, scanability, and ending without manufacturing personal stories.

### FR-03 Voice analysis

- Accept one to five samples with a configurable total-length ceiling.
- Produce a structured profile using a versioned schema.
- Record profile confidence based on sample quantity and consistency.
- Allow regeneration and manual edits.
- Store source samples separately from derived voice attributes.

### FR-04 Rewrite generation

- Use the selected mode, user context, active profile, and adjustment instruction.
- Return exactly one primary rewrite in the MVP.
- Return structured change tags and preservation warnings.
- Do not add factual claims, credentials, results, personal experiences, quotations, or promises not present in the input/context.

### FR-05 Preservation checks

Before displaying the result, compare protected tokens between input and output:

- names and named entities;
- numbers, currencies, and percentages;
- dates and times;
- email addresses, URLs, and phone numbers;
- quoted text;
- explicit commitments and deadlines where detectable.

Differences must either be corrected automatically or surfaced as `Review this change`. The interface must not imply that automated checking is infallible.

### FR-06 Comparison and controls

- Default to a readable rewritten result.
- Provide a toggle for before/after or inline diff.
- Label changes with a small fixed taxonomy: `clarity`, `voice`, `brevity`, `structure`, `risk`.
- Provide copy, undo, regenerate, and three quick-adjustment controls.

### FR-07 Authentication and entitlement

- Support email-based authentication or a managed identity provider.
- Associate profiles, usage, subscription, and consent state with the account.
- Enforce anonymous and authenticated quotas server-side.
- Do not rely on client state for paid entitlement.

### FR-08 Feedback

- Allow thumbs-up and thumbs-down per rewrite.
- For negative feedback, offer optional reasons: `not my voice`, `changed meaning`, `too generic`, `too long`, `other`.
- Do not require feedback before the user can copy.

### FR-09 Privacy controls

- Explain retention before the first authenticated sample is saved.
- Let users delete individual samples, the derived profile, rewrite records, and the full account.
- Do not include raw drafts, samples, outputs, or freeform instructions in product analytics.

## 9. AI Output Contract

### 9.1 Rewrite request

```json
{
  "request_id": "uuid",
  "mode": "email | linkedin",
  "source_text": "string",
  "context": {
    "audience": "string | null",
    "goal": "string | null",
    "relationship": "string | null"
  },
  "voice_profile": {
    "schema_version": "string",
    "traits": {},
    "user_instruction": "string | null",
    "confidence": "low | medium | high"
  },
  "adjustment": "none | shorter | more_direct | more_conversational"
}
```

### 9.2 Rewrite response

```json
{
  "request_id": "uuid",
  "rewritten_text": "string",
  "change_tags": ["clarity", "voice", "brevity"],
  "protected_token_changes": [],
  "meaning_risk": "none | review",
  "review_notes": [],
  "model_version": "string",
  "prompt_version": "string"
}
```

### 9.3 Generation rules

The model must:

1. preserve the writer's intended position and requested action;
2. never invent supporting evidence or personal experience;
3. preserve protected tokens unless explicitly instructed;
4. prefer natural specificity over generic enthusiasm;
5. avoid common filler such as unnecessary scene-setting and inflated claims;
6. preserve the input language, which is English in MVP;
7. return valid structured output or fail cleanly;
8. flag ambiguous meaning instead of silently resolving it.

## 10. Data Contract

| Entity | Minimum fields | Retention/notes |
|---|---|---|
| User | id, email, auth_provider, created_at, consent_version | Delete on completed account deletion |
| VoiceProfile | id, user_id, name, schema_version, traits_json, instruction, confidence, updated_at | One active profile in MVP |
| VoiceSample | id, profile_id, encrypted_content, created_at | User-deletable; retention policy to be confirmed |
| Rewrite | id, user_id nullable, mode, status, token_usage, model_version, prompt_version, created_at | Raw content storage should default off or short-lived; policy pending |
| Feedback | id, rewrite_id, rating, reason, created_at | Must not contain raw text by default |
| UsageLedger | id, subject_id, action, units, request_id, created_at | Server-side, idempotent accounting |
| Subscription | id, user_id, provider_customer_id, provider_subscription_id, status, plan_key, period_end | Provider is source of truth for billing state |
| ConsentRecord | id, user_id, policy_type, policy_version, accepted_at | Required for policy version tracking |

Data rules:

- Never send raw user writing to analytics or session replay.
- Secrets and provider tokens remain server-side.
- Logs must redact source text, output text, email addresses, and payment identifiers where not operationally required.
- Exact retention durations require compliance review before launch.

## 11. Route Contract

### 11.1 Public routes

| Route | Index | Primary task | Primary keyword | H1 | Main sections / H2 | CTA | Schema |
|---|---|---|---|---|---|---|---|
| `/` | Yes | Understand and try the core product | AI brand voice editor | Make AI writing sound like you | Live editor; How it works; Your Voice Profile; Email and LinkedIn; Privacy; FAQ | Rewrite a draft | SoftwareApplication, FAQPage |
| `/ai-humanizer` | Yes | Humanize a draft with a real tool | ai humanizer | An AI humanizer that writes like you | Live tool; What it changes; What it preserves; Personal voice; FAQ | Humanize my draft | SoftwareApplication, FAQPage |
| `/email-rewriter` | Yes | Rewrite a business email | email rewriter | Rewrite emails to sound clear, natural, and like you | Email tool; Client and prospect emails; Meaning preservation; Examples; FAQ | Rewrite my email | SoftwareApplication, FAQPage |
| `/linkedin-post-rewriter` | Yes | Rewrite a LinkedIn post | LinkedIn post rewriter | Rewrite LinkedIn posts without losing your voice | Post tool; Stronger openings; Personal voice; Examples; FAQ | Rewrite my post | SoftwareApplication, FAQPage |
| `/pricing` | Yes | Compare access and upgrade | AI writing assistant pricing | Simple pricing for writing that sounds like you | Plan comparison; Usage; Billing FAQ | Start free / Upgrade | Product, FAQPage |
| `/privacy` | Yes | Understand data handling | none | Privacy Policy | Data collected; AI providers; Retention; Rights; Contact | none | WebPage |
| `/terms` | Yes | Review product terms | none | Terms of Service | Account; Acceptable use; Billing; Disclaimers; Termination | none | WebPage |
| `/login` | No | Authenticate | none | Welcome back | Login form; Support | Continue | none |
| `/signup` | No | Create account | none | Save your personal voice | Signup form; Privacy note | Create account | none |

Every indexable tool route must provide a functional, context-specific tool and genuinely distinct guidance. Thin doorway pages that only swap headings are not acceptable.

### 11.2 Application routes

| Route | Index | Purpose | Required states |
|---|---|---|---|
| `/app` | No | Main personalized rewrite workspace | empty, editing, generating, success, warning, quota, error |
| `/app/voice` | No | Create and edit Voice Profile | empty, collecting samples, analyzing, review, saved, error |
| `/app/account` | No | Account, billing, privacy controls | active, cancelling, cancelled, deletion confirmation |
| `/checkout/success` | No | Confirm entitlement and return to work | verifying, success, delayed webhook, error |

### 11.3 API routes

| Method and route | Purpose | Authentication |
|---|---|---|
| `POST /api/rewrite` | Validate quota and create rewrite | Optional for configured anonymous attempt; required afterward |
| `POST /api/voice/analyze` | Create structured profile from samples | Required |
| `GET /api/voice` | Read active profile | Required |
| `PUT /api/voice` | Edit active profile | Required |
| `DELETE /api/voice` | Delete profile and samples | Required |
| `POST /api/feedback` | Save structured rewrite feedback | Optional/required according to rewrite ownership |
| `GET /api/usage` | Return current entitlement and usage | Required |
| `POST /api/checkout` | Create hosted checkout | Required |
| `POST /api/billing/webhook` | Synchronize billing state | Signed provider webhook |
| `DELETE /api/account` | Start verified account deletion | Required plus recent-auth check |

## 12. Page and Interaction Requirements

### 12.1 Tool layout

- Desktop: stable two-pane source/result workspace after generation.
- Mobile: stacked editor and result with persistent, non-overlapping actions.
- Before generation, the input remains the dominant surface.
- After generation, the result receives focus without causing layout shift.
- Controls use icons where familiar and have accessible labels/tooltips.
- Loading, retry, quota, risk warning, and empty states must have fixed space so the editor does not jump.

### 12.2 Required states

- Empty input
- Input ready
- Validation error
- Generating
- Generation success
- Preservation warning
- Provider timeout
- Rate limited
- Quota exhausted
- Signed-out continuation
- Offline/network error
- Voice profile missing or low confidence

### 12.3 Accessibility

- Target WCAG 2.2 AA for MVP.
- Full keyboard access for editor, mode switch, adjustments, diff, copy, and dialogs.
- Status changes announced with appropriate live regions.
- Diff cannot rely on color alone.
- Focus returns predictably after generation, errors, and modal closure.

## 13. Visual Style Brief

The product should feel like a focused professional writing workspace, not an AI novelty tool or a marketing landing-page template.

- Audience signal: credible enough for a consultant to use with client communication.
- Layout: quiet, dense, editor-first, with clear hierarchy and restrained navigation.
- Typography: highly readable body text and compact interface labels; no oversized dashboard headings.
- Color: neutral working surface with one restrained action color and distinct warning/success colors.
- Components: one main editor, segmented mode control, icon actions, compact settings, and non-decorative dialogs.
- Avoid: purple/blue gradient dominance, decorative blobs, nested cards, stock AI imagery, robot motifs, excessive rounded pills, and feature-explanation text inside the application.
- Proof assets: real before/after writing examples and an understandable Voice Profile preview.

## 14. SEO and Copy Freeze Inputs

### 14.1 Search intent

- `ai humanizer`: mixed intent; acquisition only, with explicit professional-writing framing.
- `email rewriter`: task-oriented intent; must open directly into Email mode.
- `linkedin post rewriter`: task-oriented intent; must open directly into LinkedIn mode.
- `AI brand voice editor/generator`: lower-volume positioning hypothesis; data pending.

### 14.2 Frozen messages

- Product promise: `Make AI writing sound like you.`
- Primary CTA: `Rewrite a draft`
- Personalized CTA: `Rewrite in my voice`
- Value proof: saved personal voice, preserved meaning, no repeated prompt construction.

### 14.3 Prohibited claims

- `undetectable`
- `100% human`
- `bypass AI detectors`
- `guaranteed to sound human`
- guaranteed improvement in response, reach, engagement, or revenue
- statements that user data is never retained or never used by an AI provider unless technically and contractually verified

## 15. Analytics Contract

| Event | Trigger | Allowed properties |
|---|---|---|
| `tool_viewed` | Tool becomes usable | route, mode, referrer_group |
| `rewrite_submitted` | Valid rewrite request starts | mode, auth_state, profile_state, char_bucket |
| `rewrite_succeeded` | Structured response passes validation | mode, latency_bucket, warning_state |
| `rewrite_failed` | Request fails | mode, error_code, provider_stage |
| `output_copied` | User copies result | mode, personalized, warning_state |
| `adjustment_used` | User selects adjustment | adjustment, mode |
| `voice_profile_started` | First sample step begins | source_route |
| `voice_profile_completed` | Profile is saved | sample_count_bucket, confidence |
| `feedback_submitted` | Rating is saved | rating, reason_code |
| `signup_completed` | Account is created | source_route |
| `paywall_viewed` | Entitlement prompt shown | trigger, plan_key |
| `checkout_started` | Hosted checkout created | plan_key |
| `subscription_activated` | Verified provider event received | plan_key |
| `account_deletion_requested` | Verified deletion begins | none |

Analytics must never contain raw drafts, output text, voice samples, freeform context, or freeform feedback.

## 16. Non-Functional Requirements

### Performance

- Public tool shell should become interactive within a reasonable Core Web Vitals target on modern mobile networks.
- Rewrite target: p50 under 10 seconds and p95 under 20 seconds, subject to provider benchmark.
- The UI must show progress immediately and allow safe cancellation or retry.

### Reliability

- All generation and billing requests use request IDs and idempotency controls.
- Model/provider failures do not consume a paid credit unless a valid result was delivered.
- Structured model output is schema-validated before presentation.

### Security and privacy

- Encrypt data in transit and use provider-supported encryption at rest.
- Apply per-subject and per-IP rate limits to expensive endpoints.
- Verify billing webhook signatures.
- Require recent authentication for destructive account actions.
- Redact user content from operational logs and error reporting.
- Complete a provider data-retention and subprocessors review before launch.

### Compatibility

- Support current major versions of Chrome, Safari, Firefox, and Edge.
- Support responsive layouts from 360px mobile width upward.

## 17. Validation Plan and Decision Gates

### 17.1 Pilot cohort

Recruit 15 qualified users matching the primary ICP. General friends, students, and users seeking detector bypass do not count toward the cohort.

### 17.2 Core metrics

- Activation: a new visitor successfully generates and copies a rewrite.
- Voice activation: a registered user saves a Voice Profile and completes a personalized rewrite.
- Aha event: a user completes at least two personalized rewrites in separate sessions within seven days.
- Retention: the user returns and completes a rewrite within seven days.
- Monetization: a verified subscription payment is received.
- Trust failure: user reports that meaning, a protected token, or a commitment changed incorrectly.

### 17.3 MVP validation gate

Proceed to browser-extension development only when the pilot produces all of the following:

- at least 10 qualified users complete the first rewrite;
- at least 6 qualified users choose the personalized result over their normal general-AI workflow in a direct comparison;
- at least 5 qualified users return for another real task within seven days;
- at least 3 qualified users make a real subscription payment;
- no unresolved critical privacy, billing, or silent meaning-change defect remains.

These are product decision thresholds, not market benchmarks.

### 17.4 Stop or reposition signals

- Users like the demo but do not return with real work.
- Most acquisition traffic seeks detector bypass or academic use.
- Users consistently prefer a saved prompt in ChatGPT.
- Personalization does not improve preference over the default rewrite.
- Model and acquisition costs cannot support a plausible subscription after quotas are calibrated.

## 18. Release Plan

### Milestone 1: Core proof

- Public editor
- Email and LinkedIn rewrite modes
- Structured output and preservation warnings
- Copy, diff, adjustment, and feedback controls
- Basic analytics without raw content

### Milestone 2: Persistent differentiation

- Authentication
- Voice Profile analysis, review, save, and deletion
- Personalized rewrite
- Usage ledger and server-side quota

### Milestone 3: Revenue validation

- Pricing page with calibrated plans
- Hosted checkout and billing webhook
- Entitlement management
- Account and data deletion
- Three context-specific SEO tool pages

Do not start browser-extension work before the validation gate is met.

## 19. P0 User Acceptance Tests

### UAT-01 Anonymous email rewrite

Given a first-time visitor with a valid email draft, when the user selects Email and rewrites it, then the system returns one usable result, preserves protected tokens, displays relevant warnings, and lets the user copy without signing up.

### UAT-02 LinkedIn-specific rewrite

Given a LinkedIn draft with a clear opinion, when the user rewrites it, then the result improves structure without inventing a personal anecdote, claim, or engagement promise.

### UAT-03 Voice Profile

Given an authenticated user with one or more writing samples, when analysis completes, then the user can understand, edit, save, apply, and delete the derived profile.

### UAT-04 Personalized preference

Given the same draft and a saved Voice Profile, when default and personalized variants are compared during pilot testing, then the test records which output the user prefers and why.

### UAT-05 Meaning risk

Given a rewrite that changes a name, number, date, URL, quotation, or detectable commitment, when validation runs, then the system corrects it or blocks normal success presentation with a visible review warning.

### UAT-06 Quota and payment

Given a user at the free limit, when checkout succeeds and the signed webhook is processed, then paid entitlement becomes available exactly once and the user's current draft remains recoverable.

### UAT-07 Failure recovery

Given a provider timeout or invalid structured response, when generation fails, then no paid credit is consumed, the source draft remains intact, and the user can retry safely.

### UAT-08 Privacy deletion

Given an authenticated user, when the user requests deletion and passes recent-auth verification, then the product clearly reports the deletion state and removes or schedules removal of all covered records according to the published retention policy.

## 20. Risks

### P0

- Silent changes to meaning, commitments, or protected facts.
- Sensitive business writing exposed through analytics, logging, or an unsuitable model-provider retention policy.
- Payment entitlement errors or double credit consumption.

### P1

- Personalization is not meaningfully better than a general AI chat.
- `AI humanizer` traffic is dominated by low-value detector-bypass intent.
- Abuse of anonymous generation creates unsustainable model cost.
- Email and LinkedIn modes become two shallow experiences rather than one coherent voice product.

### P2

- Users expect browser extensions before willingness to pay is proven.
- Generated writing converges toward a new generic house style.
- SEO pages compete with each other or become thin doorway pages.

## 21. Open Decisions for Owner Review

The following decisions must be confirmed before copy, pricing, or implementation is frozen:

1. Is the primary ICP specifically independent consultants/small agency owners, or should founders be primary?
2. Should Email or LinkedIn be the default first experience on `/`?
3. What product name and domain will be used?
4. Which model provider and fallback provider satisfy quality, latency, cost, and retention requirements?
5. Should raw rewrite content be stored at all, and for how long?
6. What free quota and subscription price remain profitable after real model benchmarks?
7. Which payment provider and supported billing countries are required?
8. Is account deletion immediate or queued with a documented recovery window?

## 22. Downstream Handoff

### Current conclusion

- Status: NEEDS_REVIEW
- One-line conclusion: Build an editor-first web MVP that validates persistent personal voice and paid repeat use before investing in extensions or integrations.

### Inputs

- Upstream stage: Keyword research and MVP definition
- Key materials: `ai humanizer` opportunity discussion, Western-market objective, selected personal-voice positioning
- Pending evidence: current SERP analysis, competitor matrix, model benchmark, pricing and user interviews

### Deliverables

- This PRD v1
- MVP and NOT-DO scope
- Page matrix and Route Contract
- AI request/response contract
- Data and analytics contracts
- Visual style brief
- UAT and validation gates

### Quality-gate self-check

- Pass: primary ICP selected from three evaluated segments.
- Pass: product positioning and competitive minimum are explicit.
- Pass: indexable routes have distinct user tasks, H1, CTA, and schema.
- Pass: P0 capabilities, non-goals, data entities, APIs, states, analytics, and acceptance tests are defined.
- Pass: production payment, external publishing, and real-user data decisions retain owner review gates.
- Not passed: SERP and competitor evidence is incomplete.
- Not passed: pricing, provider economics, and retention policy are not frozen.

### Downstream constraints

- Next stages: pricing calibration, compliance, copy freeze, visual design, data contract implementation, frontend/backend implementation.
- Must read: Sections 4-21 of this PRD.
- Must not change without owner review: primary ICP, core promise, prohibition on detector-bypass positioning, P0 preservation requirements, privacy rules, and validation gate.
- Suggested next action: resolve the eight owner decisions, then run pricing and compliance in parallel before copy/design freeze.

[NEEDS_REVIEW]
