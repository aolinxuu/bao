# Bao landing page — handoff (updated Oct 20, 2026)

Bao is a WhatsApp restaurant picker for San Francisco. This repo is its pre-launch waitlist page.
Audience: tech workers, remote workers, and VCs/investors overwhelmed by TikTok/Instagram food content. Keep dating out of the copy (planned for v2).

## Where things live
- **Live site:** https://aolinxuu.github.io/bao/ (GitHub Pages from `main` root, ~60s to deploy after push).
- **Code:** `index.html` is the whole page (a `<style>` block, no JS). Floating dish cutouts are in `img/dishes/<dish>.webp` (16 files; the older `img/dish-1..3.webp` are unused).
- **Design source of truth:** Design canvas "Bao landing page" — https://claude.ai/artifact/KESaMLiFukqjvWwEXQynWL
  - `Floating.dc.html` — Desktop, floating dishes (matches live)
  - `Phone-floating.dc.html` — Phone, floating dishes (matches live at ≤600px)
  - The `Handdrawn-v2*` and `Phone-v2*` boards are the previous live design.
  - The user edits the canvas by hand: always re-read `project/canvas.json` and the artboard before publishing. Change canvas and `index.html` together.
  - Dish positions in `index.html` are CSS variables per image: `--l/--t/--w` (desktop, % of viewport) and `--ml/--mt/--mw` (phone). Images without phone values carry class `dsk` and hide on phone.

## Current design (Oct 20, 2026, Corner-style)
- One screen, no scroll, on desktop (1280×800, 1440×900) and phone (390×844; short phones scroll a little).
- Centered: big black "bao" wordmark in Shantell Sans 800 (static, no shadow), line "Skip the scroll. Bao picks where to eat in SF, and what to order.", black pill "Get on the list", link "Have a code?". Nav also has a "Get on the list" pill on desktop.
- Around it: 16 dish cutouts (12 on phone) floating gently, off for reduced motion. None may overlap the text.
- Invite-only framing: no "5 invites" copy on the page; invites get explained after signup.
- Colors are CSS variables on `:root` with a dark override; SVGs use `currentColor`.
- User preference: simpler and fewer words every round; apply requests directly; lead with the answer, short, bullets.

## Open items
1. "Get on the list" and "Have a code?" link to `#` — needs a Tally/Google Form, wa.me link, or form service.
2. 中文/EN toggle is inert (or drop it — audience is now US tech workers).
3. Placeholder: `[CONTACT EMAIL]` in the footer (Privacy/Terms/SMS terms pages exist).
4. No custom domain yet (repo Settings › Pages, then DNS).
5. Strategy: WhatsApp vs iMessage/SMS for a US audience.

## Deploy notes
- In a cloud session: `add_repo aolinxuu/bao` with push access, commit, `git push origin main`.
- The container `gh` token is invalid; do GitHub settings through the user's Chrome.
