# VoiceDraft Design Handoff v0.1

Status: NEEDS_REVIEW. This is an implementation-ready design specification produced without Stitch/Figma credentials. Visual QA screenshots are required before it can be promoted to Design DONE.

## Visual Style Rationale

### Direction A: Editorial proof desk - selected

- Paper-white base, ink typography, coral action, teal preservation indicators, yellow annotations.
- A restrained serif display face paired with a practical system sans.
- The editor and visible revision marks are the visual identity.
- Fit: users are consultants and agency owners; the product should feel like careful professional editing, not AI spectacle.
- SERP distinction: avoids the common purple gradient, centered slogan, floating mockup, and three feature cards used by generic AI writing tools.

### Direction B: Precision document utility

- Bright white, grayscale controls, dense two-pane editor, blue system accent.
- Fit: fast and credible, but visually close to established grammar products and office software.
- Decision: rejected because it weakens the personal-voice positioning.

### Direction C: Creator publishing desk

- High-contrast black, warm yellow blocks, large social-preview typography.
- Fit: distinctive for LinkedIn creators, but too campaign-like for sensitive client email work.
- Decision: rejected because Email is an equal core mode.

## Selected design system

### Color tokens

```css
--paper: #f6f4ee;
--surface: #fffefa;
--ink: #191b1f;
--muted: #686963;
--line: #d8d4ca;
--line-strong: #a9a59b;
--coral: #d94f30;
--coral-dark: #ad321b;
--teal: #14766f;
--teal-soft: #dff1ed;
--yellow: #f4c95d;
--yellow-soft: #fff4cf;
--danger: #a43b32;
```

The palette deliberately spans warm, green, yellow, and neutral families so the site does not read as a one-hue AI product.

### Typography

- Display: `Iowan Old Style`, `Palatino Linotype`, `Book Antiqua`, `Georgia`, serif.
- Interface/body: `Aptos`, `Segoe UI`, `Helvetica Neue`, sans-serif.
- Body: 16px desktop, 15px compact surfaces.
- UI headings: 18-24px.
- Page H1: 44px desktop, 34px mobile. Never viewport-scaled.
- Letter spacing: 0.

### Shape and spacing

- Radius: 4px controls, 6px framed tools/dialogs, 0px section bands.
- Shadows: none by default; one subtle focus elevation for menus/dialogs only.
- Space scale: 4, 8, 12, 16, 24, 32, 48, 72px.
- Content max width: 1180px.
- Reading max width: 720px.

## Desktop first viewport: 1440 x 900

1. A 64px header with wordmark left, three task links, and `Voice Profile` action right.
2. An intro band with category H1 and two-line supporting copy. Keep it compact so the editor and a hint of the next section remain visible.
3. The primary tool spans the content width and is a genuine framed workspace, not a decorative card.
4. Tool header contains a segmented Email/LinkedIn control, profile state, and one context toggle.
5. Editor body uses two equal tracks. Source has textarea and count; result has semantic empty/loading/success/warning states.
6. Footer actions stay fixed within the tool footprint so generation never shifts the page.

## Mobile first viewport: 390 x 844

1. Compact wordmark and menu icon.
2. H1 and subhead use no more than five short lines combined.
3. The segmented mode control sits above the source editor.
4. Source and result stack; on success, focus moves to result and `Copy` remains reachable.
5. Actions wrap into two stable rows; no horizontal scrolling.
6. The next content band is visibly hinted below the main tool.

## Public page structure

- Header
- Compact category intro
- Live task-specific editor
- Short proof strip: `Your voice / Your details / Your intent`
- Full-width explanatory band with real before/after example
- Scenario section with lightweight columns separated by rules, not cards
- Visible FAQ
- Final task CTA
- Footer with legal and product routes

## Application states

| State | Treatment |
|---|---|
| Empty | Quiet ruled-paper motif, one sentence, no illustration placeholder |
| Loading | Stable result height, three animated text rules, cancel unavailable in v0 |
| Success | Result text, change tags, Copy and quick-adjust actions |
| Preservation warning | Yellow rule and review list above result; never color-only |
| Error | Inline red rule with cause and retry; source remains intact |
| Quota | Replace primary action with honest beta/upgrade message; pricing is configurable |
| Profile absent | Text link `Add your voice`; rewriting still works |
| Profile ready | Teal status with profile summary, not a celebratory badge |

## Interaction notes

- Mode is a segmented control and updates copy/context fields without navigation.
- Route-specific pages preselect their mode.
- Quick adjustments are commands with icons and text: Shorter, More direct, More conversational.
- Copy uses a familiar icon plus accessible text on desktop; compact icon remains labeled for assistive technology on mobile.
- Inline diff uses underline/strike plus text labels, never color alone.
- FAQ uses native disclosure behavior.
- Mobile menu closes on navigation and Escape.

## Asset inventory

- Text-labeled controls in the local build. Lucide icons are deferred because the dependency download was unavailable in the build environment.
- The product editor itself is the primary visual evidence.
- No stock AI images, robot art, gradients, generated avatars, or unknown third-party assets.
- Before/after copy examples are authored product content, not customer data.

## Frontend implementation constraints

- Use the CSS tokens above verbatim unless visual QA identifies a contrast issue.
- Do not replace the editor-first intro with a marketing hero.
- Do not turn explanatory bands into floating cards.
- Preserve every route-specific H1, FAQ, legal link, and state.
- HTML must remain meaningful without JavaScript; the rewrite action requires JavaScript.
- Desktop and mobile screenshots must be captured after implementation.

## Design acceptance

- Token contract: ready.
- Desktop/mobile layout: specified.
- Empty/loading/success/warning/error/profile states: specified.
- Copy placement: specified.
- Asset sources: specified.
- Stitch/Figma source: missing.
- Rendered screenshot QA: pending.

[NEEDS_REVIEW]
