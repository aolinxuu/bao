# Bao landing page — handoff (updated Oct 15, 2026)

Bao is a WhatsApp restaurant picker for San Francisco. This repo is its pre-launch waitlist page.
Audience: tech workers, remote workers, and VCs/investors overwhelmed by TikTok/Instagram food content. Keep dating out of the copy (planned for v2).

## Where things live
- **Live site:** https://aolinxuu.github.io/bao/ (GitHub Pages from `main` root, ~60s to deploy after push).
- **Code:** `index.html` is the whole page (inline styles + a `<style>` block, no JS). Food cutouts are in `img/dish-1.webp` (burrito bowl), `dish-2.webp` (chicken sandwich), `dish-3.webp` (harvest bowl).
- **Design source of truth:** Design canvas "Bao landing page" — https://claude.ai/artifact/KESaMLiFukqjvWwEXQynWL
  - `Handdrawn-v2.dc.html` — Desktop, layout v2 (matches live)
  - `Phone-v2.dc.html` — Phone, layout v2 (matches live at ≤600px)
  - `Handdrawn-v2-dark.dc.html`, `Phone-v2-dark.dc.html` — dark mode (matches live `prefers-color-scheme: dark`)
  - `Main.dc.html`, `Phone.dc.html` are older directions.
  - The user edits the canvas by hand: always re-read `project/canvas.json` and the artboard before publishing. Change canvas and `index.html` together.

## Current design
- One screen, no scroll, on desktop (1280×800, 1440×900) and phone (390×844).
- Left: hand-drawn Shantell Sans headline "Skip the scroll. / Bao picks / where to eat." (last line circled), subline "Text Bao on WhatsApp. Get picks you trust in SF, and exactly what to order.", black pill "Get early access".
- Right (below on phone): three floating food cutouts with a gentle bob animation (off for reduced motion).
- Colors are CSS variables on `:root` with a dark override; SVGs use `currentColor`.
- Removed over time: chat card + occasion chips, "free while we test in SF", how-it-works, collage, checklist, 中文 bubble.
- User preference: simpler and fewer words every round; apply requests directly; lead with the answer, short, bullets.

## Open items
1. "Get early access" links to `#` — needs a Tally/Google Form, wa.me link, or form service.
2. 中文/EN toggle is inert (or drop it — audience is now US tech workers).
3. Placeholders: `hello@[domain]`, Privacy/Terms → `#`.
4. No custom domain yet (repo Settings › Pages, then DNS).
5. Strategy: WhatsApp vs iMessage/SMS for a US audience.

## Deploy notes
- In a cloud session: `add_repo aolinxuu/bao` with push access, commit, `git push origin main`.
- The container `gh` token is invalid; do GitHub settings through the user's Chrome.
